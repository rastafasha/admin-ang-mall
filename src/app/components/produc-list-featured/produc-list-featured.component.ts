import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';

@Component({
  selector: 'app-produc-list-featured',
  templateUrl: './produc-list-featured.component.html',
  styleUrls: ['./produc-list-featured.component.css']
})
export class ProducListFeaturedComponent implements OnChanges {

  @Input() bestsellers: Producto[] = [];
  @Input() populares: Producto[] = [];
  public collection: Producto[] = [];
  public title: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bestsellers'] && this.bestsellers.length > 0) {
      this.collection = this.bestsellers;
      this.title = 'Best Sellers';
    } else if (changes['populares'] && this.populares.length > 0) {
      this.collection = this.populares;
      this.title = 'Populares';
    }
  }

}
