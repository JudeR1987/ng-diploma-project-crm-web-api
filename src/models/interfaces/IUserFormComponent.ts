// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента UserFormComponent
// ----------------------------------------------------------------------------
export interface IUserFormComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

  // заголовок поля ввода имени пользователя
  labelUserName: string,

  // заголовок поля ввода номера телефона пользователя
  labelPhone: string,

  // заголовок поля ввода e-mail пользователя
  labelEmail: string,

  // шаблон поля ввода имени пользователя
  userNamePlaceholder: string,

  // значения сообщений об ошибках
  errorRequiredTitle:             string,
  errorUserNameMaxLengthTitle:    string,
  errorRegisteredPhone:           { message: string, isRegistered: boolean },
  errorRegisteredEmail:           { message: string, isRegistered: boolean },
  errorPhoneValidatorTitle:       string,
  errorEmailMaxLengthTitle:       string,
  errorEmailValidatorTitle:       string,
  phoneNoErrorsTitle:             string,

  // всплывающая подсказка на кнопке "изменить"
  butUserEditTitle: string,

  // значение кнопки "изменить"
  butUserEditValue: string,

  // заголовок поля выбора фотографии пользователя
  labelInputImage: string,

  // заголовок поля вывода имени файла выбранной фотографии пользователя
  labelNewFileName: string,

  // заголовок поля вывода имени файла при невыбранной фотографии пользователя
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

  // флаг включения спиннера при ожидании данных с сервера
  isWaitFlag: boolean,

  // флаг состояния изменений в данных о пользователе
  // false - изменений нет, true - изменения есть (true после onSubmit)
  isChangedFlag: boolean,

  // шаблон поля ввода номера телефона пользователя
  phonePlaceholder: string,

  // шаблон поля ввода e-mail пользователя
  emailPlaceholder: string,

  // длина имени пользователя
  userNameLength: number,

  // длина номера телефона пользователя
  phoneLength: number,

  // длина e-mail пользователя
  emailLength: number,

  // типы ошибок
  errorRequired:          string,
  errorMaxLength:         string,
  errorPhoneValidator:    string,
  errorEmailValidator:    string,

  // имя выбранного файла изображения
  newFileName: string

  //endregion

} // interface IUserFormComponent
// ----------------------------------------------------------------------------
