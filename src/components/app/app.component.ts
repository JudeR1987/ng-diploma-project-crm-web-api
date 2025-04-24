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

  // сведения о пользователе
  public user: User = new User();

  // свойство для ограничения длины сообщения об ошибке при выводе
  protected readonly fiveHundred: number = Literals.fiveHundred


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
    Utils.hello();
    Utils.helloComponent(Literals.app);
  } // constructor


  // 0. установка значений строковых переменных и получение данных
  // о jwt-токене и пользователе сразу после загрузки компонента
  ngOnInit(): void {

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageService.languageSubject.subscribe((language: string) => {

      // задать значение языка отображения и установить
      // значения строковых переменных
      this.changeLanguageLiterals(language);

    }); // subscribe

    // получить данные о пользователе из сервиса-хранилища
    this.user = this._userService.user;

    // подписаться на изменение данных о пользователе
    this._userService.userSubject.subscribe((user: User) => {

      // изменить данные о пользователе
      this.user = User.newUser(user);

    }); // subscribe

    // подписаться на изменение значения сообщения об ошибке
    this._errorMessageService.errorMessageSubject
      .subscribe((message: string) => {

        // вывод сообщения
        this.displayMessage(message);

    }); // subscribe

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

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

  } // changeLanguageLiterals


  // метод перехода в начало страницы
  toStart(): void {
    Utils.toStart();
  } // toStart


  // метод, устанавливающий значение заголовка страницы
  // и параметры активной ссылки при переходах между страницами
  private setActivePage(title: string, back: string, icon: string, routerLinkActive: string): void {

    this.component.displayTitle = title;
    this.brandActive.back = back;
    this.brandActive.icon = icon;
    this.brandActive.routerLinkActive = routerLinkActive;
    this.toStart();

  } // setActivePage


  // обработчик события перехода по маршруту
  onActivateHandler(elementRef: any): void {

    // если свойство параметров компонента отсутствует - завершаем обработку
    if (elementRef.component === undefined) return;

    // если маршрут неопределён, установим ему пустое значение
    if (elementRef.component.route === undefined)
      elementRef.component.route = Literals.empty;

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

      case Literals.routeServices:
        this.component.title = Resources.appServicesTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeServices;
        break;

      case Literals.routeServiceForm:
        this.component.title = elementRef.component.route_mode === Literals.editService
          ? Resources.appEditServiceFormTitle : Resources.appCreateServiceFormTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeServiceForm;
        break;

      case Literals.routeEmployees:
        this.component.title = Resources.appEmployeesTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeEmployees;
        break;

      case Literals.routeEmployeeForm:
        this.component.title = elementRef.component.route_mode === Literals.editEmployee
          ? Resources.appEditEmployeeFormTitle : Resources.appCreateEmployeeFormTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeEmployeeForm;
        break;

      case Literals.routeSchedule:
        this.component.title = Resources.appScheduleTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeSchedule;
        break;

      case Literals.routeEmployeesServices:
        this.component.title = Resources.appEmployeesServicesTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeEmployeesServices;
        break;

      case Literals.routeClients:
        this.component.title = Resources.appClientsTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeClients;
        break;

      case Literals.routeRecords:
        this.component.title = Resources.appRecordsTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeRecords;
        break;

      case Literals.routeWarehouse:
        this.component.title = Resources.appWarehouseTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeWarehouse;
        break;

      case Literals.routeReports:
        this.component.title = Resources.appReportsTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeReports;
        break;

      case Literals.routeOnlineRecordServices:
        this.component.title = Resources.appOnlineRecordTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeOnlineRecordServices;
        break;

      case Literals.routeOnlineRecordEmployees:
        this.component.title = Resources.appOnlineRecordTitle;
        back = Literals.navbarBrandActive;
        icon = Literals.iconLight;
        routerLinkActive = Literals.routeOnlineRecordEmployees;
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

  } // onActivateHandler


  // выход из системы - удаление данных из хранилища,
  // перейти на главную
  async logOut() {

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // запрос на выход из системы
    let message: any = await this._authGuardService.logOut(this.user);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку,
    // переходим к форме входа
    if (message != Literals.Ok) {

      // ошибки данных
      if (message.logOutModel) message =
        Resources.incorrectUserIdData[this.component.language];

      // ошибки данных о пользователе
      if (message.userId != undefined) message =
        Resources.notRegisteredUserIdData[this.component.language];

      // ошибки входа пользователя
      if (message.isLogin != undefined && message.userToken != undefined)
        message = Resources.unauthorizedUserIdData[this.component.language];

      // ошибки сервера
      if (message.title != undefined) message = message.title;

      // перейти к форме входа
      this._router.navigateByUrl(Literals.routeLogin)
        .then((e) => { console.log(`*- переход: ${e} -*`); });
    }
    else {
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

  } // logOut


  // программный переход к форме изменения данных о пользователе
  routingToUserForm(): void {

    // маршрут
    let routerLink: string = Literals.routeUserForm;

    // параметр
    let userId: number = this.user.id;

    // переход по маршруту
    this._router.navigateByUrl(`${routerLink}/${userId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

  } // routingToUserForm


  // программный переход к форме изменения пароля пользователя
  routingToPasswordForm(): void {

    // маршрут
    let routerLink: string = Literals.routePasswordForm;

    // параметр
    let userId: number = this.user.id;

    // переход по маршруту
    this._router.navigateByUrl(`${routerLink}/${userId}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

  } // routingToPasswordForm


  // программный переход на страницу ведения бизнеса
  routingToBusiness(): void {

    // маршрут
    let routerLink: string = Literals.routeBusiness;

    // переход по маршруту
    this._router.navigateByUrl(`${routerLink}`)
      .then((e) => { console.log(`*- переход: ${e} -*`); });

  } // routingToBusiness


  // метод вывода сообщения
  displayMessage(message: string): void {

    // отменить ранее установленный setTimeout
    clearTimeout(this.component.timerId);

    // если сообщение ещё не исчезло, новое сообщение добавляем к старому
    if (this.component.errorMessage.message != Literals.empty)
      message = this.component.errorMessage.message + Literals.break + message;

    // установить параметры сообщения
    this.component.errorMessage = { message: message, isVisible: true };

    // сбросить сообщение об ошибке
    this.component.timerId = setTimeout(() => {
        this.component.errorMessage = { message: Literals.empty, isVisible: false };
      }, this.component.errorMessage.message.length < this.fiveHundred
        ? this.component.timeout
        : Literals.timeStop
    ); // setTimeout

  } // displayMessage


  // отмена установленного setTimeout при закрытии контейнера с сообщением
  clearSetTimeout(): void {

    // отменить ранее установленный setTimeout
    clearTimeout(this.component.timerId);

    // сбросить сообщение
    this.component.errorMessage = { message: Literals.empty, isVisible: false };

  } // clearSetTimeout

} // class AppComponent
// ----------------------------------------------------------------------------
