// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента CompanyFormComponent
// ----------------------------------------------------------------------------
import {Country} from '../classes/Country';
import {City} from '../classes/City';
import {Street} from '../classes/Street';

export interface ICompanyFormComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

  // заголовок поля ввода названия компании
  labelCompanyName: string,

  // заголовок списка выбора страны расположения компании
  labelCountry: string,

  // первый элемент списка выбора страны расположения компании
  firstOptionCountries: string,

  // заголовок списка выбора города расположения компании
  labelCity: string,

  // первый элемент списка выбора города расположения компании
  firstOptionCities: string,

  // заголовок поля ввода названия нового города расположения компании
  labelNewCityName: string,

  // заголовок поля ввода названия улицы расположения компании
  labelStreetName: string,

  // заголовок поля ввода номера дома/строения расположения компании
  labelBuilding: string,

  // заголовок поля ввода номера квартиры/офиса расположения компании
  labelFlat: string,

  // заголовок поля ввода номера телефона компании
  labelPhone: string,

  // заголовок поля ввода текста описания компании
  labelDescription: string,

  // заголовок поля ввода текста графика работы компании
  labelSchedule: string,

  // заголовок поля ввода текста сайта компании
  labelSite: string,

  // шаблон поля ввода названия компании
  companyNamePlaceholder: string,

  // шаблон поля ввода названия нового города расположения компании
  newCityNamePlaceholder: string,

  // шаблон поля ввода названия улицы расположения компании
  streetNamePlaceholder: string,

  // шаблон поля ввода номера дома/строения расположения компании
  buildingPlaceholder: string,

  // шаблон поля ввода текста описания компании
  companyDescriptionPlaceholder: string,

  // шаблон поля ввода текста графика работы компании
  schedulePlaceholder: string,

  // шаблон поля ввода текста сайта компании
  sitePlaceholder: string,

  // значения сообщений об ошибках
  errorRequiredTitle:                           string,
  errorCompanyNameMaxLengthTitle:               string,
  errorPhoneValidatorTitle:                     string,
  errorCompanyDescriptionMaxLengthTitle:        string,
  errorScheduleMaxLengthTitle:                  string,
  errorSiteMaxLengthTitle:                      string,
  errorCountrySelectedZeroValidatorTitle:       string,
  errorCitySelectedZeroValidatorTitle:          string,
  errorNewCityNameMaxLengthTitle:               string,
  errorRegisteredCity:                          { message: string, isRegistered: boolean },
  errorStreetNameMaxLengthTitle:                string,
  errorBuildingMaxLengthTitle:                  string,

  // всплывающая подсказка на логотипе компании
  logoTitle: string,

  // всплывающая подсказка на основном изображении компании
  titleImageTitle: string,

  // всплывающая подсказка на кнопке "создать компанию"
  butCompanyCreateTitle: string,

  // значение кнопки "создать компанию"
  butCompanyCreateValue: string,

  // всплывающая подсказка на кнопке "изменить компанию"
  butCompanyEditTitle: string,

  // значение кнопки "изменить компанию"
  butCompanyEditValue: string,

  // заголовок поля выбора изображения логотипа компании
  labelInputImageLogo: string,

  // заголовок поля выбора основного изображения компании
  labelInputImageTitleImage: string,

  // заголовок поля вывода имени файла выбранного логотипа компании
  labelNewLogoFileName: string,

  // заголовок поля вывода имени файла выбранного изображения компании
  labelNewTitleImageFileName: string,

  // заголовок поля вывода имени файла при невыбранном логотипе компании
  labelFileNotSelected: string,

  // всплывающая подсказка на кнопке "выбрать логотип"
  butNewLogoFileNameTitle: string,

  // значение кнопки "выбрать логотип"
  butNewLogoFileNameValue: string,

  // всплывающая подсказка на кнопке "выбрать изображение салона"
  butNewTitleImageFileNameTitle: string,

  // значение кнопки "выбрать изображение салона"
  butNewTitleImageFileNameValue: string,

  // заголовок чек-бокса ввода нового города
  labelCheckboxIsNewCity: string,

  // всплывающая подсказка на заголовке чек-бокса "новый город"
  labelCheckboxIsNewCityTitle: string,

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

  // флаг состояния изменений в данных о компании
  // false - изменений нет, true - изменения есть (true после onSubmit)
  isChangedFlag: boolean,

  // флаг включения возможности удаления данных о компании
  // false - запрещено удалять, true - разрешено удалять
  isDeletingFlag: boolean,

  // флаг состояния подтверждения об удалении данных о компании
  // true - подтверждено, false - НЕ_подтверждено
  isConfirmedFlag: boolean,

  // флаг состояния изменений в форме
  // false - изменений нет, true - изменения есть (true после this.userForm.valueChanges)
  isChangedFormFlag: boolean,

  // шаблон поля ввода номера телефона компании
  phonePlaceholder: string,

  // длина названия компании
  companyNameLength: number,

  // длина названия нового города
  newCityNameLength: number,

  // длина названия улицы расположения компании
  streetNameLength: number,

  // длина строкового значения номера дома/строения расположения компании
  buildingLength: number,

  // длина номера телефона компании
  phoneLength: number,

  // длина текста описания компании
  companyDescriptionLength: number,

  // длина текста графика работы компании
  scheduleLength: number,

  // длина текста сайта компании
  siteLength: number,

  // максимальная длина пароля пользователя
  //passwordMaxLength: number,

  // типы ошибок
  errorRequired:              string,
  errorMaxLength:             string,
  errorPhoneValidator:        string,
  errorSelectedZeroValidator: string,

  // имя выбранного файла с изображением логотипа компании
  newLogoFileName: string,

  // имя выбранного файла с изображением компании
  newTitleImageFileName: string,

  // класс, определяющий допустимые размеры отображаемого изображения логотипа компании
  logoSizeImage: string,

  // класс, определяющий допустимые размеры отображаемого основного изображения компании
  titleImageSizeImage: string,

  // коллекция всех записей о странах
  allCountries: Country[],

  // коллекция всех записей о странах для списка выбора
  countriesList: { id: number, name: string }[],

  // коллекция всех записей о городах
  allCities: City[],

  // коллекция всех записей о городах для списка выбора
  citiesList: { id: number, name: string }[],

  // коллекция всех записей об улицах
  allStreets: Street[]

  //endregion

} // interface ICompanyFormComponent
// ----------------------------------------------------------------------------
