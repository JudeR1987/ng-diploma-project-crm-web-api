// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента EmployeesServicesComponent
// ----------------------------------------------------------------------------
export interface IEmployeesServicesComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

  // заголовок области "компании"
  //companiesTitle: string,

  // заголовок поля отображения графика работы компании
  //labelSchedule: string,

  // заголовок поля отображения телефона компании
  //labelPhone: string,

  // начальный фрагмент всплывающей подсказки на поле отображения
  // наименования категории услуг в дочернем компоненте
  collapseServicesCategoryNameTitleStart: string,

  // всплывающая подсказка на кнопке "создать услугу"
  //butCreateServiceTitle: string,

  // значение кнопки "создать услугу"
  //butCreateServiceValue: string,

  // начальный фрагмент всплывающей подсказки чек-бокса выбора услуги
  labelIsSelectedServiceTitleStart: string,

  // всплывающая подсказка на фрагменте отображения цены услуги
  labelPriceTitle: string,

  // значение фрагмента отображения цены услуги
  labelPriceValue: string,

  // всплывающая подсказка на фрагменте отображения минимальной цены услуги
  labelMinPriceTitle: string,

  // значение фрагмента отображения минимальной цены услуги
  labelMinPriceValue: string,

  // всплывающая подсказка на фрагменте отображения максимальной цены услуги
  labelMaxPriceTitle: string,

  // значение фрагмента отображения максимальной цены услуги
  labelMaxPriceValue: string,

  // всплывающая подсказка на фрагменте отображения длительности услуги
  labelDurationTitle: string,

  // значение фрагмента отображения длительности услуги
  labelDurationValue: string,

  // всплывающая подсказка на кнопке "показать все услуги"
  butShowAllServicesTitle: string,

  // всплывающая подсказка на кнопке "скрыть все услуги"
  butCloseAllServicesTitle: string,

  // значение кнопки "изменить услугу"
  //butEditServiceValue: string,

  // всплывающая подсказка на кнопке "удалить услугу"
  //butDeleteServiceTitle: string,

  // значение кнопки "удалить услугу"
  //butDeleteServiceValue: string,

  // всплывающая подсказка на кнопке "изменить салон"
  //butEditCompanyTitle: string,

  // значение кнопки "изменить салон"
  //butEditCompanyValue: string,

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

  // флаг переключения картинки при открытии/закрытии скрываемого элемента
  // в дочернем компоненте отображения категории услуг с услугами
  isShowFlag: boolean,

  // путь расположения изображений логотипов в приложении
  //srcLogoPath: string,

  // имя файла с изображением логотипа по умолчанию
  //fileNameLogoDef: string,

  // путь расположения изображений в приложении
  //srcImagePath: string,

  // имя файла с основным изображением компании по умолчанию
  //fileNameCompanyTitleImageDef: string

  //endregion

} // interface IEmployeesServicesComponent
// ----------------------------------------------------------------------------
