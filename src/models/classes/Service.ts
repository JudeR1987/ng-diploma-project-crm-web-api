// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "УСЛУГИ" (Services)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';
import {ServicesCategory} from './ServicesCategory';

export class Service {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи об услуге
    private _id: number = Literals.zero,

    // наименование услуги
    private _name: string = Literals.empty,

    // данные о категории услуг
    private _servicesCategory: ServicesCategory = new ServicesCategory(),

    // данные о компании, для которой услуга определена
    private _companyId: number = Literals.zero,

    // минимальная цена на услугу
    private _priceMin: number = Literals.zero,

    // максимальная цена на услугу
    private _priceMax: number = Literals.zero,

    // длительность услуги, по умолчанию равна 3600 секундам(1 час)
    private _duration: number = Literals.zero,

    // комментарий к услуге
    private _comment: string | null = null,

    // дата и время удаления записи об услуге
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get servicesCategory(): ServicesCategory { return this._servicesCategory; }
  set servicesCategory(value: ServicesCategory) { this._servicesCategory = value; }

  get companyId(): number { return this._companyId; }
  set companyId(value: number) { this._companyId = value; }

  get priceMin(): number { return this._priceMin; }
  set priceMin(value: number) { this._priceMin = value; }

  get priceMax(): number { return this._priceMax; }
  set priceMax(value: number) { this._priceMax = value; }

  get duration(): number { return this._duration; }
  set duration(value: number) { this._duration = value; }

  get comment(): string | null { return this._comment; }
  set comment(value: string | null) { this._comment = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  // вычисляемое свойство
  // длительность услуги в минутах
  get durationInMinutes(): number {
    return this._duration / 60;
  } // get

  // свойство
  // задание длительности услуги в минутах
  set durationFromMinutes(value: number) {
    this._duration = value * 60;
  } // get

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newService(srcService: Service | any): Service {
    return new Service(
      srcService.id,
      srcService.name,
      ServicesCategory.newServicesCategory(srcService.servicesCategory),
      srcService.companyId,
      srcService.priceMin,
      srcService.priceMax,
      srcService.duration,
      srcService.comment,
      srcService.deleted
    ); // return
  } // newService


  // статический метод, возвращающий массив новых объектов-копий
  public static parseServices(srcServices: Service[] | any[]): Service[] {
    return srcServices.map((service: Service | any) => this.newService(service));
  } // parseServices


  // статический метод, возвращающий объект-DTO
  public static ServiceToDto(srcService: Service): any {
    return {
      id:               srcService.id,
      name:             srcService.name,
      servicesCategory: ServicesCategory.ServicesCategoryToDto(srcService.servicesCategory),
      companyId:        srcService.companyId,
      priceMin:         srcService.priceMin,
      priceMax:         srcService.priceMax,
      duration:         srcService.duration,
      comment:          srcService.comment,
      deleted:          srcService.deleted
    }; // return
  } // ServiceToDto


  // статический метод, возвращающий массив объектов-DTO
  public static ServicesToDto(srcServices: Service[]): any[] {
    return srcServices.map((service: Service) => this.ServiceToDto(service));
  } // ServicesToDto


  // статический метод, возвращающий объект
  // с интерфейсом для отображения в списке выбора
  public static newServiceToSelect(srcService: Service): { id: number, name: string } {
    return { id: srcService.id, name: srcService.name };
  } // newServiceToSelect


  // статический метод, возвращающий массив объектов
  // с интерфейсом для отображения в списке выбора
  public static parseServicesToSelect(srcServices: Service[]): { id: number, name: string }[] {
    return srcServices.map((service: Service) => this.newServiceToSelect(service));
  } // parseServicesToSelect

} // class Service
// ----------------------------------------------------------------------------
