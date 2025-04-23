// ----------------------------------------------------------------------------
// компонент отображения взаимосвязи пользователя с зарегистрированными
// компаниями (как владелец или сотрудник)
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {IBusinessComponent} from '../../models/interfaces/IBusinessComponent';
import {Literals} from '../../infrastructure/Literals';
import {firstValueFrom, Subscription} from 'rxjs';
import {Company} from '../../models/classes/Company';
import {Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {WebApiService} from '../../services/web-api.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {Utils} from '../../infrastructure/Utils';
import {PageViewModel} from '../../infrastructure/PageViewModel';
import {Resources} from '../../infrastructure/Resources';
import {User} from '../../models/classes/User';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Config} from '../../infrastructure/Config';
import {CardCompanyComponent} from '../card-company/card-company.component';
import {PaginationComponent} from '../pagination/pagination.component';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [CardCompanyComponent, PaginationComponent],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css'
})
export class BusinessComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IBusinessComponent = {
    // параметры меняющиеся при смене языка
    title:                       Resources.businessTitleDefault,
    displayTitle:                Literals.empty,
    companiesTitle:              Literals.empty,
    labelSchedule:               Literals.empty,
    labelPhone:                  Literals.empty,
    butCreateCompanyTitle:       Literals.empty,
    butCreateCompanyValue:       Literals.empty,
    butEditCompanyTitle:         Literals.empty,
    butEditCompanyValue:         Literals.empty,
    butToFirstPageTitle:         Literals.empty,
    butPreviousTitle:            Literals.empty,
    butPreviousValue:            Literals.empty,
    butCurrentPageTitle:         Literals.empty,
    butNextTitle:                Literals.empty,
    butNextValue:                Literals.empty,
    butToLastPageTitle:          Literals.empty,
    butSalonManagementTitle:     Literals.empty,
    butSalonManagementValue:     Literals.empty,
    butServicesManagementTitle:  Literals.empty,
    butServicesManagementValue:  Literals.empty,
    butEmployeesManagementTitle: Literals.empty,
    butClientsManagementValue:   Literals.empty,
    butClientsManagementTitle:   Literals.empty,
    butRecordsManagementValue:   Literals.empty,
    butRecordsManagementTitle:   Literals.empty,
    butEmployeesManagementValue: Literals.empty,
    butWarehouseManagementTitle: Literals.empty,
    butWarehouseManagementValue: Literals.empty,
    butReportsTitle:             Literals.empty,
    butReportsValue:             Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:    Literals.empty,
    route:       Literals.empty,
    isWaitFlag:  false/*,
    srcLogoPath:                  Literals.srcLogoPath,
    fileNameLogoDef:              Literals.fileNameLogoDef,
    srcImagePath:                 Literals.srcImagePath,
    fileNameCompanyTitleImageDef: Literals.fileNameCompanyTitleImageDef*/
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о пользователе
  public user: User = new User();

  // коллекция зарегистрированных пользователем компаний
  public companies: Company[] = [];

  // информация о пагинации страницы
  public pageViewModel: PageViewModel = new PageViewModel();

