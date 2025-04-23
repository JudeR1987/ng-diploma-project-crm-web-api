// ----------------------------------------------------------------------------

// класс, представляющий сведения о записи в таблице "КЛИЕНТЫ" (Clients)
import {Person} from './Person';
import {IClientToSelect} from './IClientToSelect';

export class ClientTemp extends Person {

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
  public static newClient(srcClient: ClientTemp | any): ClientTemp {
    return new ClientTemp(
      srcClient.id,
      srcClient.surname,
      srcClient.name,
      srcClient.patronymic,
      srcClient.passport
    ); // return
  } // newClient


  // статический метод, возвращающий массив новых объектов-копий
  public static parseClients(srcClients: ClientTemp[] | any[]): ClientTemp[] {
    return srcClients.map((client: ClientTemp | any) => this.newClient(client));
  } // parseClients


  // статический метод, возвращающий новый объект-копию
  // с интерфейсом IClientToSelect для отображения в списке выбора
  public static newClientToSelect(srcClient: ClientTemp): IClientToSelect {
    return { id: srcClient.id, fullName: srcClient.fullName };
  } // newClientToSelect


  // статический метод, возвращающий массив новых объектов-копий
  // с интерфейсом IClientToSelect для отображения в списке выбора
  public static parseClientsToSelect(srcClients: ClientTemp[]): IClientToSelect[] {
    return srcClients.map((client: ClientTemp) => this.newClientToSelect(client));
  } // parseClientsToSelect

} // class Client

// ----------------------------------------------------------------------------
