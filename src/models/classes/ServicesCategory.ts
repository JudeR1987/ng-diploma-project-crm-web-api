// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "КАТЕГОРИИ_УСЛУГ" (ServicesCategories)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';

export class ServicesCategory {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о категории услуг
    private _id: number = Literals.zero,

    // наименование категории услуг
    private _name: string = Literals.empty,

    // дата и время удаления записи о категории услуг
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newServicesCategory(srcServicesCategory: ServicesCategory | any): ServicesCategory {
    return new ServicesCategory(
      srcServicesCategory.id,
      srcServicesCategory.name,
      srcServicesCategory.deleted
    ); // return
  } // newServicesCategory


  // статический метод, возвращающий массив новых объектов-копий
  public static parseServicesCategories(srcServicesCategories: ServicesCategory[] | any[]): ServicesCategory[] {
    return srcServicesCategories.map((servicesCategory: ServicesCategory | any) => this.newServicesCategory(servicesCategory));
  } // parseServicesCategories


  // статический метод, возвращающий объект-DTO
  public static ServicesCategoryToDto(srcServicesCategory: ServicesCategory): any {
    return {
      id:      srcServicesCategory.id,
      name:    srcServicesCategory.name,
      deleted: srcServicesCategory.deleted
    }; // return
  } // ServicesCategoryToDto


  // статический метод, возвращающий массив объектов-DTO
  public static ServicesCategoriesToDto(srcServicesCategories: ServicesCategory[]): any[] {
    return srcServicesCategories.map((servicesCategory: ServicesCategory) => this.ServicesCategoryToDto(servicesCategory));
  } // ServicesCategoriesToDto


  // статический метод, возвращающий объект
  // с интерфейсом для отображения в списке выбора
  public static newServicesCategoryToSelect(srcServicesCategory: ServicesCategory): { id: number, name: string } {
    return { id: srcServicesCategory.id, name: srcServicesCategory.name };
  } // newServicesCategoryToSelect


  // статический метод, возвращающий массив объектов
  // с интерфейсом для отображения в списке выбора
  public static parseServicesCategoriesToSelect(srcServicesCategories: ServicesCategory[]): { id: number, name: string }[] {
    return srcServicesCategories.map((servicesCategory: ServicesCategory) => this.newServicesCategoryToSelect(servicesCategory));
  } // parseServicesCategoriesToSelect

} // class ServicesCategory
// ----------------------------------------------------------------------------
