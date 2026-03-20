import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WaGeolocationService } from '@ng-web-apis/geolocation';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { AsignardeliveryService } from 'src/app/services/asignardelivery.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as L from 'leaflet';
import { Driver } from 'src/app/models/driverp.model';
import { DriverpService } from 'src/app/services/driverp.service';
import { Tienda } from 'src/app/models/tienda.model';

@Component({
  selector: 'app-mapa',
  standalone:false,
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  providers: [WaGeolocationService],
})
export class MapaComponent implements OnInit, AfterViewInit, OnDestroy  {

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private readonly geolocation$ = inject(WaGeolocationService);
  private map: L.Map | null = null;
  private driverMarker: L.Marker | null = null;
  private deliveryMarker: L.Marker | null = null;
  private routeLine: L.Polyline | null = null;
  private locationSubscription: Subscription | null = null;
  private asignacionSubscription: Subscription | null = null;
  private refreshInterval: any = null;

  // Estado para mostrar coordenadas
  driverPosition: { lat: number; lng: number } | null = null;
  deliveryPosition: { lat: number; lng: number } | null = null;
  loading = true;
  errorMessage = '';

  identity!: Usuario;
  asignacion!: any;
  asignacionId!: any;
  user!: any;
  driver!: any;
drivers: Driver[] = [];
  tienda: Tienda | null = null;
  // Multi-driver admin support
  allDrivers: Driver[] = [];
  allAsignaciones: any[] = [];
  driverMarkers = new Map<any, L.Marker>();
  deliveryMarkers = new Map<any, L.Marker>();
  private adminRefreshInterval: any = null;
  showDriversList = false;
  activeDriverCount = 0;

  
  constructor(

    private usuarioService :UsuarioService,
    private asignacionService :AsignardeliveryService,
    private activatedRoute :ActivatedRoute,
    private cdr :ChangeDetectorRef,
    private driverService: DriverpService,
    
  ){

  }

  // Configuración de iconos personalizados
  private driverIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  private deliveryIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // ADMIN multi-driver green icon
  private adminDriverIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Public parsePosition for HTML template
  public parsePosition(positionStr: string | null | undefined): { lat: number; lng: number } | null {
    if (!positionStr) return null;
    
    const parts = positionStr.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return null;
  }

  ngOnInit() {

    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER || '{}');

    this.loadAsignacion();

    // SUPERADMIN: Load all drivers + periodic refresh instead of GPS
    if (this.user.role === 'SUPERADMIN') {
      this.loadAllDriversAsignaciones();
      // this.startAdminRefresh();
    } else {
      // ADMIN: Existing by storage
      if (this.user.role == 'ADMIN') {
        this.getDriversLocal(); // Still load local drivers
      }
    }
    
    // Suscripción continua a la ubicación (only non-ADMIN)
    if (this.user.role !== 'ADMIN' && this.user.role !== 'SUPERADMIN') {
      this.locationSubscription = this.geolocation$.subscribe({
        next: (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Use setTimeout to defer the update and avoid expression changed error
        setTimeout(() => {
          // CHOFER: Only update own position (driverPosition) with GPS
          // deliveryPosition should come from asignacion (the destination)
          if (this.user.role == 'ADMIN') {
            this.driverPosition = { lat, lng };
            this.updateDriverPosition(lat, lng);
            console.log('Posición driverPosition (ADMIN):', this.driverPosition);
            
            // Also update the asignacion with new driver position
            this.updateAsignacionWithPosition();
          }
          
          // USER: Don't update any position from GPS
          // All positions (driverPosition and deliveryPosition) should come from asignacion
          // deliveryPosition is the DESTINATION (from asignacion), not USER's GPS
          
          this.loading = false;
          this.errorMessage = '';

          // Actualizar mapa si ya está inicializado
          if (this.map) {
            this.updateMap();
          }
          
          this.cdr.markForCheck();
        });
      },
      error: (error) => {
        console.error('Error de geolocalización:', error);
        
        setTimeout(() => {
          this.loading = false;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.errorMessage = 'Permiso de geolocalización denegado';
              break;
            case error.POSITION_UNAVAILABLE:
              this.errorMessage = 'Ubicación no disponible';
              break;
            case error.TIMEOUT:
              this.errorMessage = 'Tiempo de espera agotado';
              break;
            default:
              this.errorMessage = 'Error desconocido';
          }
          // Usar ubicación por defecto para demo (Venezuela)
          // this.driverPosition = { lat: 10.4806, lng: -66.9036 }; // Caracas, Venezuela
          if (this.map) {
            this.updateMap();
          }
          this.cdr.markForCheck();
        });
      }
    });

