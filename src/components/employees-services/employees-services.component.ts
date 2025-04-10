// ----------------------------------------------------------------------------
// компонент отображения услуг, предоставляемых
// заданным сотрудником заданной компании
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {IEmployeesServicesComponent} from '../../models/interfaces/IEmployeesServicesComponent';
import {Literals} from '../../infrastructure/Literals';
import {firstValueFrom, Subscription} from 'rxjs';
import {Employee} from '../../models/classes/Employee';
import {Service} from '../../models/classes/Service';
import {DisplayServicesCategory} from '../../models/classes/DisplayServicesCategory';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {WebApiService} from '../../services/web-api.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Utils} from '../../infrastructure/Utils';
import {Resources} from '../../infrastructure/Resources';
import {Config} from '../../infrastructure/Config';
import {DisplayServicesCategoryComponent} from '../display-services-category/display-services-category.component';
import {EmployeeService} from '../../models/classes/EmployeeService';

@Component({
  selector: 'app-employees-services',
  standalone: true,
  imports: [DisplayServicesCategoryComponent],
  templateUrl: './employees-services.component.html',
  styleUrl: './employees-services.component.css'
})
export class EmployeesServicesComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IEmployeesServicesComponent = {
    // параметры меняющиеся при смене языка
    title:                                  Literals.empty,
    collapseServicesCategoryNameTitleStart: Literals.empty,
    labelIsSelectedServiceTitleStart:       Literals.empty,
    labelPriceTitle:                        Literals.empty,
    labelPriceValue:                        Literals.empty,
    labelMinPriceTitle:                     Literals.empty,
    labelMinPriceValue:                     Literals.empty,
    labelMaxPriceTitle:                     Literals.empty,
    labelMaxPriceValue:                     Literals.empty,
    labelDurationTitle:                     Literals.empty,
    labelDurationValue:                     Literals.empty,
    butShowAllServicesTitle:                Literals.empty,
    butCloseAllServicesTitle:               Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:   Literals.empty,
    route:      Literals.empty,
    isWaitFlag: false,
    isShowFlag: false
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о выбранном сотруднике
  public employee: Employee = new Employee();

  // коллекция услуг заданной компании
  public companyServices: Service[] = [];

  // коллекция категорий услуг заданной компании с соответствующими услугами
  public displayServicesCategories: DisplayServicesCategory[] = [];

  // коллекция услуг заданного сотрудника
  public employeeServices: Service[] = [];

  // массив идентификаторов выбранных услуг
  public selectedServicesIds: number[] = [];

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
    Utils.helloComponent(Literals.employeesServices);

