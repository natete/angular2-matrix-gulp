import { Injectable, TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';

@Injectable()
export class LocalizationService {

  private static language: string;

  constructor() {
  }

  static getTranslationProviders(): Promise<Object[]> {
    this.init();

    if (!this.language || this.language === 'en') {
      return Promise.resolve([]);
    }

    try {
      const translationsContent = this.getTranslations();

      return Promise.resolve([
        { provide: TRANSLATIONS, useValue: translationsContent },
        { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
        { provide: LOCALE_ID, useValue: this.language }
      ]);
    } catch (e) {
      // No translations available for the requested locale
      // Default (english) will be used.
      return Promise.resolve([]);
    }
  }

  getAvaliableLanguages(): string[] {
    try {
      return require('../../assets/locale/langs.json');
    } catch (e) {
      return [];
    }
  }

  changeLanguage(lang): void {
    if (lang) {
      window.localStorage.setItem('lang', lang);
    } else {
      window.localStorage.removeItem('lang');
    }
    location.reload();
  }

  private static init() {
    const lang = window.localStorage.getItem('lang');

    if (lang) {
      console.log(`Using ${lang} lang stored in local storage`);
      this.language = lang;
    } else {
      const anyNavigator = navigator as any;
      this.language = anyNavigator.languages && anyNavigator.languages[0] ||
          anyNavigator.language ||
          anyNavigator.userLanguage;
    }
  }

  private static getTranslations(): string {
    return require(`../../assets/locale/exports/messages.${this.language}.xlf.ts`);
  }
}
