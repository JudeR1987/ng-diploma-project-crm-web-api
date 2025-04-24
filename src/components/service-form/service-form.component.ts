// ----------------------------------------------------------------------------
// компонент отображения формы создания/изменения услуги компании
// (+ создание категории услуг)
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {IServiceFormComponent} from '../../models/interfaces/IServiceFormComponent';
import {Literals} from '../../infrastructure/Literals';
import {firstValueFrom, Subscription} from 'rxjs';
import {Service} from '../../models/classes/Service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {WebApiService} from '../../services/web-api.service';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Utils} from '../../infrastructure/Utils';
import {Resources} from '../../infrastructure/Resources';
import {Config} from '../../infrastructure/Config';
import {ServicesCategory} from '../../models/classes/ServicesCategory';
import {UserValidators} from '../../validators/UserValidators';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css'
})
export class ServiceFormComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IServiceFormComponent = {
    // параметры меняющиеся при смене языка
    title:                                           Literals.empty,
    labelServicesCategory:                           Literals.empty,
    labelNewServicesCategoryName:                    Literals.empty,
    labelServiceName:                                Literals.empty,
    firstOptionServicesCategories:                   Literals.empty,
    labelCheckboxIsNewServicesCategoryTitle:         Literals.empty,
    labelCheckboxIsNewServicesCategory:              Literals.empty,
    labelPriceMin:                                   Literals.empty,
    labelPriceMax:                                   Literals.empty,
    labelDuration:                                   Literals.empty,
    labelComment:                                    Literals.empty,
    newServicesCategoryNamePlaceholder:              Literals.empty,
    serviceNamePlaceholder:                          Literals.empty,
    commentPlaceholder:                              Literals.empty,
    errorRequiredTitle:                              Literals.empty,
    errorServicesCategorySelectedZeroValidatorTitle: Literals.empty,
    errorRegisteredServicesCategoryName:             {message: Literals.empty, isRegistered: false},
    errorNewServicesCategoryNameMaxLengthTitle:      Literals.empty,
    errorServiceNameMaxLengthTitle:                  Literals.empty,
    errorMinValueTitle:                              Literals.empty,
    errorPriceMaxValueTitle:                         Literals.empty,
    errorDurationMaxValueTitle:                      Literals.empty,
    errorCommentMaxLengthTitle:                      Literals.empty,
    butServiceCreateTitle:                           Literals.empty,
    butServiceCreateValue:                           Literals.empty,
    butServiceEditTitle:                             Literals.empty,
    butServiceEditValue:                             Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:                      Literals.empty,
    route:                         Literals.empty,
    route_mode:                    Literals.empty,
    isWaitFlag:                    false,
    isChangedFormFlag:             false,
    newServicesCategoryNameLength: Literals.serviceNewServicesCategoryNameLength,
    serviceNameLength:             Literals.serviceNameLength,
    priceMaxValue:                 Literals.serviceFormPriceMaxValue,
    durationMaxValue:              Literals.serviceFormDurationMax,
    commentLength:                 Literals.serviceCommentLength,
    errorRequired:                 Literals.required,
    errorMaxLength:                Literals.maxlength,
    errorSelectedZeroValidator:    Literals.selectedZeroValidator,
    errorMinValue:                 Literals.min,
    errorMaxValue:                 Literals.max,
    allServicesCategories:         [],
    servicesCategoriesList:        []
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // режим создания/изменения сведений об услуге
  private _mode: string = Literals.empty;

  // сведения об Id выбранной компании
  private _companyId: number = Literals.zero;

  // сведения об Id выбранной категории услуг компании
  private _servicesCategoryId: number = Literals.zero;

  // сведения об Id выбранной услуги компании
  private _serviceId: number = Literals.zero;

  // сведения об услуге для создания/изменения
  public service: Service = new Service();


  // поле выбора категории услуг компании
  public servicesCategoryId: FormControl = new FormControl();

  // поле включения режима ввода новой категории услуг
  public isNewServicesCategory: FormControl = new FormControl();

  // поле ввода наименования новой категории услуг
  public newServicesCategoryName: FormControl = new FormControl();

  // поле ввода наименования услуги
  public serviceName: FormControl = new FormControl();

  // поле ввода минимальной цены на услугу
  public priceMin: FormControl = new FormControl();

  // поле ввода максимальной цены на услугу
  public priceMax: FormControl = new FormControl();

  // поле ввода длительности услуги, по умолчанию равна 3600 секундам(1 час)
  public duration: FormControl = new FormControl();

  // поле ввода комментария к услуге
  public comment: FormControl = new FormControl();

