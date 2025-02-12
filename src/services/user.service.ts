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
    console.log(`[-UserService-constructor--`);
    console.log(`*-(было)-this._user: -*`);
    console.dir(this._user);

    // прочитать данные о пользователе из локального хранилища
    this.loadUserFromLocalStorage();

    console.log(`--UserService-constructor-]`);
  } // constructor


  // чтение свойства (возвращаем копию данных
  // о пользователе из свойства-хранилища)
  get user(): User { return User.newUser(this._user); }


  // запись свойства (записываем данные о пользователе
  // в свойство-хранилище и передаём данные подписчикам)
  set user(value: User) {
    console.log(`[-UserService-set--`);

    console.log(`*-(было)-this._user: -*`);
    console.dir(this._user);

    // сохранить данные
    this._user = User.newUser(value);

    console.log(`*-(стало)-this._user: -*`);
    console.dir(this._user);

    // передать данные
    this.userSubject.next(value);

    console.log(`--UserService-set-]`);
  } // set


  // запись данных о пользователе в локальное хранилище
  saveUserToLocalStorage(): void {
    console.log(`[-UserService-saveUserToLocalStorage--`);

    localStorage.setItem(Literals.user, JSON.stringify(User.UserToDto(this._user)));

    console.log(`--UserService-saveUserToLocalStorage-]`);
  } // saveUserToLocalStorage


  // чтение данных о пользователе из локального хранилища
  loadUserFromLocalStorage(): void {

    console.log(`[-UserService-loadUserFromLocalStorage--`);

    // получить запись из хранилища, если она есть
    let userString: string | null = localStorage.getItem(Literals.user);
    console.log(`--UserService-loadUserFromLocalStorage-userString: ${userString}`);

    // если запись отсутствует, в свойство сервиса
    // установить значение new User() с Id=0
    if (!userString) {
      console.log(`*-(было)-this._user: -*`);
      console.dir(this._user);

      this._user = new User();
      console.log(`*-(стало)-this._user: -*`);
      console.dir(this._user);

      console.log(`--UserService-loadUserFromLocalStorage-]`);
      return;
    } // if

    // получить объект Dto с данными о пользователе, если запись есть
    let userDto: any = JSON.parse(userString);
    console.log(`--UserService-loadUserFromLocalStorage-userDto-`);
    console.dir(userDto);

    let user: User = User.newUser(userDto);
    console.log(`--UserService-loadUserFromLocalStorage-user-`);
    console.dir(user);

    // установить полученные данные в свойство сервиса
    console.log(`*-(было)-this._user: -*`);
    console.dir(this._user);
    this._user = user;
    console.log(`*-(стало)-this._user: -*`);
    console.dir(this._user);

    console.log(`--UserService-loadUserFromLocalStorage-]`);

  } // loadUserFromLocalStorage

} // class UserService
// ----------------------------------------------------------------------------
