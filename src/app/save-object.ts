export class SaveObject {

    constructor(
        public site:TShirtSite,
        public imageUrls:string[],
        public fonts:string[],
    ) {  }

}

export enum TShirtSite {

    FRONT, BACK, LEFT, RIGHT

}

export enum TShirtColor {
    
    WHITE, BLACK

}