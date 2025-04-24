// ----------------------------------------------------------------------------
// сервис аутентификации и авторизации пользователя
// ----------------------------------------------------------------------------
import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {User} from '../models/classes/User';
import {Literals} from '../infrastructure/Literals';
import {WebApiService} from './web-api.service';
import {Config} from '../infrastructure/Config';
import {LoginModel} from '../models/classes/LoginModel';
import {firstValueFrom, Subject} from 'rxjs';
import {UserService} from './user.service';
import {TokenService} from './token.service';
import {ErrorMessageService} from './error-message.service';
import {Resources} from '../infrastructure/Resources';
import {LanguageService} from './language.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  // конструктор с DI для подключения к маршрутизатору для получения маршрута,
  // подключения к web-сервису, подключения к сервисам хранения данных
  // о пользователе и jwt-токене, подключения к сервису хранения сообщения
  // об ошибке и подключения к сервису установки языка
  constructor(private _router: Router,
              private _webApiService: WebApiService,
              private _userService: UserService,
              private _tokenService: TokenService,
              private _errorMessageService: ErrorMessageService,
              private _languageService: LanguageService) {
  } // constructor


  // метод, контролирующий доступ к маршрутам
  // НЕ аутентифицированных пользователей
  canActivate() {

    // получить данные о пользователе
    let user: User = this._userService.user;

    // если токен есть и он действителен ИЛИ
    // данные о пользователе есть и произведён вход в систему, то
    // переход по маршруту разрешён
    if (this._tokenService.isTokenExists() || user.isLogin)
      return true;

    // иначе перенаправляем пользователя на форму входа в систему
    this._router.navigateByUrl(Literals.routeLogin)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    // сообщение об ошибке
    let message: string = Resources.requiredAuthorization[this._languageService.language];

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(message);

    return false;
  } // canActivate


  // запрос на вход в систему
  async login(loginModel: LoginModel): Promise<{ message: any, token: string, user: User }> {

    // ожидаем получения ответа на запрос
    let result: { message: any, token: string, user: User } =
      { message: Literals.Ok, token: Literals.empty, user: User.UserToDto(new User()) };
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.loginPOST(Config.urlAuthLogin, loginModel)
      );

      result.token = webResult.token;
      result.user  = User.newUser(webResult.user);
    }
    catch (e: any) {
      // если отсутствует соединение
      if (e.status === Literals.zero)
        result.message = Resources.noConnection[this._languageService.language];
      // другие ошибки
      else
        result.message = e.error;

      return result;
    } // try-catch

    return result;
  } // login


  // запрос на выход из системы
  async logOut(user: User): Promise<any> {

    // ожидаем получения ответа на запрос
    let message: any = Literals.Ok;
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.logOutPOST(Config.urlAuthLogOut, user)
      );
    }
    catch (e: any) {
      // если отсутствует соединение
      if (e.status === Literals.zero)
        message = Resources.noConnection[this._languageService.language];
      // другие ошибки
      else
        message = e.error;

      return message;
    } // try-catch

    return message;
  } // logOut


  // запрос на регистрацию в системе
  async registration(loginModel: LoginModel): Promise<any> {

    // ожидаем получения ответа на запрос
    let message: any = Literals.Ok;
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.registrationPOST(Config.urlAuthRegistration, loginModel)
      );
    }
    catch (e: any) {
      // если отсутствует соединение
      if (e.status === Literals.zero)
        message = Resources.noConnection[this._languageService.language];
      // другие ошибки
      else
        message = e.error;

      return message;
    } // try-catch

    return message;
  } // registration


  // запрос на обновление jwt-токена
  async refreshToken(): Promise<[boolean, string]> {

    // получить данные о пользователе из сервиса-хранилища
    let user: User = this._userService.user;

    // ожидаем получения ответа на запрос
    let result: { message: any, token: string, user: User } =
      { message: Literals.Ok, token: Literals.empty, user: User.UserToDto(new User()) };
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.refreshPOST(Config.urlAuthRefresh, user)
      );

      result.token = webResult.token;
      result.user  = User.newUser(webResult.user);
    }
    catch (e: any) {
      // если отсутствует соединение
      if (e.status === Literals.zero)
        result.message = Resources.noConnection[this._languageService.language];
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    // если сообщение с ошибкой - завершаем обработку,
    // из локального хранилища удаляем данные о токене и пользователе,
    // переходим в форму входа
    let status: boolean;
    if (result.message != Literals.Ok) {

      // условие НЕ_удачной операции
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
    }
    else {
      // условие удачной операции
      status = true;

      // сохраним данные о jwt-токене и пользователе в сервисах
      // и передать изменённые данные всем подписчикам
      this._tokenService.token = result.token;
      this._userService.user = result.user;

      // запишем данные в хранилище
      this._tokenService.saveTokenToLocalStorage()
      this._userService.saveUserToLocalStorage();

    } // if

    return [status, result.message];
  } // refreshToken

} // class AuthGuardService
// ----------------------------------------------------------------------------
