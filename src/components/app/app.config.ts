import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from "@angular/common/http";
import {JwtModule} from '@auth0/angular-jwt';
import {routes} from './app.routes';
import {Config} from '../../infrastructure/Config';

// функция получения jwt-токена для сервиса JwtHelper
export function tokenGetter() {
  return localStorage.getItem('jwt');
} // tokenGetter

// Регистрация настроек сервиса JwtHelper
JwtModule.forRoot({
  config: {
    tokenGetter: tokenGetter,
    allowedDomains: [Config.urlHost],
    disallowedRoutes: []
  }
}); // forRoot

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // регистрация сервиса как поставщика данных
    // использование функции провайдера HttpClientModule
    provideHttpClient()

  ] // providers
}; // const appConfig
