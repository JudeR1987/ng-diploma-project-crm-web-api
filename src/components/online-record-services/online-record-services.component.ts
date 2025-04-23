// ----------------------------------------------------------------------------
// компонент отображения услуг заданной компании для онлайн-записи
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {DisplayServicesCategoryComponent} from '../display-services-category/display-services-category.component';
import {IComponent} from '../../models/interfaces/IComponent';
import {Literals} from '../../infrastructure/Literals';
import {firstValueFrom, Subscription} from 'rxjs';
import {Company} from '../../models/classes/Company';
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

@Component({
  selector: 'app-online-record-services',
  standalone: true,
  imports: [DisplayServicesCategoryComponent],
  templateUrl: './online-record-services.component.html',
  styleUrl: './online-record-services.component.css'
})
export class OnlineRecordServicesComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IComponent = {
    // параметры меняющиеся при смене языка
    title: Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:   Literals.empty,
    route:      Literals.empty,
    isWaitFlag: false
  };

  // флаг переключения картинки при открытии/закрытии скрываемого элемента
  // в дочернем компоненте отображения категории услуг с услугами
  public isShowFlag: boolean = false;

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о выбранной компании
  public company: Company = new Company();

  // коллекция услуг заданной компании
  public services: Service[] = [];

  // идентификаторы выбранных услуг
  public selectedServicesIds: number[] = [];

  // коллекция категорий услуг заданной компании с соответствующими услугами
  public displayServicesCategories: DisplayServicesCategory[] = [];

  // дополнительные свойства
  protected readonly zero: number          = Literals.zero;
  protected readonly one: number           = Literals.one;
  protected readonly empty: string         = Literals.empty;


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
    Utils.helloComponent(Literals.onlineRecordServices);

    console.log(`[-OnlineRecordServicesComponent-constructor--`);
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

    console.log(`--OnlineRecordServicesComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-OnlineRecordServicesComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-OnlineRecordServicesComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--OnlineRecordServicesComponent-subscribe-]`);
      }); // subscribe


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

        console.log(`--OnlineRecordServicesComponent-ngOnInit-]`);
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

    console.log(`--OnlineRecordServicesComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-OnlineRecordServicesComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title = Resources.onlineRecordServicesTitle[this.component.language];

    console.log(`--OnlineRecordServicesComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение записи о компании из БД для отображения
  async requestGetCompanyById(): Promise<void> {
    console.log(`[-OnlineRecordServicesComponent-requestGetCompanyById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--OnlineRecordServicesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    /*if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--OnlineRecordServicesComponent-requestGetCompanyById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if*/

    console.log(`--OnlineRecordServicesComponent-1-(запрос на получение компании)-`);

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

    console.log(`--OnlineRecordServicesComponent-result:`);
    console.dir(result);

    console.log(`--OnlineRecordServicesComponent-2-(ответ на запрос получен)-`);

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

    console.log(`--OnlineRecordServicesComponent-requestGetCompanyById-]`);
  } // requestGetCompanyById


  // запрос на получение коллекции услуг заданной компании
  async requestGetAllServicesByCompanyIdGroupByCategories(): Promise<void> {
    console.log(`[-OnlineRecordServicesComponent-requestGetAllServicesByCompanyIdGroupByCategories--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--OnlineRecordServicesComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    /*if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--OnlineRecordServicesComponent-requestGetAllServicesByCompanyIdGroupByCategories-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if*/

    console.log(`--OnlineRecordServicesComponent-1-(запрос на получение услуг)-`);

    // запрос на получение коллекции категорий услуг с соответствующими услугами
    let result: { message: any, displayServicesCategories: DisplayServicesCategory[] } =
      { message: Literals.Ok, displayServicesCategories: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService
        .getById(Config.urlGetAllServicesByCompanyIdGroupByCategories, this.company.id, token)
      );
      console.dir(webResult);

      result.displayServicesCategories = DisplayServicesCategory
        .parseDisplayServicesCategories(webResult.displayServicesCategories);
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

    console.log(`--OnlineRecordServicesComponent-result:`);
    console.dir(result);

    console.log(`--OnlineRecordServicesComponent-2-(ответ на запрос получен)-`);

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
      this.services = DisplayServicesCategory.allServices(this.displayServicesCategories);

    } // if

    console.log(`--OnlineRecordServicesComponent-requestGetAllServicesByCompanyIdGroupByCategories-]`);
  } // requestGetAllServicesByCompanyIdGroupByCategories


  // программный переход на страницу выбора сотрудника
  routingToOnlineRecordEmployees() {
    console.log(`[-OnlineRecordServicesComponent-routingToOnlineRecordEmployees--`);

    console.log(`*- this.company.id: '${this.company.id}' -*`);
    console.log(`*- this.selectedServicesIds: -*`);
    console.dir(this.selectedServicesIds);

    // маршрут
    let routerLink: string = Literals.routeOnlineRecordEmployees;

    // переход по маршруту
    this._router.navigate(
      [`${routerLink}/${this.company.id}`],
      {
        queryParams: {
          servicesIds: this.selectedServicesIds
        }
      }
    ).then((e) => {
      console.log(`*- переход: ${e} -*`);
    });

    console.log(`--OnlineRecordServicesComponent-routingToOnlineRecordEmployees-]`);
  } // routingToOnlineRecordEmployees


  // обработчик события получения данных об Id выбранной услуги
  async sendSelectedServiceIdHandler(result: { serviceId: number, isSelected: boolean }): Promise<void> {
    console.log(`[-OnlineRecordServicesComponent-sendSelectedServiceIdHandler--`);

    console.log(`*- result: -*`);
    console.dir(result);

    console.log(`*- result.serviceId: '${result.serviceId}' [${typeof result.serviceId}] -*`);
    console.log(`*- result.isSelected: '${result.isSelected}' [${typeof result.isSelected}] -*`);

    // добавить/удалить идентификатор выбранной услуги
    if (result.isSelected) {
      console.log(`*- push -*`);
      this.selectedServicesIds.push(result.serviceId);
    } else {
      console.log(`*- splice -*`);
      let index: number = this.selectedServicesIds.findIndex(id => id === result.serviceId);
      console.log(`*- index: '${index}' -*`);
      this.selectedServicesIds.splice(index, 1);
    } // if

    console.log(`*- this.selectedServicesIds: -*`);
    console.dir(this.selectedServicesIds);

    console.log(`--OnlineRecordServicesComponent-sendSelectedServiceIdHandler-]`);
  } // sendSelectedServiceIdHandler


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
    console.log(`[-OnlineRecordServicesComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--OnlineRecordServicesComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class OnlineRecordServicesComponent
// ----------------------------------------------------------------------------
