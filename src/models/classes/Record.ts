// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "ЗАПИСИ_НА_СЕАНС" (Records)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';
import {Employee} from './Employee';
import {Client} from './Client';

export class Record {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи на сеанс
    private _id: number = Literals.zero,

    // данные о сотруднике
    private _employee: Employee = new Employee(),

    // данные о клиенте
    private _client: Client = new Client(),

    // дата и время начала записи на сеанс
    private _date: Date = new Date(),

    // дата и время создания записи
    private _createDate: Date = new Date(),

    // длительность сеанса(в секундах)
    private _length: number = Literals.zero,

    // комментарий к записи на сеанс
    private _comment: string | null = null,

    // статус посещения клиентом записи на сеанс
    // -1 - клиент не пришёл на визит,
    //  0 - ожидание клиента,
    //  1 - клиент пришёл, услуги оказаны,
    //  2 - клиент подтвердил запись
    private _attendance: number = Literals.zero,

    // принадлежность записи на сеанс к онлайн-записи
    // (true - онлайн-запись, false - запись внёс администратор)
    private _isOnline: boolean = false,

    // статус оплаты
    // (true - запись на сеанс оплачена, false - запись на сеанс НЕ_оплачена)
    private _isPaid: boolean = false,

    // итоговая стоимость всех предоставленных услуг в данной записи на сеанс
    private _totalPrice: number = Literals.zero,

    // дата и время удаления записи о сеансе
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get employee(): Employee { return this._employee; }
  set employee(value: Employee) { this._employee = value; }

  get client(): Client { return this._client; }
  set client(value: Client) { this._client = value; }

  get date(): Date { return this._date; }
  set date(value: Date) { this._date = value; }

  get createDate(): Date { return this._createDate; }
  set createDate(value: Date) { this._createDate = value; }

  get length(): number { return this._length; }
  set length(value: number) { this._length = value; }

  // свойство длительности сеанса в минутах
  get lengthInMinutes(): number { return this._length / 60; }
  set lengthInMinutes(value: number) { this._length = value * 60; }

  get comment(): string | null { return this._comment; }
  set comment(value: string | null) { this._comment = value; }

  get attendance(): number { return this._attendance; }
  set attendance(value: number) { this._attendance = value; }

  get isOnline(): boolean { return this._isOnline; }
  set isOnline(value: boolean) { this._isOnline = value; }

  get isPaid(): boolean { return this._isPaid; }
  set isPaid(value: boolean) { this._isPaid = value; }

  get totalPrice(): number { return this._totalPrice; }
  set totalPrice(value: number) { this._totalPrice = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newRecord(srcRecord: Record | any): Record {
    return new Record(
      srcRecord.id,
      Employee.newEmployee(srcRecord.employee),
      Client.newClient(srcRecord.client),
      srcRecord.date,
      srcRecord.createDate,
      srcRecord.length,
      srcRecord.comment,
      srcRecord.attendance,
      srcRecord.isOnline,
      srcRecord.isPaid,
      srcRecord.totalPrice,
      srcRecord.deleted
    ); // return
  } // newRecord


  // статический метод, возвращающий массив новых объектов-копий
  public static parseRecords(srcRecords: Record[] | any[]): Record[] {
    return srcRecords.map((record: Record | any) => this.newRecord(record));
  } // parseRecords


  // статический метод, возвращающий объект-DTO
  public static RecordToDto(srcRecord: Record): any {
    return {
      id:         srcRecord.id,
      employee:   Employee.EmployeeToDto(srcRecord.employee),
      client:     Client.ClientToDto(srcRecord.client),
      date:       srcRecord.date,
      createDate: srcRecord.createDate,
      length:     srcRecord.length,
      comment:    srcRecord.comment,
      attendance: srcRecord.attendance,
      isOnline:   srcRecord.isOnline,
      isPaid:     srcRecord.isPaid,
      totalPrice: srcRecord.totalPrice,
      deleted:    srcRecord.deleted
    };
  } // RecordToDto


  // статический метод, возвращающий массив объектов-DTO
  public static RecordsToDto(srcRecords: Record[]): any[] {
    return srcRecords.map((record: Record) => this.RecordToDto(record));
  } // RecordsToDto

} // class Record
// ----------------------------------------------------------------------------
