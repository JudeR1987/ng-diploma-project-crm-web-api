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

  // заголовок на странице "Редактировать профиль"
  public static readonly appUserFormTitle: Record<string, string> = {
    'rus': 'Редактировать профиль',
    'eng': 'Edit Profile' };

  // заголовок на странице "Изменить пароль"
  public static readonly appPasswordFormTitle: Record<string, string> = {
    'rus': 'Смена пароля',
    'eng': 'Edit Password' };

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

  // всплывающая подсказка на кнопке "Редактировать профиль"
  public static readonly appButUserFormTitle: Record<string, string> = {
    'rus': 'редактировать профиль',
    'eng': 'edit profile' };

  // значение кнопки "Редактировать профиль"
  public static readonly appButUserFormValue: Record<string, string> = {
    'rus': 'профиль',
    'eng': 'profile' };

  // всплывающая подсказка на кнопке "Изменить пароль"
  public static readonly appButPasswordFormTitle: Record<string, string> = {
    'rus': 'редактировать пароль',
    'eng': 'edit password' };

  // значение кнопки "Изменить пароль"
  public static readonly appButPasswordFormValue: Record<string, string> = {
    'rus': 'смена пароля',
    'eng': 'password change' };

  // всплывающая подсказка на кнопке "Выйти"
  public static readonly appButLogOutTitle: Record<string, string> = {
    'rus': 'выйти из учётной записи',
    'eng': 'log out of account' };

  // значение кнопки "Выйти"
  public static readonly appButLogOutValue: Record<string, string> = {
    'rus': 'выйти',
    'eng': 'log out' };

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

  // сообщения об ошибках
  public static readonly loginLoginNoErrors: Record<string, string> = {
    'rus': 'номер телефона или Email',
    'eng': 'phone number or Email address' };

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

  public static readonly loginWelcome: Record<string, string> = {
    'rus': 'Добро пожаловать',
    'eng': 'Welcome' };

  public static loginWelcomeOk(language: string, userName: string): string {
    return `${this.loginWelcome[language]}, ${userName}!`;
  } // loginWelcomeOk

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

  // сообщения об ошибках
  public static readonly registrationEmailNoErrors: Record<string, string> = {
    'rus': 'на этот email отправим пароль',
    'eng': 'we will send the password to this email' };

  public static readonly registrationIncorrectData: Record<string, string> = {
    'rus': 'некорректные данные для регистрации',
    'eng': 'incorrect registration data' };

  public static readonly registrationWelcomeOk: Record<string, string> = {
    'rus': 'Поздравляем! Вы зарегистрировались!',
    'eng': 'Congratulations! You have registered!' };

  // всплывающая подсказка на кнопке "продолжить"
  public static readonly registrationButContinueTitle: Record<string, string> = {
    'rus': 'продолжить регистрацию',
    'eng': 'continue registration' };

  // значение кнопки "продолжить"
  public static readonly registrationButContinueValue: Record<string, string> = {
    'rus': 'продолжить',
    'eng': 'continue' };

  //endregion


  //#region UserFormComponent

  // заголовок
  public static readonly userFormTitle: Record<string, string> = {
    'rus': 'Ваши данные',
    'eng': 'Your details' };

  // заголовок поля ввода имени пользователя
  public static readonly userFormLabelUserName: Record<string, string> = {
    'rus': 'Имя',
    'eng': 'Name' };

  // шаблон поля ввода имени пользователя
  public static readonly userFormUserNamePlaceholder: Record<string, string> = {
    'rus': 'Ваше имя',
    'eng': 'Your name' };

  // сообщения об ошибках
  public static readonly userFormMissingData: Record<string, string> = {
    'rus': 'данные о пользователе отсутствуют',
    'eng': 'user data is missing' };

  public static readonly userFormErrorUserNameMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина имени',
    'eng': 'the maximum length of the name is' };

  public static readonly userFormErrorUserNameMaxLengthEnd: Record<string, string> = {
    'rus': 'символов',
    'eng': 'characters' };

  public static userFormErrorUserNameMaxLength(language: string, maxLength: number): string {
    return `${this.userFormErrorUserNameMaxLengthStart[language]}
      ${maxLength} ${this.userFormErrorUserNameMaxLengthEnd[language]}`;
  } // userFormErrorUserNameMaxLength

  // всплывающая подсказка на кнопке "изменить"
  public static readonly userFormButUserEditTitle: Record<string, string> = {
    'rus': 'редактировать данные',
    'eng': 'edit the data' };

  // значение кнопки "изменить"
  public static readonly userFormButUserEditValue: Record<string, string> = {
    'rus': 'изменить',
    'eng': 'edit' };

  //endregion


  //#region PasswordFormComponent

  // заголовок
  public static readonly passwordFormTitle: Record<string, string> = {
    'rus': 'Смена пароля',
    'eng': 'Password change' };

  // заголовок поля ввода старого пароля пользователя
  public static readonly passwordFormLabelOldPassword: Record<string, string> = {
    'rus': 'Старый пароль',
    'eng': 'Old password' };

  // заголовок поля ввода нового пароля пользователя
  public static readonly passwordFormLabelNewPassword: Record<string, string> = {
    'rus': 'Новый пароль',
    'eng': 'New password' };

  // заголовок поля подтверждения нового пароля пользователя
  public static readonly passwordFormLabelNewPasswordConfirmation: Record<string, string> = {
    'rus': 'Подтв. пароля',
    'eng': 'Password conf.' };

  // сообщения об ошибках
  public static readonly passwordFormIncorrectData: Record<string, string> = {
    'rus': 'некорректные данные о пароле',
    'eng': 'incorrect password data' };

  public static readonly passwordFormErrorMatchValidator: Record<string, string> = {
    'rus': 'пароли должны совпадать',
    'eng': 'passwords must match' };

  public static readonly passwordFormIncorrectNewPasswordData: Record<string, string> = {
    'rus': 'некорректные данные о новом пароле',
    'eng': 'incorrect information about the new password' };

  public static readonly passwordFormOkData: Record<string, string> = {
    'rus': 'пароль успешно изменён',
    'eng': 'password changed successfully' };

  // всплывающая подсказка на кнопке "изменить"
  public static readonly passwordFormButPasswordEditTitle: Record<string, string> = {
    'rus': 'изменить пароль',
    'eng': 'edit the password' };

  // значение кнопки "изменить"
  public static readonly passwordFormButPasswordEditValue: Record<string, string> = {
    'rus': 'изменить',
    'eng': 'edit' };

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

  public static readonly phoneNoErrors: Record<string, string> = {
    'rus': 'этот телефон станет вашим логином',
    'eng': 'this phone number will become your username' };

  public static readonly registeredPhone: Record<string, string> = {
    'rus': 'такой телефон уже зарегистрирован',
    'eng': 'this phone number is already registered' };

  public static readonly registeredEmail: Record<string, string> = {
    'rus': 'такой Email уже занят',
    'eng': 'this Email address is already occupied' };

  public static readonly errorEmailMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина почты',
    'eng': 'the maximum length of the mail is' };

  public static readonly errorEmailMaxLengthEnd: Record<string, string> = {
    'rus': 'символов',
    'eng': 'characters' };

  public static errorEmailMaxLength(language: string, maxLength: number): string {
    return `${this.errorEmailMaxLengthStart[language]}
      ${maxLength} ${this.errorEmailMaxLengthEnd[language]}`;
  } // errorEmailMaxLength

  public static readonly errorPasswordMinMaxLengthStart: Record<string, string> = {
    'rus': 'длина пароля от',
    'eng': 'the password length is from' };

  public static readonly errorPasswordMinMaxLengthMiddle: Record<string, string> = {
    'rus': 'до',
    'eng': 'to' };

  public static readonly errorPasswordMinMaxLengthEnd: Record<string, string> = {
    'rus': 'символов',
    'eng': 'characters' };

  public static errorPasswordMinMaxLength(language: string, minLength: number, maxLength: number): string {
    return `${this.errorPasswordMinMaxLengthStart[language]}
      ${minLength} ${this.errorPasswordMinMaxLengthMiddle[language]}
      ${maxLength} ${this.errorPasswordMinMaxLengthEnd[language]}`;
  } // errorPasswordMinMaxLength

  public static readonly incorrectPassword: Record<string, string> = {
    'rus': 'неправильный пароль',
    'eng': 'incorrect password' };

  public static readonly incorrectUserIdData: Record<string, string> = {
    'rus': 'некорректные данные о пользователе',
    'eng': 'incorrect user information' };

  public static readonly notRegisteredUserIdData: Record<string, string> = {
    'rus': 'пользователь не зарегистрирован',
    'eng': 'the user is not registered' };

  public static readonly unauthorizedUserIdData: Record<string, string> = {
    'rus': 'пользователь не авторизован',
    'eng': 'the user is not logged in' };

  public static readonly appLogOutOk: Record<string, string> = {
    'rus': 'Всего доброго!',
    'eng': 'All the best!' };

  public static readonly refreshTokenOk: Record<string, string> = {
    'rus': 'токен обновлён',
    'eng': 'the token has been updated' };


  // для форм

  // заголовок поля ввода номера телефона пользователя
  public static readonly labelPhone: Record<string, string> = {
    'rus': 'Телефон',
    'eng': 'Phone' };

  // заголовок поля ввода e-mail пользователя
  public static readonly labelEmail: Record<string, string> = {
    'rus': 'Email адрес',
    'eng': 'Email address' };

  // заголовок поля ввода пароля пользователя
  public static readonly labelPassword: Record<string, string> = {
    'rus': 'Пароль',
    'eng': 'Password' };

  // заголовок поля ввода подтверждения пароля пользователя
  public static readonly labelPasswordConfirmation: Record<string, string> = {
    'rus': 'Подтв. пароля',
    'eng': 'Password conf.' };

  // заголовок чек-бокса изменения отображения пароля при вводе
  public static readonly labelCheckboxPassword: Record<string, string> = {
    'rus': 'показать пароль',
    'eng': 'show password' };

  //endregion

} // class Resources
// ----------------------------------------------------------------------------
