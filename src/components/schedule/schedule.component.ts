// ----------------------------------------------------------------------------
// компонент управления расписанием заданного сотрудника заданной компании
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {IScheduleComponent} from '../../models/interfaces/IScheduleComponent';
import {Literals} from '../../infrastructure/Literals';
import {firstValueFrom, Subscription} from 'rxjs';
import {Resources} from '../../infrastructure/Resources';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../services/language.service';
import {WebApiService} from '../../services/web-api.service';
import {ErrorMessageService} from '../../services/error-message.service';
import {TokenService} from '../../services/token.service';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Utils} from '../../infrastructure/Utils';
import {Employee} from '../../models/classes/Employee';
import {Config} from '../../infrastructure/Config';
import {DisplayWorkDayBreakSlots} from '../../models/classes/DisplayWorkDayBreakSlots';
import {DisplayWorkDayBreakSlotsComponent} from '../display-work-day-break-slots/display-work-day-break-slots.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [DisplayWorkDayBreakSlotsComponent, NgClass],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IScheduleComponent = {
    // параметры меняющиеся при смене языка
    title:                        Literals.empty,
    tableTitle:                   Literals.empty,
    butPreviousWeekTitle:         Literals.empty,
    butNextWeekTitle:             Literals.empty,
    labelCheckboxWeekendTitle:    Literals.empty,
    labelCheckboxWorkingDayTitle: Literals.empty,
    labelCheckboxWeekend:         Literals.empty,
    labelCheckboxWorkingDay:      Literals.empty,
    labelWorkDayStartTime:        Literals.empty,
    labelWorkDayEndTime:          Literals.empty,
    butAddBreakSlotTitle:         Literals.empty,
    butRemoveBreakSlotTitle:      Literals.empty,
    labelDuration:                Literals.empty,
    labelFrom:                    Literals.empty,
    butEditWorkDayTitle:          Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:   Literals.empty,
    route:      Literals.empty,
    isWaitFlag: false,
    today:      new Date(),
    firstDay:   new Date(),
    lastDay:    new Date()
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();

  // сведения о выбранном сотруднике
  public employee: Employee = new Employee();

  // массив дат дней недели
  public weekDates: Date[] = [];

  // коллекция рабочих дней заданного сотрудника за заданный период
  // с соответствующими промежутками времени перерывов сотрудника
  public displayWorkDaysBreakSlots: DisplayWorkDayBreakSlots[] = [];

  // свойство для ограничения отображения элементов разметки
  protected readonly zero: number        = Literals.zero;
  protected readonly one: number         = Literals.one;
  protected readonly empty: string       = Literals.empty;
  protected readonly previous: string    = Literals.previous;
  protected readonly next: string        = Literals.next;
  protected readonly title: string       = Literals.title;
  protected readonly value: string       = Literals.value;
  protected readonly bgBackColor: string = Literals.bgBackColor;
  protected readonly fwBold: string      = Literals.fwBold;


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута, подключения объекта активного маршрута для
  // получения параметров маршрута, подключения к сервису установки языка,
  // подключения к web-сервису, подключения к сервису хранения сообщения об ошибке,
  // подключения к сервису хранения данных о jwt-токене
  // и подключения к сервису аутентификации/авторизации пользователя
  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _languageService: LanguageService,
              private _webApiService: WebApiService,
              private _errorMessageService: ErrorMessageService,
              private _tokenService: TokenService,
              private _authGuardService: AuthGuardService) {
    Utils.helloComponent(Literals.schedule);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];

  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {

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


    // получить параметры маршрута
    let employeeId: number = 0;
    // подписка на получение результата перехода по маршруту
    this._activatedRoute.params.subscribe(params => {

      // параметр об Id сотрудника, полученный из маршрута
      employeeId = (params[Literals.id] != undefined && !isNaN(params[Literals.id]) && params[Literals.id] > 0)
        ? +params[Literals.id]
        : 0;
      this.employee.id = employeeId;

    }); // subscribe


    // запрос на получение записи о сотруднике из БД для отображения
    await this.requestGetEmployeeById();

    // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
    if (this.employee.id === this.zero) {

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty)
        .then((e) => { console.log(`*- переход: ${e} -*`); });

      return;
    } // if


    // даты первого и последнего дней текущей недели
    [this.component.firstDay, this.component.lastDay] = Utils.getFirstLastDatesOfWeek(this.component.today);

    // получить массив дат дней текущей недели
    this.weekDates = Utils.getAllDatesOfWeek(this.component.firstDay, this.component.lastDay);


    // запрос на получение коллекции рабочих дней сотрудника с соответствующими
    // коллекциями промежутков времени перерывов сотрудника за заданный период
    // (изначально - текущая неделя)
    await this.requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo();


    // установить соответствующие заголовки
    this.component.title = Resources.scheduleTitle(this.component.language, this.employee.user.userName);
    this.component.tableTitle = Resources.scheduleTableTitle(
      this.component.language, this.component.firstDay, this.component.lastDay);

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title      = Resources.scheduleTitle(this.component.language, this.employee.user.userName);
    this.component.tableTitle = Resources.scheduleTableTitle(
      this.component.language, this.component.firstDay, this.component.lastDay);
    this.component.butPreviousWeekTitle         = Resources.butPreviousWeekTitle[this.component.language];
    this.component.butNextWeekTitle             = Resources.butNextWeekTitle[this.component.language];
    this.component.labelCheckboxWeekendTitle    = Resources.scheduleLabelCheckboxWeekendTitle[this.component.language];
    this.component.labelCheckboxWorkingDayTitle = Resources.scheduleLabelCheckboxWorkingDayTitle[this.component.language];
    this.component.labelCheckboxWeekend         = Resources.labelCheckboxWeekend[this.component.language];
    this.component.labelCheckboxWorkingDay      = Resources.labelCheckboxWorkingDay[this.component.language];
    this.component.labelWorkDayStartTime        = Resources.labelWorkDayStartTime[this.component.language];
    this.component.labelWorkDayEndTime          = Resources.labelWorkDayEndTime[this.component.language];
    this.component.butAddBreakSlotTitle         = Resources.scheduleButAddBreakSlotTitle[this.component.language];
    this.component.butRemoveBreakSlotTitle      = Resources.scheduleButRemoveBreakSlotTitle[this.component.language];
    this.component.labelDuration                = Resources.labelDurationValue[this.component.language];
    this.component.labelFrom                    = Resources.labelFrom[this.component.language];
    this.component.butEditWorkDayTitle          = Resources.butEditParamsTitle[this.component.language];

  } // changeLanguageLiterals


  // запрос на получение записи о сотруднике из БД для отображения
  async requestGetEmployeeById(): Promise<void> {

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

    // запрос на получение записи о сотруднике
    let result: { message: any, employee: Employee } =
      { message: Literals.Ok, employee: new Employee() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetEmployeeById, this.employee.id, token)
      );

      result.employee = Employee.newEmployee(webResult.employee);
    }
    catch (e: any) {

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null)
        result.message = Resources.unauthorizedUserIdData[this.component.language];
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.message.employeeId != undefined)
        message = result.message.employeeId === this.zero
          ? Resources.incorrectEmployeeIdData[this.component.language]
          : Resources.notRegisteredEmployeeIdData[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);

      // при ошибках установить сотруднику нулевой идентификатор
      this.employee.id = this.zero;
    }
    else {

      // присвоить значение полученных данных
      this.employee = result.employee;

    } // if

  } // requestGetEmployeeById


  // запрос на получение коллекции рабочих дней сотрудника с соответствующими коллекциями
  // промежутков времени перерывов сотрудника за заданный период
  async requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo(): Promise<void> {

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

    // запрос на получение рабочих дней сотрудника за период
    let result: { message: any, displayWorkDaysBreakSlots: DisplayWorkDayBreakSlots[] } =
      { message: Literals.Ok, displayWorkDaysBreakSlots: [] };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getAllByIdFromTo(
          Config.urlGetAllWorkDaysBreakSlotsByEmployeeIdFromTo, this.employee.id,
          this.component.firstDay, this.component.lastDay, token
        )
      );

      result.displayWorkDaysBreakSlots = DisplayWorkDayBreakSlots
        .parseDisplayWorkDaysBreakSlots(webResult.displayWorkDaysBreakSlots);
    }
    catch (e: any) {

      // если отсутствует соединение
      if (e.status === Literals.zero)
        result.message = Resources.noConnection[this.component.language];
      // ошибка авторизации ([Authorize])
      else if (e.status === Literals.error401 && e.error === null)
        result.message = Resources.unauthorizedUserIdData[this.component.language];
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - вывод сообщения на экран
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.message.employeeId === this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      // ошибки сервера
      if (result.message.title != undefined) message = result.message.title;

      // если результат уже содержит строку с сообщением
      if ((typeof result.message) === Literals.string) message = result.message;

      // передать сообщение об ошибке в AppComponent для отображения
      this._errorMessageService.errorMessageSubject.next(message);
    }
    else {

      // очистить коллекцию данных
      this.displayWorkDaysBreakSlots = [];

      // получить данные из результата запроса на каждую дату заданного периода времени(неделя).
      // на датах, за которые данные отсутствуют, создать объект с параметрами по умолчанию
      if (result.displayWorkDaysBreakSlots.length < this.weekDates.length) {

        this.weekDates.forEach((weekDate: Date) => {

          let displayWorkDayBreakSlots: DisplayWorkDayBreakSlots = result.displayWorkDaysBreakSlots
            .find((displayWorkDayBreakSlots: DisplayWorkDayBreakSlots) =>
              displayWorkDayBreakSlots.workDay.date.getTime() === weekDate.getTime())
            ?? new DisplayWorkDayBreakSlots();

          // для новых объектов задать параметры
          if (displayWorkDayBreakSlots.workDay.id === this.zero) {
            displayWorkDayBreakSlots.workDay.date = new Date(weekDate);
            displayWorkDayBreakSlots.workDay.employeeId = this.employee.id;
          } // if

          this.displayWorkDaysBreakSlots.push(displayWorkDayBreakSlots);

        }); // forEach
      }
      else
        this.displayWorkDaysBreakSlots = result.displayWorkDaysBreakSlots;

    } // if

  } // requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo


  // обработчик клика кнопок запросов на расписание другой недели
  // (предыдущей или следующей)
  async getWeekDates(mode: string): Promise<void> {

    // в зависимости от кнопки, получить соответствующую дату
    let date: Date;
    if (mode === this.previous) {

      // получить дату до отображаемой недели
      date = new Date(this.component.firstDay);
      date.setDate(date.getDate() - 1);
    }
    else {

      // получить дату после отображаемой недели
      date = new Date(this.component.lastDay);
      date.setDate(date.getDate() + 1);

    } // if

    // получить даты первого и последнего дней выбранной недели
    [this.component.firstDay, this.component.lastDay] = Utils.getFirstLastDatesOfWeek(date);

    // получить массив дат дней выбранной недели
    this.weekDates = Utils.getAllDatesOfWeek(this.component.firstDay, this.component.lastDay);


    // запрос на получение коллекции рабочих дней сотрудника с соответствующими
    // коллекциями промежутков времени перерывов сотрудника за заданный период
    await this.requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo();

    // установить заголовок таблицы
    this.component.tableTitle = Resources.scheduleTableTitle(
      this.component.language, this.component.firstDay, this.component.lastDay);

  } // getWeekDates


  // обработчик события получения данных для изменения об объекте рабочего
  // дня сотрудника с коллекцией промежутков времени перерывов сотрудника
  async sendDisplayWorkDayBreakSlotsHandler(displayWorkDayBreakSlots: DisplayWorkDayBreakSlots): Promise<void> {

    // запрос на добавление/изменение данных о рабочем дне сотрудника
    await this.onSubmit(displayWorkDayBreakSlots);


    // запрос на получение коллекции рабочих дней сотрудника с соответствующими
    // коллекциями промежутков времени перерывов сотрудника за ! ТОТ ЖЕ ! период
    await this.requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo();

  } // sendDisplayWorkDayBreakSlotsHandler


  // выполнение запроса на добавление/изменение данных о рабочем дне сотрудника
  async onSubmit(displayWorkDayBreakSlots: DisplayWorkDayBreakSlots): Promise<void> {

    // при Id=0 - запрос на добавление, иначе - запрос
    // на изменение данных о рабочем дне сотрудника
    let workDayId: number = displayWorkDayBreakSlots.workDay.id;

    // корректировка даты +3часа, т.к. на сервере определяется как UTC+0
    displayWorkDayBreakSlots.workDay.date
      .setHours(displayWorkDayBreakSlots.workDay.date.getHours() + 3);

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

    // запрос на добавление/изменение данных о рабочем дне сотрудника
    let result: any = Literals.Ok;
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        workDayId === this.zero
          ? this._webApiService.createWorkDayPUT(Config.urlCreateWorkDay, displayWorkDayBreakSlots, token)
          : this._webApiService.editWorkDayPOST(Config.urlEditWorkDay, displayWorkDayBreakSlots, token)
      );
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

    // если сообщение с ошибкой - завершаем обработку, остаёмся на странице
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      if (result.workDayId != undefined)
        message = result.workDayId === this.zero
          ? Resources.incorrectWorkDayIdData[this.component.language]
          : Resources.notRegisteredWorkDayIdData[this.component.language];

      if (result.employeeId === this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      if (result.date === this.zero)
        message = Resources.scheduleIncorrectDateData[this.component.language];

      // ошибки сервера
      if (result.title != undefined) message = result.title;

      if (result.createMessage != undefined) message = result.createMessage;

      if (result.updateMessage != undefined) message = result.updateMessage;

      // если результат уже содержит строку с сообщением
      if ((typeof result) === Literals.string) message = result;

      // изменить результат на сообщение для вывода
      result = message;
    }
    else {

      // иначе - сообщение об успехе
      result = workDayId === this.zero
        ? Resources.createDataOk[this.component.language]
        : Resources.editDataOk[this.component.language];

    } // if

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(result);

  } // onSubmit


  // метод отображения всплывающей подсказки/значения дня недели в зависимости от языка
  public labelWeekDayValue(mode: string, language: string, date: Date): string {

    // переопределяем день недели: понедельник = 0...воскресенье = 6
    let dayOfWeek: number = date.getDay() === 0
      ? 6                  // воскресенье делаем последним днём недели
      : date.getDay() - 1; // остальные дни смещаем по индексу для удобства вычислений

    // выбор значения
    let label: string;
    switch (dayOfWeek) {
      case 0:
        label = mode === this.title
          ? Resources.labelMondayTitle[language]
          : Resources.labelMondayValue[language];
        break;
      case 1:
        label = mode === this.title
          ? Resources.labelTuesdayTitle[language]
          : Resources.labelTuesdayValue[language];
        break;
      case 2:
        label = mode === this.title
          ? Resources.labelWednesdayTitle[language]
          : Resources.labelWednesdayValue[language];
        break;
      case 3:
        label = mode === this.title
          ? Resources.labelThursdayTitle[language]
          : Resources.labelThursdayValue[language];
        break;
      case 4:
        label = mode === this.title
          ? Resources.labelFridayTitle[language]
          : Resources.labelFridayValue[language];
        break;
      case 5:
        label = mode === this.title
          ? Resources.labelSaturdayTitle[language]
          : Resources.labelSaturdayValue[language];
        break;
      default:
        label = mode === this.title
          ? Resources.labelSundayTitle[language]
          : Resources.labelSundayValue[language];
    } // switch

    return label;
  } // labelWeekDayValue


  // метод выполнения/НЕ_выполнения обновления токена
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


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {

    // отмена подписки
    this._languageSubscription.unsubscribe();

  } // ngOnDestroy

} // class ScheduleComponent
// ----------------------------------------------------------------------------
