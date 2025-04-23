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

    console.log(`[-OnlineRecordEmployeesComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`*-this.company: -*`);
    console.dir(this.company);

    console.log(`*-this.employees: -*`);
    console.dir(this.employees);

    /*console.log(`*-this.displayServicesCategories: -*`);
    console.dir(this.displayServicesCategories);*/

    this.selectedDate = this.today;
    console.log(`*-this.selectedDate.toLocaleDateString(): '${this.selectedDate.toLocaleDateString()}' -*`);

    console.log(`--OnlineRecordEmployeesComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-OnlineRecordEmployeesComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-OnlineRecordEmployeesComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--OnlineRecordEmployeesComponent-subscribe-]`);
      }); // subscribe


    // получить параметры маршрута
    console.dir(this._activatedRoute);
    console.dir(this._activatedRoute.params);
    console.dir(this._activatedRoute.queryParams);
    let companyId: number = 0;
    let servicesIds: number[] = [];
    // подписка на получение результата перехода по маршруту (данные из маршрута)
    this._activatedRoute.params.subscribe(params => {

      // параметр об Id компании, полученный из маршрута
      console.log(`*-params['id']: '${params[Literals.id]}' -*`);
      companyId = params[Literals.id] != undefined
        ? +params[Literals.id]
        : 0;
      console.log(`*-companyId: '${companyId}' [${typeof companyId}] -*`);

      console.log(`*-(было)-this.company.id: '${this.company.id}' -*`);
      this.company.id = companyId;
      console.log(`*-(стало)-this.company.id: '${this.company.id}' -*`);

    }); // subscribe

    // подписка на получение результата перехода по маршруту (данные из параметров маршрута)
    this._activatedRoute.queryParams.subscribe(params => {

      // параметр об Id выбранных услуг
      console.log(`*-params['servicesIds']: '${params['servicesIds']}' -*`);
      servicesIds = params['servicesIds'];
      console.log(`*-servicesIds: -*`);
      console.dir(servicesIds);

      console.log(`*-(было)-this.selectedServicesIds: -*`);
      console.dir(this.selectedServicesIds);
      this.selectedServicesIds = servicesIds;
      console.log(`*-(стало)-this.selectedServicesIds: -*`);
      console.dir(this.selectedServicesIds);

      console.log(`*-(было)-this.selectedService: -*`);
      console.dir(this.selectedService);
      // пока берём последнюю услугу
      this.selectedService.id = (typeof this.selectedServicesIds) != Literals.string
        ? this.selectedServicesIds[this.selectedServicesIds.length - 1]
        : +this.selectedServicesIds;
      console.log(`*-(стало)-this.selectedService: -*`);
      console.dir(this.selectedService);

    }); // subscribe

    // проверки на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)

    // ?????????

    console.log(`*-(было)-this.company: -*`);
    console.dir(this.company);

    // запрос на получение записи о компании из БД для отображения
    await this.requestGetCompanyById();

    // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
    if (this.company.id === this.zero) {
      console.log(`*- Переход на "Home" - 'TRUE' -*`);

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty).then((e) => {
        console.log(`*- переход: ${e} -*`);

        console.log(`--OnlineRecordEmployeesComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "Home" - 'FALSE' -*`);

    console.log(`*-(стало)-this.company: -*`);
    console.dir(this.company);


    console.log(`*-(было)-this.selectedService: -*`);
    console.dir(this.selectedService);

    // запрос на получение записи о выбранной услуге из БД для отображения
    await this.requestGetServiceById();

    // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
    if (this.selectedService.id === this.zero) {
      console.log(`*- Переход на "Home" - 'TRUE' -*`);

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty).then((e) => {
        console.log(`*- переход: ${e} -*`);

        console.log(`--OnlineRecordEmployeesComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "Home" - 'FALSE' -*`);

    console.log(`*-(стало)-this.selectedService: -*`);
    console.dir(this.selectedService);


    // запрос на получение коллекции сотрудников заданной компании выполняющие выбранную услугу
    console.log(`*-(было)-this.employees: -*`);
    console.dir(this.employees);
    /*console.log(`*-(было)-this.displayServicesCategories: -*`);
    console.dir(this.displayServicesCategories);*/
    await this.requestGetAllEmployeesByCompanyIdByServiceId();
    console.log(`*-(стало)-this.employees: -*`);
    console.dir(this.employees);
    /*console.log(`*-(стало)-this.displayServicesCategories: -*`);
    console.dir(this.displayServicesCategories);*/

    console.log(`--OnlineRecordEmployeesComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-OnlineRecordEmployeesComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title = Resources.onlineRecordEmployeesTitle[this.component.language];

    console.log(`--OnlineRecordEmployeesComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение записи о компании из БД для отображения
  async requestGetCompanyById(): Promise<void> {
    console.log(`[-OnlineRecordEmployeesComponent-requestGetCompanyById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--OnlineRecordEmployeesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    /*if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--OnlineRecordEmployeesComponent-requestGetCompanyById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if*/

    console.log(`--OnlineRecordEmployeesComponent-1-(запрос на получение компании)-`);

    // запрос на получение записи о компании
    let result: { message: any, company: Company } =
      { message: Literals.Ok, company: new Company() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetCompanyById, this.company.id, token)
      );
      console.dir(webResult);

      result.company = Company.newCompany(webResult.company);
    }
    catch (e: any) {

      console.dir(e);
      console.dir(e.error);

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null) {
        console.log(`*- отработал [Authorize] -*`);
        result.message = Resources.unauthorizedUserIdData[this.component.language]
      }
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    console.log(`--OnlineRecordEmployeesComponent-result:`);
    console.dir(result);

    console.log(`--OnlineRecordEmployeesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся на странице
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.companyId: '${result.message.companyId}'`);
      if (result.message.companyId != undefined)
        message = result.message.companyId === this.zero
          ? Resources.incorrectCompanyIdData[this.component.language]
          : Resources.notRegisteredCompanyIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
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

    console.log(`--OnlineRecordEmployeesComponent-requestGetCompanyById-]`);
  } // requestGetCompanyById


  // запрос на получение записи о выбранной услуге из БД для отображения
  async requestGetServiceById(): Promise<void> {
    console.log(`[-OnlineRecordEmployeesComponent-requestGetServiceById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--OnlineRecordEmployeesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    /*if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--OnlineRecordEmployeesComponent-requestGetCompanyById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if*/

    console.log(`--OnlineRecordEmployeesComponent-1-(запрос на получение услуги)-`);

    // запрос на получение записи о выбранной услуге
    let result: { message: any, service: Service } =
      { message: Literals.Ok, service: new Service() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetServiceById, this.selectedService.id, token)
      );
      console.dir(webResult);

      result.service = Service.newService(webResult.service);
    }
    catch (e: any) {

      console.dir(e);
      console.dir(e.error);

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null) {
        console.log(`*- отработал [Authorize] -*`);
        result.message = Resources.unauthorizedUserIdData[this.component.language]
      }
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    console.log(`--OnlineRecordEmployeesComponent-result:`);
    console.dir(result);

    console.log(`--OnlineRecordEmployeesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся на странице
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.serviceId: '${result.message.serviceId}'`);
      if (result.message.serviceId != undefined)
        message = result.message.serviceId === this.zero
          ? Resources.incorrectServiceIdData[this.component.language]
          : Resources.notRegisteredServiceIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
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

    console.log(`--OnlineRecordEmployeesComponent-requestGetServiceById-]`);
  } // requestGetServiceById


  // запрос на получение коллекции сотрудников заданной компании выполняющие выбранную услугу
  async requestGetAllEmployeesByCompanyIdByServiceId(): Promise<void> {
    console.log(`[-OnlineRecordEmployeesComponent-requestGetAllEmployeesByCompanyIdByServiceId--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--OnlineRecordEmployeesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    /*if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--OnlineRecordEmployeesComponent-requestGetAllEmployeesByCompanyIdByServiceId-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if*/

    console.log(`--OnlineRecordEmployeesComponent-1-(запрос на получение сотрудников)-`);

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
      console.dir(webResult);

      result.employees = Employee.parseEmployees(webResult.employees);
    }
    catch (e: any) {

      console.dir(e);
      console.dir(e.error);

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null) {
        console.log(`*- отработал [Authorize] -*`);
        result.message = Resources.unauthorizedUserIdData[this.component.language]
      }
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    console.log(`--OnlineRecordEmployeesComponent-result:`);
    console.dir(result);

    console.log(`--OnlineRecordEmployeesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся на странице
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.companyId: '${result.message.companyId}'`);
      if (result.message.companyId === this.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

      console.log(`--result.message.serviceId: '${result.message.serviceId}'`);
      if (result.message.serviceId === this.zero)
        message = Resources.incorrectServiceIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
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

    console.log(`--OnlineRecordEmployeesComponent-requestGetAllEmployeesByCompanyIdByServiceId-]`);
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

    console.log(`*- employeeId: '${employeeId}' -*`);

    // если НЕ_выбран - выбираем, если выбран - отменяем или выбираем другого
    if (this.selectedEmployeeId === this.zero || this.selectedEmployeeId != employeeId) {
      this.selectedEmployeeId = employeeId;
    } else {
      this.selectedEmployeeId = this.zero;
    } // if

    // удалить значение выбранного времени начала записи на сеанс
    this.selectedStartTime = Literals.empty;

    console.log(`*- this.selectedEmployeeId: '${this.selectedEmployeeId}' -*`);

    // если сотрудник выбран! - запрос на получение промежутков времени
    if (this.selectedEmployeeId !== this.zero) {

      // задать сегодняшнюю дату
      this.selectedDate = this.today;
      console.log(`*-this.selectedDate.toLocaleDateString(): '${this.selectedDate.toLocaleDateString()}' -*`);

      // сбросить коллекцию промежутков
      this.freeSlots = [];

      // запрос на получение коллекции свободных для записи
      // промежутков времени сотрудника для заданной даты
      console.log(`*-(было)-this.freeSlots: -*`);
      console.dir(this.freeSlots);
      await this.requestGetAllFreeSlotsByEmployeeIdByDate();
      console.log(`*-(стало)-this.freeSlots: -*`);
      console.dir(this.freeSlots);

    } // if

  } // getEmployeeId


  // задать дату для выбора времени для записи
  async getDate(mode: string): Promise<void> {

    // в зависимости от кнопки, получить соответствующую дату
    let date: Date;
    if (mode === 'previous') {

      // получить дату до отображаемого дня
      date = new Date(this.selectedDate);
      console.log(`*-(было) date.toLocaleString: '${date.toLocaleString()}' -*`);

      date.setDate(date.getDate() - 1);
      console.log(`*-(стало) date.toLocaleString: '${date.toLocaleString()}' -*`);

    } else {

      // получить дату после отображаемого дня
      date = new Date(this.selectedDate);
      console.log(`*-(было) date.toLocaleString: '${date.toLocaleString()}' -*`);

      date.setDate(date.getDate() + 1);
      console.log(`*-(стало) date.toLocaleString: '${date.toLocaleString()}' -*`);

    } // if

    // сменим значение выбранной даты
    console.log(`*-(было) this.selectedDate.toLocaleString: '${this.selectedDate.toLocaleString()}' -*`);
    this.selectedDate = date;
    console.log(`*-(стало) this.selectedDate.toLocaleString: '${this.selectedDate.toLocaleString()}' -*`);

    // удалить значение выбранного времени начала записи на сеанс
    this.selectedStartTime = Literals.empty;

    // запрос на получение коллекции свободных для записи
    // промежутков времени сотрудника для заданной даты
    console.log(`*-(было)-this.freeSlots: -*`);
    console.dir(this.freeSlots);
    await this.requestGetAllFreeSlotsByEmployeeIdByDate();
    console.log(`*-(стало)-this.freeSlots: -*`);
    console.dir(this.freeSlots);

  } // getDate


  // запрос на получение коллекции свободных для записи
  // промежутков времени сотрудника для заданной даты
  async requestGetAllFreeSlotsByEmployeeIdByDate(): Promise<void> {
    console.log(`[-OnlineRecordEmployeesComponent-requestGetAllFreeSlotsByEmployeeIdByDate--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--OnlineRecordEmployeesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    /*if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--OnlineRecordEmployeesComponent-requestGetAllFreeSlotsByEmployeeIdByDate-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if*/

    console.log(`--OnlineRecordEmployeesComponent-1-(запрос на получение рабочих дней)-`);

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
      console.dir(webResult);

      result.slots = Slot.parseSlots(webResult.freeSlots);
    }
    catch (e: any) {

      console.dir(e);
      console.dir(e.error);
      console.dir(e.status);

      // если отсутствует соединение
      if (e.status === Literals.zero) {
        result.message = Resources.noConnection[this.component.language];

        // ошибка авторизации ([Authorize])
      } else if (e.status === Literals.error401 && e.error === null) {
        console.log(`*- отработал [Authorize] -*`);
        result.message = Resources.unauthorizedUserIdData[this.component.language]

        // другие ошибки
      } else
        result.message = e.error;

    } // try-catch

    console.log(`--OnlineRecordEmployeesComponent-result:`);
    console.dir(result);

    console.log(`--OnlineRecordEmployeesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - вывод сообщения на экран
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.employeeId: '${result.message.employeeId}'`);
      if (result.message.employeeId === this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
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
      if (result.slots.length > this.zero){

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

    console.log(`--OnlineRecordEmployeesComponent-requestGetAllFreeSlotsByEmployeeIdByDate-]`);
  } // requestGetAllFreeSlotsByEmployeeIdByDate


  // задать временя начала записи на сеанс
  async getStartTime(startTime: string): Promise<void> {

    console.log(`*- startTime: '${startTime}' -*`);

    // получить значение выбранного времени
    console.log(`*-(было) this.selectedStartTime: '${this.selectedStartTime}' -*`);
    this.selectedStartTime = startTime;
    console.log(`*-(стало) this.selectedStartTime: '${this.selectedStartTime}' -*`);

    // в зависимости от кнопки, получить соответствующую дату
    //let date: Date;
    /*if (mode === 'previous') {

      // получить дату до отображаемого дня
      date = new Date(this.selectedDate);
      console.log(`*-(было) date.toLocaleString: '${date.toLocaleString()}' -*`);

      date.setDate(date.getDate() - 1);
      console.log(`*-(стало) date.toLocaleString: '${date.toLocaleString()}' -*`);

    } else {

      // получить дату после отображаемого дня
      date = new Date(this.selectedDate);
      console.log(`*-(было) date.toLocaleString: '${date.toLocaleString()}' -*`);

      date.setDate(date.getDate() + 1);
      console.log(`*-(стало) date.toLocaleString: '${date.toLocaleString()}' -*`);

    } // if*/

    // сменим значение выбранной даты
    /*console.log(`*-(было) this.selectedDate.toLocaleString: '${this.selectedDate.toLocaleString()}' -*`);
    this.selectedDate = date;
    console.log(`*-(стало) this.selectedDate.toLocaleString: '${this.selectedDate.toLocaleString()}' -*`);

    // запрос на получение коллекции свободных для записи
    // промежутков времени сотрудника для заданной даты
    console.log(`*-(было)-this.freeSlots: -*`);
    console.dir(this.freeSlots);
    await this.requestGetAllFreeSlotsByEmployeeIdByDate();
    console.log(`*-(стало)-this.freeSlots: -*`);
    console.dir(this.freeSlots);*/

  } // getStartTime


  // выполнение запроса на добавление данных о новой онлайн-записи
  async onSubmit(): Promise<void> {
    console.log(`[-OnlineRecordEmployeesComponent-onSubmit--`);

    console.log("Отправка данных на сервер");

    // задать значения параметров запроса

    // 1) имя клиента
    console.log(`*-this.name = '${this.name}' -*`);

    // 2) номер телефона клиента
    console.log(`*-this.phone = '${this.phone}' -*`);

    // 3) адрес электронной почты клиента
    console.log(`*-this.email = '${this.email}' -*`);

    // данные о клиенте
    let client: Client = new Client();
    client.name = this.name;
    client.phone = this.phone;
    client.email = this.email;
    console.log(`*- client -*`);
    console.dir(client);

    // 4) идентификатор сотрудника
    console.log(`*-this.selectedEmployeeId = '${this.selectedEmployeeId}' -*`);

    // данные о сотрудника
    let employee: Employee = new Employee();
    employee.id = this.selectedEmployeeId;
    console.log(`*- employee -*`);
    console.dir(employee);

    // 5) дата и время начала записи на сеанс
    let date: Date = new Date(this.selectedDate);
    let hours: number = +this.selectedStartTime.split(Literals.doublePoint)[0];
    let minutes: number = +this.selectedStartTime.split(Literals.doublePoint)[1];
    date.setHours(hours, minutes, this.zero, this.zero);
    console.log(`*-date.toLocaleString() = '${date.toLocaleString()}' -*`);

    // 6) дата и время создания записи
    let createDate: Date = new Date();
    console.log(`*-createDate.toLocaleString() = '${createDate.toLocaleString()}' -*`);

    // 7) длительность сеанса(в секундах)
    let length: number = this.selectedService.duration;
    console.log(`*-length = '${length}' -*`);

    // 8) комментарий к записи на сеанс (тут НЕ заполняем)

    // 9) статус посещения клиентом записи на сеанс
    // 0 - ожидание клиента
    let attendance: number = this.zero;
    console.log(`*-attendance = '${attendance}' -*`);

    // 10) принадлежность записи на сеанс к онлайн-записи
    // (true - онлайн-запись, false - запись внёс администратор)
    let isOnline: boolean = true;
    console.log(`*-isOnline = '${isOnline}' -*`);

    // 11) статус оплаты
    // (true - запись на сеанс оплачена, false - запись на сеанс НЕ_оплачена)
    let isPaid: boolean = false;
    console.log(`*-isPaid = '${isPaid}' -*`);


    // данные о новой записи на сеанс
    let newRecord: Record = new Record(
      this.zero, employee, client, date, createDate, length,
      null, attendance, isOnline, isPaid, this.zero, null
    ); // new Record


    // запрос на добавление онлайн-записи

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--OnlineRecordEmployeesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    /*if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--OnlineRecordEmployeesComponent-onSubmit-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if*/

    console.log(`--OnlineRecordEmployeesComponent-1-(запрос на добавление)-`);

    // запрос на добавление онлайн-записи
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      // let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.createOnlineRecordPUT(Config.urlCreateOnlineRecord, newRecord)
      );
      console.dir(webResult);

    }
    catch (e: any) {

      console.dir(e);
      console.dir(e.error);

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null) {
        console.log(`*- отработал [Authorize] -*`);
        result = Resources.unauthorizedUserIdData[this.component.language]
      }
      // другие ошибки
      else
        result = e.error;

    } // try-catch

    console.log(`--OnlineRecordEmployeesComponent-result:`);
    console.dir(result);

    console.log(`--OnlineRecordEmployeesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      /*console.log(`--result.recordId: '${result.recordId}'`);
      if (result.recordId === this.zero)
        message = 'не корректные данные об онлайн-записи';*/

      // ошибки сервера
      console.log(`--result.title: '${result.title}'`);
      if (result.title != undefined) message = result.title;

      console.log(`--result.createMessage: '${result.createMessage}'`);
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

    console.log(`--OnlineRecordEmployeesComponent-onSubmit-]`);
  } // onSubmit


  // метод выполнения/НЕ_выполнения обновления токена
  /*private async isRefreshToken(): Promise<boolean> {
    console.log(`Обновляем токен!`);

    // запрос на обновление токена
    let result: boolean;
    let message: any;
    [result, message] = await this._authGuardService.refreshToken();

    console.log(`--result: '${result}'`);

    console.log(`--message: '${message}'`);
    console.dir(message);

    // сообщение об успехе
    if (message === Literals.Ok)
      message = Resources.refreshTokenOk[this.component.language];

    // ошибки данных
    console.log(`--message.refreshModel: '${message.refreshModel}'`);
    console.dir(message.refreshModel);
    if (message.refreshModel) message =
      Resources.incorrectUserIdData[this.component.language];

    // ошибки данных о пользователе
    console.log(`--message.userId: '${message.userId}'`);
    console.log(`--message.userToken: '${message.userToken}'`);
    if (message.userId != undefined && message.userToken === undefined)
      message = Resources.notRegisteredUserIdData[this.component.language];

    // ошибки входа пользователя
    if (message.userId != undefined && message.userToken != undefined)
      message = Resources.unauthorizedUserIdData[this.component.language];

    // ошибки сервера
    console.log(`--message.title: '${message.title}'`);
    if (message.title != undefined) message = message.title;

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(message);

    // вернуть логический результат операции
    return result;

  } // isRefreshToken*/


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-OnlineRecordEmployeesComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--OnlineRecordEmployeesComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class OnlineRecordEmployeesComponent
// ----------------------------------------------------------------------------
