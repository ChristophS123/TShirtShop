import { SaveObject } from "./save-object";
import { EmailService } from "./services/email.service";

export class CardObject {

    constructor(
        public id:number,
        public front:SaveObject,
        public back:SaveObject,
        public right:SaveObject,
        public left:SaveObject,
        public size:string,
        public amount:number,
        public normalPrice:number,
        public price:number
    ) {  }

}