// ----------------------------------------------------------------------------
// сервис хранения данных о пользователе для передачи этих данных,
// подписавшимся на изменения компонентам
// ----------------------------------------------------------------------------
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {User} from '../models/classes/User';
import {Literals} from '../infrastructure/Literals';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // свойство для хранения данных о пользователе
  private _user: User = new User();

  // объект для передачи данных о пользователе
  public userSubject: Subject<User> = new Subject<User>();


  // в конструкторе получим исходные данные о пользователе
  constructor() {

    // прочитать данные о пользователе из локального хранилища
    this.loadUserFromLocalStorage();

  } // constructor


  // чтение свойства (возвращаем копию данных
  // о пользователе из свойства-хранилища)
  get user(): User { return User.newUser(this._user); }


  // запись свойства (записываем данные о пользователе
  // в свойство-хранилище и передаём данные подписчикам)
  set user(value: User) {

    // сохранить данные
    this._user = User.newUser(value);

    // передать данные
    this.userSubject.next(value);

  } // set


  // запись данных о пользователе в локальное хранилище
  saveUserToLocalStorage(): void {
    localStorage.setItem(Literals.user, JSON.stringify(User.UserToDto(this._user)));
  } // saveUserToLocalStorage


  // чтение данных о пользователе из локального хранилища
  loadUserFromLocalStorage(): void {

    // получить запись из хранилища, если она есть
    let userString: string | null = localStorage.getItem(Literals.user);

    // если запись отсутствует, в свойство сервиса
    // установить значение new User() с Id=0
    if (!userString) {
      this._user = new User();

      return;
    } // if

    // получить объект Dto с данными о пользователе, если запись есть
    let userDto: any = JSON.parse(userString);

    // установить полученные данные в свойство сервиса
    this._user = User.newUser(userDto);

  } // loadUserFromLocalStorage

} // class UserService
// ----------------------------------------------------------------------------
