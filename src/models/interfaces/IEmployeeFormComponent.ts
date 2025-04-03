// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента EmployeeFormComponent
// ----------------------------------------------------------------------------
import {ServiceFormComponent} from '../../components/service-form/service-form.component';
import {ServicesCategory} from '../classes/ServicesCategory';
import {Specialization} from '../classes/Specialization';
import {Position} from '../classes/Position';

export interface IEmployeeFormComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

  // заголовок поля ввода имени сотрудника
  labelEmployeeName: string,

  // заголовок поля ввода номера телефона сотрудника
  labelPhone: string,

  // заголовок поля ввода e-mail сотрудника
  labelEmail: string,

  // заголовок списка выбора специальности сотрудника
  labelSpecialization: string,

  // заголовок поля ввода наименования новой специальности сотрудника
  labelNewSpecializationName: string,

  // первый элемент списка выбора специальности сотрудника
  firstOptionSpecializations: string,

  // всплывающая подсказка на заголовке чек-бокса "новая специальность"
  labelCheckboxIsNewSpecializationTitle: string,

  // заголовок чек-бокса включения режима ввода новой специальности
  labelCheckboxIsNewSpecialization: string,

  // заголовок списка выбора должности сотрудника
  labelPosition: string,

  // заголовок поля ввода наименования новой должности сотрудника
  labelNewPositionName: string,

  // первый элемент списка выбора должности сотрудника
  firstOptionPositions: string,

  // всплывающая подсказка на заголовке чек-бокса "новая должность"
  labelCheckboxIsNewPositionTitle: string,

  // заголовок чек-бокса включения режима ввода новой должности
  labelCheckboxIsNewPosition: string,

  // заголовок списка выбора города расположения компании
  //labelCity: string,

  // первый элемент списка выбора города расположения компании
  //firstOptionCities: string,

  // заголовок поля ввода названия нового города расположения компании
  //labelNewCityName: string,

  // заголовок поля ввода названия улицы расположения компании
  //labelStreetName: string,

  // заголовок поля ввода номера дома/строения расположения компании
  //labelBuilding: string,

  // заголовок поля ввода минимальной цены на услугу
  //labelPriceMin: string,

  // заголовок поля ввода максимальной цены на услугу
  //labelPriceMax: string,

  // заголовок поля ввода длительности услуги
  //labelDuration: string,

  // заголовок поля ввода текста комментария к услуге
  //labelComment: string,

  // заголовок поля ввода текста графика работы компании
  //labelSchedule: string,

  // заголовок поля ввода текста сайта компании
  //labelSite: string,

  // заголовок поля ввода нового пароля пользователя
  //labelNewPassword: string,

  // заголовок поля подтверждения нового пароля пользователя
  //labelNewPasswordConfirmation: string,

  // заголовок чек-бокса изменения отображения пароля при вводе
  //labelCheckboxPassword: string,

  // шаблон поля ввода названия нового города расположения компании
  //newCityNamePlaceholder: string,



  // шаблон поля ввода имени сотрудника
  employeeNamePlaceholder: string,

  // шаблон поля ввода наименования новой специальности сотрудника
  newSpecializationNamePlaceholder: string,

  // шаблон поля ввода наименования новой должности сотрудника
  newPositionNamePlaceholder: string,

  // шаблон поля ввода названия улицы расположения компании
  //streetNamePlaceholder: string,

  // шаблон поля ввода номера дома/строения расположения компании
  //buildingPlaceholder: string,

  // шаблон поля ввода текста комментария к услуге
  //commentPlaceholder: string,

  // шаблон поля ввода текста графика работы компании
  //schedulePlaceholder: string,

  // шаблон поля ввода текста сайта компании
  //sitePlaceholder: string,

  // значения сообщений об ошибках
  errorRequiredTitle:                            string,
  errorEmployeeNameMaxLengthTitle:               string,
  errorPhoneValidatorTitle:                      string,
  phoneNoErrorsTitle:                            string,
  errorEmailMaxLengthTitle:                      string,
  errorEmailValidatorTitle:                      string,
  //errorScheduleMaxLengthTitle:                 string,
  //errorSiteMaxLengthTitle:                     string,
  errorSpecializationSelectedZeroValidatorTitle: string,
  errorNewSpecializationNameMaxLengthTitle:      string,
  errorPositionSelectedZeroValidatorTitle:       string,
  errorNewPositionNameMaxLengthTitle:            string,
  //errorCitySelectedZeroValidatorTitle:         string,
  errorNotMatchUserName:                         { message: string, isNotMatched: boolean },
  errorNotMatchUserPhone:                        { message: string, isNotMatched: boolean },
  errorNotMatchUserEmail:                        { message: string, isNotMatched: boolean },
  errorRegisteredPhone:                          { message: string, isRegistered: boolean },
  errorRegisteredEmail:                          { message: string, isRegistered: boolean },
  errorRegisteredSpecialization:                 { message: string, isRegistered: boolean },
  errorRegisteredPosition:                       { message: string, isRegistered: boolean },
  //errorMinValueTitle:                           string,
  //errorPriceMaxValueTitle:                      string,
  //errorDurationMaxValueTitle:                   string,
  //errorCommentMaxLengthTitle:                   string,
  //errorStreetNameMaxLengthTitle:                string,
  //errorBuildingMaxLengthTitle:                  string,
  //errorPasswordValidatorTitle:    string,
  //errorPasswordMinMaxLengthTitle: string,
  //errorMatchValidatorTitle:       string,

  // всплывающая подсказка на фотографии сотрудника
  photoTitle: string,

  // всплывающая подсказка на основном изображении компании
  //titleImageTitle: string,

  // всплывающая подсказка на кнопке "добавить сотрудника"
  butEmployeeCreateTitle: string,

  // значение кнопки "добавить сотрудника"
  butEmployeeCreateValue: string,

  // всплывающая подсказка на кнопке "изменить сотрудника"
  butEmployeeEditTitle: string,

  // значение кнопки "изменить сотрудника"
  butEmployeeEditValue: string,

  // всплывающая подсказка на кнопке "сброс данных"
  butEmployeeFormCreateResetTitle: string,

  // значение кнопки "сброс данных"
  butEmployeeFormCreateResetValue: string,

  // заголовок поля выбора фотографии сотрудника
  labelInputImage: string,

  // заголовок поля вывода имени файла выбранной фотографии сотрудника
  labelNewFileName: string,

  // заголовок поля вывода имени файла при невыбранной фотографии сотрудника
  labelFileNotSelected: string,

  // всплывающая подсказка на кнопке "выбрать фотографию"
  butNewFileNameTitle: string,

  // значение кнопки "выбрать фотографию"
  butNewFileNameValue: string,

  // заголовок поля выбора изображения логотипа компании
  //labelInputImageLogo: string,

  // заголовок поля выбора основного изображения компании
  //labelInputImageTitleImage: string,

  // заголовок поля вывода имени файла выбранного логотипа компании
  //labelNewLogoFileName: string,

  // заголовок поля вывода имени файла выбранного изображения компании
  //labelNewTitleImageFileName: string,

  // заголовок поля вывода имени файла при невыбранном логотипе компании
  //labelFileNotSelected: string,

  // всплывающая подсказка на кнопке "выбрать логотип"
  //butNewLogoFileNameTitle: string,

  // значение кнопки "выбрать логотип"
  //butNewLogoFileNameValue: string,

  // всплывающая подсказка на кнопке "выбрать изображение салона"
  //butNewTitleImageFileNameTitle: string,

  // значение кнопки "выбрать изображение салона"
  //butNewTitleImageFileNameValue: string,

  // заголовок чек-бокса ввода нового города
  //labelCheckboxIsNewCity: string,

  // всплывающая подсказка на заголовке чек-бокса "новый город"
  //labelCheckboxIsNewCityTitle: string,

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

  // флаг состояния изменений в данных о сотруднике
  // false - изменений нет, true - изменения есть (true после onSubmit)
  isChangedFlag: boolean,

  // флаг включения возможности удаления данных о компании
  // false - запрещено удалять, true - разрешено удалять
  //isDeletingFlag: boolean,

  // флаг состояния подтверждения об удалении данных о компании
  // true - подтверждено, false - НЕ_подтверждено
  //isConfirmedFlag: boolean,

  // флаг состояния изменений в форме
  // false - изменений нет, true - изменения есть (true после this.userForm.valueChanges)
  isChangedFormFlag: boolean,

  // шаблон поля ввода номера телефона сотрудника
  phonePlaceholder: string,

  // шаблон поля ввода e-mail сотрудника
  emailPlaceholder: string,

  // шаблон поля ввода номера телефона компании
  //phonePlaceholder: string,

  // шаблон поля ввода пароля пользователя
  //passwordPlaceholder: string,

  // минимальная длина пароля пользователя
  //passwordMinLength: number,

  // длина наименования новой категории услуг
  //newServicesCategoryNameLength: number,

  // длина имени сотрудника
  employeeNameLength: number,

  // максимальное значение цены на услугу
  //priceMaxValue: number,

  // максимальное значение длительности услуги (в минутах)
  //durationMaxValue: number,

  // длина комментария к услуге
  //commentLength: number,

  // длина строкового значения номера дома/строения расположения компании
  //buildingLength: number,

  // длина номера телефона сотрудника
  phoneLength: number,

  // длина e-mail сотрудника
  emailLength: number,

  // длина наименования новой специальности
  newSpecializationNameLength: number,

  // длина наименования новой должности
  newPositionNameLength: number,

  // длина текста описания компании
  //companyDescriptionLength: number,

  // длина текста графика работы компании
  //scheduleLength: number,

  // длина текста сайта компании
  //siteLength: number,

  // максимальная длина пароля пользователя
  //passwordMaxLength: number,

  // типы ошибок
  errorRequired:              string,
  //errorMinLength:                string,
  errorMaxLength:             string,
  errorPhoneValidator:        string,
  errorEmailValidator:        string,
  errorSelectedZeroValidator: string,
  //errorMinValue:              string,
  //errorMaxValue:              string,
  //errorPasswordValidator: string,
  //errorMatchValidator:    string,

  // объект с типами поля ввода пароля
  //passwordInputTypes: { text: string, password: string }

  // имя выбранного файла с изображением логотипа компании
  //newLogoFileName: string,

  // имя выбранного файла с изображением компании
  //newTitleImageFileName: string,

  // имя выбранного файла изображения
  newFileName: string,

  // класс, определяющий допустимые размеры отображаемого изображения
  sizeImage: string,

  // класс, определяющий допустимые размеры отображаемого изображения логотипа компании
  //logoSizeImage: string,

  // класс, определяющий допустимые размеры отображаемого основного изображения компании
  //titleImageSizeImage: string,

  // коллекция зарегистрированных телефонов
  registeredPhones: string[],

  // коллекция зарегистрированных email
  registeredEmails: string[],

  // коллекция всех записей о специальностях
  allSpecializations: Specialization[],

  // коллекция всех записей о специальностях для списка выбора
  specializationsList: { id: number, name: string }[],

  // коллекция всех записей о должностях
  allPositions: Position[],

  // коллекция всех записей о должностях для списка выбора
  positionsList: { id: number, name: string }[],

  // коллекция всех записей об улицах
  //allStreets: Street[],

  //endregion

} // interface IEmployeeFormComponent
// ----------------------------------------------------------------------------
