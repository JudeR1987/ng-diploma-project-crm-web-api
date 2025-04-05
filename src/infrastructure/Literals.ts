// ----------------------------------------------------------------------------
// класс с набором константных строковых значений
// ----------------------------------------------------------------------------
import {Config} from './Config';

export class Literals {

  //#region AppComponent
  public static readonly app: string = 'app';
  public static readonly navbarBrandActive: string = 'navbar-brand-active';
  public static readonly iconLight: string = 'icon-light';
  public static readonly iconDark: string = 'icon-dark';
  public static readonly footerEMailTitle: string = '&commat;-mail';
  public static readonly footerEMailHref: string = 'http://mail.ru';
  public static readonly footerEMailValue: string = 'j&lowbar;makarov&commat;mail.ru';

  //endregion


  //#region HomeComponent
  /*public static readonly fileNameLogoDef: string = 'logo.ico';
  public static readonly fileNameCompanyTitleImageDef: string = 'company.jpg';*/

  //endregion


  //#region AboutComponent
  public static readonly about: string = 'about';

  //endregion


  //#region LoginComponent
  public static readonly login: string = 'login';
  public static readonly loginPlaceholder: string =
    '+7(000)000-00-00 / abc@email.com';

  //endregion


  //#region RegistrationComponent
  public static readonly registration: string = 'registration';
  public static readonly plusSeven: string = '+7';
  public static readonly emailPlaceholder: string = 'abc@email.com';

  //endregion


  //#region LanguageComponent
  public static readonly fileNameImageRus: string = 'rus.png';
  public static readonly fileNameImageEng: string = 'eng.png';

  //endregion


  //#region UserFormComponent
  public static readonly userForm: string = 'user-form';
  public static readonly userNameLength: number = 50;

  //endregion


  //#region PasswordFormComponent
  public static readonly passwordForm: string = 'password-form';

  //endregion


  //#region BusinessComponent
  public static readonly business: string = 'business';

  //endregion


  //#region CompanyFormComponent
  public static readonly companyForm: string = 'company-form';
  public static readonly companyNameLength: number = 50;
  public static readonly companyNewCityNameLength: number = 50;
  public static readonly companyFormStreetLength: number = 80;
  public static readonly companyFormBuildingLength: number = 10;
  public static readonly companyFormFlatMax: number = 999;
  public static readonly companyDescriptionLength: number = 500;
  public static readonly companyScheduleLength: number = 50;
  public static readonly companySiteLength: number = 30;
  public static readonly companySchedulePlaceholder: string = 'Пн-Пт 9:00-18:00';
  public static readonly companySitePlaceholder: string = 'www.site.com';
  public static readonly companyFormLogoSizeImage: string =
    'input-image-w-160px-h-160px';
  public static readonly companyFormTitleImageSizeImage: string =
    'input-image-w-180-250px-h-180px';

  //endregion


  //#region ServicesComponent
  public static readonly services: string = 'services';

  //endregion


  //#region ServiceFormComponent
  public static readonly serviceForm: string = 'service-form';
  public static readonly serviceNameLength: number = 50;
  public static readonly serviceNewServicesCategoryNameLength: number = 50;
  public static readonly serviceCommentLength: number = 500;
  public static readonly serviceFormPriceMaxValue: number = 1_000_000;
  public static readonly serviceFormDurationMax: number = 1_440;

  //endregion


  //#region EmployeesComponent
  public static readonly employees: string = 'employees';

  //endregion


  //#region EmployeeFormComponent
  public static readonly employeeForm: string = 'employee-form';
  public static readonly employeeNameLength: number = 50;
  public static readonly employeeNewSpecializationNameLength: number = 80;
  public static readonly employeeNewPositionNameLength: number = 80;
  /*public static readonly serviceCommentLength: number = 500;
  public static readonly serviceFormPriceMaxValue: number = 1_000_000;
  public static readonly serviceFormDurationMax: number = 1_440;*/

  //endregion


  //#region ScheduleComponent
  public static readonly schedule: string = 'schedule';

  //endregion


  //#region EmployeesServicesComponent
  public static readonly employeesServices: string = 'employees-services';

  //endregion


  //#region WarehouseComponent
  public static readonly warehouse: string = 'warehouse';

  //endregion


  //#region ReportsComponent
  public static readonly reports: string = 'reports';

  //endregion


  //#region NotFoundComponent
  public static readonly notFound: string = 'not-found';

  //endregion


  //#region WebApiService
  public static readonly accept: string = 'Accept';
  public static readonly applicationJson: string = 'application/json';
  public static readonly authorization: string = 'Authorization';
  public static readonly bearer: string = 'Bearer';
  public static readonly tempImage: string = 'tempImage';
  public static readonly tempDir: string = 'tempDir';

  //endregion


  //#region значения маршрутов
  public static readonly routeHomeEmpty: string = '';
  public static readonly routeHome: string = 'home';
  public static readonly routeAbout: string = 'about';
  public static readonly routeLogin: string = 'login';
  public static readonly routeRegistration: string = 'registration';
  public static readonly routeUserForm: string = 'user-form';
  public static readonly routePasswordForm: string = 'password-form';
  public static readonly routeBusiness: string = 'business';
  public static readonly routeCompanyForm: string = 'company-form';
  public static readonly routeServices: string = 'services';
  public static readonly routeServiceForm: string = 'service-form';
  public static readonly routeEmployees: string = 'employees';
  public static readonly routeEmployeeForm: string = 'employee-form';
  public static readonly routeSchedule: string = 'schedule';
  public static readonly routeEmployeesServices: string = 'employees-services';
  public static readonly routeWarehouse: string = 'warehouse';
  public static readonly routeReports: string = 'reports';
  public static readonly routeNotFound: string = '404';
  public static readonly routeOther: string = '**';