    console.log(`[-EmployeesServicesComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`*-this.employee: -*`);
    console.dir(this.employee);

    console.log(`*-this.companyServices: -*`);
    console.dir(this.companyServices);

    console.log(`*-this.displayServicesCategories: -*`);
    console.dir(this.displayServicesCategories);

    console.log(`*-this.employeeServices: -*`);
    console.dir(this.employeeServices);

    console.log(`*-this.selectedServicesIds: -*`);
    console.dir(this.selectedServicesIds);

    console.log(`--EmployeesServicesComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-EmployeesServicesComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-EmployeesServicesComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--EmployeesServicesComponent-subscribe-]`);
      }); // subscribe


    // получить параметры маршрута
    console.dir(this._activatedRoute);
    console.dir(this._activatedRoute.params);
    let employeeId: number = 0;
    // подписка на получение результата перехода по маршруту
    this._activatedRoute.params.subscribe(params => {

      // параметр об Id сотрудника, полученный из маршрута
      console.log(`*-params['id']: '${params[Literals.id]}' -*`);
      employeeId = (params[Literals.id] != undefined && !isNaN(params[Literals.id]) && params[Literals.id] > 0)
        ? +params[Literals.id]
        : 0;
      console.log(`*-employeeId: '${employeeId}' [${typeof employeeId}] -*`);

      console.log(`*-(было)-this.employee.id: '${this.employee.id}' -*`);
      this.employee.id = employeeId;
      console.log(`*-(стало)-this.employee.id: '${this.employee.id}' -*`);

    }); // subscribe


    // проверки на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)

    // ?????????


    console.log(`*-(было)-this.employee: -*`);
    console.dir(this.employee);

    // запрос на получение записи о сотруднике из БД для отображения
    await this.requestGetEmployeeById();

    // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
    if (this.employee.id === this.zero) {
      console.log(`*- Переход на "Home" - 'TRUE' -*`);

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty).then((e) => {
        console.log(`*- переход: ${e} -*`);

        console.log(`--EmployeesServicesComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "Home" - 'FALSE' -*`);

    console.log(`*-(стало)-this.employee: -*`);
    console.dir(this.employee);


    // запрос на получение коллекции услуг компании, в которой работает заданный сотрудник
    console.log(`*-(было)-this.companyServices: -*`);
    console.dir(this.companyServices);
    console.log(`*-(было)-this.displayServicesCategories: -*`);
    console.dir(this.displayServicesCategories);
    await this.requestGetAllServicesByCompanyIdGroupByCategories();
    console.log(`*-(стало)-this.companyServices: -*`);
    console.dir(this.companyServices);
    console.log(`*-(стало)-this.displayServicesCategories: -*`);
    console.dir(this.displayServicesCategories);


    // запрос на получение коллекции услуг заданного сотрудника
    console.log(`*-(было)-this.employeeServices: -*`);
    console.dir(this.employeeServices);
    console.log(`*-(было)-this.selectedServicesIds: -*`);
    console.dir(this.selectedServicesIds);
    await this.requestGetAllServicesByEmployeeId();
    console.log(`*-(стало)-this.employeeServices: -*`);
    console.dir(this.employeeServices);
    console.log(`*-(стало)-this.selectedServicesIds: -*`);
    console.dir(this.selectedServicesIds);

    // установить соответствующий заголовок
    this.component.title = this.employeeServices.length === this.zero
      ? Resources.employeesServicesZeroCollectionTitle[this.component.language]
      : Resources.employeesServicesTitle(this.component.language, this.employee.user.userName);

    console.log(`--EmployeesServicesComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-EmployeesServicesComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title = this.displayServicesCategories.length === this.zero
      ? Resources.employeesServicesZeroCollectionTitle[this.component.language]
      : Resources.employeesServicesTitle(this.component.language, this.employee.user.userName);
    this.component.collapseServicesCategoryNameTitleStart = Resources.servicesCollapseServicesCategoryNameTitleStart[this.component.language];
    /*this.component.butCreateServiceTitle                  = Resources.servicesButCreateServiceTitle[this.component.language];
    this.component.butCreateServiceValue                  = Resources.servicesButCreateServiceValue[this.component.language];*/
    this.component.labelIsSelectedServiceTitleStart       = Resources.servicesLabelIsSelectedServiceTitleStart[this.component.language];
    this.component.labelPriceTitle                        = Resources.labelPriceTitle[this.component.language];
    this.component.labelPriceValue                        = Resources.labelPriceValue[this.component.language];
    this.component.labelMinPriceTitle                     = Resources.labelMinPriceTitle[this.component.language];
    this.component.labelMinPriceValue                     = Resources.labelMinPriceValue[this.component.language];
    this.component.labelMaxPriceTitle                     = Resources.labelMaxPriceTitle[this.component.language];
    this.component.labelMaxPriceValue                     = Resources.labelMaxPriceValue[this.component.language];
    this.component.labelDurationTitle                     = Resources.labelDurationTitle[this.component.language];
    this.component.labelDurationValue                     = Resources.labelDurationValue[this.component.language];
    this.component.butShowAllServicesTitle                = Resources.butShowAllServicesTitle[this.component.language];
    this.component.butCloseAllServicesTitle               = Resources.butCloseAllServicesTitle[this.component.language];
    /*this.component.ratingTitleStart             = Resources.employeesRatingTitleStart[this.component.language];
    this.component.labelName                    = Resources.labelPersonName[this.component.language];
    this.component.labelPhone                   = Resources.labelPhone[this.component.language];
    this.component.labelEmail                   = Resources.labelEmail[this.component.language];
    this.component.labelSpecialization          = Resources.labelSpecialization[this.component.language];
    this.component.labelPosition                = Resources.labelPosition[this.component.language];*/
    /*this.component.labelRating                = Resources.labelRating[this.component.language];*/
    /*this.component.butCreateEmployeeTitle       = Resources.employeesButCreateEmployeeTitle[this.component.language];
    this.component.butCreateEmployeeValue       = Resources.employeesButCreateEmployeeValue[this.component.language];
    this.component.butShowScheduleEmployeeTitle = Resources.employeesButShowScheduleEmployeeTitle[this.component.language];
    this.component.butShowScheduleEmployeeValue = Resources.butScheduleValue[this.component.language];
    this.component.butShowServicesEmployeeTitle = Resources.employeesButShowServicesEmployeeTitle[this.component.language];
    this.component.butShowServicesEmployeeValue = Resources.butServicesValue[this.component.language];
    this.component.butEditEmployeeTitle         = Resources.employeesButEditEmployeeTitle[this.component.language];
    this.component.butDeleteEmployeeTitle       = Resources.employeesButDeleteEmployeeTitle[this.component.language];*/

