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

  //endregion


  //#region RegistrationComponent
  public static readonly registration: string = 'registration';

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
  public static readonly language: string = 'language';
  public static readonly rus: string = 'rus';
  public static readonly eng: string = 'eng';
  public static readonly srcImage: string = 'assets/images/';
  public static readonly srcPhoto: string = 'assets/photos/';
  public static readonly jwt: string = 'jwt';
  public static readonly user: string = 'user';
  public static readonly Ok: string = 'Ok';

  //endregion

} // class Literals
// ----------------------------------------------------------------------------
