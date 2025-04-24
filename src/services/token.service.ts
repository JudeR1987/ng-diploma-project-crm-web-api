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

    // создание нового объекта jwt-помощника
    this._jwtHelper = new JwtHelperService();

    // прочитать данные о jwt-токене из локального хранилища
    this.loadTokenFromLocalStorage();

  } // constructor


  // чтение свойства
  get token(): string { return this._token; }


  // запись свойства
  set token(value: string) { this._token = value; }


  // чтение данных о токене из локального хранилища
  loadTokenFromLocalStorage(): void {

    // получить jwt-токен из хранилища, если запись есть
    this._token = localStorage.getItem(Literals.jwt) ?? Literals.empty;

  } // loadTokenFromLocalStorage


  // запись данных о токене в локальное хранилище
  saveTokenToLocalStorage(): void {
    localStorage.setItem(Literals.jwt, this._token);
  } // saveTokenToLocalStorage


  // метод, проверяющий наличие и срок действия токена безопасности
  isTokenExists(): boolean {
    //return (this._token && !this._jwtHelper.isTokenExpired(this._token)) ? true : false;
    return !!(this._token && !this._jwtHelper.isTokenExpired(this._token));
  } // isTokenExists

} // class TokenService
// ----------------------------------------------------------------------------
