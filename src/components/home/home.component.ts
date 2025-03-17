// ----------------------------------------------------------------------------
// компонент отображения главной страницы приложения,
// с данными, доступными незарегистрированным пользователям
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {firstValueFrom, Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {Resources} from '../../infrastructure/Resources';
import {IHomeComponent} from '../../models/interfaces/IHomeComponent';
import {Company} from '../../models/classes/Company';
import {WebApiService} from '../../services/web-api.service';
import {Config} from '../../infrastructure/Config';
import {CardCompanyComponent} from '../card-company/card-company.component';
import {ErrorMessageService} from '../../services/error-message.service';
import {PageViewModel} from '../../infrastructure/PageViewModel';
import {PaginationComponent} from '../pagination/pagination.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardCompanyComponent, PaginationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  //public route: string = "";

  // объект с параметрами компонента
  public component: IHomeComponent = {
    // параметры меняющиеся при смене языка
    title:               Literals.empty,
    labelSchedule:       Literals.empty,
    labelPhone:          Literals.empty,
    butRecordTitle:      Literals.empty,
    butRecordValue:      Literals.empty,
    butToFirstPageTitle: Literals.empty,
    butPreviousTitle:    Literals.empty,
    butPreviousValue:    Literals.empty,
    butCurrentPageTitle: Literals.empty,
    butNextTitle:        Literals.empty,
    butNextValue:        Literals.empty,
    butToLastPageTitle:  Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:                     Literals.empty,
    route:                        Literals.empty,
    isWaitFlag:                   false/*,
    srcLogoPath:                  Literals.srcLogoPath,
    fileNameLogoDef:              Literals.fileNameLogoDef,
    srcImagePath:                 Literals.srcImagePath,
    fileNameCompanyTitleImageDef: Literals.fileNameCompanyTitleImageDef*/
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // коллекция зарегистрированных компаний для возможных записей клиентов
  public companies: Company[] = [];

  // информация о пагинации страницы
  public pageViewModel: PageViewModel = new PageViewModel();

  // свойство для ограничения отображения элементов разметки
  protected readonly zero: number = Literals.zero
  protected readonly one: number = Literals.one


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута, подключения к сервису установки языка,
  // подключения к web-сервису, подключения к сервису хранения сообщения об ошибке
  constructor(private _router: Router,
              private _languageService: LanguageService,
              private _webApiService: WebApiService,
              private _errorMessageService: ErrorMessageService) {
    Utils.helloComponent();

    console.log(`[-HomeComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1);
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`*-this.companies: -*`);
    console.dir(this.companies);

    console.log(`--HomeComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-HomeComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-HomeComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--HomeComponent-subscribe-]`);
      }); // subscribe


    // запрос на получение части коллекции компаний для первой страницы
    console.log(`*-(было)-this.companies: -*`);
    console.dir(this.companies);
    console.log(`*-(было)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);
    await this.requestGetAllCompanies(Literals.one);
    console.log(`*-(стало)-this.companies: -*`);
    console.dir(this.companies);
    console.log(`*-(стало)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);

    console.log(`--HomeComponent-ngOnInit-]`);
  } // ngOnInit


  // метод перехода в начало страницы
  /*toStart(): void {
    window.scrollTo(Literals.zero, Literals.zero);
  } // toStart*/


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-HomeComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title               = Resources.homeTitle[this.component.language];
    this.component.labelSchedule       = Resources.labelSchedule[this.component.language];
    this.component.labelPhone          = Resources.displayLabelPhone[this.component.language];
    this.component.butRecordTitle      = Resources.homeButRecordTitle[this.component.language];
    this.component.butRecordValue      = Resources.homeButRecordValue[this.component.language];
    this.component.butToFirstPageTitle = Resources.butToFirstPageTitle[this.component.language];
    this.component.butPreviousTitle    = Resources.butPreviousTitle[this.component.language];
    this.component.butPreviousValue    = Resources.butPreviousValue[this.component.language];
    this.component.butCurrentPageTitle = Resources.butCurrentPageTitle[this.component.language];
    this.component.butNextTitle        = Resources.butNextTitle[this.component.language];
    this.component.butNextValue        = Resources.butNextValue[this.component.language];
    this.component.butToLastPageTitle  = Resources.butToLastPageTitle[this.component.language];

    console.log(`--HomeComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // обработчик события получения данных об Id выбранной компании
  sendCompanyIdHandler(companyId: number): void {
    console.log(`[-HomeComponent-sendCompanyIdHandler--`);

    console.log(`*- companyId: '${companyId}' -*`);

    console.log(`--HomeComponent-sendCompanyIdHandler-]`);
  } // sendCompanyIdHandler


  // обработчик события получения данных о номере выбранной страницы
  async sendPageHandler(page: number): Promise<void> {
    console.log(`[-HomeComponent-sendPageHandler--`);

    console.log(`*- page: '${page}' -*`);

    // переход в начало страницы
    //this.toStart();
    Utils.toStart();

    // удалить элементы части коллекции компаний, загруженные ранее
    console.log(`*-(было)-this.companies: -*`);
    console.dir(this.companies);
    this.companies = [];
    console.log(`*-(стало)-this.companies: -*`);
    console.dir(this.companies);

    // запрос на получение части коллекции компаний для выбранной страницы
    console.log(`*-(было)-this.companies: -*`);
    console.dir(this.companies);
    console.log(`*-(было)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);
    await this.requestGetAllCompanies(page);
    console.log(`*-(стало)-this.companies: -*`);
    console.dir(this.companies);
    console.log(`*-(стало)-this.pageViewModel: -*`);
    console.dir(this.pageViewModel);

    console.log(`--HomeComponent-sendPageHandler-]`);
  } // sendPageHandler


  // запрос на получение коллекции компаний
  async requestGetAllCompanies(page: number): Promise<void> {
    console.log(`[-HomeComponent-requestGetAllCompanies--`);
    console.log(`*- 1 -*`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    // запрос
    let result: { message: any, companies: Company[], pageViewModel: PageViewModel } =
      { message: Literals.Ok, companies: [], pageViewModel: new PageViewModel() };
    try {

      let webResult: any = await firstValueFrom(
        this._webApiService.getAllByPage(Config.urlGetAllCompanies, page)
      );
      console.dir(webResult);

      result.companies = Company.parseCompanies(webResult.companies);
      result.pageViewModel = PageViewModel.newPageViewModel(webResult.pageViewModel);

    } catch (e: any) {

      console.dir(e);
      console.dir(e.error);
      console.dir(e.status);

      // если отсутствует соединение
      if (e.status === Literals.zero) {
        result.message = Resources.noConnection[this.component.language];
      } else
        result.message = e.error;

    } // try-catch

    console.log(`--HomeComponent-result:`);
    console.dir(result);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - вывод сообщения на экран
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.page: '${result.message.page}'`);
      if (result.message.page <= Literals.zero) message =
        Resources.pageIncorrectData[this.component.language];

      // ошибки сервера
      if (result.message.title) message = result.message.title;
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);

    } else {

      // получить данные из результата запроса
      this.companies     = result.companies;
      this.pageViewModel = result.pageViewModel;

    } // if

    console.log(`*- 2 -*`);
    console.log(`--HomeComponent-requestGetAllCompanies-]`);
  } // requestGetAllCompanies


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy(): void {
    console.log(`[-HomeComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--HomeComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class HomeComponent
// ----------------------------------------------------------------------------