    console.log(`--EmployeesServicesComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение записи о сотруднике из БД для отображения
  async requestGetEmployeeById(): Promise<void> {
    console.log(`[-EmployeesServicesComponent-requestGetEmployeeById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeesServicesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeesServicesComponent-requestGetEmployeeById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeesServicesComponent-1-(запрос на получение сотрудника)-`);

    // запрос на получение записи о сотруднике
    let result: { message: any, employee: Employee } =
      { message: Literals.Ok, employee: new Employee() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetEmployeeById, this.employee.id, token)
      );
      console.dir(webResult);

      result.employee = Employee.newEmployee(webResult.employee);

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

    console.log(`--EmployeesServicesComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.employee);

    console.log(`--EmployeesServicesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.employeeId: '${result.message.employeeId}'`);
      if (result.message.employeeId != undefined)
        message = result.message.employeeId === this.zero
          ? Resources.incorrectEmployeeIdData[this.component.language]
          : Resources.notRegisteredEmployeeIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);

      // при ошибках установить сотруднику нулевой идентификатор
      this.employee.id = this.zero;
    }
    else {

      // присвоить значение полученных данных
      this.employee = result.employee;

    } // if

    console.log(`--EmployeesServicesComponent-requestGetEmployeeById-]`);
  } // requestGetEmployeeById


  // запрос на получение коллекции услуг компании, в которой работает заданный сотрудник
  async requestGetAllServicesByCompanyIdGroupByCategories(): Promise<void> {
    console.log(`[-EmployeesServicesComponent-requestGetAllServicesByCompanyIdGroupByCategories--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeesServicesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeesServicesComponent-requestGetAllServicesByCompanyIdGroupByCategories-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeesServicesComponent-1-(запрос на получение услуг компании)-`);

    // запрос на получение коллекции категорий услуг с соответствующими услугами
    let result: { message: any, displayServicesCategories: DisplayServicesCategory[] } =
      { message: Literals.Ok, displayServicesCategories: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService
        .getById(Config.urlGetAllServicesByCompanyIdGroupByCategories, this.employee.company.id, token)
      );
      console.dir(webResult);

      result.displayServicesCategories = DisplayServicesCategory
        .parseDisplayServicesCategories(webResult.displayServicesCategories);

    } catch (e: any) {

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

    console.log(`--EmployeesServicesComponent-result:`);
    console.dir(result);

    console.log(`--EmployeesServicesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - вывод сообщения на экран
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.companyId: '${result.message.companyId}'`);
      if (result.message.companyId === Literals.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

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
      this.displayServicesCategories = result.displayServicesCategories;
      this.companyServices = DisplayServicesCategory.allServices(this.displayServicesCategories);

    } // if

    console.log(`--EmployeesServicesComponent-requestGetAllServicesByCompanyIdGroupByCategories-]`);
  } // requestGetAllServicesByCompanyIdGroupByCategories


  // запрос на получение коллекции услуг заданного сотрудника
  async requestGetAllServicesByEmployeeId(): Promise<void> {
    console.log(`[-EmployeesServicesComponent-requestGetAllServicesByEmployeeId--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeesServicesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeesServicesComponent-requestGetAllServicesByEmployeeId-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeesServicesComponent-1-(запрос на получение услуг сотрудника)-`);

    // запрос на получение коллекции услуг заданного сотрудника
    let result: { message: any, services: Service[] } =
      { message: Literals.Ok, services: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService
        .getById(Config.urlGetAllServicesByEmployeeId, this.employee.id, token)
      );
      console.dir(webResult);

      result.services = Service.parseServices(webResult.services);
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

    console.log(`--EmployeesServicesComponent-result:`);
    console.dir(result);

    console.log(`--EmployeesServicesComponent-2-(ответ на запрос получен)-`);

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

      // получить данные из результата запроса
      this.employeeServices = result.services;

      // получить список идентификаторов услуг для выделения
      // в чек-боксах дочерних компонентов отображения услуг
      this.selectedServicesIds = this.employeeServices.map((service: Service) => service.id);

    } // if

    console.log(`--EmployeesServicesComponent-requestGetAllServicesByEmployeeId-]`);
  } // requestGetAllServicesByEmployeeId


  // обработчик события получения данных об Id выбранной услуги
  async sendSelectedServiceIdHandler(result: { serviceId: number, isSelected: boolean }): Promise<void> {
    console.log(`[-EmployeesServicesComponent-sendSelectedServiceIdHandler--`);

    console.log(`*- result: -*`);
    console.dir(result);

    console.log(`*- result.serviceId: '${result.serviceId}' [${typeof result.serviceId}] -*`);
    console.log(`*- result.isSelected: '${result.isSelected}' [${typeof result.isSelected}] -*`);

    // запрос на добавление услуги заданному сотруднику
    if (result.isSelected) {
      console.log(`*- добавление услуги -*`);

      // запрос на добавление данных
      await this.requestCreateEmployeeService(result.serviceId);

    }
    // запрос на удаление услуги у заданного сотрудника
    else {
      console.log(`*- удаление услуги -*`);

      // запрос на удаление данных
      await this.requestDeleteEmployeeService(result.serviceId);

    } // if

    console.log(`--EmployeesServicesComponent-sendSelectedServiceIdHandler-]`);
  } // sendSelectedServiceIdHandler


  // выполнение запроса на добавление данных об услуге сотрудника
  async requestCreateEmployeeService(serviceId: number): Promise<void> {
    console.log(`[-EmployeesServicesComponent-requestCreateEmployeeService--`);

    console.log(`*- serviceId: '${serviceId}' -*`);

    // получим новый объект записи о связи сотрудника и услуги
    let newEmployeeService: EmployeeService = EmployeeService
      .newEmployeeServiceByIds(this.employee.id, serviceId);

    console.log(`*- newEmployeeService: -*`);
    console.dir(newEmployeeService);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeesServicesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeesServicesComponent-requestCreateEmployeeService-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeesServicesComponent-1-(запрос на добавление услуги)-`);

    // запрос на добавление данных об услуге сотрудника
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.createEmployeeServicePUT(
          Config.urlCreateEmployeeService, newEmployeeService, token
        )
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

    console.log(`--EmployeesServicesComponent-result:`);
    console.dir(result);

    console.log(`--EmployeesServicesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся на странице, отменяем удаление
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.employeeServiceId: '${result.employeeServiceId}'`);
      if (result.employeeServiceId === this.zero)
        message = Resources.incorrectEmployeeServiceIdData[this.component.language];

      console.log(`--result.employeeId: '${result.employeeId}'`);
      if (result.employeeId === this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      console.log(`--result.message.serviceId: '${result.serviceId}'`);
      if (result.serviceId === this.zero)
        message = Resources.incorrectServiceIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.title: '${result.title}'`);
      if (result.title != undefined) message = result.title;

      console.log(`--result.createMessage: '${result.createMessage}'`);
      if (result.createMessage != undefined) message = result.createMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;
    }
    else {
      // иначе - сообщение об успехе
      result = Resources.employeesServicesCreateEmployeeServiceOk[this.component.language];

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

    console.log(`--EmployeesServicesComponent-requestCreateEmployeeService-]`);
  } // requestCreateEmployeeService


  // выполнение запроса на удаление данных об услуге сотрудника
  async requestDeleteEmployeeService(serviceId: number): Promise<void> {
    console.log(`[-EmployeesServicesComponent-requestDeleteEmployeeService--`);

    console.log(`*- serviceId: '${serviceId}' -*`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeesServicesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeesServicesComponent-requestDeleteEmployeeService-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeesServicesComponent-1-(запрос на удаление услуги)-`);

    // запрос на удаление данных об услуге сотрудника
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.deleteByFirstIdSecondId(
          Config.urlDeleteEmployeeServiceByEmployeeIdServiceId,
          this.employee.id, serviceId, token
        )
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

    console.log(`--EmployeesServicesComponent-result:`);
    console.dir(result);

    console.log(`--EmployeesServicesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся на странице, отменяем удаление
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.employeeId: '${result.employeeId}'`);
      if (result.employeeId === this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      console.log(`--result.message.serviceId: '${result.serviceId}'`);
      if (result.serviceId === this.zero)
        message = Resources.incorrectServiceIdData[this.component.language];

      console.log(`--result.employeeServiceId: '${result.employeeServiceId}'`);
      if (result.employeeServiceId === this.zero)
        message = Resources.incorrectEmployeeServiceIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.title: '${result.title}'`);
      if (result.title != undefined) message = result.title;

      console.log(`--result.updateMessage: '${result.updateMessage}'`);
      if (result.updateMessage != undefined) message = result.updateMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;
    }
    else {
      // иначе - сообщение об успехе
      result = Resources.employeesServicesDeleteEmployeeServiceOk[this.component.language];

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

    console.log(`--EmployeesServicesComponent-requestDeleteEmployeeService-]`);
  } // requestDeleteEmployeeService


  // метод выполнения/НЕ_выполнения обновления токена
  private async isRefreshToken(): Promise<boolean> {
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

  } // isRefreshToken


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-EmployeesServicesComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--EmployeesServicesComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class EmployeesServicesComponent
// ----------------------------------------------------------------------------
