// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента ServiceFormComponent
// ----------------------------------------------------------------------------
import {ServicesCategory} from '../classes/ServicesCategory';

export interface IServiceFormComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

  // заголовок списка выбора категории услуг салона
  labelServicesCategory: string,

  // заголовок поля ввода наименования новой категории услуг салона
  labelNewServicesCategoryName: string,

  // заголовок поля ввода наименования услуги салона
  labelServiceName: string,

  // первый элемент списка выбора категории услуг салона
  firstOptionServicesCategories: string,

  // всплывающая подсказка на заголовке чек-бокса "новая категория услуг"
  labelCheckboxIsNewServicesCategoryTitle: string,

  // заголовок чек-бокса включения режима ввода новой категории услуг
  labelCheckboxIsNewServicesCategory: string,

  // заголовок поля ввода минимальной цены на услугу
  labelPriceMin: string,

  // заголовок поля ввода максимальной цены на услугу
  labelPriceMax: string,

  // заголовок поля ввода длительности услуги
  labelDuration: string,

  // заголовок поля ввода текста комментария к услуге
  labelComment: string,

  // шаблон поля ввода наименования новой категории услуг
  newServicesCategoryNamePlaceholder: string,

  // шаблон поля ввода наименования услуги салона
  serviceNamePlaceholder: string,

  // шаблон поля ввода текста комментария к услуге
  commentPlaceholder: string,

  // значения сообщений об ошибках
  errorRequiredTitle:                              string,
  errorServicesCategorySelectedZeroValidatorTitle: string,
  errorRegisteredServicesCategoryName:             { message: string, isRegistered: boolean },
  errorNewServicesCategoryNameMaxLengthTitle:      string,
  errorServiceNameMaxLengthTitle:                  string,
  errorMinValueTitle:                              string,
  errorPriceMaxValueTitle:                         string,
  errorDurationMaxValueTitle:                      string,
  errorCommentMaxLengthTitle:                      string,

  // всплывающая подсказка на кнопке "создать услугу"
  butServiceCreateTitle: string,

  // значение кнопки "создать услугу"
  butServiceCreateValue: string,

  // всплывающая подсказка на кнопке "изменить услугу"
  butServiceEditTitle: string,

  // значение кнопки "изменить услугу"
  butServiceEditValue: string,

  //endregion


  //#region параметры НЕ меняющиеся при смене языка

  // параметр языка отображения
  language: string,

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  route: string,

  // параметр, передающий значение режима создания/изменения данных о компании
  // в родительский компонент для выбора заголовка страницы после перезагрузки страницы
  route_mode: string,

  // флаг включения спиннера при ожидании данных с сервера
  isWaitFlag: boolean,

  // флаг состояния изменений в форме
  // false - изменений нет, true - изменения есть (true после this.userForm.valueChanges)
  isChangedFormFlag: boolean,

  // длина наименования новой категории услуг
  newServicesCategoryNameLength: number,

  // длина наименования услуги
  serviceNameLength: number,

  // максимальное значение цены на услугу
  priceMaxValue: number,

  // максимальное значение длительности услуги (в минутах)
  durationMaxValue: number,

  // длина комментария к услуге
  commentLength: number,

  // типы ошибок
  errorRequired:              string,
  errorMaxLength:             string,
  errorSelectedZeroValidator: string,
  errorMinValue:              string,
  errorMaxValue:              string,

  // коллекция всех записей о категориях услуг
  allServicesCategories: ServicesCategory[],

  // коллекция всех записей о категориях услуг для списка выбора
  servicesCategoriesList: { id: number, name: string }[]

  //endregion

} // interface IServiceFormComponent
// ----------------------------------------------------------------------------
