import { Injectable } from '@angular/core';
import { SaveObject, TShirtSite } from '../save-object';
import { EmailService } from './email.service';
import { CardObject } from '../card-object';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  private frontSaveObject:SaveObject|undefined = undefined;
  private backSaveObject:SaveObject|undefined = undefined;
  private leftSaveObject:SaveObject|undefined = undefined;
  private rightSaveObject:SaveObject|undefined = undefined;

  constructor(private emailService:EmailService, private cardService:CardService) {  }

  saveData(site:TShirtSite, imageUrls:string[], fonts:string[]) {
    let saveObject:SaveObject = new SaveObject(site, imageUrls, fonts);
    switch(site) {
      case TShirtSite.FRONT:
        this.frontSaveObject = saveObject;
        break;
      case TShirtSite.BACK:
        this.backSaveObject = saveObject;
        break;
      case TShirtSite.RIGHT:
        this.rightSaveObject = saveObject;
        break;
      case TShirtSite.LEFT:
        this.leftSaveObject = saveObject;
        break;
     }
  }

  applyData(price:number) {
    let cardObject:CardObject = new CardObject(
        this.cardService.tShirts.length,
        this.frontSaveObject!,
        this.backSaveObject!,
        this.rightSaveObject!,
        this.leftSaveObject!,
        "XL",
        1,
        price, // Normal Price equals to price because no scaling tShirts
        price 
      );
    this.cardService.addCardObject(cardObject);
    alert("TShirt wurde zum Warenkorb hinzugefügt.");
  }

}
