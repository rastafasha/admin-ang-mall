import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-importar-productos',
  standalone: false,
  templateUrl: './importar-productos.component.html',
  styleUrl: './importar-productos.component.css'
})
export class ImportarProductosComponent {

  @Input() isOpen: boolean = false;
  @Input() localId: string = '';
  public isDragOver: boolean = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onRefreshProducts = new EventEmitter<void>(); // Avisa al padre que refresque el listado

  excelFile: File | null = null;
  imageFiles: File[] = [];
  pasoActual: number = 1;
  loading: boolean = false;

  erroresLote: string[] = [];
  productosCreadosCount: number = 0;

  constructor(private productoService: ProductoService) { } // Reemplaza por tu servicio real

  onExcelSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.excelFile = event.target.files;
    }
  }

  onImagesSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.imageFiles = Array.from(event.target.files);
    }
  }

  // Resetea todo el estado al cerrar el modal
  cerrarModal(): void {
    this.excelFile = null;
    this.imageFiles = [];
    this.pasoActual = 1;
    this.loading = false;
    this.erroresLote = [];
    this.productosCreadosCount = 0;
    this.onClose.emit();
  }

  // Descarga la plantilla binaria y simula un clic de descarga nativa en el navegador
  bajarPlantilla(): void {
    this.productoService.descargarPlantilla().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla_productos.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo generar la plantilla de descarga.', 'error');
      }
    });
  }

  subirExcel(): void {
    if (!this.excelFile || !this.localId) return;
    this.loading = true;
    this.erroresLote = []; // Limpiamos errores anteriores

    const formData = new FormData();
    formData.append('excel', this.excelFile);
    formData.append('local', this.localId);

    this.productoService.importarExcel(formData).subscribe({
      next: (resp: any) => {
        this.loading = false;

        if (resp.ok) {
          this.productosCreadosCount = resp.creados;
          this.erroresLote = resp.errores || [];
          this.onRefreshProducts.emit(); // Refresca la tabla principal en segundo plano

          if (this.erroresLote.length > 0) {
            // Si hay errores, saltamos al "Paso 3" que es la pantalla de reporte de errores
            this.pasoActual = 3;
            Swal.fire({
              title: 'Importación parcial',
              text: `Se crearon ${resp.creados} productos, pero hubo ${resp.fallidos} conflictos en el archivo.`,
              icon: 'warning'
            });
          } else {
            // Si todo fue perfecto, avanzamos directo a subir las fotos
            Swal.fire({
              title: '¡Excel Procesado!',
              text: `${resp.creados} productos creados y traducidos con éxito. Procedamos con las fotos.`,
              icon: 'success'
            });
            this.pasoActual = 2;
          }
        }
      },
      error: (err: any) => {
        this.loading = false;
        Swal.fire('Error', err.error?.msg || 'Verifica el formato del archivo de Excel.', 'error');
      }
    });
  }

  subirImagenesMasivas(): void {
    if (this.imageFiles.length === 0 || !this.localId) return;
    this.loading = true;

    const formData = new FormData();
    formData.append('local', this.localId);

    this.imageFiles.forEach((file: File) => {
      formData.append('imagenes', file, file.name);
    });

    this.productoService.vincularImagen(formData).subscribe({
      next: (resp: any) => {
        this.loading = false;

        let resumenErrores = '';
        if (resp.no_vinculados_count > 0) {
          resumenErrores = `<br><br><small class="text-danger">⚠️ ${resp.no_vinculados_count} fotos no coincidieron con los nombres del Excel.</small>`;
        }

        Swal.fire({
          title: '¡Proceso Finalizado!',
          html: `Se acoplaron <b>${resp.vinculados_count}</b> imágenes a tus productos.${resumenErrores}`,
          icon: resp.no_vinculados_count > 0 ? 'warning' : 'success'
        });

        this.onRefreshProducts.emit();
        this.cerrarModal();
      },
      error: (err: any) => {
        this.loading = false;
        Swal.fire('Error', 'Problema al procesar el lote de imágenes.', 'error');
      }
    });
  }

  // Permite al usuario avanzar a las fotos ignorando/aceptando los errores del Excel
  continuarAFotos(): void {
    this.pasoActual = 2;
  }


  // Manejo cuando el mouse arrastra archivos dentro de la zona
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  // Manejo cuando el mouse sale de la zona sin soltar nada
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  // Manejo cuando el usuario SUELTA los archivos en la zona
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.agregarArchivosALaCola(Array.from(event.dataTransfer.files));
    }
  }

  // Manejo tradicional cuando usan el explorador de archivos clásico
  onFilesSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.agregarArchivosALaCola(Array.from(event.target.files));
    }
  }

  // Acumula archivos permitiendo arrastrar en varios bloques (uno por uno o en grupos)
  private agregarArchivosALaCola(archivos: File[]): void {
    const extensionesPermitidas = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

    archivos.forEach(archivo => {
      const ext = archivo.name.split('.').pop()?.toLowerCase() || '';

      // Validamos en el frontend para alertar rápido si arrastran algo que no es imagen
      if (extensionesPermitidas.includes(ext)) {
        // Evitamos duplicar exactamente el mismo archivo en el listado visual
        const existe = this.imageFiles.some(f => f.name === archivo.name && f.size === archivo.size);
        if (!existe) {
          this.imageFiles.push(archivo);
        }
      } else {
        Swal.fire('Formato no válido', `El archivo ${archivo.name} no es una imagen permitida.`, 'warning');
      }
    });
  }

  // Permite sacar un archivo específico de la lista antes de presionar enviar
  removerImagen(index: number): void {
    this.imageFiles.splice(index, 1);
  }

}
