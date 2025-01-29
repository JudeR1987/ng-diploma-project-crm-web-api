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
    'rus': 'войти в учётную запись',
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

  // всплывающая подсказка на кнопке "Выйти"
  public static readonly appButLogOutTitle: Record<string, string> = {
    'rus': 'выйти из учётной записи',
    'eng': 'log out of account' };

  // значение кнопки "Выйти"
  public static readonly appButLogOutValue: Record<string, string> = {
    'rus': 'Выйти',
    'eng': 'Log out' };

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
    'rus': 'Вход',
    'eng': 'Login' };

  // заголовок поля ввода логина пользователя
  public static readonly loginLabelLogin: Record<string, string> = {
    'rus': 'Логин',
    'eng': 'Login' };

  // заголовок поля ввода пароля пользователя
  public static readonly loginLabelPassword: Record<string, string> = {
    'rus': 'Пароль',
    'eng': 'Password' };

  // заголовок чек-бокса изменения отображения пароля при вводе
  public static readonly loginLabelCheckboxPassword: Record<string, string> = {
    'rus': 'показать пароль',
    'eng': 'show password' };

  // сообщения об ошибках
  public static readonly loginErrorPasswordMinMaxLengthStart: Record<string, string> = {
    'rus': 'длина пароля от',
    'eng': 'the password length is from' };

  public static readonly loginErrorPasswordMinMaxLengthMiddle: Record<string, string> = {
    'rus': 'до',
    'eng': 'to' };

  public static readonly loginErrorPasswordMinMaxLengthEnd: Record<string, string> = {
    'rus': 'символов',
    'eng': 'characters' };

  public static loginErrorPasswordMinMaxLength(language: string, minLength: number, maxLength: number): string {
    return `${this.loginErrorPasswordMinMaxLengthStart[language]}
      ${minLength} ${this.loginErrorPasswordMinMaxLengthMiddle[language]}
      ${maxLength} ${this.loginErrorPasswordMinMaxLengthEnd[language]}`;
  } // loginErrorPasswordMinMaxLength

  public static readonly loginLoginNoErrors: Record<string, string> = {
    'rus': 'номер телефона или Email',
    'eng': 'phone number or Email address' };

  public static readonly loginIncorrectPassword: Record<string, string> = {
    'rus': 'неправильный пароль',
    'eng': 'incorrect password' };

  public static readonly loginUnauthorizedPhoneStart: Record<string, string> = {
    'rus': 'пользователь с телефоном',
    'eng': 'the user with the phone number' };

  public static readonly loginUnauthorizedPhoneEnd: Record<string, string> = {
    'rus': 'не зарегистрирован',
    'eng': 'is not registered' };

  public static loginUnauthorizedPhone(language: string, login: string): string {
    return `${this.loginUnauthorizedPhoneStart[language]}
      <strong>${login}</strong> ${this.loginUnauthorizedPhoneEnd[language]}`;
  } // loginUnauthorizedPhone

  public static readonly loginUnauthorizedEmailStart: Record<string, string> = {
    'rus': 'пользователь с e-mail адресом',
    'eng': 'the user with the e-mail address' };

  public static readonly loginUnauthorizedEmailEnd: Record<string, string> = {
    'rus': 'не зарегистрирован',
    'eng': 'is not registered' };

  public static loginUnauthorizedEmail(language: string, email: string): string {
    return `${this.loginUnauthorizedEmailStart[language]}
      <strong>${email}</strong> ${this.loginUnauthorizedEmailEnd[language]}`;
  } // loginUnauthorizedEmail

  public static readonly loginIncorrectData: Record<string, string> = {
    'rus': 'некорректные данные о пользователе',
    'eng': 'incorrect user information' };

  // всплывающая подсказка на кнопке "войти"
  public static readonly loginButLoginTitle: Record<string, string> = {
    'rus': 'войти в учётную запись',
    'eng': 'log in to your account' };

  // значение кнопки "войти"
  public static readonly loginButLoginValue: Record<string, string> = {
    'rus': 'войти',
    'eng': 'login' };

  //endregion


  //#region RegistrationComponent

  // заголовок
  public static readonly registrationTitle: Record<string, string> = {
    'rus': 'Регистрация',
    'eng': 'Registration' };

  // заголовок поля ввода номера телефона пользователя
  public static readonly registrationLabelPhone: Record<string, string> = {
    'rus': 'Телефон',
    'eng': 'Phone' };

  // заголовок поля ввода e-mail пользователя
  public static readonly registrationLabelEmail: Record<string, string> = {
    'rus': 'Email адрес',
    'eng': 'Email address' };

  // сообщения об ошибках
  public static readonly registeredPhone: Record<string, string> = {
    'rus': 'такой телефон уже зарегистрирован',
    'eng': 'this phone number is already registered' };

  public static readonly registeredEmail: Record<string, string> = {
    'rus': 'такой Email уже занят',
    'eng': 'this Email address is already occupied' };

  public static readonly registrationErrorEmailMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина почты',
    'eng': 'the maximum length of the mail is' };

  public static readonly registrationErrorEmailMaxLengthEnd: Record<string, string> = {
    'rus': 'символов',
    'eng': 'characters' };

  public static registrationErrorEmailMaxLength(language: string, maxLength: number): string {
    return `${this.registrationErrorEmailMaxLengthStart[language]}
      ${maxLength} ${this.registrationErrorEmailMaxLengthEnd[language]}`;
  } // registrationErrorEmailMaxLength

  public static readonly registrationPhoneNoErrors: Record<string, string> = {
    'rus': 'этот телефон станет вашим логином',
    'eng': 'this phone number will become your username' };

  public static readonly registrationEmailNoErrors: Record<string, string> = {
    'rus': 'на этот email отправим пароль',
    'eng': 'we will send the password to this email' };

  public static readonly registrationIncorrectData: Record<string, string> = {
    'rus': 'некорректные данные для регистрации',
    'eng': 'incorrect registration data' };

  // всплывающая подсказка на кнопке "продолжить"
  public static readonly registrationButContinueTitle: Record<string, string> = {
    'rus': 'продолжить регистрацию',
    'eng': 'continue registration' };

  // значение кнопки "продолжить"
  public static readonly registrationButContinueValue: Record<string, string> = {
    'rus': 'продолжить',
    'eng': 'continue' };

  //endregion


  //#region NotFoundComponent

  // заголовок
  public static readonly notFoundTitle: Record<string, string> = {
    'rus': 'Маршрут не найден / Страница не найдена',
    'eng': 'Route not found / Page not found' };

  //endregion


  //#region общее

  // сообщения об ошибках
  public static readonly errorRequired: Record<string, string> = {
    'rus': 'поле обязательное для ввода',
    'eng': 'required field' };

  public static readonly errorPhoneValidator: Record<string, string> = {
    'rus': 'неверный формат телефона',
    'eng': 'incorrect phone format' };

  public static readonly errorEmailValidator: Record<string, string> = {
    'rus': 'неверный формат почты',
    'eng': 'invalid mail format' };

  //endregion

} // class Resources
// ----------------------------------------------------------------------------
