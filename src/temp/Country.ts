// ----------------------------------------------------------------------------

// класс, представляющий сведения о записи в таблице "СТРАНЫ" (Countries)
export class Country {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор страны пребывания
    private _id: number = 0,

    // наименование страны пребывания
    private _name: string = "",

    // стоимость транспортных услуг, руб.
    private _transportCost: number = 0,

    // стоимость оформления визы, руб.
    private _visaCost: number = 0,

    // стоимость одного дня пребывания в стране, руб.
    // (зависит от страны назначения)
    private _countryDayCost: number = 0
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get transportCost(): number { return this._transportCost; }
  set transportCost(value: number) { this._transportCost = value; }

  get visaCost(): number { return this._visaCost; }
  set visaCost(value: number) { this._visaCost = value; }

  get countryDayCost(): number { return this._countryDayCost; }
  set countryDayCost(value: number) { this._countryDayCost = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newCountry(srcCountry: Country | any): Country {
    return new Country(
      srcCountry.id,
      srcCountry.name,
      srcCountry.transportCost,
      srcCountry.visaCost,
      srcCountry.countryDayCost
    ); // return
  } // newCountry


  // статический метод, возвращающий массив новых объектов-копий
  public static parseCountries(srcCountries: Country[] | any[]): Country[] {
    return srcCountries.map((country: Country | any) => this.newCountry(country));
  } // parseCountries

} // class Country

// ----------------------------------------------------------------------------
