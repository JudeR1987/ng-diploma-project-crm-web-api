// ----------------------------------------------------------------------------
// класс, содержащий данные пользователя при регистрации/входе в систему
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';

export class LoginModel {

  // конструктор с параметрами по умолчанию
  constructor(
    // логин пользователя (логин=телефону)
    private _login: string = Literals.empty,

    // номер телефона пользователя
    private _phone: string = Literals.empty,

    // email пользователя
    private _email: string = Literals.empty,

    // пароль пользователя
    private _password: string = Literals.empty
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get login(): string { return this._login; }
  set login(value: string) { this._login = value; }

  get phone(): string { return this._phone; }
  set phone(value: string) { this._phone = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get password(): string { return this._password; }
  set password(value: string) { this._password = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newLoginModel(srcLoginModel: LoginModel | any): LoginModel {
    return new LoginModel(
      srcLoginModel.login,
      srcLoginModel.phone,
      srcLoginModel.email,
      srcLoginModel.password
    ); // return
  } // newLoginModel


  // статический метод, возвращающий массив новых объектов-копий
  public static parseLoginModels(srcLoginModels: LoginModel[] | any[]): LoginModel[] {
    return srcLoginModels.map((loginModel: LoginModel | any) =>
      this.newLoginModel(loginModel));
  } // parseLoginModels


  // статический метод, возвращающий объект-DTO
  public static LoginModelToDto(srcLoginModel: LoginModel): any {
    return {
      login: srcLoginModel.login,
      phone: srcLoginModel.phone,
      email: srcLoginModel.email,
      password: srcLoginModel.password,
    };
  } // LoginModelToDto

} // class LoginModel
// ----------------------------------------------------------------------------
