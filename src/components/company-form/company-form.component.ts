// ----------------------------------------------------------------------------
// компонент отображения формы создания/изменения компании
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ICompanyFormComponent} from '../../models/interfaces/ICompanyFormComponent';
import {Literals} from '../../infrastructure/Literals';
import {firstValueFrom, Subscription} from 'rxjs';
import {Company} from '../../models/classes/Company';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {WebApiService} from '../../services/web-api.service';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Utils} from '../../infrastructure/Utils';
import {Resources} from '../../infrastructure/Resources';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Config} from '../../infrastructure/Config';
import {UserValidators} from '../../validators/UserValidators';
import {FileUploadComponent} from '../file-upload/file-upload.component';
import {Country} from '../../models/classes/Country';
import {City} from '../../models/classes/City';
import {Street} from '../../models/classes/Street';
import {Address} from '../../models/classes/Address';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FileUploadComponent],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css'
})
export class CompanyFormComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: ICompanyFormComponent = {
    // параметры меняющиеся при смене языка
    title:                                  Literals.empty,
    labelCompanyName:                       Literals.empty,
    labelCountry:                           Literals.empty,
    labelCity:                              Literals.empty,
    labelNewCityName:                       Literals.empty,
    labelStreetName:                        Literals.empty,
    labelBuilding:                          Literals.empty,
    labelFlat:                              Literals.empty,
    labelPhone:                             Literals.empty,
    firstOptionCountries:                   Literals.empty,
    firstOptionCities:                      Literals.empty,
    labelDescription:                       Literals.empty,
    labelSchedule:                          Literals.empty,
    labelSite:                              Literals.empty,
    companyNamePlaceholder:                 Literals.empty,
    newCityNamePlaceholder:                 Literals.empty,
    streetNamePlaceholder:                  Literals.empty,
    buildingPlaceholder:                    Literals.empty,
    companyDescriptionPlaceholder:          Literals.empty,
    errorRequiredTitle:                     Literals.empty,
    errorCompanyNameMaxLengthTitle:         Literals.empty,
    errorPhoneValidatorTitle:               Literals.empty,
    errorCompanyDescriptionMaxLengthTitle:  Literals.empty,
    errorScheduleMaxLengthTitle:            Literals.empty,
    errorSiteMaxLengthTitle:                Literals.empty,
    errorCountrySelectedZeroValidatorTitle: Literals.empty,
    errorCitySelectedZeroValidatorTitle:    Literals.empty,
    errorNewCityNameMaxLengthTitle:         Literals.empty,
    errorRegisteredCity:                    {message: Literals.empty, isRegistered: false},
    errorStreetNameMaxLengthTitle:          Literals.empty,
    errorBuildingMaxLengthTitle:            Literals.empty,
    logoTitle:                              Literals.empty,
    titleImageTitle:                        Literals.empty,
    butCompanyCreateTitle:                  Literals.empty,
    butCompanyCreateValue:                  Literals.empty,
    butCompanyEditTitle:                    Literals.empty,
    butCompanyEditValue:                    Literals.empty,
    labelInputImageLogo:                    Literals.empty,
    labelInputImageTitleImage:              Literals.empty,
    labelNewLogoFileName:                   Literals.empty,
    labelNewTitleImageFileName:             Literals.empty,
    labelFileNotSelected:                   Literals.empty,
    butNewLogoFileNameTitle:                Literals.empty,
    butNewLogoFileNameValue:                Literals.empty,
    butNewTitleImageFileNameTitle:          Literals.empty,
    butNewTitleImageFileNameValue:          Literals.empty,
    labelCheckboxIsNewCity:                 Literals.empty,
    labelCheckboxIsNewCityTitle:            Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:                   Literals.empty,
    route:                      Literals.empty,
    route_mode:                 Literals.empty,
    isWaitFlag:                 false,
    isChangedFlag:              false,
    isDeletingFlag:             false,
    isConfirmedFlag:            false,
    isChangedFormFlag:          false,
    phonePlaceholder:           Literals.phonePlaceholder,
    schedulePlaceholder:        Literals.companySchedulePlaceholder,
    sitePlaceholder:            Literals.companySitePlaceholder,
    companyNameLength:          Literals.companyNameLength,
    newCityNameLength:          Literals.companyNewCityNameLength,
    streetNameLength:           Literals.companyFormStreetLength,
    buildingLength:             Literals.companyFormBuildingLength,
    phoneLength:                Literals.phoneLength,
    companyDescriptionLength:   Literals.companyDescriptionLength,
    scheduleLength:             Literals.companyScheduleLength,
    siteLength:                 Literals.companySiteLength,
    errorRequired:              Literals.required,
    errorMaxLength:             Literals.maxlength,
    errorPhoneValidator:        Literals.phoneValidator,
    errorSelectedZeroValidator: Literals.selectedZeroValidator,
    newLogoFileName:            Literals.empty,
    newTitleImageFileName:      Literals.empty,
    logoSizeImage:              Literals.companyFormLogoSizeImage,
    titleImageSizeImage:        Literals.companyFormTitleImageSizeImage,
    allCountries:               [],
    countriesList:              [],
    allCities:                  [],
    citiesList:                 [],
    allStreets:                 []
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения об Id пользователя для создания/изменения сведений о компании
  private _userId: number = Literals.zero;

