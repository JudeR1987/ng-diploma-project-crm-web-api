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

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
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
    //labelPassword:                  Literals.empty,
    //labelPasswordConfirmation:      Literals.empty,
    //labelCheckboxPassword:          Literals.empty,
    userNamePlaceholder:            Literals.empty,
    errorRequiredTitle:             Literals.empty,
    errorUserNameMaxLengthTitle:    Literals.empty,
    errorRegisteredPhone:           { message: Literals.empty, isRegistered: false},
    errorRegisteredEmail:           { message: Literals.empty, isRegistered: false},
    errorPhoneValidatorTitle:       Literals.empty,
    errorEmailMaxLengthTitle:       Literals.empty,
    errorEmailValidatorTitle:       Literals.empty,
    //errorPasswordValidatorTitle:    Literals.empty,
    //errorPasswordMinMaxLengthTitle: Literals.empty,
    phoneNoErrorsTitle:             Literals.empty,
    butUserEditTitle:               Literals.empty,
    butUserEditValue:               Literals.empty,

    // параметры НЕ меняющиеся при смене языка
    language:               Literals.empty,
    route:                  Literals.empty,
    isWaitFlag:             false,
    phonePlaceholder:       Literals.phonePlaceholder,
    emailPlaceholder:       Literals.emailPlaceholder,
    //passwordPlaceholder:    Literals.passwordPlaceholder,
    userNameLength:         Literals.userNameLength,
    phoneLength:            Literals.phoneLength,
    emailLength:            Literals.emailLength,
    //passwordMinLength:      Literals.passwordMinLength,
    //passwordMaxLength:      Literals.passwordMaxLength,
    errorRequired:          Literals.required,
    //errorMinLength:         Literals.minlength,
    errorMaxLength:         Literals.maxlength,
    errorPhoneValidator:    Literals.phoneValidator,
    errorEmailValidator:    Literals.emailValidator,
    //errorPasswordValidator: Literals.passwordValidator,
    //passwordInputTypes:     Literals.passwordInputTypes
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о пользователе для изменения
  public user: User = new User();

  // объект формы изменения данных о пользователе
  public userForm: FormGroup = null!;

  // поле ввода имени пользователя
  public userName: FormControl = null!;

  // поле ввода номера телефона пользователя
  public phone: FormControl = null!;

  // поле ввода e-mail пользователя
  public email: FormControl = null!;

  // поле ввода пароля пользователя
  //public password: FormControl = null!;

  // поле подтверждения пароля пользователя
  //public passwordConfirmation: FormControl = null!;

  // поле изменения видимости пароля при вводе
  //public isDisplayPassword: FormControl = null!;

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

    console.log(`[-UserFormComponent-constructor--`);

    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`*-this.user-*`);
    console.dir(this.user);

    console.log(`--UserFormComponent-constructor-]`);

  } // constructor


  // 0. установка языка отображения и значений строковых
  // переменных сразу после загрузки компонента
  ngOnInit(): void {

    console.log(`[-UserFormComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-UserFormComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--UserFormComponent-subscribe-]`);

      }); // subscribe


    // получим результат перехода по маршруту через состояние
    // из истории браузера (объект не отображается в url)
    /*console.dir(history.state.user);
    this.user = history.state.user
      ? User.newUser(history.state.user)
      : new User();*/

    console.log(`*-(было)-this.user-*`);
    console.dir(this.user);

    // получим данные о пользователе из сервиса-хранилища
    this.user = this._userService.user;

    //this.user = new User();
    console.log(`*-(стало)-this.user-*`);
    console.dir(this.user);


    // создание объектов полей ввода и формы изменения данных о пользователе
    this.createFormControls();
    this.createForm();


    // проверка на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)
    console.dir(this._activatedRoute);
    console.dir(this._activatedRoute.params);
    let userId: number = 0;
    // подписка на получение результата перехода по маршруту
    this._activatedRoute.params.subscribe(params => {

      // параметр об Id пользователя, полученный из маршрута
      userId = +params[Literals.id];
      console.log(`*-userId: '${userId}' -*`);
      console.dir(typeof userId);

    }); // subscribe

    // если параметр не совпадает с параметром пользователя,
    // требуется перейти на страницу "NotFound"
    console.log(`*-userId: '${userId}' -*`);
    console.log(`*-this.user.id: '${this.user.id}' -*`);
    if (userId != this.user.id) {
      console.log(`*- Переход на "NotFound" -*`);

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectUserIdData[this.component.language]);

      }); // navigateByUrl

      console.log(`--PasswordFormComponent-ngOnInit-]`);
      return;
    } // if


    // если данные о пользователе не получены(т.е. User.id = 0),
    // перейти на домашнюю страницу и вывести сообщение об ошибке
    if (this.user.id === Literals.zero) {
      console.log(`*- Переход на "Home" -*`);

      // перейти по маршруту на домашнюю страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.userFormMissingData[this.component.language]);

      }); // navigateByUrl

      console.log(`--UserFormComponent-ngOnInit-]`);
      return;
    } // if

    console.log(`--UserFormComponent-ngOnInit-]`);

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    console.log(`[-UserFormComponent-changeLanguageLiterals--`);

    console.log(`*-input(пришло)-language='${language}'-*`);
    console.log(`*-(было)-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-(стало)-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title                          = Resources.userFormTitle[this.component.language];
    this.component.labelUserName                  = Resources.userFormLabelUserName[this.component.language];
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
    this.component.butUserEditTitle                  = Resources.userFormButUserEditTitle[this.component.language];
    this.component.butUserEditValue                  = Resources.userFormButUserEditValue[this.component.language];

    console.log(`--UserFormComponent-changeLanguageLiterals-]`);

  } // changeLanguageLiterals


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {

    console.log(`[-UserFormComponent-onSubmit--`);

    console.log("Отправка данных на сервер");
    console.dir(this.userForm.value);
    console.log(this.userForm.valid);

    // задать значения параметров запроса
    console.log(`*-(было)-this.user.userName = '${this.user.userName}' -*`);
    this.user.userName = this.userName.value;
    console.log(`*-(стало)-this.user.userName = '${this.user.userName}' -*`);

    console.log(`*-(было)-this.user.phone = '${this.user.phone}' -*`);
    this.user.phone = this.phone.value;
    console.log(`*-(стало)-this.user.phone = '${this.user.phone}' -*`);

    console.log(`*-(было)-this.user.email = '${this.user.email}' -*`);
    this.user.email = this.email.value;
    console.log(`*-(стало)-this.user.email = '${this.user.email}' -*`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--UserFormComponent-0-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {
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

      // передадим значение сообщения об ошибке для отображения через объект
      // сервиса компоненту AppComponent, подписавшемуся на изменение объекта
      this._errorMessageService.errorMessageSubject.next(message);

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--UserFormComponent-onSubmit-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--UserFormComponent-1-`);

    // запрос на изменение данных о пользователе
    let result: { message: any, user: User } =
      { message: Literals.Ok, user: User.UserToDto(new User()) };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;
      console.log(`*-token: '${token}' -*`);

      let webResult: any = await firstValueFrom(this._webApiService.editUserPOST(
        Config.urlEditUser, this.user, token
      ));
      console.dir(webResult);

      result.user  = User.newUser(webResult.user);

    } catch (e: any) {

      console.dir(e);
      console.dir(e.error);

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null)
        result.message = Resources.unauthorizedUserIdData[this.component.language]
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    console.log(`--UserFormComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.user);

    console.log(`--UserFormComponent-2-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.userId: '${result.message.userId}'`);
      if (result.message.userId != undefined)
        message = result.message.userId === 0
          ? Resources.incorrectUserIdData[this.component.language]
          : Resources.notRegisteredUserIdData[this.component.language];

      console.log(`--result.message.userName: '${result.message.userName}'`);
      if (result.message.userName != undefined)
        message = Resources.userFormIncorrectNewUserName[this.component.language];

      console.log(`--result.message.phone: '${result.message.phone}'`);
      if (result.message.phone === Literals.empty)
        message = Resources.userFormIncorrectNewPhone[this.component.language];

      console.log(`--result.message.email: '${result.message.email}'`);
      if (result.message.email === Literals.empty)
        message = Resources.userFormIncorrectNewEmail[this.component.language];

      // ошибки изменения номера телефона
      if (result.message.phone) {
        console.dir(result.message.phone);
        console.log('телефон есть');

        // добавить телефон в список зарегистрированных
        this.registeredPhones.push(result.message.phone);
        console.dir(this.registeredPhones);

        // проверка номера телефона и email на совпадение с зарегистрированными
        this.checkingExisting({ phone: this.phone.value, email: this.email.value });

        // сообщение об ошибке
        message = Resources.registeredPhone[this.component.language];

      } // if

      // ошибки изменения email
      if (result.message.email) {
        console.dir(result.message.email);
        console.log('email есть');

        // добавить email в список зарегистрированных
        this.registeredEmails.push(result.message.email);
        console.dir(this.registeredEmails);

        // проверка номера телефона и email на совпадение с зарегистрированными
        this.checkingExisting({ phone: this.phone.value, email: this.email.value });

        // сообщение об ошибке
        message = Resources.registeredEmail[this.component.language];

      } // if

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // изменим результат на сообщение для вывода
      result.message = message;

      //return;
    } else {
      // иначе - сообщение об успехе
      result.message = Resources.userFormOkData[this.component.language];

      // обновим данные о пользователе в сервисе-хранилище
      // и передадим изменённые данные всем подписчикам
      this._userService.user = result.user;

      // перезаписать данные в хранилище
      this._userService.saveUserToLocalStorage();

      // перейти по маршруту на домашнюю страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if


    // передадим значение сообщения об ошибке для отображения через объект
    // сервиса компоненту AppComponent, подписавшемуся на изменение объекта
    this._errorMessageService.errorMessageSubject.next(result.message);

    console.log(`--UserFormComponent-onSubmit-]`);

  } // onSubmit


  // создание объектов полей ввода формы изменения данных о пользователе
  createFormControls(): void {

    console.log(`[-UserFormComponent-createFormControls--`);

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

    // поле ввода пароля пользователя
    /*this.password = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required,
        /!*Validators.minLength(this.component.passwordMinLength),
        Validators.maxLength(this.component.passwordMaxLength),*!/
        UserValidators.password(this.user.password)
      ]
    );*/

    // поле подтверждения пароля пользователя
    /*this.passwordConfirmation = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required/!*,
        Validators.minLength(this.component.passwordMinLength),
        Validators.maxLength(this.component.passwordMaxLength),
        UserValidators.password(this.user.password)*!/
      ]
    );*/

    // поле изменения видимости пароля при вводе
    //this.isDisplayPassword = new FormControl(/*начальное значение*/false);

    console.log(`--UserFormComponent-createFormControls-]`);

  } // createFormControls


  // создание объекта формы изменения данных о пользователе
  createForm(): void {

    console.log(`[-UserFormComponent-createForm--`);

    this.userForm = new FormGroup( {
      userName:             this.userName,
      phone:                this.phone,
      email:                this.email/*,
      password:             this.password,
      passwordConfirmation: this.passwordConfirmation,
      isDisplayPassword:    this.isDisplayPassword*/
    }/*, {
      // !!! валидатор match() назначен на форму !!!
      validators: UserValidators.match(this.password, this.passwordConfirmation)
    }*/);

    // подписка на изменения в форме
    this.userForm.valueChanges.subscribe(
      (data: {
        userName: string, phone: string, email: string/*,
        password: string, isDisplayPassword: boolean*/
      }) => {
        console.log(`[-UserFormComponent-valueChanges.subscribe--`);
        console.dir(data);

        // проверка номера телефона и email на совпадение с зарегистрированными
        this.checkingExisting({ phone: data.phone, email: data.email });

        console.log(`--UserFormComponent-valueChanges.subscribe-]`);
      }
    ); // subscribe

    console.log(`--UserFormComponent-createForm-]`);

  } // createForm


  // проверка номера телефона и email на совпадение с зарегистрированными
  checkingExisting(data: { phone: string, email: string }): void {

    console.log(`[-UserFormComponent-checkingExisting--`);

    this.component.errorRegisteredPhone.isRegistered =
      this.registeredPhones.some((phone: string) => phone === data.phone);
    console.dir(this.component.errorRegisteredPhone.isRegistered);

    this.component.errorRegisteredEmail.isRegistered =
      this.registeredEmails.some((email: string) => email === data.email);
    console.dir(this.component.errorRegisteredEmail.isRegistered);

    console.log(`--UserFormComponent-checkingExisting-]`);

  } // checkingExisting


  // отмена подписки на изменение значения языка
  // отображения при уничтожении компонента
  ngOnDestroy(): void {

    console.log(`[-UserFormComponent-ngOnDestroy--`);

    this._languageSubscription.unsubscribe();

    console.log(`--UserFormComponent-ngOnDestroy-]`);

  } // ngOnDestroy

} // class UserFormComponent
// ----------------------------------------------------------------------------
