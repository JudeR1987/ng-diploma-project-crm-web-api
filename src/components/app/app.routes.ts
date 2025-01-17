import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "../home/home.component";
import {AboutComponent} from '../about/about.component';
import {NotFoundComponent} from "../not-found/not-found.component";
import {Literals} from '../../infrastructure/Literals';
import {LoginComponent} from '../login/login.component';
import {RegistrationComponent} from '../registration/registration.component';
import {AuthGuardService} from '../../services/auth-guard.service';
//import {CountriesComponent} from '../countries/countries.component';
//import {PurposesComponent} from '../purposes/purposes.component';
//import {PeopleComponent} from '../people/people.component';
//import {ClientsComponent} from '../clients/clients.component';
//import {RoutesComponent} from '../routes/routes.component';
//import {TripsComponent} from '../../temp/trips/trips.component';
//import {Query01Component} from '../query01/query01.component';
//import {Query02Component} from '../../temp/query02/query02.component';
//import {Query03Component} from '../../temp/query03/query03.component';
//import {Query04Component} from '../query04/query04.component';
//import {Query05Component} from '../query05/query05.component';

export const routes: Routes = [
  {path: Literals.routeHomeEmpty,    component: HomeComponent},
  {path: Literals.routeHome,         component: HomeComponent},
  {path: Literals.routeAbout,        component: AboutComponent, canActivate: [AuthGuardService]},
  {path: Literals.routeLogin,        component: LoginComponent},
  {path: Literals.routeRegistration, component: RegistrationComponent},
  //{path: 'countries',             component: CountriesComponent},
  //{path: 'purposes',              component: PurposesComponent},
  //{path: 'people',                component: PeopleComponent},
  //{path: 'clients',               component: ClientsComponent},
  //{path: 'routes',                component: RoutesComponent},
  //{path: 'trips',                 component: TripsComponent},

  // отображение результатов запросов
  //{path: 'query01', component: Query01Component},
  //{path: 'query02', component: Query02Component},
  //{path: 'query03', component: Query03Component},
  //{path: 'query04', component: Query04Component},
  //{path: 'query05', component: Query05Component},

  // в любых других случаях перенаправить на страницу "НЕ найдена"
  {path: Literals.routeNotFound, component: NotFoundComponent},
  {path: Literals.routeOther,    redirectTo: Literals.routeNotFound}
];

// Регистрация маршрутов приложения
RouterModule.forRoot(routes);
