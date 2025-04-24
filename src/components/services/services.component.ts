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
    butEditServiceTitle:                    Literals.empty,
    butDeleteServiceTitle:                  Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:   Literals.empty,
    route:      Literals.empty,
    isWaitFlag: false,
    isShowFlag: false
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
  protected readonly empty: string         = Literals.empty;
  protected readonly createService: string = Literals.createService;
  protected readonly editService: string   = Literals.editService;
  protected readonly deleteService: string = Literals.deleteService;


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
    Utils.helloComponent(Literals.services);

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
    let companyId: number = 0;
    // подписка на получение результата перехода по маршруту
    this._activatedRoute.params.subscribe(params => {

      // параметр об Id компании, полученный из маршрута
      companyId = params[Literals.id] != undefined
        ? +params[Literals.id]
        : 0;
      this.company.id = companyId;

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


    // запрос на получение коллекции услуг заданной компании
    await this.requestGetAllServicesByCompanyIdGroupByCategories();

  } // ngOnInit


  // запрос на получение записи о компании из БД для отображения
  async requestGetCompanyById(): Promise<void> {

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

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
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


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.displayTitle                           = Resources.servicesTitle[this.component.language];
    this.component.collapseServicesCategoryNameTitleStart = Resources.servicesCollapseServicesCategoryNameTitleStart[this.component.language];
    this.component.butCreateServiceTitle                  = Resources.servicesButCreateServiceTitle[this.component.language];
    this.component.butCreateServiceValue                  = Resources.servicesButCreateServiceValue[this.component.language];
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
    this.component.butEditServiceTitle                    = Resources.servicesButEditServiceTitle[this.component.language];
    this.component.butDeleteServiceTitle                  = Resources.servicesButDeleteServiceTitle[this.component.language];

  } // changeLanguageLiterals


  // запрос на получение коллекции услуг заданной компании
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
        .getById(Config.urlGetAllServicesByCompanyIdGroupByCategories, this.company.id, token)
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
      this.services = DisplayServicesCategory.allServices(this.displayServicesCategories);

    } // if

  } // requestGetAllServicesByCompanyIdGroupByCategories


  // обработчик события получения данных об Id выбранной категории услуг
  // (добавление услуги с заданной категорией услуг)
  sendServicesCategoryIdHandler(servicesCategoryId: number): void {

    // вызов метода добавления услуги
    this.routingToServiceForm(this.createService, servicesCategoryId, this.zero);

  } // sendServicesCategoryIdHandler


  // обработчик события получения данных об Id выбранной услуги для изменения/удаления
  // (программный переход к форме изменения данных об услуге или запрос на удаление данных)
  async sendServiceIdModeHandler(result: { servicesCategoryId: number, serviceId: number, mode: string }): Promise<void> {

    // если режим изменения услуги - переходим на форму изменения услуги
    if (result.mode === this.editService)
      this.routingToServiceForm(result.mode, result.servicesCategoryId, result.serviceId);

    // если режим удаления услуги - отправляем запрос на удаление выбранной услуги
    if (result.mode === this.deleteService) {

      // запрос на удаление услуги
      await this.requestDeleteService(result.serviceId);

      // удалить данные коллекций, загруженные ранее
      this.services = [];
      this.displayServicesCategories = [];

      // запрос на получение коллекции услуг заданной компании
      await this.requestGetAllServicesByCompanyIdGroupByCategories();

    } // if

  } // sendServiceIdModeHandler


  // программный переход к форме добавления/изменения данных об услуге
  routingToServiceForm(mode: string, servicesCategoryId: number, serviceId: number) {

    // маршрут
    let routerLink: string = Literals.routeServiceForm;

    // переход по маршруту
    this._router.navigate(
      [`${routerLink}/${mode}`],
      {
        queryParams: {
          companyId: this.company.id,
          servicesCategoryId: servicesCategoryId,
          serviceId: serviceId
        }
      }
    ).then((e) => { console.log(`*- переход: ${e} -*`);  });

  } // routingToServiceForm


  // выполнение запроса на удаление данных об услуге
  async requestDeleteService(serviceId: number): Promise<void> {

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

    // запрос на удаление данных об услуге
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.deleteById(Config.urlDeleteService, serviceId, token)
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
      if (result.serviceId != undefined)
        message = result.serviceId === 0
          ? Resources.incorrectServiceIdData[this.component.language]
          : Resources.notRegisteredServiceIdData[this.component.language];

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
      result = Resources.servicesDeleteServiceOk[this.component.language];

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

    // переход в начало страницы
    Utils.toStart();

  } // requestDeleteService


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

} // class ServicesComponent
// ----------------------------------------------------------------------------