    this.loadIdentity();
  }
  }


  getDriversLocal() {
    this.driverService.getByLocalId(this.user.local).subscribe((resp: any) => {
      this.drivers = Array.isArray(resp) ? resp : [];
      if (resp.tienda) {
        this.tienda = resp.tienda;
      }
    })
  }

  getDrivers() {
    this.driverService.gets().subscribe((resp: any) => {
      this.drivers = Array.isArray(resp) ? resp : [];
    })
  }

  // ADMIN: Load all drivers and asignaciones
  loadAllDriversAsignaciones() {
    const localId = this.user.local;
    this.asignacionService.getByTiendaId(localId).subscribe((asigs: any) => {
      this.allAsignaciones = Array.isArray(asigs) ? asigs : [];
    });

    if (this.user.role === 'SUPERADMIN') {
      this.driverService.gets().subscribe((resp: any) => {
        this.allDrivers = Array.isArray(resp) ? resp : [];
        this.updateActiveCount();
      });
    } else {
      this.driverService.getByLocalId(localId).subscribe((resp: any) => {
        this.allDrivers = Array.isArray(resp) ? resp : [];
        this.tienda = resp.tienda || null;
        this.updateActiveCount();
      });
    }
  }

  private updateActiveCount() {
    this.activeDriverCount = this.allDrivers.filter(d => 
      d.status === 'active' || d.status === 'disponible'
    ).length;
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
    if (this.asignacionSubscription) {
      this.asignacionSubscription.unsubscribe();
    }
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.adminRefreshInterval) {
      clearInterval(this.adminRefreshInterval);
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  /**
   * Helper method to parse position strings from "lat,lng" format
   */
  // private parsePosition(positionStr: string | null | undefined): { lat: number; lng: number } | null {
  //   if (!positionStr) return null;
    
  //   const parts = positionStr.split(',');
  //   if (parts.length === 2) {
  //     const lat = parseFloat(parts[0].trim());
  //     const lng = parseFloat(parts[1].trim());
  //     if (!isNaN(lat) && !isNaN(lng)) {
  //       return { lat, lng };
  //     }
  //   }
  //   return null;
  // }

  /**
   * Load asignacion data and set positions based on user role
   */
  private loadAsignacion(): void {
    if (!this.asignacionId) return;

    this.asignacionSubscription = this.asignacionService.getById(this.asignacionId).subscribe({
      next: (resp: any) => {
        if (resp.ok && resp.asignacion) {
          // Use setTimeout to defer the update and avoid expression changed error
          setTimeout(() => {
            this.asignacion = resp.asignacion;
            console.log(this.asignacion);

            const parsedDriverPos = this.parsePosition(this.asignacion.driverPosition);
            const parsedDeliveryPos = this.parsePosition(this.asignacion.deliveryPosition);

            if (this.user.role == 'CHOFER') {
              // CHOFER: deliveryPosition from asignacion, driverPosition from GPS
              if (parsedDriverPos) {
                this.driverPosition = parsedDriverPos;
                console.log('Posición repartidor (from asignacion):', this.driverPosition);
              }
              if (parsedDeliveryPos) {
                this.deliveryPosition = parsedDeliveryPos;
                console.log('Posición entrega (from asignacion):', this.deliveryPosition);
              }
              // driverPosition will be set by geolocation subscription
            }
            
            if (this.user.role == 'USER') {
              // USER: Both positions from asignacion
              if (parsedDriverPos) {
                this.driverPosition = parsedDriverPos;
                console.log('Posición repartidor (from asignacion):', this.driverPosition);
              }
              if (parsedDeliveryPos) {
                this.deliveryPosition = parsedDeliveryPos;
                console.log('Posición entrega (from asignacion):', this.deliveryPosition);
              }
              
              // Refresh asignacion periodically to get updated driver position
              this.startRefreshAsignacion();
            }

            this.loading = false;
            if (this.map) {
              this.updateMap();
            }
            this.cdr.markForCheck();
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar asignacion:', error);
        setTimeout(() => {
          this.loading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  /**
   * Start periodic refresh of asignacion for USER role
   * to see driver's updated location
   */
  private startRefreshAsignacion(): void {
    // Refresh every 10 seconds
    this.refreshInterval = setInterval(() => {
      if (this.user.role == 'USER' && this.asignacionId) {
        this.asignacionService.getById(this.asignacionId).subscribe({
          next: (resp: any) => {
            if (resp.ok && resp.asignacion) {
              const parsedDriverPos = this.parsePosition(resp.asignacion.driverPosition);
              if (parsedDriverPos) {
                // Only update if position changed
                if (!this.driverPosition || 
                    parsedDriverPos.lat !== this.driverPosition.lat || 
                    parsedDriverPos.lng !== this.driverPosition.lng) {
                  setTimeout(() => {
                    this.driverPosition = parsedDriverPos;
                    console.log('Posición repartidor actualizada:', this.driverPosition);
                    if (this.map) {
                      this.updateMap();
                    }
                    this.cdr.markForCheck();
                  });
                }
              }
            }
          }
        });
      }
    }, 10000);
  }

  /**
   * Update asignacion with current driver position
   */
  private updateAsignacionWithPosition(): void {
    if (!this.asignacionId || !this.driverPosition ) return;

    
    // Update silently without showing alert
    this.updateAsignacion();
  }

  private initMap(): void {
    let centerLat = 10.4806;
    let centerLng = -66.9036;

    if ((this.user.role === 'ADMIN' || this.user.role === 'SUPERADMIN') && this.allDrivers.length > 0) {
      const positions = this.allDrivers
        .map(d => this.parsePosition(d.asignaciones?.driverPosition))
        .filter((p): p is {lat: number, lng: number} => p !== null);

      if (positions.length > 0) {
        centerLat = positions[0].lat;
        centerLng = positions[0].lng;
      }
    } else if (this.driverPosition) {
      centerLat = this.driverPosition.lat;
      centerLng = this.driverPosition.lng;
    } else {
      const driverPosStr = (this.asignacion as any)?.driverPosition;
      const parsed = this.parsePosition(driverPosStr);
      this.driverPosition = parsed ?? { lat: centerLat, lng: centerLng };
    }

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [centerLat, centerLng],
      zoom: this.user.role === 'ADMIN' || this.user.role === 'SUPERADMIN' ? 12 : 15, // Wider zoom for admin
      zoomControl: true
    });

    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Actualizar marcadores y ruta
    this.updateMap();
  }

  private updateMap(): void {
    // Branch: Admin multi vs single user
    if (this.user.role === 'ADMIN' || this.user.role === 'SUPERADMIN') {
      this.updateAllMarkers();
    } else {
      this.updateSingleMap();
    }
  }

  private updateSingleMap(): void {
    if (!this.map || !this.driverPosition) return;

    if (this.driverMarker) {
      this.driverMarker.setLatLng([this.driverPosition.lat, this.driverPosition.lng]);
    } else {
      this.driverMarker = L.marker([this.driverPosition.lat, this.driverPosition.lng], { icon: this.driverIcon })
        .addTo(this.map!)
        .bindPopup('<b>Tu ubicación</b><br>Repartidor');
    }

    if (this.deliveryPosition) {
      if (this.deliveryMarker) {
        this.deliveryMarker.setLatLng([this.deliveryPosition.lat, this.deliveryPosition.lng]);
      } else {
        this.deliveryMarker = L.marker([this.deliveryPosition.lat, this.deliveryPosition.lng], { icon: this.deliveryIcon })
          .addTo(this.map!)
          .bindPopup('<b>Entrega</b><br>Destino');
      }

      if (this.routeLine) {
        this.routeLine.setLatLngs([
          [this.driverPosition.lat, this.driverPosition.lng],
          [this.deliveryPosition.lat, this.deliveryPosition.lng]
        ]);
      } else {
        this.routeLine = L.polyline([
          [this.driverPosition.lat, this.driverPosition.lng],
          [this.deliveryPosition.lat, this.deliveryPosition.lng]
        ], { color: 'blue', weight: 4, opacity: 0.7, dashArray: '10, 10' }).addTo(this.map!);
      }

      const bounds = L.latLngBounds([
        [this.driverPosition.lat, this.driverPosition.lng],
        [this.deliveryPosition.lat, this.deliveryPosition.lng]
      ]);
      this.map!.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private updateAllMarkers(): void {
    if (!this.map) return;

    this.driverMarkers.forEach(marker => this.map!.removeLayer(marker));
    this.deliveryMarkers.forEach(marker => this.map!.removeLayer(marker));
    this.driverMarkers.clear();
    this.deliveryMarkers.clear();

    const allBounds: L.LatLng[] = [];

    // Drivers
    this.allDrivers.forEach(driver => {
      const pos = this.parsePosition(driver.asignaciones?.driverPosition);
      if (pos) {
        const marker = L.marker([pos.lat, pos.lng], { icon: this.adminDriverIcon })
          .addTo(this.map!)
          .bindPopup(`<b>${driver.user.first_name || 'Driver'}</b><br>ID: ${driver._id || 'N/A'}<br>Status: ${driver.status}`);
        this.driverMarkers.set(driver._id!, marker);
        allBounds.push([pos.lat, pos.lng]);
      }
    });

    // Deliveries
    this.allAsignaciones.forEach((asig: any) => {
      const delPos = this.parsePosition(asig?.deliveryPosition);
      if (delPos) {
        const marker = L.marker([delPos.lat, delPos.lng], { icon: this.deliveryIcon })
          .addTo(this.map!)
          .bindPopup(`<b>Entrega</b><br>${asig.venta?.cliente || 'Cliente'}`);
        this.deliveryMarkers.set(asig._id!, marker);
        allBounds.push([delPos.lat, delPos.lng]);
      }
    });

    if (allBounds.length > 1) {
      const bounds = L.latLngBounds(allBounds);
      this.map!.fitBounds(bounds, { padding: [50, 50] });
    }
  }


  loadIdentity() {
    let USER = localStorage.getItem("user");
    if (USER) {
      let user = JSON.parse(USER);
      this.usuarioService.get_user(user.uid).subscribe((resp: any) => {
        this.identity = resp.usuario;
      })
    }
  }

  /**
   * Comparte las coordenadas usando la API nativa de Web Share
   * o copia al portapapeles como alternativa
   */
  async shareCoordinates(): Promise<void> {
    const shareData = this.buildShareData();

    // Verificar si la API de Web Share está disponible
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        console.log('Coordenadas compartidas exitosamente');
        //verificamos el rol del usuario para mostrar mensaje adecuado
        if (this.user.role == 'CHOFER') {
          alert('✅ Coordenadas del repartidor compartidas exitosamente');
        } else {
          alert('✅ Coordenadas de la entrega compartidas exitosamente');
        }


      } catch (error: any) {
        // El usuario canceló el compartir o hubo un error
        if (error.name !== 'AbortError') {
          console.error('Error al compartir:', error);
          this.copyToClipboard(shareData.text || '');
        }
      }
    } else {
      // Usar fallback: copiar al portapapeles
      this.copyToClipboard(shareData.text || '');
    }
  }

  /**
   * Construye el objeto de datos para compartir
   */
  private buildShareData(): ShareData {
    let title = '📍 Coordenadas de Entrega - MallConnect';
    let text = this.buildCoordinateText();

    // Crear URL con coordenadas para abrir en Google Maps
    let mapsUrl = '';
    if (this.driverPosition) {
      mapsUrl = `https://www.google.com/maps?q=${this.driverPosition.lat},${this.driverPosition.lng}`;
    }

    return {
      title: title,
      text: text,
      url: mapsUrl
    };
  }

  /**
   * Construye el texto con las coordenadas formateadas
   */
  private buildCoordinateText(): string {
    let text = '🛵 **Ruta de Entrega - MallConnect**\n\n';

    if (this.driverPosition) {
      text += `📍 **Repartidor:** ${this.driverPosition.lat.toFixed(6)}, ${this.driverPosition.lng.toFixed(6)}\n`;
      text += `[Ver en Google Maps](https://www.google.com/maps?q=${this.driverPosition.lat},${this.driverPosition.lng})\n\n`;
    }

    if (this.deliveryPosition) {
      text += `🏠 **Entrega:** ${this.deliveryPosition.lat.toFixed(6)}, ${this.deliveryPosition.lng.toFixed(6)}\n`;
      text += `[Ver en Google Maps](https://www.google.com/maps?q=${this.deliveryPosition.lat},${this.deliveryPosition.lng})`;
    }

    text += '\n\n📱 Compartido desde MallConnect Delivery';
    return text;
  }

  /**
   * Copia las coordenadas al portapapeles
   */
  private async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      alert('✅ Coordenadas copiadas al portapapeles\n\nPuedes pegarlas en WhatsApp, SMS o cualquier aplicación');
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
      alert('❌ No se pudieron copiar las coordenadas');
    }
  }

  updateDriverPosition(lat: number, lng: number): void {
    this.driverPosition = { lat, lng };
    this.updateMap();
  }

  updateDeliveryPosition(lat: number, lng: number): void {
    this.deliveryPosition = { lat, lng };
    this.updateMap();
  }

  updateAsignacion(): void {
    // CHOFER: Only update driverPosition (own GPS location)
    if(this.user.role == 'CHOFER' && this.driverPosition){
      const data = {
        _id: this.asignacionId,
        driverPosition: `${this.driverPosition.lat},${this.driverPosition.lng}`,
      };
      this.asignacionService.actualizarCoords(data).subscribe((resp: any) => {
        console.log('Asignación actualizada driverPosition:', this.driverPosition);
        this.asignacion = resp.asignacionActualizada;
      });
    }
    
    // USER: Don't update deliveryPosition from GPS
    // deliveryPosition should be set by the CLIENT when creating the order
    // and should NOT be changed by the USER's GPS
  }

}
