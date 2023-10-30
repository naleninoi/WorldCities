import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HomeComponent} from './home/home.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import { CitiesComponent } from './cities/cities.component';
import { HttpClientModule } from '@angular/common/http';
import { BASE_URL } from './_config/app.config';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavMenuComponent,
    CitiesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: BASE_URL, useValue: 'https://localhost:7105/api/', deps: [] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
