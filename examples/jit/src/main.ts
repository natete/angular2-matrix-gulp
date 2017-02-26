import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import { LocalizationService } from './app/localization/localization.service';

if (environment.production) {
  enableProdMode();
}

LocalizationService.getTranslationProviders()
                   .then(providers => {
                     const options = { providers };
                     platformBrowserDynamic().bootstrapModule(AppModule, options);
                   });
