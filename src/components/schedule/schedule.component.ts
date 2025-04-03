// ----------------------------------------------------------------------------
// компонент управления расписанием заданного сотрудника заданной компании
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {IScheduleComponent} from '../../models/interfaces/IScheduleComponent';
import {Literals} from '../../infrastructure/Literals';
import {Subscription} from 'rxjs';
import {Resources} from '../../infrastructure/Resources';
import {Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {WebApiService} from '../../services/web-api.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Utils} from '../../infrastructure/Utils';
import {Company} from '../../models/classes/Company';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IScheduleComponent = {
    // параметры меняющиеся при смене языка
    title: Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:   Literals.empty,
    route:      Literals.empty,
    isWaitFlag: false
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о выбранной компании
  public company: Company = new Company();

  // коллекция товаров заданной компании
  //public goods: Goods[] = [];

  // свойство для ограничения отображения элементов разметки
  protected readonly zero: number = Literals.zero;
  protected readonly one: number  = Literals.one;


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
    Utils.helloComponent(Literals.schedule);

    console.log(`[-ScheduleComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];
    console.log(`*-this.component.route='${this.component.route}'-*`);

    //console.log(`*-this.employees: -*`);
    //console.dir(this.employees);

    console.log(`--ScheduleComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-ScheduleComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-ScheduleComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--ScheduleComponent-subscribe-]`);
      }); // subscribe


    // получить данные о пользователе из сервиса-хранилища
    /*console.log(`*-(было)-this.user: -*`);
    console.dir(this.user);
    this.user = this._userService.user;
    console.log(`*-(стало)-this.user: -*`);
    console.dir(this.user);*/


    // запрос на получение коллекции сотрудников заданной компании
    //console.log(`*-(было)-this.employees: -*`);
    //console.dir(this.employees);
    //await this.requestGetAllEmployeesByCompanyId();
    //console.log(`*-(стало)-this.employees: -*`);
    //console.dir(this.employees);

    console.log(`--ScheduleComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-ScheduleComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title = Resources.pageUnderDevelopmentTitle[this.component.language];

    console.log(`--ScheduleComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение коллекции сотрудников заданной компании
  async requestGetAllEmployeesByCompanyId(): Promise<void> {
    console.log(`[-ScheduleComponent-requestGetAllEmployeesByCompanyId--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ScheduleComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    /*if (!this._tokenService.isTokenExists()) {

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
    } // if*/

    console.log(`--ScheduleComponent-1-(запрос на получение)-`);

    // запрос на получение коллекции компаний
    /*let result: { message: any, companies: Company[], pageViewModel: PageViewModel } =
      { message: Literals.Ok, companies: [], pageViewModel: new PageViewModel() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(this._webApiService.getAllCompaniesByUserIdByPage(
        Config.urlGetAllCompaniesByUserId, this.user.id, page, token
      ));
      console.dir(webResult);

      result.companies = Company.parseCompanies(webResult.companies);
      result.pageViewModel = PageViewModel.newPageViewModel(webResult.pageViewModel);

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

    } // try-catch*/

    console.log(`--ScheduleComponent-result:`);
    //console.dir(result);

    console.log(`--ScheduleComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    /*// если сообщение с ошибкой - вывод сообщения на экран
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.page: '${result.message.page}'`);
      if (result.message.page <= Literals.zero) message =
        Resources.pageIncorrectData[this.component.language];

      console.log(`--result.message.userId: '${result.message.userId}'`);
      if (result.message.userId === Literals.zero)
        message = Resources.incorrectUserIdData[this.component.language];

      // ошибки сервера
      if (result.message.title) message = result.message.title;
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);

    } else {

      // получить данные из результата запроса
      this.companies     = result.companies;
      this.pageViewModel = result.pageViewModel;

    } // if*/

    console.log(`--ScheduleComponent-requestGetAllEmployeesByCompanyId-]`);
  } // requestGetAllEmployeesByCompanyId


  // программный переход к форме создания данных о сотруднике компании
  /*createEmployee() {
    console.log(`[-ScheduleComponent-createEmployee--`);

    /!*!// маршрут
    let routerLink: string = Literals.routeCompanyForm;

    // параметр
    let mode: string = Literals.createCompany;
    //let companyId: number = 45;

    // переход по маршруту
    //this._router.navigateByUrl(`${routerLink}/${mode}/${companyId}`)
    this._router.navigateByUrl(`${routerLink}/${mode}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });*!/

    console.log(`--ScheduleComponent-createEmployee-]`);
  }*/ // createEmployee


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
    console.log(`[-ScheduleComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--ScheduleComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class ScheduleComponent
// ----------------------------------------------------------------------------