  // режим создания/изменения сведений о компании
  private _mode: string = Literals.empty;

  // сведения об Id компании для изменения
  private _companyId: number = Literals.zero;

  // сведения о компании для создания/изменения
  public company: Company = new Company();


  // поле ввода названия компании
  public companyName: FormControl = new FormControl();

  // поле выбора страны расположения компании
  public countryId: FormControl = new FormControl(Literals.zero);

  // поле выбора города расположения компании
  public cityId: FormControl = new FormControl(Literals.zero);

  // поле включения режима ввода нового города
  public isNewCity: FormControl = new FormControl();

  // поле ввода названия нового города
  public newCityName: FormControl = new FormControl();

  // поле ввода названия улицы расположения компании
  public streetName: FormControl = new FormControl();

  // поле ввода номера дома/строения расположения компании
  public building: FormControl = new FormControl();

  // поле ввода номера квартиры/офиса расположения компании
  public flat: FormControl = new FormControl();

  // поле ввода номера телефона компании
  public companyPhone: FormControl = new FormControl();

  // поле ввода графика работы компании
  public schedule: FormControl = new FormControl();

  // поле ввода сайта компании
  public site: FormControl = new FormControl();

  // поле ввода описания компании
  public companyDescription: FormControl = new FormControl();

  // объект формы создания/изменения данных о компании
  public companyForm: FormGroup = new FormGroup<any>({
    companyName:        this.companyName,
    countryId:          this.countryId,
    cityId:             this.cityId,
    isNewCity:          this.isNewCity,
    newCityName:        this.newCityName,
    streetName:         this.streetName,
    building:           this.building,
    flat:               this.flat,
    companyPhone:       this.companyPhone,
    schedule:           this.schedule,
    site:               this.site,
    companyDescription: this.companyDescription
  });

  // свойство для ограничения отображения элементов разметки
  protected readonly zero: number     = Literals.zero;
  protected readonly one: number      = Literals.one;
  protected readonly logo: string     = Literals.logo;
  protected readonly image: string    = Literals.image;
  protected readonly flatMax: number  = Literals.companyFormFlatMax;


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
    Utils.helloComponent(Literals.companyForm);

    // получить маршрут и значение режима создания/изменения данных о компании
    let items: string[] = this._router.url.slice(1).split(Literals.slash);
    this.component.route = items[0];
    this.component.route_mode = items[1];

    // отключить списки выбора
    this.countryId.disable();
    this.cityId.disable();

    // отключить чек-бокс включения режима ввода нового города
    this.isNewCity.disable();

    // отключить поле ввода названия нового города
    this.newCityName.disable();

