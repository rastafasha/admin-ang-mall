import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BusquedasService } from '../../services/busquedas.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    @Input() query: string = '';
    @Input() placeholder: string = 'Buscar...';
    @Input() searchType: string = '';
    @Input() colleccionName: any[] = [];

    @Input() colleccion!: 'usuarios'|'categorias' |'marcas' |'productos'|'blogs'|
    'pages'|'sliders'
    | 'tiendas'| 'trasnferencias'
    | 'pagoecheques'| 'pagoefectivos';
    @Input() modelo!:any;

    resultados: any[] = [];

    @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() resetEvent: EventEmitter<void> = new EventEmitter<void>();

    cargando:boolean =false;
    constructor (
        public busquedaService: BusquedasService,
    ) {}

    // search() {
    //     this.searchEvent.emit(this.query);
    // }

      search(query:string){
        this.cargando = true;
        this.busquedaService.buscar(this.colleccion, query)
          .subscribe( (resultados: any) => {
            if (Array.isArray(resultados)) {
              this.resultados = resultados as any[];
              this.colleccionName = this.resultados;
              // Emit search results with dynamic key based on colleccion
              const resultObject: any = {};
              resultObject[this.colleccion] = this.resultados;
              this.searchEvent.emit(resultObject);
            } else {
              this.resultados = [];
              this.searchEvent.emit({ [this.colleccion]: [] });
            }
            this.cargando = false;
          })
      }

    PageSize() {
        this.query = '';
        this.resetEvent.emit();
    }
}
