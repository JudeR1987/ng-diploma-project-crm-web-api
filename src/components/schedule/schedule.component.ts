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

  // коллекция рабочих дней сотрудника за период
  // public workDays: WorkDay[] = [];

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

    console.log(`[-ScheduleComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1).split(Literals.slash)[0];
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`*-this.employee: -*`);
    console.dir(this.employee);

    console.log(`*-this.component.today: -*`);
    console.dir(this.component.today);
    console.log(`*-this.component.today.getDay(): '${this.component.today.getDay()}' -*`);
    console.log(`*-this.component.today.toLocaleString(): '${this.component.today.toLocaleString()}' -*`);
    console.log(`*-this.component.today.toLocaleDateString(): '${this.component.today.toLocaleDateString()}' -*`);
    console.log(`*-this.component.today.toLocaleTimeString(): '${this.component.today.toLocaleTimeString()}' -*`);

    console.log(`*-this.displayWorkDaysBreakSlots: -*`);
    console.dir(this.displayWorkDaysBreakSlots);

    console.log(`--ScheduleComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  async ngOnInit(): Promise<void> {
    console.log(`[-ScheduleComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-ScheduleComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--ScheduleComponent-subscribe-]`);
      }); // subscribe


    // получить данные о пользователе из сервиса-хранилища
    /*console.log(`*-(было)-this.user: -*`);
    console.dir(this.user);
    this.user = this._userService.user;
    console.log(`*-(стало)-this.user: -*`);
    console.dir(this.user);*/


    // получить параметры маршрута
    console.dir(this._activatedRoute);
    console.dir(this._activatedRoute.params);
    let employeeId: number = 0;
    // подписка на получение результата перехода по маршруту
    this._activatedRoute.params.subscribe(params => {

      // параметр об Id сотрудника, полученный из маршрута
      console.log(`*-params['id']: '${params[Literals.id]}' -*`);
      employeeId = (params[Literals.id] != undefined && !isNaN(params[Literals.id]) && params[Literals.id] > 0)
        ? +params[Literals.id]
        : 0;
      console.log(`*-employeeId: '${employeeId}' [${typeof employeeId}] -*`);

      console.log(`*-(было)-this.employee.id: '${this.employee.id}' -*`);
      this.employee.id = employeeId;
      console.log(`*-(стало)-this.employee.id: '${this.employee.id}' -*`);

    }); // subscribe

    // проверки на возможность перехода по маршруту
    // (если вводить маршрут в командной строке браузера)

    // ?????????


    console.log(`*-(было)-this.employee: -*`);
    console.dir(this.employee);

    // запрос на получение записи о сотруднике из БД для отображения
    await this.requestGetEmployeeById();

    // если данные не получены(т.е. Id=0), перейти на домашнюю страницу
    if (this.employee.id === this.zero) {
      console.log(`*- Переход на "Home" - 'TRUE' -*`);

      // перейти по маршруту на главную страницу
      this._router.navigateByUrl(Literals.routeHomeEmpty).then((e) => {
        console.log(`*- переход: ${e} -*`);

        console.log(`--ScheduleComponent-ngOnInit-]`);
      }); // navigateByUrl

      return;
    } // if
    console.log(`*- Переход на "Home" - 'FALSE' -*`);

    console.log(`*-(стало)-this.employee: -*`);
    console.dir(this.employee);


    // даты первого и последнего дней текущей недели
    console.log(`*-(было) this.component.firstDay.toLocaleString: '${this.component.firstDay.toLocaleString()}' -*`);
    console.log(`*-(было) this.component.lastDay.toLocaleString: '${this.component.lastDay.toLocaleString()}' -*`);
    [this.component.firstDay, this.component.lastDay] = Utils.getFirstLastDatesOfWeek(this.component.today);
    console.log(`*-(стало) this.component.firstDay.toLocaleString: '${this.component.firstDay.toLocaleString()}' -*`);
    console.log(`*-(стало) this.component.lastDay.toLocaleString: '${this.component.lastDay.toLocaleString()}' -*`);

    // получить массив дат дней текущей недели
    console.log(`*-(было) this.weekDates: -*`);
    console.dir(this.weekDates);
    this.weekDates = Utils.getAllDatesOfWeek(this.component.firstDay, this.component.lastDay);
    console.log(`*-(стало) this.weekDates: -*`);
    console.dir(this.weekDates);

    // запрос на получение коллекции рабочих дней сотрудника с соответствующими
    // коллекциями промежутков времени перерывов сотрудника за заданный период
    // (изначально - текущая неделя)
    console.log(`*-(было)-this.displayWorkDaysBreakSlots: -*`);
    console.dir(this.displayWorkDaysBreakSlots);
    await this.requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo();
    console.log(`*-(стало)-this.displayWorkDaysBreakSlots: -*`);
    console.dir(this.displayWorkDaysBreakSlots);


    // установить соответствующие заголовки
    this.component.title = Resources.scheduleTitle(this.component.language, this.employee.user.userName);
    this.component.tableTitle = Resources.scheduleTableTitle(
      this.component.language, this.component.firstDay, this.component.lastDay);

    console.log(`--ScheduleComponent-ngOnInit-]`);
  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-ScheduleComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

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

    console.log(`--ScheduleComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // запрос на получение записи о сотруднике из БД для отображения
  async requestGetEmployeeById(): Promise<void> {
    console.log(`[-ScheduleComponent-requestGetEmployeeById--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ScheduleComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ScheduleComponent-requestGetEmployeeById-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ScheduleComponent-1-(запрос на получение сотрудника)-`);

    // запрос на получение записи о сотруднике
    let result: { message: any, employee: Employee } =
      { message: Literals.Ok, employee: new Employee() };
    try {
      // получить jwt-токен
      let token: string = this._tokenService.token;

      let webResult: any = await firstValueFrom(
        this._webApiService.getById(Config.urlGetEmployeeById, this.employee.id, token)
      );
      console.dir(webResult);

      result.employee = Employee.newEmployee(webResult.employee);

    }
    catch (e: any) {

      console.dir(e);
      console.dir(e.error);

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null) {
        console.log(`*- отработал [Authorize] -*`);
        result.message = Resources.unauthorizedUserIdData[this.component.language]
      }
      // другие ошибки
      else
        result.message = e.error;

    } // try-catch

    console.log(`--ScheduleComponent-result:`);
    console.dir(result);
    console.dir(result.message);
    console.dir(result.employee);

    console.log(`--ScheduleComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся в форме
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.employeeId: '${result.message.employeeId}'`);
      if (result.message.employeeId != undefined)
        message = result.message.employeeId === this.zero
          ? Resources.incorrectEmployeeIdData[this.component.language]
          : Resources.notRegisteredEmployeeIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
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

    console.log(`--ScheduleComponent-requestGetEmployeeById-]`);
  } // requestGetEmployeeById


  // запрос на получение коллекции рабочих дней сотрудника с соответствующими коллекциями
  // промежутков времени перерывов сотрудника за заданный период
  async requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo(): Promise<void> {
    console.log(`[-ScheduleComponent-requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo--`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ScheduleComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ScheduleComponent-requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ScheduleComponent-1-(запрос на получение рабочих дней)-`);

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
      console.dir(webResult);

      result.displayWorkDaysBreakSlots = DisplayWorkDayBreakSlots
        .parseDisplayWorkDaysBreakSlots(webResult.displayWorkDaysBreakSlots);

    }
    catch (e: any) {

      console.dir(e);
      console.dir(e.error);
      console.dir(e.status);

      // если отсутствует соединение
      if (e.status === Literals.zero) {
        result.message = Resources.noConnection[this.component.language];

        // ошибка авторизации ([Authorize])
      } else if (e.status === Literals.error401 && e.error === null) {
        console.log(`*- отработал [Authorize] -*`);
        result.message = Resources.unauthorizedUserIdData[this.component.language]

        // другие ошибки
      } else
        result.message = e.error;

    } // try-catch

    console.log(`--ScheduleComponent-result:`);
    console.dir(result);

    console.log(`--ScheduleComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - вывод сообщения на экран
    if (result.message != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.message.employeeId: '${result.message.employeeId}'`);
      if (result.message.employeeId === this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      // ошибки сервера
      console.log(`--result.message.title: '${result.message.title}'`);
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

      } else {
        this.displayWorkDaysBreakSlots = result.displayWorkDaysBreakSlots;
      } // if

    } // if

    console.log(`--ScheduleComponent-requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo-]`);
  } // requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo


  // обработчик клика кнопок запросов на расписание другой недели
  // (предыдущей или следующей)
  async getWeekDates(mode: string): Promise<void> {
    console.log(`[-ScheduleComponent-getWeekDates--`);

    // в зависимости от кнопки, получить соответствующую дату
    let date: Date;
    if (mode === this.previous) {

      // получить дату до отображаемой недели
      date = new Date(this.component.firstDay);
      console.log(`*-(было) date.toLocaleString: '${date.toLocaleString()}' -*`);

      date.setDate(date.getDate() - 1);
      console.log(`*-(стало) date.toLocaleString: '${date.toLocaleString()}' -*`);

    } else {

      // получить дату после отображаемой недели
      date = new Date(this.component.lastDay);
      console.log(`*-(было) date.toLocaleString: '${date.toLocaleString()}' -*`);

      date.setDate(date.getDate() + 1);
      console.log(`*-(стало) date.toLocaleString: '${date.toLocaleString()}' -*`);

    } // if

    // получить даты первого и последнего дней выбранной недели
    console.log(`*-(было) this.component.firstDay.toLocaleString: '${this.component.firstDay.toLocaleString()}' -*`);
    console.log(`*-(было) this.component.lastDay.toLocaleString: '${this.component.lastDay.toLocaleString()}' -*`);
    [this.component.firstDay, this.component.lastDay] = Utils.getFirstLastDatesOfWeek(date);
    console.log(`*-(стало) this.component.firstDay.toLocaleString: '${this.component.firstDay.toLocaleString()}' -*`);
    console.log(`*-(стало) this.component.lastDay.toLocaleString: '${this.component.lastDay.toLocaleString()}' -*`);

    // получить массив дат дней выбранной недели
    console.log(`*-(было) this.weekDates: -*`);
    console.dir(this.weekDates);
    this.weekDates = Utils.getAllDatesOfWeek(this.component.firstDay, this.component.lastDay);
    console.log(`*-(стало) this.weekDates: -*`);
    console.dir(this.weekDates);

    // запрос на получение коллекции рабочих дней сотрудника с соответствующими
    // коллекциями промежутков времени перерывов сотрудника за заданный период
    console.log(`*-(было)-this.displayWorkDaysBreakSlots: -*`);
    console.dir(this.displayWorkDaysBreakSlots);
    await this.requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo();
    console.log(`*-(стало)-this.displayWorkDaysBreakSlots: -*`);
    console.dir(this.displayWorkDaysBreakSlots);

    // установить заголовок таблицы
    this.component.tableTitle = Resources.scheduleTableTitle(
      this.component.language, this.component.firstDay, this.component.lastDay);

    console.log(`--ScheduleComponent-getWeekDates-]`);
  } // getWeekDates


  // обработчик события получения данных для изменения об объекте рабочего
  // дня сотрудника с коллекцией промежутков времени перерывов сотрудника
  async sendDisplayWorkDayBreakSlotsHandler(displayWorkDayBreakSlots: DisplayWorkDayBreakSlots): Promise<void> {
    console.log(`[-ScheduleComponent-sendDisplayWorkDayBreakSlotsHandler--`);

    console.log(`*- получили displayWorkDayBreakSlots: -*`);
    console.dir(displayWorkDayBreakSlots);

    // запрос на добавление/изменение данных о рабочем дне сотрудника
    await this.onSubmit(displayWorkDayBreakSlots);

    /*// при Id=0 - запрос на добавление, иначе - запрос
    // на изменение данных о рабочем дне сотрудника
    if (displayWorkDayBreakSlots.workDay.id === this.zero) {
      console.log(`*- добавление данных -*`);

      // запрос на добавление данных
      await this.requestCreateWorkDay(displayWorkDayBreakSlots);

    } else {
      console.log(`*- изменение данных -*`);

      // запрос на изменение данных
      await this.requestEditWorkDay(displayWorkDayBreakSlots);

    } // if*/


    // запрос на получение коллекции рабочих дней сотрудника с соответствующими
    // коллекциями промежутков времени перерывов сотрудника за ! ТОТ ЖЕ ! период
    console.log(`*-(было)-this.displayWorkDaysBreakSlots: -*`);
    console.dir(this.displayWorkDaysBreakSlots);
    await this.requestGetAllWorkDaysBreakSlotsByEmployeeIdFromTo();
    console.log(`*-(стало)-this.displayWorkDaysBreakSlots: -*`);
    console.dir(this.displayWorkDaysBreakSlots);

    // установить заголовок таблицы
    /*this.component.tableTitle = Resources.scheduleTableTitle(
      this.component.language, this.component.firstDay, this.component.lastDay);*/

    console.log(`--ScheduleComponent-sendDisplayWorkDayBreakSlotsHandler-]`);
  } // sendDisplayWorkDayBreakSlotsHandler


  // выполнение запроса на добавление/изменение данных о рабочем дне сотрудника
  async onSubmit(displayWorkDayBreakSlots: DisplayWorkDayBreakSlots): Promise<void> {
    console.log(`[-ScheduleComponent-onSubmit--`);

    // при Id=0 - запрос на добавление, иначе - запрос
    // на изменение данных о рабочем дне сотрудника
    let workDayId: number = displayWorkDayBreakSlots.workDay.id;
    console.log(`*- workDayId: '${workDayId}' -*`);
    if (workDayId === this.zero) console.log(`*- добавление данных -*`);
    else console.log(`*- изменение данных -*`);

    // корректировка даты +3часа, т.к. на сервере определяется как UTC+0
    console.log(`*- displayWorkDayBreakSlots.workDay.date.toLocaleTimeString(): '${displayWorkDayBreakSlots.workDay.date.toLocaleTimeString()}' -*`);
    console.log(`*- displayWorkDayBreakSlots.workDay.date.toTimeString(): '${displayWorkDayBreakSlots.workDay.date.toTimeString()}' -*`);
    displayWorkDayBreakSlots.workDay.date.setHours(displayWorkDayBreakSlots.workDay.date.getHours() + 3);
    console.log(`*- displayWorkDayBreakSlots.workDay.date.toLocaleTimeString(): '${displayWorkDayBreakSlots.workDay.date.toLocaleTimeString()}' -*`);

    // включение спиннера ожидания данных
    this.component.isWaitFlag = true;

    console.log(`--ScheduleComponent-0-(обновление токена)-`);

    // если токена нет ИЛИ время его действия закончилось -
    // выполнить запрос на обновление токена
    if (!this._tokenService.isTokenExists()) {

      // получим результат операции обновления токена
      let result: boolean = await this.isRefreshToken();

      // при завершении с ошибкой - закончить обработку
      if (!result) {

        // выключение спиннера ожидания данных
        this.component.isWaitFlag = false;

        console.log(`--ScheduleComponent-onSubmit-КОНЕЦ-]`);
        return;
      } // if

      // иначе - переходим к последующему запросу
    } // if

    console.log(`--ScheduleComponent-1-(запрос на добавление/изменение рабочего дня)-`);

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
      console.dir(webResult);
    }
    catch (e: any) {

      console.dir(e);
      console.dir(e.error);

      // ошибка авторизации ([Authorize])
      if (e.status === Literals.error401 && e.error === null) {
        console.log(`*- отработал [Authorize] -*`);
        result = Resources.unauthorizedUserIdData[this.component.language]
      }
      // другие ошибки
      else
        result = e.error;

    } // try-catch

    console.log(`--ScheduleComponent-result:`);
    console.dir(result);

    console.log(`--ScheduleComponent-2-(ответ на запрос получен)-`);

    // выключение спиннера ожидания данных
    this.component.isWaitFlag = false;

    // если сообщение с ошибкой - завершаем обработку, остаёмся на странице
    if (result != Literals.Ok) {

      // сформируем соответствующее сообщение об ошибке
      let message: string = Literals.empty;

      // ошибки данных
      console.log(`--result.workDayId: '${result.workDayId}'`);
      if (result.workDayId != undefined)
        message = result.workDayId === this.zero
          ? Resources.incorrectWorkDayIdData[this.component.language]
          : Resources.notRegisteredWorkDayIdData[this.component.language];

      console.log(`--result.employeeId: '${result.employeeId}'`);
      if (result.employeeId === this.zero)
        message = Resources.incorrectEmployeeIdData[this.component.language];

      console.log(`--result.date: '${result.date}'`);
      if (result.date === this.zero)
        message = Resources.scheduleIncorrectDateData[this.component.language];

      // ошибки сервера
      console.log(`--result.title: '${result.title}'`);
      if (result.title != undefined) message = result.title;

      console.log(`--result.createMessage: '${result.createMessage}'`);
      if (result.createMessage != undefined) message = result.createMessage;

      console.log(`--result.updateMessage: '${result.updateMessage}'`);
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

    console.log(`--ScheduleComponent-onSubmit-]`);
  } // onSubmit


  // выполнение запроса на изменение данных о рабочем дне сотрудника
  /*async requestEditWorkDay(displayWorkDayBreakSlots: DisplayWorkDayBreakSlots): Promise<void> {
    console.log(`[-ScheduleComponent-requestEditWorkDay--`);
    console.log(`--ScheduleComponent-requestEditWorkDay-]`);
  } // requestEditWorkDay*/


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
    console.log(`Обновляем токен!`);

    // запрос на обновление токена
    let result: boolean;
    let message: any;
    [result, message] = await this._authGuardService.refreshToken();

    console.log(`--result: '${result}'`);

    console.log(`--message: '${message}'`);
    console.dir(message);

    // сообщение об успехе
    if (message === Literals.Ok)
      message = Resources.refreshTokenOk[this.component.language];

    // ошибки данных
    console.log(`--message.refreshModel: '${message.refreshModel}'`);
    console.dir(message.refreshModel);
    if (message.refreshModel) message =
      Resources.incorrectUserIdData[this.component.language];

    // ошибки данных о пользователе
    console.log(`--message.userId: '${message.userId}'`);
    console.log(`--message.userToken: '${message.userToken}'`);
    if (message.userId != undefined && message.userToken === undefined)
      message = Resources.notRegisteredUserIdData[this.component.language];

    // ошибки входа пользователя
    if (message.userId != undefined && message.userToken != undefined)
      message = Resources.unauthorizedUserIdData[this.component.language];

    // ошибки сервера
    console.log(`--message.title: '${message.title}'`);
    if (message.title != undefined) message = message.title;

    // передать сообщение об ошибке в AppComponent для отображения
    this._errorMessageService.errorMessageSubject.next(message);

    // вернуть логический результат операции
    return result;

  } // isRefreshToken


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-ScheduleComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--ScheduleComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class ScheduleComponent
// ----------------------------------------------------------------------------
