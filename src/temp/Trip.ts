// ----------------------------------------------------------------------------

// класс, представляющий сведения о записи в таблице "ПОЕЗДКИ" (Trips)
import {Client} from './Client';
import {Route} from './Route';
import {Utils} from '../infrastructure/Utils';

export class Trip {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о поездке
    private _id: number = 0,

    // дата начала пребывания в стране назначения
    private _startDate: Date = new Date(),

    // данные о клиенте
    private _client: Client = new Client(),

    // данные о маршруте
    private _route: Route = new Route(),

    // количество дней пребывания в стране назначения
    private _amountDays: number = 0
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get startDate(): Date { return this._startDate; }
  set startDate(value: Date) { this._startDate = value; }

  get client(): Client { return this._client; }
  set client(value: Client) { this._client = value; }

  get route(): Route { return this._route; }
  set route(value: Route) { this._route = value; }

  get amountDays(): number { return this._amountDays; }
  set amountDays(value: number) { this._amountDays = value; }


  // вычисляемые свойства

  // стоимость поездки
  get tripCost(): number {
    return this._route.totalDayCost * this._amountDays +
      this._route.country.transportCost + this._route.country.visaCost;
  } // get tripCost

  // налог на добавленную стоимость (НДС), 3% от стоимости поездки
  get tax(): number {
    return this.tripCost * 0.03;
  } // get tax

  // полная стоимость поездки (+НДС)
  get fullTripCost(): number {
    return this.tripCost * 1.03;
  } // get fullTripCost

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newTrip(srcTrip: Trip | any): Trip {

    // если данные с датой являются типом string,
    // то они требуют преобразований в тип Date
    let date: Date;
    if ((typeof srcTrip.startDate) === 'string') {
      // преобразование строки с датой (формат YYYY-MM-dd) в тип Date
      date = Utils.stringToDate(srcTrip.startDate);
    } else {
      // получить данные с типом Date
      date = srcTrip.startDate;
    } // if

    return new Trip(
      srcTrip.id,
      date,
      Client.newClient(srcTrip.client),
      Route.newRoute(srcTrip.route),
      srcTrip.amountDays
    ); // return
  } // newTrip


  // статический метод, возвращающий массив новых объектов-копий
  public static parseTrips(srcTrips: Trip[] | any[]): Trip[] {
    return srcTrips.map((trip: Trip | any) => this.newTrip(trip));
  } // parseTrips

} // class Trip

// ----------------------------------------------------------------------------
