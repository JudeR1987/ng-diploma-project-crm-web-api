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
import {User} from '../../models/classes/User';
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

  // режим создания/изменения сведений о компании
  private _mode: string = Literals.empty;

  // сведения об Id компании для изменения
  private _companyId: number = Literals.zero;

  // сведения об Id пользователя для создания/изменения сведений о компании
  private _userId: number = Literals.zero;

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

    console.log(`[-CompanyFormComponent-constructor--`);

    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут и значение режима создания/изменения данных о компании
    let items: string[] = this._router.url.slice(1).split(Literals.slash);
    console.log(`*- items -*`);
    console.dir(items);

    this.component.route = items[0];
    console.log(`*- this.component.route = '${this.component.route}' -*`);

    this.component.route_mode = items[1];
    console.log(`*- this.component.route_mode = '${this.component.route_mode}' -*`);

    console.log(`*-this._mode: '${this._mode}' -*`);
    console.log(`*-this._companyId: '${this._companyId}' -*`);
    console.log(`*-this._userId: '${this._userId}' -*`);
    console.log(`*-this.company-*`);
    console.dir(this.company);

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

    console.log(`--CompanyFormComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-CompanyFormComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // в заголовке установить значение по умолчанию
    this.component.title = Resources.companyFormTitleDefault[this.component.language];

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-CompanyFormComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--CompanyFormComponent-subscribe-]`);
      }); // subscribe

    // получить данные о пользователе из сервиса-хранилища
    let user: User = this._userService.user;
    console.log(`*-(было)-this._userId: '${this._userId}'-*`);
    this._userId = user.id;
    console.log(`*-(стало)-this._userId: '${this._userId}' -*`);


    // получить параметры маршрута
    console.dir(this._activatedRoute);
    console.dir(this._activatedRoute.params);
    let mode: string = Literals.empty;
    let companyId: number = 0;
    // подписка на получение результата перехода по маршруту
    this._activatedRoute.params.subscribe(params => {

      // параметр о режиме создания/изменения, полученный из маршрута
      mode = params[Literals.mode];
      console.log(`*-mode: '${mode}' [${typeof mode}] -*`);

      console.log(`*-(было)-this._mode: '${this._mode}' -*`);
      this._mode = mode;
      console.log(`*-(стало)-this._mode: '${this._mode}' -*`);

      // параметр об Id компании для изменения
      console.log(`*-params['id']: '${params[Literals.id]}' -*`);
      companyId = params[Literals.id] != undefined
        ? +params[Literals.id]
        : 0;
      console.log(`*-companyId: '${companyId}' [${typeof companyId}] -*`);

      console.log(`*-(было)-this._companyId: '${this._companyId}' -*`);
      this._companyId = companyId;
      console.log(`*-(стало)-this._companyId: '${this._companyId}' -*`);

    }); // subscribe


    // проверки на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)

    // если параметр пользователя отсутствует,
    // требуется перейти на страницу "NotFound"
    console.log(`*-this._userId: '${this._userId}' -*`);
    if (this._userId === this.zero) {
      console.log(`*- Переход на "NotFound" - 'TRUE' -*`);

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectUserIdData[this.component.language]);

        console.log(`--CompanyFormComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "NotFound" - 'FALSE' -*`);

    // если в режиме создания добавлен Id компании ИЛИ
    // в режиме изменения Id компании НЕ добавлен,
    // требуется перейти на страницу "NotFound"
    console.log(`*-this._mode: '${this._mode}' -*`);
    console.log(`*-this._companyId: '${this._companyId}' -*`);
    if ((this._mode === Literals.createCompany && this._companyId > this.zero) ||
      (this._mode === Literals.editCompany && this._companyId === this.zero)) {
      console.log(`*- Переход на "NotFound" - 'TRUE' -*`);

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(this._mode === Literals.createCompany
            ? Resources.companyFormCreateCompanyIncorrectData[this.component.language]
            : Resources.companyFormEditCompanyIncorrectData[this.component.language]);

        console.log(`--CompanyFormComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "NotFound" - 'FALSE' -*`);


    // установим объекту компании идентификатор
    console.log(`*-(было)-this.company.id: '${this.company.id}' -*`);
    this.company.id = this._companyId;
    console.log(`*-(стало)-this.company.id: '${this.company.id}' -*`);

    console.log(`*-(было)-this.company: -*`);
    console.dir(this.company);

    // при режиме изменения! во время загрузки компонента
    // отправить запрос на получение данных об изменяемой компании
    console.log(`*-this._mode: '${this._mode}' -*`);
    if (this._mode === Literals.editCompany) {
      console.log(`*- получить компанию с ID=${this._companyId} -*`);

      // запрос на получение записи о компании из БД для изменения
      await this.requestGetCompanyById();

      // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
      if (this.company.id === this.zero) {
        console.log(`*- Переход на "Home" - 'TRUE' -*`);

        // "отключить" удаление временных папок с временными
        // изображениями при уничтожении компонента
        this.component.isChangedFlag = true;

        // перейти по маршруту на главную страницу
        this._router.navigateByUrl(Literals.routeHomeEmpty).then((e) => {
          console.log(`*- переход: ${e} -*`);

          console.log(`--CompanyFormComponent-ngOnInit-]`);
        }); // navigateByUrl

        return;
      } // if
      console.log(`*- Переход на "Home" - 'FALSE' -*`);

    } else {
      console.log(`*- задать параметры для новой компании -*`);

      // задать путь к файлу с изображением логотипа по умолчанию
      this.company.logo = Literals.pathLogoDef;

      // задать путь к файлу с основным изображением компании по умолчанию
      this.company.titleImage = Literals.pathTitleImageDef;

    } // if

    console.log(`*-(стало)-this.company: -*`);
    console.dir(this.company);

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

    // создание объектов полей ввода и формы создания/изменения данных о компании
    this.createFormControls();
    this.createForm();

    console.log(`--CompanyFormComponent-ngOnInit-]`);
  } // ngOnInit


  // запрос на получение записи о компании из БД для изменения
  async requestGetCompanyById(): Promise<void> {
    console.log(`[-CompanyFormComponent-requestGetCompanyById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--CompanyFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--CompanyFormComponent-requestGetCompanyById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--CompanyFormComponent-1-(запрос на получение компании)-`);

    // запрос на получение записи о компании
    let result: { message: any, company: Company } =
      { message: Literals.Ok, company: new Company() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetCompanyById, this._companyId, token)
      );
      console.dir(webResult);

      result.company = Company.newCompany(webResult.company);

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

    console.log(`--CompanyFormComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.company);

    console.log(`--CompanyFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
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

    } else {

      // присвоить значение полученных данных
      this.company = result.company;

    } // if

    console.log(`--CompanyFormComponent-requestGetCompanyById-]`);
  } // requestGetCompanyById


  // запрос на получение параметров формы создания/изменения данных о компании
  async requestGetCompanyFormParams(): Promise<void> {
    console.log(`[-CompanyFormComponent-requestGetCompanyFormParams--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--CompanyFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--CompanyFormComponent-requestGetCompanyFormParams-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--CompanyFormComponent-1-(запрос на получение параметров формы)-`);

    // запрос на получение параметров формы создания/изменения сведений о салоне
    let result: { message: any, allCountries: Country[], allCities: City[], allStreets: Street[] } =
      { message: Literals.Ok, allCountries: [], allCities: [], allStreets: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(
        this._webApiService.getCompanyFormParams(Config.urlGetCompanyFormParams, token)
      );
      console.dir(webResult);

      result.allCountries = Country.parseCountries(webResult.allCountries);
      result.allCities    = City.parseCities(webResult.allCities);
      result.allStreets   = Street.parseStreets(webResult.allStreets);

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

    console.log(`--CompanyFormComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.allCountries);
    console.dir(result.allCities);
    console.dir(result.allStreets);

    console.log(`--CompanyFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      /*console.log(`--result.message.image: '${result.message.image}'`);
      if (result.message.image === Literals.empty)
        message = Resources.incorrectFileData[this.component.language];*/

      /*console.log(`--result.message.id: '${result.message.id}'`);
      if (result.message.id == Literals.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];*/

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
      // страны
      this.component.allCountries = result.allCountries;
      console.log(`*- this.component.allCountries: -*`);
      console.dir(this.component.allCountries);

      // города
      this.component.allCities = result.allCities;
      console.log(`*- this.component.allCities: -*`);
      console.dir(this.component.allCities);

      // улицы
      this.component.allStreets = result.allStreets;
      console.log(`*- this.component.allStreets: -*`);
      console.dir(this.component.allStreets);

      // создать массивы данных для списков выбора
      // страны
      this.component.countriesList = Country.parseCountriesToSelect(this.component.allCountries);
      console.log(`*- this.component.countriesList: -*`);
      console.dir(this.component.countriesList);

      // только в режиме изменения данных
      if (this._mode == Literals.editCompany) {

        // города
        // выбрать города, соответствующие выбранной стране
        let cities: City[] = this.component.allCities
          .filter((city: City) => city.country.id === this.company.address.city.country.id);
        console.log(`*- выборка cities: -*`);
        console.dir(cities);

        // преобразовать полученную коллекцию в массив объектов для списка выбора
        this.component.citiesList = City.parseCitiesToSelect(cities);
        console.log(`*- this.component.citiesList: -*`);
        console.dir(this.component.citiesList);

      } // if

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

    console.log(`--CompanyFormComponent-requestGetCompanyFormParams-]`);
  } // requestGetCompanyFormParams


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-CompanyFormComponent-changeLanguageLiterals--`);

    console.log(`*-input(пришло)-language='${language}'-*`);
    console.log(`*-(было)-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-(стало)-this.component.language='${this.component.language}'-*`);

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
    console.log(`--CompanyFormComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {
    console.log(`[-CompanyFormComponent-onSubmit--`);

    console.log("Отправка данных на сервер");
    console.dir(this.companyForm.value);
    console.log(this.companyForm.valid);

    // задать значения параметров запроса

    // 1) данные о пользователе-владельце
    console.log(`*-(было)-this.company.userOwnerId = '${this.company.userOwnerId}' -*`);
    this.company.userOwnerId = this._userId;
    console.log(`*-(стало)-this.company.userOwnerId = '${this.company.userOwnerId}' -*`);

    // 2) название компании
    console.log(`*-(было)-this.company.name = '${this.company.name}' -*`);
    this.company.name = this.companyName.value;
    console.log(`*-(стало)-this.company.name = '${this.company.name}' -*`);

    // 3) данные о стране
    console.log(`*- this.countryId.value: '${this.countryId.value} [${typeof this.countryId.value}]' -*`);
    let countryId: number = +this.countryId.value;
    console.log(`*- countryId: '${countryId} [${typeof countryId}]' -*`);

    // получить выбранную страну
    let country: Country = this.component.allCountries
      .find((country: Country) => country.id === countryId) ?? new Country();
    console.log(`*- country: -*`);
    console.dir(country);

    /*console.log(`*-(было)-this.company.address.city.country: -*`);
    console.dir(this.company.address.city.country);
    this.company.address.city.country = country;
    console.log(`*-(стало)-this.company.address.city.country: -*`);
    console.dir(this.company.address.city.country);*/

    // 4) данные о городе
    console.log(`*- this.cityId.value: '${this.cityId.value} [${typeof this.cityId.value}]' -*`);
    console.log(`*- this.isNewCity.value: '${this.isNewCity.value} [${typeof this.isNewCity.value}]' -*`);
    console.log(`*- this.newCityName.value: '${this.newCityName.value} [${typeof this.newCityName.value}]' -*`);

    let cityId: number = +this.cityId.value;
    console.log(`*- cityId: '${cityId} [${typeof cityId}]' -*`);

    // получить выбранный город
    let city: City = this.isNewCity.value
      ? new City(this.zero, this.newCityName.value, country, null)
      : this.component.allCities.find((city: City) => city.id === cityId) ?? new City();
    console.log(`*- city: -*`);
    console.dir(city);

    /*console.log(`*-(было)-this.company.address.city: -*`);
    console.dir(this.company.address.city);
    this.company.address.city = city;
    console.log(`*-(стало)-this.company.address.city: -*`);
    console.dir(this.company.address.city);*/

    // 5) данные об улице
    console.log(`*- this.streetName.value: '${this.streetName.value} [${typeof this.streetName.value}]' -*`);
    let streetName: string = this.streetName.value;
    console.log(`*- streetName: '${streetName} [${typeof streetName}]' -*`);

    // получить улицу по наименованию, если не нашли - создать новую с введённым названием
    let street: Street = this.component.allStreets
        .find((street: Street) => street.name === streetName)
          ?? new Street(this.zero, streetName, null);
    console.log(`*- street: -*`);
    console.dir(street);

    /*console.log(`*-(было)-this.company.address.street: -*`);
    console.dir(this.company.address.street);
    this.company.address.street = street;
    console.log(`*-(стало)-this.company.address.street: -*`);
    console.dir(this.company.address.street);*/

    // 6) дом/строение расположения компании
    let building: string = this.building.value;
    console.log(`*- building: '${building}' -*`);

    // 7) квартира(возможно её отсутствие)
    let flat: number = +this.flat.value;
    console.log(`*- flat: '${flat}' -*`);

    // 8) данные об адресе (поиск записи об адресе в БД осуществляем на сервере!!!)
    console.log(`*-(было)-this.company.address: -*`);
    console.dir(this.company.address);
    this.company.address = new Address(
      this.company.address.id, city, street, building, flat, null
    );
    console.log(`*-(стало)-this.company.address: -*`);
    console.dir(this.company.address);

    // 9) телефон компании
    console.log(`*-(было)-this.company.phone = '${this.company.phone}' -*`);
    this.company.phone = this.companyPhone.value;
    console.log(`*-(стало)-this.company.phone = '${this.company.phone}' -*`);

    // 10) график работы компании
    console.log(`*-(было)-this.company.schedule = '${this.company.schedule}' -*`);
    this.company.schedule = this.schedule.value;
    console.log(`*-(стало)-this.company.schedule = '${this.company.schedule}' -*`);

    // 11) сайт компании
    console.log(`*-(было)-this.company.site = '${this.company.site}' -*`);
    this.company.site = this.site.value;
    console.log(`*-(стало)-this.company.site = '${this.company.site}' -*`);

    // 12) описание компании
    console.log(`*-(было)-this.company.description = '${this.company.description}' -*`);
    this.company.description = this.companyDescription.value;
    console.log(`*-(стало)-this.company.description = '${this.company.description}' -*`);


    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--CompanyFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--CompanyFormComponent-onSubmit-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--CompanyFormComponent-1-(запрос на создание/изменение)-`);

    // запрос на создание/изменение данных о компании
    /*let result: { message: any, company: Company } =
      //{ message: Literals.Ok, company: Company.CompanyToDto(new Company()) };
      { message: Literals.Ok, company: new Company() };*/
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(
        this.company.id === Literals.zero
          ? this._webApiService.createCompanyPUT(Config.urlCreateCompany, this.company, token)
          : this._webApiService.editCompanyPOST(Config.urlEditCompany, this.company, token)
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

    console.log(`--CompanyFormComponent-result:`);
    console.dir(result);

    console.log(`--CompanyFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.companyId: '${result.companyId}'`);
      if (result.companyId != undefined)
        message = result.companyId === this.zero
          ? Resources.incorrectCompanyIdData[this.component.language]
          : Resources.notRegisteredCompanyIdData[this.component.language];

      console.log(`--result.userId: '${result.userId}'`);
      if (result.userId === this.zero)
        message = Resources.notRegisteredUserIdData[this.component.language];

      console.log(`--result.countryId: '${result.countryId}'`);
      if (result.countryId != undefined)
        message = Resources.incorrectCountryIdData[this.component.language];

      console.log(`--result.cityId: '${result.cityId}'`);
      if (result.cityId != undefined)
        message = Resources.incorrectCityIdData[this.component.language];

      console.log(`--result.streetId: '${result.streetId}'`);
      if (result.streetId != undefined)
        message = Resources.incorrectStreetIdData[this.component.language];

      console.log(`--result.logo: '${result.logo}'`);
      if (result.logo != undefined)
        message = Resources.companyFormIncorrectNewLogo[this.component.language];

      console.log(`--result.image: '${result.image}'`);
      if (result.image != undefined)
        message = Resources.companyFormIncorrectNewTitleImage[this.component.language];

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

    console.log(`--CompanyFormComponent-onSubmit-]`);
  } // onSubmit


  // обработчик события получения данных о выбранном файле изображения
  // (запрос на загрузку файла с изображением)
  async sendFileHandler(file: File, imageType: string): Promise<void> {
    console.log(`[-CompanyFormComponent-sendFileHandler--`);

    console.log(`*- file -*`);
    console.dir(file);

    console.log(`*- imageType: '${imageType}' -*`);

    // изменение значения имени выбранного файла
    // и его передача компоненту выбора для отображения
    if (imageType === this.logo) {

      console.log(`*-(было)- this.component.newLogoFileName: '${this.component.newLogoFileName}' -*`);
      this.component.newLogoFileName = file.name;
      console.log(`*-(стало)- this.component.newLogoFileName: '${this.component.newLogoFileName}' -*`);

    } else {

      console.log(`*-(было)- this.component.newTitleImageFileName: '${this.component.newTitleImageFileName}' -*`);
      this.component.newTitleImageFileName = file.name;
      console.log(`*-(стало)- this.component.newTitleImageFileName: '${this.component.newTitleImageFileName}' -*`);

    } // if

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--CompanyFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--CompanyFormComponent-onSubmit-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--CompanyFormComponent-1-(загрузка изображения)-`);

    // запрос на загрузку файла с изображением
    let result: { message: any, image: string } =
      { message: Literals.Ok, image: Literals.empty };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      // папка с временным изображением
      // получить имя папки с временным изображением для режима создания,
      // т.к. ID=0 - НЕ УНИКАЛЬНЫЙ!!!
      let tempDir: string = Literals.empty;
      if (this.company.id === Literals.zero) {

        // для разных изображений
        if (imageType === this.logo) {
          // для логотипа компании

          console.log(`*- this.company.logo: '${this.company.logo}' -*`);

          let items: string[] = this.company.logo.split(Literals.slash);
          console.log(`*- items: -*`);
          console.dir(items);
          let dir: string = items[items.length - 2];
          console.log(`*- dir: '${dir}' -*`);

          tempDir = dir.startsWith(Literals.temp) ? dir : tempDir;
          console.log(`*- tempDir: '${tempDir}' -*`);

        } else {
          // для основного изображения компании

          console.log(`*- this.company.titleImage: '${this.company.titleImage}' -*`);

          let items: string[] = this.company.titleImage.split(Literals.slash);
          console.log(`*- items: -*`);
          console.dir(items);
          let dir: string = items[items.length - 2];
          console.log(`*- dir: '${dir}' -*`);

          tempDir = dir.startsWith(Literals.temp) ? dir : tempDir;
          console.log(`*- tempDir: '${tempDir}' -*`);

        } // if

      } // if

      // запрос на загрузку файла с изображением
      let webResult: any = await firstValueFrom(this._webApiService.uploadImagePOST(
        Config.urlUploadTempCompanyImage, file, this._userId,
        this.company.id, tempDir, imageType, token
      ));
      console.dir(webResult);

      result.image = webResult.image;

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

    console.log(`--UserFormComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.image);

    console.log(`--UserFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.image: '${result.message.image}'`);
      if (result.message.image === Literals.empty)
        message = Resources.incorrectFileData[this.component.language];

      console.log(`--result.message.userId: '${result.message.userId}'`);
      if (result.message.userId != undefined)
        message = Resources.incorrectUserIdData[this.component.language];

      console.log(`--result.message.companyId: '${result.message.companyId}'`);
      if (result.message.companyId == Literals.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // изменить результат на сообщение для вывода
      result.message = message;

      // передать в компонент выбора пустое значение выбранного файла
      if (imageType === this.logo) {

        console.log(`*-(было)- this.component.newLogoFileName: '${this.component.newLogoFileName}' -*`);
        this.component.newLogoFileName = Literals.empty;
        console.log(`*-(стало)- this.component.newLogoFileName: '${this.component.newLogoFileName}' -*`);

      } else {

        console.log(`*-(было)- this.component.newTitleImageFileName: '${this.component.newTitleImageFileName}' -*`);
        this.component.newTitleImageFileName = Literals.empty;
        console.log(`*-(стало)- this.component.newTitleImageFileName: '${this.component.newTitleImageFileName}' -*`);

      } // if

      // сбросить флаг изменений данных в форме
      console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
      this.component.isChangedFormFlag = false;
      console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

    } else {
      // иначе - сообщение об успехе
      result.message = imageType === this.logo
        ? Resources.companyFormUploadLogoOkData[this.component.language]
        : Resources.companyFormUploadImageOkData[this.component.language];

      // установить объекту с данными о компании
      // временный путь расположения выбранного изображения
      if (imageType === this.logo) {

        console.log(`*-(было)-this.company.logo: '${this.company.logo}' -*`);
        this.company.logo = result.image;
        console.log(`*-(стало)-this.company.logo: '${this.company.logo}' -*`);

      } else {

        console.log(`*-(было)-this.company.titleImage: '${this.company.titleImage}' -*`);
        this.company.titleImage = result.image;
        console.log(`*-(стало)-this.company.titleImage: '${this.company.titleImage}' -*`);

      } // if

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
      this.component.isChangedFormFlag = true;
      console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

    console.log(`--CompanyFormComponent-sendFileHandler-]`);
  } // sendFileHandler


  // создание объектов полей ввода формы создания/изменения данных о компании
  createFormControls(): void {
    console.log(`[-CompanyFormComponent-createFormControls--`);

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
        /*Validators.required,*/
        UserValidators.selectedZero
      ]
    );

    // поле выбора города расположения компании
    this.cityId = new FormControl(
      // начальное значение
      this.company.address.city.id,
      // синхронные валидаторы
      [
        /*Validators.required,*/
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
        /*Validators.required,*/
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
      console.log(`[-CompanyFormComponent-this.countryId.valueChanges.subscribe--`);
      console.log(`*- выбрать соответствующие города -*`);

      // сменим тип данных на параметре выбора Id страны
      console.log(`*- countryId: '${countryId}' [${typeof countryId}]`);
      countryId = +countryId;
      console.log(`*- countryId: '${countryId}' [${typeof countryId}]`);

      // выбрать города, соответствующие выбранной стране
      let cities: City[] = this.component.allCities
        .filter((city: City) => city.country.id === countryId);
      console.log(`*- выборка cities: -*`);
      console.dir(cities);

      // преобразовать полученную коллекцию в массив объектов для списка выбора
      this.component.citiesList = City.parseCitiesToSelect(cities);
      console.log(`*- this.component.citiesList: -*`);
      console.dir(this.component.citiesList);

      // установить значение поля выбора города в нулевое положение
      this.cityId.setValue(0);

      // включить чек-бокс включения режима ввода нового города
      this.isNewCity.enable();

      // если городов в коллекции нет - сразу перейти на поле ввода названия нового города
      if (cities.length === Literals.zero) {

        // в чек-боксе установить положительное значение
        this.isNewCity.setValue(true);

      } else {

        // в чек-боксе установить отрицательное значение
        this.isNewCity.setValue(false);

      } // if

      // включить поле ввода названия улицы расположения компании
      console.log(`*-(было)- this.streetName.enabled: '${this.streetName.enabled}' -*`);
      this.streetName.enable();
      console.log(`*-(стало)- this.streetName.enabled: '${this.streetName.enabled}' -*`);

      // включить поле ввода номера дома/строения расположения компании
      console.log(`*-(было)- this.building.enabled: '${this.building.enabled}' -*`);
      this.building.enable();
      console.log(`*-(стало)- this.building.enabled: '${this.building.enabled}' -*`);

      // включить поле ввода номера квартиры/офиса расположения компании
      console.log(`*-(было)- this.flat.enabled: '${this.flat.enabled}' -*`);
      this.flat.enable();
      console.log(`*-(стало)- this.flat.enabled: '${this.flat.enabled}' -*`);

      console.log(`--CompanyFormComponent-this.countryId.valueChanges.subscribe-]`);
    }); // subscribe


    // подписка на изменения в чек-боксе включения режима ввода нового города расположения компании
    this.isNewCity.valueChanges.subscribe((data: boolean) => {
      console.log(`[-CompanyFormComponent-this.isNewCity.valueChanges.subscribe--`);

      console.log(`*- this.isNewCity.value: '${this.isNewCity.value}' -*`);
      console.log(`*- data: '${data}' -*`);

      // если чек-бокс отмечен - включить поле ввода
      if (data) {

        // отключить список выбора
        console.log(`*-(было)- this.cityId.disabled: '${this.cityId.disabled}' -*`);
        this.cityId.disable();
        console.log(`*-(стало)- this.cityId.disabled: '${this.cityId.disabled}' -*`);

        // включить поле ввода названия нового города
        console.log(`*-(было)- this.newCityName.enabled: '${this.newCityName.enabled}' -*`);
        this.newCityName.enable();
        console.log(`*-(стало)- this.newCityName.enabled: '${this.newCityName.enabled}' -*`);

      } else { // иначе - включить список

        // включить список выбора
        console.log(`*-(было)- this.cityId.enabled: '${this.cityId.enabled}' -*`);
        this.cityId.enable();
        console.log(`*-(стало)- this.cityId.enabled: '${this.cityId.enabled}' -*`);

        // отключить поле ввода названия нового города
        console.log(`*-(было)- this.newCityName.disabled: '${this.newCityName.disabled}' -*`);
        this.newCityName.disable();
        console.log(`*-(стало)- this.newCityName.disabled: '${this.newCityName.disabled}' -*`);

      } // if

      // в поле ввода задать пустое значение
      console.log(`*-(было)- this.newCityName.value: '${this.newCityName.value}' -*`);
      this.newCityName.setValue(Literals.empty);
      console.log(`*-(стало)- this.newCityName.value: '${this.newCityName.value}' -*`);

      console.log(`--CompanyFormComponent-this.isNewCity.valueChanges.subscribe-]`);
    }); // subscribe


    // подписка на изменения в поле ввода номера квартиры/офиса расположения компании
    this.flat.valueChanges.subscribe((data: number) => {
      console.log(`[-CompanyFormComponent-this.flat.valueChanges.subscribe--`);

      console.log(`*- data: '${data}' [${typeof data}]`);

      // проверка вводимых значений, this.flat.value >= 0 !
      if (data < this.zero || data === null)
        this.flat.setValue(this.zero);

      console.log(`--CompanyFormComponent-this.flat.valueChanges.subscribe-]`);
    }); // subscribe

    console.log(`--CompanyFormComponent-createFormControls-]`);
  } // createFormControls


  // создание объекта формы создания/изменения данных о компании
  createForm(): void {
    console.log(`[-CompanyFormComponent-createForm--`);

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
      console.log(`[-CompanyFormComponent-this.companyForm.valueChanges.subscribe--`);
      console.dir(data);

      console.log(`*- this.isNewCity.value: '${this.isNewCity.value}' -*`);
      console.log(`*- this.newCityName.value: '${this.newCityName.value}' -*`);
      console.log(`*- data.isNewCity: '${data.isNewCity}' -*`);
      console.log(`*- data.newCityName: '${data.newCityName}' -*`);
      console.log(`*- data.cityId: '${data.cityId}' -*`);
      console.log(`*- this.cityId.value: '${this.cityId.value}' -*`);

      // если в поле ввода названия нового города вводится запись, то
      // проводим проверку на совпадение с уже зарегистрированными городами
      if (data.isNewCity && data.newCityName != undefined)
        this.checkingExisting(data.newCityName);

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
      this.component.isChangedFormFlag = true;
      console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

      console.log(`--CompanyFormComponent-this.companyForm.valueChanges.subscribe-]`);
    }); // subscribe


    // сбросить флаг изменений данных в форме
    console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
    this.component.isChangedFormFlag = false;
    console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

    console.log(`--CompanyFormComponent-createForm-]`);
  } // createForm


  // проверка названия нового города на совпадение с уже зарегистрированными
  checkingExisting(cityName: string): void {
    console.log(`[-CompanyFormComponent-checkingExisting--`);

    console.log(`*- cityName: '${cityName}' -*`);
    /*console.log(`*-(было) cityName: '${cityName}' -*`);
    cityName = cityName != Literals.empty
      ? cityName.toLowerCase()
      : cityName;
    console.log(`*-(стало) cityName: '${cityName}' -*`);*/

    // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных
    this.component.errorRegisteredCity.isRegistered = this.component.allCities
      //.some((city: City) => city.name.toLowerCase() === cityName);
      .some((city: City) => city.name.toLowerCase() === cityName.toLowerCase());
    console.dir(this.component.errorRegisteredCity.isRegistered);

    console.log(`--CompanyFormComponent-checkingExisting-]`);
  } // checkingExisting


  // выполнение запроса на удаление временной папки
  // со всеми временными изображениями компании
  async requestDeleteTempCompanyImages(imageType: string): Promise<void> {
    console.log(`[-CompanyFormComponent-requestDeleteTempCompanyImages--`);

    console.log(`*-this.company-*`);
    console.dir(this.company);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--CompanyFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--CompanyFormComponent-requestDeleteTempCompanyImages-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--CompanyFormComponent-1-(запрос на удаление)-`);

    // запрос на удаление временных папок со всеми временными изображениями компании
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(this._webApiService.deleteTempImages(
        Config.urlDeleteTempCompanyImages, this._userId, this.company.id, imageType, token
      ));
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

    console.log(`--UserFormComponent-result:`);
    console.dir(result);

    console.log(`--UserFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - сформируем соответствующее сообщение об ошибке
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.userId: '${result.userId}'`);
      if (result.userId != undefined)
        message = Resources.incorrectUserIdData[this.component.language];

      console.log(`--result.companyId: '${result.companyId}'`);
      if (result.companyId == Literals.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

      console.log(`--result.imageType: '${result.imageType}'`);
      if (result.imageType != undefined)
        message = Resources.incorrectImageTypeData[this.component.language];

      // ошибки существования папки
      console.log(`--result.directory: '${result.directory}'`);
      if (result.directory != undefined && !result.directory)
        message = imageType == this.logo
          ? Resources.companyFormIncorrectTempLogoDirectory[this.component.language]
          : Resources.companyFormIncorrectTempTitleImageDirectory[this.component.language];

      // ошибки сервера
      console.log(`--result.title: '${result.title}'`);
      if (result.title != undefined) message = result.title;

      console.log(`--result.deleteMessage: '${result.deleteMessage}'`);
      if (result.deleteMessage != undefined) message = result.deleteMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;

    } else {
      // иначе - сообщение об успехе
      result = imageType == this.logo
        ? Resources.companyFormDeleteTempDirectoryLogoOk[this.component.language]
        : Resources.companyFormDeleteTempDirectoryTitleImageOk[this.component.language];
    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

    console.log(`--CompanyFormComponent-requestDeleteTempCompanyImages-]`);
  } // requestDeleteTempCompanyImages


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
    console.log(`[-CompanyFormComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();


    // если компонент уничтожается НЕ после onSubmit()
    // И пользователь БЫЛ ВОШЕДШИМ!!!, то отправить запрос на удаление
    // временных папок со всеми временными изображениями компании
    console.log(`*-this.component.isChangedFlag: '${this.component.isChangedFlag}' -*`);
    let userIsLogin: boolean = this._userService.user.isLogin;
    console.log(`*-userIsLogin: '${userIsLogin}' -*`);
    if (!this.component.isChangedFlag && userIsLogin) {

      // при загрузке компонента отправить запрос на удаление
      // временных папок со всеми временными изображениями компании
      await this.requestDeleteTempCompanyImages(this.logo);
      await this.requestDeleteTempCompanyImages(this.image);

    } // if

    console.log(`--CompanyFormComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class CompanyFormComponent
// ----------------------------------------------------------------------------
