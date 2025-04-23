// ----------------------------------------------------------------------------
// компонент отображения сотрудников заданной компании
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {IEmployeesComponent} from '../../models/interfaces/IEmployeesComponent';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {WebApiService} from '../../services/web-api.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {firstValueFrom, Subscription} from 'rxjs';
import {Employee} from '../../models/classes/Employee';
import {Resources} from '../../infrastructure/Resources';
import {Company} from '../../models/classes/Company';
import {Config} from '../../infrastructure/Config';
import {CardEmployeeComponent} from '../card-employee/card-employee.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CardEmployeeComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IEmployeesComponent = {
    // параметры меняющиеся при смене языка
    displayTitle:                 Literals.empty,
    ratingTitleStart:             Literals.empty,
    labelName:                    Literals.empty,
    labelPhone:                   Literals.empty,
    labelEmail:                   Literals.empty,
    labelSpecialization:          Literals.empty,
    labelPosition:                Literals.empty,
    /*labelRating:                Literals.empty,*/
    butCreateEmployeeTitle:       Literals.empty,
    butCreateEmployeeValue:       Literals.empty,
    butShowScheduleEmployeeTitle: Literals.empty,
    butShowScheduleEmployeeValue: Literals.empty,
    butShowServicesEmployeeTitle: Literals.empty,
    butShowServicesEmployeeValue: Literals.empty,
    butEditEmployeeTitle:         Literals.empty,
    butDeleteEmployeeTitle:       Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:   Literals.empty,
    route:      Literals.empty,
    isWaitFlag: false
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о выбранной компании
  public company: Company = new Company();

  // коллекция сотрудников заданной компании
  public employees: Employee[] = [];

  // свойство для ограничения отображения элементов разметки
  protected readonly zero: number = Literals.zero;
  protected readonly one: number  = Literals.one;
  protected readonly createEmployee: string = Literals.createEmployee;
  protected readonly editEmployee: string   = Literals.editEmployee;
  protected readonly deleteEmployee: string = Literals.deleteEmployee;
  protected readonly showSchedule: string   = Literals.showSchedule;
  protected readonly showServices: string   = Literals.showServices;


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута, подключения объекта активного маршрута для
  // получения параметров маршрута, подключения к сервису установки языка,
  // подключения к web-сервису, подключения к сервису хранения сообщения об ошибке,
  // подключения к сервисам хранения данных о пользователе и jwt-токене
  // и подключения к сервису аутентификации/авторизации пользователя
  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _languageService: LanguageService,
              private _webApiService: WebApiService,
              private _errorMessageService: ErrorMessageService,
              /*private _userService: UserService,*/
              private _tokenService: TokenService,
              private _authGuardService: AuthGuardService) {
    Utils.helloComponent(Literals.employees);

    console.log(`[-EmployeesComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`*-this.employees: -*`);
    console.dir(this.employees);

    console.log(`--EmployeesComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-EmployeesComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-EmployeesComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--EmployeesComponent-subscribe-]`);
      }); // subscribe


    // получить данные о пользователе из сервиса-хранилища
    /*console.log(`*-(было)-this.user: -*`);
    console.dir(this.user);
    this.user = this._userService.user;
    console.log(`*-(стало)-this.user: -*`);
    console.dir(this.user);*/


    // получить параметры маршрута
    console.dir(this._activatedRoute);
    console.dir(this._activatedRoute.params);
    let companyId: number = 0;
    // подписка на получение результата перехода по маршруту
    this._activatedRoute.params.subscribe(params => {

      // параметр об Id компании, полученный из маршрута
      console.log(`*-params['id']: '${params[Literals.id]}' -*`);
      companyId = (params[Literals.id] != undefined && !isNaN(params[Literals.id]) && params[Literals.id] > 0)
        ? +params[Literals.id]
        : 0;
      console.log(`*-companyId: '${companyId}' [${typeof companyId}] -*`);

      console.log(`*-(было)-this.company.id: '${this.company.id}' -*`);
      this.company.id = companyId;
      console.log(`*-(стало)-this.company.id: '${this.company.id}' -*`);

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

        console.log(`--EmployeesComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "Home" - 'FALSE' -*`);

    console.log(`*-(стало)-this.company: -*`);
    console.dir(this.company);


    // запрос на получение коллекции сотрудников заданной компании
    console.log(`*-(было)-this.employees: -*`);
    console.dir(this.employees);
    await this.requestGetAllEmployeesByCompanyId();
    console.log(`*-(стало)-this.employees: -*`);
    console.dir(this.employees);

    // установить соответствующий заголовок
    this.component.displayTitle = this.employees.length === this.zero
      ? Resources.employeesZeroCollectionTitle[this.component.language]
      : Resources.employeesTitle[this.component.language];

    console.log(`--EmployeesComponent-ngOnInit-]`);
  } // ngOnInit


  // запрос на получение записи о компании из БД для отображения
  async requestGetCompanyById(): Promise<void> {
    console.log(`[-EmployeesComponent-requestGetCompanyById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeesComponent-requestGetCompanyById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeesComponent-1-(запрос на получение компании)-`);

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

    } catch (e: any) {

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

    console.log(`--EmployeesComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.company);

    console.log(`--EmployeesComponent-2-(ответ на запрос получен)-`);

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

    } else {

      // присвоить значение полученных данных
      this.company = result.company;

    } // if

    console.log(`--EmployeesComponent-requestGetCompanyById-]`);
  } // requestGetCompanyById


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-EmployeesComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.displayTitle = this.employees.length === this.zero
      ? Resources.employeesZeroCollectionTitle[this.component.language]
      : Resources.employeesTitle[this.component.language];
    this.component.ratingTitleStart             = Resources.employeesRatingTitleStart[this.component.language];
    this.component.labelName                    = Resources.labelPersonName[this.component.language];
    this.component.labelPhone                   = Resources.labelPhone[this.component.language];
    this.component.labelEmail                   = Resources.labelEmail[this.component.language];
    this.component.labelSpecialization          = Resources.labelSpecialization[this.component.language];
    this.component.labelPosition                = Resources.labelPosition[this.component.language];
    /*this.component.labelRating                = Resources.labelRating[this.component.language];*/
    this.component.butCreateEmployeeTitle       = Resources.employeesButCreateEmployeeTitle[this.component.language];
    this.component.butCreateEmployeeValue       = Resources.employeesButCreateEmployeeValue[this.component.language];
    this.component.butShowScheduleEmployeeTitle = Resources.employeesButShowScheduleEmployeeTitle[this.component.language];
    this.component.butShowScheduleEmployeeValue = Resources.butScheduleValue[this.component.language];
    this.component.butShowServicesEmployeeTitle = Resources.employeesButShowServicesEmployeeTitle[this.component.language];
    this.component.butShowServicesEmployeeValue = Resources.butServicesValue[this.component.language];
    this.component.butEditEmployeeTitle         = Resources.employeesButEditEmployeeTitle[this.component.language];
    this.component.butDeleteEmployeeTitle       = Resources.employeesButDeleteEmployeeTitle[this.component.language];

    console.log(`--EmployeesComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение коллекции сотрудников заданной компании
  async requestGetAllEmployeesByCompanyId(): Promise<void> {
    console.log(`[-EmployeesComponent-requestGetAllEmployeesByCompanyId--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeesComponent-requestGetAllEmployeesByCompanyId-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeesComponent-1-(запрос на получение сотрудников)-`);

    // запрос на получение коллекции сотрудников
    let result: { message: any, employees: Employee[] } =
      { message: Literals.Ok, employees: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(this._webApiService.getById(
        Config.urlGetAllEmployeesByCompanyId, this.company.id, token
      ));
      console.dir(webResult);

      result.employees = Employee.parseEmployees(webResult.employees);

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

    console.log(`--EmployeesComponent-result:`);
    console.dir(result);

    console.log(`--EmployeesComponent-2-(ответ на запрос получен)-`);

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

    } else {

      // получить данные из результата запроса
      this.employees = result.employees;

    } // if

    console.log(`--EmployeesComponent-requestGetAllEmployeesByCompanyId-]`);
  } // requestGetAllEmployeesByCompanyId


  // обработчик события получения данных об Id выбранного сотрудника для
  // демонстрации его расписания, услуг, изменения или удаления данных о сотруднике
  async sendEmployeeIdModeHandler(result: { employeeId: number, mode: string }): Promise<void> {
    console.log(`[-EmployeesComponent-sendEmployeeIdModeHandler--`);

    console.dir(result);
    console.log(`*- result.employeeId: '${result.employeeId}' -*`);
    console.log(`*- result.mode: '${result.mode}' -*`);

    // если режим демонстрации расписания, услуг или изменения данных,
    // то переходим по соответствующему маршруту
    if (result.mode === this.showSchedule ||
        result.mode === this.showServices ||
        result.mode === this.editEmployee) {

      this.routingTo(result.mode, result.employeeId);

    } // if

    // если режим удаления данных - отправляем запрос на удаление выбранных данных
    if (result.mode === this.deleteEmployee) {
      console.log(`*- получили сотрудника для удаления -*`);

      // запрос на удаление данных
      await this.requestDeleteEmployee(result.employeeId);

      // удалить данные коллекций, загруженные ранее
      console.log(`*-(было)-this.employees: -*`);
      console.dir(this.employees);
      this.employees = [];
      console.log(`*-(стало)-this.employees: -*`);
      console.dir(this.employees);

      // запрос на получение коллекции сотрудников заданной компании
      console.log(`*-(было)-this.employees: -*`);
      console.dir(this.employees);
      await this.requestGetAllEmployeesByCompanyId();
      console.log(`*-(стало)-this.employees: -*`);
      console.dir(this.employees);

    } // if

    console.log(`--EmployeesComponent-sendEmployeeIdModeHandler-]`);
  } // sendEmployeeIdModeHandler


  // программный переход на страницу демонстрации расписания сотрудника, услуг
  // или к форме добавления/изменения данных о сотруднике компании
  routingTo(mode: string, employeeId: number) {
    console.log(`[-EmployeesComponent-routingTo--`);

    console.log(`*- mode: '${mode}' -*`);
    console.log(`*- this.company.id: '${this.company.id}' -*`);
    console.log(`*- employeeId: '${employeeId}' -*`);

    // маршрут и параметры
    let routerLink: string = Literals.empty;
    let url: string = Literals.empty;
    let queryParams: any;
    switch (mode) {

      // переход на страницу демонстрации расписания
      case this.showSchedule:
        console.log(`*- просмотр и изменение расписания сотрудника -*`);
        routerLink = Literals.routeSchedule;
        url = `${routerLink}/${employeeId}`;
        queryParams = {};
        break;

      // переход на страницу демонстрации услуг
      case this.showServices:
        console.log(`*- просмотр и изменение услуг сотрудника -*`);
        routerLink = Literals.routeEmployeesServices;
        url = `${routerLink}/${employeeId}`;
        queryParams = {};
        break;

      // переход к форме добавления данных о сотруднике
      case this.createEmployee:
        console.log(`*- добавление нового сотрудника -*`);
        routerLink = Literals.routeEmployeeForm;
        url = `${routerLink}/${mode}`;
        queryParams = {
          companyId: this.company.id,
          employeeId: employeeId
        };
        break;

      // переход к форме изменения данных о сотруднике
      case this.editEmployee:
        console.log(`*- получили сотрудника для изменения -*`);
        routerLink = Literals.routeEmployeeForm;
        url = `${routerLink}/${mode}`;
        queryParams = {
          companyId: this.company.id,
          employeeId: employeeId
        };
        break;

    } // switch
    console.log(`*- routerLink: '${routerLink}' -*`);
    console.log(`*- url: '${url}' -*`);
    console.log(`*- queryParams: -*`);
    console.dir(queryParams);

    // переход по маршруту
    this._router.navigate(
      [url], { queryParams: queryParams }
    ).then((e) => {
      console.log(`*- переход: ${e} -*`);
    });

    console.log(`--EmployeesComponent-routingTo-]`);
  } // routingTo


  // выполнение запроса на удаление данных о сотруднике
  async requestDeleteEmployee(employeeId: number): Promise<void> {
    console.log(`[-EmployeesComponent-requestDeleteEmployee--`);

    console.log(`*- employeeId: '${employeeId}' -*`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeesComponent-requestDeleteEmployee-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeesComponent-1-(запрос на удаление)-`);

    // запрос на удаление данных об услуге
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(
        this._webApiService.deleteById(Config.urlDeleteEmployee, employeeId, token)
      );
      console.dir(webResult);

    } catch (e: any) {

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

    console.log(`--EmployeesComponent-result:`);
    console.dir(result);

    console.log(`--EmployeesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся на странице, отменяем удаление
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.employeeId: '${result.employeeId}'`);
      if (result.employeeId != undefined)
        message = result.employeeId === 0
          ? Resources.incorrectEmployeeIdData[this.component.language]
          : Resources.notRegisteredEmployeeIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.title: '${result.title}'`);
      if (result.title != undefined) message = result.title;

      console.log(`--result.updateMessage: '${result.updateMessage}'`);
      if (result.updateMessage != undefined) message = result.updateMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;

    } else {
      // иначе - сообщение об успехе
      result = Resources.employeesDeleteEmployeeOk[this.component.language];

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

    // переход в начало страницы
    Utils.toStart();

    console.log(`--EmployeesComponent-requestDeleteEmployee-]`);
  } // requestDeleteEmployee


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
    console.log(`[-EmployeesComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--EmployeesComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class EmployeesComponent
// ----------------------------------------------------------------------------
