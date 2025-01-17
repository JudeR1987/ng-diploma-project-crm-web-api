// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "РОЛИ" (Roles)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';

export class Role {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор роли пользователя
    private _id: number = 0,

    // наименование роли пользователя
    private _name: string = Literals.empty
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newRole(srcRole: Role | any): Role {
    return new Role(srcRole.id, srcRole.name);
  } // newRole


  // статический метод, возвращающий массив новых объектов-копий
  public static parseRoles(srcRoles: Role[] | any[]): Role[] {
    return srcRoles.map((role: Role | any) => this.newRole(role));
  } // parseRoles


  // статический метод, возвращающий объект-DTO
  public static RoleToDto(srcRole: Role): any {
    return { id: srcRole.id, name: srcRole.name };
  } // RoleToDto


  // статический метод, возвращающий массив объектов-DTO
  public static RolesToDto(srcRoles: Role[]): any[] {
    return srcRoles.map((role: Role) => this.RoleToDto(role));
  } // RolesToDto

} // class Role
// ----------------------------------------------------------------------------
