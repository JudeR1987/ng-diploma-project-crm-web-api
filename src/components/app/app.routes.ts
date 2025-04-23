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
import {WarehouseComponent} from '../warehouse/warehouse.component';
import {ReportsComponent} from '../reports/reports.component';
import {ScheduleComponent} from '../schedule/schedule.component';
import {EmployeeFormComponent} from '../employee-form/employee-form.component';
import {EmployeesServicesComponent} from '../employees-services/employees-services.component';
import {ClientsComponent} from '../clients/clients.component';
import {Record} from '../../models/classes/Record';
import {RecordsComponent} from '../records/records.component';
import {OnlineRecordServicesComponent} from '../online-record-services/online-record-services.component';
import {OnlineRecordEmployeesComponent} from '../online-record-employees/online-record-employees.component';

export const routes: Routes = [
  {path: Literals.routeHomeEmpty,    component: HomeComponent},
  {path: Literals.routeHome,         component: HomeComponent},
  {path: Literals.routeAbout,        component: AboutComponent,    canActivate: [AuthGuardService]},
  {path: Literals.routeLogin,        component: LoginComponent},
  {path: Literals.routeRegistration, component: RegistrationComponent},
  {path: `${Literals.routeUserForm}/:${Literals.id}`,                      component: UserFormComponent,          canActivate: [AuthGuardService]},
  {path: `${Literals.routePasswordForm}/:${Literals.id}`,                  component: PasswordFormComponent,      canActivate: [AuthGuardService]},
  {path: Literals.routeBusiness,     component: BusinessComponent, canActivate: [AuthGuardService]},
  {path: `${Literals.routeCompanyForm}/:${Literals.mode}`,                  component: CompanyFormComponent,       canActivate: [AuthGuardService]},
  {path: `${Literals.routeCompanyForm}/:${Literals.mode}/:${Literals.id}`,  component: CompanyFormComponent,       canActivate: [AuthGuardService]},
  {path: `${Literals.routeServices}/:${Literals.id}`,                       component: ServicesComponent,          canActivate: [AuthGuardService]},
  {path: `${Literals.routeServiceForm}/:${Literals.mode}`,                  component: ServiceFormComponent,       canActivate: [AuthGuardService]},
  {path: `${Literals.routeEmployees}/:${Literals.id}`,                      component: EmployeesComponent,         canActivate: [AuthGuardService]},
  {path: `${Literals.routeEmployeeForm}/:${Literals.mode}`,                 component: EmployeeFormComponent,      canActivate: [AuthGuardService]},
  {path: `${Literals.routeSchedule}/:${Literals.id}`,                       component: ScheduleComponent,          canActivate: [AuthGuardService]},
  {path: `${Literals.routeEmployeesServices}/:${Literals.id}`,              component: EmployeesServicesComponent, canActivate: [AuthGuardService]},
  {path: `${Literals.routeClients}/:${Literals.id}`,                        component: ClientsComponent,           canActivate: [AuthGuardService]},
  {path: `${Literals.routeRecords}/:${Literals.id}`,                        component: RecordsComponent,           canActivate: [AuthGuardService]},
  {path: `${Literals.routeWarehouse}/:${Literals.id}`,                      component: WarehouseComponent,         canActivate: [AuthGuardService]},
  {path: `${Literals.routeReports}/:${Literals.id}`,                        component: ReportsComponent,           canActivate: [AuthGuardService]},
  {path: `${Literals.routeOnlineRecordServices}/:${Literals.id}`,           component: OnlineRecordServicesComponent},
  {path: `${Literals.routeOnlineRecordEmployees}/:${Literals.id}`,          component: OnlineRecordEmployeesComponent},
  //{path: 'countries',             component: CountriesComponent},
  //{path: 'purposes',              component: PurposesComponent},
  //{path: 'people',                component: PeopleComponent},
  //{path: 'clientsTemp',           component: ClientsTempComponent},
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
