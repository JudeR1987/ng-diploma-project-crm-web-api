// ----------------------------------------------------------------------------
// класс с набором строковых значений для разных языков
// ----------------------------------------------------------------------------
import {Literals} from './Literals';

export class Resources {

  //#region AppComponent

  // заголовок текущей страницы (значение по умолчанию)
  public static readonly appTitleDefault: Record<string, string> = {
    'rus': 'Одностраничное приложение на <strong>&laquo;Angular&raquo;</strong>',
    'eng': 'Single page application on <strong>&laquo;Angular&raquo;</strong>' };

  // заголовок на странице "Home"
  public static readonly appHomeTitle: Record<string, string> = {
    'rus': '&laquo;Платформа КРАСОТЫ&raquo;',
    'eng': '&laquo;BEAUTY Platform&raquo;' };

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

  // заголовок на странице "Ведение бизнеса"
  public static readonly appBusinessTitle: Record<string, string> = {
    'rus': 'Бизнес',
    'eng': 'Business' };

  // заголовок на странице "Создать салон"
  public static readonly appCreateCompanyFormTitle: Record<string, string> = {
    'rus': 'Регистрация нового салона',
    'eng': 'Registration of a new salon' };

  // заголовок на странице "Изменить салон"
  public static readonly appEditCompanyFormTitle: Record<string, string> = {
    'rus': 'Изменение данных о салоне',
    'eng': 'Changing the information about the salon' };

  // заголовок на странице "Услуги салона"
  public static readonly appServicesTitle: Record<string, string> = {
    'rus': 'Услуги салона',
    'eng': 'Salon services' };

  // заголовок на странице "Создать услугу"
  public static readonly appCreateServiceFormTitle: Record<string, string> = {
    'rus': 'Создание новой услуги',
    'eng': 'Creating a new service' };

  // заголовок на странице "Изменить услугу"
  public static readonly appEditServiceFormTitle: Record<string, string> = {
    'rus': 'Изменение данных об услуге',
    'eng': 'Changing service information' };

  // заголовок на странице "Сотрудники"
  public static readonly appEmployeesTitle: Record<string, string> = {
    'rus': 'Сотрудники',
    'eng': 'Employees' };

  // заголовок на странице "Добавить сотрудника"
  public static readonly appCreateEmployeeFormTitle: Record<string, string> = {
    'rus': 'Добавить нового сотрудника',
    'eng': 'Add a new employee' };

  // заголовок на странице "Изменить сотрудника"
  public static readonly appEditEmployeeFormTitle: Record<string, string> = {
    'rus': 'Изменение данных о сотруднике',
    'eng': 'Changing employee information' };

  // заголовок на странице "Расписание"
  public static readonly appScheduleTitle: Record<string, string> = {
    'rus': 'Расписание',
    'eng': 'Schedule' };

  // заголовок на странице "Услуги сотрудника"
  public static readonly appEmployeesServicesTitle: Record<string, string> = {
    'rus': 'Услуги сотрудника',
    'eng': 'Employee services' };

  // заголовок на странице "Склад"
  public static readonly appWarehouseTitle: Record<string, string> = {
    'rus': 'Склад',
    'eng': 'Warehouse' };

  // заголовок на странице "Отчёты"
  public static readonly appReportsTitle: Record<string, string> = {
    'rus': 'Отчёты',
    'eng': 'Reports' };

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

  // всплывающая подсказка на кнопке "Ведение бизнеса"
  public static readonly appButBusinessTitle: Record<string, string> = {
    'rus': 'ведение бизнеса',
    'eng': 'doing business' };