  // объект формы создания/изменения данных об услуге
  public serviceForm: FormGroup = new FormGroup<any>({
    servicesCategoryId:      this.servicesCategoryId,
    isNewServicesCategory:   this.isNewServicesCategory,
    newServicesCategoryName: this.newServicesCategoryName,
    serviceName:             this.serviceName,
    priceMin:                this.priceMin,
    priceMax:                this.priceMax,
    duration:                this.duration,
    comment:                 this.comment
  });

  // дополнительные свойства
  protected readonly zero: number          = Literals.zero;
  protected readonly one: number           = Literals.one;
  protected readonly createService: string = Literals.createService;
  protected readonly hundred: number       = Literals.hundred;
  protected readonly fifteen: number       = Literals.fifteen;


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута, подключения объекта активного маршрута для
  // получения параметров маршрута, подключения к сервису установки языка,
  // подключения к сервису хранения сообщения об ошибке, подключения к web-сервису,
  // подключения к сервисам хранения данных о пользователе и jwt-токене
  // и подключения к сервису аутентификации/авторизации пользователя
  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _languageService: LanguageService,
              private _errorMessageService: ErrorMessageService,
              private _webApiService: WebApiService,
              private _userService: UserService,
              private _tokenService: TokenService,
              private _authGuardService: AuthGuardService) {
    Utils.helloComponent(Literals.serviceForm);

    // получить маршрут и значение режима создания/изменения данных об услуге
    let items: string[] = this._router.url.slice(1).split(Literals.slash);
    this.component.route = items[0];
    this.component.route_mode = items[1].split(Literals.question)[0];

    // отключить список выбора категории услуг
    this.servicesCategoryId.disable();

    // отключить чек-бокс включения режима ввода новой категории услуг
    this.isNewServicesCategory.disable();

    // отключить поле ввода наименования новой категории услуг
    this.newServicesCategoryName.disable();

  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);

    // в заголовке установить значение по умолчанию
    this.component.title = Resources.serviceFormTitleDefault[this.component.language];

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

      }); // subscribe


    // получить параметры маршрута
    let mode: string = Literals.empty;
    let companyId: number = 0;
    let servicesCategoryId: number = 0;
    let serviceId: number = 0;
    // подписка на получение результата перехода по маршруту (данные из маршрута)
    this._activatedRoute.params.subscribe(params => {

      // параметр о режиме создания/изменения, полученный из маршрута
      mode = params[Literals.mode];
      this._mode = mode;

    }); // subscribe

    // подписка на получение результата перехода по маршруту (данные из параметров маршрута)
    this._activatedRoute.queryParams.subscribe(params => {

      // параметр об Id выбранной компании
      companyId = params[Literals.companyId] != undefined
        ? +params[Literals.companyId]
        : 0;
      this._companyId = companyId;

      // параметр об Id выбранной категории услуг
      servicesCategoryId = params[Literals.servicesCategoryId] != undefined
        ? +params[Literals.servicesCategoryId]
        : 0;
      this._servicesCategoryId = servicesCategoryId;

      // параметр об Id выбранной услуги
      serviceId = params[Literals.serviceId] != undefined
        ? +params[Literals.serviceId]
        : 0;
      this._serviceId = serviceId;

    }); // subscribe


    // проверки на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)

    // если Id компании НЕ добавлен, требуется перейти на страницу "NotFound"
    if (this._companyId === this.zero) {

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectCompanyIdData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // если в режиме создания добавлен Id услуги ИЛИ
    // в режиме изменения Id услуги НЕ добавлен,
    // требуется перейти на страницу "NotFound"
    if ((this._mode === Literals.createService && this._serviceId > this.zero) ||
      (this._mode === Literals.editService && this._serviceId === this.zero)) {

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(this._mode === Literals.createService
            ? Resources.serviceFormCreateServiceIncorrectData[this.component.language]
            : Resources.serviceFormEditServiceIncorrectData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // установим объекту услуги идентификатор
    this.service.id = this._serviceId;

    // при режиме изменения! во время загрузки компонента
    // отправить запрос на получение данных об изменяемой услуге
    if (this._mode === Literals.editService) {

      // запрос на получение записи об услуге из БД для изменения
      await this.requestGetServiceById();

      // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
      if (this.service.id === this.zero) {

        // перейти по маршруту на главную страницу
        this._router.navigateByUrl(Literals.routeHomeEmpty)
          .then((e) => { console.log(`*- переход: ${e} -*`);  });

        return;
      } // if

    } // if

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);


    // после получения данных об услуге отправить запрос на получение коллекции
    // категорий услуг для списка выбора в форме создания/изменения данных об услуге
    await this.requestGetAllServicesCategories();


    // создание объектов полей ввода и формы создания/изменения данных об услуге
    this.createFormControls();
    this.createForm();

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title = this._serviceId === Literals.zero
      ? Resources.serviceFormCreateTitle[this.component.language]
      : Resources.serviceFormEditTitleWithServiceName(this.component.language, this.service.name);
    this.component.labelServicesCategory                   = Resources.labelServicesCategory[this.component.language];
    this.component.labelNewServicesCategoryName            = Resources.serviceFormLabelNewServicesCategoryName[this.component.language];
    this.component.labelServiceName                        = Resources.labelService[this.component.language];
    this.component.firstOptionServicesCategories           = Resources.firstOptionServicesCategories[this.component.language];
    this.component.labelCheckboxIsNewServicesCategoryTitle = Resources.serviceFormLabelCheckboxIsNewServicesCategoryTitle[this.component.language];
    this.component.labelCheckboxIsNewServicesCategory      = Resources.labelNewShe[this.component.language];
    this.component.labelPriceMin                           = Resources.labelPriceMin[this.component.language];
    this.component.labelPriceMax                           = Resources.labelPriceMax[this.component.language];
    this.component.labelDuration                           = Resources.labelDuration[this.component.language];
    this.component.labelComment                            = Resources.labelComment[this.component.language];
    this.component.newServicesCategoryNamePlaceholder      = Resources.serviceFormNewServicesCategoryNamePlaceholder[this.component.language];
    this.component.serviceNamePlaceholder                  = Resources.serviceFormServiceNamePlaceholder[this.component.language];
    this.component.commentPlaceholder                      = Resources.serviceFormCommentPlaceholder[this.component.language];
    this.component.errorRequiredTitle                      = Resources.errorRequired[this.component.language];
    this.component.errorServicesCategorySelectedZeroValidatorTitle
      = Resources.serviceFormErrorServicesCategorySelectedZeroValidator[this.component.language];
    this.component.errorRegisteredServicesCategoryName.message
      = Resources.serviceFormErrorRegisteredServicesCategoryName[this.component.language];
    this.component.errorNewServicesCategoryNameMaxLengthTitle
      = Resources.serviceFormErrorNewServicesCategoryNameMaxLength(this.component.language, this.component.newServicesCategoryNameLength);
    this.component.errorServiceNameMaxLengthTitle          = Resources.errorNameMaxLength(this.component.language, this.component.serviceNameLength);
    this.component.errorMinValueTitle                      = Resources.errorMinMaxValue(this.component.language, Literals.min, this.one);
    this.component.errorPriceMaxValueTitle                 = Resources.errorMinMaxValue(this.component.language, Literals.max, this.component.priceMaxValue);
    this.component.errorDurationMaxValueTitle              = Resources.errorMinMaxValue(this.component.language, Literals.max, this.component.durationMaxValue);
    this.component.errorCommentMaxLengthTitle              = Resources.errorCommentMaxLength(this.component.language, this.component.commentLength);
    this.component.butServiceCreateTitle                   = Resources.serviceFormButServiceCreateTitle[this.component.language];
    this.component.butServiceCreateValue                   = Resources.butCreateValue[this.component.language];
    this.component.butServiceEditTitle                     = Resources.serviceFormButServiceEditTitle[this.component.language];
    this.component.butServiceEditValue                     = Resources.butEditValue[this.component.language];

  } // changeLanguageLiterals


  // запрос на получение записи об услуге из БД для изменения
  async requestGetServiceById(): Promise<void> {

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

    // запрос на получение записи об услуге
    let result: { message: any, service: Service } =
      { message: Literals.Ok, service: new Service() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetServiceById, this._serviceId, token)
      );

      result.service = Service.newService(webResult.service);
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
      if (result.message.serviceId != undefined)
        message = result.message.serviceId === this.zero
          ? Resources.incorrectServiceIdData[this.component.language]
          : Resources.notRegisteredServiceIdData[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);

      // при ошибках установить услуге нулевой идентификатор
      this.service.id = this.zero;
    }
    else {

      // присвоить значение полученных данных
      this.service = result.service;

    } // if

  } // requestGetServiceById


  // запрос на получение коллекции категорий услуг для списка
  // выбора в форме создания/изменения данных об услуге
  async requestGetAllServicesCategories(): Promise<void> {

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

    // запрос на получение коллекции категорий услуг
    let result: { message: any, allServicesCategories: ServicesCategory[] } =
      { message: Literals.Ok, allServicesCategories: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.get(Config.urlGetAllServicesCategories, token)
      );

      result.allServicesCategories = ServicesCategory
        .parseServicesCategories(webResult.allServicesCategories);
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

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // изменить результат на сообщение для вывода
      result.message = message;
    }
    else {

      // иначе - сообщение об успехе
      result.message = Resources.formParamsOkData[this.component.language];

      // присвоить значения полученных данных
      this.component.allServicesCategories = result.allServicesCategories;

      // создать массив данных для списка выбора
      this.component.servicesCategoriesList = ServicesCategory
        .parseServicesCategoriesToSelect(this.component.allServicesCategories);

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

  } // requestGetAllServicesCategories


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {

    // задать значения параметров запроса

    // 1) наименование услуги
    this.service.name = this.serviceName.value;

    // 2) данные о категории услуг
    let servicesCategoryId: number = +this.servicesCategoryId.value;

    // получить выбранную категорию услуг
    this.service.servicesCategory = this.isNewServicesCategory.value
      ? new ServicesCategory(this.zero, this.newServicesCategoryName.value, null)
      : this.component.allServicesCategories.find((servicesCategory: ServicesCategory) =>
        servicesCategory.id === servicesCategoryId) ?? new ServicesCategory();

    // 3) данные о компании, для которой услуга определена
    this.service.companyId = this._companyId;

    // 4) данные о минимальной цене на услугу
    this.service.priceMin = +this.priceMin.value;

    // 5) данные о максимальной цене на услугу
    this.service.priceMax = +this.priceMax.value;

    // 6) данные о длительности услуги
    this.service.durationFromMinutes = +this.duration.value;

    // 7) комментарий к услуге
    this.service.comment = this.comment.value === Literals.empty
      ? null
      : this.comment.value;


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

    // запрос на создание/изменение данных об услуге
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._serviceId === Literals.zero
          ? this._webApiService.createServicePUT(Config.urlCreateService, this.service, token)
          : this._webApiService.editServicePOST(Config.urlEditService, this.service, token)
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

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.serviceId != undefined)
        message = result.serviceId === this.zero
          ? Resources.incorrectServiceIdData[this.component.language]
          : Resources.notRegisteredServiceIdData[this.component.language];

      if (result.servicesCategoryId === this.zero)
        message = Resources.notRegisteredServicesCategoryIdData[this.component.language];

      if (result.companyId === this.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

      // ошибки сервера
      if (result.title != undefined) message = result.title;

      if (result.createMessage != undefined) message = result.createMessage;

      if (result.updateMessage != undefined) message = result.updateMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;

      // сбросить флаг изменений данных в форме
      this.component.isChangedFormFlag = false;

      // переход в начало страницы
      Utils.toStart();
    }
    else {

      // иначе - сообщение об успехе
      result = this._serviceId === this.zero
        ? Resources.serviceFormCreateOkData[this.component.language]
        : Resources.serviceFormEditOkData[this.component.language];

      // перейти по маршруту на страницу отображения услуг заданной компании
      this._router.navigateByUrl(`${Literals.routeServices}/${this._companyId}`)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

  } // onSubmit


  // создание объектов полей ввода формы создания/изменения данных об услуге
  createFormControls(): void {

    // поле выбора категории услуг салона
    this.servicesCategoryId = new FormControl(
      // начальное значение
      this._mode === this.createService
        ? this._servicesCategoryId
        : this.service.servicesCategory.id,
      // синхронные валидаторы
      [
        UserValidators.selectedZero
      ]
    );

    // поле включения режима ввода новой категории услуг
    this.isNewServicesCategory = new FormControl(/*начальное значение*/false);

    // поле ввода наименования новой категории услуг
    this.newServicesCategoryName = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.newServicesCategoryNameLength)
      ]
    );
    // отключить поле ввода наименования новой категории услуг
    this.newServicesCategoryName.disable();

    // поле ввода наименования услуги салона
    this.serviceName = new FormControl(
      // начальное значение
      this.service.name,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.serviceNameLength)
      ]
    );

    // поле ввода минимальной цены на услугу
    this.priceMin = new FormControl(
      // начальное значение
      this.service.priceMin,
      // синхронные валидаторы
      [
        Validators.min(this.one),
        Validators.max(this.component.priceMaxValue)
      ]
    );

    // поле ввода максимальной цены на услугу
    this.priceMax = new FormControl(
      // начальное значение
      this.service.priceMax,
      // синхронные валидаторы
      [
        Validators.min(this.one),
        Validators.max(this.component.priceMaxValue)
      ]
    );

    // поле ввода длительности услуги (вводить в минутах)
    // по умолчанию равна 3600 секундам(1 час)
    this.duration = new FormControl(
      // начальное значение (при создании - значение по умолчанию)
      this._mode === this.createService ? 3600 / 60 : this.service.durationInMinutes,
      // синхронные валидаторы
      [
        Validators.min(this.one),
        Validators.max(this.component.durationMaxValue)
      ]
    );

    // поле ввода комментария к услуге
    this.comment = new FormControl(
      // начальное значение
      this.service.comment,
      // синхронные валидаторы
      [
        Validators.maxLength(this.component.commentLength)
      ]
    );


    // подписка на изменения в чек-боксе включения режима ввода наименования новой категории услуг
    this.isNewServicesCategory.valueChanges.subscribe((data: boolean) => {

      // если чек-бокс отмечен - включить поле ввода
      if (data) {

        // отключить список выбора
        this.servicesCategoryId.disable();

        // включить поле ввода наименования новой категории услуг
        this.newServicesCategoryName.enable();
      }
      // иначе - включить список
      else {

        // включить список выбора
        this.servicesCategoryId.enable();

        // отключить поле ввода наименования новой категории услуг
        this.newServicesCategoryName.disable();

      } // if

      // в поле ввода задать пустое значение
      this.newServicesCategoryName.setValue(Literals.empty);

    }); // subscribe


    // подписка на изменения в поле ввода минимальной цены на услугу
    this.priceMin.valueChanges.subscribe((data: number) => {

      // проверка вводимых значений, this.priceMin.value >= 0 !
      if (data < this.zero || data === null)
        this.priceMin.setValue(this.zero);

      // проверка условия priceMin <= priceMax
      if (this.priceMin.value > this.priceMax.value)
        this.priceMax.setValue(data);

    }); // subscribe


    // подписка на изменения в поле ввода максимальной цены на услугу
    this.priceMax.valueChanges.subscribe((data: number) => {

      // проверка вводимых значений, this.priceMax.value >= 0 !
      if (data < this.zero || data === null)
        this.priceMax.setValue(this.zero);

      // проверка условия priceMin <= priceMax
      if (this.priceMax.value < this.priceMin.value)
        this.priceMin.setValue(data);

    }); // subscribe


    // подписка на изменения в поле ввода длительности услуги
    this.duration.valueChanges.subscribe((data: number) => {

      // проверка вводимых значений, this.duration.value >= 0 !
      if (data < this.zero || data === null)
        this.duration.setValue(this.zero);

    }); // subscribe

  } // createFormControls


  // создание объекта формы создания/изменения данных об услуге
  createForm(): void {

    this.serviceForm = new FormGroup( {
      servicesCategoryId:      this.servicesCategoryId,
      isNewServicesCategory:   this.isNewServicesCategory,
      newServicesCategoryName: this.newServicesCategoryName,
      serviceName:             this.serviceName,
      priceMin:                this.priceMin,
      priceMax:                this.priceMax,
      duration:                this.duration,
      comment:                 this.comment
    });

    // подписка на изменения в форме
    this.serviceForm.valueChanges.subscribe((data: {
      servicesCategoryId: number, isNewServicesCategory: boolean,
      newServicesCategoryName: string, serviceName: string,
      priceMin: number, priceMax: number, duration: number, comment: string
    }) => {

      // если в поле ввода наименования новой категории услуг вводится запись, то
      // проводим проверку на совпадение с уже зарегистрированными категориями услуг
      if (data.isNewServicesCategory && data.newServicesCategoryName != undefined)
        this.checkingExisting(data.newServicesCategoryName);

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      this.component.isChangedFormFlag = true;

    }); // subscribe


    // сбросить флаг изменений данных в форме
    this.component.isChangedFormFlag = false;

  } // createForm


  // проверка наименования новой категории услуг на совпадение с уже зарегистрированными
  checkingExisting(servicesCategoryName: string): void {

    // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных
    this.component.errorRegisteredServicesCategoryName.isRegistered =
      this.component.allServicesCategories.some((servicesCategory: ServicesCategory) =>
        servicesCategory.name.toLowerCase() === servicesCategoryName.toLowerCase());

  } // checkingExisting


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
  async ngOnDestroy(): Promise<void> {

    // отмена подписки
    this._languageSubscription.unsubscribe();

  } // ngOnDestroy

} // class ServiceFormComponent
// ----------------------------------------------------------------------------
