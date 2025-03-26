// ----------------------------------------------------------------------------
// компонент отображения услуг заданной компании
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {IServicesComponent} from '../../models/interfaces/IServicesComponent';
import {Literals} from '../../infrastructure/Literals';
import {firstValueFrom, Subscription} from 'rxjs';
import {Service} from '../../models/classes/Service';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {WebApiService} from '../../services/web-api.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Utils} from '../../infrastructure/Utils';
import {DisplayServicesCategory} from '../../models/classes/DisplayServicesCategory';
import {Resources} from '../../infrastructure/Resources';
import {Config} from '../../infrastructure/Config';
import {DisplayServicesCategoryComponent} from '../display-services-category/display-services-category.component';
import {Company} from '../../models/classes/Company';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [DisplayServicesCategoryComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IServicesComponent = {
    // параметры меняющиеся при смене языка
    displayTitle:                           Literals.empty,
    collapseServicesCategoryNameTitleStart: Literals.empty,
    butCreateServiceTitle:                  Literals.empty,
    butCreateServiceValue:                  Literals.empty,
    labelIsSelectedServiceTitleStart:       Literals.empty,
    labelPriceTitle:                        Literals.empty,
    labelPriceValue:                        Literals.empty,
    labelMinPriceTitle:                     Literals.empty,
    labelMinPriceValue:                     Literals.empty,
    labelMaxPriceTitle:                     Literals.empty,
    labelMaxPriceValue:                     Literals.empty,
    labelDurationTitle:                     Literals.empty,
    labelDurationValue:                     Literals.empty,
    butEditServiceTitle:                    Literals.empty,
    /*butEditServiceValue:   Literals.empty,*/
    butDeleteServiceTitle: Literals.empty,
    /*butDeleteServiceValue: Literals.empty,*/
    // параметры НЕ меняющиеся при смене языка
    language:   Literals.empty,
    route:      Literals.empty,
    isWaitFlag: false
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о выбранной компании
  public company: Company = new Company();

  // коллекция услуг заданной компании
  public services: Service[] = [];

  // коллекция категорий услуг заданной компании с соответствующими услугами
  public displayServicesCategories: DisplayServicesCategory[] = [];

  // дополнительные свойства
  protected readonly zero: number          = Literals.zero;
  protected readonly one: number           = Literals.one;
  protected readonly createService: string = Literals.createService;
  protected readonly editService: string   = Literals.editService;
  protected readonly deleteService: string = Literals.deleteService;


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
              private _userService: UserService,
              private _tokenService: TokenService,
              private _authGuardService: AuthGuardService) {
    Utils.helloComponent(Literals.services);

    console.log(`[-ServicesComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`*-this.company: -*`);
    console.dir(this.company);

    console.log(`*-this.services: -*`);
    console.dir(this.services);

    console.log(`*-this.displayServicesCategories: -*`);
    console.dir(this.displayServicesCategories);

    console.log(`--ServicesComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-ServicesComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-ServicesComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--ServicesComponent-subscribe-]`);
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
      companyId = params[Literals.id] != undefined
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

        console.log(`--ServicesComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "Home" - 'FALSE' -*`);

    console.log(`*-(стало)-this.company: -*`);
    console.dir(this.company);


    // запрос на получение коллекции услуг заданной компании
    console.log(`*-(было)-this.services: -*`);
    console.dir(this.services);
    console.log(`*-(было)-this.displayServicesCategories: -*`);
    console.dir(this.displayServicesCategories);
    await this.requestGetAllServicesByCompanyIdGroupByCategories();
    console.log(`*-(стало)-this.services: -*`);
    console.dir(this.services);
    console.log(`*-(стало)-this.displayServicesCategories: -*`);
    console.dir(this.displayServicesCategories);

    console.log(`--ServicesComponent-ngOnInit-]`);
  } // ngOnInit


  // запрос на получение записи о компании из БД для отображения
  async requestGetCompanyById(): Promise<void> {
    console.log(`[-ServicesComponent-requestGetCompanyById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ServicesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ServicesComponent-requestGetCompanyById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ServicesComponent-1-(запрос на получение компании)-`);

    // запрос на получение записи о компании
    let result: { message: any, company: Company } =
      { message: Literals.Ok, company: new Company() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

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

    console.log(`--ServicesComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.company);

    console.log(`--ServicesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
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

    console.log(`--ServicesComponent-requestGetCompanyById-]`);
  } // requestGetCompanyById


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-ServicesComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.displayTitle                           = Resources.servicesTitle[this.component.language];
    this.component.collapseServicesCategoryNameTitleStart = Resources.servicesCollapseServicesCategoryNameTitleStart[this.component.language];
    this.component.butCreateServiceTitle                  = Resources.servicesButCreateServiceTitle[this.component.language];
    this.component.butCreateServiceValue                  = Resources.servicesButCreateServiceValue[this.component.language];
    this.component.labelIsSelectedServiceTitleStart       = Resources.servicesLabelIsSelectedServiceTitleStart[this.component.language];
    this.component.labelPriceTitle                        = Resources.labelPriceTitle[this.component.language];
    this.component.labelPriceValue                        = Resources.labelPriceValue[this.component.language];
    this.component.labelMinPriceTitle                     = Resources.labelMinPriceTitle[this.component.language];
    this.component.labelMinPriceValue                     = Resources.labelMinPriceValue[this.component.language];
    this.component.labelMaxPriceTitle                     = Resources.labelMaxPriceTitle[this.component.language];
    this.component.labelMaxPriceValue                     = Resources.labelMaxPriceValue[this.component.language];
    this.component.labelDurationTitle                     = Resources.labelDurationTitle[this.component.language];
    this.component.labelDurationValue                     = Resources.labelDurationValue[this.component.language];
    this.component.butEditServiceTitle                    = Resources.servicesButEditServiceTitle[this.component.language];
    //this.component.butEditServiceValue   = Resources.butEditValue[this.component.language];
    this.component.butDeleteServiceTitle                  = Resources.servicesButDeleteServiceTitle[this.component.language];
    //this.component.butDeleteServiceValue = Resources.butDeleteValue[this.component.language];
    /*this.component.companiesTitle              = Resources.businessCompaniesTitle[this.component.language];
    this.component.labelSchedule               = Resources.labelSchedule[this.component.language];
    this.component.labelPhone                  = Resources.displayLabelPhone[this.component.language];
    this.component.butEditCompanyTitle         = Resources.businessButEditCompanyTitle[this.component.language];
    this.component.butEditCompanyValue         = Resources.butEditValue[this.component.language];
    this.component.butToFirstPageTitle         = Resources.butToFirstPageTitle[this.component.language];
    this.component.butPreviousTitle            = Resources.butPreviousTitle[this.component.language];
    this.component.butPreviousValue            = Resources.butPreviousValue[this.component.language];
    this.component.butCurrentPageTitle         = Resources.butCurrentPageTitle[this.component.language];
    this.component.butNextTitle                = Resources.butNextTitle[this.component.language];
    this.component.butNextValue                = Resources.butNextValue[this.component.language];
    this.component.butToLastPageTitle          = Resources.butToLastPageTitle[this.component.language];
    this.component.butSalonManagementTitle     = Resources.businessButSalonManagementTitle[this.component.language];
    this.component.butSalonManagementValue     = Resources.businessButSalonManagementValue[this.component.language];
    this.component.butEmployeesManagementTitle = Resources.businessButEmployeesManagementTitle[this.component.language];
    this.component.butEmployeesManagementValue = Resources.businessButEmployeesManagementValue[this.component.language];
    this.component.butWarehouseManagementTitle = Resources.businessButWarehouseManagementTitle[this.component.language];
    this.component.butWarehouseManagementValue = Resources.businessButWarehouseManagementValue[this.component.language];
    this.component.butReportsTitle             = Resources.businessButReportsTitle[this.component.language];
    this.component.butReportsValue             = Resources.businessButReportsValue[this.component.language];*/

    console.log(`--ServicesComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение коллекции услуг заданной компании
  async requestGetAllServicesByCompanyIdGroupByCategories(): Promise<void> {
    console.log(`[-ServicesComponent-requestGetAllServicesByCompanyIdGroupByCategories--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ServicesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ServicesComponent-requestGetAllServicesByCompanyIdGroupByCategories-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ServicesComponent-1-(запрос на получение услуг)-`);

    // запрос на получение коллекции компаний
    let result: { message: any, displayServicesCategories: DisplayServicesCategory[] } =
      { message: Literals.Ok, displayServicesCategories: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(this._webApiService
        .getById(Config.urlGetAllServicesByCompanyIdGroupByCategories, this.company.id, token)
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

    console.log(`--ServicesComponent-result:`);
    console.dir(result);

    console.log(`--ServicesComponent-2-(ответ на запрос получен)-`);

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
      this.displayServicesCategories = result.displayServicesCategories;
      this.services = DisplayServicesCategory.allServices(this.displayServicesCategories);

    } // if

    console.log(`--ServicesComponent-requestGetAllServicesByCompanyIdGroupByCategories-]`);
  } // requestGetAllServicesByCompanyIdGroupByCategories


  // обработчик события получения данных об Id выбранной категории услуг
  // (добавление услуги с заданной категорией услуг)
  sendServicesCategoryIdHandler(servicesCategoryId: number): void {
    console.log(`[-ServicesComponent-sendServicesCategoryIdHandler--`);
    console.log(`*- получили категорию для создания услуги -*`);

    console.log(`*- servicesCategoryId: '${servicesCategoryId}' -*`);

    // вызов метода добавления услуги
    this.routingToServiceForm(this.createService, servicesCategoryId, this.zero);

    console.log(`--ServicesComponent-sendServicesCategoryIdHandler-]`);
  } // sendServicesCategoryIdHandler


  // обработчик события получения данных об Id выбранной услуги для изменения
  // (программный переход к форме изменения/удаления данных об услуге)
  async sendServiceIdModeHandler(result: { servicesCategoryId: number, serviceId: number, mode: string }): Promise<void> {
    console.log(`[-ServicesComponent-sendServiceIdModeHandler--`);


    console.dir(result);
    console.log(`*- result.servicesCategoryId: '${result.servicesCategoryId}' -*`);
    console.log(`*- result.serviceId: '${result.serviceId}' -*`);
    console.log(`*- result.mode: '${result.mode}' -*`);

    // если режим изменения услуги - переходим на форму изменения услуги
    if (result.mode === this.editService) {
      console.log(`*- получили услугу для изменения -*`);

      this.routingToServiceForm(result.mode, result.servicesCategoryId, result.serviceId);

    } // if

    // если режим удаления услуги - отправляем запрос на удаление выбранной услуги
    if (result.mode === this.deleteService) {
      console.log(`*- получили услугу для удаления -*`);

      // запрос на удаление услуги
      await this.requestDeleteService(result.serviceId);

      // удалить данные коллекций, загруженные ранее
      console.log(`*-(было)-this.services: -*`);
      console.dir(this.services);
      console.log(`*-(было)-this.displayServicesCategories: -*`);
      console.dir(this.displayServicesCategories);
      this.services = [];
      this.displayServicesCategories = [];
      console.log(`*-(стало)-this.services: -*`);
      console.dir(this.services);
      console.log(`*-(стало)-this.displayServicesCategories: -*`);
      console.dir(this.displayServicesCategories);

      // запрос на получение коллекции услуг заданной компании
      console.log(`*-(было)-this.services: -*`);
      console.dir(this.services);
      console.log(`*-(было)-this.displayServicesCategories: -*`);
      console.dir(this.displayServicesCategories);
      await this.requestGetAllServicesByCompanyIdGroupByCategories();
      console.log(`*-(стало)-this.services: -*`);
      console.dir(this.services);
      console.log(`*-(стало)-this.displayServicesCategories: -*`);
      console.dir(this.displayServicesCategories);

    } // if

    console.log(`--ServicesComponent-sendServiceIdModeHandler-]`);
  } // sendServiceIdModeHandler


  // программный переход к форме создания данных об услуге
  /*createService(servicesCategoryId: number) {
    console.log(`[-ServicesComponent-createService--`);

    console.log(`*- servicesCategoryId: '${servicesCategoryId}' -*`);

    // маршрут
    //let routerLink: string = Literals.routeServiceForm;

    // параметр
    let mode: string = Literals.createService;
    //let companyId: number = 45;

    // переход по маршруту
    //this._router.navigateByUrl(`${routerLink}/${mode}/${companyId}`)
    /!*this._router.navigateByUrl(`${routerLink}/${mode}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });*!/

    console.log(`--ServicesComponent-createService-]`);
  } // createService*/


  // программный переход к форме добавления/изменения данных об услуге
  routingToServiceForm(mode: string, servicesCategoryId: number, serviceId: number) {
    console.log(`[-ServicesComponent-routingToServiceForm--`);

    console.log(`*- mode: '${mode}' -*`);
    console.log(`*- this.company.id: '${this.company.id}' -*`);
    console.log(`*- servicesCategoryId: '${servicesCategoryId}' -*`);
    console.log(`*- serviceId: '${serviceId}' -*`);

    // маршрут
    let routerLink: string = Literals.routeServiceForm;

    // параметр
    //let mode: string = Literals.createService;
    //let companyId: number = 45;

    // переход по маршруту
    /*this._router.navigateByUrl(
      `${routerLink}/${mode}/${this.company.id}/${servicesCategoryId}/${serviceId}`
    ).then((e) => { console.log(`*- переход: ${e} -*`); });*/
    this._router.navigate(
      [`${routerLink}/${mode}`],
      {
        queryParams: {
          companyId: this.company.id,
          servicesCategoryId: servicesCategoryId,
          serviceId: serviceId
        }
      }
    ).then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--ServicesComponent-routingToServiceForm-]`);
  } // routingToServiceForm


  // обработчик события получения данных об Id выбранной услуги
  sendSelectedServiceIdHandler(result: { serviceId: number, isSelected: boolean }): void {
    console.log(`[-ServicesComponent-sendSelectedServiceIdHandler--`);

    console.log(`*- result: -*`);
    console.dir(result);

    console.log(`*- result.serviceId: '${result.serviceId}' [${typeof result.serviceId}] -*`);
    console.log(`*- result.isSelected: '${result.isSelected}' [${typeof result.isSelected}] -*`);

    // добавление в массив выбранных услуг
    if (result.isSelected) {
      console.log(`*- добавление в массив выбранных услуг -*`);
    } else {
    // удаление из массива выбранных услуг
      console.log(`*- удаление из массива выбранных услуг -*`);
    } // if

    console.log(`--ServicesComponent-sendSelectedServiceIdHandler-]`);
  } // sendSelectedServiceIdHandler


  // выполнение запроса на удаление данных об услуге
  async requestDeleteService(serviceId: number): Promise<void> {
    console.log(`[-ServicesComponent-requestDeleteService--`);

    console.log(`*- serviceId: '${serviceId}' -*`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ServicesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ServicesComponent-requestDeleteService-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ServicesComponent-1-(запрос на удаление)-`);

    // запрос на удаление данных об услуге
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(
        this._webApiService.deleteById(Config.urlDeleteService, serviceId, token)
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

    console.log(`--ServicesComponent-result:`);
    console.dir(result);

    console.log(`--ServicesComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся на странице, отменяем удаление
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.serviceId: '${result.serviceId}'`);
      if (result.serviceId != undefined)
        message = result.serviceId === 0
          ? Resources.incorrectServiceIdData[this.component.language]
          : Resources.notRegisteredServiceIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.title: '${result.title}'`);
      if (result.title != undefined) message = result.title;

      console.log(`--result.updateMessage: '${result.updateMessage}'`);
      if (result.updateMessage != undefined) message = result.updateMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;

      // отменить удаление
      /*console.log(`-(было)-this.component.isDeletingFlag: '${this.component.isDeletingFlag}'`);
      console.log(`-(было)-this.component.isConfirmedFlag: '${this.component.isConfirmedFlag}'`);
      this.component.isDeletingFlag = this.component.isConfirmedFlag = false;
      console.log(`-(стало)-this.component.isDeletingFlag: '${this.component.isDeletingFlag}'`);
      console.log(`-(стало)-this.component.isConfirmedFlag: '${this.component.isConfirmedFlag}'`);*/

    } else {
      // иначе - сообщение об успехе
      result = Resources.servicesDeleteServiceOk[this.component.language];

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

    // переход в начало страницы
    Utils.toStart();

    console.log(`--ServicesComponent-requestDeleteService-]`);
  } // requestDeleteService


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
    console.log(`[-ServicesComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--ServicesComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class ServicesComponent
// ----------------------------------------------------------------------------
