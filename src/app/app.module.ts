import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { TextDialogComponent } from './components/text-dialog/text-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ColorPickerModule } from 'ngx-color-picker';
import { ShoppingCartComponent } from './main-pages/shopping-cart/shopping-cart.component';
import { StartPageComponent } from './main-pages/start-page/start-page.component';
import { ShoppingCartItemComponent } from './components/shopping-cart-item/shopping-cart-item.component';
import { CartDetailPageComponent } from './main-pages/cart-detail-page/cart-detail-page.component';
import { CheckoutPageComponent } from './main-pages/checkout-page/checkout-page.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    TextDialogComponent,
    ShoppingCartComponent,
    StartPageComponent,
    ShoppingCartItemComponent,
    CartDetailPageComponent,
    CheckoutPageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
