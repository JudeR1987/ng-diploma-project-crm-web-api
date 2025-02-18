// ----------------------------------------------------------------------------
// класс с набором константных строковых значений
// ----------------------------------------------------------------------------
import {WebApiService} from '../services/web-api.service';

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


  //#region NotFoundComponent
  public static readonly notFound: string = 'not-found';

  //endregion


  //#region WebApiService
  public static readonly accept: string = 'Accept';
  public static readonly applicationJson: string = 'application/json';
  public static readonly authorization: string = 'Authorization';
  public static readonly bearer: string = 'Bearer';
  public static readonly tempPhoto: string = 'tempPhoto';

  //endregion


  //#region значения маршрутов
  public static readonly routeHomeEmpty: string = '';
  public static readonly routeHome: string = 'home';
  public static readonly routeAbout: string = 'about';
  public static readonly routeLogin: string = 'login';
  public static readonly routeRegistration: string = 'registration';
  public static readonly routeUserForm: string = 'user-form';
  public static readonly routePasswordForm: string = 'password-form';
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
  public static readonly srcImagePath: string = 'assets/images/';
  public static readonly srcPhotoPath: string = 'assets/photos/';
  public static readonly jwt: string = 'jwt';
  public static readonly user: string = 'user';
  public static readonly Ok: string = 'Ok';
  public static readonly zero: number = 0;
  public static readonly one: number = 1;
  public static readonly hundred: number = 100;
  public static readonly timeout: number = 6_000;
  public static readonly timeout10: number = 10;
  public static readonly timeStop: number = 25_000;
  public static readonly string: string = 'string';
  public static readonly id: string = 'id';
  public static readonly slash: string = '/';

  //endregion


  //#region для форм

  public static readonly phonePlaceholder: string = '+7(000)000-00-00';
  public static readonly passwordPlaceholder: string = '***...';
  public static readonly required: string = 'required';
  public static readonly minlength: string = 'minlength';
  public static readonly maxlength: string = 'maxlength';
  public static readonly phoneValidator: string = 'phoneValidator';
  public static readonly emailValidator: string = 'emailValidator';
  public static readonly passwordValidator: string = 'passwordValidator';
  public static readonly matchValidator: string = 'matchValidator';
  public static readonly phoneLength: number = 12;
  public static readonly emailLength: number = 50;
  public static readonly passwordMinLength: number = 4;
  public static readonly passwordMaxLength: number = 50;
  public static readonly text: string = 'text';
  public static readonly password: string = 'password';
  public static readonly newPassword: string = 'newPassword';
  public static readonly userId: string = 'userId';
  public static readonly userName: string = 'userName';
  public static readonly phone: string = 'phone';
  public static readonly email: string = 'email';
  public static readonly avatar: string = 'avatar';
  public static readonly passwordInputTypes: { text: string, password: string } =
    { text: this.text, password: this.password };
  public static readonly error401: number = 401;

  //endregion

} // class Literals
// ----------------------------------------------------------------------------
