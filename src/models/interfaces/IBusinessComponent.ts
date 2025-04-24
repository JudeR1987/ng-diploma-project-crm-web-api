// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента BusinessComponent
// ----------------------------------------------------------------------------
export interface IBusinessComponent {

  //#region параметры меняющиеся при смене языка

  // данные о заголовке для разных языков
  title: Record<string, string>,

  // отображаемый заголовок
  displayTitle: string,

  // заголовок области "компании"
  companiesTitle: string,

  // заголовок поля отображения графика работы компании
  labelSchedule: string,

  // заголовок поля отображения телефона компании
  labelPhone: string,

  // всплывающая подсказка на кнопке "создать салон"
  butCreateCompanyTitle: string,

  // значение кнопки "создать салон"
  butCreateCompanyValue: string,

  // всплывающая подсказка на кнопке "изменить салон"
  butEditCompanyTitle: string,

  // значение кнопки "изменить салон"
  butEditCompanyValue: string,

  // всплывающая подсказка на кнопке "перейти на 1-ю"
  butToFirstPageTitle: string,

  // всплывающая подсказка на кнопке "перейти на предыдущую"
  butPreviousTitle: string,

  // значение кнопки "перейти на предыдущую"
  butPreviousValue: string,

  // всплывающая подсказка на кнопке "текущая страница"
  butCurrentPageTitle: string,

  // всплывающая подсказка на кнопке "перейти на следующую"
  butNextTitle: string,

  // значение кнопки "перейти на следующую"
  butNextValue: string,

  // всплывающая подсказка на кнопке "перейти на последнюю"
  butToLastPageTitle: string,

  // всплывающая подсказка на кнопке "Управление салоном"
  butSalonManagementTitle: string,

  // значение кнопки "Управление салоном"
  butSalonManagementValue: string,

  // всплывающая подсказка на кнопке "Управление услугами"
  butServicesManagementTitle: string,

  // значение кнопки "Управление услугами"
  butServicesManagementValue: string,

  // всплывающая подсказка на кнопке "Управление персоналом"
  butEmployeesManagementTitle: string,

  // значение кнопки "Управление персоналом"
  butEmployeesManagementValue: string,

  // всплывающая подсказка на кнопке "Просмотр клиентов"
  butClientsManagementTitle: string,

  // значение кнопки "Просмотр клиентов"
  butClientsManagementValue: string,

  // всплывающая подсказка на кнопке "Просмотр записей"
  butRecordsManagementTitle: string,

  // значение кнопки "Просмотр записей"
  butRecordsManagementValue: string,

  // всплывающая подсказка на кнопке "Управление складом"
  butWarehouseManagementTitle: string,

  // значение кнопки "Управление складом"
  butWarehouseManagementValue: string,

  // всплывающая подсказка на кнопке "Просмотр отчётов"
  butReportsTitle: string,

  // значение кнопки "Просмотр отчётов"
  butReportsValue: string,

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

} // interface IBusinessComponent
// ----------------------------------------------------------------------------
