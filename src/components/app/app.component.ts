// ----------------------------------------------------------------------------
// главный компонент приложения, в котором осуществляются переходы по страницам
// ----------------------------------------------------------------------------
import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {Utils} from "../../infrastructure/Utils";
import {IBrand} from "../../infrastructure/IBrand";
import {Literals} from '../../infrastructure/Literals';
import {Resources} from '../../infrastructure/Resources';
import {LanguageComponent} from '../language/language.component';
import {IAppComponent} from '../../models/interfaces/IAppComponent';
import {User} from '../../models/classes/User';
import {AuthGuardService} from '../../services/auth-guard.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {NgIf} from '@angular/common';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, LanguageComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // объект с параметрами компонента
  public component: IAppComponent = {
    // параметры меняющиеся при смене языка
    //title: { 'rus': Literals.empty, 'eng': Literals.empty },
    title:                Resources.appTitleDefault,
    displayTitle:         Literals.empty,
    logoTitle:            Literals.empty,
    butNavBarTitle:       Literals.empty,
    butNavBarValue:       Literals.empty,
    butAboutTitle:        Literals.empty,
    butAboutValue:        Literals.empty,
    butLoginTitle:        Literals.empty,
    butLoginValue:        Literals.empty,
    butRegistrationTitle: Literals.empty,
    butRegistrationValue: Literals.empty,
    butUserFormTitle:     Literals.empty,
    butUserFormValue:     Literals.empty,
    butPasswordFormTitle: Literals.empty,
    butPasswordFormValue: Literals.empty,
    butBusinessTitle:     Literals.empty,
    butBusinessValue:     Literals.empty,
    butLogOutTitle:       Literals.empty,
    butLogOutValue:       Literals.empty,
    butStartTitle:        Literals.empty,
    butStartValue:        Literals.empty,
    footerTitle:          Literals.empty,
    footerStudentTitle:   Literals.empty,
    footerStudentValue:   Literals.empty,
    footerGroupTitle:     Literals.empty,
    footerGroupValue:     Literals.empty,
    footerCityTitle:      Literals.empty,
    footerCityValue:      Literals.empty,
    footerShortYearValue: Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:          Literals.empty,
    isWaitFlag:        false,
    todayYear:         new Date().getFullYear(),
    routeHomeEmpty:    Literals.routeHomeEmpty,
    routeAbout:        Literals.routeAbout,
    routeLogin:        Literals.routeLogin,
    routeRegistration: Literals.routeRegistration,
    routeUserForm:     Literals.routeUserForm,
    footerEMailTitle:  Literals.footerEMailTitle,
    footerEMailHref:   Literals.footerEMailHref,
    footerEMailValue:  Literals.footerEMailValue,
    errorMessage:      { message: Literals.empty, isVisible: false },
    srcPhotoPath:      Literals.srcPhotoPath,
    fileNamePhotoDef:  Literals.fileNamePhotoDef,
    timerId:           Literals.zero,
    timeout:           Literals.timeout
  };

  // параметры активности ссылки "Home"
  public brandActive: IBrand = {
    back: Literals.navbarBrandActive,
    icon: Literals.iconLight,
    routerLinkActive: Literals.empty
  };

  // сведения о jwt-токене безопасности
  //public jwtToken: string | null = Literals.empty;

  // сведения о пользователе
  public user: User = new User();

  // свойство для ограничения длины сообщения об ошибке при выводе
  protected readonly fiveHundred: number = Literals.fiveHundred


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута, подключения к сервису установки языка,
  // подключения к сервису аутентификации/авторизации пользователя,
  // подключения к сервису хранения сообщения об ошибке
  // и подключения к сервисам хранения данных о пользователе и jwt-токене
  constructor(/*private _webApiService: WebApiService,*/
              private _router: Router,
              private _languageService: LanguageService,
              private _authGuardService: AuthGuardService,
              private _errorMessageService: ErrorMessageService,
              private _userService: UserService,
              private _tokenService: TokenService) {
    Utils.hello();
    Utils.helloComponent(Literals.app);

    console.log(`[-AppComponent-constructor--`);

    // получить значение языка отображения из хранилища
    /*console.log(`*-this.component.language='${this.component.language}'-*`);
    this.component.language = localStorage.getItem(Literals.language) ?? Literals.rus;
    console.log(`*-this.component.language='${this.component.language}'-*`);*/

    // получить значение языка отображения из сервиса-хранилища
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    //this.component.language = this._languageService.language;
    //console.log(`*-this.component.language='${this.component.language}'-*`);

    // получить данные о пользователе из сервиса-хранилища
    console.log(`*-this.user: -*`);
    console.dir(this.user);
    console.log(`*-this._userService.user: -*`);
    console.dir(this._userService.user);
    //this.user = this._userService.user;
    //console.log(`*-this.user: -*`);
    //console.dir(this.user);

    console.log(`--AppComponent-constructor-]`);
  } // constructor


  // 0. установка значений строковых переменных и получение данных
  // о jwt-токене и пользователе сразу после загрузки компонента
  ngOnInit(): void {
    console.log(`[-AppComponent-ngOnInit--`);

    // задать параметры заголовка по умолчанию
    //this.component.title = Resources.appTitleDefault;

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageService.languageSubject.subscribe((language: string) => {
      console.log(`[-AppComponent-subscribe--`);
      console.log(`*-subscribe(пришло)-language='${language}'-*`);

      // задать значение языка отображения и установить
      // значения строковых переменных
      this.changeLanguageLiterals(language);

      console.log(`--AppComponent-subscribe-]`);
    }); // subscribe

    // получить данные о пользователе из сервиса-хранилища
    console.log(`*-(было)-this.user: -*`);
    console.dir(this.user);
    this.user = this._userService.user;
    console.log(`*-(стало)-this.user: -*`);
    console.dir(this.user);

    // подписаться на изменение данных о пользователе
    this._userService.userSubject.subscribe((user: User) => {
      console.log(`[-AppComponent-subscribe--`);
      console.log(`*-subscribe(пришло)-user:`);
      console.dir(user);

      console.log(`*-subscribe-(было)-this.user:`);
      console.dir(this.user);

      // изменить данные о пользователе
      this.user = User.newUser(user);

      console.log(`*-subscribe-(стало)-this.user:`);
      console.dir(this.user);

      console.log(`--AppComponent-subscribe-]`);

    }); // subscribe

    // подписаться на изменение значения сообщения об ошибке
    this._errorMessageService.errorMessageSubject
      .subscribe((message: string) => {
        console.log(`[-AppComponent-subscribe--`);
        console.log(`*-subscribe(пришло)-message='${message}'-*`);

        // вывод сообщения
        this.displayMessage(message);

        console.log(`--AppComponent-subscribe-]`);

    }); // subscribe

    // если данные о пользователе есть - отправить запрос на вход в систему
    //console.log(`--AppComponent-this.user.isLogin:${this.user.isLogin}`);
    //if (this.user.isLogin) {
    //  async () => {
    //    await this._authGuardService.login(new LoginModel(this.user.login, this.user.password));
    //  }
    //  this._authGuardService.login(new LoginModel(this.user.login, this.user.password));
    //} // if

    console.log(`--AppComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-AppComponent-changeLanguageLiterals--`);

    console.log(`*-input(пришло)-language='${language}'-*`);
    console.log(`*-(было)-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-(стало)-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.displayTitle         = this.component.title[this.component.language];
    this.component.logoTitle            = Resources.appLogoTitle[this.component.language];
    this.component.butNavBarTitle       = Resources.appButNavBarTitle[this.component.language];
    this.component.butNavBarValue       = Resources.appButNavBarValue[this.component.language];
    this.component.butAboutTitle        = Resources.appButAboutTitle[this.component.language];
    this.component.butAboutValue        = Resources.appButAboutValue[this.component.language];
    this.component.butLoginTitle        = Resources.appButLoginTitle[this.component.language];
    this.component.butLoginValue        = Resources.appButLoginValue[this.component.language];
    this.component.butRegistrationTitle = Resources.appButRegistrationTitle[this.component.language];
    this.component.butRegistrationValue = Resources.appButRegistrationValue[this.component.language];
    this.component.butUserFormTitle     = Resources.appButUserFormTitle[this.component.language];
    this.component.butUserFormValue     = Resources.appButUserFormValue[this.component.language];
    this.component.butPasswordFormTitle = Resources.appButPasswordFormTitle[this.component.language];
    this.component.butPasswordFormValue = Resources.appButPasswordFormValue[this.component.language];
    this.component.butBusinessTitle     = Resources.appButBusinessTitle[this.component.language];
    this.component.butBusinessValue     = Resources.appButBusinessValue[this.component.language];
    this.component.butLogOutTitle       = Resources.appButLogOutTitle[this.component.language];
    this.component.butLogOutValue       = Resources.appButLogOutValue[this.component.language];
    this.component.butStartTitle        = Resources.appButStartTitle[this.component.language];
    this.component.butStartValue        = Resources.appButStartValue[this.component.language];
    this.component.footerTitle          = Resources.appFooterTitle[this.component.language];
    this.component.footerStudentTitle   = Resources.appFooterStudentTitle[this.component.language];
    this.component.footerStudentValue   = Resources.appFooterStudentValue[this.component.language];
    this.component.footerGroupTitle     = Resources.appFooterGroupTitle[this.component.language];
    this.component.footerGroupValue     = Resources.appFooterGroupValue[this.component.language];
    this.component.footerCityTitle      = Resources.appFooterCityTitle[this.component.language];
    this.component.footerCityValue      = Resources.appFooterCityValue[this.component.language];
    this.component.footerShortYearValue = Resources.appFooterShortYearValue[this.component.language];

    console.log(`--AppComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // метод перехода в начало страницы
  toStart(): void {
    //window.scrollTo(Literals.zero, Literals.one);
    Utils.toStart();
  } // toStart


  // отмена срабатывания таймера и удаление всплывающего сообщения
  /*private removeSetTimeout(): void {

    // отменить ранее установленный setTimeout
    clearTimeout(this.component.timerId);

    // удалить всплывающее сообщение
    this.component.errorMessage = { message: Literals.empty, isVisible: false };

  } // removeSetTimeout*/


  // метод, устанавливающий значение заголовка страницы
  // и параметры активной ссылки при переходах между страницами
  private setActivePage(title: string, back: string, icon: string, routerLinkActive: string): void {

    console.log(`[-AppComponent-setActivePage--`);

    this.component.displayTitle = title;
    this.brandActive.back = back;
    this.brandActive.icon = icon;
    this.brandActive.routerLinkActive = routerLinkActive;
    this.toStart();

    console.log(`--AppComponent-setActivePage-]`);

  } // setActivePage


  // обработчик события перехода по маршруту
  onActivateHandler(elementRef: any): void {

    console.log(`[-AppComponent-onActivateHandler--`);

    console.log(`*-elementRef-*`);
    console.dir(elementRef);
    //console.log(`*-elementRef.component = '${elementRef.component}' -*`);
    // если свойство параметров компонента отсутствует - завершаем обработку
    if (elementRef.component === undefined) return;
    /*if (elementRef.component === undefined)
      elementRef.component = { userId: 111, title: "ok" };
    console.log(`*-elementRef.component: -*`);
    console.dir(elementRef.component);*/

    console.log(`*-elementRef.component.route = '${elementRef.component.route}' -*`);
    // если маршрут неопределён, установим ему пустое значение
    if (elementRef.component.route === undefined)
      elementRef.component.route = Literals.empty;
    /*if (elementRef.component.route === undefined) {
      elementRef.component = { oldComponent: elementRef.component, route: Literals.empty };
    }*/
    /*console.log(`*-elementRef.component: -*`);
    console.dir(elementRef.component);*/
    console.log(`*-elementRef.component.route = '${elementRef.component.route}' -*`);

    // выбор значения заголовка и параметров активной страницы
    let back: string = '';
    let icon: string;
    let routerLinkActive: string;

    switch (elementRef.component.route) {

      case Literals.routeHomeEmpty:
        this.component.title = Resources.appHomeTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.empty;
        break;

      case Literals.routeHome:
        this.component.title = Resources.appHomeTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.empty;
        break;

      case Literals.routeAbout:
        this.component.title = Resources.appAboutTitle;
        icon = Literals.iconDark;
        routerLinkActive = Literals.routeAbout;
        break;

      case Literals.routeLogin:
        this.component.title = Resources.appLoginTitle;
        icon = Literals.iconDark;
        routerLinkActive = Literals.routeLogin;
        break;

      case Literals.routeRegistration:
        this.component.title = Resources.appRegistrationTitle;
        icon = Literals.iconDark;
        routerLinkActive = Literals.routeRegistration;
        break;

      case Literals.routeUserForm:
        this.component.title = Resources.appUserFormTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeUserForm;
        break;

      case Literals.routePasswordForm:
        this.component.title = Resources.appPasswordFormTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routePasswordForm;
        break;

      case Literals.routeBusiness:
        this.component.title = Resources.appBusinessTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeBusiness;
        break;

      case Literals.routeCompanyForm:
        this.component.title = elementRef.component.route_mode === Literals.editCompany
          ? Resources.appEditCompanyFormTitle : Resources.appCreateCompanyFormTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeCompanyForm;
        break;

      // маршрут перехода на страницу NotFound
      default:
        this.component.title = Resources.appTitleDefault;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.empty;
        break;

    } // switch

    // установить заголовок и параметры активной страницы
    this.setActivePage(
      this.component.title[this.component.language],
      back, icon, routerLinkActive
    ); // setActivePage

    console.log(`--AppComponent-onActivateHandler-]`);

  } // onActivateHandler


  // выход из системы - удаление данных из хранилища,
  // перейти на главную
  async logOut() {
    console.log(`[-AppComponent-logOut--`);

    // удаление всплывающего сообщения
    //this.removeSetTimeout();

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--AppComponent-1-`);

    // запрос на выход из системы
    let message: any = await this._authGuardService.logOut(this.user);
    console.log(`--AppComponent-message:`);
    console.dir(message);

    console.log(`--AppComponent-2-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // переходим к форме входа
    if (message != Literals.Ok) {

      // ошибки данных
      if (message.logOutModel) message =
        Resources.incorrectUserIdData[this.component.language];

      // ошибки данных о пользователе
      console.log(`--message.userId: '${message.userId}'`);
      if (message.userId != undefined) message =
        Resources.notRegisteredUserIdData[this.component.language];

      // ошибки входа пользователя
      console.log(`--message.isLogin: '${message.isLogin}'`);
      console.log(`--message.userToken: '${message.userToken}'`);
      if (message.isLogin != undefined && message.userToken != undefined)
        message = Resources.unauthorizedUserIdData[this.component.language];

      // ошибки сервера
      console.log(`--message.title: '${message.title}'`);
      if (message.title != undefined) message = message.title;
      console.log(`--message: '${message}'`);

      // перейти к форме входа
      this._router.navigateByUrl(Literals.routeLogin)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } else {
      // иначе - сообщение об успехе
      message = Resources.appLogOutOk[this.component.language];

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

    } // if

    // вывод сообщения
    this.displayMessage(message);

    // установить данные о jwt-токене и пользователе в сервисах в значение
    // по умолчанию и передать изменённые данные всем подписчикам
    this._tokenService.token = Literals.empty;
    this._userService.user = new User();

    // удалить данные из хранилища
    localStorage.removeItem(Literals.jwt);
    localStorage.removeItem(Literals.user);

    console.log(`--AppComponent-logOut-]`);
  } // logOut


  // программный переход к форме изменения данных о пользователе
  routingToUserForm(): void {
    console.log(`[-AppComponent-routingToUserForm--`);

    // маршрут
    let routerLink: string = Literals.routeUserForm;

    // параметр
    let userId: number = this.user.id;

    // переход по маршруту
    /*this._router.navigate([routerLink, userId], {
      state: { user: User.UserToDto(this.user) }
    }).then((e) => { console.log(`*- переход: ${e} -*`); });*/
    this._router.navigateByUrl(`${routerLink}/${userId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--AppComponent-routingToUserForm-]`)

  } // routingToUserForm


  // программный переход к форме изменения пароля пользователя
  routingToPasswordForm(): void {

    console.log(`[-AppComponent-routingToPasswordForm--`);

    // маршрут
    let routerLink: string = Literals.routePasswordForm;

    // параметр
    let userId: number = this.user.id;

    // переход по маршруту
    /*this._router.navigate([routerLink, userId], {
      state: {
        userId: this.user.id,
        password: this.user.password
      }
    }).then((e) => { console.log(`*- переход: ${e} -*`); });*/
    this._router.navigateByUrl(`${routerLink}/${userId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--AppComponent-routingToPasswordForm-]`);

  } // routingToPasswordForm


  // программный переход на страницу ведения бизнеса
  routingToBusiness(): void {

    console.log(`[-AppComponent-routingToBusiness--`);

    // маршрут
    let routerLink: string = Literals.routeBusiness;

    // параметр
    //let userId: number = this.user.id;

    // переход по маршруту
    /*this._router.navigate([routerLink, userId], {
      state: {
        userId: this.user.id,
        password: this.user.password
      }
    }).then((e) => { console.log(`*- переход: ${e} -*`); });*/
    this._router.navigateByUrl(`${routerLink}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

    console.log(`--AppComponent-routingToBusiness-]`);

  } // routingToBusiness


  // метод вывода сообщения
  displayMessage(message: string): void {

    // удаление всплывающего сообщения
    //this.removeSetTimeout();

    // отменить ранее установленный setTimeout
    clearTimeout(this.component.timerId);

    // если сообщение ещё не исчезло, новое сообщение добавляем к старому
    console.log(`*-this.component.errorMessage.message-*`);
    console.log(`*- '${this.component.errorMessage.message}' -*`);
    if (this.component.errorMessage.message != Literals.empty)
      message = this.component.errorMessage.message + Literals.break + message;

    // установить параметры сообщения
    this.component.errorMessage = { message: message, isVisible: true };

    console.log(`*-this.component.errorMessage.message-*`);
    console.log(`*- '${this.component.errorMessage.message}' -*`);

    // сбросить сообщение об ошибке
    this.component.timerId = setTimeout(() => {
        this.component.errorMessage = { message: Literals.empty, isVisible: false };
      }, this.component.errorMessage.message.length < this.fiveHundred
        ? this.component.timeout
        : Literals.timeStop
    ); // setTimeout

  } // displayMessage











  // обработчик клика для получения данных о параметрах запроса №1 с сервера
  /*getQuery01Params(): void {

    // сброс значений параметров
    this.purposes = [];

    // url для получения данных о параметрах запроса №1 от сервера
    let url: string = Config.urlGetQuery01Params;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // подписка на получение результата запроса
    this._webApiService.get(url).subscribe((webResult: any) => {

      // сведения о всех целях поездки, полученные при помощи сервиса
      this.purposes = Purpose.parsePurposes(webResult);

      // выключение спиннера ожидания данных
      this.isWaitFlag = false;

    }); // get

  } // getQuery01Params*/


  // метод получения параметров запроса №1 из формы выбора параметров,
  // переход на страницу отображения результатов запроса №1
  /*sendQuery01ParamsHandler(purposeId: number): void {

    // программный переход на страницу с передачей параметров
    let routerLink: string = "/query01";

    this._router.navigate([routerLink], {queryParams: {purposeId: purposeId}})
      .then((e) => { console.dir(e); });

  } // sendQuery01ParamsHandler*/


  // обработчик клика для получения данных о параметрах запроса №2 с сервера
  /*getQuery02Params(): void {

    // сброс значений параметров
    this.purposes = [];
    this.minTransportCost = this.maxTransportCost = 0;

    // url для получения данных о параметрах запроса №2 от сервера
    let url: string = Config.urlGetQuery02Params;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // подписка на получение результата запроса
    this._webApiService.get(url).subscribe((webResult: {
      purposes: Purpose[], minTransportCost: number, maxTransportCost: number
    }) => {

      // сведения о всех целях поездки, полученные при помощи сервиса
      this.purposes = Purpose.parsePurposes(webResult.purposes);

      // сведения о минимальной и максимальной стоимости
      // транспортных услуг, полученные при помощи сервиса
      this.minTransportCost = webResult.minTransportCost;
      this.maxTransportCost = webResult.maxTransportCost;

      // выключение спиннера ожидания данных
      this.isWaitFlag = false;

    }); // get

  } // getQuery02Params*/


  // метод получения параметров запроса №2 из формы выбора параметров,
  // переход на страницу отображения результатов запроса №2
  /*sendQuery02ParamsHandler(params: {purposeId: number, transportCost: number}): void {

    // программный переход на страницу с передачей параметров
    let routerLink: string = "/query02";
    this._router.navigate(
      [routerLink],
      {
        queryParams: {
          purposeId: params.purposeId,
          transportCost: params.transportCost
        }
      })
      .then((e) => { console.dir(e); });

  } // sendQuery02ParamsHandler*/


  // обработчик клика для получения данных о параметрах запроса №3 с сервера
  /*getQuery03Params(): void {

    // сброс значений параметров
    this.minAmountDays = this.maxAmountDays = 0;

    // url для получения данных о параметрах запроса №3 от сервера
    let url: string = Config.urlGetQuery03Params;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // подписка на получение результата запроса
    this._webApiService.get(url).subscribe((webResult: {
      minAmountDays: number, maxAmountDays: number}) => {

      // сведения о минимальном и максимальном количестве дней
      // пребывания клиентов в стране, полученные при помощи сервиса
      this.minAmountDays = webResult.minAmountDays;
      this.maxAmountDays = webResult.maxAmountDays;

      // выключение спиннера ожидания данных
      this.isWaitFlag = false;

    }); // get

  } // getQuery03Params*/


  // метод получения параметров запроса №3 из формы выбора параметров,
  // переход на страницу отображения результатов запроса №3
  /*sendQuery03ParamsHandler(amountDays: number): void {

    // программный переход на страницу с передачей параметров
    let routerLink: string = "/query03";
    this._router.navigate(
      [routerLink],
      { queryParams: {amountDays: amountDays} })
      .then((e) => { console.dir(e); });

  } // sendQuery03ParamsHandler*/


  // обработчик клика для перехода на страницу отображения результатов запроса №4
  /*viewQuery04(): void {

    // программный переход на страницу без передачи параметров
    let routerLink: string = "/query04";
    this._router.navigateByUrl(routerLink)
      .then((e) => { console.dir(e); });

  } // viewQuery04*/


  // обработчик клика для перехода на страницу отображения результатов запроса №5
  /*viewQuery05(): void {

    // программный переход на страницу без передачи параметров
    let routerLink: string = "/query05";
    this._router.navigateByUrl(routerLink)
      .then((e) => { console.dir(e); });

  } // viewQuery05*/

} // class AppComponent
// ----------------------------------------------------------------------------
