// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента ScheduleComponent
// ----------------------------------------------------------------------------
export interface IScheduleComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

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
