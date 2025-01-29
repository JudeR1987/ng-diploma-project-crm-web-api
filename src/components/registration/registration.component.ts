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
    /*validRegistration:   true,
    errorMessage:        Literals.empty,*/
    isWaitFlag:          false,
    phonePlaceholder:    Literals.phonePlaceholder,
    emailPlaceholder:    Literals.emailPlaceholder,
    phoneLength:         Literals.phoneLength,
    emailLength:         Literals.emailLength,
    errorRequired:       Literals.required,
    errorPhoneValidator: Literals.phoneValidator,
    errorMaxLength:      Literals.maxlength,
    errorEmailValidator: Literals.emailValidator/*,
    timerId:             Literals.zero,
    timeout:             Literals.timeout*/
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // объект с данными для регистрации в системе
  public loginModel: LoginModel = new LoginModel();

  // объект формы регистрации
  public registrationForm: FormGroup = null!;

  // поле ввода телефона пользователя
  public phone: FormControl = null!;

  // поле ввода e-mail пользователя
  public email: FormControl = null!;

  // коллекция зарегистрированных телефонов
  public registeredPhones: string[] = [];

  // коллекция зарегистрированных email
  public registeredEmails: string[] = [];


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута, подключения к сервису установки языка,
  // подключения к сервису аутентификации/авторизации пользователя
  // и подключения к сервису хранения сообщения об ошибке
  constructor(private _router: Router,
              private _languageService: LanguageService,
              private _authGuardService: AuthGuardService,
              private _errorMessageService: ErrorMessageService) {
    Utils.helloComponent(Literals.registration);

    console.log(`[-RegistrationComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1);
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`--RegistrationComponent-constructor-]`);

  } // constructor


  // 0. установка языка отображения и значений строковых
  // переменных сразу после загрузки компонента
  ngOnInit(): void {

    console.log(`[-RegistrationComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-RegistrationComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--RegistrationComponent-subscribe-]`);

      }); // subscribe

    // создание объектов полей ввода и формы регистрации
    this.createFormControls();
    this.createForm();

    console.log(`--RegistrationComponent-ngOnInit-]`);

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    console.log(`[-RegistrationComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title                        = Resources.registrationTitle[this.component.language];
    this.component.labelPhone                   = Resources.registrationLabelPhone[this.component.language];
    this.component.labelEmail                   = Resources.registrationLabelEmail[this.component.language];
    this.component.errorRegisteredPhone.message = Resources.registeredPhone[this.component.language];
    this.component.errorRegisteredEmail.message = Resources.registeredEmail[this.component.language];
    this.component.errorRequiredTitle           = Resources.errorRequired[this.component.language];
    this.component.errorPhoneValidatorTitle     = Resources.errorPhoneValidator[this.component.language];
    this.component.errorEmailMaxLengthTitle     = Resources.registrationErrorEmailMaxLength(this.component.language, this.component.emailLength);
    this.component.errorEmailValidatorTitle     = Resources.errorEmailValidator[this.component.language];
    this.component.phoneNoErrorsTitle           = Resources.registrationPhoneNoErrors[this.component.language];
    this.component.emailNoErrorsTitle           = Resources.registrationEmailNoErrors[this.component.language];
    this.component.butContinueTitle             = Resources.registrationButContinueTitle[this.component.language];
    this.component.butContinueValue             = Resources.registrationButContinueValue[this.component.language];

    console.log(`--RegistrationComponent-changeLanguageLiterals-]`);

  } // changeLanguageLiterals


  // отмена срабатывания таймера и удаление всплывающего сообщения
  /*private removeSetTimeout(): void {

    // отменить ранее установленный setTimeout
    clearTimeout(this.component.timerId);

    // удалить всплывающее сообщение
    this.component.validRegistration = true;
    this.component.errorMessage = Literals.empty;

  } // removeSetTimeout*/


  // обработчик события передачи данных из формы на сервер
  async onSubmit(): Promise<void> {

    console.log(`[-RegistrationComponent-onSubmit--`);

    // удаление всплывающего сообщения
    //this.removeSetTimeout();

    console.log("Отправка данных на сервер");
    console.dir(this.registrationForm.value);
    console.log(this.registrationForm.valid);

    // задать значения параметров регистрации
    this.loginModel.login    = this.phone.value;
    this.loginModel.phone    = this.phone.value;
    this.loginModel.email    = this.email.value;
    this.loginModel.password = Literals.empty;

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--RegistrationComponent-1-`);

    // запрос на регистрацию в системе
    let result: { message: any, phone: string, email: string } =
      await this._authGuardService.registration(this.loginModel);
    //console.log(`--RegistrationComponent-this.component.errorMessage-${this.component.errorMessage}`);
    console.log(`--RegistrationComponent-result-`);
    console.dir(result);

    console.log(`--RegistrationComponent-2-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;


    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся в форме регистрации
    console.dir(result.message);
    if (result.message != Literals.Ok) {

      // для ошибок данных
      if (result.message.loginModel) result.message =
        Resources.registrationIncorrectData[this.component.language];

      // если получили параметры phone или email, то
      // установить соответствующее сообщение об ошибке
      if (result.phone) {
        console.dir(result.phone);
        console.log('телефон есть');

        // добавить телефон в список зарегистрированных
        this.registeredPhones.push(result.phone);
        console.dir(this.registeredPhones);

        // проверка на существование логина и пароля нового пользователя
        this.checkingExisting(this.registrationForm.value);

        // формирование сообщения об ошибке
        result.message += `${result.message.length > 0 ? Literals.comma + Literals.break : Literals.empty}\
          ${Resources.registeredPhone[this.component.language]}`;

      } // if

      if (result.email) {
        console.dir(result.email);
        console.log('email есть');

        // добавить email в список зарегистрированных
        this.registeredEmails.push(result.email);
        console.dir(this.registeredEmails);

        // проверка на существование логина и пароля нового пользователя
        this.checkingExisting(this.registrationForm.value);

        // формирование сообщения об ошибке
        result.message += `${result.message.length > 0 ? Literals.comma + Literals.break : Literals.empty}\
          ${Resources.registeredEmail[this.component.language]}`;

      } // if

      // установить параметр валидности
      //this.component.validRegistration = false;
      //this.component.errorMessage = result.message;

      // передадим значение сообщения об ошибке для отображения через объект
      // сервиса компоненту AppComponent, подписавшемуся на изменение объекта
      this._errorMessageService.errorMessageSubject.next(result.message);
      console.log(`--RegistrationComponent-onSubmit-]`);

      // сбросить сообщение об ошибке
      /*this.component.timerId = setTimeout(() => {
        this.component.validRegistration = true;
        this.component.errorMessage = Literals.empty;
      }, this.component.errorMessage.length < 100
        ? this.component.timeout
        : Literals.timeStop
      ); // setTimeout*/

      return;
    } // if


    // установить параметр валидности и значение сообщения об ошибке
    //this.component.validRegistration = true;
    //this.component.errorMessage = Literals.empty;

    // перейти по маршруту на форму входа
    this._router.navigateByUrl(Literals.routeLogin)
      .then((e) => { console.dir(e); });

    console.log(`--RegistrationComponent-onSubmit-]`);

  } // onSubmit


  // создание объектов полей ввода формы регистрации
  createFormControls(): void {

    console.log(`[-RegistrationComponent-createFormControls--`);

    // поле ввода телефона пользователя
    this.phone = new FormControl(
      // начальное значение
      Literals.plusSeven,
      // синхронные валидаторы
      [
        Validators.required,
        /*Validators.minLength(Literals.phoneLength),
        Validators.maxLength(Literals.phoneLength),*/
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

    console.log(`--RegistrationComponent-createFormControls-]`);

  } // createFormControls


  // создание объекта формы регистрации
  createForm(): void {

    console.log(`[-RegistrationComponent-createForm--`);

    this.registrationForm = new FormGroup( {
      phone: this.phone,
      email: this.email
    });

    // подписка на изменения в форме регистрации
    this.registrationForm.valueChanges.subscribe(
      (data: { phone: string, email: string }) => {
        console.log(`[-RegistrationComponent-valueChanges.subscribe--`);
        console.dir(data);

        // проверка на существование логина и пароля нового пользователя
        this.checkingExisting(data);

        console.log(`--RegistrationComponent-valueChanges.subscribe-]`);
      }
    ); // subscribe

    console.log(`--RegistrationComponent-createForm-]`);

  } // createForm


  // проверка на существование логина и пароля нового пользователя
  checkingExisting(data: { phone: string, email: string }): void {

    console.log(`[-RegistrationComponent-checkingExisting--`);

    this.component.errorRegisteredPhone.isRegistered =
      this.registeredPhones.some((phone: string) => phone === data.phone);
    console.dir(this.component.errorRegisteredPhone.isRegistered);

    this.component.errorRegisteredEmail.isRegistered =
      this.registeredEmails.some((email: string) => email === data.email);
    console.dir(this.component.errorRegisteredEmail.isRegistered);

    console.log(`--RegistrationComponent-checkingExisting-]`);

  } // checkingExisting


  // отмена подписки на изменение значения языка
  // отображения при уничтожении компонента
  ngOnDestroy(): void {

    console.log(`[-RegistrationComponent-ngOnDestroy--`);

    this._languageSubscription.unsubscribe();

    console.log(`--RegistrationComponent-ngOnDestroy-]`);

  } // ngOnDestroy


  /*async registration(form: NgForm) {

    console.log(`[-RegistrationComponent-registration--`);

    // задать значения параметров входа
    this.loginModel.login    = `${form.value.phone}`;
    this.loginModel.password = `${form.value.phone}`;
    this.loginModel.email    = `${form.value.email}`;
    this.loginModel.phone    = `${form.value.phone}`;

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--RegistrationComponent-1-`);

    // запрос на регистрацию в системе
    //this.component.errorMessage = await this._authGuardService.registration(this.loginModel);
    console.log(`--RegistrationComponent-this.component.errorMessage-${this.component.errorMessage}`);

    console.log(`--RegistrationComponent-2-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // остаёмся в форме регистрации
    if (this.component.errorMessage != Literals.Ok) {
      // установить параметр валидности
      this.component.validRegistration = false;
      console.log(`--RegistrationComponent-registration-]`);
      return;
    } // if

    // установить параметр валидности
    this.component.validRegistration = true;

    // перейти по маршруту на форму входа
    this._router.navigateByUrl(Literals.routeLogin)
      .then((e) => { console.dir(e); });

    console.log(`--RegistrationComponent-registration-]`);

  } // registration*/

} // class RegistrationComponent
// ----------------------------------------------------------------------------
