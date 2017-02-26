import { Component } from '@angular/core';
import { LocalizationService } from './localization/localization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  langs: string[];

  constructor(private localizationService: LocalizationService) {
    this.langs = this.localizationService.getAvaliableLanguages();
  }

  changeLanguage(lang): void {
    this.localizationService.changeLanguage(lang);
  }
}
