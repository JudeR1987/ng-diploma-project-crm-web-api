// ----------------------------------------------------------------------------
// компонент отображения мастеров выбранной услуги заданной компании для онлайн-записи
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {IComponent} from '../../models/interfaces/IComponent';
import {Literals} from '../../infrastructure/Literals';
import {firstValueFrom, Subscription} from 'rxjs';
import {Company} from '../../models/classes/Company';
import {Employee} from '../../models/classes/Employee';
import {Service} from '../../models/classes/Service';
import {Resources} from '../../infrastructure/Resources';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {WebApiService} from '../../services/web-api.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Utils} from '../../infrastructure/Utils';
import {Config} from '../../infrastructure/Config';
import {NgClass} from '@angular/common';
import {Slot} from '../../models/classes/Slot';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Client} from '../../models/classes/Client';
import {Record} from '../../models/classes/Record';

@Component({
  selector: 'app-online-record-employees',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './online-record-employees.component.html',
  styleUrl: './online-record-employees.component.css'
})
export class OnlineRecordEmployeesComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IComponent = {
    // параметры меняющиеся при смене языка
    title: Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:   Literals.empty,
    route:      Literals.empty,
    isWaitFlag: false
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о выбранной компании
  public company: Company = new Company();

  // идентификаторы выбранных услуг
  public selectedServicesIds: number[] = [];

  // выбранная услуга
  public selectedService: Service = new Service();

  // коллекция сотрудников заданной компании
  public employees: Employee[] = [];

  // выбранная услуга
  public selectedEmployeeId: number = Literals.zero;

  // данные о дате текущего дня
  public today: Date = new Date();

  // данные о дате выбранного дня
  public selectedDate: Date = new Date();

  // коллекция свободных для записи промежутков времени выбранного сотрудника
  public freeSlots: Slot[] = [];

  // статус рабочего дня "выходной"/"НЕ_выходной"
  public isWorkDayBreak: boolean = false;

  // данные о времени начала записи на сеанс
  public selectedStartTime: string = Literals.empty;

  // имя клиента
  public name: string = Literals.empty;

  // телефон клиента
  public phone: string = Literals.empty;

  // email клиента
  public email: string = Literals.empty;

