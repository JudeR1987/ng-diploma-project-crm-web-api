// ----------------------------------------------------------------------------
// класс для отображения сведений о записи в таблице "ПРОМЕЖУТКИ_ВРЕМЕНИ" (Slots)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';

export class DisplayWorkDay {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о промежутке времени
    private _id: number = Literals.zero,

    // начало промежутка времени
    private _from: string = Literals.empty,

    // длина промежутка времени в секундах
    private _length: number = Literals.zero,

    // признак отношения промежутка к перерыву
    // (true - относится к перерыву, false - НЕ_относится к перерыву)
    private _isBreak: boolean = false,

    // дата и время удаления записи о промежутке времени
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get from(): string { return this._from; }
  set from(value: string) { this._from = value; }

  get length(): number { return this._length; }
  set length(value: number) { this._length = value; }

  get isBreak(): boolean { return this._isBreak; }
  set isBreak(value: boolean) { this._isBreak = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  // вычисляемое свойство
  // конец промежутка времени
  get To(): string {
    let items: string[] = this._from.split(Literals.doublePoint);
    let hours: number   = +items[0];
    let minutes: number = +items[1];

    // к минутам добавить длительность(которая в секундах)
    minutes += this._length / 60;

    // увеличивать значение часов, пока значение минут больше одного часа
    while (minutes >= 60) {
      minutes -= 60;
      hours++;
    } // while

    return `${hours}:${minutes}`;
  } // get

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newDisplaySlot(srcDisplaySlot: DisplaySlot | any): DisplaySlot {
    return new DisplaySlot(
      srcDisplaySlot.id,
      srcDisplaySlot.from,
      srcDisplaySlot.length,
      srcDisplaySlot.isBreak,
      srcDisplaySlot.deleted
    ); // return
  } // newDisplaySlot


  // статический метод, возвращающий массив новых объектов-копий
  public static parseDisplaySlots(srcDisplaySlots: DisplaySlot[] | any[]): DisplaySlot[] {
    return srcDisplaySlots.map((displaySlot: DisplaySlot | any) => this.newDisplaySlot(displaySlot));
  } // parseDisplaySlots


  // статический метод, возвращающий объект-DTO
  public static DisplaySlotToDto(srcDisplaySlot: DisplaySlot): any {
    return {
      id:      srcDisplaySlot.id,
      from:    srcDisplaySlot.from,
      length:  srcDisplaySlot.length,
      isBreak: srcDisplaySlot.isBreak,
      deleted: srcDisplaySlot.deleted
    }; // return
  } // DisplaySlotToDto


  // статический метод, возвращающий массив объектов-DTO
  public static DisplaySlotsToDto(srcDisplaySlots: DisplaySlot[]): any[] {
    return srcDisplaySlots.map((displaySlot: DisplaySlot) => this.DisplaySlotToDto(displaySlot));
  } // DisplaySlotsToDto


  // статический метод, возвращающий объект
  // с интерфейсом для отображения в списке выбора
  /*public static newCountryToSelect(srcCountry: Country): { id: number, name: string } {
    return { id: srcCountry.id, name: srcCountry.name };
  } // newCountryToSelect*/


  // статический метод, возвращающий массив объектов
  // с интерфейсом для отображения в списке выбора
  /*public static parseCountriesToSelect(srcCountries: Country[]): { id: number, name: string }[] {
    return srcCountries.map((country: Country) => this.newCountryToSelect(country));
  } // parseCountriesToSelect*/

} // class DisplayWorkDay
// ----------------------------------------------------------------------------
