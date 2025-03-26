// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "СПЕЦИАЛЬНОСТИ" (Specializations)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';

export class Specialization {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о специальности
    private _id: number = Literals.zero,

    // наименование специальности
    private _name: string = Literals.empty,

    // дата и время удаления записи о специальности
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
  public static newSpecialization(srcSpecialization: Specialization | any): Specialization {
    return new Specialization(
      srcSpecialization.id,
      srcSpecialization.name,
      srcSpecialization.deleted
    ); // return
  } // newSpecialization


  // статический метод, возвращающий массив новых объектов-копий
  public static parseSpecializations(srcSpecializations: Specialization[] | any[]): Specialization[] {
    return srcSpecializations.map((specialization: Specialization | any) => this.newSpecialization(specialization));
  } // parseSpecializations


  // статический метод, возвращающий объект-DTO
  public static SpecializationToDto(srcSpecialization: Specialization): any {
    return {
      id:      srcSpecialization.id,
      name:    srcSpecialization.name,
      deleted: srcSpecialization.deleted
    }; // return
  } // SpecializationToDto


  // статический метод, возвращающий массив объектов-DTO
  public static SpecializationsToDto(srcSpecializations: Specialization[]): any[] {
    return srcSpecializations.map((specialization: Specialization) => this.SpecializationToDto(specialization));
  } // SpecializationsToDto


  // статический метод, возвращающий объект
  // с интерфейсом для отображения в списке выбора
  public static newSpecializationToSelect(srcSpecialization: Specialization): { id: number, name: string } {
    return { id: srcSpecialization.id, name: srcSpecialization.name };
  } // newSpecializationToSelect


  // статический метод, возвращающий массив объектов
  // с интерфейсом для отображения в списке выбора
  public static parseSpecializationsToSelect(srcSpecializations: Specialization[]): { id: number, name: string }[] {
    return srcSpecializations.map((specialization: Specialization) => this.newSpecializationToSelect(specialization));
  } // parseSpecializationsToSelect

} // class Specialization
// ----------------------------------------------------------------------------
