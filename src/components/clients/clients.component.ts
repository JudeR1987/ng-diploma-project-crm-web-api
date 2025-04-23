// ----------------------------------------------------------------------------
// компонент отображения клиентов заданной компании в табличном формате
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {IClientsComponent} from '../../models/interfaces/IClientsComponent';
import {Literals} from '../../infrastructure/Literals';
import {firstValueFrom, Subscription} from 'rxjs';
import {Company} from '../../models/classes/Company';
import {Client} from '../../models/classes/Client';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {WebApiService} from '../../services/web-api.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Utils} from '../../infrastructure/Utils';
import {Resources} from '../../infrastructure/Resources';
import {Config} from '../../infrastructure/Config';
import {PageViewModel} from '../../infrastructure/PageViewModel';
import {PaginationComponent} from '../pagination/pagination.component';
import {TableHeaderClientsComponent} from './table-header-clients/table-header-clients.component';
import {TrClientComponent} from './tr-client/tr-client.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [TableHeaderClientsComponent, TrClientComponent, PaginationComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IClientsComponent = {
    // параметры меняющиеся при смене языка
    title:               Literals.empty,
    butToFirstPageTitle: Literals.empty,
    butPreviousTitle:    Literals.empty,
    butPreviousValue:    Literals.empty,
    butCurrentPageTitle: Literals.empty,
    butNextTitle:        Literals.empty,
    butNextValue:        Literals.empty,
    butToLastPageTitle:  Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:   Literals.empty,
    route:      Literals.empty,
    isWaitFlag: false
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о выбранной компании
  public company: Company = new Company();

  // коллекция клиентов заданной компании
  public clients: Client[] = [];

  // информация о пагинации страницы
  public pageViewModel: PageViewModel = new PageViewModel();

  // режим сортировки
  public sortMode: string = Literals.empty;

  // свойство для ограничения отображения элементов разметки
  protected readonly zero: number = Literals.zero;
  protected readonly one: number  = Literals.one;
  protected readonly asc: string  = Literals.asc;
  protected readonly desc: string = Literals.desc;


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
    Utils.helloComponent(Literals.clients);

    console.log(`[-ClientsComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`*-this.clients: -*`);
    console.dir(this.clients);

    console.log(`--ClientsComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-ClientsComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-ClientsComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--ClientsComponent-subscribe-]`);
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

        console.log(`--ClientsComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "Home" - 'FALSE' -*`);

    console.log(`*-(стало)-this.company: -*`);
    console.dir(this.company);


    // запрос на получение части коллекции клиентов заданной компании для первой страницы
    console.log(`*-(было)-this.clients: -*`);
    console.dir(this.clients);
    console.log(`*-(было)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);
    await this.requestGetAllClientsByCompanyIdByPage(Literals.one);
    console.log(`*-(стало)-this.clients: -*`);
    console.dir(this.clients);
    console.log(`*-(стало)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);

    // установить соответствующий заголовок
    this.component.title = this.clients.length === this.zero
      ? Resources.clientsZeroCollectionTitle[this.component.language]
      : Resources.clientsTitle[this.component.language];

    console.log(`--ClientsComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-ClientsComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title = this.clients.length === this.zero
      ? Resources.clientsZeroCollectionTitle[this.component.language]
      : Resources.clientsTitle[this.component.language];
    this.component.butToFirstPageTitle         = Resources.butToFirstPageTitle[this.component.language];
    this.component.butPreviousTitle            = Resources.butPreviousTitle[this.component.language];
    this.component.butPreviousValue            = Resources.butPreviousValue[this.component.language];
    this.component.butCurrentPageTitle         = Resources.butCurrentPageTitle[this.component.language];
    this.component.butNextTitle                = Resources.butNextTitle[this.component.language];
    this.component.butNextValue                = Resources.butNextValue[this.component.language];
    this.component.butToLastPageTitle          = Resources.butToLastPageTitle[this.component.language];
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

    console.log(`--ClientsComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение записи о компании из БД для отображения
  async requestGetCompanyById(): Promise<void> {
    console.log(`[-ClientsComponent-requestGetCompanyById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ClientsComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ClientsComponent-requestGetCompanyById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ClientsComponent-1-(запрос на получение компании)-`);

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

    console.log(`--ClientsComponent-result:`);
    console.dir(result);

    console.log(`--ClientsComponent-2-(ответ на запрос получен)-`);

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

    console.log(`--ClientsComponent-requestGetCompanyById-]`);
  } // requestGetCompanyById


  // запрос на получение части коллекции клиентов заданной компании для заданной страницы
  async requestGetAllClientsByCompanyIdByPage(page: number): Promise<void> {
    console.log(`[-ClientsComponent-requestGetAllClientsByCompanyIdByPage--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ClientsComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ClientsComponent-requestGetAllClientsByCompanyIdByPage-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ClientsComponent-1-(запрос на получение клиентов)-`);

    // запрос на получение части коллекции клиентов для заданной страницы
    let result: { message: any, clients: Client[], pageViewModel: PageViewModel } =
      { message: Literals.Ok, clients: [], pageViewModel: new PageViewModel() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService.getAllByIdByPage(
        Config.urlGetAllClientsByCompanyId, this.company.id, page, token
      ));
      console.dir(webResult);

      result.clients = Client.parseClients(webResult.clients);
      result.pageViewModel = PageViewModel.newPageViewModel(webResult.pageViewModel);
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

    console.log(`--ClientsComponent-result:`);
    console.dir(result);

    console.log(`--ClientsComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - вывод сообщения на экран
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.page: '${result.message.page}'`);
      if (result.message.page <= Literals.zero) message =
        Resources.incorrectPageData[this.component.language];

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
      this.clients       = result.clients;
      this.pageViewModel = result.pageViewModel;

    } // if

    console.log(`--ClientsComponent-requestGetAllEmployeesByCompanyId-]`);
  } // requestGetAllClientsByCompanyIdByPage


  // обработчик события получения данных о номере выбранной страницы
  async sendPageHandler(page: number): Promise<void> {
    console.log(`[-ClientsComponent-sendPageHandler--`);

    console.log(`*- page: '${page}' -*`);

    // переход в начало страницы
    Utils.toStart();

    // удалить элементы части коллекции клиентов, загруженные ранее
    console.log(`*-(было)-this.clients: -*`);
    console.dir(this.clients);
    this.clients = [];
    console.log(`*-(стало)-this.clients: -*`);
    console.dir(this.clients);

    // запрос на получение части коллекции клиентов для выбранной страницы
    console.log(`*-(было)-this.clients: -*`);
    console.dir(this.clients);
    console.log(`*-(было)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);
    await this.requestGetAllClientsByCompanyIdByPage(page);
    console.log(`*-(стало)-this.clients: -*`);
    console.dir(this.clients);
    console.log(`*-(стало)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);

    console.log(`--ClientsComponent-sendPageHandler-]`);
  } // sendPageHandler


  // обработчик события получения данных о сортировках (из заголовка таблицы)
  sendSortParamsHandler(param: { sortMode: string, sortProp: string }): void {
    console.log(`[-ClientsComponent-sendSortParamsHandler--`);

    console.log(`*- param.sortMode: '${param.sortMode}' -*`);
    console.log(`*- param.sortProp: '${param.sortProp}' -*`);

    // выбираем обработку для сортировки в зависимости от выбранного поля
    if (param.sortMode != Literals.empty) {
      switch (param.sortProp) {

        case Literals.surname:
          this.clients = param.sortMode === Literals.asc
            ? this.clients.sort((client1: Client, client2: Client) =>
              (client1.surname ?? client1.name).localeCompare(client2.surname ?? client2.name))
            : this.clients.sort((client1: Client, client2: Client) =>
              (client2.surname ?? client2.name).localeCompare(client1.surname ?? client1.name));
          break;

        case Literals.phone:
          this.clients = param.sortMode === Literals.asc
            ? this.clients.sort((client1: Client, client2: Client) =>
              client1.phone.localeCompare(client2.phone))
            : this.clients.sort((client1: Client, client2: Client) =>
              client2.phone.localeCompare(client1.phone));
          break;

        case Literals.email:
          this.clients = param.sortMode === Literals.asc
            ? this.clients.sort((client1: Client, client2: Client) =>
              client1.email.localeCompare(client2.email))
            : this.clients.sort((client1: Client, client2: Client) =>
              client2.email.localeCompare(client1.email));
          break;

        case Literals.birthDate:
          this.clients = param.sortMode === Literals.asc
            ? this.clients.sort((client1: Client, client2: Client) =>
              client1.birthDate.localeCompare(client2.birthDate))
            : this.clients.sort((client1: Client, client2: Client) =>
              client2.birthDate.localeCompare(client1.birthDate));
          break;

        case Literals.gender:
          this.clients = param.sortMode === Literals.asc
            ? this.clients.sort((client1: Client, client2: Client) =>
              client1.gender - client2.gender)
            : this.clients.sort((client1: Client, client2: Client) =>
              client2.gender - client1.gender);
          break;

        case Literals.discount:
          this.clients = param.sortMode === Literals.asc
            ? this.clients.sort((client1: Client, client2: Client) =>
              client1.discount - client2.discount)
            : this.clients.sort((client1: Client, client2: Client) =>
              client2.discount - client1.discount);
          break;

        case Literals.card:
          this.clients = param.sortMode === Literals.asc
            ? this.clients.sort((client1: Client, client2: Client) =>
              (client1.card ?? Literals.empty).localeCompare(client2.card ?? Literals.empty))
            : this.clients.sort((client1: Client, client2: Client) =>
              (client2.card ?? Literals.empty).localeCompare(client1.card ?? Literals.empty));
          break;

        case Literals.balance:
          this.clients = param.sortMode === Literals.asc
            ? this.clients.sort((client1: Client, client2: Client) =>
              client1.balance - client2.balance)
            : this.clients.sort((client1: Client, client2: Client) =>
              client2.balance - client1.balance);
          break;

      } // switch
    }
    else {
      this.clients = this.clients.sort((client1: Client, client2: Client) =>
        (client1.surname ?? client1.name).localeCompare(client2.surname ?? client2.name))
    } // if

    console.log(`--ClientsComponent-sendSortParamsHandler-]`);
  } // sendClientIdHandler


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
    console.log(`[-ClientsComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--ClientsComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class ClientsComponent
// ----------------------------------------------------------------------------
