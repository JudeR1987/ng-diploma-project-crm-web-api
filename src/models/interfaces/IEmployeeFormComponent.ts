// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента EmployeeFormComponent
// ----------------------------------------------------------------------------
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

  // шаблон поля ввода имени сотрудника
  employeeNamePlaceholder: string,

  // шаблон поля ввода наименования новой специальности сотрудника
  newSpecializationNamePlaceholder: string,

  // шаблон поля ввода наименования новой должности сотрудника
  newPositionNamePlaceholder: string,

  // значения сообщений об ошибках
  errorRequiredTitle:                            string,
  errorEmployeeNameMaxLengthTitle:               string,
  errorPhoneValidatorTitle:                      string,
  phoneNoErrorsTitle:                            string,
  errorEmailMaxLengthTitle:                      string,
  errorEmailValidatorTitle:                      string,
  errorSpecializationSelectedZeroValidatorTitle: string,
  errorNewSpecializationNameMaxLengthTitle:      string,
  errorPositionSelectedZeroValidatorTitle:       string,
  errorNewPositionNameMaxLengthTitle:            string,
  errorNotMatchUserName:                         { message: string, isNotMatched: boolean },
  errorNotMatchUserPhone:                        { message: string, isNotMatched: boolean },
  errorNotMatchUserEmail:                        { message: string, isNotMatched: boolean },
  errorRegisteredPhone:                          { message: string, isRegistered: boolean },
  errorRegisteredEmail:                          { message: string, isRegistered: boolean },
  errorRegisteredSpecialization:                 { message: string, isRegistered: boolean },
  errorRegisteredPosition:                       { message: string, isRegistered: boolean },

  // всплывающая подсказка на фотографии сотрудника
  photoTitle: string,

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

  // флаг состояния изменений в форме
  // false - изменений нет, true - изменения есть (true после this.userForm.valueChanges)
  isChangedFormFlag: boolean,

  // шаблон поля ввода номера телефона сотрудника
  phonePlaceholder: string,

  // шаблон поля ввода e-mail сотрудника
  emailPlaceholder: string,

  // длина имени сотрудника
  employeeNameLength: number,

  // длина номера телефона сотрудника
  phoneLength: number,

  // длина e-mail сотрудника
  emailLength: number,

  // длина наименования новой специальности
  newSpecializationNameLength: number,

  // длина наименования новой должности
  newPositionNameLength: number,

  // типы ошибок
  errorRequired:              string,
  errorMaxLength:             string,
  errorPhoneValidator:        string,
  errorEmailValidator:        string,
  errorSelectedZeroValidator: string,

  // имя выбранного файла изображения
  newFileName: string,

  // класс, определяющий допустимые размеры отображаемого изображения
  sizeImage: string,

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
  positionsList: { id: number, name: string }[]

  //endregion

} // interface IEmployeeFormComponent
// ----------------------------------------------------------------------------
