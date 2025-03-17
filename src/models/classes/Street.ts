// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "УЛИЦЫ" (Streets)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';

export class Street {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи об улице
    private _id: number = Literals.zero,

    // наименование улицы
    private _name: string = Literals.empty,

    // дата и время удаления записи об улице
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newStreet(srcStreet: Street | any): Street {
    return new Street(
      srcStreet.id,
      srcStreet.name,
      srcStreet.deleted
    ); // return
  } // newStreet


  // статический метод, возвращающий массив новых объектов-копий
  public static parseStreets(srcStreets: Street[] | any[]): Street[] {
    return srcStreets.map((street: Street | any) => this.newStreet(street));
  } // parseStreets


  // статический метод, возвращающий объект-DTO
  public static StreetToDto(srcStreet: Street): any {
    return {
      id:      srcStreet.id,
      name:    srcStreet.name,
      deleted: srcStreet.deleted
    }; // return
  } // StreetToDto


  // статический метод, возвращающий массив объектов-DTO
  public static StreetsToDto(srcStreets: Street[]): any[] {
    return srcStreets.map((street: Street) => this.StreetToDto(street));
  } // StreetsToDto

} // class Street
// ----------------------------------------------------------------------------