  //endregion


  //#region разное
  public static readonly empty: string = '';
  public static readonly space: string = ' ';
  public static readonly comma: string = ',';
  public static readonly plus: string = '+';
  public static readonly doublePoint: string = ':';
  public static readonly break: string = '<br>';
  public static readonly language: string = 'language';
  public static readonly rus: string = 'rus';
  public static readonly eng: string = 'eng';
  public static readonly srcImagePath: string = 'assets/images/';
  public static readonly srcPhotoPath: string = 'assets/photos/';
  public static readonly srcLogoPath: string = 'assets/logos/';
  public static readonly fileNameLogoDef: string = 'logo.ico';
  public static readonly fileNameCompanyTitleImageDef: string = 'company.jpg';
  public static readonly fileNamePhotoDef: string = 'photo.ico';
  public static readonly jwt: string = 'jwt';
  public static readonly user: string = 'user';
  public static readonly Ok: string = 'Ok';
  public static readonly zero: number = 0;
  public static readonly one: number = 1;
  public static readonly two: number = 2;
  public static readonly five: number = 5;
  public static readonly hundred: number = 100;
  public static readonly fifteen: number = 15;
  public static readonly fiveHundred: number = 500;
  public static readonly timeout: number = 8_000;
  public static readonly timeout10: number = 10;
  public static readonly timeStop: number = 25_000;
  public static readonly string: string = 'string';
  public static readonly slash: string = '/';
  public static readonly question: string = '?';
  public static readonly page: string = 'page';
  public static readonly ellipsis: string = '...';
  public static readonly mode: string = 'mode';
  public static readonly createCompany: string = 'create-company';
  public static readonly editCompany: string = 'edit-company';
  public static readonly createService: string = 'create-service';
  public static readonly editService: string = 'edit-service';
  public static readonly deleteService: string = 'delete-service';
  public static readonly createEmployee: string = 'create-employee';
  public static readonly editEmployee: string = 'edit-employee';
  public static readonly deleteEmployee: string = 'delete-employee';
  public static readonly showSchedule: string = 'show-schedule';  // "показать расписание"
  public static readonly showServices: string = 'show-services';  // "показать услуги"

  //endregion


  //#region для форм

  public static readonly phonePlaceholder: string = '+7(000)000-00-00';
  public static readonly passwordPlaceholder: string = '***...';
  public static readonly touched: string = 'touched';
  public static readonly required: string = 'required';
  public static readonly minlength: string = 'minlength';
  public static readonly maxlength: string = 'maxlength';
  public static readonly max: string = 'max';
  public static readonly min: string = 'min';
  public static readonly phoneValidator: string = 'phoneValidator';
  public static readonly emailValidator: string = 'emailValidator';
  public static readonly passwordValidator: string = 'passwordValidator';
  public static readonly matchValidator: string = 'matchValidator';
  public static readonly selectedZeroValidator: string = 'selectedZeroValidator';
  public static readonly phoneLength: number = 12;
  public static readonly emailLength: number = 50;
  public static readonly passwordMinLength: number = 4;
  public static readonly passwordMaxLength: number = 50;
  public static readonly text: string = 'text';
  public static readonly password: string = 'password';
  public static readonly passwordInputTypes: { text: string, password: string } =
    { text: this.text, password: this.password };
  public static readonly newPassword: string = 'newPassword';
  public static readonly id: string = 'id';
  public static readonly firstId: string = 'firstId';
  public static readonly secondId: string = 'secondId';
  public static readonly userId: string = 'userId';
  public static readonly companyId: string = 'companyId';
  public static readonly userName: string = 'userName';
  public static readonly phone: string = 'phone';
  public static readonly email: string = 'email';
  public static readonly avatar: string = 'avatar';
  public static readonly error401: number = 401;
  public static readonly pathLogoDef: string =
    `${Config.urlHost}/download/getImage/companies/logos/${this.fileNameLogoDef}`;
  public static readonly pathTitleImageDef: string =
    `${Config.urlHost}/download/getImage/companies/images/${this.fileNameCompanyTitleImageDef}`;
  public static readonly pathEmployeePhotoDef: string =
    `${Config.urlHost}/download/getImage/employees/photos/${this.fileNamePhotoDef}`;
  public static readonly logo: string = 'logo';
  public static readonly image: string = 'image';
  public static readonly imageType: string = 'imageType';
  public static readonly temp: string = 'temp';
  public static readonly servicesCategoryId: string = 'servicesCategoryId';
  public static readonly serviceId: string = 'serviceId';
  public static readonly employeeId: string = 'employeeId';
  public static readonly specialization: string = 'specialization';
  public static readonly position: string = 'position';
  public static readonly personSizeImage: string = 'input-image-w-180-200px-h-224px';

  //endregion

} // class Literals
// ----------------------------------------------------------------------------
