// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "СТРАНЫ" (Countries)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';

export class Country {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о стране
    private _id: number = Literals.zero,

    // наименование страны
    private _name: string = Literals.empty,

    // дата и время удаления записи о стране
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
  public static newCountry(srcCountry: Country | any): Country {
    return new Country(
      srcCountry.id,
      srcCountry.name,
      srcCountry.deleted
    ); // return
  } // newCountry


  // статический метод, возвращающий массив новых объектов-копий
  public static parseCountries(srcCountries: Country[] | any[]): Country[] {
    return srcCountries.map((country: Country | any) => this.newCountry(country));
  } // parseCountries


  // статический метод, возвращающий объект-DTO
  public static CountryToDto(srcCountry: Country): any {
    return {
      id:      srcCountry.id,
      name:    srcCountry.name,
      deleted: srcCountry.deleted
    }; // return
  } // CountryToDto


  // статический метод, возвращающий массив объектов-DTO
  public static CountriesToDto(srcCountries: Country[]): any[] {
    return srcCountries.map((country: Country) => this.CountryToDto(country));
  } // CountriesToDto


  // статический метод, возвращающий объект
  // с интерфейсом для отображения в списке выбора
  public static newCountryToSelect(srcCountry: Country): { id: number, name: string } {
    return { id: srcCountry.id, name: srcCountry.name };
  } // newCountryToSelect


  // статический метод, возвращающий массив объектов
  // с интерфейсом для отображения в списке выбора
  public static parseCountriesToSelect(srcCountries: Country[]): { id: number, name: string }[] {
    return srcCountries.map((country: Country) => this.newCountryToSelect(country));
  } // parseCountriesToSelect

} // class Country
// ----------------------------------------------------------------------------
