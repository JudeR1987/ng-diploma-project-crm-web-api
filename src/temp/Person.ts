// ----------------------------------------------------------------------------

// класс, представляющий сведения о записи в таблице "ПЕРСОНЫ" (People)
export class Person {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о персональных данных
    private _id: number = 0,

    // фамилия персоны
    private _surname: string = "",

    // имя персоны
    private _name: string = "",

    // отчество персоны
    private _patronymic: string = ""
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get surname(): string { return this._surname; }
  set surname(value: string) { this._surname = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get patronymic(): string { return this._patronymic; }
  set patronymic(value: string) { this._patronymic = value; }


  // вычисляемое свойство
  // Ф.И.О. персоны
  get fullName(): string {
    return `${(this._surname != null && this._surname != '') ? `${this._surname} ` : ''}` +
           `${(this._name != null && this._name != '') ? `${this._name[0]}.` : ''}` +
           `${(this._patronymic != null && this._patronymic != '') ? `${this._patronymic[0]}.` : ''}`;
  } // get

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newPerson(srcPerson: Person | any): Person {
    return new Person(
      srcPerson.id,
      srcPerson.surname,
      srcPerson.name,
      srcPerson.patronymic
    ); // return
  } // newPerson


  // статический метод, возвращающий массив новых объектов-копий
  public static parsePeople(srcPeople: Person[] | any[]): Person[] {
    return srcPeople.map((person: Person | any) => this.newPerson(person));
  } // parsePeople

} // class Person

// ----------------------------------------------------------------------------
