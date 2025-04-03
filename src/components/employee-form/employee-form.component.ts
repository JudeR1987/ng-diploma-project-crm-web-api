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
    /*
    labelPriceMin:                                   Literals.empty,
    labelPriceMax:                                   Literals.empty,
    labelDuration:                                   Literals.empty,
    labelComment:                                    Literals.empty,

    commentPlaceholder:                              Literals.empty,
    errorRegisteredServicesCategoryName:             {message: Literals.empty, isRegistered: false},
    errorServiceNameMaxLengthTitle:                  Literals.empty,
    errorMinValueTitle:                              Literals.empty,
    errorPriceMaxValueTitle:                         Literals.empty,
    errorDurationMaxValueTitle:                      Literals.empty,
    errorCommentMaxLengthTitle:                      Literals.empty,
    butServiceCreateTitle:                           Literals.empty,
    butServiceCreateValue:                           Literals.empty,
    butServiceEditTitle:                             Literals.empty,
    butServiceEditValue:                             Literals.empty,*/
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
    /*serviceNameLength:         Literals.serviceNameLength,
    priceMaxValue:               Literals.serviceFormPriceMaxValue,
    durationMaxValue:            Literals.serviceFormDurationMax,
    commentLength:               Literals.serviceCommentLength,
    errorMinValue:               Literals.min,
    errorMaxValue:               Literals.max,*/
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
  protected readonly hundred: number        = Literals.hundred;
  protected readonly fifteen: number        = Literals.fifteen;


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

    console.log(`[-EmployeeFormComponent-constructor--`);

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

    console.log(`*-this._userId: '${this._userId}' -*`);
    console.log(`*-this.mode: '${this.mode}' -*`);
    console.log(`*-this._companyId: '${this._companyId}' -*`);
    console.log(`*-this._employeeId: '${this._employeeId}' -*`);
    console.log(`*-this.employee-*`);
    console.dir(this.employee);

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

    console.log(`--EmployeeFormComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-EmployeeFormComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // в заголовке установить значение по умолчанию
    this.component.title = Resources.employeeFormTitleDefault[this.component.language];

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-EmployeeFormComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--EmployeeFormComponent-subscribe-]`);
      }); // subscribe

    // получить данные о пользователе из сервиса-хранилища
    console.log(`*-(было)-this._userId: '${this._userId}'-*`);
    this._userId = this._userService.user.id;
    console.log(`*-(стало)-this._userId: '${this._userId}' -*`);


    // получить параметры маршрута
    console.dir(this._activatedRoute);
    console.dir(this._activatedRoute.params);
    console.dir(this._activatedRoute.queryParams);
    let mode: string = Literals.empty;
    let companyId: number = 0;
    let employeeId: number = 0;
    // подписка на получение результата перехода по маршруту (данные из маршрута)
    this._activatedRoute.params.subscribe(params => {

      // параметр о режиме создания/изменения, полученный из маршрута
      mode = params[Literals.mode];
      console.log(`*-mode: '${mode}' [${typeof mode}] -*`);

      console.log(`*-(было)-this.mode: '${this.mode}' -*`);
      this.mode = mode;
      console.log(`*-(стало)-this.mode: '${this.mode}' -*`);

    }); // subscribe

    // подписка на получение результата перехода по маршруту (данные из параметров маршрута)
    this._activatedRoute.queryParams.subscribe(params => {

      // параметр об Id выбранной компании
      console.log(`*-params['companyId']: '${params[Literals.companyId]}' -*`);
      companyId = params[Literals.companyId] != undefined
        ? +params[Literals.companyId]
        : this.zero;
      console.log(`*-companyId: '${companyId}' [${typeof companyId}] -*`);

      console.log(`*-(было)-this._companyId: '${this._companyId}' -*`);
      this._companyId = companyId;
      console.log(`*-(стало)-this._companyId: '${this._companyId}' -*`);

      // параметр об Id выбранного сотрудника
      console.log(`*-params['employeeId']: '${params[Literals.employeeId]}' -*`);
      employeeId = params[Literals.employeeId] != undefined
        ? +params[Literals.employeeId]
        : this.zero;
      console.log(`*-employeeId: '${employeeId}' [${typeof employeeId}] -*`);

      console.log(`*-(было)-this._employeeId: '${this._employeeId}' -*`);
      this._employeeId = employeeId;
      console.log(`*-(стало)-this._employeeId: '${this._employeeId}' -*`);

    }); // subscribe


    // проверки на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)
    console.log(`*-this.mode: '${this.mode}' -*`);
    console.log(`*-this._companyId: '${this._companyId}' -*`);
    console.log(`*-this._employeeId: '${this._employeeId}' -*`);

    // если режим не является режимом добавления ИЛИ изменения сотрудника,
    // требуется перейти на страницу "NotFound"
    if (this.mode != Literals.createEmployee && this.mode != Literals.editEmployee) {
      console.log(`*- Переход на "NotFound" - 'TRUE' -*`);

      // "отключить" удаление временных папок с временными
      // фотографиями при уничтожении компонента
      this.component.isChangedFlag = true;

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject.next(
          Resources.incorrectData[this.component.language]);

        console.log(`--EmployeeFormComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "NotFound" - 'FALSE' -*`);


    // если Id компании НЕ добавлен ИЛИ введён НЕ_корректным,
    // требуется перейти на страницу "NotFound"
    if (this._companyId <= this.zero || isNaN(this._companyId)) {
      console.log(`*- Переход на "NotFound" - 'TRUE' -*`);

      // "отключить" удаление временных папок с временными
      // фотографиями при уничтожении компонента
      this.component.isChangedFlag = true;

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectCompanyIdData[this.component.language]);

        console.log(`--EmployeeFormComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "NotFound" - 'FALSE' -*`);


    // если Id сотрудника НЕ добавлен ИЛИ введён НЕ_корректным,
    // требуется перейти на страницу "NotFound"
    if (this._employeeId < this.zero || isNaN(this._employeeId)) {
      console.log(`*- Переход на "NotFound" - 'TRUE' -*`);

      // "отключить" удаление временных папок с временными
      // фотографиями при уничтожении компонента
      this.component.isChangedFlag = true;

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectEmployeeIdData[this.component.language]);

        console.log(`--EmployeeFormComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "NotFound" - 'FALSE' -*`);


    // если в режиме добавления добавлен Id сотрудника ИЛИ
    // в режиме изменения Id сотрудника НЕ добавлен,
    // требуется перейти на страницу "NotFound"
    if ((this.mode === Literals.createEmployee && this._employeeId > this.zero) ||
      (this.mode === Literals.editEmployee && this._employeeId === this.zero)) {
      console.log(`*- Переход на "NotFound" - 'TRUE' -*`);

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

        console.log(`--EmployeeFormComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "NotFound" - 'FALSE' -*`);


    // установим объекту сотрудника идентификатор
    console.log(`*-(было)-this.employee.id: '${this.employee.id}' -*`);
    this.employee.id = this._employeeId;
    console.log(`*-(стало)-this.employee.id: '${this.employee.id}' -*`);

    console.log(`*-(было)-this.employee: -*`);
    console.dir(this.employee);

    // при режиме изменения! во время загрузки компонента
    // отправить запрос на получение данных об изменяемом сотруднике
    console.log(`*-this.mode: '${this.mode}' -*`);
    if (this.mode === Literals.editEmployee) {
      console.log(`*- получить сотрудника с ID=${this._employeeId} -*`);

      // запрос на получение записи о сотруднике из БД для изменения
      await this.requestGetEmployeeById();

      // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
      if (this.employee.id === this.zero) {
        console.log(`*- Переход на "Home" - 'TRUE' -*`);

        // "отключить" удаление временных папок с временными
        // фотографиями при уничтожении компонента
        this.component.isChangedFlag = true;

        // перейти по маршруту на главную страницу
        this._router.navigateByUrl(Literals.routeHomeEmpty).then((e) => {
          console.log(`*- переход: ${e} -*`);

          console.log(`--EmployeeFormComponent-ngOnInit-]`);
        }); // navigateByUrl

        return;
      } // if
      console.log(`*- Переход на "Home" - 'FALSE' -*`);

    } else {
      console.log(`*- задать параметры для нового сотрудника -*`);

      // задать путь к файлу с фотографией по умолчанию
      console.log(`*-(было)-this.employee.avatar: '${this.employee.avatar}' -*`);
      this.employee.avatar = Literals.pathEmployeePhotoDef;
      console.log(`*-(стало)-this.employee.avatar: '${this.employee.avatar}' -*`);

    } // if

    console.log(`*-(стало)-this.employee: -*`);
    console.dir(this.employee);

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

    console.log(`--EmployeeFormComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-EmployeeFormComponent-changeLanguageLiterals--`);

    console.log(`*-input(пришло)-language='${language}'-*`);
    console.log(`*-(было)-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-(стало)-this.component.language='${this.component.language}'-*`);

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
    /*
    this.component.labelPriceMin                           = Resources.labelPriceMin[this.component.language];
    this.component.labelPriceMax                           = Resources.labelPriceMax[this.component.language];
    this.component.labelDuration                           = Resources.labelDuration[this.component.language];
    this.component.labelComment                            = Resources.labelComment[this.component.language];

    this.component.commentPlaceholder                      = Resources.serviceFormCommentPlaceholder[this.component.language];

    this.component.errorRegisteredServicesCategoryName.message
      = Resources.serviceFormErrorRegisteredServicesCategoryName[this.component.language];
    this.component.errorServiceNameMaxLengthTitle          = Resources.errorNameMaxLength(this.component.language, this.component.serviceNameLength);
    this.component.errorMinValueTitle                      = Resources.errorMinMaxValue(this.component.language, Literals.min, this.one);
    this.component.errorPriceMaxValueTitle                 = Resources.errorMinMaxValue(this.component.language, Literals.max, this.component.priceMaxValue);
    this.component.errorDurationMaxValueTitle              = Resources.errorMinMaxValue(this.component.language, Literals.max, this.component.durationMaxValue);
    this.component.errorCommentMaxLengthTitle              = Resources.errorCommentMaxLength(this.component.language, this.component.commentLength);
    */
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
    console.log(`--EmployeeFormComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение записи о сотруднике из БД для изменения
  async requestGetEmployeeById(): Promise<void> {
    console.log(`[-EmployeeFormComponent-requestGetEmployeeById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeeFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeeFormComponent-requestGetEmployeeById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeeFormComponent-1-(запрос на получение сотрудника)-`);

    // запрос на получение записи о сотруднике
    let result: { message: any, employee: Employee } =
      { message: Literals.Ok, employee: new Employee() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetEmployeeById, this._employeeId, token)
      );
      console.dir(webResult);

      result.employee = Employee.newEmployee(webResult.employee);

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

    console.log(`--EmployeeFormComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.employee);

    console.log(`--EmployeeFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.employeeId: '${result.message.employeeId}'`);
      if (result.message.employeeId != undefined)
        message = result.message.employeeId === this.zero
          ? Resources.incorrectEmployeeIdData[this.component.language]
          : Resources.notRegisteredEmployeeIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);

      // при ошибках установить сотруднику нулевой идентификатор
      this.employee.id = this.zero;

    } else {

      // присвоить значение полученных данных
      this.employee = result.employee;

    } // if

    console.log(`--EmployeeFormComponent-requestGetEmployeeById-]`);
  } // requestGetEmployeeById


  // выполнение запроса на удаление временной папки
  // со всеми временными фотографиями сотрудника
  async requestDeleteTempEmployeePhotos(): Promise<void> {
    console.log(`[-EmployeeFormComponent-requestDeleteTempEmployeePhotos--`);

    console.log(`*-this.employee-*`);
    console.dir(this.employee);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeeFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeeFormComponent-requestDeleteTempEmployeePhotos-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeeFormComponent-1-(запрос на удаление)-`);

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

    console.log(`--EmployeeFormComponent-result:`);
    console.dir(result);

    console.log(`--EmployeeFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - сформируем соответствующее сообщение об ошибке
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.userId: '${result.userId}'`);
      if (result.userId == this.zero)
        message = Resources.incorrectUserIdData[this.component.language];

      console.log(`--result.employeeId: '${result.employeeId}'`);
      if (result.employeeId == this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      // ошибки существования папки
      console.log(`--result.directory: '${result.directory}'`);
      if (result.directory != undefined && !result.directory)
        message = Resources.incorrectTempPhotosDirectory[this.component.language];

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
      result = Resources.deleteTempPhotosDirectoryOk[this.component.language];
    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

    console.log(`--EmployeeFormComponent-requestDeleteTempEmployeePhotos-]`);
  } // requestDeleteTempEmployeePhotos


  // запрос на получение параметров формы добавления/изменения данных о сотруднике
  async requestGetEmployeeFormParams(): Promise<void> {
    console.log(`[-EmployeeFormComponent-requestGetEmployeeFormParams--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeeFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeeFormComponent-requestGetEmployeeFormParams-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeeFormComponent-1-(запрос на получение параметров формы)-`);

    // запрос на получение параметров формы добавления/изменения данных о сотруднике
    let result: { message: any, allSpecializations: Specialization[], allPositions: Position[] } =
      { message: Literals.Ok, allSpecializations: [], allPositions: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.get(Config.urlGetEmployeeFormParams, token)
      );
      console.dir(webResult);

      result.allSpecializations = Specialization.parseSpecializations(webResult.allSpecializations);
      result.allPositions       = Position.parsePositions(webResult.allPositions);

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

    console.log(`--EmployeeFormComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.allSpecializations);
    console.dir(result.allPositions);

    console.log(`--EmployeeFormComponent-2-(ответ на запрос получен)-`);

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
      // специальности
      this.component.allSpecializations = result.allSpecializations;
      console.log(`*- this.component.allSpecializations: -*`);
      console.dir(this.component.allSpecializations);

      // должности
      this.component.allPositions = result.allPositions;
      console.log(`*- this.component.allPositions: -*`);
      console.dir(this.component.allPositions);

      // создать массивы данных для списков выбора
      // специальности
      this.component.specializationsList = Specialization
        .parseSpecializationsToSelect(this.component.allSpecializations);
      console.log(`*- this.component.specializationsList: -*`);
      console.dir(this.component.specializationsList);

      // должности
      this.component.positionsList = Position
        .parsePositionsToSelect(this.component.allPositions);
      console.log(`*- this.component.positionsList: -*`);
      console.dir(this.component.positionsList);

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

    console.log(`--EmployeeFormComponent-requestGetEmployeeFormParams-]`);
  } // requestGetEmployeeFormParams


  // создание объектов полей ввода/выбора формы добавления/изменения данных о сотруднике
  createFormControls(): void {
    console.log(`[-EmployeeFormComponent-createFormControls--`);

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


    // подписка на изменения в поле выбора специальности сотрудника
    this.specializationId.valueChanges.subscribe((specializationId: number) => {
      console.log(`[-EmployeeFormComponent-this.specializationId.valueChanges.subscribe--`);
      console.log(`*- при выборе специальности ... -*`);

      // сменим тип данных на параметре выбора Id специальности
      console.log(`*- specializationId: '${specializationId}' [${typeof specializationId}]`);
      specializationId = +specializationId;
      console.log(`*- specializationId: '${specializationId}' [${typeof specializationId}]`);

      console.log(`--EmployeeFormComponent-this.specializationId.valueChanges.subscribe-]`);
    }); // subscribe


    // подписка на изменения в чек-боксе включения режима ввода наименования новой специальности
    this.isNewSpecialization.valueChanges.subscribe((data: boolean) => {
      console.log(`[-EmployeeFormComponent-this.isNewSpecialization.valueChanges.subscribe--`);

      console.log(`*- this.isNewSpecialization.value: '${this.isNewSpecialization.value}' -*`);
      console.log(`*- data: '${data}' -*`);

      // если чек-бокс отмечен - включить поле ввода
      if (data) {

        // отключить список выбора
        console.log(`*-(было)- this.specializationId.disabled: '${this.specializationId.disabled}' -*`);
        this.specializationId.disable();
        console.log(`*-(стало)- this.specializationId.disabled: '${this.specializationId.disabled}' -*`);

        // включить поле ввода наименования новой специальности
        console.log(`*-(было)- this.newSpecializationName.enabled: '${this.newSpecializationName.enabled}' -*`);
        this.newSpecializationName.enable();
        console.log(`*-(стало)- this.newSpecializationName.enabled: '${this.newSpecializationName.enabled}' -*`);

      } else { // иначе - включить список

        // включить список выбора
        console.log(`*-(было)- this.specializationId.enabled: '${this.specializationId.enabled}' -*`);
        this.specializationId.enable();
        console.log(`*-(стало)- this.specializationId.enabled: '${this.specializationId.enabled}' -*`);

        // отключить поле ввода наименования новой специальности
        console.log(`*-(было)- this.newSpecializationName.disabled: '${this.newSpecializationName.disabled}' -*`);
        this.newSpecializationName.disable();
        console.log(`*-(стало)- this.newSpecializationName.disabled: '${this.newSpecializationName.disabled}' -*`);

      } // if

      // в поле ввода задать пустое значение
      console.log(`*-(было)- this.newSpecializationName.value: '${this.newSpecializationName.value}' -*`);
      this.newSpecializationName.setValue(Literals.empty);
      console.log(`*-(стало)- this.newSpecializationName.value: '${this.newSpecializationName.value}' -*`);

      console.log(`--EmployeeFormComponent-this.newSpecializationName.valueChanges.subscribe-]`);
    }); // subscribe


    // подписка на изменения в поле выбора должности сотрудника
    this.positionId.valueChanges.subscribe((positionId: number) => {
      console.log(`[-EmployeeFormComponent-this.positionId.valueChanges.subscribe--`);
      console.log(`*- при выборе должности ... -*`);

      // сменим тип данных на параметре выбора Id должности
      console.log(`*- positionId: '${positionId}' [${typeof positionId}]`);
      positionId = +positionId;
      console.log(`*- positionId: '${positionId}' [${typeof positionId}]`);

      console.log(`--EmployeeFormComponent-this.positionId.valueChanges.subscribe-]`);
    }); // subscribe


    // подписка на изменения в чек-боксе включения режима ввода наименования новой должности
    this.isNewPosition.valueChanges.subscribe((data: boolean) => {
      console.log(`[-EmployeeFormComponent-this.isNewPosition.valueChanges.subscribe--`);

      console.log(`*- this.isNewPosition.value: '${this.isNewPosition.value}' -*`);
      console.log(`*- data: '${data}' -*`);

      // если чек-бокс отмечен - включить поле ввода
      if (data) {

        // отключить список выбора
        console.log(`*-(было)- this.positionId.disabled: '${this.positionId.disabled}' -*`);
        this.positionId.disable();
        console.log(`*-(стало)- this.positionId.disabled: '${this.positionId.disabled}' -*`);

        // включить поле ввода наименования новой должности
        console.log(`*-(было)- this.newPositionName.enabled: '${this.newPositionName.enabled}' -*`);
        this.newPositionName.enable();
        console.log(`*-(стало)- this.newPositionName.enabled: '${this.newPositionName.enabled}' -*`);

      } else { // иначе - включить список

        // включить список выбора
        console.log(`*-(было)- this.positionId.enabled: '${this.positionId.enabled}' -*`);
        this.positionId.enable();
        console.log(`*-(стало)- this.positionId.enabled: '${this.positionId.enabled}' -*`);

        // отключить поле ввода наименования новой должности
        console.log(`*-(было)- this.newPositionName.disabled: '${this.newPositionName.disabled}' -*`);
        this.newPositionName.disable();
        console.log(`*-(стало)- this.newPositionName.disabled: '${this.newPositionName.disabled}' -*`);

      } // if

      // в поле ввода задать пустое значение
      console.log(`*-(было)- this.newPositionName.value: '${this.newPositionName.value}' -*`);
      this.newPositionName.setValue(Literals.empty);
      console.log(`*-(стало)- this.newPositionName.value: '${this.newPositionName.value}' -*`);

      console.log(`--EmployeeFormComponent-this.newPositionName.valueChanges.subscribe-]`);
    }); // subscribe

    console.log(`--EmployeeFormComponent-createFormControls-]`);
  } // createFormControls


  // создание объекта формы добавления/изменения данных о сотруднике
  createForm(): void {
    console.log(`[-EmployeeFormComponent-createForm--`);

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
      console.log(`[-EmployeeFormComponent-this.employeeForm.valueChanges.subscribe--`);
      console.log(`*- data -*`);
      console.dir(data);

      console.log(`*- this.specializationId.value: '${this.specializationId.value}' -*`);
      console.log(`*- data.specializationId: '${data.specializationId}' -*`);
      console.log(`*- this.isNewSpecialization.value: '${this.isNewSpecialization.value}' -*`);
      console.log(`*- data.isNewSpecialization: '${data.isNewSpecialization}' -*`);
      console.log(`*- this.newSpecializationName.value: '${this.newSpecializationName.value}' -*`);
      console.log(`*- data.newSpecializationName: '${data.newSpecializationName}' -*`);

      console.log(`*- this.positionId.value: '${this.positionId.value}' -*`);
      console.log(`*- data.positionId: '${data.positionId}' -*`);
      console.log(`*- this.isNewPosition.value: '${this.isNewPosition.value}' -*`);
      console.log(`*- data.isNewPosition: '${data.isNewPosition}' -*`);
      console.log(`*- this.newPositionName.value: '${this.newPositionName.value}' -*`);
      console.log(`*- data.newPositionName: '${data.newPositionName}' -*`);

      console.log(`*- data.employeeName: '${data.employeeName}' -*`);

      // при имеющихся данных о пользователе, проводим проверку
      // правильности введённого имени, номера телефона и почты пользователя
      if (this.mode === this.createEmployee &&
          this.employee.user.id > this.zero &&
          data.employeeName != undefined) {
        this.checkingNotMatching(data.employeeName, Literals.userName);
        this.checkingNotMatching(data.phone, Literals.phone);
        this.checkingNotMatching(data.email, Literals.email);
      } // if


      // проверка номера телефона и email на совпадение с зарегистрированными
      //this.checkingExisting({ phone: data.phone, email: data.email }, Literals.empty);

      // если в поле ввода наименования новой специальности вводится запись, то
      // проводим проверку на совпадение с уже зарегистрированными специальностями
      if (data.isNewSpecialization && data.newSpecializationName != undefined)
        this.checkingExisting(data.newSpecializationName, Literals.specialization);

      // если в поле ввода наименования новой должности вводится запись, то
      // проводим проверку на совпадение с уже зарегистрированными должностями
      if (data.isNewPosition && data.newPositionName != undefined)
        this.checkingExisting(data.newPositionName, Literals.position);

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
      this.component.isChangedFormFlag = true;
      console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

      console.log(`--EmployeeFormComponent-this.employeeForm.valueChanges.subscribe-]`);
    }); // subscribe


    // сбросить флаг изменений данных в форме
    console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
    this.component.isChangedFormFlag = false;
    console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

    console.log(`--EmployeeFormComponent-createForm-]`);
  } // createForm


  // проверка параметров на совпадение с уже зарегистрированными
  checkingExisting(data: any, mode: string): void {
    console.log(`[-EmployeeFormComponent-checkingExisting--`);

    console.log(`*- data: -*`);
    console.dir(data);

    console.log(`*- mode: '${mode}' -*`);

    // проверка номера телефона и email
    /*if (mode === Literals.empty) {

      // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных номеров телефонов
      this.component.errorRegisteredPhone.isRegistered =
        this.component.registeredPhones.some((phone: string) => phone === data.phone);
      console.dir(this.component.errorRegisteredPhone.isRegistered);

      // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных e-mail адресов
      this.component.errorRegisteredEmail.isRegistered =
        this.component.registeredEmails.some((email: string) => email === data.email);
      console.dir(this.component.errorRegisteredEmail.isRegistered);

    } // if*/

    // проверка специальности
    if (mode === Literals.specialization) {

      // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных специальностей
      this.component.errorRegisteredSpecialization.isRegistered = this.component.allSpecializations
        .some((specialization: Specialization) => specialization.name.toLowerCase() === data.toLowerCase());
      console.dir(this.component.errorRegisteredSpecialization.isRegistered);

    } // if

    // проверка должности
    if (mode === Literals.position) {

      // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных должностей
      this.component.errorRegisteredPosition.isRegistered = this.component.allPositions
        .some((position: Position) => position.name.toLowerCase() === data.toLowerCase());
      console.dir(this.component.errorRegisteredPosition.isRegistered);

    } // if

    console.log(`--EmployeeFormComponent-checkingExisting-]`);
  } // checkingExisting


  // проверка соответствия параметров
  checkingNotMatching(data: string, mode: string): void {
    console.log(`[-EmployeeFormComponent-checkingNotMatching--`);

    console.log(`*- data: '${data}' -*`);
    console.log(`*- mode: '${mode}' -*`);

    // проверить соответствие имени пользователя
    if (mode === Literals.userName) {
      this.component.errorNotMatchUserName.isNotMatched = data != this.employee.user.userName;
      console.log(`*- this.component.errorNotMatchUserName.isNotMatched: '${this.component.errorNotMatchUserName.isNotMatched}' -*`);
      this.component.errorNotMatchUserName.message
        = Resources.employeeFormErrorNotMatchUserName(this.component.language, this.employee.user.userName);
    } // if

    // проверить соответствие номера телефона пользователя
    if (mode === Literals.phone) {
      this.component.errorNotMatchUserPhone.isNotMatched = data != this.employee.user.phone;
      console.log(`*- this.component.errorNotMatchUserPhone.isNotMatched: '${this.component.errorNotMatchUserPhone.isNotMatched}' -*`);
      this.component.errorNotMatchUserPhone.message
        = Resources.employeeFormErrorNotMatchUserPhone(this.component.language, this.employee.user.phone);
    } // if

    // проверить соответствие email пользователя
    if (mode === Literals.email) {
      this.component.errorNotMatchUserEmail.isNotMatched = data != this.employee.user.email;
      console.log(`*- this.component.errorNotMatchUserEmail.isNotMatched: '${this.component.errorNotMatchUserEmail.isNotMatched}' -*`);
      this.component.errorNotMatchUserEmail.message
        = Resources.employeeFormErrorNotMatchUserEmail(this.component.language, this.employee.user.email);
    } // if

    console.log(`--EmployeeFormComponent-checkingNotMatching-]`);
  } // checkingNotMatching


  // обработчик события передачи данных из формы на сервер
  // (при режиме изменения данных имя, номер телефона и почту изменить не можем)
  async onSubmit(): Promise<void> {
    console.log(`[-EmployeeFormComponent-onSubmit--`);

    console.log("Отправка данных на сервер");
    console.dir(this.employeeForm.value);
    console.log(`*- this.employeeForm.valid = '${this.employeeForm.valid}' -*`);

    // задать значения параметров запроса

    // 1) имя сотрудника
    console.log(`*-(было)-this.employee.user.userName = '${this.employee.user.userName}' -*`);
    if (this.mode === this.createEmployee)
      this.employee.user.userName = this.employeeName.value;
    console.log(`*-(стало)-this.employee.user.userName = '${this.employee.user.userName}' -*`);

    // 2) номер телефона сотрудника
    console.log(`*-(было)-this.employee.user.phone = '${this.employee.user.phone}' -*`);
    if (this.mode === this.createEmployee)
      this.employee.user.phone = this.phone.value;
    console.log(`*-(стало)-this.employee.user.phone = '${this.employee.user.phone}' -*`);

    // 3) e-mail сотрудника
    console.log(`*-(было)-this.employee.user.email = '${this.employee.user.email}' -*`);
    if (this.mode === this.createEmployee)
      this.employee.user.email = this.email.value;
    console.log(`*-(стало)-this.employee.user.email = '${this.employee.user.email}' -*`);

    // 3.2) при добавлении сотрудника - обнулим идентификатор пользователя сотрудника
    console.log(`*-(было)-this.employee.user.id = '${this.employee.user.id}' -*`);
    if (this.mode === this.createEmployee)
      this.employee.user.id = this.zero;
    console.log(`*-(стало)-this.employee.user.id = '${this.employee.user.id}' -*`);

    // 4) данные о компании, в которую добавляют сотрудника
    console.log(`*-(было)-this.employee.company.id = '${this.employee.company.id}' -*`);
    if (this.mode === this.createEmployee)
      this.employee.company.id = this._companyId;
    console.log(`*-(стало)-this.employee.company.id = '${this.employee.company.id}' -*`);

    // 5) данные о специальности сотрудника
    console.log(`*- this.specializationId.value: '${this.specializationId.value} [${typeof this.specializationId.value}]' -*`);
    console.log(`*- this.isNewSpecialization.value: '${this.isNewSpecialization.value} [${typeof this.isNewSpecialization.value}]' -*`);
    console.log(`*- this.newSpecializationName.value: '${this.newSpecializationName.value} [${typeof this.newSpecializationName.value}]' -*`);

    let specializationId: number = +this.specializationId.value;
    console.log(`*- specializationId: '${specializationId} [${typeof specializationId}]' -*`);

    // получить выбранную специальность
    let specialization: Specialization = this.isNewSpecialization.value
      ? new Specialization(this.zero, this.newSpecializationName.value, null)
      : this.component.allSpecializations
        .find((specialization: Specialization) => specialization.id === specializationId) ?? new Specialization();
    console.log(`*- specialization: -*`);
    console.dir(specialization);
    console.log(`*-(было)-this.employee.specialization: -*`);
    console.dir(this.employee.specialization);
    this.employee.specialization = specialization;
    console.log(`*-(стало)-this.employee.specialization: -*`);
    console.dir(this.employee.specialization);

    // 6) данные о должности сотрудника
    console.log(`*- this.positionId.value: '${this.positionId.value} [${typeof this.positionId.value}]' -*`);
    console.log(`*- this.isNewPosition.value: '${this.isNewPosition.value} [${typeof this.isNewPosition.value}]' -*`);
    console.log(`*- this.newPositionName.value: '${this.newPositionName.value} [${typeof this.newPositionName.value}]' -*`);

    let positionId: number = +this.positionId.value;
    console.log(`*- positionId: '${positionId} [${typeof positionId}]' -*`);

    // получить выбранную должность
    let position: Position = this.isNewPosition.value
      ? new Position(this.zero, this.newPositionName.value, null)
      : this.component.allPositions
        .find((position: Position) => position.id === positionId) ?? new Position();
    console.log(`*- position: -*`);
    console.dir(position);
    console.log(`*-(было)-this.employee.position: -*`);
    console.dir(this.employee.position);
    this.employee.position = position;
    console.log(`*-(стало)-this.employee.position: -*`);
    console.dir(this.employee.position);

    // 7) рейтинг сотрудника
    console.log(`*-(было)-this.employee.rating = '${this.employee.rating}' -*`);
    if (this.mode === this.createEmployee)
      this.employee.rating = this.zero;
    console.log(`*-(стало)-this.employee.rating = '${this.employee.rating}' -*`);

    // 8) фотография сотрудника
    console.log(`*-this.employee.avatar = '${this.employee.avatar}' -*`);

    console.log(`*- this.employee: -*`);
    console.dir(this.employee);

    console.log(`*-(было)- this.employee.user: -*`);
    console.dir(this.employee.user);


    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeeFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeeFormComponent-onSubmit-КОНЕЦ-]`);
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
      console.log(`--EmployeeFormComponent-1.1-(запрос на получение пользователя по телефону)-`);

      // 1. получить пользователя по номеру телефона
      let result1: { message: any, user: User } = { message: Literals.Ok, user: new User() };
      try {
        // получить пользователя по номеру телефона
        let webResult: any = await firstValueFrom(
          this._webApiService.getUserByPhone(Config.urlGetUserByPhone, this.employee.user.phone, token)
        );
        console.dir(webResult);

        result1.user = User.newUser(webResult.user);

      }
      catch (e: any) {

        console.dir(e);
        console.dir(e.error);

        // ошибка авторизации ([Authorize])
        if (e.status === Literals.error401 && e.error === null) {
          console.log(`*- отработал [Authorize] -*`);
          result1.message = Resources.unauthorizedUserIdData[this.component.language]
        }
        // другие ошибки
        else
          result1.message = e.error;

      } // try-catch

      console.log(`--EmployeeFormComponent-result:`);
      console.dir(result1);
      console.dir(result1.message);
      console.dir(result1.user);

      console.log(`--EmployeeFormComponent-1.2-(ответ на запрос получен)-`);

      // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
      if (result1.message != Literals.Ok) {

        // сформируем соответствующее сообщение об ошибке
        let message: string = Literals.empty;

        // ошибки данных
        console.log(`--result1.message.phone: '${result1.message.phone}'`);
        if (result1.message.phone === Literals.empty)
          message = Resources.incorrectPhoneData[this.component.language];

        // ошибки сервера
        console.log(`--result1.message.title: '${result1.message.title}'`);
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
        // иначе - сообщение об успехе
        // result1.message = 'получили пользователя по номеру телефона';   // потом удалить

        // передать сообщение об ошибке в AppComponent для отображения
        // this._errorMessageService.errorMessageSubject.next(result1.message);   // потом удалить

        // если пользователь найден - присвоить значение полученных данных
        if (result1.user.id != this.zero) {
          this.employee.user = result1.user;
          console.log(`*-(стало)- this.employee.user: -*`);
          console.dir(this.employee.user);
        } // if

      } // if
      // endregion

      // если пользователь НЕ найден (user.Id=0), то ищем пользователя по email
      if (this.employee.user.id === this.zero) {

        // region 2. запрос на получение пользователя по email
        console.log(`--EmployeeFormComponent-2.1-(запрос на получение пользователя по EMAIL)-`);

        // 2. получить пользователя по email
        let result2: { message: any, user: User } = { message: Literals.Ok, user: new User() };
        try {
          // получить пользователя по EMAIL
          let webResult: any = await firstValueFrom(
            this._webApiService.getUserByEmail(Config.urlGetUserByEmail, this.employee.user.email, token)
          );
          console.dir(webResult);

          result2.user = User.newUser(webResult.user);

        }
        catch (e: any) {

          console.dir(e);
          console.dir(e.error);

          // ошибка авторизации ([Authorize])
          if (e.status === Literals.error401 && e.error === null) {
            console.log(`*- отработал [Authorize] -*`);
            result2.message = Resources.unauthorizedUserIdData[this.component.language]
          }
          // другие ошибки
          else
            result2.message = e.error;

        } // try-catch

        console.log(`--EmployeeFormComponent-result:`);
        console.dir(result2);
        console.dir(result2.message);
        console.dir(result2.user);

        console.log(`--EmployeeFormComponent-2.2-(ответ на запрос получен)-`);

        // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
        if (result2.message != Literals.Ok) {

          // сформируем соответствующее сообщение об ошибке
          let message: string = Literals.empty;

          // ошибки данных
          console.log(`--result2.message.email: '${result2.message.email}'`);
          if (result2.message.email === Literals.empty)
            message = Resources.incorrectEmailData[this.component.language];

          // ошибки сервера
          console.log(`--result2.message.title: '${result2.message.title}'`);
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
          // иначе - сообщение об успехе
          // result2.message = 'получили пользователя по email';   // потом удалить

          // передать сообщение об ошибке в AppComponent для отображения
          // this._errorMessageService.errorMessageSubject.next(result2.message);   // потом удалить

          // если пользователь найден - присвоить значение полученных данных
          if (result2.user.id != this.zero) {
            this.employee.user = result2.user;
            console.log(`*-(стало)- this.employee.user: -*`);
            console.dir(this.employee.user);
          } // if

        } // if
        // endregion

      } // if

      // если пользователь не найден (user.Id=0), то запрос на регистрацию
      if (this.employee.user.id === this.zero) {

        // region 3. запрос на регистрацию пользователя
        console.log(`--EmployeeFormComponent-3.1-(запрос на регистрацию пользователя)-`);

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
          console.dir(webResult);

        }
        catch (e: any) {

          console.dir(e);
          console.dir(e.error);

          // если отсутствует соединение
          if (e.status === Literals.zero) {
            result3 = Resources.noConnection[this._languageService.language];
          }
          // другие ошибки
          else
            result3 = e.error;

        } // try-catch

        console.log(`--EmployeeFormComponent-result:`);
        console.dir(result3);

        console.log(`--EmployeeFormComponent-3.2-(ответ на запрос получен)-`);

        // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
        if (result3 != Literals.Ok) {

          // сформируем соответствующее сообщение об ошибке
          let message: string = Literals.empty;

          // ошибки данных
          console.log(`*- result.message.loginModel: -*`);
          console.dir(result3.loginModel);
          if (result3.loginModel)
            message = Resources.registrationIncorrectData[this.component.language];

          // ошибки сервера
          console.log(`--result3.title: '${result3.title}'`);
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
        console.log(`--EmployeeFormComponent-4.1-(запрос на получение зарегистрированного пользователя по телефону)-`);

        // 4. получить пользователя по номеру телефона
        let result4: { message: any, user: User } = { message: Literals.Ok, user: new User() };
        try {
          // получить пользователя по номеру телефона
          let webResult: any = await firstValueFrom(
            this._webApiService.getUserByPhone(Config.urlGetUserByPhone, this.employee.user.phone, token)
          );
          console.dir(webResult);

          result4.user = User.newUser(webResult.user);

        }
        catch (e: any) {

          console.dir(e);
          console.dir(e.error);

          // ошибка авторизации ([Authorize])
          if (e.status === Literals.error401 && e.error === null) {
            console.log(`*- отработал [Authorize] -*`);
            result4.message = Resources.unauthorizedUserIdData[this.component.language]
          }
          // другие ошибки
          else
            result4.message = e.error;

        } // try-catch

        console.log(`--EmployeeFormComponent-result:`);
        console.dir(result4);
        console.dir(result4.message);
        console.dir(result4.user);

        console.log(`--EmployeeFormComponent-4.2-(ответ на запрос получен)-`);

        // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
        if (result4.message != Literals.Ok) {

          // сформируем соответствующее сообщение об ошибке
          let message: string = Literals.empty;

          // ошибки данных
          console.log(`--result4.message.phone: '${result4.message.phone}'`);
          if (result4.message.phone === Literals.empty)
            message = Resources.incorrectPhoneData[this.component.language];

          // ошибки сервера
          console.log(`--result4.message.title: '${result4.message.title}'`);
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
          // иначе - сообщение об успехе
          // result4.message = 'получили пользователя по номеру телефона';   // потом удалить

          // передать сообщение об ошибке в AppComponent для отображения
          // this._errorMessageService.errorMessageSubject.next(result4.message);   // потом удалить

          // если пользователь найден - присвоить значение полученных данных
          if (result4.user.id != this.zero) {
            this.employee.user = result4.user;
            console.log(`*-(стало)- this.employee.user: -*`);
            console.dir(this.employee.user);
          } // if

        } // if
        // endregion

      } // if

      // проверка правильности введённых имени,
      // номера телефона и почты полученного пользователя
      if (this.employee.user.id != this.zero) {
        console.log(`*- проверка имени и почты -*`);

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

          console.log(`--EmployeeFormComponent-onSubmit-КОНЕЦ-]`);
          return;
        } // if

      } // if

      // region 5. запрос на проверку регистрации пользователя в других компаниях
      console.log(`--EmployeeFormComponent-5.1-(запрос на проверку регистрации пользователя в других компаниях)-`);

      // 5. проверка регистрации пользователя в других компаниях
      let result5: { message: any, employee: Employee } = { message: Literals.Ok, employee: new Employee() };
      try {
        // проверка регистрации пользователя в других компаниях
        let webResult: any = await firstValueFrom(
          this._webApiService.getById(Config.urlGetEmployeeByUserId, this.employee.user.id, token)
        );
        console.dir(webResult);

        result5.employee = Employee.newEmployee(webResult.employee);

      }
      catch (e: any) {

        console.dir(e);
        console.dir(e.error);

        // если отсутствует соединение
        if (e.status === this.zero) {
          result5.message = Resources.noConnection[this._languageService.language];
        }
        // ошибка авторизации ([Authorize])
        else if (e.status === Literals.error401 && e.error === null) {
          console.log(`*- отработал [Authorize] -*`);
          result5.message = Resources.unauthorizedUserIdData[this.component.language];
        }
        // другие ошибки
        else
          result5.message = e.error;

      } // try-catch

      console.log(`--EmployeeFormComponent-result:`);
      console.dir(result5);
      console.dir(result5.message);
      console.dir(result5.employee);

      console.log(`--EmployeeFormComponent-5.2-(ответ на запрос получен)-`);

      // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
      if (result5.message != Literals.Ok) {

        // сформируем соответствующее сообщение об ошибке
        let message: string = Literals.empty;

        // ошибки данных
        console.log(`--result5.message.userId: '${result5.message.userId}'`);
        if (result5.message.userId === this.zero)
          message = Resources.incorrectUserIdData[this.component.language];

        // ошибки сервера
        console.log(`--result5.message.title: '${result5.message.title}'`);
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

          console.log(`--EmployeeFormComponent-6.0-(пользователь ГОТОВ для добавления!!!)-`);
          console.log(`*-(!! ЭТО ОН !!)- this.employee.user: -*`);
          console.dir(this.employee.user);

        } // if

      } // if
      // endregion

    } // if

    // region 6. запрос на добавление/изменение данных о сотруднике -----------

    console.log(`--EmployeeFormComponent-6.1-(запрос на добавление/изменение)-`);

    // 6. запрос на добавление/изменение данных о сотруднике
    let result6: any = Literals.Ok;
    try {
      let webResult: any = await firstValueFrom(
        this.mode === this.createEmployee
          ? this._webApiService.createEmployeePUT(Config.urlCreateEmployee, this.employee, token)
          : this._webApiService.editEmployeePOST(Config.urlEditEmployee, this.employee, token)
      );
      console.dir(webResult);

    }
    catch (e: any) {

      console.dir(e);
      console.dir(e.error);

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null) {
        console.log(`*- отработал [Authorize] -*`);
        result6 = Resources.unauthorizedUserIdData[this.component.language]
      }
      // другие ошибки
      else
        result6 = e.error;

    } // try-catch

    console.log(`--EmployeeFormComponent-result:`);
    console.dir(result6);

    console.log(`--EmployeeFormComponent-6.2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result6 != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result6.employeeId: '${result6.employeeId}'`);
      if (result6.employeeId != undefined)
        message = result6.employeeId === this.zero
          ? Resources.incorrectEmployeeIdData[this.component.language]
          : Resources.notRegisteredEmployeeIdData[this.component.language];

      console.log(`--result6.userId: '${result6.userId}'`);
      if (result6.userId === this.zero)
        message = Resources.notRegisteredUserIdData[this.component.language];

      console.log(`--result6.avatar: '${result6.avatar}'`);
      if (result6.avatar != undefined)
        message = Resources.employeeFormIncorrectAvatar[this.component.language];

      console.log(`--result6.specializationId: '${result6.specializationId}'`);
      if (result6.specializationId === this.zero)
        message = Resources.notRegisteredSpecializationIdData[this.component.language];

      console.log(`--result6.positionId: '${result6.positionId}'`);
      if (result6.positionId === this.zero)
        message = Resources.notRegisteredPositionIdData[this.component.language];

      console.log(`--result6.companyId: '${result6.companyId}'`);
      if (result6.companyId === this.zero)
        message = Resources.incorrectCompanyIdData[this.component.language];

      // ошибки сервера
      console.log(`--result6.title: '${result6.title}'`);
      if (result6.title != undefined) message = result6.title;

      console.log(`--result6.createMessage: '${result6.createMessage}'`);
      if (result6.createMessage != undefined) message = result6.createMessage;

      console.log(`--result6.updateMessage: '${result6.updateMessage}'`);
      if (result6.updateMessage != undefined) message = result6.updateMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result6) === Literals.string) message = result6;

      // изменить результат на сообщение для вывода
      result6 = message;

      // сбросить флаг изменений данных в форме
      console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
      this.component.isChangedFormFlag = false;
      console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

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

    console.log(`--EmployeeFormComponent-onSubmit-]`);
  } // onSubmit


  // обработчик события получения данных о выбранном файле изображения
  // (запрос на загрузку файла с изображением)
  async sendFileHandler(file: File): Promise<void> {
    console.log(`[-EmployeeFormComponent-sendFileHandler--`);

    console.log(`*- file -*`);
    console.dir(file);

    // изменение значения имени выбранного файла
    // и его передача компоненту выбора для отображения
    console.log(`*-(было)- this.component.newFileName: '${this.component.newFileName}' -*`);
    this.component.newFileName = file.name;
    console.log(`*-(стало)- this.component.newFileName: '${this.component.newFileName}' -*`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--EmployeeFormComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--EmployeeFormComponent-sendFileHandler-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--EmployeeFormComponent-1-(загрузка изображения)-`);

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

        console.log(`*- this.employee.avatar: '${this.employee.avatar}' -*`);

        let items: string[] = this.employee.avatar.split(Literals.slash);
        console.log(`*- items: -*`);
        console.dir(items);
        let dir: string = items[items.length - 2];
        console.log(`*- dir: '${dir}' -*`);

        tempDir = dir.startsWith(Literals.temp) ? dir : tempDir;
        console.log(`*- tempDir: '${tempDir}' -*`);

      } // if

      // тип изображения (тут не нужен)
      let imageType: string = Literals.empty;

      // запрос на загрузку файла с изображением
      let webResult: any = await firstValueFrom(this._webApiService.uploadImagePOST(
        Config.urlUploadTempEmployeePhoto, file, this._userId,
        this.employee.id, tempDir, imageType, token
      ));
      console.dir(webResult);

      result.avatar = webResult.avatar;

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

    console.log(`--EmployeeFormComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.avatar);

    console.log(`--EmployeeFormComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.avatar: '${result.message.avatar}'`);
      if (result.message.avatar === Literals.empty)
        message = Resources.incorrectFileData[this.component.language];

      console.log(`--result.message.userId: '${result.message.userId}'`);
      if (result.message.userId == this.zero)
        message = Resources.incorrectUserIdData[this.component.language];

      console.log(`--result.message.employeeId: '${result.message.employeeId}'`);
      if (result.message.employeeId == this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // изменить результат на сообщение для вывода
      result.message = message;

      // передать в компонент выбора пустое значение выбранного файла
      console.log(`*-(было)- this.component.newFileName: '${this.component.newFileName}' -*`);
      this.component.newFileName = Literals.empty;
      console.log(`*-(стало)- this.component.newFileName: '${this.component.newFileName}' -*`);

      // сбросить флаг изменений данных в форме
      console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
      this.component.isChangedFormFlag = false;
      console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

    } else {
      // иначе - сообщение об успехе
      result.message = Resources.uploadImageOkData[this.component.language];

      // установить объекту с данными о сотруднике
      // временный путь расположения выбранной фотографии
      console.log(`-(было)-this.employee.avatar: '${this.employee.avatar}'`);
      this.employee.avatar = result.avatar;
      console.log(`-(стало)-this.employee.avatar: '${this.employee.avatar}'`);

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
      this.component.isChangedFormFlag = true;
      console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

    console.log(`--EmployeeFormComponent-sendFileHandler-]`);
  } // sendFileHandler


  // сброс данных, введённых в форме
  resetData(): void {
    console.log(`[-EmployeeFormComponent-resetData--`);

    // сбросить данные о пользователе
    console.log(`*-(было)- this.employee.user: -*`);
    console.dir(this.employee.user);
    this.employee.user = new User();
    console.log(`*-(стало)- this.employee.user: -*`);
    console.dir(this.employee.user);

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

    console.log(`--EmployeeFormComponent-resetData-]`);
  } // resetData


  // метод для оптимизации кода - действия при выходе из метода onSubmit()
  private exitFromOnSubmit(message: string): void {

    // сбросить флаг изменений данных в форме
    console.log(`*-(было)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);
    this.component.isChangedFormFlag = false;
    console.log(`*-(стало)-this.component.isChangedFormFlag: '${this.component.isChangedFormFlag}' -*`);

    // переход в начало страницы
    Utils.toStart();

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(message);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    console.log(`--EmployeeFormComponent-onSubmit-КОНЕЦ-]`);

  } // exitFromOnSubmit


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
    console.log(`[-EmployeeFormComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();


    // если компонент уничтожается НЕ после onSubmit()
    // И пользователь БЫЛ ВОШЕДШИМ!!!, то отправить запрос на удаление
    // временной папки со всеми временными фотографиями сотрудника
    console.log(`*-this.component.isChangedFlag: '${this.component.isChangedFlag}' -*`);
    let userIsLogin: boolean = this._userService.user.isLogin;
    console.log(`*-userIsLogin: '${userIsLogin}' -*`);
    if (!this.component.isChangedFlag && userIsLogin) {

      // запрос на удаление временной папки
      // со всеми временными фотографиями сотрудника
      await this.requestDeleteTempEmployeePhotos();

    } // if

    console.log(`--EmployeeFormComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class EmployeeFormComponent
// ----------------------------------------------------------------------------
