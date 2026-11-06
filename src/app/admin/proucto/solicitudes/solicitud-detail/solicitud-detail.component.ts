import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-solicitud-detail',
  standalone: false,
  templateUrl: './solicitud-detail.component.html',
  styleUrl: './solicitud-detail.component.css'
})
export class SolicitudDetailComponent implements  OnChanges{

 
  @Input() solicitudSelected;

   constructor(
      // Debe ser public para que el HTML pueda leer "translate.currentLang"
      public translate: TranslateService 
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
          changes['solicitudSelected'] &&
          changes['solicitudSelected'].currentValue
        ) {
          this.solicitudSelected = changes['solicitudSelected'].currentValue;
        }
    }

}
