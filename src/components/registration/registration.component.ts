// ----------------------------------------------------------------------------
// компонент отображения формы регистрации пользователя
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {Resources} from '../../infrastructure/Resources';
import {IRegistrationComponent} from '../../models/interfaces/IRegistrationComponent';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginModel} from '../../models/classes/LoginModel';
import {AuthGuardService} from '../../services/auth-guard.service';
import {UserValidators} from '../../validators/UserValidators';
import {NgIf} from '@angular/common';
import {ErrorMessageService} from '../../services/error-message.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IRegistrationComponent = {
    // параметры меняющиеся при смене языка
    title:                    Literals.empty,
    labelPhone:               Literals.empty,
    labelEmail:               Literals.empty,
    errorRegisteredPhone:     { message: Literals.empty, isRegistered: false},
    errorRegisteredEmail:     { message: Literals.empty, isRegistered: false},
    errorRequiredTitle:       Literals.empty,
    errorPhoneValidatorTitle: Literals.empty,
    errorEmailMaxLengthTitle: Literals.empty,
    errorEmailValidatorTitle: Literals.empty,
    phoneNoErrorsTitle:       Literals.empty,
    emailNoErrorsTitle:       Literals.empty,
    butContinueTitle:         Literals.empty,
    butContinueValue:         Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:            Literals.empty,
    route:               Literals.empty,
    isWaitFlag:          false,
    phonePlaceholder:    Literals.phonePlaceholder,
    emailPlaceholder:    Literals.emailPlaceholder,
    phoneLength:         Literals.phoneLength,
    emailLength:         Literals.emailLength,
    errorRequired:       Literals.required,
    errorPhoneValidator: Literals.phoneValidator,
    errorMaxLength:      Literals.maxlength,
    errorEmailValidator: Literals.emailValidator
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // объект с данными для регистрации в системе
  public loginModel: LoginModel = new LoginModel();

  // поле ввода телефона пользователя
  public phone: FormControl = new FormControl();

  // поле ввода e-mail пользователя
  public email: FormControl = new FormControl();

  // объект формы регистрации
  public registrationForm: FormGroup = new FormGroup<any>({
    phone: this.phone,
    email: this.email
  });

  // коллекция зарегистрированных телефонов
  public registeredPhones: string[] = [];

  // коллекция зарегистрированных email
  public registeredEmails: string[] = [];


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута, подключения к сервису установки языка,
  // подключения к сервису аутентификации/авторизации пользователя,
  // подключения к сервису хранения сообщения об ошибке
  // и подключения к сервису хранения данных о пользователе
  constructor(private _router: Router,
              private _languageService: LanguageService,
              private _authGuardService: AuthGuardService,
              private _errorMessageService: ErrorMessageService,
              private _userService: UserService) {
    Utils.helloComponent(Literals.registration);

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

    // создание объектов полей ввода и формы регистрации
    this.createFormControls();
    this.createForm();

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title                        = Resources.registrationTitle[this.component.language];
    this.component.labelPhone                   = Resources.labelPhone[this.component.language];
    this.component.labelEmail                   = Resources.labelEmail[this.component.language];
    this.component.errorRegisteredPhone.message = Resources.registeredPhone[this.component.language];
    this.component.errorRegisteredEmail.message = Resources.registeredEmail[this.component.language];
    this.component.errorRequiredTitle           = Resources.errorRequired[this.component.language];
    this.component.errorPhoneValidatorTitle     = Resources.errorPhoneValidator[this.component.language];
    this.component.errorEmailMaxLengthTitle     = Resources.errorEmailMaxLength(this.component.language, this.component.emailLength);
    this.component.errorEmailValidatorTitle     = Resources.errorEmailValidator[this.component.language];
    this.component.phoneNoErrorsTitle           = Resources.phoneNoErrors[this.component.language];
    this.component.emailNoErrorsTitle           = Resources.registrationEmailNoErrors[this.component.language];
    this.component.butContinueTitle             = Resources.registrationButContinueTitle[this.component.language];
    this.component.butContinueValue             = Resources.registrationButContinueValue[this.component.language];

  } // changeLanguageLiterals


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {

    // задать значения параметров регистрации
    this.loginModel.phone    = this.phone.value;
    this.loginModel.email    = this.email.value;
    this.loginModel.password = Literals.empty;

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // запрос на регистрацию в системе
    let result: any = await this._authGuardService.registration(this.loginModel);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся в форме регистрации
    if (result != Literals.Ok) {

      // ошибки данных
      if (result.loginModel) result =
        Resources.registrationIncorrectData[this.component.language];

      // ошибки сервера
      if (result.title != undefined) result = result.title;

      // ошибки регистрации по номеру телефона
      if (result.phone) {

        // добавить телефон в список зарегистрированных
        this.registeredPhones.push(result.phone);

        // проверка номера телефона и email на совпадение с зарегистрированными
        this.checkingExisting(this.registrationForm.value);

        // формирование сообщения об ошибке
        result = Resources.registeredPhone[this.component.language];

      } // if

      // ошибки регистрации по email
      if (result.email) {

        // добавить email в список зарегистрированных
        this.registeredEmails.push(result.email);

        // проверка номера телефона и email на совпадение с зарегистрированными
        this.checkingExisting(this.registrationForm.value);

        // формирование сообщения об ошибке
        result = Resources.registeredEmail[this.component.language];

      } // if
    }
    else {

      // иначе - сообщение об успехе
      result = Resources.registrationWelcomeOk[this.component.language];

      // перейти по маршруту на форму входа
      this._router.navigateByUrl(Literals.routeLogin)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

  } // onSubmit


  // создание объектов полей ввода формы регистрации
  createFormControls(): void {

    // поле ввода телефона пользователя
    this.phone = new FormControl(
      // начальное значение
      Literals.plusSeven,
      // синхронные валидаторы
      [
        Validators.required,
        UserValidators.phone
      ]
    );

    // поле ввода e-mail пользователя
    this.email = new FormControl(
      // начальное значение
      Literals.empty,
      // синхронные валидаторы
      [
        Validators.required,
        Validators.maxLength(this.component.emailLength),
        UserValidators.email
      ]
    );

  } // createFormControls


  // создание объекта формы регистрации
  createForm(): void {

    this.registrationForm = new FormGroup( {
      phone: this.phone,
      email: this.email
    });

    // подписка на изменения в форме регистрации
    this.registrationForm.valueChanges.subscribe(
      (data: { phone: string, email: string }) => {
        // проверка номера телефона и email на совпадение с зарегистрированными
        this.checkingExisting(data);
      }
    ); // subscribe

  } // createForm


  // проверка номера телефона и email на совпадение с зарегистрированными
  checkingExisting(data: { phone: string, email: string }): void {

    // проверить совпадение с хотя бы одним элементом списка уже зарегистрированных
    this.component.errorRegisteredPhone.isRegistered =
      this.registeredPhones.some((phone: string) => phone === data.phone);

    this.component.errorRegisteredEmail.isRegistered =
      this.registeredEmails.some((email: string) => email === data.email);

  } // checkingExisting


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy(): void {

    // отмена подписки
    this._languageSubscription.unsubscribe();

  } // ngOnDestroy

} // class RegistrationComponent
// ----------------------------------------------------------------------------
