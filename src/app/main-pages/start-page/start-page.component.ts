import { Component } from '@angular/core';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent {

  constructor(private cardService:CardService) { 
    cardService.loadSavedCardObjects();
  }
  
}
