import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardObject } from 'src/app/card-object';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  shoppingCartProducts:CardObject[] = [];

  allPrice:number = 0;

  constructor(private cartService:CardService, private location:Location, private router:Router) {  }

  ngOnInit(): void {
    this.shoppingCartProducts = this.cartService.tShirts;
    this.allPrice = this.cartService.getAllPrice();
  }

  back() {
    this.location.back();
  }

  checkOut() {
    this.router.navigate(['checkout']);
  }

}
