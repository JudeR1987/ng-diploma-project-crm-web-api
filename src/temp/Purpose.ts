// ----------------------------------------------------------------------------

// класс, представляющий сведения о записи в таблице "ЦЕЛИ" (Purposes)
export class Purpose {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор цели поездки
    private _id: number = 0,

    // наименование цели поездки
    private _name: string = "",

    // стоимость одного дня пребывания в зависимости от цели поездки, руб.
    // (не зависит от страны назначения)
    private _purposeDayCost: number = 0
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get purposeDayCost(): number { return this._purposeDayCost; }
  set purposeDayCost(value: number) { this._purposeDayCost = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newPurpose(srcPurpose: Purpose | any): Purpose {
    return new Purpose(
      srcPurpose.id,
      srcPurpose.name,
      srcPurpose.purposeDayCost
    ); // return
  } // newPurpose


  // статический метод, возвращающий массив новых объектов-копий
  public static parsePurposes(srcPurposes: Purpose[] | any[]): Purpose[] {
    return srcPurposes.map((purpose: Purpose | any) => this.newPurpose(purpose));
  } // parsePurposes

} // class Purpose

// ----------------------------------------------------------------------------
