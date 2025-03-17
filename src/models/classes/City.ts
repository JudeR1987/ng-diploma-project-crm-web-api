// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "ГОРОДА" (Cities)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';
import {Country} from './Country';

export class City {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о городе
    private _id: number = Literals.zero,

    // наименование города
    private _name: string = Literals.empty,

    // идентификатор записи о стране принадлежности
    //private _countryId: number = Literals.zero,

    // данные о стране принадлежности
    private _country: Country = new Country(),

    // дата и время удаления записи о городе
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get country(): Country { return this._country; }
  set country(value: Country) { this._country = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newCity(srcCity: City | any): City {
    return new City(
      srcCity.id,
      srcCity.name,
      Country.newCountry(srcCity.country),
      srcCity.deleted
    ); // return
  } // newCity


  // статический метод, возвращающий массив новых объектов-копий
  public static parseCities(srcCities: City[] | any[]): City[] {
    return srcCities.map((city: City | any) => this.newCity(city));
  } // parseCities


  // статический метод, возвращающий объект-DTO
  public static CityToDto(srcCity: City): any {
    return {
      id:      srcCity.id,
      name:    srcCity.name,
      country: Country.CountryToDto(srcCity.country),
      deleted: srcCity.deleted
    }; // return
  } // CityToDto


  // статический метод, возвращающий массив объектов-DTO
  public static CitiesToDto(srcCities: City[]): any[] {
    return srcCities.map((city: City) => this.CityToDto(city));
  } // CitiesToDto


  // статический метод, возвращающий объект
  // с интерфейсом для отображения в списке выбора
  public static newCityToSelect(srcCity: City): { id: number, name: string } {
    return { id: srcCity.id, name: srcCity.name };
  } // newCityToSelect


  // статический метод, возвращающий массив объектов
  // с интерфейсом для отображения в списке выбора
  public static parseCitiesToSelect(srcCities: City[]): { id: number, name: string }[] {
    return srcCities.map((city: City) => this.newCityToSelect(city));
  } // parseCitiesToSelect

} // class City
// ----------------------------------------------------------------------------
