// ----------------------------------------------------------------------------
// компонент отображения формы входа в аккаунт
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {Resources} from '../../infrastructure/Resources';
import {ILoginComponent} from '../../models/interfaces/ILoginComponent';
import {FormsModule, NgForm} from '@angular/forms';
import {LoginModel} from '../../models/classes/LoginModel';
import {AuthGuardService} from '../../services/auth-guard.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: ILoginComponent = {
    title: Literals.empty,
    language: Literals.empty,
    route: Literals.empty,
    validLogin: true,
    errorMessage: Literals.empty,
    isWaitFlag: false
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // объект с данными для входа в систему
  public loginModel: LoginModel = new LoginModel();


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута и подключения к сервису установки языка
  constructor(private _router: Router, private _languageService: LanguageService,
              private _authGuardService: AuthGuardService) {
    Utils.helloComponent(Literals.login);

    console.log(`[-LoginComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1);
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`--LoginComponent-constructor-]`);

  } // constructor


  // 0. установка языка отображения и значений строковых
  // переменных сразу после загрузки компонента
  ngOnInit(): void {

    console.log(`[-LoginComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
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
    this.component.title = Resources.loginTitle[this.component.language];

    console.log(`--LoginComponent-changeLanguageLiterals-]`);

  } // changeLanguageLiterals


  async login(form: NgForm) {

    console.log(`[-LoginComponent-login--`);

    // задать значения параметров входа
    this.loginModel.login    = form.value.username;
    this.loginModel.password = form.value.password;
    this.loginModel.email    = form.value.password;
    this.loginModel.phone    = form.value.password;

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

    // перейти по маршруту на домашнюю страницу
    this._router.navigateByUrl(Literals.routeHomeEmpty)
      .then((e) => { console.dir(e); });

    console.log(`--LoginComponent-login-]`);

  } // login


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

    // перейти по маршруту на домашнюю страницу
    this._router.navigateByUrl(Literals.routeHomeEmpty)
      .then((e) => { console.dir(e); });

    console.log(`--LoginComponent-login-]`);

    // вернуть модель полученного пользователя
    //return User.newUser(webResult.user);

  } // login*/


  // отмена подписки на изменение значения языка
  // отображения при уничтожении компонента
  ngOnDestroy(): void {

    console.log(`[-LoginComponent-ngOnDestroy--`);

    this._languageSubscription.unsubscribe();

    console.log(`--LoginComponent-ngOnDestroy-]`);

  } // ngOnDestroy

} // class LoginComponent
// ----------------------------------------------------------------------------
