// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента RegistrationComponent
// ----------------------------------------------------------------------------
export interface IRegistrationComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

  // заголовок поля ввода номера телефона пользователя
  labelPhone: string,

  // заголовок поля ввода e-mail пользователя
  labelEmail: string,

  // значения сообщений об ошибках
  errorRegisteredPhone:     { message: string, isRegistered: boolean },
  errorRegisteredEmail:     { message: string, isRegistered: boolean },
  errorRequiredTitle:       string,
  errorPhoneValidatorTitle: string,
  errorEmailMaxLengthTitle: string,
  errorEmailValidatorTitle: string,
  phoneNoErrorsTitle:       string,
  emailNoErrorsTitle:       string,

  // всплывающая подсказка на кнопке "продолжить"
  butContinueTitle: string,

  // значение кнопки "продолжить"
  butContinueValue: string,

  //endregion


  //#region параметры НЕ меняющиеся при смене языка

  // параметр языка отображения
  language: string,

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  route: string,

  // параметр валидности вводимых данных
  validRegistration: boolean,

  // сообщение об ошибке
  errorMessage: string,

  // флаг включения спиннера при ожидании данных с сервера
  isWaitFlag: boolean,

  // шаблон поля ввода номера телефона пользователя
  phonePlaceholder: string,

  // шаблон поля ввода e-mail пользователя
  emailPlaceholder: string,

  // длина номера телефона пользователя
  phoneLength: number,

  // длина e-mail пользователя
  emailLength: number,

  // типы ошибок
  errorRequired: string,
  errorPhoneValidator: string,
  errorMaxLength: string,
  errorEmailValidator: string,

  // «идентификатор таймера», для отмены срабатывания setTimeout()
  // при нажатии кнопок обработки быстрее длительности срабатывания таймера
  timerId: number,

  // длительность срабатывания setTimeout()
  timeout: number

  //endregion

} // interface IRegistrationComponent
// ----------------------------------------------------------------------------
