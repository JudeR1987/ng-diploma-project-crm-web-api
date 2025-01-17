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
import {WebApiService} from '../../services/web-api.service';
import {User} from '../../models/classes/User';
import {AuthGuardService} from '../../services/auth-guard.service';
import {LoginModel} from '../../models/classes/LoginModel';
import {async} from 'rxjs';
import {LoginComponent} from '../login/login.component';
//import {Config} from '../../temp/Config';
//import {Purpose} from '../../temp/Purpose';
//import {Client} from '../../temp/Client';
//import {Query01ModalFormComponent} from '../query01-modal-form/query01-modal-form.component';
//import {Query02ModalFormComponent} from '../../temp/query02-modal-form/query02-modal-form.component';
//import {Query03ModalFormComponent} from '../../temp/query03-modal-form/query03-modal-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink, RouterOutlet, /*Query01ModalFormComponent,
    Query02ModalFormComponent, Query03ModalFormComponent, */LanguageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // объект с параметрами компонента
  public component: IAppComponent = {
    // параметры меняющиеся при смене языка
    title: { 'rus': Literals.empty, 'eng': Literals.empty },
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
    footerEMailTitle:  Literals.footerEMailTitle,
    footerEMailHref:   Literals.footerEMailHref,
    footerEMailValue:  Literals.footerEMailValue,
    errorMessage:      Literals.empty,
    srcPhoto:          Literals.srcPhoto,
    fileNamePhotoDef:  Literals.fileNamePhotoDef
  };

  // параметры активности ссылки "Home"
  public brandActive: IBrand = {
    back: Literals.navbarBrandActive,
    icon: Literals.iconLight,
    routerLinkActive: Literals.empty
  };

  // сведения о jwt-токене безопасности
  public jwtToken: string | null = Literals.empty;

  // сведения о пользователе
  public user: User = new User();

  // флаг включения спиннера при ожидании данных с сервера
  //public isWaitFlag: boolean = false;

  // сведения о всех целях поездки для использования в запросах
  //public purposes: Purpose[] = [];

  // сведения о минимальной и максимальной стоимости
  // транспортных услуг для использования в запросах
  //public minTransportCost: number = 0;
  //public maxTransportCost: number = 0;

  // сведения о всех клиентах для использования в запросах
  //public clients: Client[] = [];

  // сведения о минимальном и максимальном количестве дней
  // пребывания клиентов в стране для использования в запросах
  //public minAmountDays: number = 0;
  //public maxAmountDays: number = 0;


  // конструктор с DI для подключения к сервису установки языка
  // и подключения к сервису аутентификации и авторизации пользователя
  constructor(/*private _webApiService: WebApiService,*/
              private _router: Router, private _languageService: LanguageService,
              private _authGuardService: AuthGuardService) {
    Utils.hello();
    Utils.helloComponent(Literals.app);

    console.log(`[-AppComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // получить значение языка отображения из хранилища
    this.component.language = localStorage.getItem(Literals.language) ?? Literals.rus;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    console.log(`--AppComponent-constructor-]`);

  } // constructor


  // 0. установка значений строковых переменных и получение данных
  // о jwt-токене и пользователе сразу после загрузки компонента
  ngOnInit(): void {

    console.log(`[-AppComponent-ngOnInit--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // задать параметры заголовка по умолчанию
    this.component.title = Resources.appTitleDefault;

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this.component.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageService.languageSubject.subscribe((language: string) => {
      console.log(`[-AppComponent-subscribe--`);
      console.log(`*-subscribe-language='${language}'-*`);

      // задать значение языка отображения и установить
      // значения строковых переменных
      this.changeLanguageLiterals(language);

      console.log(`--AppComponent-subscribe-]`);

    }); // subscribe

    // получить данные о jwt-токене
    this.jwtToken = localStorage.getItem(Literals.jwt);

    // получить данные о пользователе
    this.user = User.loadUser();

    // подписаться на изменение данных о пользователе
    this._authGuardService.userSubject.subscribe((user: User) => {
      console.log(`[-AppComponent-subscribe--`);
      console.log(`*-subscribe-user:`);
      console.dir(user);

      console.log(`*-subscribe-this.user:`);
      console.dir(this.user);

      // изменить данные о пользователе
      this.user = User.newUser(user);

      console.log(`*-subscribe-this.user:`);
      console.dir(this.user);

      console.log(`--AppComponent-subscribe-]`);

    }); // subscribe

    // если данные о пользователе есть - отправить запрос на вход в систему
    console.log(`--AppComponent-this.user.isLogin:${this.user.isLogin}`);
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

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.displayTitle =         this.component.title[this.component.language];
    this.component.logoTitle =            Resources.appLogoTitle[this.component.language];
    this.component.butNavBarTitle =       Resources.appButNavBarTitle[this.component.language];
    this.component.butNavBarValue =       Resources.appButNavBarValue[this.component.language];
    this.component.butAboutTitle =        Resources.appButAboutTitle[this.component.language];
    this.component.butAboutValue =        Resources.appButAboutValue[this.component.language];
    this.component.butLoginTitle =        Resources.appButLoginTitle[this.component.language];
    this.component.butLoginValue =        Resources.appButLoginValue[this.component.language];
    this.component.butRegistrationTitle = Resources.appButRegistrationTitle[this.component.language];
    this.component.butRegistrationValue = Resources.appButRegistrationValue[this.component.language];
    this.component.butLogOutTitle =       Resources.appButLogOutTitle[this.component.language];
    this.component.butLogOutValue =       Resources.appButLogOutValue[this.component.language];
    this.component.butStartTitle =        Resources.appButStartTitle[this.component.language];
    this.component.butStartValue =        Resources.appButStartValue[this.component.language];
    this.component.footerTitle =          Resources.appFooterTitle[this.component.language];
    this.component.footerStudentTitle =   Resources.appFooterStudentTitle[this.component.language];
    this.component.footerStudentValue =   Resources.appFooterStudentValue[this.component.language];
    this.component.footerGroupTitle =     Resources.appFooterGroupTitle[this.component.language];
    this.component.footerGroupValue =     Resources.appFooterGroupValue[this.component.language];
    this.component.footerCityTitle =      Resources.appFooterCityTitle[this.component.language];
    this.component.footerCityValue =      Resources.appFooterCityValue[this.component.language];
    this.component.footerShortYearValue = Resources.appFooterShortYearValue[this.component.language];

    console.log(`--AppComponent-changeLanguageLiterals-]`);

  } // changeLanguageLiterals


  // метод перехода в начало страницы
  toStart(): void {
    window.scrollTo(0, 0);
  } // toStart


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
    console.log(`*-this.component.language='${this.component.language}'-*`);

    console.log(`*-elementRef-*`);
    console.dir(elementRef);
    console.log(`*-elementRef.route='${elementRef.component.route}'-*`);

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

      /*case 'countries':
        title = 'Данные таблицы &laquo;СТРАНЫ&raquo;';
        icon = 'icon-dark';
        routerLinkActive = 'tables';
        break;*/

      /*case 'query05':
        title = 'Запрос &numero;5';
        icon = 'icon-dark';
        routerLinkActive = 'queries';
        break;*/

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

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--AppComponent-1-`);

    // запрос на выход из системы
    this.component.errorMessage = await this._authGuardService.logOut(this.user);
    console.log(`--AppComponent-this.component.errorMessage-${this.component.errorMessage}`);

    console.log(`--AppComponent-2-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // переходим к форме входа
    if (this.component.errorMessage != Literals.Ok) {
      // перейти к форме входа
      this._router.navigateByUrl(Literals.routeLogin)
        .then((e) => { console.dir(e); });

      console.log(`--AppComponent-logOut-]`);
      return;
    } // if

    // перейти на главную страницу приложения
    this._router.navigateByUrl(Literals.routeHomeEmpty)
      .then((e) => { console.dir(e); });

    console.log(`--AppComponent-logOut-]`);
  } // logOut











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
