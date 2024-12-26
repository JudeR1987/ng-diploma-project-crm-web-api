// ----------------------------------------------------------------------------

// класс, представляющий сведения о записи в таблице "МАРШРУТЫ" (Routes)
import {Country} from './Country';
import {Purpose} from './Purpose';
import {IRouteToSelect} from './IRouteToSelect';

export class Route {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о маршруте
    private _id: number = 0,

    // данные о стране пребывания
    private _country: Country = new Country(),

    // данные о цели поездки
    private _purpose: Purpose = new Purpose()
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get country(): Country { return this._country; }
  set country(value: Country) { this._country = value; }

  get purpose(): Purpose { return this._purpose; }
  set purpose(value: Purpose) { this._purpose = value; }


  // вычисляемое свойство
  // суммарная стоимость одного дня пребывания по маршруту, руб.
  // (зависит от страны пребывания и цели поездки)
  get totalDayCost(): number {
    return this._country.countryDayCost + this._purpose.purposeDayCost;
  } // get

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newRoute(srcRoute: Route | any): Route {
    return new Route(
      srcRoute.id,
      Country.newCountry(srcRoute.country),
      Purpose.newPurpose(srcRoute.purpose)
    ); // return
  } // newRoute


  // статический метод, возвращающий массив новых объектов-копий
  public static parseRoutes(srcRoutes: Route[] | any[]): Route[] {
    return srcRoutes.map((route: Route | any) => this.newRoute(route));
  } // parseRoutes


  // статический метод, возвращающий новый объект-копию
  // с интерфейсом IRouteToSelect для отображения в списке выбора
  public static newRouteToSelect(srcRoute: Route): IRouteToSelect {
    return {
      id: srcRoute.id,
      name: `${srcRoute.id}-${srcRoute.country.name}-${srcRoute.purpose.name}`
    };
  } // newRouteToSelect


  // статический метод, возвращающий массив новых объектов-копий
  // с интерфейсом IRouteToSelect для отображения в списке выбора
  public static parseRoutesToSelect(srcRoutes: Route[]): IRouteToSelect[] {
    return srcRoutes.map((route: Route) => this.newRouteToSelect(route));
  } // parseRoutesToSelect

} // class Route

// ----------------------------------------------------------------------------
