// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "ПРОМЕЖУТКИ_ВРЕМЕНИ" (Slots)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';
import {Utils} from '../../infrastructure/Utils';

export class Slot {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о промежутке времени
    private _id: number = Literals.zero,

    // начало промежутка времени
    private _from: string = Literals.zeroTime,

    // длина промежутка времени в секундах
    private _length: number = Literals.zero,

    // признак отношения промежутка к перерыву
    // (true - относится к перерыву, false - НЕ_относится к перерыву)
    //private _isBreak: boolean = false,

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

  // свойство длины промежутка времени в минутах
  get lengthInMinutes(): number { return this._length / 60; }
  set lengthInMinutes(value: number) { this._length = value * 60; }

  /*get isBreak(): boolean { return this._isBreak; }
  set isBreak(value: boolean) { this._isBreak = value; }*/

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  // вычисляемое свойство
  // конец промежутка времени
  get to(): string {
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

    let time: string = `${hours}:${minutes}`;

    // проверка на формат "00:00"
    if (time.length < 5) time = Utils.toTime(time);

    return time;
  } // get

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newSlot(srcSlot: Slot | any): Slot {
    return new Slot(
      srcSlot.id,
      srcSlot.from.length < 5
        ? Utils.toTime(srcSlot.from)
        : srcSlot.from,
      srcSlot.length,
      //srcDisplaySlot.isBreak,
      srcSlot.deleted
    ); // return
  } // newSlot


  // статический метод, возвращающий массив новых объектов-копий
  public static parseSlots(srcSlots: Slot[] | any[]): Slot[] {
    return srcSlots.map((slot: Slot | any) => this.newSlot(slot));
  } // parseSlots


  // статический метод, возвращающий объект-DTO
  public static SlotToDto(srcSlot: Slot): any {
    return {
      id:      srcSlot.id,
      from:    srcSlot.from,
      length:  srcSlot.length,
      //isBreak: srcDisplaySlot.isBreak,
      deleted: srcSlot.deleted
    }; // return
  } // SlotToDto


  // статический метод, возвращающий массив объектов-DTO
  public static SlotsToDto(srcSlots: Slot[]): any[] {
    return srcSlots.map((slot: Slot) => this.SlotToDto(slot));
  } // SlotsToDto


  // метод, сравнивающий время начала промежутка с заданным временем
  // true - время промежутка больше, false - время промежутка меньше
  public compareTime(date: Date): boolean {

    let hoursSlot: number = +this.from.split(Literals.doublePoint)[0];
    let minutesSlot: number = +this.from.split(Literals.doublePoint)[1];

    let hoursDate: number = date.getHours();
    let minutesDate: number = date.getMinutes();

    if (hoursSlot < hoursDate) {
      return false;
    } else if (hoursSlot > hoursDate) {
      return true;
    } else
      return minutesSlot > minutesDate; // if

  } // compareTime


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

} // class DisplaySlot
// ----------------------------------------------------------------------------