    // отключить поле ввода названия улицы расположения компании
    this.streetName.disable();

    // отключить поле ввода номера дома/строения расположения компании
    this.building.disable();

    // отключить поле ввода номера квартиры/офиса расположения компании
    this.flat.disable();

  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);

    // в заголовке установить значение по умолчанию
    this.component.title = Resources.companyFormTitleDefault[this.component.language];

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

      }); // subscribe

    // получить данные о пользователе из сервиса-хранилища
    this._userId = this._userService.user.id;


    // получить параметры маршрута
    let mode: string = Literals.empty;
    let companyId: number = 0;
    // подписка на получение результата перехода по маршруту
    this._activatedRoute.params.subscribe(params => {

      // параметр о режиме создания/изменения, полученный из маршрута
      mode = params[Literals.mode];
      this._mode = mode;

      // параметр об Id компании для изменения
      companyId = params[Literals.id] != undefined
        ? +params[Literals.id]
        : 0;
      this._companyId = companyId;

    }); // subscribe


    // проверки на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)

    // если параметр пользователя отсутствует,
    // требуется перейти на страницу "NotFound"
    if (this._userId === this.zero) {

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectUserIdData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if

    // если в режиме создания добавлен Id компании ИЛИ
    // в режиме изменения Id компании НЕ добавлен,
    // требуется перейти на страницу "NotFound"
    if ((this._mode === Literals.createCompany && this._companyId > this.zero) ||
      (this._mode === Literals.editCompany && this._companyId === this.zero)) {

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(this._mode === Literals.createCompany
            ? Resources.companyFormCreateCompanyIncorrectData[this.component.language]
            : Resources.companyFormEditCompanyIncorrectData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // установим объекту компании идентификатор
    this.company.id = this._companyId;

    // при режиме изменения! во время загрузки компонента
    // отправить запрос на получение данных об изменяемой компании
    if (this._mode === Literals.editCompany) {

      // запрос на получение записи о компании из БД для изменения
      await this.requestGetCompanyById();

      // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
      if (this.company.id === this.zero) {

        // "отключить" удаление временных папок с временными
        // изображениями при уничтожении компонента
        this.component.isChangedFlag = true;

        // перейти по маршруту на главную страницу
        this._router.navigateByUrl(Literals.routeHomeEmpty)
          .then((e) => { console.log(`*- переход: ${e} -*`); });

        return;
      } // if
    }
    else {
      // задать путь к файлу с изображением логотипа по умолчанию
      this.company.logo = Literals.pathLogoDef;

      // задать путь к файлу с основным изображением компании по умолчанию
      this.company.titleImage = Literals.pathTitleImageDef;

    } // if

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);


    // при загрузке компонента отправить запрос на удаление
    // временных папок со всеми временными изображениями компании
    await this.requestDeleteTempCompanyImages(this.logo);
    await this.requestDeleteTempCompanyImages(this.image);


    // после получения данных о компании отправить запрос
    // на получение параметров формы создания/изменения данных о компании
    await this.requestGetCompanyFormParams();

    // создание объектов полей ввода/выбора и формы создания/изменения данных о компании
    this.createFormControls();
    this.createForm();

  } // ngOnInit


  // запрос на получение записи о компании из БД для изменения
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
        this._webApiService.getById(Config.urlGetCompanyById, this._companyId, token)
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

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
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


  // запрос на получение параметров формы создания/изменения данных о компании
  async requestGetCompanyFormParams(): Promise<void> {

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

    // запрос на получение параметров формы создания/изменения сведений о салоне
    let result: { message: any, allCountries: Country[], allCities: City[], allStreets: Street[] } =
      { message: Literals.Ok, allCountries: [], allCities: [], allStreets: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.get(Config.urlGetCompanyFormParams, token)
      );

      result.allCountries = Country.parseCountries(webResult.allCountries);
      result.allCities    = City.parseCities(webResult.allCities);
      result.allStreets   = Street.parseStreets(webResult.allStreets);
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
      // страны
      this.component.allCountries = result.allCountries;

      // города
      this.component.allCities = result.allCities;

      // улицы
      this.component.allStreets = result.allStreets;

      // создать массивы данных для списков выбора
      // страны
      this.component.countriesList = Country.parseCountriesToSelect(this.component.allCountries);

      // только в режиме изменения данных
      if (this._mode == Literals.editCompany) {

        // города
        // выбрать города, соответствующие выбранной стране
        let cities: City[] = this.component.allCities
          .filter((city: City) => city.country.id === this.company.address.city.country.id);

        // преобразовать полученную коллекцию в массив объектов для списка выбора
        this.component.citiesList = City.parseCitiesToSelect(cities);

      } // if

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

  } // requestGetCompanyFormParams


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title = this._companyId === Literals.zero
      ? Resources.companyFormCreateTitle[this.component.language]
      : Resources.companyFormEditTitleWithCompanyName(this.component.language, this.company.name);
    this.component.labelCompanyName              = Resources.labelName[this.component.language];
    this.component.labelCountry                  = Resources.labelCountry[this.component.language];
    this.component.labelCity                     = Resources.labelCity[this.component.language];
    this.component.labelNewCityName              = Resources.companyFormLabelNewCityName[this.component.language];
    this.component.labelStreetName               = Resources.labelStreetName[this.component.language];
    this.component.labelBuilding                 = Resources.labelBuilding[this.component.language];
    this.component.labelFlat                     = Resources.labelFlat[this.component.language];
    this.component.labelPhone                    = Resources.labelPhone[this.component.language];
    this.component.firstOptionCountries          = Resources.firstOptionCountries[this.component.language];
    this.component.firstOptionCities             = Resources.firstOptionCities[this.component.language];
    this.component.labelDescription              = Resources.companyFormLabelDescription[this.component.language];
    this.component.labelSchedule                 = Resources.companyFormLabelSchedule[this.component.language];
    this.component.labelSite                     = Resources.companyFormLabelSite[this.component.language];
    this.component.companyNamePlaceholder        = Resources.companyFormCompanyNamePlaceholder[this.component.language];
    this.component.newCityNamePlaceholder        = Resources.companyFormNewCityNamePlaceholder[this.component.language];
    this.component.streetNamePlaceholder         = Resources.companyFormStreetNamePlaceholder[this.component.language];
    this.component.buildingPlaceholder           = Resources.companyFormBuildingPlaceholder[this.component.language];
    this.component.companyDescriptionPlaceholder = Resources.companyFormCompanyDescriptionPlaceholder[this.component.language];
    this.component.errorRequiredTitle            = Resources.errorRequired[this.component.language];
    this.component.errorCompanyNameMaxLengthTitle
      = Resources.errorTitleMaxLength(this.component.language, this.component.companyNameLength);
    this.component.errorPhoneValidatorTitle      = Resources.errorPhoneValidator[this.component.language];
    this.component.errorCompanyDescriptionMaxLengthTitle
      = Resources.errorDescriptionMaxLength(this.component.language, this.component.companyDescriptionLength);
    this.component.errorScheduleMaxLengthTitle
      = Resources.companyFormErrorScheduleMaxLength(this.component.language, this.component.scheduleLength);
    this.component.errorSiteMaxLengthTitle
      = Resources.companyFormErrorSiteMaxLength(this.component.language, this.component.siteLength);
    this.component.errorCountrySelectedZeroValidatorTitle = Resources.companyFormErrorCountrySelectedZeroValidator[this.component.language];
    this.component.errorCitySelectedZeroValidatorTitle    = Resources.companyFormErrorCitySelectedZeroValidator[this.component.language];
    this.component.errorNewCityNameMaxLengthTitle
      = Resources.companyFormErrorNewCityNameMaxLength(this.component.language, this.component.newCityNameLength);
    this.component.errorRegisteredCity.message   = Resources.companyFormErrorRegisteredCity[this.component.language];
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
    this.component.butCompanyCreateTitle         = Resources.companyFormButCompanyCreateTitle[this.component.language];
    this.component.butCompanyCreateValue         = Resources.butCreateValue[this.component.language];
    this.component.butCompanyEditTitle           = Resources.companyFormButCompanyEditTitle[this.component.language];
    this.component.butCompanyEditValue           = Resources.butEditValue[this.component.language];
    this.component.labelInputImageLogo           = Resources.companyFormLabelInputImageLogo[this.component.language];
    this.component.labelInputImageTitleImage     = Resources.companyFormLabelInputImageTitleImage[this.component.language];
    this.component.labelNewLogoFileName          = Resources.labelNewFileName[this.component.language];
    this.component.labelNewTitleImageFileName    = Resources.labelNewFileName[this.component.language];
    this.component.labelFileNotSelected          = Resources.labelFileNotSelected[this.component.language];
    this.component.butNewLogoFileNameTitle       = Resources.companyFormButNewLogoFileNameTitle[this.component.language];
    this.component.butNewLogoFileNameValue       = Resources.butNewFileNameValue[this.component.language];
    this.component.butNewTitleImageFileNameTitle = Resources.companyFormButNewTitleImageFileNameTitle[this.component.language];
    this.component.butNewTitleImageFileNameValue = Resources.butNewFileNameValue[this.component.language];
    this.component.labelCheckboxIsNewCity        = Resources.labelNewHe[this.component.language];
    this.component.labelCheckboxIsNewCityTitle   = Resources.companyFormLabelCheckboxIsNewCityTitle[this.component.language];

  } // changeLanguageLiterals


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {

    // задать значения параметров запроса

    // 1) данные о пользователе-владельце
    this.company.userOwnerId = this._userId;

    // 2) название компании
    this.company.name = this.companyName.value;

    // 3) данные о стране
    let countryId: number = +this.countryId.value;

    // получить выбранную страну
    let country: Country = this.component.allCountries
      .find((country: Country) => country.id === countryId) ?? new Country();

    // 4) данные о городе
    let cityId: number = +this.cityId.value;

    // получить выбранный город
    let city: City = this.isNewCity.value
      ? new City(this.zero, this.newCityName.value, country, null)
      : this.component.allCities.find((city: City) => city.id === cityId) ?? new City();

    // 5) данные об улице
    let streetName: string = this.streetName.value;

    // получить улицу по наименованию, если не нашли - создать новую с введённым названием
    let street: Street = this.component.allStreets
        .find((street: Street) => street.name === streetName)
          ?? new Street(this.zero, streetName, null);

    // 6) дом/строение расположения компании
    let building: string = this.building.value;

    // 7) квартира(возможно её отсутствие)
    let flat: number = +this.flat.value;

    // 8) данные об адресе (поиск записи об адресе в БД осуществляем на сервере!!!)
    this.company.address = new Address(
      this.company.address.id, city, street, building, flat, null
    );

    // 9) телефон компании
    this.company.phone = this.companyPhone.value;

    // 10) график работы компании
    this.company.schedule = this.schedule.value;

    // 11) сайт компании
    this.company.site = this.site.value;

    // 12) описание компании
    this.company.description = this.companyDescription.value;


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

    // запрос на создание/изменение данных о компании
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this.company.id === Literals.zero
          ? this._webApiService.createCompanyPUT(Config.urlCreateCompany, this.company, token)
          : this._webApiService.editCompanyPOST(Config.urlEditCompany, this.company, token)
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
      if (result.companyId != undefined)
        message = result.companyId === this.zero
          ? Resources.incorrectCompanyIdData[this.component.language]
          : Resources.notRegisteredCompanyIdData[this.component.language];

      if (result.userId === this.zero)
        message = Resources.notRegisteredUserIdData[this.component.language];

      if (result.countryId != undefined)
        message = Resources.incorrectCountryIdData[this.component.language];

      if (result.cityId != undefined)
        message = Resources.incorrectCityIdData[this.component.language];

      if (result.streetId != undefined)
        message = Resources.incorrectStreetIdData[this.component.language];

      if (result.logo != undefined)
        message = Resources.companyFormIncorrectNewLogo[this.component.language];

      if (result.image != undefined)
        message = Resources.companyFormIncorrectNewTitleImage[this.component.language];

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
      result = this._companyId === this.zero
        ? Resources.companyFormCreateOkData[this.component.language]
        : Resources.companyFormEditOkData[this.component.language];

      // установить флаг создания/изменения данных о компании в true
      this.component.isChangedFlag = true;

      // перейти по маршруту на страницу ведения бизнеса
      this._router.navigateByUrl(Literals.routeBusiness)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

  } // onSubmit


  // обработчик события получения данных о выбранном файле изображения
  // (запрос на загрузку файла с изображением)
  async sendFileHandler(file: File, imageType: string): Promise<void> {

    // изменение значения имени выбранного файла
    // и его передача компоненту выбора для отображения
    if (imageType === this.logo) {
      this.component.newLogoFileName = file.name;
    } else {
      this.component.newTitleImageFileName = file.name;
    } // if

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

    // запрос на загрузку файла с изображением
    let result: { message: any, image: string } =
      { message: Literals.Ok, image: Literals.empty };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      // папка с временным изображением
      // получить имя папки с временным изображением для режима создания,
      // т.к. ID=0 - НЕ УНИКАЛЬНЫЙ!!!
      let tempDir: string = Literals.empty;
      if (this.company.id === Literals.zero) {

        // для разных изображений
        if (imageType === this.logo) {

          // для логотипа компании
          let items: string[] = this.company.logo.split(Literals.slash);
          let dir: string = items[items.length - 2];

          tempDir = dir.startsWith(Literals.temp) ? dir : tempDir;
        }
        else {
          // для основного изображения компании
          let items: string[] = this.company.titleImage.split(Literals.slash);
          let dir: string = items[items.length - 2];

          tempDir = dir.startsWith(Literals.temp) ? dir : tempDir;

        } // if

      } // if

      // запрос на загрузку файла с изображением
      let webResult: any = await firstValueFrom(this._webApiService.uploadImagePOST(
        Config.urlUploadTempCompanyImage, file, this._userId,
        this.company.id, tempDir, imageType, token
      ));

      result.image = webResult.image;
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
      if (result.message.image === Literals.empty)
        message = Resources.incorrectFileData[this.component.language];

      if (result.message.userId != undefined)
        message = Resources.incorrectUserIdData[this.component.language];

      if (result.message.companyId == Literals.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // изменить результат на сообщение для вывода
      result.message = message;

      // передать в компонент выбора пустое значение выбранного файла
      if (imageType === this.logo) {
        this.component.newLogoFileName = Literals.empty;
      }
      else {
        this.component.newTitleImageFileName = Literals.empty;
      } // if

      // сбросить флаг изменений данных в форме
      this.component.isChangedFormFlag = false;
    }
    else {

      // иначе - сообщение об успехе
      result.message = imageType === this.logo
        ? Resources.companyFormUploadLogoOkData[this.component.language]
        : Resources.companyFormUploadImageOkData[this.component.language];

      // установить объекту с данными о компании
      // временный путь расположения выбранного изображения
      if (imageType === this.logo) {
        this.company.logo = result.image;
      }
      else {
        this.company.titleImage = result.image;
      } // if

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      this.component.isChangedFormFlag = true;

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

  } // sendFileHandler


  // создание объектов полей ввода формы создания/изменения данных о компании
  createFormControls(): void {

    // поле ввода названия компании
    this.companyName = new FormControl(
      // начальное значение
      this.company.name,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.companyNameLength)
      ]
    );

    // поле выбора страны расположения компании
    this.countryId = new FormControl(
      // начальное значение
      this.company.address.city.country.id,
      // синхронные валидаторы
      [
        UserValidators.selectedZero
      ]
    );

    // поле выбора города расположения компании
    this.cityId = new FormControl(
      // начальное значение
      this.company.address.city.id,
      // синхронные валидаторы
      [
        UserValidators.selectedZero
      ]
    );

    // поле включения режима ввода нового города
    this.isNewCity = new FormControl(/*начальное значение*/false);

    // поле ввода названия нового города
    this.newCityName = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.newCityNameLength)
      ]
    );
    // отключить поле ввода названия нового города
    this.newCityName.disable();


    // поле ввода названия улицы расположения компании
    this.streetName = new FormControl(
      // начальное значение
      this.company.address.street.name,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.streetNameLength)
      ]
    );

    // поле ввода номера дома/строения расположения компании
    this.building = new FormControl(
      // начальное значение
      this.company.address.building,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.buildingLength)
      ]
    );

    // поле ввода номера квартиры/офиса расположения компании
    this.flat = new FormControl(
      // начальное значение
      this.company.address.flat ?? Literals.zero,
      // синхронные валидаторы
      []
    );

    // поле ввода телефона компании
    this.companyPhone = new FormControl(
      // начальное значение
      this.company.phone,
      // синхронные валидаторы
      [
        Validators.required,
        UserValidators.phone
      ]
    );

    // поле ввода графика работы компании
    this.schedule = new FormControl(
      // начальное значение
      this.company.schedule,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.scheduleLength)
      ]
    );

    // поле ввода сайта компании
    this.site = new FormControl(
      // начальное значение
      this.company.site,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.siteLength)
      ]
    );

    // поле ввода описания компании
    this.companyDescription = new FormControl(
      // начальное значение
      this.company.description,
      // синхронные валидаторы
      [
        Validators.maxLength(this.component.companyDescriptionLength)
      ]
    );


    // отключить элементы формы ТОЛЬКО в режиме создания данных
    if (this._mode == Literals.createCompany) {

      // отключить список выбора
      this.cityId.disable();

      // отключить чек-бокс включения режима ввода нового города
      this.isNewCity.disable();

      // отключить поле ввода названия улицы расположения компании
      this.streetName.disable();

      // отключить поле ввода номера дома/строения расположения компании
      this.building.disable();

      // отключить поле ввода номера квартиры/офиса расположения компании
      this.flat.disable();

    } // if


    // подписка на изменения в поле выбора страны расположения компании
    this.countryId.valueChanges.subscribe((countryId: number) => {

      // сменим тип данных на параметре выбора Id страны
      countryId = +countryId;

      // выбрать города, соответствующие выбранной стране
      let cities: City[] = this.component.allCities
        .filter((city: City) => city.country.id === countryId);

      // преобразовать полученную коллекцию в массив объектов для списка выбора
      this.component.citiesList = City.parseCitiesToSelect(cities);

      // установить значение поля выбора города в нулевое положение
      this.cityId.setValue(0);

      // включить чек-бокс включения режима ввода нового города
      this.isNewCity.enable();

      // если городов в коллекции нет - сразу перейти на поле ввода названия нового города
      if (cities.length === Literals.zero) {

        // в чек-боксе установить положительное значение
        this.isNewCity.setValue(true);
      }
      else {

        // в чек-боксе установить отрицательное значение
        this.isNewCity.setValue(false);

      } // if

      // включить поле ввода названия улицы расположения компании
      this.streetName.enable();

      // включить поле ввода номера дома/строения расположения компании
      this.building.enable();

      // включить поле ввода номера квартиры/офиса расположения компании
      this.flat.enable();

    }); // subscribe


    // подписка на изменения в чек-боксе включения режима ввода нового города расположения компании
    this.isNewCity.valueChanges.subscribe((data: boolean) => {

      // если чек-бокс отмечен - включить поле ввода
      if (data) {

        // отключить список выбора
        this.cityId.disable();

        // включить поле ввода названия нового города
        this.newCityName.enable();
      }
      // иначе - включить список
      else {

        // включить список выбора
        this.cityId.enable();

        // отключить поле ввода названия нового города
        this.newCityName.disable();

      } // if

      // в поле ввода задать пустое значение
      this.newCityName.setValue(Literals.empty);

    }); // subscribe


    // подписка на изменения в поле ввода номера квартиры/офиса расположения компании
    this.flat.valueChanges.subscribe((data: number) => {

      // проверка вводимых значений, this.flat.value >= 0 !
      if (data < this.zero || data === null)
        this.flat.setValue(this.zero);

    }); // subscribe

  } // createFormControls


  // создание объекта формы создания/изменения данных о компании
  createForm(): void {

    this.companyForm = new FormGroup( {
      companyName:        this.companyName,
      countryId:          this.countryId,
      cityId:             this.cityId,
      isNewCity:          this.isNewCity,
      newCityName:        this.newCityName,
      streetName:         this.streetName,
      building:           this.building,
      flat:               this.flat,
      companyPhone:       this.companyPhone,
      schedule:           this.schedule,
      site:               this.site,
      companyDescription: this.companyDescription
    });

    // подписка на изменения в форме
    this.companyForm.valueChanges.subscribe((data: {
      companyName: string, countryId: number, cityId: number, isNewCity: boolean,
      newCityName: string, streetName: string, building: string, flat: string,
      companyPhone: string, schedule: string, site: string, companyDescription: string
    }) => {
      // если в поле ввода названия нового города вводится запись, то
      // проводим проверку на совпадение с уже зарегистрированными городами
      if (data.isNewCity && data.newCityName != undefined)
        this.checkingExisting(data.newCityName);

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      this.component.isChangedFormFlag = true;

    }); // subscribe


    // сбросить флаг изменений данных в форме
    this.component.isChangedFormFlag = false;

  } // createForm


  // проверка названия нового города на совпадение с уже зарегистрированными
  checkingExisting(cityName: string): void {

    // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных
    this.component.errorRegisteredCity.isRegistered = this.component.allCities
      .some((city: City) => city.name.toLowerCase() === cityName.toLowerCase());

  } // checkingExisting


  // выполнение запроса на удаление временной папки
  // со всеми временными изображениями компании
  async requestDeleteTempCompanyImages(imageType: string): Promise<void> {

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

    // запрос на удаление временных папок со всеми временными изображениями компании
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService.deleteTempImages(
        Config.urlDeleteTempCompanyImages, this._userId, this.company.id, imageType, token
      ));
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

    // если сообщение с ошибкой - сформируем соответствующее сообщение об ошибке
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.userId != undefined)
        message = Resources.incorrectUserIdData[this.component.language];

      if (result.companyId == Literals.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

      if (result.imageType != undefined)
        message = Resources.incorrectImageTypeData[this.component.language];

      // ошибки существования папки
      if (result.directory != undefined && !result.directory)
        message = imageType == this.logo
          ? Resources.companyFormIncorrectTempLogoDirectory[this.component.language]
          : Resources.companyFormIncorrectTempTitleImageDirectory[this.component.language];

      // ошибки сервера
      if (result.title != undefined) message = result.title;

      if (result.deleteMessage != undefined) message = result.deleteMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;
    }
    else {

      // иначе - сообщение об успехе
      result = imageType == this.logo
        ? Resources.companyFormDeleteTempDirectoryLogoOk[this.component.language]
        : Resources.companyFormDeleteTempDirectoryTitleImageOk[this.component.language];

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

  } // requestDeleteTempCompanyImages


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


    // если компонент уничтожается НЕ после onSubmit()
    // И пользователь БЫЛ ВОШЕДШИМ!!!, то отправить запрос на удаление
    // временных папок со всеми временными изображениями компании
    let userIsLogin: boolean = this._userService.user.isLogin;
    if (!this.component.isChangedFlag && userIsLogin) {

      // запрос на удаление временных папок
      // со всеми временными изображениями компании
      await this.requestDeleteTempCompanyImages(this.logo);
      await this.requestDeleteTempCompanyImages(this.image);

    } // if

  } // ngOnDestroy

} // class CompanyFormComponent
// ----------------------------------------------------------------------------
