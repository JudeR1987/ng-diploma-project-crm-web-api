// ----------------------------------------------------------------------------

// класс, представляющий сведения о записи в таблице "КЛИЕНТЫ" (Clients)
import {Person} from './Person';
import {IClientToSelect} from './IClientToSelect';

export class Client extends Person {

  // конструктор с параметрами по умолчанию
  constructor(
    id: number = 0, surname: string = '', name: string = '', patronymic: string = '',

    // серия и номер паспорта клиента
    private _passport: string = ""
  ) {
    super(id, surname, name, patronymic);
  } // constructor


  //#region открытые аксессоры свойств

  get passport(): string { return this._passport; }
  set passport(value: string) { this._passport = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newClient(srcClient: Client | any): Client {
    return new Client(
      srcClient.id,
      srcClient.surname,
      srcClient.name,
      srcClient.patronymic,
      srcClient.passport
    ); // return
  } // newClient


  // статический метод, возвращающий массив новых объектов-копий
  public static parseClients(srcClients: Client[] | any[]): Client[] {
    return srcClients.map((client: Client | any) => this.newClient(client));
  } // parseClients


  // статический метод, возвращающий новый объект-копию
  // с интерфейсом IClientToSelect для отображения в списке выбора
  public static newClientToSelect(srcClient: Client): IClientToSelect {
    return { id: srcClient.id, fullName: srcClient.fullName };
  } // newClientToSelect


  // статический метод, возвращающий массив новых объектов-копий
  // с интерфейсом IClientToSelect для отображения в списке выбора
  public static parseClientsToSelect(srcClients: Client[]): IClientToSelect[] {
    return srcClients.map((client: Client) => this.newClientToSelect(client));
  } // parseClientsToSelect

} // class Client

// ----------------------------------------------------------------------------
