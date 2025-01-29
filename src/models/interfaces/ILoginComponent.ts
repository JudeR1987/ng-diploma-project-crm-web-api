// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента LoginComponent
// ----------------------------------------------------------------------------
export interface ILoginComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

  // заголовок поля ввода логина пользователя
  labelLogin: string,

  // заголовок поля ввода пароля пользователя
  labelPassword: string,

  // заголовок чек-бокса изменения отображения пароля при вводе
  labelCheckboxPassword: string,

  // значения сообщений об ошибках
  errorRequiredTitle:             string,
  errorPhoneValidatorTitle:       string,
  errorEmailValidatorTitle:       string,
  errorPasswordMinMaxLengthTitle: string,
  loginNoErrorsTitle:             string,

  // всплывающая подсказка на кнопке "войти"
  butLoginTitle: string,

  // значение кнопки "войти"
  butLoginValue: string,

  //endregion


  //#region параметры НЕ меняющиеся при смене языка

  // параметр языка отображения
  language: string,

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  route: string,

  // параметр валидности вводимых данных
  /*validLogin: boolean,

  // сообщение об ошибке
  errorMessage: string,*/

  // флаг включения спиннера при ожидании данных с сервера
  isWaitFlag: boolean,

  // шаблон поля ввода логина пользователя
  loginPlaceholder: string,

  // шаблон поля ввода пароля пользователя
  passwordPlaceholder: string,

  // длина логина пользователя
  loginLength: number,

  // минимальная длина пароля пользователя
  passwordMinLength: number,

  // максимальная длина пароля пользователя
  passwordMaxLength: number,

  // типы ошибок
  errorRequired: string,
  errorPhoneValidator: string,
  errorEmailValidator: string,
  errorMinLength: string,
  errorMaxLength: string

  // «идентификатор таймера», для отмены срабатывания setTimeout()
  // при нажатии кнопок обработки быстрее длительности срабатывания таймера
  //timerId: number,

  // длительность срабатывания setTimeout()
  //timeout: number

  //endregion

} // interface ILoginComponent
// ----------------------------------------------------------------------------
