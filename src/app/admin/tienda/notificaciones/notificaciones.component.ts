import { Component, inject } from '@angular/core';
import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-notificaciones',
  standalone:false,
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent {
  cargando = false;
  public notiService = inject(NotificacionService);
  
  // Lista flexible 'any' para evitar trancas de tipado con el populate del usuario
  public historialNotificaciones: any[] = [];
  
  p: number = 1;
  count: number = 8;

  ngOnInit(): void {
    this.cargarHistorial(this.p);
  }

  cargarHistorial(page: number) {
    this.notiService.obtenerHistorialCompleto(page).subscribe({
      next: (res) => {
        if (res.ok && res.notificaciones) {
          this.historialNotificaciones = res.notificaciones;
        }
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.historialNotificaciones = [];
      }
    });
  }

  // 🟢 Esta función recibe el evento del plugin cuando el admin avanza o retrocede
  cambiarPagina(eventoPage: number) {
    this.p = eventoPage;          // Sincroniza la vista de Angular
    this.cargarHistorial(this.p); // Llama al backend a traer la página solicitada
  }

  atenderNotificacion(notif: any) {
    this.notiService.marcarUnaComoLeida(notif._id).subscribe(() => {
      const ruta = (this.notiService as any).determinarRutaAdmin(notif.tipo, notif.referenciaId);
      this.notiService.router.navigate([ruta]);
    });
  }

  eliminarIndividual(id: string) {
    this.notiService.borrarNotificacion(id).subscribe(() => {
      this.cargarHistorial(this.p);
    });
  }

  vaciarTodo() {
    if (confirm('¿Estás seguro de que deseas eliminar todas las notificaciones de tu historial?')) {
      this.notiService.limpiarBuzonCompleto().subscribe(() => {
        this.historialNotificaciones = [];
      });
    }
  }
}
