// ----------------------------------------------------------------------------
// компонент отображения формы входа в учётную запись
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {Resources} from '../../infrastructure/Resources';
import {ILoginComponent} from '../../models/interfaces/ILoginComponent';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginModel} from '../../models/classes/LoginModel';
import {AuthGuardService} from '../../services/auth-guard.service';
import {UserValidators} from '../../validators/UserValidators';
import {NgIf} from '@angular/common';
import {User} from '../../models/classes/User';
import {ErrorMessageService} from '../../services/error-message.service';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: ILoginComponent = {
    // параметры меняющиеся при смене языка
    title:                          Literals.empty,
    labelLogin:                     Literals.empty,
    labelPassword:                  Literals.empty,
    labelCheckboxPassword:          Literals.empty,
    errorRequiredTitle:             Literals.empty,
    errorPhoneValidatorTitle:       Literals.empty,
    errorEmailValidatorTitle:       Literals.empty,
    errorPasswordMinMaxLengthTitle: Literals.empty,
    loginNoErrorsTitle:             Literals.empty,
    butLoginTitle:                  Literals.empty,
    butLoginValue:                  Literals.empty,

    // параметры НЕ меняющиеся при смене языка
    language:            Literals.empty,
    route:               Literals.empty,
    /*validLogin:          true,
    errorMessage:        Literals.empty,*/
    isWaitFlag:          false,
    loginPlaceholder:    Literals.loginPlaceholder,
    passwordPlaceholder: Literals.passwordPlaceholder,
    loginLength:         Literals.one,
    passwordMinLength:   Literals.passwordMinLength,
    passwordMaxLength:   Literals.passwordMaxLength,
    errorRequired:       Literals.required,
    errorPhoneValidator: Literals.phoneValidator,
    errorEmailValidator: Literals.emailValidator,
    errorMinLength:      Literals.minlength,
    errorMaxLength:      Literals.maxlength,
    passwordInputTypes:  Literals.passwordInputTypes/*,
    timerId:             Literals.zero,
    timeout:             Literals.timeout*/
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // объект с данными для входа в систему
  public loginModel: LoginModel = new LoginModel();

  // поле ввода логина пользователя
  public login: FormControl = new FormControl();

  // поле ввода пароля пользователя
  public password: FormControl = new FormControl();

  // поле изменения видимости пароля при вводе
  public isDisplayPassword: FormControl = new FormControl();

  // объект формы входа в учётную запись
  public loginForm: FormGroup = new FormGroup<any>({
    login:             this.login,
    password:          this.password,
    isDisplayPassword: this.isDisplayPassword
  });


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута, подключения к сервису установки языка,
  // подключения к сервису аутентификации/авторизации пользователя,
  // подключения к сервису хранения сообщения об ошибке
  // и подключения к сервисам хранения данных о пользователе и jwt-токене
  constructor(private _router: Router,
              private _languageService: LanguageService,
              private _authGuardService: AuthGuardService,
              private _errorMessageService: ErrorMessageService,
              private _userService: UserService,
              private _tokenService: TokenService) {
    Utils.helloComponent(Literals.login);

    console.log(`[-LoginComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1);
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`--LoginComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit(): void {
    console.log(`[-LoginComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-LoginComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--LoginComponent-subscribe-]`);
      }); // subscribe

    // создание объектов полей ввода и формы входа
    this.createFormControls();
    this.createForm();

    console.log(`--LoginComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    console.log(`[-LoginComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title                          = Resources.loginTitle[this.component.language];
    this.component.labelLogin                     = Resources.loginLabelLogin[this.component.language];
    this.component.labelPassword                  = Resources.labelPassword[this.component.language];
    this.component.labelCheckboxPassword          = Resources.labelCheckboxPassword[this.component.language];
    this.component.errorRequiredTitle             = Resources.errorRequired[this.component.language];
    this.component.errorPhoneValidatorTitle       = Resources.errorPhoneValidator[this.component.language];
    this.component.errorEmailValidatorTitle       = Resources.errorEmailValidator[this.component.language];
    this.component.errorPasswordMinMaxLengthTitle = Resources.errorPasswordMinMaxLength(
      this.component.language, this.component.passwordMinLength, this.component.passwordMaxLength);
    this.component.loginNoErrorsTitle             = Resources.loginLoginNoErrors[this.component.language];
    this.component.butLoginTitle                  = Resources.loginButLoginTitle[this.component.language];
    this.component.butLoginValue                  = Resources.loginButLoginValue[this.component.language];

    console.log(`--LoginComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // отмена срабатывания таймера и удаление всплывающего сообщения
  /*private removeSetTimeout(): void {

    // отменить ранее установленный setTimeout
    clearTimeout(this.component.timerId);

    // удалить всплывающее сообщение
    this.component.validLogin = true;
    this.component.errorMessage = Literals.empty;

  } // removeSetTimeout*/


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {

    console.log(`[-LoginComponent-onSubmit--`);

    // удаление всплывающего сообщения
    //this.removeSetTimeout();

    console.log("Отправка данных на сервер");
    console.dir(this.loginForm.value);
    console.log(this.loginForm.valid);

    // задать значения параметров входа

    /*// если длина логина установлена как длина номера телефона,
    // то в поле логина введён телефон, иначе - введена почта
    console.log(`--this.component.loginLength: ${this.component.loginLength}`);
    this.loginModel.login =
      this.component.loginLength === Literals.phoneLength
        ? this.login.value
        : Literals.empty;

    this.loginModel.phone = this.loginModel.login;

    this.loginModel.email =
      this.component.loginLength === Literals.emailLength
        ? this.login.value
        : Literals.empty;

    this.loginModel.password = this.password.value;*/

    // если длина логина установлена как длина номера телефона,
    // то в качестве логина используем телефон, иначе - почту
    console.log(`--this.component.loginLength: ${this.component.loginLength}`);
    this.loginModel.phone =
      this.component.loginLength === Literals.phoneLength
        ? this.login.value
        : Literals.empty;

    this.loginModel.email =
      this.component.loginLength === Literals.emailLength
        ? this.login.value
        : Literals.empty;

    this.loginModel.password = this.password.value;

    console.log(`--this.loginModel:`);
    console.dir(this.loginModel);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--LoginComponent-1-`);

    // запрос на вход в систему
    let result: { message: any, token: string, user: User } =
      await this._authGuardService.login(this.loginModel);
    console.log(`--LoginComponent-result:`);
    console.dir(result);

    console.log(`--LoginComponent-2-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся в форме входа
    console.dir(result.message);
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.message.loginModel) message =
        Resources.loginIncorrectData[this.component.language];

      // ошибки сервера
      if (result.message.title) message = result.message.title;
      if ((typeof result.message) === Literals.string) message = result.message;

      // ошибки авторизации по номеру телефона
      if (result.message.phone) {
        message = result.message.password
          ? Resources.incorrectPassword[this.component.language]
          : Resources.loginUnauthorizedPhone(this.component.language, result.message.phone);
      } // if

      // ошибки авторизации по email
      if (result.message.email) {
        message = result.message.password
          ? Resources.incorrectPassword[this.component.language]
          : Resources.loginUnauthorizedEmail(this.component.language, result.message.email);
      } // if

      // изменить результат на сообщение для вывода
      result.message = message;

      //return;
    } else {
      // иначе - сообщение об успехе
      result.message = Resources.loginWelcomeOk(this.component.language, result.user.userName);

      // сохраним данные о jwt-токене и пользователе в сервисах
      // и передать изменённые данные всем подписчикам
      this._tokenService.token = result.token;
      this._userService.user = result.user;

      // запишем данные в хранилище
      this._tokenService.saveTokenToLocalStorage()
      this._userService.saveUserToLocalStorage();

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result.message);

    console.log(`--LoginComponent-onSubmit-]`);

  } // onSubmit


  // создание объектов полей ввода формы входа
  createFormControls(): void {

    console.log(`[-LoginComponent-createFormControls--`);

    // поле ввода логина пользователя
    this.login = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required,
        UserValidators.login
      ]
    );

    // поле ввода пароля пользователя
    this.password = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.minLength(this.component.passwordMinLength),
        Validators.maxLength(this.component.passwordMaxLength)
      ]
    );

    // поле изменения видимости пароля при вводе
    this.isDisplayPassword = new FormControl(/*начальное значение*/false);

    console.log(`--LoginComponent-createFormControls-]`);

  } // createFormControls


  // создание объекта формы входа
  createForm(): void {

    console.log(`[-LoginComponent-createForm--`);

    this.loginForm = new FormGroup( {
      login:             this.login,
      password:          this.password,
      isDisplayPassword: this.isDisplayPassword
    });

    // подписка на изменения в форме регистрации
    this.loginForm.valueChanges.subscribe(
      (data: { login: string, password: string, isDisplayPassword: boolean }) => {
        console.log(`[-LoginComponent-valueChanges.subscribe--`);
        console.dir(data);

        // в зависимости от логина (телефон или почта),
        // требуется установить длину логина
        console.log(`--this.component.loginLength: ${this.component.loginLength}`);

        // установить длину логина как у номера телефона
        if (this.login.errors && this.login.errors[this.component.errorPhoneValidator])
          this.component.loginLength = Literals.phoneLength;

        // установить длину логина как у e-mail
        if (this.login.errors && this.login.errors[this.component.errorEmailValidator])
          this.component.loginLength = Literals.emailLength;
        console.log(`--this.component.loginLength: ${this.component.loginLength}`);

        console.log(`--LoginComponent-valueChanges.subscribe-]`);
      }
    ); // subscribe

    console.log(`--LoginComponent-createForm-]`);

  } // createForm


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy(): void {

    console.log(`[-LoginComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--LoginComponent-ngOnDestroy-]`);

  } // ngOnDestroy


  /*async login(form: NgForm) {

    console.log(`[-LoginComponent-login--`);

    // задать значения параметров входа
    this.loginModel.login    = form.value.username;
    this.loginModel.phone    = form.value.password;
    this.loginModel.email    = form.value.password;
    this.loginModel.password = form.value.password;

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--LoginComponent-1-`);

    // запрос на вход в систему
    this.component.errorMessage = await this._authGuardService.login(this.loginModel);
    console.log(`--LoginComponent-this.component.errorMessage-${this.component.errorMessage}`);

    console.log(`--LoginComponent-2-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся в форме входа
    if (this.component.errorMessage != Literals.Ok) {
      // установить параметр валидности
      this.component.validLogin = false;
      console.log(`--LoginComponent-login-]`);
      return;
    } // if

    // установить параметр валидности
    this.component.validLogin = true;

    // перейти по маршруту на главную страницу
    this._router.navigateByUrl(Literals.routeHomeEmpty)
      .then((e) => { console.dir(e); });

    console.log(`--LoginComponent-login-]`);

  } // login*/


  /*async login(form: NgForm) {

    console.log(`[-LoginComponent-login--`);

    // задать значения параметров входа
    this.loginModel.login    = form.value.username;
    this.loginModel.password = form.value.password;
    this.loginModel.email    = form.value.password;
    this.loginModel.phone    = form.value.password;

    // запрос на вход в систему
    let webResult: any = await this._authGuardService.login(this.loginModel);

    console.dir(webResult);
    console.dir(webResult.token);
    console.dir(webResult.user);

    /!*this._webApiService
      .loginPOST('https://localhost:5001/api/auth/login', credentials)
      .subscribe(response => {

        const token = (<any>response).token;
        localStorage.setItem('jwt', token);

        this.invalidLogin = false;
        this._router.navigate(['/']);
      }, err => {
        this.invalidLogin = true;
      });*!/

    // записать данные в хранилище
    localStorage.setItem(Literals.jwt, webResult.token);
    localStorage.setItem(Literals.user, JSON.stringify(webResult.user));

    // передадим данные о пользователе через объект компонента
    // другим компонентам, подписавшимся на изменение объекта
    this.userSubject.next(User.newUser(webResult.user));

    // установить параметр валидности
    this.component.validLogin = true;

    // перейти по маршруту на главную страницу
    this._router.navigateByUrl(Literals.routeHomeEmpty)
      .then((e) => { console.dir(e); });

    console.log(`--LoginComponent-login-]`);

    // вернуть модель полученного пользователя
    //return User.newUser(webResult.user);

  } // login*/

} // class LoginComponent
// ----------------------------------------------------------------------------
