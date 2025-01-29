// ----------------------------------------------------------------------------
// класс с набором константных строковых значений
// ----------------------------------------------------------------------------
export class Literals {

  //#region AppComponent
  public static readonly app: string = 'app';
  public static readonly navbarBrandActive: string = 'navbar-brand-active';
  public static readonly iconLight: string = 'icon-light';
  public static readonly iconDark: string = 'icon-dark';
  public static readonly footerEMailTitle: string = '&commat;-mail';
  public static readonly footerEMailHref: string = 'http://mail.ru';
  public static readonly footerEMailValue: string = 'j&lowbar;makarov&commat;mail.ru';
  public static readonly fileNamePhotoDef: string = 'photo.ico';

  //endregion


  //#region AboutComponent
  public static readonly about: string = 'about';

  //endregion


  //#region LoginComponent
  public static readonly login: string = 'login';
  public static readonly loginPlaceholder: string =
    '+7(000)000-00-00 / abc@email.com';
  public static readonly passwordPlaceholder: string = '***...';
  public static readonly passwordMinLength: number = 4;
  public static readonly passwordMaxLength: number = 50;

  //endregion


  //#region RegistrationComponent
  public static readonly registration: string = 'registration';
  public static readonly plusSeven: string = '+7';
  public static readonly phoneLength: number = 12;
  public static readonly emailLength: number = 50;
  public static readonly phonePlaceholder: string = '+7(000)000-00-00';
  public static readonly emailPlaceholder: string = 'abc@email.com';

  //endregion


  //#region LanguageComponent
  public static readonly fileNameImageRus: string = 'rus.png';
  public static readonly fileNameImageEng: string = 'eng.png';

  //endregion


  //#region NotFoundComponent
  public static readonly notFound: string = 'not-found';

  //endregion


  //#region значения маршрутов
  public static readonly routeHomeEmpty: string = '';
  public static readonly routeHome: string = 'home';
  public static readonly routeAbout: string = 'about';
  public static readonly routeLogin: string = 'login';
  public static readonly routeRegistration: string = 'registration';
  public static readonly routeNotFound: string = '404';
  public static readonly routeOther: string = '**';

  //endregion


  //#region разное
  public static readonly empty: string = '';
  public static readonly space: string = ' ';
  public static readonly comma: string = ',';
  public static readonly plus: string = '+';
  public static readonly break: string = '<br>';
  public static readonly language: string = 'language';
  public static readonly rus: string = 'rus';
  public static readonly eng: string = 'eng';
  public static readonly srcImage: string = 'assets/images/';
  public static readonly srcPhoto: string = 'assets/photos/';
  public static readonly jwt: string = 'jwt';
  public static readonly user: string = 'user';
  public static readonly Ok: string = 'Ok';
  public static readonly required: string = 'required';
  public static readonly phoneValidator: string = 'phoneValidator';
  public static readonly minlength: string = 'minlength';
  public static readonly maxlength: string = 'maxlength';
  public static readonly emailValidator: string = 'emailValidator';
  public static readonly zero: number = 0;
  public static readonly one: number = 1;
  public static readonly timeout: number = 6_000;
  public static readonly timeStop: number = 25_000;
  public static readonly string: string = 'string';

  //endregion

} // class Literals
// ----------------------------------------------------------------------------
