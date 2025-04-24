// ----------------------------------------------------------------------------
// компонент отображения формы смены пароля пользователя
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {firstValueFrom, Subscription} from 'rxjs';
import {IPasswordFormComponent} from '../../models/interfaces/IPasswordFormComponent';
import {Resources} from '../../infrastructure/Resources';
import {ErrorMessageService} from '../../services/error-message.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {UserValidators} from '../../validators/UserValidators';
import {WebApiService} from '../../services/web-api.service';
import {Config} from '../../infrastructure/Config';
import {User} from '../../models/classes/User';
import {UserService} from '../../services/user.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.css'
})
export class PasswordFormComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IPasswordFormComponent = {
    // параметры меняющиеся при смене языка
    title:                          Literals.empty,
    labelOldPassword:               Literals.empty,
    labelNewPassword:               Literals.empty,
    labelNewPasswordConfirmation:   Literals.empty,
    labelCheckboxPassword:          Literals.empty,
    errorRequiredTitle:             Literals.empty,
    errorPasswordValidatorTitle:    Literals.empty,
    errorPasswordMinMaxLengthTitle: Literals.empty,
    errorMatchValidatorTitle:       Literals.empty,
    butPasswordEditTitle:           Literals.empty,
    butPasswordEditValue:           Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:               Literals.empty,
    route:                  Literals.empty,
    isWaitFlag:             false,
    passwordPlaceholder:    Literals.passwordPlaceholder,
    passwordMinLength:      Literals.passwordMinLength,
    passwordMaxLength:      Literals.passwordMaxLength,
    errorRequired:          Literals.required,
    errorMinLength:         Literals.minlength,
    errorMaxLength:         Literals.maxlength,
    errorPasswordValidator: Literals.passwordValidator,
    errorMatchValidator:    Literals.matchValidator,
    passwordInputTypes:     Literals.passwordInputTypes
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения об Id пользователя для изменения пароля
  private _userId: number = Literals.zero;

  // сведения о пароле пользователя для изменения
  private _password: string = Literals.empty;

  // поле ввода старого пароля пользователя
  public oldPassword: FormControl = new FormControl();

  // поле ввода нового пароля пользователя
  public newPassword: FormControl = new FormControl();

  // поле подтверждения нового пароля пользователя
  public newPasswordConfirmation: FormControl = new FormControl();

  // поле изменения видимости пароля при вводе
  public isDisplayPassword: FormControl = new FormControl();

  // объект формы изменения пароля пользователя
  public passwordForm: FormGroup = new FormGroup<any>({
    oldPassword:             this.oldPassword,
    newPassword:             this.newPassword,
    newPasswordConfirmation: this.newPasswordConfirmation,
    isDisplayPassword:       this.isDisplayPassword
  });


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
    Utils.helloComponent(Literals.passwordForm);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];

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

    // получить данные о пользователе из сервиса-хранилища
    let user: User = this._userService.user;
    this._userId = user.id;
    this._password = user.password;


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
    if (userId != this._userId) {

      // перейти по маршруту на страницу "NotFound"
      this._router.navigateByUrl(Literals.routeNotFound).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.incorrectUserIdData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // если данные не получены, перейти на домашнюю
    // страницу и вывести сообщение об ошибке
    if (this._userId === Literals.zero || this._password === Literals.empty) {

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty).then((e) => {
        console.log(`*- переход: ${e} -*`);

        // сообщение об ошибке
        this._errorMessageService.errorMessageSubject
          .next(Resources.passwordFormIncorrectData[this.component.language]);

      }); // navigateByUrl

      return;
    } // if


    // создание объектов полей ввода и формы изменения пароля пользователя
    this.createFormControls();
    this.createForm();

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title                          = Resources.passwordFormTitle[this.component.language];
    this.component.labelOldPassword               = Resources.passwordFormLabelOldPassword[this.component.language];
    this.component.labelNewPassword               = Resources.passwordFormLabelNewPassword[this.component.language];
    this.component.labelNewPasswordConfirmation   = Resources.labelPasswordConfirmation[this.component.language];
    this.component.labelCheckboxPassword          = Resources.labelCheckboxPassword[this.component.language];
    this.component.errorRequiredTitle             = Resources.errorRequired[this.component.language];
    this.component.errorPasswordValidatorTitle    = Resources.incorrectPassword[this.component.language];
    this.component.errorPasswordMinMaxLengthTitle = Resources.errorPasswordMinMaxLength(
      this.component.language, this.component.passwordMinLength, this.component.passwordMaxLength);
    this.component.errorMatchValidatorTitle       = Resources.passwordFormErrorMatchValidator[this.component.language];
    this.component.butPasswordEditTitle           = Resources.passwordFormButPasswordEditTitle[this.component.language];
    this.component.butPasswordEditValue           = Resources.butEditValue[this.component.language];

  } // changeLanguageLiterals


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {

    // новый пароль
    let newPassword: string = this.newPasswordConfirmation.value;

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

    // запрос на изменение пароля
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      // запрос на изменение пароля
      let webResult: any = await firstValueFrom(this._webApiService.editPasswordPOST(
        Config.urlEditPassword, this._userId, newPassword, token
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

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.userId != undefined)
        message = result.userId === 0
          ? Resources.incorrectUserIdData[this.component.language]
          : Resources.notRegisteredUserIdData[this.component.language];

      if (result.newPassword != undefined)
        message = Resources.passwordFormIncorrectNewPasswordData[this.component.language];

      // ошибки сервера
      if (result.title != undefined) message = result.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;
    }
    else {

      // иначе - сообщение об успехе
      result = Resources.passwordFormOkData[this.component.language];

      // обновить данные о пользователе в сервисе-хранилище
      // и передать изменённые данные всем подписчикам
      let user: User = this._userService.user;
      user.password = newPassword;
      this._userService.user = user;

      // перезаписать данные в хранилище
      this._userService.saveUserToLocalStorage();

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

  } // onSubmit


  // метод выполнения/НЕ выполнения обновления токена
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


  // создание объектов полей ввода формы изменения пароля пользователя
  createFormControls(): void {

    // поле ввода старого пароля пользователя
    this.oldPassword = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required,
        UserValidators.password(this._password)
      ]
    );

    // поле ввода нового пароля пользователя
    this.newPassword = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.minLength(this.component.passwordMinLength),
        Validators.maxLength(this.component.passwordMaxLength)
      ]
    );

    // поле подтверждения нового пароля пользователя
    this.newPasswordConfirmation = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required
      ]
    );

    // поле изменения видимости пароля при вводе
    this.isDisplayPassword = new FormControl(/*начальное значение*/false);

  } // createFormControls


  // создание объекта формы изменения пароля пользователя
  createForm(): void {

    this.passwordForm = new FormGroup( {
      oldPassword:             this.oldPassword,
      newPassword:             this.newPassword,
      newPasswordConfirmation: this.newPasswordConfirmation,
      isDisplayPassword:       this.isDisplayPassword
    }, {
      // !!! валидатор match() назначен на форму !!!
      validators: UserValidators.match(this.newPassword, this.newPasswordConfirmation)
    });

  } // createForm


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy(): void {

    // отмена подписки
    this._languageSubscription.unsubscribe();

  } // ngOnDestroy

} // class PasswordFormComponent
// ----------------------------------------------------------------------------
