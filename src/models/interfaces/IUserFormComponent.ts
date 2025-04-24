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
  errorRequiredTitle:          string,
  errorUserNameMaxLengthTitle: string,
  errorRegisteredPhone:        { message: string, isRegistered: boolean },
  errorRegisteredEmail:        { message: string, isRegistered: boolean },
  errorPhoneValidatorTitle:    string,
  errorEmailMaxLengthTitle:    string,
  errorEmailValidatorTitle:    string,
  phoneNoErrorsTitle:          string,

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

  // заголовок чек-бокса изменения возможности удаления данных
  labelCheckboxDeletingFlag: string,

  // всплывающая подсказка на кнопке "удалить аккаунт"
  butDeleteUserTitle: string,

  // значение кнопки "удалить аккаунт"
  butDeleteUserValue: string,

  // заголовок сообщения подтверждения удаления данных о пользователе
  titleConfirmation: string,

  // сообщение подтверждения удаления данных о пользователе
  messageConfirmation: string,

  // всплывающая подсказка на кнопке "подтвердить удаление"
  butConfirmedOkTitle: string,

  // значение кнопки "подтвердить удаление"
  butConfirmedOkValue: string,

  // всплывающая подсказка на кнопке "отменить удаление"
  butConfirmedCancelTitle: string,

  // значение кнопки "отменить удаление"
  butConfirmedCancelValue: string,

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

  // флаг включения возможности удаления данных о пользователе
  // false - запрещено удалять, true - разрешено удалять
  isDeletingFlag: boolean,

  // флаг состояния подтверждения об удалении данных о пользователе
  // true - подтверждено, false - НЕ_подтверждено
  isConfirmedFlag: boolean,

  // флаг состояния изменений в форме
  // false - изменений нет, true - изменения есть (true после this.userForm.valueChanges)
  isChangedFormFlag: boolean,

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
  newFileName: string,

  // класс, определяющий допустимые размеры отображаемого изображения
  sizeImage: string

  //endregion

} // interface IUserFormComponent
// ----------------------------------------------------------------------------
