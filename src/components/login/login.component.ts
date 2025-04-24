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
    passwordInputTypes:  Literals.passwordInputTypes
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

    // получить маршрут
    this.component.route = this._router.url.slice(1);

  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit(): void {

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

    // создание объектов полей ввода и формы входа
    this.createFormControls();
    this.createForm();

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

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

  } // changeLanguageLiterals


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {

    // задать значения параметров входа

    // если длина логина установлена как длина номера телефона,
    // то в качестве логина используем телефон, иначе - почту
    this.loginModel.phone =
      this.component.loginLength === Literals.phoneLength
        ? this.login.value
        : Literals.empty;

    this.loginModel.email =
      this.component.loginLength === Literals.emailLength
        ? this.login.value
        : Literals.empty;

    this.loginModel.password = this.password.value;

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // запрос на вход в систему
    let result: { message: any, token: string, user: User } =
      await this._authGuardService.login(this.loginModel);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся в форме входа
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
    }
    else {

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

  } // onSubmit


  // создание объектов полей ввода формы входа
  createFormControls(): void {

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

  } // createFormControls


  // создание объекта формы входа
  createForm(): void {

    this.loginForm = new FormGroup( {
      login:             this.login,
      password:          this.password,
      isDisplayPassword: this.isDisplayPassword
    });

    // подписка на изменения в форме регистрации
    this.loginForm.valueChanges.subscribe(
      (data: { login: string, password: string, isDisplayPassword: boolean }) => {

        // в зависимости от логина (телефон или почта),
        // требуется установить длину логина

        // установить длину логина как у номера телефона
        if (this.login.errors && this.login.errors[this.component.errorPhoneValidator])
          this.component.loginLength = Literals.phoneLength;

        // установить длину логина как у e-mail
        if (this.login.errors && this.login.errors[this.component.errorEmailValidator])
          this.component.loginLength = Literals.emailLength;
      }
    ); // subscribe

  } // createForm


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy(): void {

    // отмена подписки
    this._languageSubscription.unsubscribe();

  } // ngOnDestroy

} // class LoginComponent
// ----------------------------------------------------------------------------
