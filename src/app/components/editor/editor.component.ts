import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { TShirtImage } from 'src/app/tshirt-image';
import { TShirtText } from 'src/app/tshirtText';
import { MatDialog } from '@angular/material/dialog';
import { TextDialogComponent } from '../text-dialog/text-dialog.component';
import { EmailService } from 'src/app/services/email.service';
import { SaveService } from 'src/app/services/save.service';
import { TShirtColor, TShirtSite } from 'src/app/save-object';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {

  @ViewChild('canvasElement') canvasElement!:ElementRef;
  @ViewChild('siteElement') siteElement!:ElementRef;

  site!:HTMLParagraphElement;

  price:number = 10;

  tImages:TShirtImage[] = [];
  tTexts:TShirtText[] = [];

  context!:CanvasRenderingContext2D|null;
  canvas!:HTMLCanvasElement;
  currentElementIndex = 0;
  selectedElementType:TShirtElementType = TShirtElementType.NONE;
  isDragging = false;
  startX = 0;
  startY = 0;

  currentTShirtSide:TShirtSite = TShirtSite.FRONT;
  currentTShirtSideImagePath = 'assets/tshirtwhitefront.png';

  tShirtColor:TShirtColor = TShirtColor.WHITE;
  @ViewChild('colorSelectionElement') colorSelectionElement!:ElementRef;
  colorSelection!:HTMLSelectElement;

  constructor(private renderer:Renderer2, private elementRef:ElementRef, private dialog:MatDialog, private emailService:EmailService, private saveService:SaveService) {  }

  ngAfterViewInit(): void {
    this.colorSelection = this.colorSelectionElement.nativeElement;
    this.site = this.siteElement.nativeElement;
    this.site.textContent = 'Vorderseite';
    this.canvas = this.canvasElement.nativeElement;
    this.context = this.canvas.getContext('2d');
    //this.canvas.style.border = '1px solid black';
    const backImage:CanvasImageSource = new Image();
    backImage.src = this.currentTShirtSideImagePath;
    backImage.onload = () => {
      this.context?.drawImage(backImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  onFileChange(event:any) {
    const file = event.target.files[0];
    if(!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e:any) => {
      const image:CanvasImageSource = new Image();
      image.src = e.target.result;
      image.onload = () => {
        this.tImages.push(new TShirtImage(image.x, image.y, image.height, image.width, image, 2));
        this.price += 2;
        this.drawElements();
      }
    }
  }

  addText(text:string, font:string, color:string) {
    if(this.context == null)
      return;
    console.log(color);
    this.context.font = font;
    this.context.fillStyle = color;
    this.context.fillText(text, 50, 50);
    let textMetrics = this.context.measureText(text);
    this.tTexts.push(new TShirtText(50, 50, parseInt(this.context.font, 10), textMetrics.width, font, color, 10, text));
    this.price += 1;
    this.drawElements();
  }

  openTextDialog() {
    const dialogRef = this.dialog.open(TextDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result['canceled'] != undefined)
        return;
      this.addText(result['text'], result['textType'], result['color']);
    });
  }

  drawElements() {
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if(this.context == null) {
      return;
    }
      
    const backImage:CanvasImageSource = new Image();
    backImage.src = this.currentTShirtSideImagePath;
    this.context?.drawImage(backImage, 0, 0, this.canvas.width, this.canvas.height);
      
    // TShirts:
    let index = 0;
    for(let i of this.tImages) {
      this.context?.drawImage(i.image, i.x, i.y, i.width, i.height);
      if(this.selectedElementType == TShirtElementType.IMAGE) {
        if(index == this.currentElementIndex) {
          const borderWidth = 1;
          const dashLength:number = 10;
          this.context.strokeStyle = 'red';
          this.context.lineWidth = 2;
          this.context.setLineDash([dashLength]);
          this.context.strokeRect(i.x - borderWidth / 2, i.y - borderWidth / 2, i.width + borderWidth, i.height + borderWidth);
        }
      }
      index++;
    }
    this.drawTexts();
  }

  drawTexts() {
    if(this.context == null)
      return;
    let index = 0;
    for(let i of this.tTexts) {
      this.context.font = i.textSize + 'px ' + i.font;
      this.context.fillStyle = i.color;
      this.context.fillText(i.text, i.x, i.y);
      if(this.selectedElementType == TShirtElementType.TEXT) {
        if(index == this.currentElementIndex) {
          const borderWidth = 1;
          const dashLength:number = 10;
          this.context.strokeStyle = 'red';
          this.context.lineWidth = 2;
          this.context.setLineDash([dashLength]);
          this.context.strokeRect(i.x - 3 - borderWidth / 2, i.y - i.height + 3 - borderWidth / 2, i.width + 6 + borderWidth, i.height + borderWidth);
        }
      }
      index++;
    }
  }

  mouseDown(event:any, canvas:HTMLCanvasElement) {
    event.preventDefault();
    let rect = canvas.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
    // Images
    let imageIndex = 0;
    for(let currentImage of this.tImages) {
      if(this.isMouseInImage(this.startX, this.startY, currentImage)) {
        this.currentElementIndex = imageIndex;
        this.selectedElementType = TShirtElementType.IMAGE;
        this.drawElements();
        this.isDragging = true;
        return;
      }
      imageIndex++
    }
    // Texts
    let index = 0;
    for(let currentText of this.tTexts) {
      if(this.isMouseInText(this.startX, this.startY, currentText)) {
        this.currentElementIndex = index;
        this.selectedElementType = TShirtElementType.TEXT;
        this.drawElements();
        this.isDragging = true;
        return;
      }
      index++;
    }
  }

  mouseUp(event:MouseEvent, canvas:HTMLCanvasElement) {
    if(!this.isDragging)
      return;
    event.preventDefault();
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
  }

  mouseMove(event:any, canvas:HTMLCanvasElement) {
    let rects = canvas.getBoundingClientRect();
    let moveX = event.clientX - rects.left;
    let moveY = event.clientY - rects.top;
    let changed = false;
    for(let currentImage of this.tImages) {
      if(this.isMouseInImage(moveX, moveY, currentImage)) {
        const element = this.elementRef.nativeElement;
        this.renderer.setStyle(element, 'cursor', 'pointer');
        changed = true;
      }
    }
    for(let currentText of this.tTexts) {
      if(this.isMouseInText(moveX, moveY, currentText)) {
        const element = this.elementRef.nativeElement;
        this.renderer.setStyle(element, 'cursor', 'pointer');
        changed = true;
      }
    }
    if(!changed) {
      const element = this.elementRef.nativeElement;
        this.renderer.setStyle(element, 'cursor', 'auto');
    }
    if(!this.isDragging)
      return;
    event.preventDefault();
    let rect = canvas.getBoundingClientRect();
    let dx = moveX - this.startX;
    let dy = moveY - this.startY;
    let currentElement;
    if(this.selectedElementType == TShirtElementType.IMAGE)
      currentElement = this.tImages[this.currentElementIndex];
    else
      currentElement = this.tTexts[this.currentElementIndex];
    currentElement.x += dx;
    currentElement.y += dy;
    this.drawElements();
    //this.drawShapes();
    this.startX = moveX;
    this.startY = moveY;
  }

  deselect() {
    this.currentElementIndex = -1;
    this.drawElements();
  }

  deleteImage() {
    if(this.currentElementIndex == undefined || this.currentElementIndex == -1)
      return;
    if(this.selectedElementType == TShirtElementType.IMAGE) {
      this.price -= this.tImages[this.currentElementIndex].price
      this.tImages.splice(this.currentElementIndex, 1);
    } else {
      this.tTexts.splice(this.currentElementIndex, 1)
      this.price -= 1;
    }
    this.currentElementIndex = -1;
    this.drawElements();
  }

  isMouseInText(x: number, y: number, element: TShirtText) : boolean {
    let left = element.x;
    let right = element.x + element.width;
    let top = element.y - element.height;
    let bottom = element.y + element.height;
    if(x > left && x < right && y > top && y < bottom) {
      return true;
    }
    return false;
  }

  isMouseInImage(x: number, y:number, element: TShirtImage) : boolean {
    let left = element.x;
    let right = element.x + element.width;
    let top = element.y;
    let bottom = element.y + element.height;
    if(x > left && x < right && y > top && y < bottom) {
      return true;
    }
    return false;
  }

  scaleDown() {
    if(this.selectedElementType == TShirtElementType.IMAGE) {
      const selectedImage = this.tImages[this.currentElementIndex];
      selectedImage.width = selectedImage.width * 0.9;
      selectedImage.height = selectedImage.height * 0.9;
    } else {
      const selectedText = this.tTexts[this.currentElementIndex];
      selectedText.width = selectedText.width * 0.9;
      selectedText.height = selectedText.height * 0.9;
      selectedText.textSize = selectedText.textSize * 0.9;
    }
    
    this.drawElements();
  }

  scaleUp() {
    if(this.selectedElementType == TShirtElementType.IMAGE) {
      const selectedImage = this.tImages[this.currentElementIndex];
      selectedImage.width = selectedImage.width / 0.9;
      selectedImage.height = selectedImage.height / 0.9;
      selectedImage.price = selectedImage.price / 0.2;
    } else {
      const selectedText = this.tTexts[this.currentElementIndex];
      selectedText.width = selectedText.width / 0.9;
      selectedText.height = selectedText.height / 0.9;
      selectedText.textSize = selectedText.textSize / 0.9;
    }
    this.drawElements()
  }

  save() {
    this.deselect();
    this.drawElements();
    const backImage:CanvasImageSource = new Image();
    backImage.src = this.currentTShirtSideImagePath
    backImage.onload = () => {
      this.context?.drawImage(backImage, 0, 0, this.canvas.width, this.canvas.height);
      this.drawElements();
      const canvasDataURL = this.canvas.toDataURL();
      let imageDataUrls:string[] = [];
      imageDataUrls.push(canvasDataURL);
      this.tImages.forEach(currentImage => {  
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.canvas.width;
      tempCanvas.height = this.canvas.height;
      const tempContext = tempCanvas.getContext('2d');
      tempContext?.drawImage(currentImage.image, currentImage.x, currentImage.y, currentImage.width, currentImage.height);
      const imageDataURL = tempCanvas.toDataURL();
      imageDataUrls.push(imageDataURL);
      tempCanvas.remove();
    });
    let fonts:string[] = [];
    this.tTexts.forEach(element => {
      fonts.push(element.font);
    });
    this.saveService.saveData(this.currentTShirtSide, imageDataUrls, fonts);
    switch(this.currentTShirtSide) {
      case TShirtSite.FRONT:
        this.setCurrentTShirtSide(TShirtSite.BACK);
        break;
      case TShirtSite.BACK: 
        this.setCurrentTShirtSide(TShirtSite.RIGHT);
        break;
      case TShirtSite.RIGHT:
        this.setCurrentTShirtSide(TShirtSite.LEFT);
        break;
      case TShirtSite.LEFT:
        this.saveService.applyData(this.price);
        break;
    }
  }

    
  }

  setCurrentTShirtSide(newSide:TShirtSite) {
    this.tTexts = [];
    this.tImages = [];
    switch(newSide) {
      case TShirtSite.BACK:
        this.currentTShirtSide = TShirtSite.BACK;
        if(this.tShirtColor == TShirtColor.WHITE) {
          this.currentTShirtSideImagePath = 'assets/tshirtwhiteback.png'
          this.canvas.style.backgroundImage = 'url("assets/tshirtwhiteback.png")';
        } else if(this.tShirtColor == TShirtColor.BLACK) {
          this.currentTShirtSideImagePath = 'assets/tshirtblackback.png'
          this.canvas.style.backgroundImage = 'url("assets/tshirtblackback.png")';
        }
        this.colorSelection.style.visibility = 'hidden';
        this.site.textContent = 'Rückseite';
        break;
      case TShirtSite.RIGHT:
        this.currentTShirtSide = TShirtSite.RIGHT;
        if(this.tShirtColor == TShirtColor.WHITE) {
          this.currentTShirtSideImagePath = 'assets/tshirtwhiteright.png'
          this.canvas.style.backgroundImage = 'url("assets/tshirtwhiteright.png")';
        } else if(this.tShirtColor == TShirtColor.BLACK) {
          this.currentTShirtSideImagePath = 'assets/tshirtblackright.png'
          this.canvas.style.backgroundImage = 'url("assets/tshirtblackright.png")';
        }
        this.site.textContent = 'Rechte Seite';
        break;
      case TShirtSite.LEFT:
        this.currentTShirtSide = TShirtSite.LEFT;
        if(this.tShirtColor == TShirtColor.WHITE) {
          this.currentTShirtSideImagePath = 'assets/tshirtwhiteleft.png'
          this.canvas.style.backgroundImage = 'url("assets/tshirtwhiteleft.png")';
        } else if(this.tShirtColor == TShirtColor.BLACK) {
          this.currentTShirtSideImagePath = 'assets/tshirtblackleft.png'
          this.canvas.style.backgroundImage = 'url("assets/tshirtblackleft.png")';
        }
        this.site.textContent = 'Linke Seite';
        break;
    }
    this.drawElements();
  }

  changeTShirtColor(event:any) {
    const selectedColor = event.target.value;
    if(selectedColor == "WHITE") {
      this.currentTShirtSideImagePath = 'assets/tshirtwhitefront.png'
      this.canvas.style.backgroundImage = 'url("assets/tshirtwhitefront.png")';
      this.tShirtColor = TShirtColor.WHITE;
    } else if(selectedColor == "BLACK") {
      this.currentTShirtSideImagePath = 'assets/tshirtblackfront.png'
      this.canvas.style.backgroundImage = 'url("assets/tshirtblackfront.png")';
      this.tShirtColor = TShirtColor.BLACK;
    }
    this.drawElements();
  }

}



export enum TShirtElementType {
  IMAGE, TEXT, NONE
}
