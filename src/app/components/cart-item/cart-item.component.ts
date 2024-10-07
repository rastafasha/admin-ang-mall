import { Component, Input, OnInit } from '@angular/core';
import { CartItemCurso } from 'src/app/models/cart-item-curso';
import { CartItemModel } from '../../models/cart-item-model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  @Input() cartItem: CartItemModel;
  // @Input() cartItemCurso: CartItemCurso;

  constructor() { }

  ngOnInit(): void {
  }

}
