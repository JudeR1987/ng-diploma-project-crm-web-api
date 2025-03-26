// ----------------------------------------------------------------------------
// класс для отображения категории услуг с коллекцией услуг,
// относящихся к данной категории
// ----------------------------------------------------------------------------
import {ServicesCategory} from './ServicesCategory';
import {Service} from './Service';

export class DisplayServicesCategory {

  // конструктор с параметрами по умолчанию
  constructor(
    // данные о категории услуг
    private _servicesCategory: ServicesCategory = new ServicesCategory(),

    // услуги, относящиеся к данной категории
    private _services: Service[] = []
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get servicesCategory(): ServicesCategory { return this._servicesCategory; }
  set servicesCategory(value: ServicesCategory) { this._servicesCategory = value; }

  get services(): Service[] { return this._services; }
  set services(value: Service[]) { this._services = Service.parseServices(value); }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newDisplayServicesCategory(srcDisplayServicesCategory: DisplayServicesCategory | any): DisplayServicesCategory {
    return new DisplayServicesCategory(
      ServicesCategory.newServicesCategory(srcDisplayServicesCategory.servicesCategory),
      Service.parseServices(srcDisplayServicesCategory.services)
    ); // return
  } // newDisplayServicesCategory


  // статический метод, возвращающий массив новых объектов-копий
  public static parseDisplayServicesCategories(srcDisplayServicesCategories: DisplayServicesCategory[] | any[]): DisplayServicesCategory[] {
    return srcDisplayServicesCategories.map((displayServicesCategory: DisplayServicesCategory | any) => this.newDisplayServicesCategory(displayServicesCategory));
  } // parseDisplayServicesCategories


  // статический метод, возвращающий коллекцию услуг из всех категорий коллекции
  public static allServices(srcDisplayServicesCategories: DisplayServicesCategory[]): Service[] {

    // коллекция всех услуг всех категорий
    let services: Service[] = [];

    // на каждой категории получим каждый элемент коллекции услуг
    srcDisplayServicesCategories.forEach((displayServicesCategories: DisplayServicesCategory) => {
      displayServicesCategories.services.forEach((service: Service) => {
        services.push(service);
      }); // forEach
    }); // forEach

    return services;
  } // allServices


  // статический метод, возвращающий объект-DTO
  /*public static ServicesCategoryToDto(srcServicesCategory: ServicesCategory): any {
    return {
      id:      srcServicesCategory.id,
      name:    srcServicesCategory.name,
      deleted: srcServicesCategory.deleted
    }; // return
  } // ServicesCategoryToDto*/


  // статический метод, возвращающий массив объектов-DTO
  /*public static ServicesCategoriesToDto(srcServicesCategories: ServicesCategory[]): any[] {
    return srcServicesCategories.map((servicesCategory: ServicesCategory) => this.ServicesCategoryToDto(servicesCategory));
  } // ServicesCategoriesToDto*/


  // статический метод, возвращающий объект
  // с интерфейсом для отображения в списке выбора
  /*public static newServicesCategoryToSelect(srcServicesCategory: ServicesCategory): { id: number, name: string } {
    return { id: srcServicesCategory.id, name: srcServicesCategory.name };
  } // newServicesCategoryToSelect*/


  // статический метод, возвращающий массив объектов
  // с интерфейсом для отображения в списке выбора
  /*public static parseServicesCategoriesToSelect(srcServicesCategories: ServicesCategory[]): { id: number, name: string }[] {
    return srcServicesCategories.map((servicesCategory: ServicesCategory) => this.newServicesCategoryToSelect(servicesCategory));
  } // parseServicesCategoriesToSelect*/

} // class DisplayServicesCategory
// ----------------------------------------------------------------------------
