// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "АДРЕСА" (Addresses)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';
import {City} from './City';
import {Street} from './Street';

export class Address {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи об адресе
    private _id: number = Literals.zero,

    // данные о городе
    private _city: City = new City(),

    // данные об улице
    private _street: Street = new Street(),

    // дом/строение
    private _building: string = Literals.empty,

    // квартира(возможно её отсутствие)
    private _flat: number | null = null,

    // дата и время удаления записи об адресе
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get city(): City { return this._city; }
  set city(value: City) { this._city = value; }

  get street(): Street { return this._street; }
  set street(value: Street) { this._street = value; }

  get building(): string { return this._building; }
  set building(value: string) { this._building = value; }

  get flat(): number | null { return this._flat; }
  set flat(value: number | null) { this._flat = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newAddress(srcAddress: Address | any): Address {
    return new Address(
      srcAddress.id,
      City.newCity(srcAddress.city),
      Street.newStreet(srcAddress.street),
      srcAddress.building,
      srcAddress.flat,
      srcAddress.deleted
    ); // return
  } // newAddress


  // статический метод, возвращающий массив новых объектов-копий
  public static parseAddresses(srcAddresses: Address[] | any[]): Address[] {
    return srcAddresses.map((address: Address | any) => this.newAddress(address));
  } // parseAddresses


  // статический метод, возвращающий объект-DTO
  public static AddressToDto(srcAddress: Address): any {
    return {
      id:       srcAddress.id,
      city:     City.CityToDto(srcAddress.city),
      street:   Street.StreetToDto(srcAddress.street),
      building: srcAddress.building,
      flat:     srcAddress.flat,
      deleted:  srcAddress.deleted
    }; // return
  } // AddressToDto


  // статический метод, возвращающий массив объектов-DTO
  public static AddressesToDto(srcAddresses: Address[]): any[] {
    return srcAddresses.map((address: Address) => this.AddressToDto(address));
  } // AddressesToDto

} // class Address
// ----------------------------------------------------------------------------
