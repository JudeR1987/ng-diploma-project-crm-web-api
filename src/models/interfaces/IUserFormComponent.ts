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

  // заголовок поля ввода пароля пользователя
  //labelPassword: string,

  // заголовок поля ввода подтверждения пароля пользователя
  //labelPasswordConfirmation: string,

  // шаблон поля ввода имени пользователя
  userNamePlaceholder: string,

  // заголовок чек-бокса изменения отображения пароля при вводе
  //labelCheckboxPassword: string,

  // значения сообщений об ошибках
  errorRequiredTitle:             string,
  errorUserNameMaxLengthTitle:    string,
  errorRegisteredPhone:           { message: string, isRegistered: boolean },
  errorRegisteredEmail:           { message: string, isRegistered: boolean },
  errorPhoneValidatorTitle:       string,
  errorEmailMaxLengthTitle:       string,
  errorEmailValidatorTitle:       string,
  //errorPasswordValidatorTitle:    string,
  phoneNoErrorsTitle:             string,
  //errorPasswordMinMaxLengthTitle: string,

  // всплывающая подсказка на кнопке "изменить"
  butUserEditTitle: string,

  // значение кнопки "изменить"
  butUserEditValue: string,

  //endregion


  //#region параметры НЕ меняющиеся при смене языка

  // параметр языка отображения
  language: string,

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  route: string,

  // флаг включения спиннера при ожидании данных с сервера
  isWaitFlag: boolean,

  // шаблон поля ввода номера телефона пользователя
  phonePlaceholder: string,

  // шаблон поля ввода e-mail пользователя
  emailPlaceholder: string,

  // шаблон поля ввода пароля пользователя
  //passwordPlaceholder: string,

  // длина имени пользователя
  userNameLength: number,

  // длина номера телефона пользователя
  phoneLength: number,

  // длина e-mail пользователя
  emailLength: number,

  // минимальная длина пароля пользователя
  //passwordMinLength: number,

  // максимальная длина пароля пользователя
  //passwordMaxLength: number,

  // типы ошибок
  errorRequired:          string,
  //errorMinLength:         string,
  errorMaxLength:         string,
  errorPhoneValidator:    string,
  errorEmailValidator:    string,
  //errorPasswordValidator: string,

  // объект с типами поля ввода пароля
  //passwordInputTypes: { text: string, password: string }

  //endregion

} // interface IUserFormComponent
// ----------------------------------------------------------------------------
