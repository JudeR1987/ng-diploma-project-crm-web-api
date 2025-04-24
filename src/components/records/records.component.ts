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
    Utils.helloComponent(Literals.records);

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


    // запрос на получение части коллекции записей заданной компании для первой страницы
    await this.requestGetAllRecordsByCompanyIdByPage(Literals.one);

    // установить соответствующий заголовок
    this.component.title = this.records.length === this.zero
      ? Resources.recordsZeroCollectionTitle[this.component.language]
      : Resources.recordsTitle[this.component.language];

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

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


  // запрос на получение части коллекции записей заданной компании для заданной страницы
  async requestGetAllRecordsByCompanyIdByPage(page: number): Promise<void> {

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

    // запрос на получение части коллекции записей для заданной страницы
    let result: { message: any, records: Record[], pageViewModel: PageViewModel } =
      { message: Literals.Ok, records: [], pageViewModel: new PageViewModel() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService.getAllByIdByPage(
        Config.urlGetAllRecordsByCompanyId, this.company.id, page, token
      ));

      result.records = Record.parseRecords(webResult.records);
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
      this.records       = result.records;
      this.pageViewModel = result.pageViewModel;

      // упорядочить данные по дате начала записи на сеанс (по умолчанию)
      this.sendSortParamsHandler({ sortMode: Literals.empty, sortProp: Literals.empty });

    } // if

  } // requestGetAllRecordsByCompanyIdByPage


  // обработчик события получения данных о номере выбранной страницы
  async sendPageHandler(page: number): Promise<void> {

    // переход в начало страницы
    Utils.toStart();

    // удалить элементы части коллекции клиентов, загруженные ранее
    this.records = [];

    // запрос на получение части коллекции записей для выбранной страницы
    await this.requestGetAllRecordsByCompanyIdByPage(page);

  } // sendPageHandler


  // обработчик события получения данных о сортировках (из заголовка таблицы)
  sendSortParamsHandler(param: { sortMode: string, sortProp: string }): void {

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

} // class RecordsComponent
// ----------------------------------------------------------------------------
