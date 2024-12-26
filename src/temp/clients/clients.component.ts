import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {Client} from '../../temp/Client';
import {PageViewModel} from '../../temp/PageViewModel';
import {WebApiService} from '../../temp/web-api.service';
import {Utils} from '../../infrastructure/Utils';
import {Queries} from '../../temp/Queries';
import {TaskButtonComponent} from '../../temp/shared/task-button/task-button.component';
import {TableHeaderClientsComponent} from './table-header-clients/table-header-clients.component';
import {TrClientComponent} from './tr-client/tr-client.component';
import {ClientFormComponent} from './client-form/client-form.component';
import {IClientFormParams} from '../../temp/IClientFormParams';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    NgIf, TaskButtonComponent, TableHeaderClientsComponent,
    TrClientComponent, ClientFormComponent
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {

  // «идентификатор таймера», для отмены срабатывания setTimeout()
  // при нажатии кнопок обработки быстрее длительности срабатывания таймера
  private _timerId: number = 0;

  // длительность срабатывания setTimeout()
  private readonly _timeout: number = 5_000;

  // флаги включения спиннеров при ожидании данных с сервера
  public isWaitFlag: boolean       = false;
  public isWaitAddClient: boolean  = false;
  public isWaitClientForm: boolean = false;

  // флаг включения режима удаления записей
  public isDeleteFlag: boolean = false;

  // флаг отображения кнопок управления в таблице
  public isQueryFlag: boolean = false;

  // флаг запрета взаимодействия с кнопками в форме добавления/изменения
  // сведений о клиенте (т.к. не можем закрыть форму программно)
  public isDisabledFormButtonsFlag: boolean = false;

  // параметр для выделения записи в таблице
  public selectedClientId: number = 0;

  // заголовок таблицы для отображения
  public displayTitle: string = "";

  // коллекция для получения информации с сервера
  private _clients: Client[] = [];

  // коллекция для отображения
  public displayClients: Client[] = [];

  // информация о пагинации страницы
  public pageViewModel: PageViewModel = new PageViewModel();

  // объект сведений о клиенте для добавления/изменения
  public client: Client = new Client();

  // объект-копия для обработчика сброса данных в форме
  public clientCopy: Client = new Client();

  // параметры формы добавления/изменения
  public clientFormParams: IClientFormParams = { passportList: [] };

  // сообщение результата операции от сервера
  public message: string = "";

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  public route: string = "";


  // конструктор с DI для подключения к WebApiService-сервису получения данных
  // и подключения к объекту маршрутизатора для получения маршрута
  constructor(private _webApiService: WebApiService, private _router: Router) {
    Utils.helloComponent('clients');

    // получить маршрут
    this.route = this._router.url.slice(1);

  } // constructor


  // 0. обращение к серверу сразу после загрузки компонента
  ngOnInit(): void {

    // номер начальной страницы для вывода
    let page: number = 1;

    // начальный запрос на получение части коллекции для первой страницы
    this.getAllByPage(page);

  } // ngOnInit


  // запрос на получение части коллекции для заданной страницы
  private getAllByPage(page: number): void {

    // url для получения данных о клиентах из БД от сервера
    let url: string = Queries.urlGetAllClientsByPage;

    // включение спиннеров ожидания данных
    this.isWaitFlag      = true;
    this.isWaitAddClient = true;

    // подписка на получение результата запроса
    this._webApiService.getAllByPage(url, page)
      .subscribe((webResult: {clients: Client[], pageViewModel: PageViewModel}) => {

        // сведения о клиентах, полученные при помощи сервиса
        this._clients = Client.parseClients(webResult.clients);
        this.pageViewModel = PageViewModel.newPageViewModel(webResult.pageViewModel);

        // вывод данных в разметку
        this.show(
          `Сведения о клиентах ${(this._clients.length > 0)
            ? `(стр. &numero;${this.pageViewModel.pageNumber})`
            : 'отсутствуют'}`,
          this._clients
        ); // show

        // выключение спиннеров всех обработок
        this.isWaitAddClient = false;

      } // subscribe
    ); // getAllByPage

  } // getAllByPage


  // метод вывода коллекции в разметку
  private show(title: string, clients: Client[]): void {

    this.displayTitle = title;
    this.displayClients = clients;
    this.isWaitFlag = false;

  } // show


  // отмена срабатывания таймера
  private removeSetTimeout(): void {

    // отменить ранее установленный setTimeout
    clearTimeout(this._timerId);

    // отмена выделения записи
    this.selectedClientId = 0;

    // удаление сообщения
    this.message = "";

  } // removeSetTimeout


  // обработчик кликов по кнопкам пагинации
  getByPageHandler(page: number): void {

    // отмена выделения строк и удаление сообщения
    this.removeSetTimeout();

    // запрос на получение части коллекции для заданной страницы
    this.getAllByPage(page);

  } // getByPageHandler


  // добавление новой записи
  // (формирование и передача параметров в форму для добавления новой записи)
  addClient(): void {

    // разрешение взаимодействия с кнопками в форме добавления/изменения сведений о клиенте
    this.isDisabledFormButtonsFlag = false;

    // создание нового объекта для добавления
    this.client = new Client();

    // url для получения параметров формы добавления/изменения
    // сведений о клиенте из БД от сервера
    let url: string = Queries.urlGetClientFormParams;

    // включение спиннера ожидания данных на форме
    this.isWaitClientForm = true;

    // запрос на получение параметров формы добавления/изменения клиента
    this._webApiService.getClientFormParams(url, this.client.id)
      .subscribe((webResult: {clientId: number, passportList: string[]}) => {

        // выключение спиннера ожидания данных на форме
        this.isWaitClientForm = false;

        // создание нового объекта для сброса в форме добавления
        this.clientCopy = new Client();

        // параметры формы добавления/изменения клиента
        this.clientFormParams = { passportList: webResult.passportList };

      } // subscribe
    ); // getClientFormParams

  } // addClient


  // обработчик события получения данных об Id изменяемой/удаляемой записи
  sendClientIdHandler(param: { clientId: number, mode: string }): void {

    // вызов метода изменения записи
    if (param.mode === 'edit') {

      // изменение записи по Id при помощи сервиса
      this.editClientById(param.clientId);

    } // if

    // вызов метода удаления записи
    if (param.mode === 'delete') {

      // удаление записи по Id при помощи сервиса
      this.deleteClientById(param.clientId);

    } // if

  } // sendClientIdHandler


  // изменение выбранной записи по Id при помощи сервиса
  // (формирование и передача параметров в форму для изменения выбранной записи)
  editClientById(clientId: number): void {

    // разрешение взаимодействия с кнопками в форме добавления/изменения сведений о клиенте
    this.isDisabledFormButtonsFlag = false;

    // получить объект из коллекции по Id
    let client: Client | undefined =
      this._clients.find((client: Client) => client.id === clientId);

    // если объект не найден - завершаем обработку
    if (client === undefined) {

      // условие для вывода сообщения об ошибке в заголовке формы
      this.client.id = -1;

      // вывод сообщения об ошибке
      this.message = `Запись о клиенте с <strong>&laquo;Id=${clientId}&raquo;</strong>
        не найдена.<br>Перезагрузите данные.`;

      // удаление сообщения
      this._timerId = setTimeout(() => {
        this.message = "";
      }, this._timeout);

      // !!! требуется программное закрытие модального
      // окна с формой добавления/изменения записи

      // т.к. не можем закрыть форму - запретим взаимодействие с кнопками
      this.isDisabledFormButtonsFlag = true;

      return;
    } // if

    // создание копии изменяемого объекта для изменения
    this.client = Client.newClient(client);

    // url для получения параметров формы добавления/изменения
    // сведений о клиенте из БД от сервера
    let url: string = Queries.urlGetClientFormParams;

    // включение спиннера ожидания данных на форме
    this.isWaitClientForm = true;

    // запрос на получение параметров формы добавления/изменения клиента
    this._webApiService.getClientFormParams(url, this.client.id)
      .subscribe((webResult: {clientId: number, passportList: string[]}) => {

        // выключение спиннера ожидания данных на форме
        this.isWaitClientForm = false;

        // если запись не найдена в БД - завершаем обработку
        // (clientId = 0 - признак отсутствия записи в БД)
        if (webResult.clientId === 0) {

          // условие для вывода сообщения об ошибке в заголовке формы
          this.client.id = -1;

          // вывод сообщения об ошибке
          this.message = `В базе данных запись о клиенте с
            <strong>&laquo;Id=${clientId}&raquo;</strong> не найдена!`;

          // удаление сообщения
          this._timerId = setTimeout(() => {
            this.message = "";
          }, this._timeout);

          // !!! требуется программное закрытие модального
          // окна с формой добавления/изменения записи

          // т.к. не можем закрыть форму - запретим взаимодействие с кнопками
          this.isDisabledFormButtonsFlag = true;

          return;
        } // if

        // создание копии изменяемого объекта для сброса в форме изменения
        this.clientCopy = Client.newClient(client);

        // параметры формы добавления/изменения клиента
        this.clientFormParams = { passportList: webResult.passportList };

      } // subscribe
    ); // getClientFormParams

  } // editClientById


  // удаление выбранной записи по Id при помощи сервиса
  deleteClientById(clientId: number): void {

    // отмена выделения строк и удаление сообщения
    this.removeSetTimeout();

    // url для удаления на сервере выбранной записи в таблице БД
    let url: string = Queries.urlDeletingClient;

    // выделение записи
    this.selectedClientId = clientId;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // запрос на удаление выбранной записи в таблице БД
    this._webApiService.deleteClientById(url, clientId).subscribe({

      // вызов метода при получении данных
      next: (webResult: {isOk: boolean, message: string, deletedClientId: number}) => {

        // подтверждение успешного проведения операции
        let isOk: boolean = webResult.isOk;
        let message: string = webResult.message;

        // Id удалённого элемента коллекции, полученный при помощи сервиса
        let deletedClientId: number = webResult.deletedClientId;

        // выключение спиннера обработки
        this.isWaitFlag = false;

        // вывод сообщения результата операции,
        // если операция выполнена - отправить запрос на сервер
        // для получения части записей для текущей страницы
        if (isOk) {

          // вывод сообщения об ошибке
          this.message = `Удалена запись о клиенте с
                <strong>&laquo;Id=${deletedClientId}&raquo;</strong>`;

          // определить номер страницы для запроса
          // ! (если запись на текущей странице последняя[и есть предыдущая страница],
          // ! то перейти на предыдущую страницу)
          let page: number = (this._clients.length === 1) && this.pageViewModel.hasPreviousPage
            ? this.pageViewModel.pageNumber - 1
            : this.pageViewModel.pageNumber;

          // запрос на получение части коллекции для текущей страницы
          this.getAllByPage(page);

        } else {

          // вывод сообщения об ошибке
          this.message = `<strong>Внимание!</strong> Произошла ошибка:
            <strong>&laquo;${message}&raquo;</strong>`;

        } // if

        // удаление сообщения и отмена выделения строки
        this._timerId = setTimeout(() => {
          this.message = "";
          this.selectedClientId = 0;
        }, this._timeout);

      }, // next

      // вызов метода при обнаружении ошибки в данных
      error: (err: any) => {
        this.displayTitle = 'Ошибка сервера при удалении выбранной записи';
        this.isWaitFlag = false;
        console.dir(err);
      } // error

    }); // deleteClientById

  } // deleteClientById


  // метод получения объекта Client из формы
  // добавления/изменения сведений о клиенте
  sendClientHandler(client: Client): void {

    // отмена выделения строк и удаление сообщения
    this.removeSetTimeout();

    // условие добавления/изменения
    if (client.id === 0) {

      // добавление

      // url для добавления на сервере новой записи в таблицу БД
      let url: string = Queries.urlCreatingClient;

      // включение спиннеров ожидания данных
      this.isWaitFlag      = true;
      this.isWaitAddClient = true;

      // запрос на добавление новой записи в таблицу БД
      this._webApiService.addClient(url, client).subscribe({

        // вызов метода при получении данных
        next: (webResult: {isOk: boolean, message: string, newClientId: number, count: number}) => {

          // подтверждение успешного проведения операции
          let isOk: boolean = webResult.isOk;
          let message: string = webResult.message;

          // Id добавленного элемента коллекции, полученный при помощи сервиса
          let newClientId: number = webResult.newClientId;

          // количество всех записей таблицы после добавления
          // (для определения номера последней страницы)
          let count: number = webResult.count;

          // выключение спиннеров обработки
          this.isWaitFlag      = false;
          this.isWaitAddClient = false;

          // вывод сообщения результата операции,
          // если операция выполнена - отправить запрос на сервер
          // для получения части записей для последней страницы
          if (isOk) {

            // вывод сообщения об ошибке
            this.message = `Добавлена запись о клиенте с
                <strong>&laquo;Id=${newClientId}&raquo;</strong>`;

            // определить номер последней страницы с учётом добавленной записи
            let lastPage: number = (count - 1) % this.pageViewModel.pageSize === 0
              ? this.pageViewModel.totalPages + 1
              : this.pageViewModel.totalPages;

            // выделение записи
            this.selectedClientId = newClientId;

            // запрос на получение части коллекции для последней страницы
            this.getAllByPage(lastPage);

          } else {

            // вывод сообщения об ошибке
            this.message = `<strong>Внимание!</strong> Произошла ошибка:
                <strong>&laquo;${message}&raquo;</strong>`;

          } // if

          // удаление сообщения и отмена выделения строки
          this._timerId = setTimeout(() => {
            this.message = "";
            this.selectedClientId = 0;
          }, this._timeout);

        }, // next

        // вызов метода при обнаружении ошибки в данных
        error: (err: any) => {
          this.displayTitle = 'Ошибка сервера при добавлении новой записи';
          this.isWaitFlag      = false;
          this.isWaitAddClient = false;
          console.dir(err);
        } // error

      }); // addClient

    } else {

      // изменение

      // url для изменения на сервере выбранной записи в таблице БД
      let url: string = Queries.urlEditingClient;

      // выделение записи
      this.selectedClientId = client.id;

      // включение спиннера ожидания данных
      this.isWaitFlag = true;

      // запрос на изменение выбранной записи в таблице БД
      this._webApiService.editClient(url, client).subscribe({

        // вызов метода при получении данных
        next: (webResult: {isOk: boolean, message: string, editedClientId: number}) => {

          // подтверждение успешного проведения операции
          let isOk: boolean = webResult.isOk;
          let message: string = webResult.message;

          // Id изменённого элемента коллекции, полученный при помощи сервиса
          let editedClientId: number = webResult.editedClientId;

          // выключение спиннера обработки
          this.isWaitFlag = false;

          // вывод сообщения результата операции,
          // если операция выполнена - отправить запрос на сервер
          // для получения части записей для текущей страницы
          if (isOk) {

            // вывод сообщения об ошибке
            this.message = `Изменена запись о клиенте с
                <strong>&laquo;Id=${editedClientId}&raquo;</strong>`;

            // номер страницы для запроса - текущая страница
            let page: number = this.pageViewModel.pageNumber;

            // запрос на получение части коллекции для текущей страницы
            this.getAllByPage(page);

          } else {

            // вывод сообщения об ошибке
            this.message = `<strong>Внимание!</strong> Произошла ошибка:
                <strong>&laquo;${message}&raquo;</strong>`;

          } // if

          // удаление сообщения и отмена выделения строки
          this._timerId = setTimeout(() => {
            this.message = "";
            this.selectedClientId = 0;
          }, this._timeout);

        }, // next

        // вызов метода при обнаружении ошибки в данных
        error: (err: any) => {
          this.displayTitle = 'Ошибка сервера при изменении выбранной записи';
          this.isWaitFlag = false;
          console.dir(err);
        } // error

      }); // editClient

    } // if

  } // sendClientHandler


  // обработчик события изменения режима удаления записей
  sendIsDeleteFlagHandler(value: boolean): void {

    // передача значения в дочерний компонент (TrClientComponent)
    this.isDeleteFlag = value;

  } // sendIsDeleteFlagHandler


  // обработчик события получения сообщения об ошибке
  sendMessageHandler(message: string): void {

    // вывод сообщения об ошибке
    this.message = `<strong>Внимание!</strong> Произошла ошибка:
        <strong>&laquo;${message}&raquo;</strong>`;

    // удаление сообщения
    this._timerId = setTimeout(() => {
      this.message = "";
    }, this._timeout);

  } // sendMessageHandler

} // class ClientsComponent
