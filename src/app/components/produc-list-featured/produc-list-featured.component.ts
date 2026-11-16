import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Producto } from 'src/app/models/producto.model';

@Component({
  selector: 'app-produc-list-featured',
  standalone:false,
  templateUrl: './produc-list-featured.component.html',
  styleUrls: ['./produc-list-featured.component.css']
})
export class ProducListFeaturedComponent implements OnChanges {

 @Input() bestsellers: Producto[] = [];
  @Input() populares: Producto[] = [];
  @Input() productosML: Producto[] = [];

  public collection: Producto[] = [];
  public title: string = '';

  constructor(
    public translate: TranslateService 
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // 1. Si cambió 'bestsellers' (y no viene undefined)
    if (changes['bestsellers'] && Array.isArray(this.bestsellers)) {
      this.collection = this.bestsellers;
      this.title = 'Best Sellers';
    } 
    // 2. Si cambió 'populares'
    else if (changes['populares'] && Array.isArray(this.populares)) {
      this.collection = this.populares;
      this.title = 'Populares';
    } 
    // 3. Si cambió 'productosML'
    else if (changes['productosML'] && Array.isArray(this.productosML)) {
      this.collection = this.productosML;
      this.title = 'Más Vendidos por Mercado Libre';
    }
  }
}
