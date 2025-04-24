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


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title = Resources.onlineRecordServicesTitle[this.component.language];

  } // changeLanguageLiterals


  // запрос на получение записи о компании из БД для отображения
  async requestGetCompanyById(): Promise<void> {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

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


  // запрос на получение коллекции услуг заданной компании
  async requestGetAllServicesByCompanyIdGroupByCategories(): Promise<void> {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

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


  // программный переход на страницу выбора сотрудника
  routingToOnlineRecordEmployees() {

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

  } // routingToOnlineRecordEmployees


  // обработчик события получения данных об Id выбранной услуги
  async sendSelectedServiceIdHandler(result: { serviceId: number, isSelected: boolean }): Promise<void> {

    // добавить/удалить идентификатор выбранной услуги
    if (result.isSelected)
      this.selectedServicesIds.push(result.serviceId);
    else {
      let index: number = this.selectedServicesIds.findIndex(id => id === result.serviceId);
      this.selectedServicesIds.splice(index, 1);
    } // if

  } // sendSelectedServiceIdHandler


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {

    // отмена подписки
    this._languageSubscription.unsubscribe();

  } // ngOnDestroy

} // class OnlineRecordServicesComponent
// ----------------------------------------------------------------------------
