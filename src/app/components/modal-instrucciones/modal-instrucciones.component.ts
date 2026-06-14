import { ChangeDetectorRef, Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; 

@Component({
  selector: 'app-modal-instrucciones',
  standalone: false,
  templateUrl: './modal-instrucciones.component.html',
  styleUrl: './modal-instrucciones.component.scss'
})
export class ModalInstruccionesComponent implements AfterViewInit   {

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Input() displaycomponent: string = 'block';
  @Input() sectionId!: string;
  isLogued: boolean = false;
  private _info!: string;

  @Input()
set info(value: string) {
  this._info = value;
  // Cada vez que el padre le asigne datos a 'info', obligamos al modal a enterarse
  this.cdRef.detectChanges(); 
}

get info(): string {
  return this._info;
}

  constructor(
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer 
  ) { }

  ngAfterViewInit() {
    const USER = localStorage.getItem("user");
    this.isLogued = !!USER;

    // Si pasas el ID técnico (ej: 'tienda'), la clave se guardará de forma idéntica en cualquier idioma
    if (localStorage.getItem(`modalDismissed_${this.sectionId}`)) {
      return;
    }

    setTimeout(() => {
      const modalElement = document.getElementById('infoModal') as HTMLElement;
      if (modalElement) {
        const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement) || 
                               new (window as any).bootstrap.Modal(modalElement);
        
        bootstrapModal.show();
        this.cdRef.detectChanges(); // Fuerza el renderizado inicial de tu innerHTML
      }
    }, 500);
  }

  onNoShowMore() {
    localStorage.setItem(`modalDismissed_${this.sectionId}`, 'true');
    this.closeAndCleanup();
  }

  onClose() {
    this.closeAndCleanup();
    this.closeModal.emit();
  }

  private closeAndCleanup() {
    const modalElement = document.getElementById('infoModal') as HTMLElement;
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      if (bootstrapModal) bootstrapModal.hide();
    }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowX = 'auto';
  }

  // Método público para abrir el modal manualmente (por si ponen un botón de "Ayuda")
  public open() {
    setTimeout(() => {
      const modalElement = document.getElementById('infoModal') as HTMLElement;
      if (modalElement) {
        const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement) ||
                               new (window as any).bootstrap.Modal(modalElement);
        bootstrapModal.show();
        this.cdRef.detectChanges(); // 2. Agregado aquí también para evitar que abra vacío al llamarlo de forma externa
      }
    }, 100);
  }
}
