import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Esta es la configuración principal de la aplicación.
 * El array 'providers' es donde se inicializan los servicios y módulos globales.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // provideRouter(routes) es la línea ESENCIAL que activa el sistema de
    // enrutamiento de Angular para toda la aplicación. Sin esto, ningún
    // routerLink funcionará.
    provideRouter(routes),

    // provideHttpClient() permite que la aplicación realice peticiones HTTP
    // a través del servicio HttpClient.
    provideHttpClient()
  ]
};