  // свойство для ограничения отображения элементов разметки
  protected readonly zero: number     = Literals.zero;
  protected readonly one: number      = Literals.one;


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута, подключения к сервису установки языка,
  // подключения к web-сервису, подключения к сервису хранения сообщения об ошибке,
  // подключения к сервисам хранения данных о пользователе и jwt-токене
  // и подключения к сервису аутентификации/авторизации пользователя
  constructor(private _router: Router,
              private _languageService: LanguageService,
              private _webApiService: WebApiService,
              private _errorMessageService: ErrorMessageService,
              private _userService: UserService,
              private _tokenService: TokenService,
              private _authGuardService: AuthGuardService) {
    Utils.helloComponent(Literals.business);

    console.log(`[-BusinessComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1);
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`*-this.companies: -*`);
    console.dir(this.companies);

    console.log(`--BusinessComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-BusinessComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-BusinessComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--BusinessComponent-subscribe-]`);
      }); // subscribe


    // получить данные о пользователе из сервиса-хранилища
    console.log(`*-(было)-this.user: -*`);
    console.dir(this.user);
    this.user = this._userService.user;
    console.log(`*-(стало)-this.user: -*`);
    console.dir(this.user);


    // запрос на получение части коллекции зарегистрированных
    // пользователем компаний для первой страницы
    console.log(`*-(было)-this.companies: -*`);
    console.dir(this.companies);
    console.log(`*-(было)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);
    await this.requestGetAllCompaniesByUserId(Literals.one);
    console.log(`*-(стало)-this.companies: -*`);
    console.dir(this.companies);
    console.log(`*-(стало)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);

    console.log(`--BusinessComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-BusinessComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.displayTitle                = this.component.title[this.component.language];
    this.component.companiesTitle              = Resources.businessCompaniesTitle[this.component.language];
    this.component.labelSchedule               = Resources.labelSchedule[this.component.language];
    this.component.labelPhone                  = Resources.displayLabelPhone[this.component.language];
    this.component.butCreateCompanyTitle       = Resources.businessButCreateCompanyTitle[this.component.language];
    this.component.butCreateCompanyValue       = Resources.businessButCreateCompanyValue[this.component.language];
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
    this.component.butServicesManagementTitle  = Resources.businessButServicesManagementTitle[this.component.language];
    this.component.butServicesManagementValue  = Resources.businessButServicesManagementValue[this.component.language];
    this.component.butEmployeesManagementTitle = Resources.businessButEmployeesManagementTitle[this.component.language];
    this.component.butEmployeesManagementValue = Resources.businessButEmployeesManagementValue[this.component.language];
    this.component.butClientsManagementTitle   = Resources.businessButClientsManagementTitle[this.component.language];
    this.component.butClientsManagementValue   = Resources.businessButClientsManagementValue[this.component.language];
    this.component.butRecordsManagementTitle   = Resources.businessButRecordsManagementTitle[this.component.language];
    this.component.butRecordsManagementValue   = Resources.businessButRecordsManagementValue[this.component.language];
    this.component.butWarehouseManagementTitle = Resources.businessButWarehouseManagementTitle[this.component.language];
    this.component.butWarehouseManagementValue = Resources.businessButWarehouseManagementValue[this.component.language];
    this.component.butReportsTitle             = Resources.businessButReportsTitle[this.component.language];
    this.component.butReportsValue             = Resources.businessButReportsValue[this.component.language];

    console.log(`--BusinessComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // обработчик события получения данных об Id выбранной компании
  // (программный переход к форме изменения сведений о выбранной компании)
  sendCompanyIdHandler(companyId: number): void {
    console.log(`[-BusinessComponent-sendCompanyIdHandler--`);

    console.log(`*- companyId: '${companyId}' -*`);

    // маршрут
    let routerLink: string = Literals.routeCompanyForm;

    // параметр
    let mode: string = Literals.editCompany;

    // переход по маршруту
    this._router.navigateByUrl(`${routerLink}/${mode}/${companyId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--BusinessComponent-sendCompanyIdHandler-]`);
  } // sendCompanyIdHandler


  // программный переход на страницу управления услугами салона
  routingToServices(companyId: number): void {
    console.log(`[-BusinessComponent-routingToServices--`);

    console.log(`*- companyId: '${companyId}' -*`);

    // маршрут
    let routerLink: string = Literals.routeServices;

    // переход по маршруту
    this._router.navigateByUrl(`${routerLink}/${companyId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--BusinessComponent-routingToServices-]`);
  } // routingToServices


  // программный переход на страницу управления персоналом салона
  routingToEmployees(companyId: number): void {
    console.log(`[-BusinessComponent-routingToEmployees--`);

    console.log(`*- companyId: '${companyId}' -*`);

    // маршрут
    let routerLink: string = Literals.routeEmployees;

    // переход по маршруту
    this._router.navigateByUrl(`${routerLink}/${companyId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--BusinessComponent-routingToEmployees-]`);
  } // routingToEmployees


  // программный переход на страницу просмотра клиентской базы
  routingToClients(companyId: number): void {
    console.log(`[-BusinessComponent-routingToClients--`);

    console.log(`*- companyId: '${companyId}' -*`);

    // маршрут
    let routerLink: string = Literals.routeClients;

    // переход по маршруту
    this._router.navigateByUrl(`${routerLink}/${companyId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--BusinessComponent-routingToClients-]`);
  } // routingToClients


  // программный переход на страницу просмотра записей на процедуры
  routingToRecords(companyId: number): void {
    console.log(`[-BusinessComponent-routingToRecords--`);

    console.log(`*- companyId: '${companyId}' -*`);

    // маршрут
    let routerLink: string = Literals.routeRecords;

    // переход по маршруту
    this._router.navigateByUrl(`${routerLink}/${companyId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--BusinessComponent-routingToRecords-]`);
  } // routingToRecords


  // программный переход на страницу управления складом
  // расходных материалов и продуктов на продажу
  routingToWarehouse(companyId: number): void {
    console.log(`[-BusinessComponent-routingToWarehouse--`);

    console.log(`*- companyId: '${companyId}' -*`);

    // маршрут
    let routerLink: string = Literals.routeWarehouse;

    // переход по маршруту
    this._router.navigateByUrl(`${routerLink}/${companyId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--BusinessComponent-routingToWarehouse-]`);
  } // routingToWarehouse


  // программный переход на страницу просмотра отчётов по салону
  routingToReports(companyId: number): void {
    console.log(`[-BusinessComponent-routingToReports--`);

    console.log(`*- companyId: '${companyId}' -*`);

    // маршрут
    let routerLink: string = Literals.routeReports;

    // переход по маршруту
    this._router.navigateByUrl(`${routerLink}/${companyId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--BusinessComponent-routingToReports-]`);
  } // routingToReports


  // обработчик события получения данных о номере выбранной страницы
  // (запрос на получение коллекции компаний по странице)
  async sendPageHandler(page: number): Promise<void> {
    console.log(`[-BusinessComponent-sendPageHandler--`);

    console.log(`*- page: '${page}' -*`);

    // переход в начало страницы
    Utils.toStart();

    // удалить элементы части коллекции компаний, загруженные ранее
    console.log(`*-(было)-this.companies: -*`);
    console.dir(this.companies);
    this.companies = [];
    console.log(`*-(стало)-this.companies: -*`);
    console.dir(this.companies);

    // запрос на получение части коллекции компаний
    // для выбранной страницы и для данного пользователя
    console.log(`*-(было)-this.companies: -*`);
    console.dir(this.companies);
    console.log(`*-(было)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);
    await this.requestGetAllCompaniesByUserId(page);
    console.log(`*-(стало)-this.companies: -*`);
    console.dir(this.companies);
    console.log(`*-(стало)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);

    console.log(`--BusinessComponent-sendPageHandler-]`);
  } // sendPageHandler


  // запрос на получение коллекции компаний, зарегистрированных пользователем
  async requestGetAllCompaniesByUserId(page: number): Promise<void> {
    console.log(`[-BusinessComponent-requestGetAllCompaniesByUserId--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--BusinessComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--BusinessComponent-requestGetAllCompaniesByUserId-КОНЕЦ-]`);
        return;
      } // if

      // иначе - обновим данные о токене обновления пользователя
      // и переходим к последующему запросу
      console.log(`*-(было)-this.user.userToken: '${this.user.userToken}' -*`);
      this.user.userToken = (this._userService.user).userToken;
      console.log(`*-(стало)-this.user.userToken: '${this.user.userToken}' -*`);
    } // if

    console.log(`--BusinessComponent-1-(запрос на получение)-`);

    // запрос на получение коллекции компаний
    let result: { message: any, companies: Company[], pageViewModel: PageViewModel } =
      { message: Literals.Ok, companies: [], pageViewModel: new PageViewModel() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService.getAllByIdByPage(
        Config.urlGetAllCompaniesByUserId, this.user.id, page, token
      ));
      console.dir(webResult);

      result.companies = Company.parseCompanies(webResult.companies);
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

    console.log(`--BusinessComponent-result:`);
    console.dir(result);

    console.log(`--BusinessComponent-2-(ответ на запрос получен)-`);

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

      console.log(`--result.message.userId: '${result.message.userId}'`);
      if (result.message.userId === Literals.zero)
        message = Resources.incorrectUserIdData[this.component.language];

      // ошибки сервера
      if (result.message.title) message = result.message.title;
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);
    }
    else {

      // получить данные из результата запроса
      this.companies     = result.companies;
      this.pageViewModel = result.pageViewModel;

    } // if

    console.log(`--BusinessComponent-requestGetAllCompaniesByUserId-]`);
  } // requestGetAllCompaniesByUserId


  // программный переход к форме создания данных о компании для регистрации
  createCompany() {
    console.log(`[-BusinessComponent-createCompany--`);

    // маршрут
    let routerLink: string = Literals.routeCompanyForm;

    // параметр
    let mode: string = Literals.createCompany;
    //let companyId: number = 45;

    // переход по маршруту
    //this._router.navigateByUrl(`${routerLink}/${mode}/${companyId}`)
    this._router.navigateByUrl(`${routerLink}/${mode}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--BusinessComponent-createCompany-]`);
  } // createCompany


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
    console.log(`[-BusinessComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--BusinessComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class BusinessComponent
// ----------------------------------------------------------------------------
