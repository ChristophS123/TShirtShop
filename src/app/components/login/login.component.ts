import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CardService } from 'src/app/services/card.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('inputs') inputDivElement!:ElementRef;
  inputDiv!:HTMLDivElement

  @ViewChild('loggedIn') loggedInDivElement!:ElementRef;
  loggedInDiv!:HTMLDivElement

  @ViewChild('login') loginInDivElement!:ElementRef;
  loginInDiv!:HTMLDivElement

  @ViewChild('checkout') checkoutDivElement!:ElementRef;
  checkoutInDiv!:HTMLDivElement

  @ViewChild('paypal', {static: true}) payPalElement!:ElementRef

  email:string = '';
  isLoggedIn:boolean = false;

  constructor(private httpClient:HttpClient, private cartService:CardService) {  }

  ngAfterViewInit(): void {
    this.inputDiv = this.inputDivElement.nativeElement;
    this.loggedInDiv = this.loggedInDivElement.nativeElement;
    this.loginInDiv = this.loginInDivElement.nativeElement;
    this.checkoutInDiv = this.checkoutDivElement.nativeElement;
    window.paypal.Buttons(
      {
        style: {
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
        },
        createOrder: (data:any, actions:any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.cartService.getAllPrice()
                }
              }
            ]
          })
        },
        onApprove: (data:any, actions:any) => {
          return actions.order.capture().then((details:any) => {
            if(data.value['street'] == null || data.value['street'] == '') {
              alert("Bitte fülle alle Felder aus");
              return;
            }
            if(data.value['city'] == null || data.value['city'] == '') {
              alert("Bitte fülle alle Felder aus");
              return;
            }
            this.cartService.checkOut(this.email, data.value['street'], data.value['city']);
          });
        },
        onError: (error:any) => {
          console.log(error);
        }
      }
    ).render(this.payPalElement.nativeElement);
  }

  submitLoginData(data:any) {
    let email = data.value['email'];
    let password = data.value['password'];
    let body = {
      email: email,
      password: password
    };
    this.httpClient.post('http://localhost/TShirtBackend/index.php/api/auth/login', body).subscribe((response:any) => {
      if(response['success'] == 1) {
        this.inputDiv.style.visibility = 'hidden';
        this.inputDiv.style.display = 'none';
        this.email = email;
        this.isLoggedIn = true;
        this.loggedInDiv.style.visibility = 'visible';
        this.loggedInDiv.style.display = 'block';
      } else {
        alert(response['message']);
      }
    }, (error) => {

    })
  }

  goToLastCheckOut() {
    this.loggedInDiv.style.visibility = 'hidden';
    this.loggedInDiv.style.display = 'none';
    this.loginInDiv.style.visibility = 'hidden';
    this.loginInDiv.style.display = 'none';
    this.checkoutInDiv.style.visibility = 'visible';
    this.checkoutInDiv.style.display = 'block';
  }

  submitCheckoutData(data:any) {
  }

}
