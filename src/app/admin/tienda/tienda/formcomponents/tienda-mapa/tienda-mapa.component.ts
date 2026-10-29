import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WaGeolocationService } from '@ng-web-apis/geolocation';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-tienda-mapa',
  standalone:false,
  templateUrl: './tienda-mapa.component.html',
  styleUrl: './tienda-mapa.component.css'
})
export class TiendaMapaComponent {

  // 📥 Recibimos el FormGroup principal desde el padre
  @Input() formParent!: FormGroup;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  public mapLoading = false;
  private locationSubscription: Subscription | null = null;

  constructor(private geolocation$: WaGeolocationService) {}

  ngOnInit(): void {
    // Inicializamos el mapa con un retraso corto para asegurar que el DOM esté listo
    setTimeout(() => {
      this.initMap();
    }, 300);
  }

  ngOnDestroy(): void {
    // 🧼 Buena práctica multi-tenant: Destruimos la suscripción al GPS para evitar fugas de memoria
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  private initMap(): void {
    // Tomamos coordenadas iniciales del formulario del padre o usamos Caracas por defecto
    const initLat = parseFloat(this.formParent.get('latitud')?.value) || 10.4880;
    const initLng = parseFloat(this.formParent.get('longitud')?.value) || -66.8580;

    this.map = L.map('mapElementId').setView([initLat, initLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Si ya existen coordenadas (modo edición), colocamos el marcador de inmediato
    if (this.formParent.get('latitud')?.value && this.formParent.get('longitud')?.value) {
      this.actualizarMarcadorEnMapa(initLat, initLng);
    }

    // Permitir al usuario hacer clic en cualquier parte del mapa para mover la ubicación
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.placeMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  public useCurrentLocation(): void {
    this.mapLoading = true;
    this.locationSubscription = this.geolocation$.subscribe({
      next: (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.placeMarker(lat, lng);
        this.mapLoading = false;
      },
      error: () => {
        this.mapLoading = false;
        console.warn('Error al acceder al GPS. Asegúrate de usar HTTPS y dar permisos.');
      }
    });
  }

  public placeMarker(lat: number, lng: number): void {
    // Actualizamos los campos reactivos del padre de forma directa
    this.formParent.patchValue({ latitud: lat, longitud: lng });

    this.actualizarMarcadorEnMapa(lat, lng);
    this.fetchAddress(lat, lng);
  }

  private actualizarMarcadorEnMapa(lat: number, lng: number): void {
    if (!this.map) return;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup('<b>Ubicación del Comercio</b>')
        .openPopup();
    }
    this.map.setView([lat, lng], 15);
  }

  private fetchAddress(lat: number, lng: number): void {
    fetch(`https://openstreetmap.org{lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then(res => res.json())
      .then(data => {
        const address = data.display_name || `Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;
        this.formParent.patchValue({ direccion: `📍 ${address}` });
      })
      .catch(() => {
        this.formParent.patchValue({ direccion: `📍 GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}` });
      });
  }

}
