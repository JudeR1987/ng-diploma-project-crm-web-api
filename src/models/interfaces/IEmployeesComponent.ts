// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента EmployeesComponent
// ----------------------------------------------------------------------------
export interface IEmployeesComponent {

  //#region параметры меняющиеся при смене языка

  // отображаемый заголовок
  displayTitle: string,

  // начальный фрагмент всплывающей подсказки на поле отображения рейтинга сотрудника
  ratingTitleStart: string,

  // заголовок поля отображения имени сотрудника
  labelName: string,

  // заголовок поля отображения телефона сотрудника
  labelPhone: string,

  // заголовок поля отображения e-mail сотрудника
  labelEmail: string,

  // заголовок поля отображения специальности сотрудника
  labelSpecialization: string,

  // заголовок поля отображения должности сотрудника
  labelPosition: string,

  // всплывающая подсказка на кнопке "создать сотрудника"
  butCreateEmployeeTitle: string,

  // значение кнопки "создать сотрудника"
  butCreateEmployeeValue: string,

  // всплывающая подсказка на кнопке "показать расписание"
  butShowScheduleEmployeeTitle: string,

  // значение кнопки "показать расписание"
  butShowScheduleEmployeeValue: string,

  // всплывающая подсказка на кнопке "показать услуги"
  butShowServicesEmployeeTitle: string,

  // значение кнопки "показать услуги"
  butShowServicesEmployeeValue: string,

  // всплывающая подсказка на кнопке "изменить сотрудника"
  butEditEmployeeTitle: string,

  // всплывающая подсказка на кнопке "удалить сотрудника"
  butDeleteEmployeeTitle: string,

  //endregion


  //#region параметры НЕ меняющиеся при смене языка

  // параметр языка отображения
  language: string,

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  route: string,

  // флаг включения спиннера при ожидании данных с сервера
  isWaitFlag: boolean

  //endregion

} // interface IEmployeesComponent
// ----------------------------------------------------------------------------
