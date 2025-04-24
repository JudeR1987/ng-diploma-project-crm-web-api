// ----------------------------------------------------------------------------
// компонент отображения формы добавления/изменения данных о сотруднике компании
// (+ создание пользователя, специальностей, должностей)
// ----------------------------------------------------------------------------
import {Component, OnDestroy, OnInit} from '@angular/core';
import {IEmployeeFormComponent} from '../../models/interfaces/IEmployeeFormComponent';
import {Literals} from '../../infrastructure/Literals';
import {firstValueFrom, Subscription} from 'rxjs';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {WebApiService} from '../../services/web-api.service';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Utils} from '../../infrastructure/Utils';
import {Employee} from '../../models/classes/Employee';
import {Resources} from '../../infrastructure/Resources';
import {Config} from '../../infrastructure/Config';
import {Specialization} from '../../models/classes/Specialization';
import {Position} from '../../models/classes/Position';
import {UserValidators} from '../../validators/UserValidators';
import {FileUploadComponent} from '../file-upload/file-upload.component';
import {NgIf} from '@angular/common';
import {User} from '../../models/classes/User';
import {LoginModel} from '../../models/classes/LoginModel';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FileUploadComponent, NgIf, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IEmployeeFormComponent = {
    // параметры меняющиеся при смене языка
    title:                                         Literals.empty,
    labelEmployeeName:                             Literals.empty,
    labelPhone:                                    Literals.empty,
    labelEmail:                                    Literals.empty,
    labelSpecialization:                           Literals.empty,
    labelNewSpecializationName:                    Literals.empty,
    firstOptionSpecializations:                    Literals.empty,
    labelCheckboxIsNewSpecializationTitle:         Literals.empty,
    labelCheckboxIsNewSpecialization:              Literals.empty,
    labelPosition:                                 Literals.empty,
    labelNewPositionName:                          Literals.empty,
    firstOptionPositions:                          Literals.empty,
    labelCheckboxIsNewPositionTitle:               Literals.empty,
    labelCheckboxIsNewPosition:                    Literals.empty,
    employeeNamePlaceholder:                       Literals.empty,
    newSpecializationNamePlaceholder:              Literals.empty,
    newPositionNamePlaceholder:                    Literals.empty,
    errorRequiredTitle:                            Literals.empty,
    errorEmployeeNameMaxLengthTitle:               Literals.empty,
    errorPhoneValidatorTitle:                      Literals.empty,
    phoneNoErrorsTitle:                            Literals.empty,
    errorEmailMaxLengthTitle:                      Literals.empty,
    errorEmailValidatorTitle:                      Literals.empty,
    errorSpecializationSelectedZeroValidatorTitle: Literals.empty,
    errorNewSpecializationNameMaxLengthTitle:      Literals.empty,
    errorPositionSelectedZeroValidatorTitle:       Literals.empty,
    errorNewPositionNameMaxLengthTitle:            Literals.empty,
    errorNotMatchUserName:                         {message: Literals.empty, isNotMatched: false},
    errorNotMatchUserPhone:                        {message: Literals.empty, isNotMatched: false},
    errorNotMatchUserEmail:                        {message: Literals.empty, isNotMatched: false},
    errorRegisteredPhone:                          {message: Literals.empty, isRegistered: false},
    errorRegisteredEmail:                          {message: Literals.empty, isRegistered: false},
    errorRegisteredSpecialization:                 {message: Literals.empty, isRegistered: false},
    errorRegisteredPosition:                       {message: Literals.empty, isRegistered: false},
    photoTitle:                                    Literals.empty,
    butEmployeeCreateTitle:                        Literals.empty,
    butEmployeeCreateValue:                        Literals.empty,
    butEmployeeEditTitle:                          Literals.empty,
    butEmployeeEditValue:                          Literals.empty,
    butEmployeeFormCreateResetTitle:               Literals.empty,
    butEmployeeFormCreateResetValue:               Literals.empty,
    labelInputImage:                               Literals.empty,
    labelNewFileName:                              Literals.empty,
    labelFileNotSelected:                          Literals.empty,
    butNewFileNameTitle:                           Literals.empty,
    butNewFileNameValue:                           Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:                    Literals.empty,
    route:                       Literals.empty,
    route_mode:                  Literals.empty,
    isWaitFlag:                  false,
    isChangedFlag:               false,
    isChangedFormFlag:           false,
    phonePlaceholder:            Literals.phonePlaceholder,
    emailPlaceholder:            Literals.emailPlaceholder,
    employeeNameLength:          Literals.employeeNameLength,
    phoneLength:                 Literals.phoneLength,
    emailLength:                 Literals.emailLength,
    newSpecializationNameLength: Literals.employeeNewSpecializationNameLength,
    newPositionNameLength:       Literals.employeeNewPositionNameLength,
    errorRequired:               Literals.required,
    errorMaxLength:              Literals.maxlength,
    errorPhoneValidator:         Literals.phoneValidator,
    errorEmailValidator:         Literals.emailValidator,
    errorSelectedZeroValidator:  Literals.selectedZeroValidator,
    newFileName:                 Literals.empty,
    sizeImage:                   Literals.personSizeImage,
    registeredPhones:            [],
    registeredEmails:            [],
    allSpecializations:          [],
    specializationsList:         [],
    allPositions:                [],
    positionsList:               []
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения об Id пользователя для добавления/изменения сведений о сотруднике
  private _userId: number = Literals.zero;

  // режим добавления/изменения сведений о сотруднике
  public mode: string = Literals.empty;

  // сведения об Id выбранной компании
  private _companyId: number = Literals.zero;

  // сведения об Id выбранного сотрудника компании
  private _employeeId: number = Literals.zero;

  // сведения о сотруднике для добавления/изменения
  public employee: Employee = new Employee();


  // поле ввода имени сотрудника
  public employeeName: FormControl = new FormControl();

  // поле ввода номера телефона сотрудника
  public phone: FormControl = new FormControl();

  // поле ввода e-mail сотрудника
  public email: FormControl = new FormControl();

  // поле выбора специальности сотрудника
  public specializationId: FormControl = new FormControl(Literals.zero);

  // поле включения режима ввода новой специальности
  public isNewSpecialization: FormControl = new FormControl();

  // поле ввода наименования новой специальности
  public newSpecializationName: FormControl = new FormControl();

  // поле выбора должности сотрудника
  public positionId: FormControl = new FormControl(Literals.zero);

  // поле включения режима ввода новой должности
  public isNewPosition: FormControl = new FormControl();

  // поле ввода наименования новой должности
  public newPositionName: FormControl = new FormControl();

  // объект формы добавления/изменения данных об услуге
  public employeeForm: FormGroup = new FormGroup<any>({
    employeeName:          this.employeeName,
    phone:                 this.phone,
    email:                 this.email,
    specializationId:      this.specializationId,
    isNewSpecialization:   this.isNewSpecialization,
    newSpecializationName: this.newSpecializationName,
    positionId:            this.positionId,
    isNewPosition:         this.isNewPosition,
    newPositionName:       this.newPositionName
  });

  // дополнительные свойства
  protected readonly zero: number           = Literals.zero;
  protected readonly one: number            = Literals.one;
  protected readonly createEmployee: string = Literals.createEmployee;
  protected readonly editEmployee: string   = Literals.editEmployee;


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
    Utils.helloComponent(Literals.employeeForm);

    // получить маршрут и значение режима создания/изменения данных об услуге
    let items: string[] = this._router.url.slice(1).split(Literals.slash);
    this.component.route = items[0];
    this.component.route_mode = items[1].split(Literals.question)[0];

    // отключить списки выбора специальности и должности
    this.specializationId.disable();
    this.positionId.disable();

    // отключить чек-боксы включения режима ввода новых
    // значений специальности и должности
    this.isNewSpecialization.disable();
    this.isNewPosition.disable();

    // отключить поля ввода наименований новых
    // значений специальности и должности
    this.newSpecializationName.disable();
    this.newPositionName.disable();

  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);

    // в заголовке установить значение по умолчанию
    this.component.title = Resources.employeeFormTitleDefault[this.component.language];

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
    let employeeId: number = 0;
    // подписка на получение результата перехода по маршруту (данные из маршрута)
    this._activatedRoute.params.subscribe(params => {

      // параметр о режиме создания/изменения, полученный из маршрута
      mode = params[Literals.mode];
      this.mode = mode;

    }); // subscribe

    // подписка на получение результата перехода по маршруту (данные из параметров маршрута)
    this._activatedRoute.queryParams.subscribe(params => {

      // параметр об Id выбранной компании
      companyId = params[Literals.companyId] != undefined
        ? +params[Literals.companyId]
        : this.zero;
      this._companyId = companyId;

      // параметр об Id выбранного сотрудника
      employeeId = params[Literals.employeeId] != undefined
        ? +params[Literals.employeeId]
        : this.zero;
      this._employeeId = employeeId;

    }); // subscribe


    // проверки на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)

    // если режим не является режимом добавления ИЛИ изменения сотрудника,
    // требуется перейти на страницу "NotFound"
    if (this.mode != Literals.createEmployee && this.mode != Literals.editEmployee) {

      // "отключить" удаление временных папок с временными
      // фотографиями при уничтожении компонента
      this.component.isChangedFlag = true;

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject.next(
          Resources.incorrectData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // если Id компании НЕ добавлен ИЛИ введён НЕ_корректным,
    // требуется перейти на страницу "NotFound"
    if (this._companyId <= this.zero || isNaN(this._companyId)) {

      // "отключить" удаление временных папок с временными
      // фотографиями при уничтожении компонента
      this.component.isChangedFlag = true;

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectCompanyIdData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // если Id сотрудника НЕ добавлен ИЛИ введён НЕ_корректным,
    // требуется перейти на страницу "NotFound"
    if (this._employeeId < this.zero || isNaN(this._employeeId)) {

      // "отключить" удаление временных папок с временными
      // фотографиями при уничтожении компонента
      this.component.isChangedFlag = true;

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectEmployeeIdData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // если в режиме добавления добавлен Id сотрудника ИЛИ
    // в режиме изменения Id сотрудника НЕ добавлен,
    // требуется перейти на страницу "NotFound"
    if ((this.mode === Literals.createEmployee && this._employeeId > this.zero) ||
      (this.mode === Literals.editEmployee && this._employeeId === this.zero)) {

      // "отключить" удаление временных папок с временными
      // фотографиями при уничтожении компонента
      this.component.isChangedFlag = true;

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(this.mode === Literals.createEmployee
            ? Resources.employeeFormCreateEmployeeIncorrectData[this.component.language]
            : Resources.employeeFormEditEmployeeIncorrectData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // установим объекту сотрудника идентификатор
    this.employee.id = this._employeeId;

    // при режиме изменения! во время загрузки компонента
    // отправить запрос на получение данных об изменяемом сотруднике
    if (this.mode === Literals.editEmployee) {

      // запрос на получение записи о сотруднике из БД для изменения
      await this.requestGetEmployeeById();

      // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
      if (this.employee.id === this.zero) {

        // "отключить" удаление временных папок с временными
        // фотографиями при уничтожении компонента
        this.component.isChangedFlag = true;

        // перейти по маршруту на главную страницу
        this._router.navigateByUrl(Literals.routeHomeEmpty)
          .then((e) => { console.log(`*- переход: ${e} -*`); });

        return;
      } // if
    }
    else {

      // задать путь к файлу с фотографией по умолчанию
      this.employee.avatar = Literals.pathEmployeePhotoDef;

    } // if

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);


    // при загрузке компонента отправить запрос на удаление
    // временной папки со всеми временными фотографиями сотрудника
    await this.requestDeleteTempEmployeePhotos();


    // после получения данных о сотруднике отправить запрос на получение
    // параметров формы добавления/изменения данных о сотруднике
    await this.requestGetEmployeeFormParams();

    // создание объектов полей ввода/выбора и формы добавления/изменения данных о сотруднике
    this.createFormControls();
    this.createForm();

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title = this.mode === this.createEmployee
      ? Resources.employeeFormCreateTitle[this.component.language]
      : Resources.employeeFormEditTitleWithEmployeeName(this.component.language, this.employee.user.userName);
    this.component.labelEmployeeName                     = Resources.labelPersonName[this.component.language];
    this.component.labelPhone                            = Resources.labelPhone[this.component.language];
    this.component.labelEmail                            = Resources.labelEmail[this.component.language];
    this.component.labelSpecialization                   = Resources.labelSpecialization[this.component.language];
    this.component.labelNewSpecializationName            = Resources.employeeFormLabelNewSpecializationName[this.component.language];
    this.component.firstOptionSpecializations            = Resources.firstOptionSpecializations[this.component.language];
    this.component.labelCheckboxIsNewSpecializationTitle = Resources.employeeFormLabelCheckboxIsNewSpecializationTitle[this.component.language];
    this.component.labelCheckboxIsNewSpecialization      = Resources.labelNewShe[this.component.language];
    this.component.labelPosition                         = Resources.labelPosition[this.component.language];
    this.component.labelNewPositionName                  = Resources.employeeFormLabelNewPositionName[this.component.language];
    this.component.firstOptionPositions                  = Resources.firstOptionPositions[this.component.language];
    this.component.labelCheckboxIsNewPositionTitle       = Resources.employeeFormLabelCheckboxIsNewPositionTitle[this.component.language];
    this.component.labelCheckboxIsNewPosition            = Resources.labelNewShe[this.component.language];
    this.component.employeeNamePlaceholder               = Resources.employeeFormEmployeeNamePlaceholder[this.component.language];
    this.component.newSpecializationNamePlaceholder      = Resources.employeeFormNewSpecializationNamePlaceholder[this.component.language];
    this.component.newPositionNamePlaceholder            = Resources.employeeFormNewPositionNamePlaceholder[this.component.language];
    this.component.errorRequiredTitle                    = Resources.errorRequired[this.component.language];
    this.component.errorEmployeeNameMaxLengthTitle
      = Resources.employeeFormErrorEmployeeNameMaxLength(this.component.language, this.component.employeeNameLength);
    this.component.errorPhoneValidatorTitle              = Resources.errorPhoneValidator[this.component.language];
    this.component.phoneNoErrorsTitle = this.mode === this.createEmployee
      ? Resources.phoneNoErrors[this.component.language]
      : Literals.empty;
    this.component.errorEmailMaxLengthTitle
      = Resources.errorEmailMaxLength(this.component.language, this.component.emailLength);
    this.component.errorEmailValidatorTitle              = Resources.errorEmailValidator[this.component.language];
    this.component.errorSpecializationSelectedZeroValidatorTitle
      = Resources.employeeFormErrorSpecializationSelectedZeroValidator[this.component.language];
    this.component.errorNewSpecializationNameMaxLengthTitle
      = Resources.employeeFormErrorNewSpecializationNameMaxLength(this.component.language, this.component.newSpecializationNameLength);
    this.component.errorPositionSelectedZeroValidatorTitle
      = Resources.employeeFormErrorPositionSelectedZeroValidator[this.component.language];
    this.component.errorNewPositionNameMaxLengthTitle
      = Resources.employeeFormErrorNewPositionNameMaxLength(this.component.language, this.component.newPositionNameLength);
    this.component.errorNotMatchUserName.message
      = Resources.employeeFormErrorNotMatchUserName(this.component.language, this.employee.user.userName);
    this.component.errorNotMatchUserPhone.message
      = Resources.employeeFormErrorNotMatchUserPhone(this.component.language, this.employee.user.phone);
    this.component.errorNotMatchUserEmail.message
      = Resources.employeeFormErrorNotMatchUserEmail(this.component.language, this.employee.user.email);
    this.component.errorRegisteredPhone.message          = Resources.registeredPhone[this.component.language];
    this.component.errorRegisteredEmail.message          = Resources.registeredEmail[this.component.language];
    this.component.errorRegisteredSpecialization.message = Resources.employeeFormErrorRegisteredSpecialization[this.component.language];
    this.component.errorRegisteredPosition.message       = Resources.employeeFormErrorRegisteredPosition[this.component.language];
    this.component.photoTitle = this.mode === this.createEmployee
      ? Resources.employeeFormCreatePhotoTitle[this.component.language]
      : this.employee.user.userName;
    this.component.butEmployeeCreateTitle                = Resources.employeeFormButEmployeeCreateTitle[this.component.language];
    this.component.butEmployeeCreateValue                = Resources.butAddValue[this.component.language];
    this.component.butEmployeeEditTitle                  = Resources.employeeFormButEmployeeEditTitle[this.component.language];
    this.component.butEmployeeEditValue                  = Resources.butEditValue[this.component.language];
    this.component.butEmployeeFormCreateResetTitle       = Resources.employeeFormButEmployeeFormCreateResetTitle[this.component.language];
    this.component.butEmployeeFormCreateResetValue       = Resources.butResetValue[this.component.language];
    this.component.labelInputImage                       = Resources.labelInputPhoto[this.component.language];
    this.component.labelNewFileName                      = Resources.labelNewFileName[this.component.language];
    this.component.labelFileNotSelected                  = Resources.labelFileNotSelected[this.component.language];
    this.component.butNewFileNameTitle                   = Resources.butNewPhotoFileNameTitle[this.component.language];
    this.component.butNewFileNameValue                   = Resources.butNewFileNameValue[this.component.language];

  } // changeLanguageLiterals


  // запрос на получение записи о сотруднике из БД для изменения
  async requestGetEmployeeById(): Promise<void> {

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

    // запрос на получение записи о сотруднике
    let result: { message: any, employee: Employee } =
      { message: Literals.Ok, employee: new Employee() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetEmployeeById, this._employeeId, token)
      );

      result.employee = Employee.newEmployee(webResult.employee);
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
      if (result.message.employeeId != undefined)
        message = result.message.employeeId === this.zero
          ? Resources.incorrectEmployeeIdData[this.component.language]
          : Resources.notRegisteredEmployeeIdData[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);

      // при ошибках установить сотруднику нулевой идентификатор
      this.employee.id = this.zero;
    }
    else {

      // присвоить значение полученных данных
      this.employee = result.employee;

    } // if

  } // requestGetEmployeeById


  // выполнение запроса на удаление временной папки
  // со всеми временными фотографиями сотрудника
  async requestDeleteTempEmployeePhotos(): Promise<void> {

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

    // запрос на удаление временной папки со всеми временными фотографиями сотрудника
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      // тип изображения (тут не нужен)
      let imageType: string = Literals.empty;

      let webResult: any = await firstValueFrom(this._webApiService.deleteTempImages(
        Config.urlDeleteTempEmployeePhotos, this._userId, this.employee.id, imageType, token
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
      if (result.userId == this.zero)
        message = Resources.incorrectUserIdData[this.component.language];

      if (result.employeeId == this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      // ошибки существования папки
      if (result.directory != undefined && !result.directory)
        message = Resources.incorrectTempPhotosDirectory[this.component.language];

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
      result = Resources.deleteTempPhotosDirectoryOk[this.component.language];

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

  } // requestDeleteTempEmployeePhotos


  // запрос на получение параметров формы добавления/изменения данных о сотруднике
  async requestGetEmployeeFormParams(): Promise<void> {

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

    // запрос на получение параметров формы добавления/изменения данных о сотруднике
    let result: { message: any, allSpecializations: Specialization[], allPositions: Position[] } =
      { message: Literals.Ok, allSpecializations: [], allPositions: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.get(Config.urlGetEmployeeFormParams, token)
      );

      result.allSpecializations = Specialization.parseSpecializations(webResult.allSpecializations);
      result.allPositions       = Position.parsePositions(webResult.allPositions);
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
      // специальности
      this.component.allSpecializations = result.allSpecializations;

      // должности
      this.component.allPositions = result.allPositions;

      // создать массивы данных для списков выбора
      // специальности
      this.component.specializationsList = Specialization
        .parseSpecializationsToSelect(this.component.allSpecializations);

      // должности
      this.component.positionsList = Position
        .parsePositionsToSelect(this.component.allPositions);

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

  } // requestGetEmployeeFormParams


  // создание объектов полей ввода/выбора формы добавления/изменения данных о сотруднике
  createFormControls(): void {

    // поле ввода имени сотрудника
    this.employeeName = new FormControl(
      // начальное значение
      this.employee.user.userName,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.employeeNameLength)
      ]
    );

    // поле ввода телефона сотрудника
    this.phone = new FormControl(
      // начальное значение
      this.employee.user.phone,
      // синхронные валидаторы
      [
        Validators.required,
        UserValidators.phone
      ]
    );

    // поле ввода e-mail сотрудника
    this.email = new FormControl(
      // начальное значение
      this.employee.user.email,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.emailLength),
        UserValidators.email
      ]
    );


    // поле выбора специальности сотрудника
    this.specializationId = new FormControl(
      // начальное значение
      this.employee.specialization.id,
      // синхронные валидаторы
      [
        UserValidators.selectedZero
      ]
    );

    // поле включения режима ввода новой специальности
    this.isNewSpecialization = new FormControl(/*начальное значение*/false);

    // поле ввода наименования новой специальности
    this.newSpecializationName = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.newSpecializationNameLength)
      ]
    );
    // отключить поле ввода наименования новой специальности
    this.newSpecializationName.disable();


    // поле выбора должности сотрудника
    this.positionId = new FormControl(
      // начальное значение
      this.employee.position.id,
      // синхронные валидаторы
      [
        UserValidators.selectedZero
      ]
    );

    // поле включения режима ввода новой должности
    this.isNewPosition = new FormControl(/*начальное значение*/false);

    // поле ввода наименования новой должности
    this.newPositionName = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.newPositionNameLength)
      ]
    );
    // отключить поле ввода наименования новой должности
    this.newPositionName.disable();


    // подписка на изменения в чек-боксе включения режима ввода наименования новой специальности
    this.isNewSpecialization.valueChanges.subscribe((data: boolean) => {

      // если чек-бокс отмечен - включить поле ввода
      if (data) {

        // отключить список выбора
        this.specializationId.disable();

        // включить поле ввода наименования новой специальности
        this.newSpecializationName.enable();
      }
      // иначе - включить список
      else {

        // включить список выбора
        this.specializationId.enable();

        // отключить поле ввода наименования новой специальности
        this.newSpecializationName.disable();

      } // if

      // в поле ввода задать пустое значение
      this.newSpecializationName.setValue(Literals.empty);

    }); // subscribe


    // подписка на изменения в чек-боксе включения режима ввода наименования новой должности
    this.isNewPosition.valueChanges.subscribe((data: boolean) => {

      // если чек-бокс отмечен - включить поле ввода
      if (data) {

        // отключить список выбора
        this.positionId.disable();

        // включить поле ввода наименования новой должности
        this.newPositionName.enable();
      }
      // иначе - включить список
      else {

        // включить список выбора
        this.positionId.enable();

        // отключить поле ввода наименования новой должности
        this.newPositionName.disable();

      } // if

      // в поле ввода задать пустое значение
      this.newPositionName.setValue(Literals.empty);

    }); // subscribe

  } // createFormControls


  // создание объекта формы добавления/изменения данных о сотруднике
  createForm(): void {

    this.employeeForm = new FormGroup( {
      employeeName:          this.employeeName,
      phone:                 this.phone,
      email:                 this.email,
      specializationId:      this.specializationId,
      isNewSpecialization:   this.isNewSpecialization,
      newSpecializationName: this.newSpecializationName,
      positionId:            this.positionId,
      isNewPosition:         this.isNewPosition,
      newPositionName:       this.newPositionName
    });

    // подписка на изменения в форме
    this.employeeForm.valueChanges.subscribe((data: {
      employeeName: string, phone: string, email: string,
      specializationId: number, isNewSpecialization: boolean, newSpecializationName: string,
      positionId: number, isNewPosition: boolean, newPositionName: string
    }) => {

      // при имеющихся данных о пользователе, проводим проверку
      // правильности введённого имени, номера телефона и почты пользователя
      if (this.mode === this.createEmployee &&
          this.employee.user.id > this.zero &&
          data.employeeName != undefined) {

        this.checkingNotMatching(data.employeeName, Literals.userName);
        this.checkingNotMatching(data.phone, Literals.phone);
        this.checkingNotMatching(data.email, Literals.email);

      } // if

      // если в поле ввода наименования новой специальности вводится запись, то
      // проводим проверку на совпадение с уже зарегистрированными специальностями
      if (data.isNewSpecialization && data.newSpecializationName != undefined)
        this.checkingExisting(data.newSpecializationName, Literals.specialization);

      // если в поле ввода наименования новой должности вводится запись, то
      // проводим проверку на совпадение с уже зарегистрированными должностями
      if (data.isNewPosition && data.newPositionName != undefined)
        this.checkingExisting(data.newPositionName, Literals.position);

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      this.component.isChangedFormFlag = true;

    }); // subscribe


    // сбросить флаг изменений данных в форме
    this.component.isChangedFormFlag = false;

  } // createForm


  // проверка параметров на совпадение с уже зарегистрированными
  checkingExisting(data: any, mode: string): void {

    // проверка специальности
    if (mode === Literals.specialization) {

      // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных специальностей
      this.component.errorRegisteredSpecialization.isRegistered = this.component.allSpecializations
        .some((specialization: Specialization) => specialization.name.toLowerCase() === data.toLowerCase());

    } // if

    // проверка должности
    if (mode === Literals.position) {

      // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных должностей
      this.component.errorRegisteredPosition.isRegistered = this.component.allPositions
        .some((position: Position) => position.name.toLowerCase() === data.toLowerCase());

    } // if

  } // checkingExisting


  // проверка соответствия параметров
  checkingNotMatching(data: string, mode: string): void {

    // проверить соответствие имени пользователя
    if (mode === Literals.userName) {
      this.component.errorNotMatchUserName.isNotMatched = data != this.employee.user.userName;
      this.component.errorNotMatchUserName.message
        = Resources.employeeFormErrorNotMatchUserName(this.component.language, this.employee.user.userName);
    } // if

    // проверить соответствие номера телефона пользователя
    if (mode === Literals.phone) {
      this.component.errorNotMatchUserPhone.isNotMatched = data != this.employee.user.phone;
      this.component.errorNotMatchUserPhone.message
        = Resources.employeeFormErrorNotMatchUserPhone(this.component.language, this.employee.user.phone);
    } // if

    // проверить соответствие email пользователя
    if (mode === Literals.email) {
      this.component.errorNotMatchUserEmail.isNotMatched = data != this.employee.user.email;
      this.component.errorNotMatchUserEmail.message
        = Resources.employeeFormErrorNotMatchUserEmail(this.component.language, this.employee.user.email);
    } // if

  } // checkingNotMatching


  // обработчик события передачи данных из формы на сервер
  // (при режиме изменения данных имя, номер телефона и почту изменить не можем)
  async onSubmit(): Promise<void> {

    // задать значения параметров запроса

    // 1) имя сотрудника
    if (this.mode === this.createEmployee)
      this.employee.user.userName = this.employeeName.value;

    // 2) номер телефона сотрудника
    if (this.mode === this.createEmployee)
      this.employee.user.phone = this.phone.value;

    // 3) e-mail сотрудника
    if (this.mode === this.createEmployee)
      this.employee.user.email = this.email.value;

    // 3.2) при добавлении сотрудника - обнулим идентификатор пользователя сотрудника
    if (this.mode === this.createEmployee)
      this.employee.user.id = this.zero;

    // 4) данные о компании, в которую добавляют сотрудника
    if (this.mode === this.createEmployee)
      this.employee.company.id = this._companyId;

    // 5) данные о специальности сотрудника
    let specializationId: number = +this.specializationId.value;

    // получить выбранную специальность
    this.employee.specialization = this.isNewSpecialization.value
      ? new Specialization(this.zero, this.newSpecializationName.value, null)
      : this.component.allSpecializations
        .find((specialization: Specialization) => specialization.id === specializationId) ?? new Specialization();

    // 6) данные о должности сотрудника
    let positionId: number = +this.positionId.value;

    // получить выбранную должность
    this.employee.position = this.isNewPosition.value
      ? new Position(this.zero, this.newPositionName.value, null)
      : this.component.allPositions
        .find((position: Position) => position.id === positionId) ?? new Position();

    // 7) рейтинг сотрудника
    if (this.mode === this.createEmployee)
      this.employee.rating = this.zero;

    // 8) фотография сотрудника


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

      // иначе - переходим к последующим запросам
    } // if

    // получить jwt-токен
    let token: string = this._tokenService.token;

    // серия запросов при добавлении нового сотрудника
    // (требуется получить пользователя или зарегистрировать нового)
    if (this.mode === this.createEmployee) {

      // region 1. запрос на получение пользователя по телефону

      // 1. получить пользователя по номеру телефона
      let result1: { message: any, user: User } = { message: Literals.Ok, user: new User() };
      try {
        // получить пользователя по номеру телефона
        let webResult: any = await firstValueFrom(
          this._webApiService.getUserByPhone(Config.urlGetUserByPhone, this.employee.user.phone, token)
        );

        result1.user = User.newUser(webResult.user);
      }
      catch (e: any) {

        // ошибка авторизации ([Authorize])
        if (e.status === Literals.error401 && e.error === null)
          result1.message = Resources.unauthorizedUserIdData[this.component.language];
        // другие ошибки
        else
          result1.message = e.error;

      } // try-catch

      // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
      if (result1.message != Literals.Ok) {

        // сформируем соответствующее сообщение об ошибке
        let message: string = Literals.empty;

        // ошибки данных
        if (result1.message.phone === Literals.empty)
          message = Resources.incorrectPhoneData[this.component.language];

        // ошибки сервера
        if (result1.message.title != undefined) message = result1.message.title;

        // если результат уже содержит строку с сообщением
        if ((typeof result1.message) === Literals.string) message = result1.message;

        // изменить результат на сообщение для вывода
        result1.message = message;

        // метод для оптимизации кода - действия при выходе из метода onSubmit()
        this.exitFromOnSubmit(result1.message);
        return;
      }
      else {

        // если пользователь найден - присвоить значение полученных данных
        if (result1.user.id != this.zero)
          this.employee.user = result1.user;

      } // if

      // endregion

      // если пользователь НЕ найден (user.Id=0), то ищем пользователя по email
      if (this.employee.user.id === this.zero) {

        // region 2. запрос на получение пользователя по email

        // 2. получить пользователя по email
        let result2: { message: any, user: User } = { message: Literals.Ok, user: new User() };
        try {
          // получить пользователя по EMAIL
          let webResult: any = await firstValueFrom(
            this._webApiService.getUserByEmail(Config.urlGetUserByEmail, this.employee.user.email, token)
          );

          result2.user = User.newUser(webResult.user);
        }
        catch (e: any) {

          // ошибка авторизации ([Authorize])
          if (e.status === Literals.error401 && e.error === null)
            result2.message = Resources.unauthorizedUserIdData[this.component.language];
          // другие ошибки
          else
            result2.message = e.error;

        } // try-catch

        // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
        if (result2.message != Literals.Ok) {

          // сформируем соответствующее сообщение об ошибке
          let message: string = Literals.empty;

          // ошибки данных
          if (result2.message.email === Literals.empty)
            message = Resources.incorrectEmailData[this.component.language];

          // ошибки сервера
          if (result2.message.title != undefined) message = result2.message.title;

          // если результат уже содержит строку с сообщением
          if ((typeof result2.message) === Literals.string) message = result2.message;

          // изменить результат на сообщение для вывода
          result2.message = message;

          // метод для оптимизации кода - действия при выходе из метода onSubmit()
          this.exitFromOnSubmit(result2.message);
          return;
        }
        else {

          // если пользователь найден - присвоить значение полученных данных
          if (result2.user.id != this.zero)
            this.employee.user = result2.user;

        } // if

        // endregion

      } // if

      // если пользователь не найден (user.Id=0), то запрос на регистрацию
      if (this.employee.user.id === this.zero) {

        // region 3. запрос на регистрацию пользователя

        // 3. регистрация пользователя
        let result3: any = Literals.Ok;
        try {
          // регистрация пользователя
          let webResult: any = await firstValueFrom(this._webApiService.registrationPOST(
            Config.urlAuthRegistration,
            new LoginModel(
              this.employee.user.userName, this.employee.user.phone,
              this.employee.user.email, Literals.empty)
          ));
        }
        catch (e: any) {

          // если отсутствует соединение
          if (e.status === Literals.zero)
            result3 = Resources.noConnection[this._languageService.language];
          // другие ошибки
          else
            result3 = e.error;

        } // try-catch

        // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
        if (result3 != Literals.Ok) {

          // сформируем соответствующее сообщение об ошибке
          let message: string = Literals.empty;

          // ошибки данных
          if (result3.loginModel)
            message = Resources.registrationIncorrectData[this.component.language];

          // ошибки сервера
          if (result3.title != undefined) message = result3.title;

          // если результат уже содержит строку с сообщением
          if ((typeof result3) === Literals.string) message = result3;

          // !!! ошибки регистрации по номеру телефона и ошибки регистрации по email
          // должны быть исключены, т.к. выше таких записей мы не нашли
          // (ни пользователя с таким номером телефона, ни пользователя с таким email)

          // изменить результат на сообщение для вывода
          result3 = message;

          // метод для оптимизации кода - действия при выходе из метода onSubmit()
          this.exitFromOnSubmit(result3);
          return;
        }
        else {

          // иначе - сообщение об успехе
          result3 = Resources
            .employeeFormRegisteredUserOk(this.component.language, this.employee.user.userName);

          // передать сообщение об ошибке в AppComponent для отображения
          this._errorMessageService.errorMessageSubject.next(result3);

        } // if

        // endregion

        // region 4. запрос на получение зарегистрированного пользователя по телефону

        // 4. получить пользователя по номеру телефона
        let result4: { message: any, user: User } = { message: Literals.Ok, user: new User() };
        try {
          // получить пользователя по номеру телефона
          let webResult: any = await firstValueFrom(
            this._webApiService.getUserByPhone(Config.urlGetUserByPhone, this.employee.user.phone, token)
          );

          result4.user = User.newUser(webResult.user);
        }
        catch (e: any) {

          // ошибка авторизации ([Authorize])
          if (e.status === Literals.error401 && e.error === null)
            result4.message = Resources.unauthorizedUserIdData[this.component.language];
          // другие ошибки
          else
            result4.message = e.error;

        } // try-catch

        // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
        if (result4.message != Literals.Ok) {

          // сформируем соответствующее сообщение об ошибке
          let message: string = Literals.empty;

          // ошибки данных
          if (result4.message.phone === Literals.empty)
            message = Resources.incorrectPhoneData[this.component.language];

          // ошибки сервера
          if (result4.message.title != undefined) message = result4.message.title;

          // если результат уже содержит строку с сообщением
          if ((typeof result4.message) === Literals.string) message = result4.message;

          // изменить результат на сообщение для вывода
          result4.message = message;

          // метод для оптимизации кода - действия при выходе из метода onSubmit()
          this.exitFromOnSubmit(result4.message);
          return;
        }
        else {

          // если пользователь найден - присвоить значение полученных данных
          if (result4.user.id != this.zero)
            this.employee.user = result4.user;

        } // if

        // endregion

      } // if

      // проверка правильности введённых имени,
      // номера телефона и почты полученного пользователя
      if (this.employee.user.id != this.zero) {

        // проверка правильности введённых имени, номера телефона и почты пользователя
        this.checkingNotMatching(this.employeeName.value, Literals.userName);
        this.checkingNotMatching(this.phone.value, Literals.phone);
        this.checkingNotMatching(this.email.value, Literals.email);

        // если имя и почта пользователя введены неверно -
        // выходим из метода для повторного ввода данных
        if (this.component.errorNotMatchUserName.isNotMatched ||
            this.component.errorNotMatchUserPhone.isNotMatched ||
            this.component.errorNotMatchUserEmail.isNotMatched) {

          // выключение спиннера ожидания данных
          this.component.isWaitFlag = false;

          return;
        } // if

      } // if

      // region 5. запрос на проверку регистрации пользователя в других компаниях

      // 5. проверка регистрации пользователя в других компаниях
      let result5: { message: any, employee: Employee } = { message: Literals.Ok, employee: new Employee() };
      try {
        // проверка регистрации пользователя в других компаниях
        let webResult: any = await firstValueFrom(
          this._webApiService.getById(Config.urlGetEmployeeByUserId, this.employee.user.id, token)
        );

        result5.employee = Employee.newEmployee(webResult.employee);
      }
      catch (e: any) {

        // если отсутствует соединение
        if (e.status === this.zero)
          result5.message = Resources.noConnection[this._languageService.language];
        // ошибка авторизации ([Authorize])
        else if (e.status === Literals.error401 && e.error === null)
          result5.message = Resources.unauthorizedUserIdData[this.component.language];
        // другие ошибки
        else
          result5.message = e.error;

      } // try-catch

      // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
      if (result5.message != Literals.Ok) {

        // сформируем соответствующее сообщение об ошибке
        let message: string = Literals.empty;

        // ошибки данных
        if (result5.message.userId === this.zero)
          message = Resources.incorrectUserIdData[this.component.language];

        // ошибки сервера
        if (result5.message.title != undefined) message = result5.message.title;

        // если результат уже содержит строку с сообщением
        if ((typeof result5.message) === Literals.string) message = result5.message;

        // изменить результат на сообщение для вывода
        result5.message = message;

        // метод для оптимизации кода - действия при выходе из метода onSubmit()
        this.exitFromOnSubmit(result5.message);
        return;
      }
      else {

        // проверка полученных результатов
        if (result5.employee.id != this.zero) {

          // пользователь уже зарегистрирован как сотрудник в другой компании
          result5.message = Resources.employeeFormUserRegisteredInCompany(
            this.component.language, result5.employee.user.userName, result5.employee.company.name
          );

          // сбросить данные в форме
          this.resetData();

          // метод для оптимизации кода - действия при выходе из метода onSubmit()
          this.exitFromOnSubmit(result5.message);
          return;
        }
        else {

          // пользователь НЕ зарегистрирован как сотрудник в других компаниях
          // МОЖНО ОФОРМЛЯТЬ! - сообщение об успехе
          result5.message = Resources
            .employeeFormUserNotRegisteredInCompanies[this.component.language];

          // передать сообщение об ошибке в AppComponent для отображения
          this._errorMessageService.errorMessageSubject.next(result5.message);

        } // if

      } // if

      // endregion

    } // if


    // region 6. запрос на добавление/изменение данных о сотруднике -----------

    // 6. запрос на добавление/изменение данных о сотруднике
    let result6: any = Literals.Ok;
    try {
      let webResult: any = await firstValueFrom(
        this.mode === this.createEmployee
          ? this._webApiService.createEmployeePUT(Config.urlCreateEmployee, this.employee, token)
          : this._webApiService.editEmployeePOST(Config.urlEditEmployee, this.employee, token)
      );
    }
    catch (e: any) {

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null)
        result6 = Resources.unauthorizedUserIdData[this.component.language];
      // другие ошибки
      else
        result6 = e.error;

    } // try-catch

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result6 != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result6.employeeId != undefined)
        message = result6.employeeId === this.zero
          ? Resources.incorrectEmployeeIdData[this.component.language]
          : Resources.notRegisteredEmployeeIdData[this.component.language];

      if (result6.userId === this.zero)
        message = Resources.notRegisteredUserIdData[this.component.language];

      if (result6.avatar != undefined)
        message = Resources.employeeFormIncorrectAvatar[this.component.language];

      if (result6.specializationId === this.zero)
        message = Resources.notRegisteredSpecializationIdData[this.component.language];

      if (result6.positionId === this.zero)
        message = Resources.notRegisteredPositionIdData[this.component.language];

      if (result6.companyId === this.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

      // ошибки сервера
      if (result6.title != undefined) message = result6.title;

      if (result6.createMessage != undefined) message = result6.createMessage;

      if (result6.updateMessage != undefined) message = result6.updateMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result6) === Literals.string) message = result6;

      // изменить результат на сообщение для вывода
      result6 = message;

      // сбросить флаг изменений данных в форме
      this.component.isChangedFormFlag = false;

      // переход в начало страницы
      Utils.toStart();
    }
    else {

      // иначе - сообщение об успехе
      result6 = this.mode === this.createEmployee
        ? Resources.employeeFormCreateOkData[this.component.language]
        : Resources.employeeFormEditOkData[this.component.language];

      // установить флаг добавления/изменения данных о сотруднике в true
      this.component.isChangedFlag = true;

      // перейти по маршруту на страницу управления персоналом салона
      this._router.navigateByUrl(`${Literals.routeEmployees}/${this._companyId}`)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result6);

    // endregion --------------------------------------------------------------

  } // onSubmit


  // обработчик события получения данных о выбранном файле изображения
  // (запрос на загрузку файла с изображением)
  async sendFileHandler(file: File): Promise<void> {

    // изменение значения имени выбранного файла
    // и его передача компоненту выбора для отображения
    this.component.newFileName = file.name;

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
    let result: { message: any, avatar: string } =
      { message: Literals.Ok, avatar: Literals.empty };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      // получить имя папки с временной фотографией для режима создания,
      // т.к. ID=0 - НЕ УНИКАЛЬНЫЙ!!!
      let tempDir: string = Literals.empty;
      if (this.employee.id === this.zero) {

        let items: string[] = this.employee.avatar.split(Literals.slash);
        let dir: string = items[items.length - 2];

        tempDir = dir.startsWith(Literals.temp) ? dir : tempDir;

      } // if

      // тип изображения (тут не нужен)
      let imageType: string = Literals.empty;

      // запрос на загрузку файла с изображением
      let webResult: any = await firstValueFrom(this._webApiService.uploadImagePOST(
        Config.urlUploadTempEmployeePhoto, file, this._userId,
        this.employee.id, tempDir, imageType, token
      ));

      result.avatar = webResult.avatar;
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
      if (result.message.avatar === Literals.empty)
        message = Resources.incorrectFileData[this.component.language];

      if (result.message.userId == this.zero)
        message = Resources.incorrectUserIdData[this.component.language];

      if (result.message.employeeId == this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // изменить результат на сообщение для вывода
      result.message = message;

      // передать в компонент выбора пустое значение выбранного файла
      this.component.newFileName = Literals.empty;

      // сбросить флаг изменений данных в форме
      this.component.isChangedFormFlag = false;
    }
    else {

      // иначе - сообщение об успехе
      result.message = Resources.uploadImageOkData[this.component.language];

      // установить объекту с данными о сотруднике
      // временный путь расположения выбранной фотографии
      this.employee.avatar = result.avatar;

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      this.component.isChangedFormFlag = true;

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

  } // sendFileHandler


  // сброс данных, введённых в форме
  resetData(): void {

    // сбросить данные о пользователе
    this.employee.user = new User();

    // сбросить данные полей ввода и списков выбора
    this.employeeName.setValue(Literals.empty);
    this.phone.setValue(Literals.empty);
    this.email.setValue(Literals.empty);

    if (this.specializationId.disabled) this.specializationId.enable();
    if (this.newSpecializationName.enabled) this.newSpecializationName.disable();
    if (this.isNewSpecialization.value) this.isNewSpecialization.setValue(false);
    this.specializationId.setValue(this.zero);

    if (this.positionId.disabled) this.positionId.enable();
    if (this.newPositionName.enabled) this.newPositionName.disable();
    if (this.isNewPosition.value) this.isNewPosition.setValue(false);
    this.positionId.setValue(this.zero);

    // сбросить значения параметров для проверки несовпадения
    // параметров с найденным пользователем
    this.component.errorNotMatchUserName.isNotMatched  = false;
    this.component.errorNotMatchUserPhone.isNotMatched = false;
    this.component.errorNotMatchUserEmail.isNotMatched = false;

  } // resetData


  // метод для оптимизации кода - действия при выходе из метода onSubmit()
  private exitFromOnSubmit(message: string): void {

    // сбросить флаг изменений данных в форме
    this.component.isChangedFormFlag = false;

    // переход в начало страницы
    Utils.toStart();

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(message);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

  } // exitFromOnSubmit


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
    // временной папки со всеми временными фотографиями сотрудника
    let userIsLogin: boolean = this._userService.user.isLogin;
    if (!this.component.isChangedFlag && userIsLogin) {

      // запрос на удаление временной папки
      // со всеми временными фотографиями сотрудника
      await this.requestDeleteTempEmployeePhotos();

    } // if

  } // ngOnDestroy

} // class EmployeeFormComponent
// ----------------------------------------------------------------------------
