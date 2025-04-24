// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "КЛИЕНТЫ" (Clients)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';

export class Client {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о клиенте
    private _id: number = Literals.zero,

    // фамилия клиента
    private _surname: string | null = Literals.empty,

    // имя клиента
    private _name: string = Literals.empty,

    // отчество клиента
    private _patronymic: string | null = Literals.empty,

    // номер телефона клиента
    private _phone: string = Literals.empty,

    // адрес электронной почты клиента
    private _email: string = Literals.empty,

    // пол клиента
    // (0 - не известен, 1 - мужской, 2 - женский)
    private _gender: number = Literals.zero,

    // класс важности клиента
    // (0 - нет, 1 - бронза, 2 - серебро, 3 - золото)
    private _importanceId: number = Literals.zero,

    // скидка клиента
    private _discount: number = Literals.zero,

    // номер карты клиента
    private _card: string | null = Literals.empty,

    // дата рождения клиента (в формате yyyy-mm-dd)
    private _birthDate: string = Literals.empty,

    // комментарий к записи о клиенте
    private _comment: string | null = Literals.empty,

    // сумма потраченных средств в компании на момент добавления
    private _spent: number = Literals.zero,

    // баланс клиента
    private _balance: number = Literals.zero,

    // дата и время удаления записи о клиенте
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get surname(): string | null { return this._surname; }
  set surname(value: string | null) { this._surname = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get patronymic(): string | null { return this._patronymic; }
  set patronymic(value: string | null) { this._patronymic = value; }

  get phone(): string { return this._phone; }
  set phone(value: string) { this._phone = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get gender(): number { return this._gender; }
  set gender(value: number) { this._gender = value; }

  get importanceId(): number { return this._importanceId; }
  set importanceId(value: number) { this._importanceId = value; }

  get discount(): number { return this._discount; }
  set discount(value: number) { this._discount = value; }

  get card(): string | null { return this._card; }
  set card(value: string | null) { this._card = value; }

  get birthDate(): string { return this._birthDate; }
  set birthDate(value: string) { this._birthDate = value; }

  get comment(): string | null { return this._comment; }
  set comment(value: string | null) { this._comment = value; }

  get spent(): number { return this._spent; }
  set spent(value: number) { this._spent = value; }

  get balance(): number { return this._balance; }
  set balance(value: number) { this._balance = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  // вычисляемое свойство
  // Ф.И.О. персоны
  get fullName(): string {
    return `${(this._surname != null && this._surname != '') ? `${this._surname} ` : ''}` +
      `${(this._name != null && this._name != '') ? `${this._name[0]}.` : ''}` +
      `${(this._patronymic != null && this._patronymic != '') ? `${this._patronymic[0]}.` : ''}`;
  } // get

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newClient(srcClient: Client | any): Client {
    return new Client(
      srcClient.id,
      srcClient.surname,
      srcClient.name,
      srcClient.patronymic,
      srcClient.phone,
      srcClient.email,
      srcClient.gender,
      srcClient.importanceId,
      srcClient.discount,
      srcClient.card,
      srcClient.birthDate,
      srcClient.comment,
      srcClient.spent,
      srcClient.balance,
      srcClient.deleted
    ); // return
  } // newClient


  // статический метод, возвращающий массив новых объектов-копий
  public static parseClients(srcClients: Client[] | any[]): Client[] {
    return srcClients.map((client: Client | any) => this.newClient(client));
  } // parseClients


  // статический метод, возвращающий объект-DTO
  public static ClientToDto(srcClient: Client): any {
    return {
      id:           srcClient.id,
      surname:      srcClient.surname,
      name:         srcClient.name,
      patronymic:   srcClient.patronymic,
      phone:        srcClient.phone,
      email:        srcClient.email,
      gender:       srcClient.gender,
      importanceId: srcClient.importanceId,
      discount:     srcClient.discount,
      card:         srcClient.card,
      birthDate:    srcClient.birthDate,
      comment:      srcClient.comment,
      spent:        srcClient.spent,
      balance:      srcClient.balance,
      deleted:      srcClient.deleted
    };
  } // ClientToDto


  // статический метод, возвращающий массив объектов-DTO
  public static ClientsToDto(srcClients: Client[]): any[] {
    return srcClients.map((client: Client) => this.ClientToDto(client));
  } // ClientsToDto

} // class Client
// ----------------------------------------------------------------------------
