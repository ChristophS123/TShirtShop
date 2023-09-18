import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-cart-detail-page',
  templateUrl: './cart-detail-page.component.html',
  styleUrls: ['./cart-detail-page.component.scss']
})
export class CartDetailPageComponent implements AfterViewInit {

  @ViewChild('amount') amountInputElement!:ElementRef
  amountInput!:HTMLInputElement
  @ViewChild('size') sizeSelectElement!:ElementRef
  sizeSelect!:HTMLSelectElement

  frontImageData:string = '';
  backImageData:string = '';
  rightImageData:string = '';
  leftImageData:string = '';
  amount:number = 1;
  size:string = '';
  id:number = 0;

  constructor(private route:ActivatedRoute, private cdr:ChangeDetectorRef, private cartService:CardService, private router:Router) {  }
  
  ngAfterViewInit(): void {
    this.amountInput = this.amountInputElement.nativeElement;
    this.sizeSelect = this.sizeSelectElement.nativeElement;
    this.route.params.subscribe(params => {
      this.frontImageData = params['front'];
      this.backImageData = params['back'];
      this.rightImageData = params['right'];
      this.leftImageData = params['left'];
      this.amount = params['amount'];
      this.size = params['size'];
      this.id = params['id'];
      this.amountInput.value = this.amount + '';
      this.sizeSelect.value = this.size;
      this.cdr.detectChanges();
    });
  }

  backAndSave() {
    this.cartService.updateItem(this.sizeSelect.value, parseInt(this.amountInput.value), this.id);
    this.router.navigate(['shopping-cart']);
  }

}
