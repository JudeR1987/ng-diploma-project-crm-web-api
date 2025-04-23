// ----------------------------------------------------------------------------
// компонент отображения записей заданной компании в табличном формате
// ----------------------------------------------------------------------------
import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationComponent} from '../pagination/pagination.component';
import {Literals} from '../../infrastructure/Literals';
import {IRecordsComponent} from '../../models/interfaces/IRecordsComponent';
import {firstValueFrom, Subscription} from 'rxjs';
import {Company} from '../../models/classes/Company';
import {Record} from '../../models/classes/Record';
import {PageViewModel} from '../../infrastructure/PageViewModel';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {WebApiService} from '../../services/web-api.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Utils} from '../../infrastructure/Utils';
import {Resources} from '../../infrastructure/Resources';
import {Config} from '../../infrastructure/Config';
import {TableHeaderRecordsComponent} from './table-header-records/table-header-records.component';
import {TrRecordComponent} from './tr-record/tr-record.component';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [TableHeaderRecordsComponent, TrRecordComponent, PaginationComponent],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IRecordsComponent = {
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

  // коллекция записей заданной компании
  public records: Record[] = [];

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
    Utils.helloComponent(Literals.records);

    console.log(`[-RecordsComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`*-this.records: -*`);
    console.dir(this.records);

    console.log(`--RecordsComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-RecordsComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-RecordsComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--RecordsComponent-subscribe-]`);
      }); // subscribe


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

        console.log(`--RecordsComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "Home" - 'FALSE' -*`);

    console.log(`*-(стало)-this.company: -*`);
    console.dir(this.company);


    // запрос на получение части коллекции записей заданной компании для первой страницы
    console.log(`*-(было)-this.records: -*`);
    console.dir(this.records);
    console.log(`*-(было)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);
    await this.requestGetAllRecordsByCompanyIdByPage(Literals.one);
    console.log(`*-(стало)-this.records: -*`);
    console.dir(this.records);
    console.log(`*-(стало)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);

    // установить соответствующий заголовок
    this.component.title = this.records.length === this.zero
      ? Resources.recordsZeroCollectionTitle[this.component.language]
      : Resources.recordsTitle[this.component.language];

    console.log(`--RecordsComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-RecordsComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title = this.records.length === this.zero
      ? Resources.recordsZeroCollectionTitle[this.component.language]
      : Resources.recordsTitle[this.component.language];
    this.component.butToFirstPageTitle         = Resources.butToFirstPageTitle[this.component.language];
    this.component.butPreviousTitle            = Resources.butPreviousTitle[this.component.language];
    this.component.butPreviousValue            = Resources.butPreviousValue[this.component.language];
    this.component.butCurrentPageTitle         = Resources.butCurrentPageTitle[this.component.language];
    this.component.butNextTitle                = Resources.butNextTitle[this.component.language];
    this.component.butNextValue                = Resources.butNextValue[this.component.language];
    this.component.butToLastPageTitle          = Resources.butToLastPageTitle[this.component.language];

    console.log(`--RecordsComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение записи о компании из БД для отображения
  async requestGetCompanyById(): Promise<void> {
    console.log(`[-RecordsComponent-requestGetCompanyById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--RecordsComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--RecordsComponent-requestGetCompanyById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--RecordsComponent-1-(запрос на получение компании)-`);

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

    console.log(`--RecordsComponent-result:`);
    console.dir(result);

    console.log(`--RecordsComponent-2-(ответ на запрос получен)-`);

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

    console.log(`--RecordsComponent-requestGetCompanyById-]`);
  } // requestGetCompanyById


  // запрос на получение части коллекции записей заданной компании для заданной страницы
  async requestGetAllRecordsByCompanyIdByPage(page: number): Promise<void> {
    console.log(`[-RecordsComponent-requestGetAllRecordsByCompanyIdByPage--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--RecordsComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--RecordsComponent-requestGetAllRecordsByCompanyIdByPage-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--RecordsComponent-1-(запрос на получение записей)-`);

    // запрос на получение части коллекции записей для заданной страницы
    let result: { message: any, records: Record[], pageViewModel: PageViewModel } =
      { message: Literals.Ok, records: [], pageViewModel: new PageViewModel() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService.getAllByIdByPage(
        Config.urlGetAllRecordsByCompanyId, this.company.id, page, token
      ));
      console.dir(webResult);

      result.records = Record.parseRecords(webResult.records);
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

    console.log(`--RecordsComponent-result:`);
    console.dir(result);

    console.log(`--RecordsComponent-2-(ответ на запрос получен)-`);

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
      this.records       = result.records;
      this.pageViewModel = result.pageViewModel;

      // упорядочить данные по дате начала записи на сеанс (по умолчанию)
      this.sendSortParamsHandler({ sortMode: Literals.empty, sortProp: Literals.empty });

    } // if

    console.log(`--RecordsComponent-requestGetAllRecordsByCompanyIdByPage-]`);
  } // requestGetAllRecordsByCompanyIdByPage


  // обработчик события получения данных о номере выбранной страницы
  async sendPageHandler(page: number): Promise<void> {
    console.log(`[-RecordsComponent-sendPageHandler--`);

    console.log(`*- page: '${page}' -*`);

    // переход в начало страницы
    Utils.toStart();

    // удалить элементы части коллекции клиентов, загруженные ранее
    console.log(`*-(было)-this.records: -*`);
    console.dir(this.records);
    this.records = [];
    console.log(`*-(стало)-this.records: -*`);
    console.dir(this.records);

    // запрос на получение части коллекции записей для выбранной страницы
    console.log(`*-(было)-this.records: -*`);
    console.dir(this.records);
    console.log(`*-(было)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);
    await this.requestGetAllRecordsByCompanyIdByPage(page);
    console.log(`*-(стало)-this.records: -*`);
    console.dir(this.records);
    console.log(`*-(стало)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);

    console.log(`--RecordsComponent-sendPageHandler-]`);
  } // sendPageHandler


  // обработчик события получения данных о сортировках (из заголовка таблицы)
  sendSortParamsHandler(param: { sortMode: string, sortProp: string }): void {
    console.log(`[-RecordsComponent-sendSortParamsHandler--`);

    console.log(`*- param.sortMode: '${param.sortMode}' -*`);
    console.log(`*- param.sortProp: '${param.sortProp}' -*`);

    // выбираем обработку для сортировки в зависимости от выбранного поля
    if (param.sortMode != Literals.empty) {
      switch (param.sortProp) {

        case Literals.employee:
          this.records = param.sortMode === Literals.asc
            ? this.records.sort((record1: Record, record2: Record) =>
              record1.employee.user.userName.localeCompare(record2.employee.user.userName))
            : this.records.sort((record1: Record, record2: Record) =>
              record2.employee.user.userName.localeCompare(record1.employee.user.userName));
          break;

        case Literals.client:
          this.records = param.sortMode === Literals.asc
            ? this.records.sort((record1: Record, record2: Record) =>
              (record1.client.surname ?? record1.client.name).localeCompare(record2.client.surname ?? record2.client.name))
            : this.records.sort((record1: Record, record2: Record) =>
              (record2.client.surname ?? record2.client.name).localeCompare(record1.client.surname ?? record1.client.name));
          break;

        case Literals.date:
          this.records = param.sortMode === Literals.asc
            ? this.records.sort((record1: Record, record2: Record) =>
              record1.date.toLocaleString().localeCompare(record2.date.toLocaleString()))
            : this.records.sort((record1: Record, record2: Record) =>
              record2.date.toLocaleString().localeCompare(record1.date.toLocaleString()));
          break;

        case Literals.length:
          this.records = param.sortMode === Literals.asc
            ? this.records.sort((record1: Record, record2: Record) =>
              record1.length - record2.length)
            : this.records.sort((record1: Record, record2: Record) =>
              record2.length - record1.length);
          break;

        case Literals.attendance:
          this.records = param.sortMode === Literals.asc
            ? this.records.sort((record1: Record, record2: Record) =>
              record1.attendance - record2.attendance)
            : this.records.sort((record1: Record, record2: Record) =>
              record2.attendance - record1.attendance);
          break;

        case Literals.isOnline:
          this.records = param.sortMode === Literals.asc
            ? this.records.sort((record1: Record, record2: Record) =>
              (record1.isOnline ? 1 : 0) - (record2.isOnline ? 1 : 0))
            : this.records.sort((record1: Record, record2: Record) =>
              (record2.isOnline ? 1 : 0) - (record1.isOnline ? 1 : 0));
          break;

        case Literals.price:
          this.records = param.sortMode === Literals.asc
            ? this.records.sort((record1: Record, record2: Record) =>
              record1.totalPrice - record2.totalPrice)
            : this.records.sort((record1: Record, record2: Record) =>
              record2.totalPrice - record1.totalPrice);
          break;

      } // switch
    }
    else {
      this.records = this.records.sort((record1: Record, record2: Record) =>
        record1.date.toLocaleString().localeCompare(record2.date.toLocaleString()))
    } // if

    console.log(`--RecordsComponent-sendSortParamsHandler-]`);
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
    console.log(`[-RecordsComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--RecordsComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class RecordsComponent
// ----------------------------------------------------------------------------
