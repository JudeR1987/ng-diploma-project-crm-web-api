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
import {UserService} from './user.service';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  // объект сервиса-помощника при работе с jwt-токеном
  //private _jwtHelper: JwtHelperService;

  // объект для передачи данных о пользователе
  //public userSubject: Subject<User> = new Subject<User>();


  // конструктор с DI для подключения к маршрутизатору для получения маршрута
  // и подключения к web-сервису
  // и подключения к сервисам хранения данных о пользователе и jwt-токене
  constructor(private _router: Router,
              private _webApiService: WebApiService,
              private _userService: UserService,
              private _tokenService: TokenService) {

    console.log(`[-AuthGuardService-constructor--`);

    // создание нового объекта jwt-помощника
    //this._jwtHelper = new JwtHelperService();

    console.log(`--AuthGuardService-constructor-]`);

  } // constructor


  // метод, контролирующий доступ к маршрутам
  // НЕ аутентифицированных пользователей
  canActivate() {

    console.log(`[-AuthGuardService-canActivate--`);

    // получить jwt-токен
    /*let token: string | null = localStorage.getItem(Literals.jwt);
    console.log(`--AuthGuardService-token: ${token}`);*/

    // получить данные о пользователе
    let user: User = this._userService.user;
    console.log(`*- user.isLogin: '${user.isLogin}' -*`);

    // если токен есть и он действителен ИЛИ
    // данные о пользователе есть и произведён вход в систему, то
    // переход по маршруту разрешён
    /*if ((token && !this._jwtHelper.isTokenExpired(token)) || user.isLogin) {
      console.log(`--AuthGuardService-canActivate-TRUE-]`);
      return true;
    } // if*/
    if (this._tokenService.isTokenExists() || user.isLogin) {
      console.log(`--AuthGuardService-canActivate-TRUE-]`);
      return true;
    } // if

    // иначе перенаправляем пользователя на форму входа в систему
    this._router.navigateByUrl(Literals.routeLogin)
      .then((e) => { console.log(`*- переход: ${e} -*`); /*console.dir(e);*/ });

    console.log(`--AuthGuardService-canActivate-FALSE-]`);
    return false;
  } // canActivate


  // запрос на вход в систему
  async login(loginModel: LoginModel): Promise<{ message: any, token: string, user: User }> {

    console.log(`[-AuthGuardService-login--`);

    // ожидаем получения ответа на запрос
    let result: { message: any, token: string, user: User } =
      { message: Literals.Ok, token: Literals.empty, user: User.UserToDto(new User()) };
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.loginPOST(Config.urlAuthLogin, loginModel)
      );
      console.dir(webResult);

      result.token = webResult.token;
      result.user  = User.newUser(webResult.user);

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

    console.log(`--AuthGuardService-login-]`);

    return result;

  } // login


  // запрос на выход из системы
  async logOut(user: User): Promise<any> {

    console.log(`[-AuthGuardService-logOut--`);

    // ожидаем получения ответа на запрос
    let message: any = Literals.Ok;
    try {

      let webResult: any = await firstValueFrom(
        this._webApiService.logOutPOST(Config.urlAuthLogOut, user)
      );
      console.dir(webResult);

    } catch (e: any) {
      console.dir(e);
      console.dir(e.error);
      message = e.error;

      console.log(`--AuthGuardService-logOut-]`);
      return message;
    } // try-catch

    console.log(`--AuthGuardService-logOut-]`);

    return message;

  } // logOut


  // запрос на регистрацию в системе
  async registration(loginModel: LoginModel): Promise<any> {

    console.log(`[-AuthGuardService-registration--`);

    // ожидаем получения ответа на запрос
    let message: any = Literals.Ok;
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.registrationPOST(Config.urlAuthRegistration, loginModel)
      );
      console.dir(webResult);

    } catch (e: any) {
      console.dir(e);
      console.dir(e.error);
      message = e.error;

      console.log(`--AuthGuardService-registration-]`);
      return message;
    } // try-catch

    console.log(`--AuthGuardService-registration-]`);

    return message;

  } // registration


  // запрос на обновление jwt-токена
  async refreshToken(): Promise<[boolean, string]> {
    console.log(`[-AuthGuardService-refreshToken--`);

    // получить данные о пользователе из сервиса-хранилища
    let user: User = this._userService.user;

    console.log(`--AuthGuardService-1-`);

    // ожидаем получения ответа на запрос
    let result: { message: any, token: string, user: User } =
      { message: Literals.Ok, token: Literals.empty, user: User.UserToDto(new User()) };
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.refreshPOST(Config.urlAuthRefresh, user)
      );
      console.dir(webResult);

      result.token = webResult.token;
      result.user  = User.newUser(webResult.user);

    } catch (e: any) {
      console.dir(e);
      console.dir(e.error);
      result.message = e.error;

    } // try-catch

    console.log(`--AuthGuardService-result:`);
    console.dir(result);

    console.log(`--AuthGuardService-2-`);

    // если сообщение с ошибкой - завершаем обработку,
    // из локального хранилища удаляем данные о токене и пользователе,
    // переходим в форму входа
    console.dir(result.message);
    let status: boolean;
    if (result.message != Literals.Ok) {

      // условие НЕудачной операции
      status = false;

      // установить данные о пользователе в сервисе-хранилище в значение
      // по умолчанию и передать изменённые данные всем подписчикам
      this._tokenService.token = Literals.empty;
      this._userService.user = new User();

      // удалить данные из хранилища
      localStorage.removeItem(Literals.jwt);
      localStorage.removeItem(Literals.user);

      // перейти к форме входа
      this._router.navigateByUrl(Literals.routeLogin)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

      console.log(`--AuthGuardService-refreshToken-FALSE-]`);

    } else {

      // условие удачной операции
      status = true;

      // сохраним данные о jwt-токене и пользователе в сервисах
      // и передать изменённые данные всем подписчикам
      this._tokenService.token = result.token;
      this._userService.user = result.user;

      // запишем данные в хранилище
      this._tokenService.saveTokenToLocalStorage()
      this._userService.saveUserToLocalStorage();

      console.log(`--AuthGuardService-refreshToken-TRUE-]`);
    } // if

    return [status, result.message];
  } // refreshToken

  /*async refreshToken2(): Promise<[boolean, any]> {
    console.log(`[-PasswordFormComponent-refreshToken--`);

    // получить данные о пользователе из сервиса-хранилища
    let user: User = this._userService.user;

    console.log(`--PasswordFormComponent-0.1-`);

    // запрос на обновление токена
    let result: { message: any, token: string, user: User } =
      await this._authGuardService.refreshToken(user);
    console.log(`--PasswordFormComponent-result:`);
    console.dir(result);

    console.log(`--PasswordFormComponent-0.2-`);

    // если сообщение с ошибкой - завершаем обработку,
    // из локального хранилища удаляем данные о токене и пользователе,
    // переходим в форму входа
    console.dir(result.message);
    if (result.message != Literals.Ok) {

      // выключение спиннера ожидания данных
      this.component.isWaitFlag = false;

      // сформируем соответствующее сообщение об ошибке
      //let message: string = Literals.empty;
      let message: string = Literals.empty;

      // ошибки данных
      if (result.message.refreshModel) message =
        Resources.incorrectUserIdData[this.component.language];

      // изменить результат на сообщение для вывода
      //result.message = message;

      // установить данные о пользователе в сервисе-хранилище в значение
      // по умолчанию и передать изменённые данные всем подписчикам
      this._userService.user = new User();

      // удалить данные из хранилища
      localStorage.removeItem(Literals.jwt);
      localStorage.removeItem(Literals.user);

      // перейти к форме входа
      this._router.navigateByUrl(Literals.routeLogin)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

      console.log(`--PasswordFormComponent-refreshToken-FALSE-]`);
      //return [false, result.message];
      return [false, message];
    } // if

    // иначе - сообщение об успехе
    result.message = Resources.refreshTokenOk[this.component.language];

    // сохраним данные о пользователе в сервисе-хранилище
    // и передать изменённые данные всем подписчикам
    this._userService.user = result.user;

    // запишем данные в хранилище
    this._authGuardService.saveTokenToLocalStorage(result.token)
    this._userService.saveUserToLocalStorage();

    console.log(`--PasswordFormComponent-refreshToken-TRUE-]`);
    return [true, result.message];
  } // refreshToken*/


  /*async refreshToken(user: User): Promise<{ message: any, token: string, user: User }> {
    console.log(`[-AuthGuardService-refreshToken--`);

    // ожидаем получения ответа на запрос
    let result: { message: any, token: string, user: User } =
      { message: Literals.Ok, token: Literals.empty, user: User.UserToDto(new User()) };
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.refreshPOST(Config.urlAuthRefresh, user)
      );
      console.dir(webResult);

      result.token = webResult.token;
      result.user  = User.newUser(webResult.user);

    } catch (e: any) {
      console.dir(e);
      console.dir(e.error);
      result.message = e.error;

      console.log(`--AuthGuardService-refreshToken-]`);
      return result;
    } // try-catch

    console.dir(result);
    console.dir(result.message);
    console.dir(result.token);
    console.dir(result.user);

    console.log(`--AuthGuardService-refreshToken-]`);

    return result;
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

} // class AuthGuardService
// ----------------------------------------------------------------------------
