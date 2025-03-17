import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {Trip} from '../Trip';
import {PageViewModel} from '../../infrastructure/PageViewModel';
import {WebApiService} from '../web-api.service';
import {Utils} from '../../infrastructure/Utils';
import {Config} from '../../infrastructure/Config';
import {TaskButtonComponent} from '../shared/task-button/task-button.component';
import {TableHeaderTripsComponent} from './table-header-trips/table-header-trips.component';
import {TrTripComponent} from './tr-trip/tr-trip.component';
import {TripFormComponent} from './trip-form/trip-form.component';
import {Client} from '../Client';
import {Route} from '../Route';
import {ITripFormParams} from '../ITripFormParams';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    NgIf, TaskButtonComponent, TableHeaderTripsComponent,
    TrTripComponent, TripFormComponent
  ],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit {

  // «идентификатор таймера», для отмены срабатывания setTimeout()
  // при нажатии кнопок обработки быстрее длительности срабатывания таймера
  private _timerId: number = 0;

  // длительность срабатывания setTimeout()
  private readonly _timeout: number = 5_000;

  // флаги включения спиннеров при ожидании данных с сервера
  public isWaitFlag: boolean     = false;
  public isWaitAddTrip: boolean  = false;
  public isWaitTripForm: boolean = false;

  // флаг включения режима удаления записей
  public isDeleteFlag: boolean = false;

  // флаг запрета взаимодействия с кнопками в форме добавления/изменения
  // записи о поездке (т.к. не можем закрыть форму программно)
  public isDisabledFormButtonsFlag: boolean = false;

  // параметр для выделения записи в таблице
  public selectedTripId: number = 0;

  // заголовок таблицы для отображения
  public displayTitle: string = "";

  // коллекция для получения информации с сервера
  private _trips: Trip[] = [];

  // коллекция для отображения
  public displayTrips: Trip[] = [];

  // информация о пагинации страницы
  public pageViewModel: PageViewModel = new PageViewModel();

  // объект сведений о поездке для добавления/изменения
  public trip: Trip = new Trip();

  // объект-копия для обработчика сброса данных в форме
  public tripCopy: Trip = new Trip();

  // параметры формы добавления/изменения
  public tripFormParams: ITripFormParams = {
    allClients: [], allRoutes: [], clientList: [], routeList: []
  };

  // сообщение результата операции от сервера
  public message: string = "";

  // вспомогательный параметр дочернего компонента
  // для привязки к свойству объекта типа Date
  public displayDate: string = "";

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  public route: string = "";


  // конструктор с DI для подключения к WebApiService-сервису получения данных
  // и подключения к объекту маршрутизатора для получения маршрута
  constructor(private _webApiService: WebApiService, private _router: Router) {
    Utils.helloComponent('trips');

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

    // url для получения данных о поездках из БД от сервера
    let url: string = Config.urlGetAllTripsByPage;

    // включение спиннеров ожидания данных
    this.isWaitFlag    = true;
    this.isWaitAddTrip = true;

    // подписка на получение результата запроса
    this._webApiService.getAllByPage(url, page)
      .subscribe((webResult: {trips: Trip[], pageViewModel: PageViewModel}) => {

        // сведения о поездках, полученные при помощи сервиса
        this._trips = Trip.parseTrips(webResult.trips);
        this.pageViewModel = PageViewModel.newPageViewModel(webResult.pageViewModel);

        // вывод данных в разметку
        this.show(
          `Сведения о поездках ${(this._trips.length > 0)
            ? `(стр. &numero;${this.pageViewModel.pageNumber})`
            : 'отсутствуют'}`,
          this._trips
        ); // show

        // выключение спиннеров всех обработок
        this.isWaitAddTrip = false;

      } // subscribe
    ); // getAllByPage

  } // getAllByPage


  // метод вывода коллекции в разметку
  private show(title: string, trips: Trip[]): void {

    this.displayTitle = title;
    this.displayTrips = trips;
    this.isWaitFlag = false;

  } // show


  // отмена срабатывания таймера
  private removeSetTimeout(): void {

    // отменить ранее установленный setTimeout
    clearTimeout(this._timerId);

    // отмена выделения записи
    this.selectedTripId = 0;

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
  addTrip(): void {

    // разрешение взаимодействия с кнопками в форме добавления/изменения сведений о поездке
    this.isDisabledFormButtonsFlag = false;

    // создание нового объекта для добавления
    this.trip = new Trip();
    this.trip.amountDays = 1;
    this.displayDate = Utils.dateToString(this.trip.startDate);

    // url для получения параметров формы добавления/изменения
    // сведений о поездке из БД от сервера
    let url: string = Config.urlGetTripFormParams;

    // включение спиннера ожидания данных на форме
    this.isWaitTripForm = true;

    // сброс значений параметров формы добавления/изменения поездки
    this.tripFormParams = {
      allClients: [], allRoutes: [], clientList: [], routeList: []
    };

    // запрос на получение параметров формы добавления/изменения поездки
    this._webApiService.getTripFormParams(url, this.trip.id)
      .subscribe((webResult: {tripId: number, allClients: Client[], allRoutes: Route[]}) => {

        // выключение спиннера ожидания данных на форме
        this.isWaitTripForm = false;

        // создание нового объекта для сброса в форме добавления
        this.tripCopy = Trip.newTrip(this.trip);

        // параметры формы добавления/изменения поездки
        let allClients: Client[] = Client.parseClients(webResult.allClients);
        let allRoutes: Route[] = Route.parseRoutes(webResult.allRoutes);
        this.tripFormParams = {
          allClients: allClients,
          allRoutes:  allRoutes,
          clientList: Client.parseClientsToSelect(allClients),
          routeList: Route.parseRoutesToSelect(allRoutes)
        };

      } // subscribe
    ); // getTripFormParams

  } // addTrip


  // обработчик события получения данных об Id изменяемой/удаляемой записи
  sendTripIdHandler(param: { tripId: number, mode: string }): void {

    // вызов метода изменения записи
    if (param.mode === 'edit') {

      // изменение записи по Id при помощи сервиса
      this.editTripById(param.tripId);

    } // if

    // вызов метода удаления записи
    if (param.mode === 'delete') {

      // удаление записи по Id при помощи сервиса
      this.deleteTripById(param.tripId);

    } // if

  } // sendTripIdHandler


  // изменение выбранной записи по Id при помощи сервиса
  // (формирование и передача параметров в форму для изменения выбранной записи)
  editTripById(tripId: number): void {

    // разрешение взаимодействия с кнопками в форме добавления/изменения сведений о поездке
    this.isDisabledFormButtonsFlag = false;

    // получить объект из коллекции по Id
    let trip: Trip | undefined =
      this._trips.find((trip: Trip) => trip.id === tripId);

    // если объект не найден - завершаем обработку
    if (trip === undefined) {

      // условие для вывода сообщения об ошибке в заголовке формы
      this.trip.id = -1;
      this.displayDate = Utils.dateToString(new Date());

      // вывод сообщения об ошибке
      this.message = `Запись о поездке с <strong>&laquo;Id=${tripId}&raquo;</strong>
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
    this.trip = Trip.newTrip(trip);
    this.displayDate = Utils.dateToString(this.trip.startDate);

    // url для получения параметров формы добавления/изменения
    // сведений о поездке из БД от сервера
    let url: string = Config.urlGetTripFormParams;

    // включение спиннера ожидания данных на форме
    this.isWaitTripForm = true;

    // сброс значений параметров формы добавления/изменения поездки
    this.tripFormParams = {
      allClients: [], allRoutes: [], clientList: [], routeList: []
    };

    // запрос на получение параметров формы добавления/изменения поездки
    this._webApiService.getTripFormParams(url, this.trip.id)
      .subscribe((webResult: {tripId: number, allClients: Client[], allRoutes: Route[]}) => {

        // выключение спиннера ожидания данных на форме
        this.isWaitTripForm = false;

        // если запись не найдена в БД - завершаем обработку
        // (tripId = 0 - признак отсутствия записи в БД)
        if (webResult.tripId === 0) {

          // условие для вывода сообщения об ошибке в заголовке формы
          this.trip.id = -1;

          // вывод сообщения об ошибке
          this.message = `В базе данных запись о поездке с
            <strong>&laquo;Id=${tripId}&raquo;</strong> не найдена!`;

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
        this.tripCopy = Trip.newTrip(this.trip);

        // параметры формы добавления/изменения поездки
        let allClients: Client[] = Client.parseClients(webResult.allClients);
        let allRoutes: Route[] = Route.parseRoutes(webResult.allRoutes);
        this.tripFormParams = {
          allClients: allClients,
          allRoutes:  allRoutes,
          clientList: Client.parseClientsToSelect(allClients),
          routeList: Route.parseRoutesToSelect(allRoutes)
        };

      } // subscribe
    ); // getTripFormParams

  } // editTripById


  // удаление выбранной записи по Id при помощи сервиса
  deleteTripById(tripId: number): void {

    // отмена выделения строк и удаление сообщения
    this.removeSetTimeout();

    // url для удаления на сервере выбранной записи в таблице БД
    let url: string = Config.urlDeletingTrip;

    // выделение записи
    this.selectedTripId = tripId;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // запрос на удаление выбранной записи в таблице БД
    this._webApiService.deleteTripById(url, tripId).subscribe({

      // вызов метода при получении данных
      next: (webResult: {isOk: boolean, message: string, deletedTripId: number}) => {

        // подтверждение успешного проведения операции
        let isOk: boolean = webResult.isOk;
        let message: string = webResult.message;

        // Id удалённого элемента коллекции, полученный при помощи сервиса
        let deletedTripId: number = webResult.deletedTripId;

        // выключение спиннера обработки
        this.isWaitFlag = false;

        // вывод сообщения результата операции,
        // если операция выполнена - отправить запрос на сервер
        // для получения части записей для текущей страницы
        if (isOk) {

          // вывод сообщения о результате операции
          this.message = `Удалена запись о поездке с
            <strong>&laquo;Id=${deletedTripId}&raquo;</strong>`;

          // определить номер страницы для запроса
          // ! (если запись на текущей странице последняя[и есть предыдущая страница],
          // ! то перейти на предыдущую страницу)
          let page: number = (this._trips.length === 1) && this.pageViewModel.hasPreviousPage
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
          this.selectedTripId = 0;
        }, this._timeout);

      }, // next

      // вызов метода при обнаружении ошибки в данных
      error: (err: any) => {
        this.displayTitle = 'Ошибка сервера при удалении выбранной записи';
        this.isWaitFlag = false;
        console.dir(err);
      } // error

    }); // deleteTripById

  } // deleteTripById


  // обработчик события получения объекта Trip из формы
  // добавления/изменения сведений о поездке
  sendTripHandler(trip: Trip): void {

    // отмена выделения строк и удаление сообщения
    this.removeSetTimeout();

    // условие добавления/изменения
    if (trip.id === 0) {

      // добавление

      // url для добавления на сервере новой записи в таблицу БД
      let url: string = Config.urlCreatingTrip;

      // включение спиннеров ожидания данных
      this.isWaitFlag    = true;
      this.isWaitAddTrip = true;

      // запрос на добавление новой записи в таблицу БД
      this._webApiService.addTrip(url, trip).subscribe({

        // вызов метода при получении данных
        next: (webResult: {isOk: boolean, message: string, newTripId: number, count: number}) => {

          // подтверждение успешного проведения операции
          let isOk: boolean = webResult.isOk;
          let message: string = webResult.message;

          // Id добавленного элемента коллекции, полученный при помощи сервиса
          let newTripId: number = webResult.newTripId;

          // количество всех записей таблицы после добавления
          // (для определения номера последней страницы)
          let count: number = webResult.count;

          // выключение спиннеров обработки
          this.isWaitFlag    = false;
          this.isWaitAddTrip = false;

          // вывод сообщения результата операции,
          // если операция выполнена - отправить запрос на сервер
          // для получения части записей для последней страницы
          if (isOk) {

            // вывод сообщения о результате операции
            this.message = `Добавлена запись о поездке с
                <strong>&laquo;Id=${newTripId}&raquo;</strong>`;

            // определить номер последней страницы с учётом добавленной записи
            let lastPage: number = (count - 1) % this.pageViewModel.pageSize === 0
              ? this.pageViewModel.totalPages + 1
              : this.pageViewModel.totalPages;

            // выделение записи
            this.selectedTripId = newTripId;

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
            this.selectedTripId = 0;
          }, this._timeout);

        }, // next

        // вызов метода при обнаружении ошибки в данных
        error: (err: any) => {
          this.displayTitle = 'Ошибка сервера при добавлении новой записи';
          this.isWaitFlag    = false;
          this.isWaitAddTrip = false;
          console.dir(err);
        } // error

      }); // addTrip

    } else {

      // изменение

      // url для изменения на сервере выбранной записи в таблице БД
      let url: string = Config.urlEditingTrip;

      // выделение записи
      this.selectedTripId = trip.id;

      // включение спиннера ожидания данных
      this.isWaitFlag = true;

      // запрос на изменение выбранной записи в таблице БД
      this._webApiService.editTrip(url, trip).subscribe({

        // вызов метода при получении данных
        next: (webResult: {isOk: boolean, message: string, editedTripId: number}) => {

          // подтверждение успешного проведения операции
          let isOk: boolean = webResult.isOk;
          let message: string = webResult.message;

          // Id изменённого элемента коллекции, полученный при помощи сервиса
          let editedTripId: number = webResult.editedTripId;

          // выключение спиннера обработки
          this.isWaitFlag = false;

          // вывод сообщения результата операции,
          // если операция выполнена - отправить запрос на сервер
          // для получения части записей для текущей страницы
          if (isOk) {

            // вывод сообщения о результате операции
            this.message = `Изменена запись о поездке с
                <strong>&laquo;Id=${editedTripId}&raquo;</strong>`;

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
            this.selectedTripId = 0;
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

  } // sendTripHandler


  // обработчик события изменения режима удаления записей
  sendIsDeleteFlagHandler(value: boolean): void {

    // передача значения в дочерний компонент (TrTripComponent)
    this.isDeleteFlag = value;

  } // sendIsDeleteFlagHandler


  // обработчик события получения сообщения об ошибке
  sendMessageHandler(message: string): void {

    // отмена выделения строк и удаление сообщения
    this.removeSetTimeout();

    // вывод сообщения об ошибке
    this.message = `<strong>Внимание!</strong> Произошла ошибка:
        <strong>&laquo;${message}&raquo;</strong>`;

    // удаление сообщения
    this._timerId = setTimeout(() => {
      this.message = "";
    }, this._timeout);

  } // sendMessageHandler

} // class TripsComponent
