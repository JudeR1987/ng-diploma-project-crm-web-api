// ----------------------------------------------------------------------------
// сервис аутентификации и авторизации пользователя
// ----------------------------------------------------------------------------
import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {User} from '../models/classes/User';
import {Literals} from '../infrastructure/Literals';
import {WebApiService} from './web-api.service';
import {Config} from '../infrastructure/Config';
import {LoginModel} from '../models/classes/LoginModel';
import {firstValueFrom, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  // объект сервиса-помощника при работе с jwt-токеном
  private _jwtHelper: JwtHelperService;

  // объект для передачи данных о пользователе
  public userSubject: Subject<User> = new Subject<User>();


  // конструктор с DI для подключения к маршрутизатору для получения маршрута
  // и подключения к web-сервису
  constructor(private _router: Router, private _webApiService: WebApiService) {

    console.log(`[-AuthGuardService-constructor--`);

    // создание нового объекта jwt-помощника
    this._jwtHelper = new JwtHelperService();

    console.log(`--AuthGuardService-constructor-]`);

  } // constructor


  // метод, контролирующий доступ к маршрутам
  // НЕ аутентифицированных пользователей
  canActivate() {

    console.log(`[-AuthGuardService-canActivate--`);

    // получить jwt-токен
    let token: string | null = localStorage.getItem(Literals.jwt);
    console.log(`--AuthGuardService-token: ${token}`);

    // получить данные о пользователе
    let user: User = User.loadUser();

    // если токен есть и он действителен ИЛИ
    // данные о пользователе есть и произведён вход в систему, то
    // переход по маршруту разрешён
    if ((token && !this._jwtHelper.isTokenExpired(token)) || user.isLogin) {
      console.log(`--AuthGuardService-canActivate-TRUE-]`);
      return true;
    } // if

    // иначе перенаправляем пользователя на форму входа в систему
    this._router.navigateByUrl(Literals.routeLogin)
      .then((e) => { console.dir(e); });

    console.log(`--AuthGuardService-canActivate-FALSE-]`);
    return false;
  } // canActivate


  // запрос на вход в систему
  async login(loginModel: LoginModel): Promise<{ message: any, token: string, user: User }> {

    console.log(`[-AuthGuardService-login--`);

    // ожидаем получения ответа на запрос
   /* let webResult: {token: string, user: User} =
      { token: Literals.empty, user: User.UserToDto(new User()) };
    try {
      webResult = await firstValueFrom(
        this._webApiService.loginPOST(Config.urlAuthLogin, loginModel)
      );
    } catch (e: any) {
      console.dir(e);
      console.log(`--AuthGuardService-login-]`);
      return e.error;
    } // try-catch

    console.dir(webResult);
    console.dir(webResult.token);
    console.dir(webResult.user);*/
    let result: { message: any, token: string, user: User } =
      { message: Literals.Ok, token: Literals.empty, user: User.UserToDto(new User()) };
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.loginPOST(Config.urlAuthLogin, loginModel)
      );
      console.dir(webResult);

      if (webResult != null) {
        result.token = webResult.token;
        result.user  = webResult.user;
      } // if

    } catch (e: any) {
      console.dir(e);
      console.dir(e.error);
      result.message = e.error;

      console.log(`--AuthGuardService-login-]`);
      return result;
    } // try-catch

    console.dir(result);
    console.dir(result.message);
    console.dir(result.token);
    console.dir(result.user);

    // записать данные в хранилище
    localStorage.setItem(Literals.jwt, result.token);
    localStorage.setItem(Literals.user, JSON.stringify(result.user));

    // передадим данные о пользователе через объект компонента
    // другим компонентам, подписавшимся на изменение объекта
    this.userSubject.next(User.newUser(result.user));

    console.log(`--AuthGuardService-login-]`);

    return result;

  } // login


  // запрос на выход из системы
  async logOut(user: User): Promise<string> {

    console.log(`[-AuthGuardService-logOut--`);

    // ожидаем получения ответа на запрос
    let message: string = Literals.Ok;
    try {
      await firstValueFrom(
        this._webApiService.logOutPOST(Config.urlAuthLogOut, user)
      );
    } catch (e: any) {
      console.dir(e);
      console.log(`--AuthGuardService-logOut-]`);
      message = e.error;
    } // try-catch

    // удалить данные из хранилища
    localStorage.removeItem(Literals.jwt);
    localStorage.removeItem(Literals.user);

    // передадим данные о пользователе через объект компонента
    // другим компонентам, подписавшимся на изменение объекта
    this.userSubject.next(new User());

    console.log(`--AuthGuardService-logOut-]`);

    return message;

  } // logOut


  // запрос на регистрацию в системе
  async registration(loginModel: LoginModel): Promise<{ message: string, phone: string, email: string }> {

    console.log(`[-AuthGuardService-registration--`);

    // ожидаем получения ответа на запрос
    let result: { message: string, phone: string, email: string } =
      { message: Literals.Ok, phone: Literals.empty, email: Literals.empty };
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.registrationPOST(Config.urlAuthRegistration, loginModel)
      );
      console.dir(webResult);

      if (webResult != null) {
        result.message = Literals.empty;
        result.phone = webResult.phone;
        result.email = webResult.email;
      } // if

    } catch (e: any) {
      console.dir(e);
      console.dir(e.error);
      result.message = e.error;

      if (e.error.title) result.message = e.error.title;

      console.log(`--AuthGuardService-registration-]`);
      return result;
    } // try-catch

    console.dir(result);
    console.dir(result.message);
    console.dir(result.phone);
    console.dir(result.email);

    console.log(`--AuthGuardService-registration-]`);

    return result;

  } // registration


  // запрос на обновление jwt-токена
  /*refreshToken(): Promise<string> {

  } // refreshToken*/


  /*login(loginModel: LoginModel): string {

    console.log(`[-AuthGuardService-login--`);

    console.log(`*** 1 ***`);

    // подписка на получение результата запроса
    this._webApiService.loginPOST(Config.urlAuthLogin, loginModel).subscribe({

      // вызов метода при получении данных
      next: (webResult: {token: string, user: User} ) => {

        console.log(`[-AuthGuardService-login-subscribe-`);

        console.log(`*** 2 ***`);

        console.dir(webResult);
        console.dir(webResult.token);
        console.dir(webResult.user);

        // записать данные в хранилище
        localStorage.setItem(Literals.jwt, webResult.token);
        localStorage.setItem(Literals.user, JSON.stringify(webResult.user));

        // передадим данные о пользователе через объект компонента
        // другим компонентам, подписавшимся на изменение объекта
        this.userSubject.next(User.newUser(webResult.user));

        console.log(`--AuthGuardService-login-subscribe-]`);

        return 'ok';

      }, // next

      // вызов метода при обнаружении ошибки в данных
      error: (err: any) => {
        console.dir(err);
        return err;
      } // error

    }); // loginPOST

    console.log(`*** 3 ***`);

    console.log(`--AuthGuardService-login-]`);

    return '123';
  } // login*/


  // GET-запрос без параметров на удалённый сервер для получения данных
  /*get(url: string): Observable<any> {
    return this._http.get<any>(url);
  } // get*/


  // POST-запрос на удалённый сервер
  /*loginPOST(url: string, credentials: any): Observable<any> {
    return this._http.post<any>(url, credentials
      /!*new HttpParams()
        .set('username', credentials.username)
        .set('password', credentials.password)*!/
    );
  } // editClient*/


  // открытые аксессоры свойств
  //get language(): string { return this._language; }

  //set language(value: string) { this._language = value; }

} // class AuthGuardService
// ----------------------------------------------------------------------------
