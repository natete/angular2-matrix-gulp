import { Injectable, TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';

@Injectable()
export class LocalizationService {

  constructor() {
  }

  getAvaliableLanguages(): string[] {
    try {
      return require('../../assets/locale/langs.json');
    } catch (e) {
      return [];
    }
  }

  changeLanguage(lang): void {
    if (!lang) {
      lang = 'en';
    }
    const currentLang = window.location.pathname.split('/')[1];
    window.location.href = window.location.href.replace(currentLang, lang);
  }
}