  // дополнительные свойства
  protected readonly zero: number  = Literals.zero;
  protected readonly one: number   = Literals.one;
  protected readonly empty: string = Literals.empty;


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута, подключения объекта активного маршрута для
  // получения параметров маршрута, подключения к сервису установки языка,
  // подключения к web-сервису, подключения к сервису хранения сообщения об ошибке,
  // подключения к сервису хранения данных о jwt-токене
  // и подключения к сервису аутентификации/авторизации пользователя
  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _languageService: LanguageService,
              private _webApiService: WebApiService,
              private _errorMessageService: ErrorMessageService,
              private _tokenService: TokenService,
              private _authGuardService: AuthGuardService) {
    Utils.helloComponent(Literals.onlineRecordEmployees);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];

    // установить значение текущей даты
    this.selectedDate = this.today;

  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

      }); // subscribe


    // получить параметры маршрута
    let companyId: number = 0;
    let servicesIds: number[] = [];
    // подписка на получение результата перехода по маршруту (данные из маршрута)
    this._activatedRoute.params.subscribe(params => {

      // параметр об Id компании, полученный из маршрута
      companyId = params[Literals.id] != undefined
        ? +params[Literals.id]
        : 0;
      this.company.id = companyId;

    }); // subscribe

    // подписка на получение результата перехода по маршруту (данные из параметров маршрута)
    this._activatedRoute.queryParams.subscribe(params => {

      // параметр об Id выбранных услуг
      servicesIds = params['servicesIds'];
      this.selectedServicesIds = servicesIds;

      // пока берём последнюю услугу
      this.selectedService.id = (typeof this.selectedServicesIds) != Literals.string
        ? this.selectedServicesIds[this.selectedServicesIds.length - 1]
        : +this.selectedServicesIds;

    }); // subscribe


    // запрос на получение записи о компании из БД для отображения
    await this.requestGetCompanyById();

    // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
    if (this.company.id === this.zero) {

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

      return;
    } // if


    // запрос на получение записи о выбранной услуге из БД для отображения
    await this.requestGetServiceById();

    // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
    if (this.selectedService.id === this.zero) {

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

      return;
    } // if


    // запрос на получение коллекции сотрудников заданной компании выполняющие выбранную услугу
    await this.requestGetAllEmployeesByCompanyIdByServiceId();

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title = Resources.onlineRecordEmployeesTitle[this.component.language];

  } // changeLanguageLiterals


  // запрос на получение записи о компании из БД для отображения
  async requestGetCompanyById(): Promise<void> {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // запрос на получение записи о компании
    let result: { message: any, company: Company } =
      { message: Literals.Ok, company: new Company() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetCompanyById, this.company.id, token)
      );

      result.company = Company.newCompany(webResult.company);
    }
    catch (e: any) {

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null)
        result.message = Resources.unauthorizedUserIdData[this.component.language];
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся на странице
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.message.companyId != undefined)
        message = result.message.companyId === this.zero
          ? Resources.incorrectCompanyIdData[this.component.language]
          : Resources.notRegisteredCompanyIdData[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);

      // при ошибках установить компании нулевой идентификатор
      this.company.id = this.zero;
    }
    else {

      // присвоить значение полученных данных
      this.company = result.company;

    } // if

  } // requestGetCompanyById


  // запрос на получение записи о выбранной услуге из БД для отображения
  async requestGetServiceById(): Promise<void> {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // запрос на получение записи о выбранной услуге
    let result: { message: any, service: Service } =
      { message: Literals.Ok, service: new Service() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetServiceById, this.selectedService.id, token)
      );

      result.service = Service.newService(webResult.service);
    }
    catch (e: any) {

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null)
        result.message = Resources.unauthorizedUserIdData[this.component.language];
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся на странице
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.message.serviceId != undefined)
        message = result.message.serviceId === this.zero
          ? Resources.incorrectServiceIdData[this.component.language]
          : Resources.notRegisteredServiceIdData[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);

      // при ошибках установить компании нулевой идентификатор
      this.selectedService.id = this.zero;
    }
    else {

      // присвоить значение полученных данных
      this.selectedService = result.service;

    } // if

  } // requestGetServiceById


  // запрос на получение коллекции сотрудников заданной компании выполняющие выбранную услугу
  async requestGetAllEmployeesByCompanyIdByServiceId(): Promise<void> {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // запрос на получение коллекции сотрудников
    let result: { message: any, employees: Employee[] } =
      { message: Literals.Ok, employees: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getByFirstIdSecondId(
          Config.urlGetAllEmployeesByCompanyIdByServiceId,
          this.company.id, this.selectedService.id, token)
      );

      result.employees = Employee.parseEmployees(webResult.employees);
    }
    catch (e: any) {

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null)
        result.message = Resources.unauthorizedUserIdData[this.component.language];
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся на странице
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.message.companyId === this.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

      if (result.message.serviceId === this.zero)
        message = Resources.incorrectServiceIdData[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);
    }
    else {

      // получить данные из результата запроса
      this.employees = result.employees;

    } // if

  } // requestGetAllEmployeesByCompanyIdByServiceId


  // метод отображения рейтинга в виде звёзд
  // (рейтинг сотрудника отображают закрашенные звёзды)
  ratingToStar(rating: number): string {

    let maxRating: number = Literals.five;

    let string: string = Literals.empty;

    // рейтинг сотрудника
    for (let i: number = 0; i < rating; i++) {
      string += `<span>&starf;</span>`;
    } // for

    // дополнение до максимального рейтинга
    for (let i: number = 0; i < maxRating - rating; i++) {
      string += `<span>&star;</span>`;
    } // for

    return string;
  } // ratingToStar


  // выбор сотрудника
  async getEmployeeId(employeeId: number): Promise<void> {

    // если НЕ_выбран - выбираем, если выбран - отменяем или выбираем другого
    if (this.selectedEmployeeId === this.zero || this.selectedEmployeeId != employeeId)
      this.selectedEmployeeId = employeeId;
    else
      this.selectedEmployeeId = this.zero;

    // удалить значение выбранного времени начала записи на сеанс
    this.selectedStartTime = Literals.empty;

    // если сотрудник выбран! - запрос на получение промежутков времени
    if (this.selectedEmployeeId !== this.zero) {

      // задать сегодняшнюю дату
      this.selectedDate = this.today;

      // сбросить коллекцию промежутков
      this.freeSlots = [];

      // запрос на получение коллекции свободных для записи
      // промежутков времени сотрудника для заданной даты
      await this.requestGetAllFreeSlotsByEmployeeIdByDate();

    } // if

  } // getEmployeeId


  // задать дату для выбора времени для записи
  async getDate(mode: string): Promise<void> {

    // в зависимости от кнопки, получить соответствующую дату
    let date: Date;
    if (mode === 'previous') {

      // получить дату до отображаемого дня
      date = new Date(this.selectedDate);
      date.setDate(date.getDate() - 1);
    }
    else {

      // получить дату после отображаемого дня
      date = new Date(this.selectedDate);
      date.setDate(date.getDate() + 1);

    } // if

    // сменим значение выбранной даты
    this.selectedDate = date;

    // удалить значение выбранного времени начала записи на сеанс
    this.selectedStartTime = Literals.empty;

    // запрос на получение коллекции свободных для записи
    // промежутков времени сотрудника для заданной даты
    await this.requestGetAllFreeSlotsByEmployeeIdByDate();

  } // getDate


  // запрос на получение коллекции свободных для записи
  // промежутков времени сотрудника для заданной даты
  async requestGetAllFreeSlotsByEmployeeIdByDate(): Promise<void> {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // запрос на получение рабочих дней сотрудника за период
    let result: { message: any, slots: Slot[] } = { message: Literals.Ok, slots: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getAllByIdFromTo(
          Config.urlGetAllFreeSlotsByEmployeeIdByDate, this.selectedEmployeeId,
          this.selectedDate, this.selectedDate, token
        )
      );

      result.slots = Slot.parseSlots(webResult.freeSlots);
    }
    catch (e: any) {

      // если отсутствует соединение
      if (e.status === Literals.zero)
        result.message = Resources.noConnection[this.component.language];
      // ошибка авторизации ([Authorize])
      else if (e.status === Literals.error401 && e.error === null)
        result.message = Resources.unauthorizedUserIdData[this.component.language];
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - вывод сообщения на экран
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.message.employeeId === this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);
    }
    else {

      // очистить коллекцию данных
      this.freeSlots = [];

      // получить данные из результата запроса. Если коллекция нулевая - то
      // сотрудник выходной, создать коллекцию промежутков со значениями по умолчанию
      if (result.slots.length > this.zero) {

        // получить данные из результата запроса
        this.freeSlots = result.slots;

        // установить статус дня - "НЕ_выходной", открыть возможность выбора
        this.isWorkDayBreak = false;
      }
      else {
        // создать коллекцию промежутков со значениями по умолчанию
        let hours: number = 8;
        let minutes: number = Literals.zero;
        while (hours <= 18) {

          this.freeSlots.push(
            new Slot(
              hours,
              Utils.toTime(`${hours}${Literals.doublePoint}${minutes}`),
              Literals.zero,
              null
            ) // new Slot
          ); // push

          hours++;
        } // while

        // установить статус дня - "выходной", скрыть возможность выбора
        this.isWorkDayBreak = true;

      } // if

    } // if

  } // requestGetAllFreeSlotsByEmployeeIdByDate


  // задать временя начала записи на сеанс
  async getStartTime(startTime: string): Promise<void> {

    // получить значение выбранного времени
    this.selectedStartTime = startTime;

  } // getStartTime


  // выполнение запроса на добавление данных о новой онлайн-записи
  async onSubmit(): Promise<void> {

    // задать значения параметров запроса

    // 1) имя клиента

    // 2) номер телефона клиента

    // 3) адрес электронной почты клиента

    // данные о клиенте
    let client: Client = new Client();
    client.name = this.name;
    client.phone = this.phone;
    client.email = this.email;

    // 4) идентификатор сотрудника

    // данные о сотрудника
    let employee: Employee = new Employee();
    employee.id = this.selectedEmployeeId;

    // 5) дата и время начала записи на сеанс
    let date: Date = new Date(this.selectedDate);
    let hours: number = +this.selectedStartTime.split(Literals.doublePoint)[0];
    let minutes: number = +this.selectedStartTime.split(Literals.doublePoint)[1];
    date.setHours(hours, minutes, this.zero, this.zero);

    // 6) дата и время создания записи
    let createDate: Date = new Date();

    // 7) длительность сеанса(в секундах)
    let length: number = this.selectedService.duration;

    // 8) комментарий к записи на сеанс (тут НЕ заполняем)

    // 9) статус посещения клиентом записи на сеанс
    // 0 - ожидание клиента
    let attendance: number = this.zero;

    // 10) принадлежность записи на сеанс к онлайн-записи
    // (true - онлайн-запись, false - запись внёс администратор)
    let isOnline: boolean = true;

    // 11) статус оплаты
    // (true - запись на сеанс оплачена, false - запись на сеанс НЕ_оплачена)
    let isPaid: boolean = false;


    // данные о новой записи на сеанс
    let newRecord: Record = new Record(
      this.zero, employee, client, date, createDate, length,
      null, attendance, isOnline, isPaid, this.zero, null
    ); // new Record


    // запрос на добавление онлайн-записи

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // запрос на добавление онлайн-записи
    let result: any = Literals.Ok;
    try {
      let webResult: any = await firstValueFrom(
        this._webApiService.createOnlineRecordPUT(Config.urlCreateOnlineRecord, newRecord)
      );
    }
    catch (e: any) {

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null)
        result = Resources.unauthorizedUserIdData[this.component.language];
      // другие ошибки
      else
        result = e.error;

    } // try-catch

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки сервера
      if (result.title != undefined) message = result.title;

      if (result.createMessage != undefined) message = result.createMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;

      // переход в начало страницы
      Utils.toStart();
    }
    else {

      // иначе - сообщение об успехе
      result = 'запись успешно добавлена';

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

  } // onSubmit


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {

    // отмена подписки
    this._languageSubscription.unsubscribe();

  } // ngOnDestroy

} // class OnlineRecordEmployeesComponent
// ----------------------------------------------------------------------------
