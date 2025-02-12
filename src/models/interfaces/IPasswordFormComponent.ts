// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента PasswordFormComponent
// ----------------------------------------------------------------------------
export interface IPasswordFormComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

  // заголовок поля ввода старого пароля пользователя
  labelOldPassword: string,

  // заголовок поля ввода нового пароля пользователя
  labelNewPassword: string,

  // заголовок поля подтверждения нового пароля пользователя
  labelNewPasswordConfirmation: string,

  // заголовок чек-бокса изменения отображения пароля при вводе
  labelCheckboxPassword: string,

  // значения сообщений об ошибках
  errorRequiredTitle:             string,
  errorPasswordValidatorTitle:    string,
  errorPasswordMinMaxLengthTitle: string,
  errorMatchValidatorTitle:       string,

  // всплывающая подсказка на кнопке "изменить"
  butPasswordEditTitle: string,

  // значение кнопки "изменить"
  butPasswordEditValue: string,

  //endregion


  //#region параметры НЕ меняющиеся при смене языка

  // параметр языка отображения
  language: string,

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  route: string,

  // флаг включения спиннера при ожидании данных с сервера
  isWaitFlag: boolean,

  // шаблон поля ввода пароля пользователя
  passwordPlaceholder: string,

  // минимальная длина пароля пользователя
  passwordMinLength: number,

  // максимальная длина пароля пользователя
  passwordMaxLength: number,

  // типы ошибок
  errorRequired:          string,
  errorMinLength:         string,
  errorMaxLength:         string,
  errorPasswordValidator: string,
  errorMatchValidator:    string,

  // объект с типами поля ввода пароля
  passwordInputTypes: { text: string, password: string }

  //endregion

} // interface IPasswordFormComponent
// ----------------------------------------------------------------------------
