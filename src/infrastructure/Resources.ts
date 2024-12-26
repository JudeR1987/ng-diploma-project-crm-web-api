// ----------------------------------------------------------------------------
// класс с набором строковых значений для разных языков
// ----------------------------------------------------------------------------
export class Resources {

  //#region AppComponent

  // заголовок текущей страницы (значение по умолчанию)
  public static readonly appTitleDefault: Record<string, string> = {
    'rus': 'Одностраничное приложение на <strong>&laquo;Angular&raquo;</strong>',
    'eng': 'Single page application on <strong>&laquo;Angular&raquo;</strong>' };

  // заголовок на странице "Home"
  public static readonly appHomeTitle: Record<string, string> = {
    'rus': 'Задание на разработку',
    'eng': 'Development Task' };

  // заголовок на странице "О программе..."
  public static readonly appAboutTitle: Record<string, string> = {
    'rus': 'Сведения о программе',
    'eng': 'About the program' };

  // заголовок на странице "Войти"
  public static readonly appLoginTitle: Record<string, string> = {
    'rus': 'Вход',
    'eng': 'Login' };

  // заголовок на странице "Зарегистрироваться"
  public static readonly appRegistrationTitle: Record<string, string> = {
    'rus': 'Регистрация',
    'eng': 'Registration' };

  // всплывающая подсказка на логотипе "Home"
  public static readonly appLogoTitle: Record<string, string> = {
    'rus': 'На главную',
    'eng': 'To the main page' };

  // всплывающая подсказка на кнопке отображения
  // скрываемой части панели навигации
  public static readonly appButNavBarTitle: Record<string, string> = {
    'rus': 'Навигация',
    'eng': 'Navigation' };

  // значение кнопки отображения скрываемой части панели навигации
  public static readonly appButNavBarValue: Record<string, string> = {
    'rus': 'МЕНЮ',
    'eng': 'MENU' };

  // всплывающая подсказка на кнопке "О программе..."
  public static readonly appButAboutTitle: Record<string, string> = {
    'rus': 'Сведения о программе',
    'eng': 'About the program' };

  // значение кнопки "О программе..."
  public static readonly appButAboutValue: Record<string, string> = {
    'rus': 'О программе...',
    'eng': 'About the program...' };

  // всплывающая подсказка на кнопке "Войти"
  public static readonly appButLoginTitle: Record<string, string> = {
    'rus': 'войти в аккаунт',
    'eng': 'login to account' };

  // значение кнопки "Войти"
  public static readonly appButLoginValue: Record<string, string> = {
    'rus': 'Войти',
    'eng': 'Login' };

  // всплывающая подсказка на кнопке "Зарегистрироваться"
  public static readonly appButRegistrationTitle: Record<string, string> = {
    'rus': 'зарегистрироваться',
    'eng': 'user registration' };

  // значение кнопки "Зарегистрироваться"
  public static readonly appButRegistrationValue: Record<string, string> = {
    'rus': 'Зарегистрироваться',
    'eng': 'Registration' };

  // всплывающая подсказка на кнопке "В начало"
  public static readonly appButStartTitle: Record<string, string> = {
    'rus': 'Перейти в начало страницы',
    'eng': 'Go to top of page' };

  // значение кнопки "В начало"
  public static readonly appButStartValue: Record<string, string> = {
    'rus': 'В начало',
    'eng': 'To the top' };

  // заголовок "подвала" страницы
  public static readonly appFooterTitle: Record<string, string> = {
    'rus': 'Сведения о разработчике',
    'eng': 'About the developer' };

  // заголовок строки со сведениями о студенте в "подвале" страницы
  public static readonly appFooterStudentTitle: Record<string, string> = {
    'rus': 'Студент',
    'eng': 'Student' };

  // значение строки со сведениями о студенте в "подвале" страницы
  public static readonly appFooterStudentValue: Record<string, string> = {
    'rus': 'Макаров Евгений Сергеевич.',
    'eng': 'Makarov Evgeny Sergeevich.' };

  // заголовок строки со сведениями о группе в "подвале" страницы
  public static readonly appFooterGroupTitle: Record<string, string> = {
    'rus': 'Группа',
    'eng': 'Group' };

  // значение строки со сведениями о группе в "подвале" страницы
  public static readonly appFooterGroupValue: Record<string, string> = {
    'rus': 'ПД221.',
    'eng': 'PD221.' };

  // заголовок строки со сведениями о городе в "подвале" страницы
  public static readonly appFooterCityTitle: Record<string, string> = {
    'rus': 'Город',
    'eng': 'City' };

  // значение строки со сведениями о городе в "подвале" страницы
  public static readonly appFooterCityValue: Record<string, string> = {
    'rus': 'Донецк, КА &quot;ШАГ&quot;,',
    'eng': 'Donetsk, CA &quot;STEP&quot;,' };

  // значение краткой формы записи года в "подвале" страницы
  public static readonly appFooterShortYearValue: Record<string, string> = {
    'rus': 'г.',
    'eng': 'y.' };

  //endregion


  //#region LanguageComponent

  // всплывающая подсказка на выпадающем списке выбора языка отображения
 /* public static readonly langSelectTitle: Record<string, string> = {
    'rus': 'выбор языка отображения',
    'eng': 'select display language' };*/

  // всплывающая подсказка элемента выбора русского языка отображения
  /*public static readonly langOptionTitleRus: Record<string, string> = {
    'rus': 'русский язык',
    'eng': 'Russian language' };*/

  // всплывающая подсказка элемента выбора английского языка отображения
  /*public static readonly langOptionTitleEng: Record<string, string> = {
    'rus': 'английский язык',
    'eng': 'English language' };*/

  // всплывающая подсказка на выпадающем списке выбора языка отображения
  public static readonly langDropdownTitle: Record<string, string> = {
    'rus': 'выбор языка отображения',
    'eng': 'select display language' };

  // всплывающая подсказка на изображении выбора русского языка отображения
  public static readonly langImageTitleRus: Record<string, string> = {
    'rus': 'русский язык',
    'eng': 'Russian language' };

  // всплывающая подсказка на изображении выбора английского языка отображения
  public static readonly langImageTitleEng: Record<string, string> = {
    'rus': 'английский язык',
    'eng': 'English language' };

  //endregion


  //#region HomeComponent

  // заголовок
  public static readonly homeTitle: Record<string, string> = {
    'rus': 'Какой-то контент',
    'eng': 'Some content' };

  //endregion


  //#region AboutComponent

  // заголовок
  public static readonly aboutTitle: Record<string, string> = {
    'rus': 'Сведения о программе',
    'eng': 'About the program' };

  //endregion


  //#region LoginComponent

  // заголовок
  public static readonly loginTitle: Record<string, string> = {
    'rus': 'Форма входа',
    'eng': 'Login form' };

  //endregion


  //#region RegistrationComponent

  // заголовок
  public static readonly registrationTitle: Record<string, string> = {
    'rus': 'Форма регистрации',
    'eng': 'Registration form' };

  //endregion


  //#region NotFoundComponent

  // заголовок
  public static readonly notFoundTitle: Record<string, string> = {
    'rus': 'Маршрут не найден / Страница не найдена',
    'eng': 'Route not found / Page not found' };

  //endregion

} // class Resources
// ----------------------------------------------------------------------------
