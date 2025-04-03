// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "СОТРУДНИКИ" (Employees)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';
import {User} from './User';
import {Company} from './Company';
import {Specialization} from './Specialization';
import {Position} from './Position';
import {Service} from './Service';

export class Employee {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о сотруднике
    private _id: number = Literals.zero,

    // имя сотрудника                     // <-- используем имя пользователя
    // private _name: string = Literals.empty,

    // данные о пользователе
    private _user: User = new User(),

    // идентификатор записи данных о пользователе
    //private _userId: number = Literals.zero,

    // данные о компании
    private _company: Company = new Company(),

    // данные о специальности
    private _specialization: Specialization = new Specialization(),

    // данные о должности
    private _position: Position = new Position(),

    // рейтинг сотрудника (от 0 до 5)
    private _rating: number = Literals.zero,

    // путь к файлу аватарки сотрудника
    private _avatar: string = Literals.empty,

    // дата и время удаления записи о сотруднике
    private _deleted: Date | null = null,

    // услуги, предоставляемые сотрудником
    private _services: Service[] = []
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  /*get name(): string { return this._name; }
  set name(value: string) { this._name = value; }*/

  get user(): User { return this._user; }
  set user(value: User) { this._user = value; }

  /*get userId(): number { return this._userId; }
  set userId(value: number) { this._userId = value; }*/

  get company(): Company { return this._company; }
  set company(value: Company) { this._company = value; }

  get specialization(): Specialization { return this._specialization; }
  set specialization(value: Specialization) { this._specialization = value; }

  get position(): Position { return this._position; }
  set position(value: Position) { this._position = value; }

  get rating(): number { return this._rating; }
  set rating(value: number) { this._rating = value; }

  get avatar(): string { return this._avatar; }
  set avatar(value: string) { this._avatar = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  get services(): Service[] { return this._services; }
  set services(value: Service[]) { this._services = Service.parseServices(value); }

  // вычисляемое свойство
  // имя файла аватарки сотрудника
  get fileName(): string {
    let items: string[] = this._avatar.split(Literals.slash);
    return items[items.length - 1];
  } // get

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newEmployee(srcEmployee: Employee | any): Employee {
    return new Employee(
      srcEmployee.id,
      //srcEmployee.name,
      //srcEmployee.userId,
      User.newUser(srcEmployee.user),
      Company.newCompany(srcEmployee.company),
      Specialization.newSpecialization(srcEmployee.specialization),
      Position.newPosition(srcEmployee.position),
      srcEmployee.rating,
      srcEmployee.avatar,
      srcEmployee.deleted,
      Service.parseServices(srcEmployee.services)
    ); // return
  } // newEmployee


  // статический метод, возвращающий массив новых объектов-копий
  public static parseEmployees(srcEmployees: Employee[] | any[]): Employee[] {
    return srcEmployees.map((employee: Employee | any) => this.newEmployee(employee));
  } // parseEmployees


  // статический метод, возвращающий объект-DTO
  public static EmployeeToDto(srcEmployee: Employee): any {
    return {
      id:             srcEmployee.id,
      //name:           srcEmployee.name,
      //userId:         srcEmployee.userId,
      user:           User.UserToDto(srcEmployee.user),
      company:        Company.CompanyToDto(srcEmployee.company),
      specialization: Specialization.SpecializationToDto(srcEmployee.specialization),
      position:       Position.PositionToDto(srcEmployee.position),
      rating:         srcEmployee.rating,
      avatar:         srcEmployee.avatar,
      deleted:        srcEmployee.deleted,
      services:       Service.ServicesToDto(srcEmployee.services)
    };
  } // EmployeeToDto


  // статический метод, возвращающий массив объектов-DTO
  public static EmployeesToDto(srcEmployees: Employee[]): any[] {
    return srcEmployees.map((employee: Employee) => this.EmployeeToDto(employee));
  } // EmployeesToDto

} // class Employee
// ----------------------------------------------------------------------------
