// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "РАСПИСАНИЕ" (Schedule)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';
import {Utils} from '../../infrastructure/Utils';

export class WorkDay {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о рабочем дне
    private _id: number = Literals.zero,

    // данные о сотруднике
    private _employeeId: number = Literals.zero,

    // дата рабочего дня
    private _date: Date = new Date(),

    // признак того, что день рабочий
    // (true - рабочий, false - выходной)
    private _isWorking: boolean = false,

    // время начала рабочего дня
    private _startTime: string = Literals.zeroTime,

    // время окончания рабочего дня
    private _endTime: string = Literals.zeroTime,

    // дата и время удаления записи о рабочем дне
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get employeeId(): number { return this._employeeId; }
  set employeeId(value: number) { this._employeeId = value; }

  get date(): Date { return this._date; }
  set date(value: Date) { this._date = value; }

  get isWorking(): boolean { return this._isWorking; }
  set isWorking(value: boolean) { this._isWorking = value; }

  get startTime(): string { return this._startTime; }
  set startTime(value: string) { this._startTime = value; }

  get endTime(): string { return this._endTime; }
  set endTime(value: string) { this._endTime = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newWorkDay(srcWorkDay: WorkDay | any): WorkDay {
    return new WorkDay(
      srcWorkDay.id,
      srcWorkDay.employeeId,
      (typeof srcWorkDay.date) === Literals.string
        ? Utils.stringToDate(srcWorkDay.date)
        : srcWorkDay.date,
      srcWorkDay.isWorking,
      srcWorkDay.startTime.length < 5
        ? Utils.toTime(srcWorkDay.startTime)
        : srcWorkDay.startTime,
      srcWorkDay.endTime.length < 5
        ? Utils.toTime(srcWorkDay.endTime)
        : srcWorkDay.endTime,
      srcWorkDay.deleted
    ); // return
  } // newWorkDay


  // статический метод, возвращающий массив новых объектов-копий
  public static parseWorkDays(srcWorkDays: WorkDay[] | any[]): WorkDay[] {
    return srcWorkDays.map((workDay: WorkDay | any) => this.newWorkDay(workDay));
  } // parseWorkDays


  // статический метод, возвращающий объект-DTO
  public static WorkDayToDto(srcWorkDay: WorkDay): any {
    return {
      id:         srcWorkDay.id,
      employeeId: srcWorkDay.employeeId,
      date:       srcWorkDay.date,
      isWorking:  srcWorkDay.isWorking,
      startTime:  srcWorkDay.startTime,
      endTime:    srcWorkDay.endTime,
      deleted:    srcWorkDay.deleted
    }; // return
  } // WorkDayToDto


  // статический метод, возвращающий массив объектов-DTO
  public static WorkDaysToDto(srcWorkDays: WorkDay[]): any[] {
    return srcWorkDays.map((workDay: WorkDay) => this.WorkDayToDto(workDay));
  } // WorkDaysToDto

} // class WorkDay
// ----------------------------------------------------------------------------
