import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "../home/home.component";
import {AboutComponent} from '../about/about.component';
import {NotFoundComponent} from "../not-found/not-found.component";
import {Literals} from '../../infrastructure/Literals';
import {LoginComponent} from '../login/login.component';
import {RegistrationComponent} from '../registration/registration.component';
import {AuthGuardService} from '../../services/auth-guard.service';
import {UserFormComponent} from '../user-form/user-form.component';
import {PasswordFormComponent} from '../password-form/password-form.component';
import {BusinessComponent} from '../business/business.component';
import {CompanyFormComponent} from '../company-form/company-form.component';
import {EmployeesComponent} from '../employees/employees.component';
import {ServicesComponent} from '../services/services.component';
import {ServiceFormComponent} from '../service-form/service-form.component';

export const routes: Routes = [
  {path: Literals.routeHomeEmpty,    component: HomeComponent},
  {path: Literals.routeHome,         component: HomeComponent},
  {path: Literals.routeAbout,        component: AboutComponent,    canActivate: [AuthGuardService]},
  {path: Literals.routeLogin,        component: LoginComponent},
  {path: Literals.routeRegistration, component: RegistrationComponent},
  {path: `${Literals.routeUserForm}/:${Literals.id}`,                      component: UserFormComponent,     canActivate: [AuthGuardService]},
  {path: `${Literals.routePasswordForm}/:${Literals.id}`,                  component: PasswordFormComponent, canActivate: [AuthGuardService]},
  {path: Literals.routeBusiness,     component: BusinessComponent, canActivate: [AuthGuardService]},
  {path: `${Literals.routeCompanyForm}/:${Literals.mode}`,                 component: CompanyFormComponent,  canActivate: [AuthGuardService]},
  {path: `${Literals.routeCompanyForm}/:${Literals.mode}/:${Literals.id}`, component: CompanyFormComponent,  canActivate: [AuthGuardService]},
  {path: `${Literals.routeServices}/:${Literals.id}`,                      component: ServicesComponent,     canActivate: [AuthGuardService]},
  //{path: `${Literals.routeServiceForm}/:${Literals.mode}/:${Literals.companyId}/:${Literals.servicesCategoryId}/:${Literals.serviceId}`, component: ServiceFormComponent, canActivate: [AuthGuardService]},
  {path: `${Literals.routeServiceForm}/:${Literals.mode}`,                 component: ServiceFormComponent,  canActivate: [AuthGuardService]},
  {path: `${Literals.routeEmployees}/:${Literals.id}`,                     component: EmployeesComponent,    canActivate: [AuthGuardService]},
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
