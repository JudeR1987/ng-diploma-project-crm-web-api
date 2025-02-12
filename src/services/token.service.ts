// ----------------------------------------------------------------------------
// сервис хранения данных о токене безопасности (jwt-токен)
// ----------------------------------------------------------------------------
import {Injectable} from '@angular/core';
import {Literals} from '../infrastructure/Literals';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // свойство для хранения данных о jwt-токене
  private _token: string = Literals.empty;

  // объект сервиса-помощника при работе с jwt-токеном
  private _jwtHelper: JwtHelperService;


  // в конструкторе получим исходные данные о jwt-токене
  constructor() {
    console.log(`[-TokenService-constructor--`);

    // создание нового объекта jwt-помощника
    this._jwtHelper = new JwtHelperService();

    console.log(`*-(было)-this._token: '${this._token}' -*`);

    // прочитать данные о jwt-токене из локального хранилища
    this.loadTokenFromLocalStorage();

    console.log(`*-(стало)-this._token: '${this._token}' -*`);

    console.log(`--TokenService-constructor-]`);
  } // constructor


  // чтение свойства
  get token(): string { return this._token; }


  // запись свойства
  set token(value: string) {
    console.log(`[-TokenService-set--`);

    console.log(`*-(было)-this._token: '${this._token}' -*`);

    // сохранить данные
    this._token = value;

    console.log(`*-(стало)-this._token: '${this._token}' -*`);

    console.log(`--TokenService-set-]`);
  } // set


  // чтение данных о токене из локального хранилища
  loadTokenFromLocalStorage(): void {
    console.log(`[-TokenService-loadTokenFromLocalStorage--`);

    // получить jwt-токен из хранилища, если запись есть
    console.log(`*-(было)-this._token: '${this._token}' -*`);
    this._token = localStorage.getItem(Literals.jwt) ?? Literals.empty;
    console.log(`*-(стало)-this._token: '${this._token}' -*`);

    console.log(`--TokenService-loadTokenFromLocalStorage-]`);
  } // loadTokenFromLocalStorage


  // запись данных о токене в локальное хранилище
  saveTokenToLocalStorage(): void {
    console.log(`[-TokenService-saveTokenToLocalStorage--`);

    localStorage.setItem(Literals.jwt, this._token);

    console.log(`--TokenService-saveTokenToLocalStorage-]`);
  } // saveTokenToLocalStorage


  // метод, проверяющий наличие и срок действия токена безопасности
  isTokenExists(): boolean {
    console.log(`[-TokenService-isTokenExists--`);

    // получить jwt-токен
    console.log(`*- this._token: '${this._token}' -*`);

    console.log(`*- (token && !this._jwtHelper.isTokenExpired(token):
    '${(this._token && !this._jwtHelper.isTokenExpired(this._token))}' -*`);

    console.log(`--TokenService-isTokenExists-]`);

    //return (token && !this._jwtHelper.isTokenExpired(token)) ? true : false;
    return !!(this._token && !this._jwtHelper.isTokenExpired(this._token));
  } // isTokenExists

} // class TokenService
// ----------------------------------------------------------------------------