  // значение кнопки "Ведение бизнеса"
  public static readonly appButBusinessValue: Record<string, string> = {
    'rus': 'бизнес',
    'eng': 'business' };

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
    'rus': 'Наши партнёры',
    'eng': 'Our partners' };

  // всплывающая подсказка на кнопке "записаться"
  public static readonly homeButRecordTitle: Record<string, string> = {
    'rus': 'записаться онлайн',
    'eng': 'sign up online' };

  // значение кнопки "записаться"
  public static readonly homeButRecordValue: Record<string, string> = {
    'rus': 'записаться',
    'eng': 'sign up' };

  // сообщения об ошибках



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
    return `${this.loginWelcome[language]}, <b>${userName}!</b>`;
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

  public static userFormErrorUserNameMaxLength(language: string, maxLength: number): string {
    return `${this.userFormErrorUserNameMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // userFormErrorUserNameMaxLength

  public static readonly userFormIncorrectNewUserName: Record<string, string> = {
    'rus': 'некорректные данные о новом имени пользователя',
    'eng': 'incorrect information about the new username' };

  public static readonly userFormIncorrectNewPhone: Record<string, string> = {
    'rus': 'некорректные данные о новом номере телефона',
    'eng': 'incorrect information about the new phone number' };

  public static readonly userFormIncorrectNewEmail: Record<string, string> = {
    'rus': 'некорректные данные о новой почте',
    'eng': 'incorrect information about the new mail' };

  public static readonly userFormIncorrectNewAvatar: Record<string, string> = {
    'rus': 'некорректные данные о новой фотографии',
    'eng': 'incorrect information about the new photo' };

  public static readonly userFormOkData: Record<string, string> = {
    'rus': 'данные о пользователе успешно изменены',
    'eng': 'user data changed successfully' };

  public static readonly userFormDeleteUserOk: Record<string, string> = {
    'rus': 'данные о пользователе удалены',
    'eng': 'user data has been deleted' };

  // всплывающая подсказка на кнопке "изменить"
  public static readonly userFormButUserEditTitle: Record<string, string> = {
    'rus': 'редактировать данные о пользователе',
    'eng': 'edit user data' };

  // заголовок чек-бокса изменения возможности удаления данных
  public static readonly userFormLabelCheckboxDeletingFlag: Record<string, string> = {
    'rus': 'удалить аккаунт',
    'eng': 'delete an account' };

  // всплывающая подсказка на кнопке "удалить аккаунт"
  public static readonly userFormButDeleteUserTitle: Record<string, string> = {
    'rus': 'удалить аккаунт',
    'eng': 'delete an account' };

  // значение кнопки "удалить аккаунт"
  public static readonly userFormButDeleteUserValue: Record<string, string> = {
    'rus': 'удалить',
    'eng': 'delete' };

  // сообщение подтверждения удаления данных о пользователе
  public static readonly userFormMessageConfirmation: Record<string, string> = {
    'rus': 'После удаления, восстановить данные будет невозможно!<br><br>' +
      'Вы действительно хотите удалить учётную запись?',
    'eng': 'After deletion, it will be impossible to restore the data!<br><br>' +
      'Do you really want to delete your account?' };

  // всплывающая подсказка на кнопке "подтвердить удаление"
  public static readonly userFormButConfirmedOkTitle: Record<string, string> = {
    'rus': 'подтвердить удаление',
    'eng': 'confirm deletion' };

  // всплывающая подсказка на кнопке "отменить удаление"
  public static readonly userFormButConfirmedCancelTitle: Record<string, string> = {
    'rus': 'отменить удаление',
    'eng': 'cancel deletion' };

  // значение кнопки "отменить удаление"
  public static readonly userFormButConfirmedCancelValue: Record<string, string> = {
    'rus': 'отменить',
    'eng': 'cancel' };

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

  //endregion


  //#region BusinessComponent

  // заголовок
  public static readonly businessTitleDefault: Record<string, string> = {
    'rus': 'Возможности',
    'eng': 'Options' };

  // заголовок области "компании"
  public static readonly businessCompaniesTitle: Record<string, string> = {
    'rus': 'Ваши салоны',
    'eng': 'Your salons' };

  // всплывающая подсказка на кнопке "создать салон"
  public static readonly businessButCreateCompanyTitle: Record<string, string> = {
    'rus': 'зарегистрировать новый салон',
    'eng': 'register a new salon' };

  // значение кнопки "создать салон"
  public static readonly businessButCreateCompanyValue: Record<string, string> = {
    'rus': 'новый салон',
    'eng': 'new salon' };

  // всплывающая подсказка на кнопке "изменить салон"
  public static readonly businessButEditCompanyTitle: Record<string, string> = {
    'rus': 'изменить сведения о салоне',
    'eng': 'change the information about the salon' };

  // всплывающая подсказка на кнопке "Управление салоном"
  public static readonly businessButSalonManagementTitle: Record<string, string> = {
    'rus': 'управление салоном',
    'eng': 'salon management' };

  // значение кнопки "Управление салоном"
  public static readonly businessButSalonManagementValue: Record<string, string> = {
    'rus': 'управление',
    'eng': 'management' };

  // всплывающая подсказка на кнопке "Управление услугами"
  public static readonly businessButServicesManagementTitle: Record<string, string> = {
    'rus': 'управление услугами',
    'eng': 'services management' };

  // значение кнопки "Управление услугами"
  public static readonly businessButServicesManagementValue: Record<string, string> = {
    'rus': 'услуги',
    'eng': 'services' };

  // всплывающая подсказка на кнопке "Управление персоналом"
  public static readonly businessButEmployeesManagementTitle: Record<string, string> = {
    'rus': 'управление персоналом',
    'eng': 'employees management' };

  // значение кнопки "Управление персоналом"
  public static readonly businessButEmployeesManagementValue: Record<string, string> = {
    'rus': 'персонал',
    'eng': 'employees' };

  // всплывающая подсказка на кнопке "Управление складом"
  public static readonly businessButWarehouseManagementTitle: Record<string, string> = {
    'rus': 'управление складом',
    'eng': 'warehouse management' };

  // значение кнопки "Управление складом"
  public static readonly businessButWarehouseManagementValue: Record<string, string> = {
    'rus': 'склад',
    'eng': 'warehouse' };

  // всплывающая подсказка на кнопке "Просмотр отчётов"
  public static readonly businessButReportsTitle: Record<string, string> = {
    'rus': 'просмотр отчётов',
    'eng': 'viewing reports' };

  // значение кнопки "Просмотр отчётов"
  public static readonly businessButReportsValue: Record<string, string> = {
    'rus': 'отчёты',
    'eng': 'reports' };

  //endregion


  //#region CompanyFormComponent

  // заголовок формы (значение по умолчанию)
  public static readonly companyFormTitleDefault: Record<string, string> = {
    'rus': 'Данные о салоне',
    'eng': 'Salon data' };

  // заголовки
  public static readonly companyFormCreateTitle: Record<string, string> = {
    'rus': 'Новый салон',
    'eng': 'New salon' };

  public static readonly companyFormEditTitle: Record<string, string> = {
    'rus': 'Салон',
    'eng': 'Salon' };

  public static companyFormEditTitleWithCompanyName(language: string, companyName: string): string {
    return `${this.companyFormEditTitle[language]} &laquo;${companyName}&raquo;`;
  } // companyFormEditTitleWithCompanyName

  // шаблон поля ввода названия компании
  public static readonly companyFormCompanyNamePlaceholder: Record<string, string> = {
    'rus': 'название компании',
    'eng': 'company name' };

  // заголовок поля ввода названия нового города расположения компании
  public static readonly companyFormLabelNewCityName: Record<string, string> = {
    'rus': 'Новый город',
    'eng': 'New city' };

  // шаблон поля ввода названия нового города расположения компании
  public static readonly companyFormNewCityNamePlaceholder: Record<string, string> = {
    'rus': 'название города',
    'eng': 'name of the city' };

  // шаблон поля ввода названия улицы расположения компании
  public static readonly companyFormStreetNamePlaceholder: Record<string, string> = {
    'rus': 'ул. Ленина',
    'eng': 'Lenin St.' };

  // шаблон поля ввода номера дома/строения расположения компании
  public static readonly companyFormBuildingPlaceholder: Record<string, string> = {
    'rus': 'д. ххх',
    'eng': 'h. xxx' };

  // заголовок поля ввода текста описания компании
  public static readonly companyFormLabelDescription: Record<string, string> = {
    'rus': 'Краткое описание',
    'eng': 'Short description' };

  // шаблон поля ввода текста описания компании
  public static readonly companyFormCompanyDescriptionPlaceholder: Record<string, string> = {
    'rus': 'описание',
    'eng': 'description' };

  // заголовок поля ввода текста графика работы компании
  public static readonly companyFormLabelSchedule: Record<string, string> = {
    'rus': 'График работы',
    'eng': 'Schedule' };

  // заголовок поля ввода текста сайта компании
  public static readonly companyFormLabelSite: Record<string, string> = {
    'rus': 'Сайт',
    'eng': 'Site' };

  // сообщения об ошибках
  public static readonly companyFormCreateCompanyIncorrectData: Record<string, string> = {
    'rus': 'некорректные данные для создания салона',
    'eng': 'incorrect data for creating salon data' };

  public static readonly companyFormEditCompanyIncorrectData: Record<string, string> = {
    'rus': 'некорректные данные для изменения салона',
    'eng': 'incorrect data for changing salon data' };

  public static readonly companyFormCreateOkData: Record<string, string> = {
    'rus': 'Новый салон успешно зарегистрирован!',
    'eng': 'The new salon has been successfully registered!' };

  public static readonly companyFormEditOkData: Record<string, string> = {
    'rus': 'данные салона успешно изменены',
    'eng': 'salon data changed successfully' };

  public static readonly companyFormErrorScheduleMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина расписания',
    'eng': 'the maximum length of the schedule is' };

  public static companyFormErrorScheduleMaxLength(language: string, maxLength: number): string {
    return `${this.companyFormErrorScheduleMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // companyFormErrorScheduleMaxLength

  public static readonly companyFormErrorSiteMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина сайта',
    'eng': 'the maximum length of the site is' };

  public static companyFormErrorSiteMaxLength(language: string, maxLength: number): string {
    return `${this.companyFormErrorSiteMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // companyFormErrorSiteMaxLength

  public static readonly companyFormErrorNewCityNameMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина названия города',
    'eng': 'the maximum length of a city name is' };

  public static companyFormErrorNewCityNameMaxLength(language: string, maxLength: number): string {
    return `${this.companyFormErrorNewCityNameMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // companyFormErrorNewCityNameMaxLength

  public static readonly companyFormErrorStreetNameMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина названия улицы',
    'eng': 'the maximum length of a street name is' };

  public static companyFormErrorStreetNameMaxLength(language: string, maxLength: number): string {
    return `${this.companyFormErrorStreetNameMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // companyFormErrorStreetNameMaxLength

  public static readonly companyFormErrorBuildingMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина номера дома',
    'eng': 'the maximum length of a house number is' };

  public static companyFormErrorBuildingMaxLength(language: string, maxLength: number): string {
    return `${this.companyFormErrorBuildingMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // companyFormErrorBuildingMaxLength

  public static readonly companyFormErrorCountrySelectedZeroValidator: Record<string, string> = {
    'rus': 'страна не выбрана',
    'eng': 'country not selected' };

  public static readonly companyFormErrorCitySelectedZeroValidator: Record<string, string> = {
    'rus': 'город не выбран',
    'eng': 'city not selected' };

  public static readonly companyFormErrorRegisteredCity: Record<string, string> = {
    'rus': 'такой город уже зарегистрирован',
    'eng': 'this city is already registered' };

  public static readonly companyFormUploadLogoOkData: Record<string, string> = {
    'rus': 'изображение логотипа успешно загружено',
    'eng': 'the logo image uploaded successfully' };

  public static readonly companyFormUploadImageOkData: Record<string, string> = {
    'rus': 'изображение салона успешно загружено',
    'eng': 'the salon image uploaded successfully' };

  public static readonly companyFormIncorrectNewLogo: Record<string, string> = {
    'rus': 'некорректные данные о новом логотипе',
    'eng': 'incorrect information about the new logo' };

  public static readonly companyFormIncorrectNewTitleImage: Record<string, string> = {
    'rus': 'некорректные данные о новом изображении салона',
    'eng': 'incorrect information about the new salon image' };

  public static readonly companyFormIncorrectTempLogoDirectory: Record<string, string> = {
    'rus': 'папка с временными изображениями логотипов отсутствует',
    'eng': 'the folder with temporary logo images is missing' };

  public static readonly companyFormIncorrectTempTitleImageDirectory: Record<string, string> = {
    'rus': 'папка с временными изображениями компании отсутствует',
    'eng': 'the folder with temporary company images is missing' };

  public static readonly companyFormDeleteTempDirectoryLogoOk: Record<string, string> = {
    'rus': 'папка с временными логотипами удалена',
    'eng': 'folder with temporary logos deleted' };

  public static readonly companyFormDeleteTempDirectoryTitleImageOk: Record<string, string> = {
    'rus': 'папка с временными изображениями компании удалена',
    'eng': 'folder with temporary company images deleted' };

  // всплывающая подсказка на кнопке "создать компанию"
  public static readonly companyFormButCompanyCreateTitle: Record<string, string> = {
    'rus': 'создать новый салон',
    'eng': 'create a new salon' };

  // всплывающая подсказка на кнопке "изменить компанию"
  public static readonly companyFormButCompanyEditTitle: Record<string, string> = {
    'rus': 'редактировать данные салона',
    'eng': 'edit salon data' };

  // всплывающие подсказки на логотипе компании
  public static readonly companyFormCreateLogoTitle: Record<string, string> = {
    'rus': 'Логотип нового салона',
    'eng': 'The logo of the new salon' };

  public static readonly companyFormEditLogoTitle: Record<string, string> = {
    'rus': 'Логотип салона',
    'eng': 'The logo of the salon' };

  public static companyFormEditLogoTitleWithCompanyName(language: string, companyName: string): string {
    return `${this.companyFormEditLogoTitle[language]} &laquo;${companyName}&raquo;`;
  } // companyFormEditLogoTitleWithCompanyName

  // всплывающие подсказки на основном изображении компании
  public static readonly companyFormCreateTitleImageTitle: Record<string, string> = {
    'rus': 'Изображение нового салона',
    'eng': 'The image of the new salon' };

  public static readonly companyFormEditTitleImageTitle: Record<string, string> = {
    'rus': 'Изображение салона',
    'eng': 'The image of the salon' };

  public static companyFormEditTitleImageTitleWithCompanyName(language: string, companyName: string): string {
    return `${this.companyFormEditTitleImageTitle[language]} &laquo;${companyName}&raquo;`;
  } // companyFormEditTitleImageTitleWithCompanyName

  // заголовок поля выбора изображения логотипа компании
  public static readonly companyFormLabelInputImageLogo: Record<string, string> = {
    'rus': 'выберите логотип',
    'eng': 'select a logo' };

  // заголовок поля выбора основного изображения компании
  public static readonly companyFormLabelInputImageTitleImage: Record<string, string> = {
    'rus': 'выберите изображение салона',
    'eng': 'select a salon image' };

  // всплывающая подсказка на кнопке "выбрать логотип"
  public static readonly companyFormButNewLogoFileNameTitle: Record<string, string> = {
    'rus': 'выбрать файл с логотипом',
    'eng': 'select a file with a logo' };

  // всплывающая подсказка на кнопке "выбрать изображение салона"
  public static readonly companyFormButNewTitleImageFileNameTitle: Record<string, string> = {
    'rus': 'выбрать файл с изображением салона',
    'eng': 'select a file with a salon image' };

  // всплывающая подсказка на заголовке чек-бокса "новый город"
  public static readonly companyFormLabelCheckboxIsNewCityTitle: Record<string, string> = {
    'rus': 'добавить новый город',
    'eng': 'add a new city' };

  //endregion


  //#region ServicesComponent

  // заголовок
  public static readonly servicesTitle: Record<string, string> = {
    'rus': 'Услуги',
    'eng': 'Services' };

  // всплывающая подсказка на кнопке "создать услугу"
  public static readonly servicesButCreateServiceTitle: Record<string, string> = {
    'rus': 'создать новую услугу',
    'eng': 'create a new service' };

  // значение кнопки "создать услугу"
  public static readonly servicesButCreateServiceValue: Record<string, string> = {
    'rus': 'новая услуга',
    'eng': 'new service' };

  // начальный фрагмент всплывающей подсказки на поле отображения
  // наименования категории услуг в дочернем компоненте
  public static readonly servicesCollapseServicesCategoryNameTitleStart: Record<string, string> = {
    'rus': 'список услуг категории',
    'eng': 'list of service category' };

  // начальный фрагмент всплывающей подсказки чек-бокса выбора услуги
  public static readonly servicesLabelIsSelectedServiceTitleStart: Record<string, string> = {
    'rus': 'выбрать услугу',
    'eng': 'choose a service' };

  // всплывающая подсказка на кнопке "изменить услугу"
  public static readonly servicesButEditServiceTitle: Record<string, string> = {
    'rus': 'изменить услугу',
    'eng': 'edit the service' };

  // всплывающая подсказка на кнопке "удалить услугу"
  public static readonly servicesButDeleteServiceTitle: Record<string, string> = {
    'rus': 'удалить услугу',
    'eng': 'delete the service' };

  // сообщения об ошибках
  public static readonly servicesDeleteServiceOk: Record<string, string> = {
    'rus': 'данные об услуге удалены',
    'eng': 'service data has been deleted' };

  //endregion


  //#region ServiceFormComponent

  // заголовок формы (значение по умолчанию)
  public static readonly serviceFormTitleDefault: Record<string, string> = {
    'rus': 'Данные об услуге',
    'eng': 'Service data' };

  // заголовки
  public static readonly serviceFormCreateTitle: Record<string, string> = {
    'rus': 'Новая услуга',
    'eng': 'New service' };

  public static readonly serviceFormEditTitle: Record<string, string> = {
    'rus': 'Услуга',
    'eng': 'Service' };

  public static serviceFormEditTitleWithServiceName(language: string, serviceName: string): string {
    return `${this.serviceFormEditTitle[language]} &laquo;${serviceName}&raquo;`;
  } // serviceFormEditTitleWithServiceName

  // всплывающая подсказка на кнопке "создать услугу"
  public static readonly serviceFormButServiceCreateTitle: Record<string, string> = {
    'rus': 'создать новую услугу',
    'eng': 'create a new service' };

  // всплывающая подсказка на кнопке "изменить услугу"
  public static readonly serviceFormButServiceEditTitle: Record<string, string> = {
    'rus': 'редактировать данные об услуге',
    'eng': 'edit service data' };

  // заголовок поля ввода наименования новой категории услуг салона
  public static readonly serviceFormLabelNewServicesCategoryName: Record<string, string> = {
    'rus': 'Новая категория услуг',
    'eng': 'New service category' };

  // шаблон поля ввода наименования новой категории услуг
  public static readonly serviceFormNewServicesCategoryNamePlaceholder: Record<string, string> = {
    'rus': 'наименование категории услуг',
    'eng': 'name of the service category' };

  // всплывающая подсказка на заголовке чек-бокса "новая категория услуг"
  public static readonly serviceFormLabelCheckboxIsNewServicesCategoryTitle: Record<string, string> = {
    'rus': 'добавить новую категорию услуг',
    'eng': 'add a new service category' };

  // шаблон поля ввода наименования услуги салона
  public static readonly serviceFormServiceNamePlaceholder: Record<string, string> = {
    'rus': 'наименование услуги',
    'eng': 'name of the service' };

  // шаблон поля ввода текста комментария к услуге
  public static readonly serviceFormCommentPlaceholder: Record<string, string> = {
    'rus': 'комментарий к услуге',
    'eng': 'comment on the service' };

  // сообщения об ошибках
  public static readonly serviceFormCreateServiceIncorrectData: Record<string, string> = {
    'rus': 'некорректные данные для создания услуги',
    'eng': 'incorrect data for creating service data' };

  public static readonly serviceFormEditServiceIncorrectData: Record<string, string> = {
    'rus': 'некорректные данные для изменения услуги',
    'eng': 'incorrect data for changing service data' };

  public static readonly serviceFormCreateOkData: Record<string, string> = {
    'rus': 'Новая услуга успешно создана!',
    'eng': 'The new service has been successfully created' };

  public static readonly serviceFormEditOkData: Record<string, string> = {
    'rus': 'данные об услуге успешно изменены',
    'eng': 'service data changed successfully' };

  public static readonly serviceFormErrorRegisteredServicesCategoryName: Record<string, string> = {
    'rus': 'такая категория услуг уже зарегистрирована',
    'eng': 'this service category is already registered' };

  public static readonly serviceFormErrorServicesCategorySelectedZeroValidator: Record<string, string> = {
    'rus': 'категория услуг не выбрана',
    'eng': 'service category not selected' };

  public static readonly serviceFormErrorNewServicesCategoryNameMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина наименования категории услуг',
    'eng': 'the maximum length of the service category name is' };

  public static serviceFormErrorNewServicesCategoryNameMaxLength(language: string, maxLength: number): string {
    return `${this.serviceFormErrorNewServicesCategoryNameMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // serviceFormErrorNewServicesCategoryNameMaxLength

  //endregion


  //#region EmployeesComponent

  // заголовок
  public static readonly employeesTitle: Record<string, string> = {
    'rus': 'Сотрудники',
    'eng': 'Employees' };

  public static readonly employeesZeroCollectionTitle: Record<string, string> = {
    'rus': 'Сотрудники отсутствуют',
    'eng': 'There are no employees' };

  // всплывающая подсказка на кнопке "создать сотрудника"
  public static readonly employeesButCreateEmployeeTitle: Record<string, string> = {
    'rus': 'добавить нового сотрудника',
    'eng': 'add a new employee' };

  // значение кнопки "создать сотрудника"
  public static readonly employeesButCreateEmployeeValue: Record<string, string> = {
    'rus': 'новый сотрудник',
    'eng': 'new employee' };

  // начальный фрагмент всплывающей подсказки на поле
  // отображения рейтинга сотрудника в дочернем компоненте
  public static readonly employeesRatingTitleStart: Record<string, string> = {
    'rus': 'рейтинг сотрудника',
    'eng': 'employee rating' };

  // всплывающая подсказка на кнопке "показать расписание"
  public static readonly employeesButShowScheduleEmployeeTitle: Record<string, string> = {
    'rus': 'показать расписание сотрудника',
    'eng': 'show the employee\'s schedule' };

  // всплывающая подсказка на кнопке "показать услуги"
  public static readonly employeesButShowServicesEmployeeTitle: Record<string, string> = {
    'rus': 'показать услуги, предоставляемые сотрудником',
    'eng': 'show the services provided by an employee' };

  // всплывающая подсказка на кнопке "изменить сотрудника"
  public static readonly employeesButEditEmployeeTitle: Record<string, string> = {
    'rus': 'изменить сведения о сотруднике',
    'eng': 'change the information about the employee' };

  // всплывающая подсказка на кнопке "удалить сотрудника"
  public static readonly employeesButDeleteEmployeeTitle: Record<string, string> = {
    'rus': 'удалить сведения о сотруднике',
    'eng': 'delete employee information' };

  // сообщения об ошибках
  public static readonly employeesDeleteEmployeeOk: Record<string, string> = {
    'rus': 'данные о сотруднике удалены',
    'eng': 'employee data has been deleted' };

  //endregion


  //#region EmployeeFormComponent

  // заголовок формы (значение по умолчанию)
  public static readonly employeeFormTitleDefault: Record<string, string> = {
    'rus': 'Данные о сотруднике',
    'eng': 'Employee information' };

  // заголовки
  public static readonly employeeFormCreateTitle: Record<string, string> = {
    'rus': 'Новый сотрудник',
    'eng': 'New employee' };

  public static readonly employeeFormEditTitle: Record<string, string> = {
    'rus': 'Сотрудник',
    'eng': 'Employee' };

  public static employeeFormEditTitleWithEmployeeName(language: string, employeeName: string): string {
    return `${this.employeeFormEditTitle[language]} ${employeeName}`;
  } // employeeFormEditTitleWithEmployeeName

  // всплывающая подсказка на кнопке "добавить сотрудника"
  public static readonly employeeFormButEmployeeCreateTitle: Record<string, string> = {
    'rus': 'добавить сведения о новом сотруднике',
    'eng': 'add information about a new employee' };

  // всплывающая подсказка на кнопке "изменить сотрудника"
  public static readonly employeeFormButEmployeeEditTitle: Record<string, string> = {
    'rus': 'редактировать сведения о сотруднике',
    'eng': 'edit employee information' };

  // всплывающая подсказка на кнопке "сброс данных"
  public static readonly employeeFormButEmployeeFormCreateResetTitle: Record<string, string> = {
    'rus': 'сбросить введённые данные о сотруднике',
    'eng': 'reset the entered employee information' };

  // шаблон поля ввода имени сотрудника
  public static readonly employeeFormEmployeeNamePlaceholder: Record<string, string> = {
    'rus': 'имя сотрудника',
    'eng': 'employee name' };

  // заголовок поля ввода наименования новой специальности сотрудника
  public static readonly employeeFormLabelNewSpecializationName: Record<string, string> = {
    'rus': 'Новая специальность',
    'eng': 'New specialization' };

  // шаблон поля ввода наименования новой специальности сотрудника
  public static readonly employeeFormNewSpecializationNamePlaceholder: Record<string, string> = {
    'rus': 'наименование специальности',
    'eng': 'name of the specialization' };

  // всплывающая подсказка на заголовке чек-бокса "новая специальность"
  public static readonly employeeFormLabelCheckboxIsNewSpecializationTitle: Record<string, string> = {
    'rus': 'добавить новую специальность',
    'eng': 'add a new specialization' };

  // заголовок поля ввода наименования новой должности сотрудника
  public static readonly employeeFormLabelNewPositionName: Record<string, string> = {
    'rus': 'Новая должность',
    'eng': 'New position' };

  // шаблон поля ввода наименования новой должности сотрудника
  public static readonly employeeFormNewPositionNamePlaceholder: Record<string, string> = {
    'rus': 'наименование должности',
    'eng': 'name of the position' };

  // всплывающая подсказка на заголовке чек-бокса "новая должность"
  public static readonly employeeFormLabelCheckboxIsNewPositionTitle: Record<string, string> = {
    'rus': 'добавить новую должность',
    'eng': 'add a new position' };

  // всплывающие подсказки на фотографии сотрудника
  public static readonly employeeFormCreatePhotoTitle: Record<string, string> = {
    'rus': 'фотография нового сотрудника',
    'eng': 'photo of a new employee' };

  // сообщения об ошибках
  public static readonly employeeFormCreateEmployeeIncorrectData: Record<string, string> = {
    'rus': 'некорректные данные для добавления сотрудника',
    'eng': 'incorrect data for adding an employee' };

  public static readonly employeeFormEditEmployeeIncorrectData: Record<string, string> = {
    'rus': 'некорректные данные для изменения данных о сотруднике',
    'eng': 'incorrect data for changing employee data' };

  public static readonly employeeFormCreateOkData: Record<string, string> = {
    'rus': 'Новый сотрудник успешно добавлен!',
    'eng': 'New employee successfully added' };

  public static readonly employeeFormEditOkData: Record<string, string> = {
    'rus': 'данные о сотруднике успешно изменены',
    'eng': 'employee data changed successfully' };

  public static readonly employeeFormErrorRegisteredSpecialization: Record<string, string> = {
    'rus': 'такая специальность уже зарегистрирована',
    'eng': 'this specialization is already registered' };

  public static readonly employeeFormErrorRegisteredPosition: Record<string, string> = {
    'rus': 'такая должность уже зарегистрирована',
    'eng': 'this position is already registered' };

  public static readonly employeeFormIncorrectEmployeeName: Record<string, string> = {
    'rus': 'некорректные данные об имени сотрудника',
    'eng': 'incorrect information about the employee\'s name' };

  public static readonly employeeFormIncorrectPhone: Record<string, string> = {
    'rus': 'некорректные данные о номере телефона сотрудника',
    'eng': 'incorrect information about the employee\'s phone number' };

  public static readonly employeeFormIncorrectEmail: Record<string, string> = {
    'rus': 'некорректные данные о почте сотрудника',
    'eng': 'incorrect information about the employee\'s mail' };

  public static readonly employeeFormIncorrectAvatar: Record<string, string> = {
    'rus': 'некорректные данные о фотографии сотрудника',
    'eng': 'incorrect information about the employee\'s photo' };

  public static readonly employeeFormErrorEmployeeNameMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина имени сотрудника',
    'eng': 'the maximum length of an employee\'s name is' };

  public static employeeFormErrorEmployeeNameMaxLength(language: string, maxLength: number): string {
    return `${this.employeeFormErrorEmployeeNameMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // employeeFormErrorEmployeeNameMaxLength

  public static readonly employeeFormErrorSpecializationSelectedZeroValidator: Record<string, string> = {
    'rus': 'специальность не выбрана',
    'eng': 'specialization not selected' };

  public static readonly employeeFormErrorNewSpecializationNameMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина наименования специальности',
    'eng': 'the maximum length of the specialization name is' };

  public static employeeFormErrorNewSpecializationNameMaxLength(language: string, maxLength: number): string {
    return `${this.employeeFormErrorNewSpecializationNameMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // employeeFormErrorNewSpecializationNameMaxLength

  public static readonly employeeFormErrorPositionSelectedZeroValidator: Record<string, string> = {
    'rus': 'должность не выбрана',
    'eng': 'position not selected' };

  public static readonly employeeFormErrorNewPositionNameMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина наименования должности',
    'eng': 'the maximum length of the position name is' };

  public static employeeFormErrorNewPositionNameMaxLength(language: string, maxLength: number): string {
    return `${this.employeeFormErrorNewPositionNameMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // employeeFormErrorNewPositionNameMaxLength


  public static readonly employeeFormErrorNotMatchUserNameStart: Record<string, string> = {
    'rus': 'пользователь зарегистрирован под именем',
    'eng': 'the user is registered under the name' };

  public static employeeFormErrorNotMatchUserName(language: string, userName: string): string {
    return `${this.employeeFormErrorNotMatchUserNameStart[language]} <strong>${userName}</strong>`;
  } // employeeFormErrorNotMatchUserName


  public static readonly employeeFormErrorNotMatchUserPhoneStart: Record<string, string> = {
    'rus': 'номер телефона пользователя',
    'eng': 'user\'s phone number' };

  public static employeeFormErrorNotMatchUserPhone(language: string, phone: string): string {
    return `${this.employeeFormErrorNotMatchUserPhoneStart[language]}: <strong>${phone}</strong>`;
  } // employeeFormErrorNotMatchUserPhone


  public static readonly employeeFormErrorNotMatchUserEmailStart: Record<string, string> = {
    'rus': 'адрес почты пользователя',
    'eng': 'user\'s email address' };

  public static employeeFormErrorNotMatchUserEmail(language: string, userEmail: string): string {
    return `${this.employeeFormErrorNotMatchUserEmailStart[language]}: <strong>${userEmail}</strong>`;
  } // employeeFormErrorNotMatchUserEmail


  public static readonly employeeFormRegisteredUserOkStart: Record<string, string> = {
    'rus': 'пользователь',
    'eng': 'user' };

  public static readonly employeeFormRegisteredUserOkEnd: Record<string, string> = {
    'rus': 'успешно зарегистрирован',
    'eng': 'successfully registered' };

  public static employeeFormRegisteredUserOk(language: string, userName: string): string {
    return `${this.employeeFormRegisteredUserOkStart[language]}
      <strong>${userName}</strong> ${this.employeeFormRegisteredUserOkEnd[language]}`;
  } // employeeFormRegisteredUserOk

  public static readonly employeeFormUserNotRegisteredInCompanies: Record<string, string> = {
    'rus': 'пользователь не сотрудничает с другими салонами',
    'eng': 'the user does not cooperate with other salons' };

  public static readonly employeeFormUserNotRegisteredInCompaniesStart: Record<string, string> = {
    'rus': 'пользователь',
    'eng': 'user' };

  public static readonly employeeFormUserNotRegisteredInCompaniesMiddle: Record<string, string> = {
    'rus': 'сотрудничает с салоном',
    'eng': 'cooperates with the' };

  public static readonly employeeFormUserNotRegisteredInCompaniesEnd: Record<string, string> = {
    'rus': '',
    'eng': ' salon' };

  public static employeeFormUserRegisteredInCompany(language: string, userName: string, companyName: string): string {
    return `${this.employeeFormUserNotRegisteredInCompaniesStart[language]}
      <strong>${userName}</strong> ${this.employeeFormUserNotRegisteredInCompaniesMiddle[language]}
      <strong>&laquo;${companyName}&raquo;</strong>${this.employeeFormUserNotRegisteredInCompaniesEnd[language]}`;
  } // employeeFormUserRegisteredInCompany

  //endregion


  //#region ScheduleComponent

  // заголовок
  public static readonly scheduleTitleStart: Record<string, string> = {
    'rus': 'Расписание сотрудника',
    'eng': 'Schedule of employee' };

  public static scheduleTitle(language: string, employeesName: string): string {
    return `${this.scheduleTitleStart[language]} <strong>${employeesName}</strong>`;
  } // scheduleTitle

  // заголовок таблицы
  public static readonly scheduleTableTitleFrom: Record<string, string> = {
    'rus': 'с',
    'eng': 'from' };

  public static readonly scheduleTableTitleTo: Record<string, string> = {
    'rus': 'по',
    'eng': 'to' };

  public static scheduleTableTitle(language: string, firstDay: Date, lastDay: Date): string {
    return `${this.scheduleTableTitleFrom[language]} <strong>${firstDay.toLocaleDateString()}</strong>
            ${this.scheduleTableTitleTo[language]} <strong>${lastDay.toLocaleDateString()}</strong>`;
  } // scheduleTableTitle

  // всплывающая подсказка в поле чек-бокса "рабочий/НЕ_рабочий день" для выходного дня
  public static readonly scheduleLabelCheckboxWeekendTitle: Record<string, string> = {
    'rus': 'назначить день рабочим',
    'eng': 'set the day as a working day' };

  // всплывающая подсказка в поле чек-бокса "рабочий/НЕ_рабочий день" для рабочего дня
  public static readonly scheduleLabelCheckboxWorkingDayTitle: Record<string, string> = {
    'rus': 'назначить день выходным',
    'eng': 'set the day as a weekend' };

  // всплывающая подсказка на кнопке "добавить перерыв"
  public static readonly scheduleButAddBreakSlotTitle: Record<string, string> = {
    'rus': 'добавить перерыв',
    'eng': 'add a break' };

  // всплывающая подсказка на кнопке "убрать перерыв"
  public static readonly scheduleButRemoveBreakSlotTitle: Record<string, string> = {
    'rus': 'убрать перерыв',
    'eng': 'remove the break' };

  // сообщения об ошибках
  public static readonly scheduleIncorrectDateData: Record<string, string> = {
    'rus': 'некорректные данные о дате рабочего дня',
    'eng': 'incorrect information about the date of the working day' };

  //endregion


  //#region EmployeesServicesComponent

  // заголовок
  public static readonly employeesServicesTitleStart: Record<string, string> = {
    'rus': 'услуги сотрудника',
    'eng': 'the services of an employee' };

  public static employeesServicesTitle(language: string, employeesName: string): string {
    return `${this.employeesServicesTitleStart[language]} <strong>${employeesName}</strong>`;
  } // employeesServicesTitle

  public static readonly employeesServicesZeroCollectionTitle: Record<string, string> = {
    'rus': 'Услуги не добавлены',
    'eng': 'No services added' };

  // сообщения об ошибках
  public static readonly employeesServicesCreateEmployeeServiceOk: Record<string, string> = {
    'rus': 'данные об услуге сотрудника <strong>добавлены</strong>',
    'eng': 'employee\'s service information <strong>added</strong>' };

  public static readonly employeesServicesDeleteEmployeeServiceOk: Record<string, string> = {
    'rus': 'данные об услуге сотрудника <strong>удалены</strong>',
    'eng': 'employee\'s service information has been <strong>deleted</strong>' };

  //endregion


  //#region WarehouseComponent

  // заголовок
  public static readonly warehouseTitle: Record<string, string> = {
    'rus': 'Склад',
    'eng': 'Warehouse' };

  //endregion


  //#region ReportsComponent

  // заголовок
  public static readonly reportsTitle: Record<string, string> = {
    'rus': 'Отчёты',
    'eng': 'Reports' };

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

  public static errorEmailMaxLength(language: string, maxLength: number): string {
    return `${this.errorEmailMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // errorEmailMaxLength

  public static readonly errorPasswordMinMaxLengthStart: Record<string, string> = {
    'rus': 'длина пароля от',
    'eng': 'the password length is from' };

  public static readonly errorPasswordMinMaxLengthMiddle: Record<string, string> = {
    'rus': 'до',
    'eng': 'to' };

  public static errorPasswordMinMaxLength(language: string, minLength: number, maxLength: number): string {
    return `${this.errorPasswordMinMaxLengthStart[language]}
      ${minLength} ${this.errorPasswordMinMaxLengthMiddle[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
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

  public static readonly incorrectFileData: Record<string, string> = {
    'rus': 'файл данных отсутствует',
    'eng': 'the data file is missing' };

  public static readonly noConnection: Record<string, string> = {
    'rus': 'соединение с сервером отсутствует',
    'eng': 'there is no connection to the server' };

  public static readonly requiredAuthorization: Record<string, string> = {
    'rus': 'требуется авторизация',
    'eng': 'authorization is required' };

  public static readonly errorTitleMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина названия',
    'eng': 'the maximum length of the title is' };

  public static errorTitleMaxLength(language: string, maxLength: number): string {
    return `${this.errorTitleMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // errorTitleMaxLength

  public static readonly errorNameMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина наименования',
    'eng': 'the maximum length of the name is' };

  public static errorNameMaxLength(language: string, maxLength: number): string {
    return `${this.errorNameMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // errorNameMaxLength

  public static readonly errorDescriptionMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина описания',
    'eng': 'the maximum length of the description is' };

  public static errorDescriptionMaxLength(language: string, maxLength: number): string {
    return `${this.errorDescriptionMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // errorDescriptionMaxLength

  public static readonly errorCommentMaxLengthStart: Record<string, string> = {
    'rus': 'максимальная длина комментария',
    'eng': 'the maximum length of the comment is' };

  public static errorCommentMaxLength(language: string, maxLength: number): string {
    return `${this.errorCommentMaxLengthStart[language]}
      ${maxLength} ${this.errorForMaxLengthEnd[language]}`;
  } // errorCommentMaxLength

  public static readonly errorForMaxLengthEnd: Record<string, string> = {
    'rus': 'символов',
    'eng': 'characters' };

  public static readonly incorrectCompanyIdData: Record<string, string> = {
    'rus': 'некорректные данные о салоне',
    'eng': 'incorrect salon information' };

  public static readonly incorrectImageTypeData: Record<string, string> = {
    'rus': 'некорректный тип изображения',
    'eng': 'incorrect image type' };

  public static readonly incorrectPageData: Record<string, string> = {
    'rus': 'некорректные данные о запрашиваемой странице',
    'eng': 'incorrect information about the requested page' };

  public static readonly notRegisteredCompanyIdData: Record<string, string> = {
    'rus': 'салон не зарегистрирован',
    'eng': 'the salon is not registered' };

  public static readonly incorrectCountryIdData: Record<string, string> = {
    'rus': 'некорректные данные о стране',
    'eng': 'incorrect country information' };

  public static readonly incorrectCityIdData: Record<string, string> = {
    'rus': 'некорректные данные о городе',
    'eng': 'incorrect city information' };

  public static readonly incorrectStreetIdData: Record<string, string> = {
    'rus': 'некорректные данные об улице',
    'eng': 'incorrect street information' };

  public static readonly incorrectServiceIdData: Record<string, string> = {
    'rus': 'некорректные данные об услуге салона',
    'eng': 'incorrect information about the salon service' };

  public static readonly notRegisteredServiceIdData: Record<string, string> = {
    'rus': 'услуга не найдена',
    'eng': 'the service was not found' };

  public static readonly formParamsOkData: Record<string, string> = {
    'rus': 'данные формы получены',
    'eng': 'form data has been received' };

  public static readonly notRegisteredServicesCategoryIdData: Record<string, string> = {
    'rus': 'категория услуг не найдена',
    'eng': 'the service was not found' };

  public static readonly errorMinValueStart: Record<string, string> = {
    'rus': 'минимальное значение',
    'eng': 'minimum value' };

  public static readonly errorMaxValueStart: Record<string, string> = {
    'rus': 'максимальное значение',
    'eng': 'maximum value' };

  public static errorMinMaxValue(language: string, mode: string, value: number): string {
    return `${mode === Literals.min
      ? this.errorMinValueStart[language]
      : this.errorMaxValueStart[language]}: ${value}`;
  } // errorMinMaxValue

  public static readonly incorrectEmployeeIdData: Record<string, string> = {
    'rus': 'некорректные данные о сотруднике салона',
    'eng': 'incorrect information about the salon employee' };

  public static readonly notRegisteredEmployeeIdData: Record<string, string> = {
    'rus': 'сотрудник не зарегистрирован',
    'eng': 'the employee is not registered' };

  public static readonly incorrectTempPhotosDirectory: Record<string, string> = {
    'rus': 'папка с временными фотографиями отсутствует',
    'eng': 'the folder with temporary photos is missing' };

  public static readonly deleteTempPhotosDirectoryOk: Record<string, string> = {
    'rus': 'папка с временными фотографиями удалена',
    'eng': 'folder with temporary photos deleted' };

  public static readonly uploadImageOkData: Record<string, string> = {
    'rus': 'изображение успешно загружено',
    'eng': 'image uploaded successfully' };

  public static readonly notRegisteredSpecializationIdData: Record<string, string> = {
    'rus': 'специальность не найдена',
    'eng': 'specialty not found' };

  public static readonly notRegisteredPositionIdData: Record<string, string> = {
    'rus': 'должность не найдена',
    'eng': 'position not found' };

  public static readonly incorrectData: Record<string, string> = {
    'rus': 'введены некорректные данные',
    'eng': 'incorrect data has been entered' };

  public static readonly incorrectPhoneData: Record<string, string> = {
    'rus': 'некорректные данные номера телефона',
    'eng': 'incorrect phone number data' };

  public static readonly incorrectEmailData: Record<string, string> = {
    'rus': 'некорректные данные почты',
    'eng': 'incorrect email data' };

  public static readonly incorrectEmployeeServiceIdData: Record<string, string> = {
    'rus': 'некорректные данные об услуге сотрудника',
    'eng': 'incorrect information about the employee\'s service' };

  public static readonly incorrectWorkDayIdData: Record<string, string> = {
    'rus': 'некорректные данные о рабочем дне сотрудника',
    'eng': 'incorrect information about the employee\'s working day' };

  public static readonly createDataOk: Record<string, string> = {
    'rus': 'данные добавлены',
    'eng': 'data added' };

  public static readonly editDataOk: Record<string, string> = {
    'rus': 'данные изменены',
    'eng': 'data changed' };

  public static readonly notRegisteredWorkDayIdData: Record<string, string> = {
    'rus': 'данные о рабочем дне не найдены',
    'eng': 'working day data was not found' };


  // для форм

  // заголовок поля ввода имени персоны
  public static readonly labelPersonName: Record<string, string> = {
    'rus': 'Имя',
    'eng': 'Name' };

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

  // заголовок поля ввода названия чего-либо
  public static readonly labelName: Record<string, string> = {
    'rus': 'Название',
    'eng': 'Name' };

  // заголовок чек-бокса изменения отображения пароля при вводе
  public static readonly labelCheckboxPassword: Record<string, string> = {
    'rus': 'показать пароль',
    'eng': 'show password' };

  // заголовок списка выбора страны
  public static readonly labelCountry: Record<string, string> = {
    'rus': 'Страна',
    'eng': 'Country' };

  // заголовок списка выбора города
  public static readonly labelCity: Record<string, string> = {
    'rus': 'Город',
    'eng': 'City' };

  // первый элемент списка выбора страны
  public static readonly firstOptionCountries: Record<string, string> = {
    'rus': 'выберите страну...',
    'eng': 'select a country...' };

  // первый элемент списка выбора города
  public static readonly firstOptionCities: Record<string, string> = {
    'rus': 'выберите город...',
    'eng': 'select a city...' };

  // заголовок поля ввода названия улицы
  public static readonly labelStreetName: Record<string, string> = {
    'rus': 'Улица',
    'eng': 'Street' };

  // заголовок поля ввода номера дома/строения
  public static readonly labelBuilding: Record<string, string> = {
    'rus': 'дом',
    'eng': 'house' };

  // заголовок поля ввода номера квартиры/офиса
  public static readonly labelFlat: Record<string, string> = {
    'rus': 'квартира',
    'eng': 'flat' };

  // заголовок "Внимание!"
  public static readonly titleAttention: Record<string, string> = {
    'rus': 'Внимание!',
    'eng': 'Attention!' };

  // значение кнопки "создать"
  public static readonly butCreateValue: Record<string, string> = {
    'rus': 'создать',
    'eng': 'create' };

  // значение кнопки "добавить"
  public static readonly butAddValue: Record<string, string> = {
    'rus': 'добавить',
    'eng': 'add' };

  // значение кнопки "изменить"
  public static readonly butEditValue: Record<string, string> = {
    'rus': 'изменить',
    'eng': 'edit' };

  // значение кнопки "удалить"
  public static readonly butDeleteValue: Record<string, string> = {
    'rus': 'удалить',
    'eng': 'delete' };

  // значение кнопки "сброс"
  public static readonly butResetValue: Record<string, string> = {
    'rus': 'сброс',
    'eng': 'reset' };

  // заголовок поля выбора фотографии
  public static readonly labelInputPhoto: Record<string, string> = {
    'rus': 'выберите фотографию',
    'eng': 'select a photo' };

  // заголовок поля вывода имени файла выбранного изображения
  public static readonly labelNewFileName: Record<string, string> = {
    'rus': 'выбран файл',
    'eng': 'selected file' };

  // заголовок поля вывода имени файла при невыбранном изображении
  public static readonly labelFileNotSelected: Record<string, string> = {
    'rus': 'файл не выбран',
    'eng': 'the file is not selected' };

  // всплывающая подсказка на кнопке "выбрать фотографию"
  public static readonly butNewPhotoFileNameTitle: Record<string, string> = {
    'rus': 'выбрать файл с фотографией',
    'eng': 'select a photo file' };

  // значение кнопки "выбрать изображение"
  public static readonly butNewFileNameValue: Record<string, string> = {
    'rus': 'выбрать',
    'eng': 'selected' };

  // заголовок поля ввода чего-либо нового
  public static readonly labelNewHe: Record<string, string> = {
    'rus': 'новый',
    'eng': 'new' };
  public static readonly labelNewShe: Record<string, string> = {
    'rus': 'новая',
    'eng': 'new' };

  // заголовок поля отображения графика работы компании
  public static readonly labelSchedule: Record<string, string> = {
    'rus': 'График работы',
    'eng': 'Work schedule' };

  // заголовок поля отображения телефона компании
  public static readonly displayLabelPhone: Record<string, string> = {
    'rus': 'тел.',
    'eng': 'phone' };

  // всплывающая подсказка на кнопке "перейти на 1-ю"
  public static readonly butToFirstPageTitle: Record<string, string> = {
    'rus': 'перейти на 1-ю страницу',
    'eng': 'go to the 1st page' };

  // всплывающая подсказка на кнопке "перейти на предыдущую"
  public static readonly butPreviousTitle: Record<string, string> = {
    'rus': 'перейти на предыдущую страницу',
    'eng': 'go to the previous page' };

  // значение кнопки "перейти на предыдущую"
  public static readonly butPreviousValue: Record<string, string> = {
    'rus': 'назад',
    'eng': 'previous' };

  // всплывающая подсказка на кнопке "текущая страница"
  public static readonly butCurrentPageTitle: Record<string, string> = {
    'rus': 'текущая страница',
    'eng': 'current page' };

  // всплывающая подсказка на кнопке "перейти на следующую"
  public static readonly butNextTitle: Record<string, string> = {
    'rus': 'перейти на следующую страницу',
    'eng': 'go to the next page' };

  // значение кнопки "перейти на следующую"
  public static readonly butNextValue: Record<string, string> = {
    'rus': 'вперед',
    'eng': 'next' };

  // всплывающая подсказка на кнопке "перейти на последнюю"
  public static readonly butToLastPageTitle: Record<string, string> = {
    'rus': 'перейти на последнюю страницу',
    'eng': 'go to the last page' };

  // заголовок страницы "в разработке"
  public static readonly pageUnderDevelopmentTitle: Record<string, string> = {
    'rus': 'Страница в разработке',
    'eng': 'The page is under development' };

  // заголовок списка выбора категории услуг салона
  public static readonly labelServicesCategory: Record<string, string> = {
    'rus': 'Категория услуг',
    'eng': 'Service category' };

  // первый элемент списка выбора категории услуг салона
  public static readonly firstOptionServicesCategories: Record<string, string> = {
    'rus': 'выберите категорию услуг...',
    'eng': 'select a service category...' };

  // заголовок поля ввода наименования услуги салона
  public static readonly labelService: Record<string, string> = {
    'rus': 'Услуга',
    'eng': 'Service' };

  // заголовок поля ввода минимальной цены на услугу
  public static readonly labelPriceMin: Record<string, string> = {
    'rus': 'Мин. цена',
    'eng': 'Min. price' };

  // заголовок поля ввода максимальной цены на услугу
  public static readonly labelPriceMax: Record<string, string> = {
    'rus': 'Макс. цена',
    'eng': 'Max. price' };

  // всплывающая подсказка на фрагменте отображения цены услуги
  public static readonly labelPriceTitle: Record<string, string> = {
    'rus': 'цена услуги',
    'eng': 'service price' };

  // значение фрагмента отображения цены услуги
  public static readonly labelPriceValue: Record<string, string> = {
    'rus': 'цена',
    'eng': 'price' };

  // всплывающая подсказка на фрагменте отображения минимальной цены услуги
  public static readonly labelMinPriceTitle: Record<string, string> = {
    'rus': 'минимальная цена услуги',
    'eng': 'minimum service price' };

  // значение фрагмента отображения минимальной цены услуги
  public static readonly labelMinPriceValue: Record<string, string> = {
    'rus': 'мин.цена',
    'eng': 'min.price' };

  // всплывающая подсказка на фрагменте отображения максимальной цены услуги
  public static readonly labelMaxPriceTitle: Record<string, string> = {
    'rus': 'максимальная цена услуги',
    'eng': 'maximum service price' };

  // значение фрагмента отображения максимальной цены услуги
  public static readonly labelMaxPriceValue: Record<string, string> = {
    'rus': 'макс.цена',
    'eng': 'max.price' };

  // заголовок поля ввода длительности услуги
  public static readonly labelDuration: Record<string, string> = {
    'rus': 'Длительность, мин.',
    'eng': 'Duration, minutes' };

  // всплывающая подсказка на фрагменте отображения длительности услуги
  public static readonly labelDurationTitle: Record<string, string> = {
    'rus': 'длительность услуги',
    'eng': 'service duration' };

  // значение фрагмента отображения длительности услуги
  public static readonly labelDurationValue: Record<string, string> = {
    'rus': 'мин.',
    'eng': 'min.' };

  // заголовок поля ввода текста комментария
  public static readonly labelComment: Record<string, string> = {
    'rus': 'Комментарий',
    'eng': 'Comment' };

  // заголовок поля ввода специальности
  public static readonly labelSpecialization: Record<string, string> = {
    'rus': 'Специальность',
    'eng': 'Specialization' };

  // заголовок поля ввода должности
  public static readonly labelPosition: Record<string, string> = {
    'rus': 'Должность',
    'eng': 'Position' };

  // заголовок поля ввода рейтинга
  public static readonly labelRating: Record<string, string> = {
    'rus': 'Рейтинг',
    'eng': 'Rating' };

  // значение кнопки "показать расписание"
  public static readonly butScheduleValue: Record<string, string> = {
    'rus': 'расписание',
    'eng': 'schedule' };

  // значение кнопки "показать услуги"
  public static readonly butServicesValue: Record<string, string> = {
    'rus': 'услуги',
    'eng': 'services' };

  // первый элемент списка выбора специальности сотрудника
  public static readonly firstOptionSpecializations: Record<string, string> = {
    'rus': 'выберите специальность...',
    'eng': 'select a specialization...' };

  // первый элемент списка выбора должности сотрудника
  public static readonly firstOptionPositions: Record<string, string> = {
    'rus': 'выберите должность...',
    'eng': 'select a position...' };

  // всплывающая подсказка на кнопке "показать все услуги"
  public static readonly butShowAllServicesTitle: Record<string, string> = {
    'rus': 'показать все услуги',
    'eng': 'show all services' };

  // всплывающая подсказка на кнопке "скрыть все услуги"
  public static readonly butCloseAllServicesTitle: Record<string, string> = {
    'rus': 'скрыть все услуги',
    'eng': 'close all services' };

  // всплывающая подсказка на кнопке "предыдущая неделя"
  public static readonly butPreviousWeekTitle: Record<string, string> = {
    'rus': 'предыдущая неделя',
    'eng': 'previous week' };

  // всплывающая подсказка на кнопке "следующая неделя"
  public static readonly butNextWeekTitle: Record<string, string> = {
    'rus': 'следующая неделя',
    'eng': 'next week' };

  // всплывающая подсказка поля отображения дня недели "понедельник"
  public static readonly labelMondayTitle: Record<string, string> = {
    'rus': 'понедельник',
    'eng': 'monday' };

  // значение поля отображения дня недели "понедельник"
  public static readonly labelMondayValue: Record<string, string> = {
    'rus': 'Пн',
    'eng': 'Mo' };

  // значение поля отображения дня недели "вторник"
  public static readonly labelTuesdayTitle: Record<string, string> = {
    'rus': 'вторник',
    'eng': 'tuesday' };

  // значение поля отображения дня недели "вторник"
  public static readonly labelTuesdayValue: Record<string, string> = {
    'rus': 'Вт',
    'eng': 'Tu' };

  // значение поля отображения дня недели "среда"
  public static readonly labelWednesdayTitle: Record<string, string> = {
    'rus': 'среда',
    'eng': 'wednesday' };

  // значение поля отображения дня недели "среда"
  public static readonly labelWednesdayValue: Record<string, string> = {
    'rus': 'Ср',
    'eng': 'We' };

  // значение поля отображения дня недели "четверг"
  public static readonly labelThursdayTitle: Record<string, string> = {
    'rus': 'четверг',
    'eng': 'thursday' };

  // значение поля отображения дня недели "четверг"
  public static readonly labelThursdayValue: Record<string, string> = {
    'rus': 'Чт',
    'eng': 'Th' };

  // значение поля отображения дня недели "пятница"
  public static readonly labelFridayTitle: Record<string, string> = {
    'rus': 'пятница',
    'eng': 'friday' };

  // значение поля отображения дня недели "пятница"
  public static readonly labelFridayValue: Record<string, string> = {
    'rus': 'Пт',
    'eng': 'Fr' };

  // значение поля отображения дня недели "суббота"
  public static readonly labelSaturdayTitle: Record<string, string> = {
    'rus': 'суббота',
    'eng': 'saturday' };

  // значение поля отображения дня недели "суббота"
  public static readonly labelSaturdayValue: Record<string, string> = {
    'rus': 'Сб',
    'eng': 'Sa' };

  // значение поля отображения дня недели "воскресенье"
  public static readonly labelSundayTitle: Record<string, string> = {
    'rus': 'воскресенье',
    'eng': 'sunday' };

  // значение поля отображения дня недели "воскресенье"
  public static readonly labelSundayValue: Record<string, string> = {
    'rus': 'Вс',
    'eng': 'Su' };

  // значение заголовка чек-бокса выбора признака рабочего дня для выходного дня
  public static readonly labelCheckboxWeekend: Record<string, string> = {
    'rus': 'выходной',
    'eng': 'weekend' };

  // значение заголовка чек-бокса выбора признака рабочего дня для рабочего дня
  public static readonly labelCheckboxWorkingDay: Record<string, string> = {
    'rus': 'рабочий',
    'eng': 'working day' };

  // заголовок поля выбора времени начала рабочего дня сотрудника
  public static readonly labelWorkDayStartTime: Record<string, string> = {
    'rus': 'начало работы',
    'eng': 'start of work' };

  // заголовок поля выбора времени окончания рабочего дня сотрудника
  public static readonly labelWorkDayEndTime: Record<string, string> = {
    'rus': 'конец работы',
    'eng': 'end of work' };

  // значение фрагмента заголовка
  public static readonly labelFrom: Record<string, string> = {
    'rus': 'с',
    'eng': 'from' };

  // всплывающая подсказка на кнопке "изменить параметры"
  public static readonly butEditParamsTitle: Record<string, string> = {
    'rus': 'изменить параметры',
    'eng': 'change parameters' };

  //endregion

} // class Resources
// ----------------------------------------------------------------------------
