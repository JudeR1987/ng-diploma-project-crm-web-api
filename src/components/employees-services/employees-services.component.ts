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

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];

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
    let employeeId: number = 0;
    // подписка на получение результата перехода по маршруту
    this._activatedRoute.params.subscribe(params => {

      // параметр об Id сотрудника, полученный из маршрута
      employeeId = (params[Literals.id] != undefined && !isNaN(params[Literals.id]) && params[Literals.id] > 0)
        ? +params[Literals.id]
        : 0;
      this.employee.id = employeeId;

    }); // subscribe


    // запрос на получение записи о сотруднике из БД для отображения
    await this.requestGetEmployeeById();

    // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
    if (this.employee.id === this.zero) {

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

      return;
    } // if


    // запрос на получение коллекции услуг компании, в которой работает заданный сотрудник
    await this.requestGetAllServicesByCompanyIdGroupByCategories();


    // запрос на получение коллекции услуг заданного сотрудника
    await this.requestGetAllServicesByEmployeeId();

    // установить соответствующий заголовок
    this.component.title = this.employeeServices.length === this.zero
      ? Resources.employeesServicesZeroCollectionTitle[this.component.language]
      : Resources.employeesServicesTitle(this.component.language, this.employee.user.userName);

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title = this.displayServicesCategories.length === this.zero
      ? Resources.employeesServicesZeroCollectionTitle[this.component.language]
      : Resources.employeesServicesTitle(this.component.language, this.employee.user.userName);
    this.component.collapseServicesCategoryNameTitleStart = Resources.servicesCollapseServicesCategoryNameTitleStart[this.component.language];
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

  } // changeLanguageLiterals


  // запрос на получение записи о сотруднике из БД для отображения
  async requestGetEmployeeById(): Promise<void> {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    // запрос на получение записи о сотруднике
    let result: { message: any, employee: Employee } =
      { message: Literals.Ok, employee: new Employee() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetEmployeeById, this.employee.id, token)
      );

      result.employee = Employee.newEmployee(webResult.employee);
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

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.message.employeeId != undefined)
        message = result.message.employeeId === this.zero
          ? Resources.incorrectEmployeeIdData[this.component.language]
          : Resources.notRegisteredEmployeeIdData[this.component.language];

      // ошибки сервера
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

  } // requestGetEmployeeById


  // запрос на получение коллекции услуг компании, в которой работает заданный сотрудник
  async requestGetAllServicesByCompanyIdGroupByCategories(): Promise<void> {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    // запрос на получение коллекции категорий услуг с соответствующими услугами
    let result: { message: any, displayServicesCategories: DisplayServicesCategory[] } =
      { message: Literals.Ok, displayServicesCategories: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService
        .getById(Config.urlGetAllServicesByCompanyIdGroupByCategories, this.employee.company.id, token)
      );

      result.displayServicesCategories = DisplayServicesCategory
        .parseDisplayServicesCategories(webResult.displayServicesCategories);
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
      if (result.message.companyId === Literals.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

      // ошибки сервера
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

  } // requestGetAllServicesByCompanyIdGroupByCategories


  // запрос на получение коллекции услуг заданного сотрудника
  async requestGetAllServicesByEmployeeId(): Promise<void> {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    // запрос на получение коллекции услуг заданного сотрудника
    let result: { message: any, services: Service[] } =
      { message: Literals.Ok, services: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService
        .getById(Config.urlGetAllServicesByEmployeeId, this.employee.id, token)
      );

      result.services = Service.parseServices(webResult.services);
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

      // получить данные из результата запроса
      this.employeeServices = result.services;

      // получить список идентификаторов услуг для выделения
      // в чек-боксах дочерних компонентов отображения услуг
      this.selectedServicesIds = this.employeeServices.map((service: Service) => service.id);

    } // if

  } // requestGetAllServicesByEmployeeId


  // обработчик события получения данных об Id выбранной услуги
  async sendSelectedServiceIdHandler(result: { serviceId: number, isSelected: boolean }): Promise<void> {

    // запрос на добавление услуги заданному сотруднику
    if (result.isSelected) {

      // запрос на добавление данных
      await this.requestCreateEmployeeService(result.serviceId);
    }
    // запрос на удаление услуги у заданного сотрудника
    else {

      // запрос на удаление данных
      await this.requestDeleteEmployeeService(result.serviceId);

    } // if

  } // sendSelectedServiceIdHandler


  // выполнение запроса на добавление данных об услуге сотрудника
  async requestCreateEmployeeService(serviceId: number): Promise<void> {

    // получим новый объект записи о связи сотрудника и услуги
    let newEmployeeService: EmployeeService = EmployeeService
      .newEmployeeServiceByIds(this.employee.id, serviceId);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

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

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся на странице, отменяем удаление
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.employeeServiceId === this.zero)
        message = Resources.incorrectEmployeeServiceIdData[this.component.language];

      if (result.employeeId === this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      if (result.serviceId === this.zero)
        message = Resources.incorrectServiceIdData[this.component.language];

      // ошибки сервера
      if (result.title != undefined) message = result.title;

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

  } // requestCreateEmployeeService


  // выполнение запроса на удаление данных об услуге сотрудника
  async requestDeleteEmployeeService(serviceId: number): Promise<void> {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

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

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся на странице, отменяем удаление
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.employeeId === this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      if (result.serviceId === this.zero)
        message = Resources.incorrectServiceIdData[this.component.language];

      if (result.employeeServiceId === this.zero)
        message = Resources.incorrectEmployeeServiceIdData[this.component.language];

      // ошибки сервера
      if (result.title != undefined) message = result.title;

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

  } // requestDeleteEmployeeService


  // метод выполнения/НЕ_выполнения обновления токена
  private async isRefreshToken(): Promise<boolean> {

     // запрос на обновление токена
    let result: boolean;
    let message: any;
    [result, message] = await this._authGuardService.refreshToken();

    // сообщение об успехе
    if (message === Literals.Ok)
      message = Resources.refreshTokenOk[this.component.language];

    // ошибки данных
    if (message.refreshModel) message =
      Resources.incorrectUserIdData[this.component.language];

    // ошибки данных о пользователе
    if (message.userId != undefined && message.userToken === undefined)
      message = Resources.notRegisteredUserIdData[this.component.language];

    // ошибки входа пользователя
    if (message.userId != undefined && message.userToken != undefined)
      message = Resources.unauthorizedUserIdData[this.component.language];

    // ошибки сервера
    if (message.title != undefined) message = message.title;

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(message);

    // вернуть логический результат операции
    return result;

  } // isRefreshToken


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {

    // отмена подписки
    this._languageSubscription.unsubscribe();

  } // ngOnDestroy

} // class EmployeesServicesComponent
// ----------------------------------------------------------------------------
