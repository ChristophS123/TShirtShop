import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartComponent } from './main-pages/shopping-cart/shopping-cart.component';
import { AppComponent } from './app.component';
import { StartPageComponent } from './main-pages/start-page/start-page.component';
import { CartDetailPageComponent } from './main-pages/cart-detail-page/cart-detail-page.component';
import { CheckoutPageComponent } from './main-pages/checkout-page/checkout-page.component';

const routes: Routes = [
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'cart-item-detail', component: CartDetailPageComponent },
  { path: '', component: StartPageComponent },
  { path: 'app', component: StartPageComponent },
  { path: 'checkout', component: CheckoutPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
