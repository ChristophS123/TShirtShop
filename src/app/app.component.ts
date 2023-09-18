import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CardService } from './services/card.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(private cardService:CardService) { 
    cardService.loadSavedCardObjects();
  }

  // Shoping card saves fertig
  // Als nächstes Shopping Card grafisch einbinden!

}
