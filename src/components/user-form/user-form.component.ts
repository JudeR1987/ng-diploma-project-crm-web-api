// ----------------------------------------------------------------------------
// компонент отображения формы изменения данных о пользователе
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {firstValueFrom, Subscription} from 'rxjs';
import {IUserFormComponent} from '../../models/interfaces/IUserFormComponent';
import {Resources} from '../../infrastructure/Resources';
import {User} from '../../models/classes/User';
import {ErrorMessageService} from '../../services/error-message.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {UserValidators} from '../../validators/UserValidators';
import {WebApiService} from '../../services/web-api.service';
import {UserService} from '../../services/user.service';
import {Config} from '../../infrastructure/Config';
import {AuthGuardService} from '../../services/auth-guard.service';
import {TokenService} from '../../services/token.service';
import {FileUploadComponent} from '../file-upload/file-upload.component';
import {CheckboxDeletingComponent} from '../checkbox-deleting/checkbox-deleting.component';
import {ModalConfirmationComponent} from '../modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    NgIf, ReactiveFormsModule, FileUploadComponent,
    CheckboxDeletingComponent, ModalConfirmationComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IUserFormComponent = {
    // параметры меняющиеся при смене языка
    title:                          Literals.empty,
    labelUserName:                  Literals.empty,
    labelPhone:                     Literals.empty,
    labelEmail:                     Literals.empty,
    userNamePlaceholder:            Literals.empty,
    errorRequiredTitle:             Literals.empty,
    errorUserNameMaxLengthTitle:    Literals.empty,
    errorRegisteredPhone:           {message: Literals.empty, isRegistered: false},
    errorRegisteredEmail:           {message: Literals.empty, isRegistered: false},
    errorPhoneValidatorTitle:       Literals.empty,
    errorEmailMaxLengthTitle:       Literals.empty,
    errorEmailValidatorTitle:       Literals.empty,
    phoneNoErrorsTitle:             Literals.empty,
    butUserEditTitle:               Literals.empty,
    butUserEditValue:               Literals.empty,
    labelInputImage:                Literals.empty,
    labelNewFileName:               Literals.empty,
    labelFileNotSelected:           Literals.empty,
    butNewFileNameTitle:            Literals.empty,
    butNewFileNameValue:            Literals.empty,
    labelCheckboxDeletingFlag:      Literals.empty,
    butDeleteUserTitle:             Literals.empty,
    butDeleteUserValue:             Literals.empty,
    titleConfirmation:              Literals.empty,
    messageConfirmation:            Literals.empty,
    butConfirmedOkTitle:            Literals.empty,
    butConfirmedOkValue:            Literals.empty,
    butConfirmedCancelTitle:        Literals.empty,
    butConfirmedCancelValue:        Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:                Literals.empty,
    route:                   Literals.empty,
    isWaitFlag:              false,
    isChangedFlag:           false,
    isDeletingFlag:          false,
    isConfirmedFlag:         false,
    isChangedFormFlag:       false,
    phonePlaceholder:        Literals.phonePlaceholder,
    emailPlaceholder:        Literals.emailPlaceholder,
    userNameLength:          Literals.userNameLength,
    phoneLength:             Literals.phoneLength,
    emailLength:             Literals.emailLength,
    errorRequired:           Literals.required,
    errorMaxLength:          Literals.maxlength,
    errorPhoneValidator:     Literals.phoneValidator,
    errorEmailValidator:     Literals.emailValidator,
    newFileName:             Literals.empty,
    sizeImage:               Literals.personSizeImage
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о пользователе для изменения
  public user: User = new User();

  // поле ввода имени пользователя
  public userName: FormControl = new FormControl();

  // поле ввода номера телефона пользователя
  public phone: FormControl = new FormControl();

  // поле ввода e-mail пользователя
  public email: FormControl = new FormControl();

  // объект формы изменения данных о пользователе
  public userForm: FormGroup = new FormGroup<any>({
    userName: this.userName,
    phone:    this.phone,
    email:    this.email
  });

  // коллекция зарегистрированных телефонов
  public registeredPhones: string[] = [];

  // коллекция зарегистрированных email
  public registeredEmails: string[] = [];


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
    Utils.helloComponent(Literals.userForm);

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

    // получить данные о пользователе из сервиса-хранилища
    this.user = this._userService.user;


    // проверка на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)
    let userId: number = 0;
    // подписка на получение результата перехода по маршруту
    this._activatedRoute.params.subscribe(params => {

      // параметр об Id пользователя, полученный из маршрута
      userId = +params[Literals.id];

    }); // subscribe

    // если параметр не совпадает с параметром пользователя,
    // требуется перейти на страницу "NotFound"
    if (userId != this.user.id) {

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectUserIdData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // если данные о пользователе не получены(т.е. User.id = 0),
    // перейти на домашнюю страницу и вывести сообщение об ошибке
    if (this.user.id === Literals.zero) {

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.userFormMissingData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // при загрузке компонента отправить запрос на удаление
    // временной папки со всеми временными фотографиями пользователя
    await this.requestDeleteTempUserPhotos();


    // создание объектов полей ввода и формы изменения данных о пользователе
    this.createFormControls();
    this.createForm();

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title                          = Resources.userFormTitle[this.component.language];
    this.component.labelUserName                  = Resources.labelPersonName[this.component.language];
    this.component.labelPhone                     = Resources.labelPhone[this.component.language];
    this.component.labelEmail                     = Resources.labelEmail[this.component.language];
    this.component.userNamePlaceholder            = Resources.userFormUserNamePlaceholder[this.component.language];
    this.component.errorRequiredTitle             = Resources.errorRequired[this.component.language];
    this.component.errorUserNameMaxLengthTitle    = Resources.userFormErrorUserNameMaxLength(
      this.component.language, this.component.userNameLength);
    this.component.errorRegisteredPhone.message   = Resources.registeredPhone[this.component.language];
    this.component.errorRegisteredEmail.message   = Resources.registeredEmail[this.component.language];
    this.component.errorPhoneValidatorTitle       = Resources.errorPhoneValidator[this.component.language];
    this.component.errorEmailMaxLengthTitle       = Resources.errorEmailMaxLength(this.component.language, this.component.emailLength);
    this.component.errorEmailValidatorTitle       = Resources.errorEmailValidator[this.component.language];
    this.component.phoneNoErrorsTitle             = Resources.phoneNoErrors[this.component.language];
    this.component.butUserEditTitle               = Resources.userFormButUserEditTitle[this.component.language];
    this.component.butUserEditValue               = Resources.butEditValue[this.component.language];
    this.component.labelInputImage                = Resources.labelInputPhoto[this.component.language];
    this.component.labelNewFileName               = Resources.labelNewFileName[this.component.language];
    this.component.labelFileNotSelected           = Resources.labelFileNotSelected[this.component.language];
    this.component.butNewFileNameTitle            = Resources.butNewPhotoFileNameTitle[this.component.language];
    this.component.butNewFileNameValue            = Resources.butNewFileNameValue[this.component.language];
    this.component.labelCheckboxDeletingFlag      = Resources.userFormLabelCheckboxDeletingFlag[this.component.language];
    this.component.butDeleteUserTitle             = Resources.userFormButDeleteUserTitle[this.component.language];
    this.component.butDeleteUserValue             = Resources.userFormButDeleteUserValue[this.component.language];
    this.component.titleConfirmation              = Resources.titleAttention[this.component.language];
    this.component.messageConfirmation            = Resources.userFormMessageConfirmation[this.component.language];
    this.component.butConfirmedOkTitle            = Resources.userFormButConfirmedOkTitle[this.component.language];
    this.component.butConfirmedOkValue            = Resources.butDeleteValue[this.component.language];
    this.component.butConfirmedCancelTitle        = Resources.userFormButConfirmedCancelTitle[this.component.language];
    this.component.butConfirmedCancelValue        = Resources.userFormButConfirmedCancelValue[this.component.language];

  } // changeLanguageLiterals


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {

    // задать значения параметров запроса
    this.user.userName = this.userName.value;
    this.user.phone = this.phone.value;
    this.user.email = this.email.value;

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

      // иначе - обновим данные о токене обновления пользователя
      // и переходим к последующему запросу
      this.user.userToken = (this._userService.user).userToken;
    } // if

    // запрос на изменение данных о пользователе
    let result: { message: any, user: User } =
      { message: Literals.Ok, user: new User() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService.editUserPOST(
        Config.urlEditUser, this.user, token
      ));

      result.user  = User.newUser(webResult.user);
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
      if (result.message.userId != undefined)
        message = result.message.userId === 0
          ? Resources.incorrectUserIdData[this.component.language]
          : Resources.notRegisteredUserIdData[this.component.language];

      if (result.message.userName != undefined)
        message = Resources.userFormIncorrectNewUserName[this.component.language];

      if (result.message.phone === Literals.empty)
        message = Resources.userFormIncorrectNewPhone[this.component.language];

      if (result.message.email === Literals.empty)
        message = Resources.userFormIncorrectNewEmail[this.component.language];

      if (result.message.avatar != undefined)
        message = Resources.userFormIncorrectNewAvatar[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // ошибки изменения номера телефона
      if (result.message.phone) {

        // добавить телефон в список зарегистрированных
        this.registeredPhones.push(result.message.phone);

        // проверка номера телефона и email на совпадение с зарегистрированными
        this.checkingExisting({ phone: this.phone.value, email: this.email.value });

        // сообщение об ошибке
        message = Resources.registeredPhone[this.component.language];

      } // if

      // ошибки изменения email
      if (result.message.email) {

        // добавить email в список зарегистрированных
        this.registeredEmails.push(result.message.email);

        // проверка номера телефона и email на совпадение с зарегистрированными
        this.checkingExisting({ phone: this.phone.value, email: this.email.value });

        // сообщение об ошибке
        message = Resources.registeredEmail[this.component.language];

      } // if

      // изменить результат на сообщение для вывода
      result.message = message;

      // сбросить флаг изменений данных в форме
      this.component.isChangedFormFlag = false;

      // переход в начало страницы
      Utils.toStart();
    }
    else {

      // иначе - сообщение об успехе
      result.message = Resources.userFormOkData[this.component.language];

      // обновить данные о пользователе в сервисе-хранилище
      // и передать изменённые данные всем подписчикам
      this._userService.user = result.user;

      // перезаписать данные в хранилище
      this._userService.saveUserToLocalStorage();

      // установить флаг изменения данных о пользователе в true
      this.component.isChangedFlag = true;

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

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

      // иначе - обновим данные о токене обновления пользователя
      // и переходим к последующему запросу
      this.user.userToken = (this._userService.user).userToken;
    } // if

    // запрос на загрузку файла с изображением
    let result: { message: any, avatar: string } =
      { message: Literals.Ok, avatar: Literals.empty };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      // идентификатор сущности (тут не нужен)
      let id: number = Literals.zero;

      // папка с временной фотографией пользователя (тут не нужна)
      let tempDir: string = Literals.empty;

      // тип изображения (тут не нужен)
      let imageType: string = Literals.empty;

      // запрос на загрузку файла с изображением
      let webResult: any = await firstValueFrom(this._webApiService.uploadImagePOST(
        Config.urlUploadTempUserPhoto, file, this.user.id,
        id, tempDir, imageType, token
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

      if (result.message.userId != undefined)
        message = Resources.incorrectUserIdData[this.component.language];

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

      // установить объекту с данными о пользователе
      // временный путь расположения выбранной фотографии
      this.user.avatar = result.avatar;

      // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
      this.component.isChangedFormFlag = true;

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

  } // sendFileHandler


  // создание объектов полей ввода формы изменения данных о пользователе
  createFormControls(): void {

    // поле ввода имени пользователя
    this.userName = new FormControl(
      // начальное значение
      this.user.userName,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.userNameLength)
      ]
    );

    // поле ввода телефона пользователя
    this.phone = new FormControl(
      // начальное значение
      this.user.phone,
      // синхронные валидаторы
      [
        Validators.required,
        UserValidators.phone
      ]
    );

    // поле ввода e-mail пользователя
    this.email = new FormControl(
      // начальное значение
      this.user.email,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.emailLength),
        UserValidators.email
      ]
    );

  } // createFormControls


  // создание объекта формы изменения данных о пользователе
  createForm(): void {

    this.userForm = new FormGroup( {
      userName: this.userName,
      phone:    this.phone,
      email:    this.email
    });

    // подписка на изменения в форме
    this.userForm.valueChanges.subscribe(
      (data: { userName: string, phone: string, email: string }) => {

        // проверка номера телефона и email на совпадение с зарегистрированными
        this.checkingExisting({ phone: data.phone, email: data.email });

        // установить флаг изменений данных в форме в положение "изменения БЫЛИ"
        this.component.isChangedFormFlag = true;
      }
    ); // subscribe

    // сбросить флаг изменений данных в форме
    this.component.isChangedFormFlag = false;

  } // createForm


  // проверка номера телефона и email на совпадение с зарегистрированными
  checkingExisting(data: { phone: string, email: string }): void {

    // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных
    this.component.errorRegisteredPhone.isRegistered =
      this.registeredPhones.some((phone: string) => phone === data.phone);

    this.component.errorRegisteredEmail.isRegistered =
      this.registeredEmails.some((email: string) => email === data.email);

  } // checkingExisting


  // выполнение запроса на удаление временной папки
  // со всеми временными фотографиями пользователя
  async requestDeleteTempUserPhotos(): Promise<void> {

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

      // иначе - обновим данные о токене обновления пользователя
      // и переходим к последующему запросу
      this.user.userToken = (this._userService.user).userToken;
    } // if

    // запрос на удаление временной папки со всеми временными фотографиями пользователя
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      // идентификатор сущности (тут не нужен)
      let id: number = Literals.zero;

      // тип изображения (тут не нужен)
      let imageType: string = Literals.empty;

      let webResult: any = await firstValueFrom(this._webApiService.deleteTempImages(
        Config.urlDeleteTempUserPhotos, this.user.id, id, imageType, token
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

  } // requestDeleteTempUserPhotos


  // обработчик события передачи данных о возможности удаления данных
  sendIsDeletingFlagHandler(value: boolean): void {

    // запрет/разрешение возможности удаления данных
    this.component.isDeletingFlag = value;

  } // sendIsDeletingFlagHandler


  // обработчик события передачи данных о подтверждении
  // или НЕ_подтверждении удаления данных о пользователе
  async sendIsConfirmedHandler(value: boolean): Promise<void> {

    // подтверждение/НЕ_подтверждение удаления данных
    this.component.isConfirmedFlag = value;

    // если удаление подтверждено - отправить запрос
    // на удаление данных о пользователе
    if (this.component.isConfirmedFlag)
      await this.requestDeleteUserData();
    // иначе, если удаление НЕ подтверждено, отменяем удаление
    else
      this.component.isDeletingFlag = this.component.isConfirmedFlag;

  } // sendIsConfirmedHandler


  // выполнение запроса на удаление данных о пользователе
  async requestDeleteUserData(): Promise<void> {

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

      // иначе - обновим данные о токене обновления пользователя
      // и переходим к последующему запросу
      this.user.userToken = (this._userService.user).userToken;
    } // if

    // запрос на удаление данных о пользователе
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(this._webApiService.deleteById(
        Config.urlDeleteUser, this.user.id, token
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

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся в форме, отменяем удаление
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.userId != undefined)
        message = result.userId === 0
          ? Resources.incorrectUserIdData[this.component.language]
          : Resources.notRegisteredUserIdData[this.component.language];

      // ошибки входа пользователя
      if (!result.isLogin)
        message = Resources.unauthorizedUserIdData[this.component.language];

      // ошибки сервера
      if (result.title != undefined) message = result.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;

      // отменить удаление
      this.component.isDeletingFlag = this.component.isConfirmedFlag = false;
    }
    else {

      // иначе - сообщение об успехе
      result = Resources.userFormDeleteUserOk[this.component.language];

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

  } // requestDeleteUserData


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
    // временной папки со всеми временными фотографиями пользователя
    if (!this.component.isChangedFlag && this.user.isLogin) {

      // запрос на удаление временной папки
      // со всеми временными фотографиями пользователя
      await this.requestDeleteTempUserPhotos();


      // ЕСЛИ БЫЛ запрос на удаление данных о пользователе, то после него
      // установить исходные данные о пользователе в приложении
      if (this.component.isConfirmedFlag) {

        // установить данные о jwt-токене и пользователе в сервисах в значение
        // по умолчанию и передать изменённые данные всем подписчикам
        this._tokenService.token = Literals.empty;
        this._userService.user = new User();

        // удалить данные из хранилища
        localStorage.removeItem(Literals.jwt);
        localStorage.removeItem(Literals.user);

      } // if

    } // if

  } // ngOnDestroy

} // class UserFormComponent
// ----------------------------------------------------------------------------
