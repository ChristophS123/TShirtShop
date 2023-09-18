import { Component, Input, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CardObject } from 'src/app/card-object';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.scss']
})
export class ShoppingCartItemComponent {

  @Input() cartItem!:CardObject;

  constructor(private router:Router) {  }

  openCartItemDetailPage() {
    this.router.navigate(['/cart-item-detail', { 
       front: this.cartItem.front.imageUrls[0],  
       back: this.cartItem.back.imageUrls[0],
       right: this.cartItem.right.imageUrls[0],
       left: this.cartItem.left.imageUrls[0],
       amount: this.cartItem.amount,
       size: this.cartItem.size,
       id: this.cartItem.id
      }]);
  }

}
