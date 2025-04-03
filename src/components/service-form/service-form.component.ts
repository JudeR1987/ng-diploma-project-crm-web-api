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
  protected readonly editService: string   = Literals.editService;
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

    console.log(`[-ServiceFormComponent-constructor--`);

    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут и значение режима создания/изменения данных об услуге
    let items: string[] = this._router.url.slice(1).split(Literals.slash);
    console.log(`*- items -*`);
    console.dir(items);

    this.component.route = items[0];
    console.log(`*- this.component.route = '${this.component.route}' -*`);

    this.component.route_mode = items[1].split(Literals.question)[0];
    console.log(`*- this.component.route_mode = '${this.component.route_mode}' -*`);

    console.log(`*-this._mode: '${this._mode}' -*`);
    console.log(`*-this._companyId: '${this._companyId}' -*`);
    console.log(`*-this._servicesCategoryId: '${this._servicesCategoryId}' -*`);
    console.log(`*-this._serviceId: '${this._serviceId}' -*`);
    console.log(`*-this.service-*`);
    console.dir(this.service);

    // отключить список выбора категории услуг
    this.servicesCategoryId.disable();

    // отключить чек-бокс включения режима ввода новой категории услуг
    this.isNewServicesCategory.disable();

    // отключить поле ввода наименования новой категории услуг
    this.newServicesCategoryName.disable();

    console.log(`--ServiceFormComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-ServiceFormComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // в заголовке установить значение по умолчанию
    this.component.title = Resources.serviceFormTitleDefault[this.component.language];

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-ServiceFormComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--ServiceFormComponent-subscribe-]`);
      }); // subscribe

    // получить данные о пользователе из сервиса-хранилища
    /*let user: User = this._userService.user;
    console.log(`*-(было)-this._userId: '${this._userId}'-*`);
    this._userId = user.id;
    console.log(`*-(стало)-this._userId: '${this._userId}' -*`);*/


    // получить параметры маршрута
    console.dir(this._activatedRoute);
    console.dir(this._activatedRoute.params);
    console.dir(this._activatedRoute.queryParams);
    let mode: string = Literals.empty;
    let companyId: number = 0;
    let servicesCategoryId: number = 0;
    let serviceId: number = 0;
    // подписка на получение результата перехода по маршруту (данные из маршрута)
    this._activatedRoute.params.subscribe(params => {

      // параметр о режиме создания/изменения, полученный из маршрута
      mode = params[Literals.mode];
      console.log(`*-mode: '${mode}' [${typeof mode}] -*`);

      console.log(`*-(было)-this._mode: '${this._mode}' -*`);
      this._mode = mode;
      console.log(`*-(стало)-this._mode: '${this._mode}' -*`);

    }); // subscribe

    // подписка на получение результата перехода по маршруту (данные из параметров маршрута)
    this._activatedRoute.queryParams.subscribe(params => {

      // параметр об Id выбранной компании
      console.log(`*-params['companyId']: '${params[Literals.companyId]}' -*`);
      companyId = params[Literals.companyId] != undefined
        ? +params[Literals.companyId]
        : 0;
      console.log(`*-companyId: '${companyId}' [${typeof companyId}] -*`);

      console.log(`*-(было)-this._companyId: '${this._companyId}' -*`);
      this._companyId = companyId;
      console.log(`*-(стало)-this._companyId: '${this._companyId}' -*`);

      // параметр об Id выбранной категории услуг
      console.log(`*-params['servicesCategoryId']: '${params[Literals.servicesCategoryId]}' -*`);
      servicesCategoryId = params[Literals.servicesCategoryId] != undefined
        ? +params[Literals.servicesCategoryId]
        : 0;
      console.log(`*-servicesCategoryId: '${servicesCategoryId}' [${typeof servicesCategoryId}] -*`);

      console.log(`*-(было)-this._servicesCategoryId: '${this._servicesCategoryId}' -*`);
      this._servicesCategoryId = servicesCategoryId;
      console.log(`*-(стало)-this._servicesCategoryId: '${this._servicesCategoryId}' -*`);

      // параметр об Id выбранной услуги
      console.log(`*-params['serviceId']: '${params[Literals.serviceId]}' -*`);
      serviceId = params[Literals.serviceId] != undefined
        ? +params[Literals.serviceId]
        : 0;
      console.log(`*-serviceId: '${serviceId}' [${typeof serviceId}] -*`);

      console.log(`*-(было)-this._serviceId: '${this._serviceId}' -*`);
      this._serviceId = serviceId;
      console.log(`*-(стало)-this._serviceId: '${this._serviceId}' -*`);

    }); // subscribe


    // проверки на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)

    // если параметр пользователя отсутствует,
    // требуется перейти на страницу "NotFound"
    /*console.log(`*-this._userId: '${this._userId}' -*`);
    if (this._userId === this.zero) {
      console.log(`*- Переход на "NotFound" - 'TRUE' -*`);

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectUserIdData[this.component.language]);

        console.log(`--ServiceFormComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "NotFound" - 'FALSE' -*`);*/

    // если Id компании НЕ добавлен, требуется перейти на страницу "NotFound"
    console.log(`*-this._mode: '${this._mode}' -*`);
    console.log(`*-this._companyId: '${this._companyId}' -*`);
    console.log(`*-this._servicesCategoryId: '${this._servicesCategoryId}' -*`);
    console.log(`*-this._serviceId: '${this._serviceId}' -*`);
    if (this._companyId === this.zero) {
      console.log(`*- Переход на "NotFound" - 'TRUE' -*`);

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectCompanyIdData[this.component.language]);

        console.log(`--ServiceFormComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "NotFound" - 'FALSE' -*`);


    // если в режиме создания добавлен Id услуги ИЛИ
    // в режиме изменения Id услуги НЕ добавлен,
    // требуется перейти на страницу "NotFound"
    if ((this._mode === Literals.createService && this._serviceId > this.zero) ||
      (this._mode === Literals.editService && this._serviceId === this.zero)) {
      console.log(`*- Переход на "NotFound" - 'TRUE' -*`);

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(this._mode === Literals.createService
            ? Resources.serviceFormCreateServiceIncorrectData[this.component.language]
            : Resources.serviceFormEditServiceIncorrectData[this.component.language]);

        console.log(`--ServiceFormComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "NotFound" - 'FALSE' -*`);


    // установим объекту услуги идентификатор
    console.log(`*-(было)-this.service.id: '${this.service.id}' -*`);
    this.service.id = this._serviceId;
    console.log(`*-(стало)-this.service.id: '${this.service.id}' -*`);

    console.log(`*-(было)-this.service: -*`);
    console.dir(this.service);

    // при режиме изменения! во время загрузки компонента
    // отправить запрос на получение данных об изменяемой услуге
    console.log(`*-this._mode: '${this._mode}' -*`);
    if (this._mode === Literals.editService) {
      console.log(`*- получить услугу с ID=${this._serviceId} -*`);

      // запрос на получение записи об услуге из БД для изменения
      await this.requestGetServiceById();

      // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
      if (this.service.id === this.zero) {
        console.log(`*- Переход на "Home" - 'TRUE' -*`);

        // "отключить" удаление временных папок с временными
        // изображениями при уничтожении компонента
        // this.component.isChangedFlag = true;

        // перейти по маршруту на главную страницу
        this._router.navigateByUrl(Literals.routeHomeEmpty).then((e) => {
          console.log(`*- переход: ${e} -*`);

          console.log(`--ServiceFormComponent-ngOnInit-]`);
        }); // navigateByUrl

        return;
      } // if
      console.log(`*- Переход на "Home" - 'FALSE' -*`);

    } /*else {
      console.log(`*- задать параметры для новой компании -*`);

      // задать путь к файлу с изображением логотипа по умолчанию
      this.company.logo = Literals.pathLogoDef;

      // задать путь к файлу с основным изображением компании по умолчанию
      this.company.titleImage = Literals.pathTitleImageDef;

    }*/ // if

    console.log(`*-(стало)-this.service: -*`);
    console.dir(this.service);

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);

    // после получения данных об услуге отправить запрос на получение коллекции
    // категорий услуг для списка выбора в форме создания/изменения данных об услуге
    await this.requestGetAllServicesCategories();

    // создание объектов полей ввода и формы создания/изменения данных об услуге
    this.createFormControls();
    this.createForm();

    console.log(`--ServiceFormComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-ServiceFormComponent-changeLanguageLiterals--`);

    console.log(`*-input(пришло)-language='${language}'-*`);
    console.log(`*-(было)-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-(стало)-this.component.language='${this.component.language}'-*`);

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
    /*this.component.labelCompanyName              = Resources.labelName[this.component.language];
    this.component.labelCity                     = Resources.labelCity[this.component.language];
    this.component.labelStreetName               = Resources.labelStreetName[this.component.language];
    this.component.labelBuilding                 = Resources.labelBuilding[this.component.language];
    this.component.labelPhone                    = Resources.labelPhone[this.component.language];
    this.component.firstOptionCities             = Resources.firstOptionCities[this.component.language];
    this.component.labelDescription              = Resources.companyFormLabelDescription[this.component.language];
    this.component.labelSchedule                 = Resources.companyFormLabelSchedule[this.component.language];
    this.component.labelSite                     = Resources.companyFormLabelSite[this.component.language];
    this.component.streetNamePlaceholder         = Resources.companyFormStreetNamePlaceholder[this.component.language];
    this.component.buildingPlaceholder           = Resources.companyFormBuildingPlaceholder[this.component.language];
    this.component.companyDescriptionPlaceholder = Resources.companyFormCompanyDescriptionPlaceholder[this.component.language];
    this.component.errorCompanyNameMaxLengthTitle
      = Resources.errorNameMaxLength(this.component.language, this.component.companyNameLength);
    this.component.errorPhoneValidatorTitle      = Resources.errorPhoneValidator[this.component.language];
    this.component.errorScheduleMaxLengthTitle
      = Resources.companyFormErrorScheduleMaxLength(this.component.language, this.component.scheduleLength);
    this.component.errorSiteMaxLengthTitle
      = Resources.companyFormErrorSiteMaxLength(this.component.language, this.component.siteLength);
    this.component.errorCitySelectedZeroValidatorTitle    = Resources.companyFormErrorCitySelectedZeroValidator[this.component.language];
    this.component.errorStreetNameMaxLengthTitle
      = Resources.companyFormErrorStreetNameMaxLength(this.component.language, this.component.streetNameLength);
    this.component.errorBuildingMaxLengthTitle
      = Resources.companyFormErrorBuildingMaxLength(this.component.language, this.component.buildingLength);
    this.component.logoTitle = this._companyId === Literals.zero
      ? Resources.companyFormCreateLogoTitle[this.component.language]
      : Resources.companyFormEditLogoTitleWithCompanyName(this.component.language, this.company.name);
    this.component.titleImageTitle = this._companyId === Literals.zero
      ? Resources.companyFormCreateTitleImageTitle[this.component.language]
      : Resources.companyFormEditTitleImageTitleWithCompanyName(this.component.language, this.company.name);
    this.component.labelInputImageLogo           = Resources.companyFormLabelInputImageLogo[this.component.language];
    this.component.labelInputImageTitleImage     = Resources.companyFormLabelInputImageTitleImage[this.component.language];
    this.component.labelNewLogoFileName          = Resources.labelNewFileName[this.component.language];
    this.component.labelNewTitleImageFileName    = Resources.labelNewFileName[this.component.language];
    this.component.labelFileNotSelected          = Resources.labelFileNotSelected[this.component.language];
    this.component.butNewLogoFileNameTitle       = Resources.companyFormButNewLogoFileNameTitle[this.component.language];
    this.component.butNewLogoFileNameValue       = Resources.butNewFileNameValue[this.component.language];
    this.component.butNewTitleImageFileNameTitle = Resources.companyFormButNewTitleImageFileNameTitle[this.component.language];
    this.component.butNewTitleImageFileNameValue = Resources.butNewFileNameValue[this.component.language];*/
    /*this.component.labelUserName                  = Resources.userFormLabelUserName[this.component.language];
    this.component.labelEmail                     = Resources.labelEmail[this.component.language];
    this.component.errorRegisteredPhone.message   = Resources.registeredPhone[this.component.language];
    this.component.errorRegisteredEmail.message   = Resources.registeredEmail[this.component.language];
    this.component.errorEmailMaxLengthTitle       = Resources.errorEmailMaxLength(this.component.language, this.component.emailLength);
    this.component.errorEmailValidatorTitle       = Resources.errorEmailValidator[this.component.language];
    this.component.phoneNoErrorsTitle             = Resources.phoneNoErrors[this.component.language];
    this.component.labelInputImage                = Resources.userFormLabelInputImage[this.component.language];
    this.component.labelNewFileName               = Resources.userFormLabelNewFileName[this.component.language];
    this.component.labelFileNotSelected           = Resources.userFormLabelFileNotSelected[this.component.language];
    this.component.labelCheckboxDeletingFlag      = Resources.userFormLabelCheckboxDeletingFlag[this.component.language];
    this.component.butDeleteUserTitle             = Resources.userFormButDeleteUserTitle[this.component.language];
    this.component.butDeleteUserValue             = Resources.userFormButDeleteUserValue[this.component.language];
    this.component.titleConfirmation              = Resources.titleAttention[this.component.language];
    this.component.messageConfirmation            = Resources.userFormMessageConfirmation[this.component.language];
    this.component.butConfirmedOkTitle            = Resources.userFormButConfirmedOkTitle[this.component.language];
    this.component.butConfirmedOkValue            = Resources.userFormButConfirmedOkValue[this.component.language];
    this.component.butConfirmedCancelTitle        = Resources.userFormButConfirmedCancelTitle[this.component.language];
    this.component.butConfirmedCancelValue        = Resources.userFormButConfirmedCancelValue[this.component.language];
*/
    console.log(`--ServiceFormComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение записи об услуге из БД для изменения
  async requestGetServiceById(): Promise<void> {
    console.log(`[-ServiceFormComponent-requestGetServiceById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ServiceFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ServiceFormComponent-requestGetServiceById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ServiceFormComponent-1-(запрос на получение услуги)-`);

    // запрос на получение записи об услуге
    let result: { message: any, service: Service } =
      { message: Literals.Ok, service: new Service() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetServiceById, this._serviceId, token)
      );
      console.dir(webResult);

      result.service = Service.newService(webResult.service);

    } catch (e: any) {

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

    console.log(`--ServiceFormComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.service);

    console.log(`--ServiceFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.serviceId: '${result.message.serviceId}'`);
      if (result.message.serviceId != undefined)
        message = result.message.serviceId === this.zero
          ? Resources.incorrectServiceIdData[this.component.language]
          : Resources.notRegisteredServiceIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);

      // при ошибках установить услуге нулевой идентификатор
      this.service.id = this.zero;

    } else {

      // присвоить значение полученных данных
      this.service = result.service;

    } // if

    console.log(`--ServiceFormComponent-requestGetServiceById-]`);
  } // requestGetServiceById


  // запрос на получение коллекции категорий услуг для списка
  // выбора в форме создания/изменения данных об услуге
  async requestGetAllServicesCategories(): Promise<void> {
    console.log(`[-ServiceFormComponent-requestGetAllServicesCategories--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ServiceFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ServiceFormComponent-requestGetAllServicesCategories-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ServiceFormComponent-1-(запрос на получение категорий услуг)-`);

    // запрос на получение коллекции категорий услуг
    let result: { message: any, allServicesCategories: ServicesCategory[] } =
      { message: Literals.Ok, allServicesCategories: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(
        this._webApiService.get(Config.urlGetAllServicesCategories, token)
      );
      console.dir(webResult);

      result.allServicesCategories = ServicesCategory
        .parseServicesCategories(webResult.allServicesCategories);

    } catch (e: any) {

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

    console.log(`--ServiceFormComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.allServicesCategories);

    console.log(`--ServiceFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      /* --- */

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // изменить результат на сообщение для вывода
      result.message = message;

    } else {
      // иначе - сообщение об успехе
      result.message = Resources.formParamsOkData[this.component.language];

      // присвоить значения полученных данных
      this.component.allServicesCategories = result.allServicesCategories;
      console.log(`*- this.component.allServicesCategories: -*`);
      console.dir(this.component.allServicesCategories);

      // создать массив данных для списка выбора
      this.component.servicesCategoriesList = ServicesCategory
        .parseServicesCategoriesToSelect(this.component.allServicesCategories);
      console.log(`*- this.component.servicesCategoriesList: -*`);
      console.dir(this.component.servicesCategoriesList);

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

    console.log(`--ServiceFormComponent-requestGetAllServicesCategories-]`);
  } // requestGetAllServicesCategories


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {
    console.log(`[-ServiceFormComponent-onSubmit--`);

    console.log("Отправка данных на сервер");
    console.dir(this.serviceForm.value);
    console.log(`*- this.serviceForm.valid = '${this.serviceForm.valid}' -*`);

    // задать значения параметров запроса

    // 1) наименование услуги
    console.log(`*-(было)-this.service.name = '${this.service.name}' -*`);
    this.service.name = this.serviceName.value;
    console.log(`*-(стало)-this.service.name = '${this.service.name}' -*`);


    // 2) данные о категории услуг
    console.log(`*- this.servicesCategoryId.value: '${this.servicesCategoryId.value} [${typeof this.servicesCategoryId.value}]' -*`);
    console.log(`*- this.isNewServicesCategory.value: '${this.isNewServicesCategory.value} [${typeof this.isNewServicesCategory.value}]' -*`);
    console.log(`*- this.newServicesCategoryName.value: '${this.newServicesCategoryName.value} [${typeof this.newServicesCategoryName.value}]' -*`);

    let servicesCategoryId: number = +this.servicesCategoryId.value;
    console.log(`*- servicesCategoryId: '${servicesCategoryId} [${typeof servicesCategoryId}]' -*`);

    // получить выбранную категорию услуг
    let servicesCategory: ServicesCategory = this.isNewServicesCategory.value
      ? new ServicesCategory(this.zero, this.newServicesCategoryName.value, null)
      : this.component.allServicesCategories
        .find((servicesCategory: ServicesCategory) => servicesCategory.id === servicesCategoryId) ?? new ServicesCategory();
    console.log(`*- servicesCategory: -*`);
    console.dir(servicesCategory);
    console.log(`*-(было)-this.service.servicesCategory: -*`);
    console.dir(this.service.servicesCategory);
    this.service.servicesCategory = servicesCategory;
    console.log(`*-(стало)-this.service.servicesCategory: -*`);
    console.dir(this.service.servicesCategory);


    // 3) данные о компании, для которой услуга определена
    console.log(`*-(было)-this.service.companyId = '${this.service.companyId}' -*`);
    this.service.companyId = this._companyId;
    console.log(`*-(стало)-this.service.companyId = '${this.service.companyId}' -*`);


    // 4) данные о минимальной цене на услугу
    console.log(`*- this.priceMin.value: '${this.priceMin.value} [${typeof this.priceMin.value}]' -*`);
    console.log(`*-(было)-this.service.priceMin = '${this.service.priceMin}' -*`);
    this.service.priceMin = +this.priceMin.value;
    console.log(`*-(стало)-this.service.priceMin = '${this.service.priceMin}' -*`);


    // 5) данные о максимальной цене на услугу
    console.log(`*- this.priceMax.value: '${this.priceMax.value} [${typeof this.priceMax.value}]' -*`);
    console.log(`*-(было)-this.service.priceMax = '${this.service.priceMax}' -*`);
    this.service.priceMax = +this.priceMax.value;
    console.log(`*-(стало)-this.service.priceMax = '${this.service.priceMax}' -*`);


    // 6) данные о длительности услуги
    console.log(`*- this.duration.value: '${this.duration.value} [${typeof this.duration.value}]' -*`);
    console.log(`*-(было)-this.service.duration = '${this.service.duration}' -*`);
    this.service.durationFromMinutes = +this.duration.value;
    console.log(`*-(стало)-this.service.duration = '${this.service.duration}' -*`);


    // 7) комментарий к услуге
    console.log(`*- this.comment.value: '${this.comment.value} [${typeof this.comment.value}]' -*`);
    console.log(`*-(было)-this.service.comment = '${this.service.comment}' -*`);
    this.service.comment = this.comment.value === Literals.empty
      ? null
      : this.comment.value;
    console.log(`*-(стало)-this.service.comment = '${this.service.comment}' -*`);

    console.log(`*- this.service: -*`);
    console.dir(this.service);


    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ServiceFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ServiceFormComponent-onSubmit-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ServiceFormComponent-1-(запрос на создание/изменение)-`);

    // запрос на создание/изменение данных об услуге
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(
        this._serviceId === Literals.zero
          ? this._webApiService.createServicePUT(Config.urlCreateService, this.service, token)
          : this._webApiService.editServicePOST(Config.urlEditService, this.service, token)
      );
      console.dir(webResult);

    } catch (e: any) {

      console.dir(e);
      console.dir(e.error);

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null) {
        console.log(`*- отработал [Authorize] -*`);
        result = Resources.unauthorizedUserIdData[this.component.language]
      }
      // другие ошибки
      else
        result = e.error;

    } // try-catch

    console.log(`--ServiceFormComponent-result:`);
    console.dir(result);

    console.log(`--ServiceFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.serviceId: '${result.serviceId}'`);
      if (result.serviceId != undefined)
        message = result.serviceId === this.zero
          ? Resources.incorrectServiceIdData[this.component.language] // 'некорректные данные об услуге салона'
          : Resources.notRegisteredServiceIdData[this.component.language]; // 'услуга не найдена'

      console.log(`--result.servicesCategoryId: '${result.servicesCategoryId}'`);
      if (result.servicesCategoryId === this.zero)
        message = Resources.notRegisteredServicesCategoryIdData[this.component.language]; //'категория услуг не найдена'

      console.log(`--result.companyId: '${result.companyId}'`);
      if (result.companyId === this.zero)
        message = Resources.incorrectCompanyIdData[this.component.language]; // 'некорректные данные о салоне'

      // ошибки сервера
      console.log(`--result.title: '${result.title}'`);
      if (result.title != undefined) message = result.title;

      console.log(`--result.createMessage: '${result.createMessage}'`);
      if (result.createMessage != undefined) message = result.createMessage;

      console.log(`--result.updateMessage: '${result.updateMessage}'`);
      if (result.updateMessage != undefined) message = result.updateMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;

      // сбросить флаг изменений данных в форме
      console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
      this.component.isChangedFormFlag = false;
      console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

      // переход в начало страницы
      Utils.toStart();

    } else {
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

    console.log(`--ServiceFormComponent-onSubmit-]`);
  } // onSubmit


  // создание объектов полей ввода формы создания/изменения данных об услуге
  createFormControls(): void {
    console.log(`[-ServiceFormComponent-createFormControls--`);

    // поле выбора категории услуг салона
    this.servicesCategoryId = new FormControl(
      // начальное значение
      this._mode === this.createService
        ? this._servicesCategoryId
        : this.service.servicesCategory.id,
      // синхронные валидаторы
      [
        /*Validators.required,*/
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
        /*Validators.required,*/
        Validators.maxLength(this.component.commentLength)
      ]
    );


    // подписка на изменения в поле выбора категории услуг салона
    this.servicesCategoryId.valueChanges.subscribe((servicesCategoryId: number) => {
      console.log(`[-ServiceFormComponent-this.servicesCategoryId.valueChanges.subscribe--`);
      console.log(`*- при выборе категории ... -*`);

      // сменим тип данных на параметре выбора Id категории услуг
      console.log(`*- servicesCategoryId: '${servicesCategoryId}' [${typeof servicesCategoryId}]`);
      servicesCategoryId = +servicesCategoryId;
      console.log(`*- servicesCategoryId: '${servicesCategoryId}' [${typeof servicesCategoryId}]`);

      console.log(`--ServiceFormComponent-this.servicesCategoryId.valueChanges.subscribe-]`);
    }); // subscribe


    // подписка на изменения в чек-боксе включения режима ввода наименования новой категории услуг
    this.isNewServicesCategory.valueChanges.subscribe((data: boolean) => {
      console.log(`[-ServiceFormComponent-this.isNewServicesCategory.valueChanges.subscribe--`);

      console.log(`*- this.isNewServicesCategory.value: '${this.isNewServicesCategory.value}' -*`);
      console.log(`*- data: '${data}' -*`);

      // если чек-бокс отмечен - включить поле ввода
      if (data) {

        // отключить список выбора
        console.log(`*-(было)- this.servicesCategoryId.disabled: '${this.servicesCategoryId.disabled}' -*`);
        this.servicesCategoryId.disable();
        console.log(`*-(стало)- this.servicesCategoryId.disabled: '${this.servicesCategoryId.disabled}' -*`);

        // включить поле ввода наименования новой категории услуг
        console.log(`*-(было)- this.newServicesCategoryName.enabled: '${this.newServicesCategoryName.enabled}' -*`);
        this.newServicesCategoryName.enable();
        console.log(`*-(стало)- this.newServicesCategoryName.enabled: '${this.newServicesCategoryName.enabled}' -*`);

      } else { // иначе - включить список

        // включить список выбора
        console.log(`*-(было)- this.servicesCategoryId.enabled: '${this.servicesCategoryId.enabled}' -*`);
        this.servicesCategoryId.enable();
        console.log(`*-(стало)- this.servicesCategoryId.enabled: '${this.servicesCategoryId.enabled}' -*`);

        // отключить поле ввода наименования новой категории услуг
        console.log(`*-(было)- this.newServicesCategoryName.disabled: '${this.newServicesCategoryName.disabled}' -*`);
        this.newServicesCategoryName.disable();
        console.log(`*-(стало)- this.newServicesCategoryName.disabled: '${this.newServicesCategoryName.disabled}' -*`);

      } // if

      // в поле ввода задать пустое значение
      console.log(`*-(было)- this.newServicesCategoryName.value: '${this.newServicesCategoryName.value}' -*`);
      this.newServicesCategoryName.setValue(Literals.empty);
      console.log(`*-(стало)- this.newServicesCategoryName.value: '${this.newServicesCategoryName.value}' -*`);

      console.log(`--ServiceFormComponent-this.newServicesCategoryName.valueChanges.subscribe-]`);
    }); // subscribe


    // подписка на изменения в поле ввода минимальной цены на услугу
    this.priceMin.valueChanges.subscribe((data: number) => {
      console.log(`[-ServiceFormComponent-this.priceMin.valueChanges.subscribe--`);

      console.log(`*- data: '${data}' [${typeof data}]`);

      // проверка вводимых значений, this.priceMin.value >= 0 !
      if (data < this.zero || data === null)
        this.priceMin.setValue(this.zero);

      console.log(`*- this.priceMin.value: '${this.priceMin.value}' [${typeof this.priceMin.value}]`);

      // проверка условия priceMin <= priceMax
      if (this.priceMin.value > this.priceMax.value) this.priceMax.setValue(data);

      console.log(`--ServiceFormComponent-this.priceMin.valueChanges.subscribe-]`);
    }); // subscribe


    // подписка на изменения в поле ввода максимальной цены на услугу
    this.priceMax.valueChanges.subscribe((data: number) => {
      console.log(`[-ServiceFormComponent-this.priceMax.valueChanges.subscribe--`);

      console.log(`*- data: '${data}' [${typeof data}]`);

      // проверка вводимых значений, this.priceMax.value >= 0 !
      if (data < this.zero || data === null)
        this.priceMax.setValue(this.zero);

      console.log(`*- this.priceMax.value: '${this.priceMax.value}' [${typeof this.priceMax.value}]`);

      // проверка условия priceMin <= priceMax
      if (this.priceMax.value < this.priceMin.value) this.priceMin.setValue(data);

      console.log(`--ServiceFormComponent-this.priceMax.valueChanges.subscribe-]`);
    }); // subscribe


    // подписка на изменения в поле ввода длительности услуги
    this.duration.valueChanges.subscribe((data: number) => {
      console.log(`[-ServiceFormComponent-this.duration.valueChanges.subscribe--`);

      console.log(`*- data: '${data}' [${typeof data}]`);

      // проверка вводимых значений, this.duration.value >= 0 !
      if (data < this.zero || data === null)
        this.duration.setValue(this.zero);

      console.log(`--ServiceFormComponent-this.duration.valueChanges.subscribe-]`);
    }); // subscribe

    console.log(`--ServiceFormComponent-createFormControls-]`);
  } // createFormControls


  // создание объекта формы создания/изменения данных об услуге
  createForm(): void {
    console.log(`[-ServiceFormComponent-createForm--`);

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
      console.log(`[-ServiceFormComponent-this.serviceForm.valueChanges.subscribe--`);
      console.dir(data);

      console.log(`*- this.servicesCategoryId.value: '${this.servicesCategoryId.value}' -*`);
      console.log(`*- data.servicesCategoryId: '${data.servicesCategoryId}' -*`);
      console.log(`*- this.isNewServicesCategory.value: '${this.isNewServicesCategory.value}' -*`);
      console.log(`*- data.isNewServicesCategory: '${data.isNewServicesCategory}' -*`);
      console.log(`*- this.newServicesCategoryName.value: '${this.newServicesCategoryName.value}' -*`);
      console.log(`*- data.newServicesCategoryName: '${data.newServicesCategoryName}' -*`);

      // если в поле ввода наименования новой категории услуг вводится запись, то
      // проводим проверку на совпадение с уже зарегистрированными категориями услуг
      if (data.isNewServicesCategory && data.newServicesCategoryName != undefined)
        this.checkingExisting(data.newServicesCategoryName);

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
      this.component.isChangedFormFlag = true;
      console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

      console.log(`--ServiceFormComponent-this.serviceForm.valueChanges.subscribe-]`);
    }); // subscribe


    // сбросить флаг изменений данных в форме
    console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
    this.component.isChangedFormFlag = false;
    console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

    console.log(`--ServiceFormComponent-createForm-]`);
  } // createForm


  // проверка наименования новой категории услуг на совпадение с уже зарегистрированными
  checkingExisting(servicesCategoryName: string): void {
    console.log(`[-ServiceFormComponent-checkingExisting--`);

    console.log(`*- servicesCategoryName: '${servicesCategoryName}' -*`);

    // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных
    this.component.errorRegisteredServicesCategoryName.isRegistered = this.component.allServicesCategories
      .some((servicesCategory: ServicesCategory) => servicesCategory.name.toLowerCase() === servicesCategoryName.toLowerCase());
    console.log(`*- this.component.errorRegisteredServicesCategoryName.isRegistered: '${this.component.errorRegisteredServicesCategoryName.isRegistered}' -*`);

    console.log(`--ServiceFormComponent-checkingExisting-]`);
  } // checkingExisting


  // метод выполнения/НЕ_выполнения обновления токена
  private async isRefreshToken(): Promise<boolean> {
    console.log(`Обновляем токен!`);

    // запрос на обновление токена
    let result: boolean;
    let message: any;
    [result, message] = await this._authGuardService.refreshToken();

    console.log(`--message: '${message}'`);

    // сообщение об успехе
    if (message === Literals.Ok)
      message = Resources.refreshTokenOk[this.component.language];

    // ошибки данных
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
  async ngOnDestroy(): Promise<void> {
    console.log(`[-ServiceFormComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--ServiceFormComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class ServiceFormComponent
// ----------------------------------------------------------------------------
