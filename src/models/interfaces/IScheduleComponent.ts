// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента ScheduleComponent
// ----------------------------------------------------------------------------
export interface IScheduleComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

  // заголовок таблицы
  tableTitle: string,

  // всплывающая подсказка на кнопке "предыдущая неделя"
  butPreviousWeekTitle: string,

  // всплывающая подсказка на кнопке "следующая неделя"
  butNextWeekTitle: string,

  // всплывающие подсказки в поле чек-бокса "рабочий/НЕ_рабочий день" в дочернем компоненте
  labelCheckboxWeekendTitle: string,
  labelCheckboxWorkingDayTitle: string,

  // значения заголовка чек-бокса выбора признака рабочего дня в дочернем компоненте
  labelCheckboxWeekend: string,
  labelCheckboxWorkingDay: string,

  // заголовок поля выбора времени начала рабочего дня сотрудника
  labelWorkDayStartTime: string,

  // заголовок поля выбора времени окончания рабочего дня сотрудника
  labelWorkDayEndTime: string,

  // всплывающая подсказка на кнопке "добавить перерыв"
  butAddBreakSlotTitle: string,

  // всплывающая подсказка на кнопке "убрать перерыв"
  butRemoveBreakSlotTitle: string,

  // части заголовка дополнительного фрагмента контейнера промежутка времени
  labelDuration: string,
  labelFrom:     string,

  // всплывающая подсказка на кнопке "изменить параметры"
  butEditWorkDayTitle: string,

  // начальный фрагмент всплывающей подсказки на поле отображения рейтинга сотрудника
  //ratingTitleStart: string,

  // заголовок поля отображения имени сотрудника
  //labelName: string,

  // заголовок поля отображения телефона сотрудника
  //labelPhone: string,

  // заголовок поля отображения e-mail сотрудника
  //labelEmail: string,

  // заголовок поля отображения специальности сотрудника
  //labelSpecialization: string,

  // заголовок поля отображения должности сотрудника
  //labelPosition: string,

  // заголовок поля отображения рейтинга сотрудника
  //labelRating: string,

  // всплывающая подсказка на кнопке "создать сотрудника"
  //butCreateEmployeeTitle: string,

  // значение кнопки "создать сотрудника"
  //butCreateEmployeeValue: string,

  // всплывающая подсказка на кнопке "показать расписание"
  //butShowScheduleEmployeeTitle: string,

  // значение кнопки "показать расписание"
  //butShowScheduleEmployeeValue: string,

  // всплывающая подсказка на кнопке "изменить сотрудника"
  //butEditEmployeeTitle: string,

  // значение кнопки "изменить сотрудника"
  //butEditEmployeeValue: string,

  // всплывающая подсказка на кнопке "удалить сотрудника"
  //butDeleteEmployeeTitle: string,

  // значение кнопки "удалить сотрудника"
  //butDeleteEmployeeValue: string,

  // всплывающая подсказка на кнопке "перейти на 1-ю"
  //butToFirstPageTitle: string,

  // всплывающая подсказка на кнопке "перейти на предыдущую"
  //butPreviousTitle: string,

  // значение кнопки "перейти на предыдущую"
  //butPreviousValue: string,

  // всплывающая подсказка на кнопке "текущая страница"
  //butCurrentPageTitle: string,

  // всплывающая подсказка на кнопке "перейти на следующую"
  //butNextTitle: string,

  // значение кнопки "перейти на следующую"
  //butNextValue: string,

  // всплывающая подсказка на кнопке "перейти на последнюю"
  //butToLastPageTitle: string,

  // всплывающая подсказка на кнопке "Управление салоном"
  //butSalonManagementTitle: string,

  // значение кнопки "Управление салоном"
  //butSalonManagementValue: string,

  // всплывающая подсказка на кнопке "Управление персоналом"
  //butEmployeesManagementTitle: string,

  // значение кнопки "Управление персоналом"
  //butEmployeesManagementValue: string,

  // всплывающая подсказка на кнопке "Управление складом"
  //butWarehouseManagementTitle: string,

  // значение кнопки "Управление складом"
  //butWarehouseManagementValue: string,

  // всплывающая подсказка на кнопке "Просмотр отчётов"
  //butReportsTitle: string,

  // значение кнопки "Просмотр отчётов"
  //butReportsValue: string,

  //endregion


  //#region параметры НЕ меняющиеся при смене языка

  // параметр языка отображения
  language: string,

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  route: string,

  // флаг включения спиннера при ожидании данных с сервера
  isWaitFlag: boolean,

  // параметр для получения сведений о текущей дате
  readonly today: Date,

  // дата первого дня недели заданной даты
  firstDay: Date,

  // дата последнего дня недели заданной даты
  lastDay: Date,

  // путь расположения изображений логотипов в приложении
  //srcLogoPath: string,

  // имя файла с изображением логотипа по умолчанию
  //fileNameLogoDef: string,

  // путь расположения изображений в приложении
  //srcImagePath: string,

  // имя файла с основным изображением компании по умолчанию
  //fileNameCompanyTitleImageDef: string

  //endregion

} // interface IScheduleComponent
// ----------------------------------------------------------------------------
