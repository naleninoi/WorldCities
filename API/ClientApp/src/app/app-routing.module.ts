import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { CitiesComponent } from './cities/cities.component';
import { CountriesComponent } from './countries/countries.component';
import { CityEditComponent } from './city-edit/city-edit.component';
import { CountryEditComponent } from './country-edit/country-edit.component';
import { AuthorizeGuard } from '../api-authorization/authorize.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'cities', component: CitiesComponent },
  { path: 'city/:id', component: CityEditComponent, canActivate: [AuthorizeGuard] },
  { path: 'city', component: CityEditComponent, canActivate: [AuthorizeGuard] },
  { path: 'countries', component: CountriesComponent },
  { path: 'country/:id', component: CountryEditComponent, canActivate: [AuthorizeGuard] },
  { path: 'country', component: CountryEditComponent, canActivate: [AuthorizeGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
