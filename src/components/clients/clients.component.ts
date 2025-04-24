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

  // свойство для ограничения отображения элементов разметки
  protected readonly zero: number = Literals.zero;
  protected readonly one: number  = Literals.one;


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
      companyId = (params[Literals.id] != undefined && !isNaN(params[Literals.id]) && params[Literals.id] > 0)
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


    // запрос на получение части коллекции клиентов заданной компании для первой страницы
    await this.requestGetAllClientsByCompanyIdByPage(Literals.one);

    // установить соответствующий заголовок
    this.component.title = this.clients.length === this.zero
      ? Resources.clientsZeroCollectionTitle[this.component.language]
      : Resources.clientsTitle[this.component.language];

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

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

  } // changeLanguageLiterals


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


  // запрос на получение части коллекции клиентов заданной компании для заданной страницы
  async requestGetAllClientsByCompanyIdByPage(page: number): Promise<void> {

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

    // запрос на получение части коллекции клиентов для заданной страницы
    let result: { message: any, clients: Client[], pageViewModel: PageViewModel } =
      { message: Literals.Ok, clients: [], pageViewModel: new PageViewModel() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService.getAllByIdByPage(
        Config.urlGetAllClientsByCompanyId, this.company.id, page, token
      ));

      result.clients = Client.parseClients(webResult.clients);
      result.pageViewModel = PageViewModel.newPageViewModel(webResult.pageViewModel);
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
      if (result.message.page <= Literals.zero) message =
        Resources.incorrectPageData[this.component.language];

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
      this.clients       = result.clients;
      this.pageViewModel = result.pageViewModel;

    } // if

  } // requestGetAllClientsByCompanyIdByPage


  // обработчик события получения данных о номере выбранной страницы
  async sendPageHandler(page: number): Promise<void> {

    // переход в начало страницы
    Utils.toStart();

    // удалить элементы части коллекции клиентов, загруженные ранее
    this.clients = [];

    // запрос на получение части коллекции клиентов для выбранной страницы
    await this.requestGetAllClientsByCompanyIdByPage(page);

  } // sendPageHandler


  // обработчик события получения данных о сортировках (из заголовка таблицы)
  sendSortParamsHandler(param: { sortMode: string, sortProp: string }): void {

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

  } // sendClientIdHandler


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

} // class ClientsComponent
// ----------------------------------------------------------------------------
