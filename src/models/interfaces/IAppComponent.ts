// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента AppComponent
// ----------------------------------------------------------------------------
export interface IAppComponent {

  //#region параметры меняющиеся при смене языка

  // данные о заголовке текущей страницы для разных языков
  title: Record<string, string>,

  // заголовок текущей страницы
  displayTitle: string,

  // кнопки
  // всплывающая подсказка на логотипе "Home"
  logoTitle: string,

  // всплывающая подсказка на кнопке отображения
  // скрываемой части панели навигации
  butNavBarTitle: string,

  // значение кнопки отображения скрываемой части панели навигации
  butNavBarValue: string,

  // всплывающая подсказка на кнопке "О программе..."
  butAboutTitle: string,

  // значение кнопки "О программе..."
  butAboutValue: string,

  // всплывающая подсказка на кнопке "Войти"
  butLoginTitle: string,

  // значение кнопки "Войти"
  butLoginValue: string,

  // всплывающая подсказка на кнопке "Зарегистрироваться"
  butRegistrationTitle: string,

  // значение кнопки "Зарегистрироваться"
  butRegistrationValue: string,

  // всплывающая подсказка на кнопке "Выйти"
  butLogOutTitle: string,

  // значение кнопки "Выйти"
  butLogOutValue: string,

  // всплывающая подсказка на кнопке "В начало"
  butStartTitle: string,

  // значение кнопки "В начало"
  butStartValue: string,

  // заголовок "подвала" страницы
  footerTitle: string,

  // заголовок строки со сведениями о студенте в "подвале" страницы
  footerStudentTitle: string,

  // значение строки со сведениями о студенте в "подвале" страницы
  footerStudentValue: string,

  // заголовок строки со сведениями о группе в "подвале" страницы
  footerGroupTitle: string,

  // значение строки со сведениями о группе в "подвале" страницы
  footerGroupValue: string,

  // заголовок строки со сведениями о городе в "подвале" страницы
  footerCityTitle: string,

  // значение строки со сведениями о городе в "подвале" страницы
  footerCityValue: string,

  // значение краткой формы записи года в "подвале" страницы
  footerShortYearValue: string,

  //endregion


  //#region параметры НЕ меняющиеся при смене языка

  // параметр языка отображения
  language: string,

  // флаг включения спиннера при ожидании данных с сервера
  isWaitFlag: boolean,

  // параметр для заполнения поля с текущим годом в элементе <footer>
  readonly todayYear: number,

  // маршруты
  routeHomeEmpty: string,
  routeAbout: string,
  routeLogin: string,
  routeRegistration: string,

  // заголовок строки со сведениями об e-mail в "подвале" страницы
  footerEMailTitle: string,

  // ссылка для перехода на e-mail в "подвале" страницы
  footerEMailHref: string,

  // ссылка для перехода на e-mail в "подвале" страницы
  footerEMailValue: string,

  // сообщение об ошибке
  errorMessage: {
    message: string,
    isVisible: boolean
  },

  // путь расположения фотографий в приложении
  srcPhoto: string,

  // имя файла с фотографией по умолчанию
  fileNamePhotoDef: string,

  // «идентификатор таймера», для отмены срабатывания setTimeout()
  // при нажатии кнопок обработки быстрее длительности срабатывания таймера
  timerId: number,

  // длительность срабатывания setTimeout()
  timeout: number

  //endregion

} // interface IAppComponent
// ----------------------------------------------------------------------------
