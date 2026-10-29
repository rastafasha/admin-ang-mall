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

  // Recibe el FormGroup creado por el padre para mantener la reactividad nativa
  @Input() formParent!: FormGroup; 
  @Input() tiendaId!: string;

  public usaMercadoLibre = false;
  public meliStatus = 'DESCONECTADO';
  public meliNickname = '';

  constructor(private meliService: MercadolibreService) {}

  /**
 * Guarda las credenciales de la App de Mercado Libre del comercio
 */
guardarCredencialesMeli() {
  const { meli_client_id, meli_client_secret, meli_redirect_uri } = this.formParent.value;

  if (!meli_client_id || !meli_redirect_uri) {
    Swal.fire('Atención', 'El Client ID y la URI de redirección son obligatorios.', 'warning');
    return;
  }

  const payload = {
    tienda: this.tiendaId,
    client_id: meli_client_id,
    client_secret: meli_client_secret, // Si está vacío y ya existía, el backend lo mantendrá intacto
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

/**
 * Solicita la URL regional y redirige al comerciante al login OAuth de Mercado Libre
 */
vincularCuentaMeli() {
  this.meliService.obtenerUrlVinculacion().subscribe({
    next: (resp) => {
      if (resp && resp.url) {
        // Redirección directa y transparente al portal de Mercado Libre de su país (ej: .com.ve)
        window.location.href = resp.url; 
      }
    },
    error: (err) => Swal.fire('Error', 'Asegúrate de haber guardado el Client Secret e intenta de nuevo.', 'error')
  });
}
}
