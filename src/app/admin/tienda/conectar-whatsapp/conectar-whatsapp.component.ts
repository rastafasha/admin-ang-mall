import { Component, inject, OnInit } from '@angular/core';
import { TiendaService } from 'src/app/services/tienda.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-conectar-whatsapp',
  standalone:false,
  templateUrl: './conectar-whatsapp.component.html',
  styleUrl: './conectar-whatsapp.component.css'
})
export class ConectarWhatsappComponent implements OnInit{
  user:any;
  public whatsappStatus: string = 'DESCONECTADO'; 
  public whatsappQRString: string = '';
  private chequeoInterval: any; 

  public tiendaService = inject(TiendaService);

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    if (this.user?.local) {
      this.revisarEstadoActual();
    }
  }

  revisarEstadoActual() {
    this.tiendaService.statusWhatsapp(this.user.local).subscribe((resp: any) => {
      this.whatsappStatus = resp.whatsappStatus;
      this.whatsappQRString = resp.whatsappQR;

      // Si el backend ya tenía el QR activo en MongoDB, iniciamos el bucle de escucha
      if (this.whatsappStatus === 'ESPERANDO_QR') {
        this.iniciarChequeoAutomatico();
      }
    });
  }

  conexionWhatsapp() {
    this.whatsappStatus = 'CARGANDO'; 

    // Ajustado: Empaquetamos el id dentro de un objeto para cumplir con el tipo (Tienda) que espera tu servicio
    const objetoTienda = { _id: this.user.local };

    this.tiendaService.conectarWhatsapp(this.user.local).subscribe({
      next: (resp: any) => {
        this.whatsappStatus = resp.whatsappStatus; 
        this.whatsappQRString = resp.whatsappQR;   
        
        if (this.whatsappStatus === 'ESPERANDO_QR') {
          this.iniciarChequeoAutomatico();
        }
      },
      error: (err) => {
        console.error('Error al iniciar Puppeteer:', err);
        this.whatsappStatus = 'DESCONECTADO';
      }
    });
  }

  iniciarChequeoAutomatico() {
    if (this.chequeoInterval) clearInterval(this.chequeoInterval);
    const localId = typeof this.user.local === 'string' ? this.user.local : this.user.local?._id;

    this.chequeoInterval = setInterval(() => {
      this.tiendaService.statusWhatsapp(localId).subscribe((resp: any) => {
        this.whatsappStatus = resp.whatsappStatus;
        
        // 💥 SI LLEGA EL QR, FORZAMOS EL DIBUJO EN EL CANVAS DEL HTML
        if (this.whatsappStatus === 'ESPERANDO_QR' && resp.whatsappQR) {
          this.whatsappQRString = resp.whatsappQR;
          this.dibujarCodigoQR();
        }
        
        if (this.whatsappStatus === 'CONECTADO') {
          this.whatsappQRString = '';
          clearInterval(this.chequeoInterval);
          console.log('🎉 ¡Dispositivo enlazado con éxito!');
        }
      });
    }, 5000);
  }
   dibujarCodigoQR() {
    // Le damos un milisegundo de retraso para asegurar que Angular ya renderizó el elemento <canvas> en el DOM
    setTimeout(() => {
      const canvas = document.getElementById('canvas-qr') as HTMLCanvasElement;
      if (canvas && this.whatsappQRString) {
        QRCode.toCanvas(canvas, this.whatsappQRString, { width: 250 }, (error) => {
          if (error) console.error('Error generando el canvas QR:', error);
        });
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.chequeoInterval) clearInterval(this.chequeoInterval);
  }

  public encodeURIComponent(str: string): string {
  return encodeURIComponent(str);
}

}
