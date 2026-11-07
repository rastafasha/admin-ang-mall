import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MercadolibreService } from 'src/app/services/mercadolibre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tiendamercadolibre',
  standalone:false,
  templateUrl: './tiendamercadolibre.component.html',
  styleUrl: './tiendamercadolibre.component.css'
})
export class TiendamercadolibreComponent {

  @Input() formParent!: FormGroup; 
  @Input() tiendaId!: string;
  @Input() usaMercadoLibre;

  // Variables de control de estado visual
  public meliStatus = 'DESCONECTADO';
  public meliNickname = '';

  constructor(private meliService: MercadolibreService) {}

  ngOnInit(): void {
    // 🚀 LEER VALORES INICIALES: Si el formulario ya viene poblado por el backend
    this.actualizarEstadoVisual();

    // 🚀 ESCUCHAR EN TIEMPO REAL: Por si el usuario edita o escribe en caliente
    this.formParent.valueChanges.subscribe(() => {
      this.actualizarEstadoVisual();
    });
  }

  /**
   * Sincroniza las variables locales basándose en el estado real del FormGroup
   */
  private actualizarEstadoVisual() {
    const clientId = this.formParent.get('meli_client_id')?.value;
    
    // Si ya existe un Token o Nickname en el formulario puedes evaluar 'CONECTADO'
    if (clientId) {
      this.meliStatus = 'CONFIGURADO';
    } else {
      this.meliStatus = 'DESCONECTADO';
    }
  }

  guardarCredencialesMeli() {
    const { meli_client_id, meli_client_secret, meli_redirect_uri } = this.formParent.value;

    if (!meli_client_id || !meli_redirect_uri) {
      Swal.fire('Atención', 'El Client ID y la URI de redirección son obligatorios.', 'warning');
      return;
    }

    const payload = {
      tienda: this.tiendaId,
      client_id: meli_client_id,
      client_secret: meli_client_secret,
      redirect_uri: meli_redirect_uri,
      status: 'CONFIGURADO' as const
    };

    this.meliService.guardarConfiguracion(payload).subscribe({
      next: (resp) => {
        Swal.fire('Guardado', 'Las credenciales de Mercado Libre fueron guardadas. Ahora puedes enlazar tu cuenta.', 'success');
        this.meliStatus = 'CONFIGURADO';
      },
      error: (err) => Swal.fire('Error', err.error?.msg || 'No se pudo guardar la configuración.', 'error')
    });
  }

  vincularCuentaMeli() {
    if (!this.tiendaId) {
      Swal.fire('Atención', 'ID de tienda requerido.', 'warning');
      return;
    }

    this.meliService.obtenerUrlVinculacion(this.tiendaId).subscribe({
      next: (resp) => {
        if (resp && resp.url) {
          window.location.href = resp.url; 
        }
      },
      error: (err) => Swal.fire('Error', 'Asegúrate de haber guardado el Client Secret e intenta de nuevo.', 'error')
    });
  }
}
