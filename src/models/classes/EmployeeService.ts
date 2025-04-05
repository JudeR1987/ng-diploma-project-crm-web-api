// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице
// "СОТРУДНИКИ_УСЛУГИ" (EmployeesServices)
// (связь между конкретными сотрудником и услугой)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';

export class EmployeeService {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор связи
    private _id: number = Literals.zero,

    // идентификатор записи данных о сотруднике
    private _employeeId: number = Literals.zero,

    // идентификатор записи данных об услуге
    private _serviceId: number = Literals.zero,

    // дата и время удаления записи о связи
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get employeeId(): number { return this._employeeId; }
  set employeeId(value: number) { this._employeeId = value; }

  get serviceId(): number { return this._serviceId; }
  set serviceId(value: number) { this._serviceId = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  //#endregion


  // статический метод, возвращающий новый объект,
  // созданный по идентификаторам сотрудника и услуги
  public static newEmployeeServiceByIds(employeeId: number, serviceId: number): EmployeeService {
    return new EmployeeService(Literals.zero, employeeId, serviceId, null);
  } // newEmployeeService


  // статический метод, возвращающий новый объект-копию
  public static newEmployeeService(srcEmployeeService: EmployeeService | any): EmployeeService {
    return new EmployeeService(
      srcEmployeeService.id,
      srcEmployeeService.employeeId,
      srcEmployeeService.serviceId,
      srcEmployeeService.deleted
    ); // return
  } // newEmployeeService


  // статический метод, возвращающий массив новых объектов-копий
  public static parseEmployeesServices(srcEmployeesServices: EmployeeService[] | any[]): EmployeeService[] {
    return srcEmployeesServices.map((employeeService: EmployeeService | any) => this.newEmployeeService(employeeService));
  } // parseEmployeesServices


  // статический метод, возвращающий объект-DTO
  public static EmployeeServiceToDto(srcEmployeeService: EmployeeService): any {
    return {
      id:         srcEmployeeService.id,
      employeeId: srcEmployeeService.employeeId,
      serviceId:  srcEmployeeService.serviceId,
      deleted:    srcEmployeeService.deleted
    };
  } // EmployeeServiceToDto


  // статический метод, возвращающий массив объектов-DTO
  public static EmployeesServicesToDto(srcEmployeesServices: EmployeeService[]): any[] {
    return srcEmployeesServices.map((employeeService: EmployeeService) => this.EmployeeServiceToDto(employeeService));
  } // EmployeesServicesToDto

} // class EmployeeService
// ----------------------------------------------------------------------------
