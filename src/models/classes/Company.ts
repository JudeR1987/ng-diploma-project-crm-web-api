// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "КОМПАНИИ" (Companies)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';
import {Address} from './Address';

export class Company {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о компании
    private _id: number = Literals.zero,

    // данные о пользователе-владельце
    //private _ownerUser: User = new User(),

    // идентификатор записи о пользователе-владельце
    private _userOwnerId: number = Literals.zero,

    // название компании
    private _name: string = Literals.empty,

    // данные об адресе
    private _address: Address = new Address(),

    // название компании
    private _phone: string = Literals.empty,

    // описание компании
    private _description: string | null = null,

    // путь к файлу изображения логотипа компании
    private _logo: string = Literals.empty,

    // путь к файлу основного изображения компании
    private _titleImage: string = Literals.empty,

    // график работы компании
    private _schedule: string = Literals.empty,

    // сайт компании
    private _site: string = Literals.empty,

    // дата и время удаления записи о компании
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get userOwnerId(): number { return this._userOwnerId; }
  set userOwnerId(value: number) { this._userOwnerId = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get address(): Address { return this._address; }
  set address(value: Address) { this._address = value; }

  get phone(): string { return this._phone; }
  set phone(value: string) { this._phone = value; }

  get description(): string | null { return this._description; }
  set description(value: string | null) { this._description = value; }

  get logo(): string { return this._logo; }
  set logo(value: string) { this._logo = value; }

  get titleImage(): string { return this._titleImage; }
  set titleImage(value: string) { this._titleImage = value; }

  get schedule(): string { return this._schedule; }
  set schedule(value: string) { this._schedule = value; }

  get site(): string { return this._site; }
  set site(value: string) { this._site = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  // вычисляемое свойство
  // имя файла изображения логотипа компании
  get logoFileName(): string {
    let items: string[] = this._logo.split(Literals.slash);
    return items[items.length - 1];
  } // get

  // имя файла изображения компании
  get titleImageFileName(): string {
    let items: string[] = this._titleImage.split(Literals.slash);
    return items[items.length - 1];
  } // get

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newCompany(srcCompany: Company | any): Company {
    return new Company(
      srcCompany.id,
      srcCompany.userOwnerId,
      srcCompany.name,
      Address.newAddress(srcCompany.address),
      srcCompany.phone,
      srcCompany.description,
      srcCompany.logo,
      srcCompany.titleImage,
      srcCompany.schedule,
      srcCompany.site,
      srcCompany.deleted
    ); // return
  } // newCompany


  // статический метод, возвращающий массив новых объектов-копий
  public static parseCompanies(srcCompanies: Company[] | any[]): Company[] {
    return srcCompanies.map((company: Company | any) => this.newCompany(company));
  } // parseCompanies


  // статический метод, возвращающий объект-DTO
  public static CompanyToDto(srcCompany: Company): any {
    return {
      id:          srcCompany.id,
      userOwnerId: srcCompany.userOwnerId,
      name:        srcCompany.name,
      address:     Address.AddressToDto(srcCompany.address),
      phone:       srcCompany.phone,
      description: srcCompany.description,
      logo:        srcCompany.logo,
      titleImage:  srcCompany.titleImage,
      schedule:    srcCompany.schedule,
      site:        srcCompany.site,
      deleted:     srcCompany.deleted
    };
  } // CompanyToDto


  // статический метод, возвращающий массив объектов-DTO
  public static CompaniesToDto(srcCompanies: Company[]): any[] {
    return srcCompanies.map((company: Company) => this.CompanyToDto(company));
  } // CompaniesToDto

} // class Company
// ----------------------------------------------------------------------------
