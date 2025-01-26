// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "ПОЛЬЗОВАТЕЛИ" (Users)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';
import {Role} from './Role';

export class User {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор пользователя
    private _id: number = Literals.zero,

    // имя пользователя
    private _userName: string = Literals.empty,

    // логин пользователя (логин=телефону)
    private _login: string = Literals.empty,

    // номер телефона пользователя
    private _phone: string = Literals.empty,

    // адрес электронной почты пользователя
    private _email: string = Literals.empty,

    // пароль учётной записи пользователя
    private _password: string = Literals.empty,

    // путь к файлу аватарки пользователя
    private _avatar: string = Literals.empty,

    // пользовательский токен
    private _userToken: string = Literals.empty,

    // состояние входа пользователя в учётную запись
    // (true - вошёл, false - вышел)
    private _isLogin: boolean = false,

    // роли пользователя
    private _roles: Role[] = []
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get userName(): string { return this._userName; }
  set userName(value: string) { this._userName = value; }

  get login(): string { return this._login; }
  set login(value: string) { this._login = value; }

  get phone(): string { return this._phone; }
  set phone(value: string) { this._phone = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get password(): string { return this._password; }
  set password(value: string) { this._password = value; }

  get avatar(): string { return this._avatar; }
  set avatar(value: string) { this._avatar = value; }

  get userToken(): string { return this._userToken; }
  set userToken(value: string) { this._userToken = value; }

  get isLogin(): boolean { return this._isLogin; }
  set isLogin(value: boolean) { this._isLogin = value; }

  get roles(): Role[] { return this._roles; }
  set roles(value: Role[]) { this._roles = Role.parseRoles(value); }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newUser(srcUser: User | any): User {
    return new User(
      srcUser.id,
      srcUser.userName,
      srcUser.login,
      srcUser.phone,
      srcUser.email,
      srcUser.password,
      srcUser.avatar,
      srcUser.userToken,
      srcUser.isLogin,
      Role.parseRoles(srcUser.roles)
    ); // return
  } // newUser


  // статический метод, возвращающий массив новых объектов-копий
  public static parseUsers(srcUsers: User[] | any[]): User[] {
    return srcUsers.map((user: User | any) => this.newUser(user));
  } // parseUsers


  // статический метод, возвращающий объект-DTO
  public static UserToDto(srcUser: User): any {
    return {
      id:        srcUser.id,
      userName:  srcUser.userName,
      login:     srcUser.login,
      phone:     srcUser.phone,
      email:     srcUser.email,
      password:  srcUser.password,
      avatar:    srcUser.avatar,
      userToken: srcUser.userToken,
      isLogin:   srcUser.isLogin,
      roles:     Role.RolesToDto(srcUser.roles)
    };
  } // UserToDto


  // статический метод, возвращающий массив объектов-DTO
  public static UsersToDto(srcUsers: User[]): any[] {
    return srcUsers.map((user: User) => this.UserToDto(user));
  } // UsersToDto


  // получить сведения о пользователе из локального хранилища
  public static loadUser(): User {

    // получить запись из хранилища, если она есть
    let userString: string | null = localStorage.getItem(Literals.user);
    console.log(`--User-loadUser-userString: ${userString}`);

    // если запись отсутствует, вернуть new User() с Id=0
    if (!userString) return new User();

    // получить объект Dto с данными о пользователе, если запись есть
    let userDto: any = JSON.parse(userString);
    console.log(`--User-loadUser-userDto-`);
    console.dir(userDto);

    let user: User = this.newUser(userDto);
    console.log(`--User-loadUser-user-`);
    console.dir(user);

    // вернуть объект User
    //return this.newUser(userDto);
    return user;

  } // loadUser

} // class User
// ----------------------------------------------------------------------------
