import { Injectable } from '@angular/core';
import { CardObject } from '../card-object';
import { EmailService } from './email.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  tShirts:CardObject[] = [];

  constructor(private emailService:EmailService, private router:Router) { }

  loadSavedCardObjects() {
    const jsonCardObjects:CardObject[] = JSON.parse(localStorage.getItem("cardObjects")!);
    if(jsonCardObjects != null) 
      this.tShirts = jsonCardObjects;
  }

  getAllPrice() : number {
    let allPrice = 0;
    this.tShirts.forEach(element => {
      allPrice += element.price;
    });
    return allPrice;
  }

  saveCardObjects() {
    localStorage.setItem("cardObjects", JSON.stringify(this.tShirts));
  }

  clearShoppingCard() {
    localStorage.clear();
    this.tShirts = [];
  }

  addCardObject(cardObject:CardObject) {
    this.tShirts.push(cardObject);
    this.saveCardObjects();
  }

  updateItem(newSize:string, newAmount:number, id:number) {
    let cartObject:CardObject|null = this.getCartObjectByID(id);
    if(cartObject == null)
      return;
    cartObject.price = cartObject.normalPrice * newAmount;
    cartObject.amount = newAmount;
    cartObject.size = newSize;
    this.saveCardObjects();
  }

  checkOut(email:string, street:string, city:string) {
    let allImageDatas:string[] = [];
    this.tShirts.forEach(element => {
      console.log(this.getImageInformation(element));
      this.getImageInformation(element).forEach(element1 => {
        allImageDatas.push(element1);
      });
    });
    let tShirtInformationText = "TShirt Informationen:";
    let tShirtTextInformation = "TShirt Text Informationen:";
    let i = 1;
    this.tShirts.forEach(element2 => {
      tShirtInformationText += '\n';
      tShirtInformationText += "T-Shirt " + i + ": Größe: " + element2.size + " Anzahl: " + element2.amount;
      tShirtTextInformation += "\n \n TShirt " + i + ": ";
      console.log(element2);
      element2.front.fonts.forEach(element1 => {
        console.log(element1);
        tShirtInformationText += "\n" + element1;
      });
      element2.back.fonts.forEach(element1 => {
        tShirtInformationText += "\n" + element1;
      });
      element2.right.fonts.forEach(element1 => {
        tShirtInformationText += "\n" + element1;
      });
      element2.left.fonts.forEach(element1 => {
        tShirtInformationText += "\n" + element1;
      });
      i++;
    });
    let address:string = "Adresse: \n\n" + street + "\n" + city;
    this.emailService.sendEmail("merch@sv-studios.de", "Neue Bestellung", "Eine neue Bestellung von " + email + " wurde aufgegeben. \n \n" + tShirtInformationText + "\n" + tShirtTextInformation + "\n" + address, allImageDatas);
    this.clearShoppingCard();
    this.router.navigate(['app']);
  }
  
  public getImageInformation(cartObject:CardObject) : string[] {
    let imageDatas:string[] = [];
    cartObject.front.imageUrls.forEach(element => {
        imageDatas.push(element);
    });
    cartObject.back.imageUrls.forEach(element => {
        imageDatas.push(element);
    });
    cartObject.right.imageUrls.forEach(element => {
        imageDatas.push(element);
    });
    cartObject.left.imageUrls.forEach(element => {
        imageDatas.push(element);
    });
    return imageDatas;
}

  getCartObjectByID(id:number) : CardObject|null {
    for(let i = 0; i < this.tShirts.length; i++) {
      if(this.tShirts[i].id == id)
        return this.tShirts[i];
    }
    return null;
  }

}
