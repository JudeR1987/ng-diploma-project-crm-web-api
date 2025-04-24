// ----------------------------------------------------------------------------
// класс с адресами запросов
// ----------------------------------------------------------------------------
export class Config {

  // адрес хоста
  public static readonly urlHost: string = 'http://localhost:5297';

  // 1. url для входа в систему
  public static readonly urlAuthLogin: string =
    `${this.urlHost}/api/auth/login`;

  // 2. url для выхода из системы
  public static readonly urlAuthLogOut: string =
    `${this.urlHost}/api/auth/logout`;

  // 3. url для обновления jwt-токена
  public static readonly urlAuthRefresh: string =
    `${this.urlHost}/api/auth/refresh`;

  // 4. url для регистрации в системе
  public static readonly urlAuthRegistration: string =
    `${this.urlHost}/api/auth/registration`;

  // 5. url для изменения данных о пользователе
  public static readonly urlEditUser: string =
    `${this.urlHost}/profile/editUser`;

  // 6. url для изменения пароля пользователя
  public static readonly urlEditPassword: string =
    `${this.urlHost}/profile/editPassword`;

  // 7. url для загрузки изображения временной фотографии пользователя
  public static readonly urlUploadTempUserPhoto: string =
    `${this.urlHost}/upload/tempUserPhoto`;

  // 8. url для удаления временной папки
  // со всеми временными фотографиями пользователя
  public static readonly urlDeleteTempUserPhotos: string =
    `${this.urlHost}/profile/deleteTempUserPhotos`;

  // 9. url для удаления данных о пользователе
  public static readonly urlDeleteUser: string =
    `${this.urlHost}/profile/deleteUser`;


  // 10. url для получения данных из таблицы "КОМПАНИИ" (Companies) от сервера
  /*public static readonly urlGetAllCountriesByPage: string =
    `${this.urlHost}/api/countries/getAll`;*/
  public static readonly urlGetAllCompanies: string =
    `${this.urlHost}/api/companies/getAll`;

  // 11. url для добавления на сервере новой записи в таблицу "КОМПАНИИ" БД
  public static readonly urlCreateCompany: string =
    `${this.urlHost}/api/companies/createCompany`;

  // 12. url для изменения на сервере выбранной записи в таблице "КОМПАНИИ" БД
  public static readonly urlEditCompany: string =
    `${this.urlHost}/api/companies/editCompany`;

  // 13. url для загрузки временного изображения компании
  public static readonly urlUploadTempCompanyImage: string =
    `${this.urlHost}/upload/tempCompanyImage`;

  // 14. url для получения параметров формы создания/изменения сведений о компании
  public static readonly urlGetCompanyFormParams: string =
    `${this.urlHost}/api/companies/getCompanyFormParams`;

  // 15. url для удаления временных папок со всеми временными изображениями компании
  public static readonly urlDeleteTempCompanyImages: string =
    `${this.urlHost}/api/companies/deleteTempCompanyImages`;

  // 16. url для получения данных из таблицы "КОМПАНИИ" (Companies) от сервера,
  // соответствующих параметру идентификатора пользователя
  public static readonly urlGetAllCompaniesByUserId: string =
    `${this.urlHost}/api/companies/getAllByUserId`;

  // 17. url для получения данных о записи о компании по её идентификатору
  // из таблицы "КОМПАНИИ" (Companies) от сервера
  public static readonly urlGetCompanyById: string =
    `${this.urlHost}/api/companies/getById`;

  // 18. url для получения от сервера данных об услугах заданной компании,
  // сгруппированных по категориям
  public static readonly urlGetAllServicesByCompanyIdGroupByCategories: string =
    `${this.urlHost}/api/services/getAllByCompanyIdGroupByCategories`;

  // 19. url для получения данных о записи об услуге по её идентификатору
  // из таблицы "УСЛУГИ" (Services) от сервера
  public static readonly urlGetServiceById: string =
    `${this.urlHost}/api/services/getById`;

  // 20. url для получения данных из таблицы "КАТЕГОРИИ_УСЛУГ" (ServicesCategories) от сервера
  public static readonly urlGetAllServicesCategories: string =
    `${this.urlHost}/api/servicesCategories/getAll`;

  // 21. url для добавления на сервере новой записи в таблицу "УСЛУГИ" БД
  public static readonly urlCreateService: string =
    `${this.urlHost}/api/services/createService`;

  // 22. url для изменения на сервере выбранной записи в таблице "УСЛУГИ" БД
  public static readonly urlEditService: string =
    `${this.urlHost}/api/services/editService`;

  // 23. url для удаления данных об услуге
  public static readonly urlDeleteService: string =
    `${this.urlHost}/api/services/deleteService`;

  // 24. url для получения от сервера данных о сотрудниках заданной компании
  public static readonly urlGetAllEmployeesByCompanyId: string =
    `${this.urlHost}/api/employees/getAllByCompanyId`;

  // 25. url для удаления данных о сотруднике
  public static readonly urlDeleteEmployee: string =
    `${this.urlHost}/api/employees/deleteEmployee`;

  // 26. url для получения данных о записи о сотруднике по его идентификатору
  // из таблицы "СОТРУДНИКИ" (Employees) от сервера
  public static readonly urlGetEmployeeById: string =
    `${this.urlHost}/api/employees/getById`;

  // 27. url для получения параметров формы добавления/изменения данных о сотруднике
  public static readonly urlGetEmployeeFormParams: string =
    `${this.urlHost}/api/employees/getEmployeeFormParams`;

  // 28. url для удаления временной папки со всеми временными фотографиями сотрудника
  public static readonly urlDeleteTempEmployeePhotos: string =
    `${this.urlHost}/api/employees/deleteTempEmployeePhotos`;

  // 29. url для загрузки изображения временной фотографии сотрудника
  public static readonly urlUploadTempEmployeePhoto: string =
    `${this.urlHost}/upload/tempEmployeePhoto`;

  // 30. url для добавления на сервере новой записи в таблицу "СОТРУДНИКИ" БД
  public static readonly urlCreateEmployee: string =
    `${this.urlHost}/api/employees/createEmployee`;

  // 31. url для изменения на сервере выбранной записи в таблице "СОТРУДНИКИ" БД
  public static readonly urlEditEmployee: string =
    `${this.urlHost}/api/employees/editEmployee`;

  // 32. url для получения данных о записи о пользователе по его номеру телефона
  // из таблицы "ПОЛЬЗОВАТЕЛИ" (Users) от сервера
  public static readonly urlGetUserByPhone: string =
    `${this.urlHost}/api/users/getByPhone`;

  // 33. url для получения данных о записи о пользователе по его email
  // из таблицы "ПОЛЬЗОВАТЕЛИ" (Users) от сервера
  public static readonly urlGetUserByEmail: string =
    `${this.urlHost}/api/users/getByEmail`;

  // 34. url для получения данных о записи о сотруднике по идентификатору пользователя
  // из таблицы "СОТРУДНИКИ" (Employees) от сервера
  public static readonly urlGetEmployeeByUserId: string =
    `${this.urlHost}/api/employees/getByUserId`;

  // 35. url для получения от сервера данных об услугах заданного сотрудника
  public static readonly urlGetAllServicesByEmployeeId: string =
    `${this.urlHost}/api/employees/getAllServicesByEmployeeId`;

  // 36. url для добавления данных об услуге заданного сотрудника
  public static readonly urlCreateEmployeeService: string =
    `${this.urlHost}/api/employeesServices/createEmployeeService`;

  // 37. url для удаления данных об услуге заданного сотрудника
  public static readonly urlDeleteEmployeeServiceByEmployeeIdServiceId: string =
    `${this.urlHost}/api/employeesServices/deleteEmployeeServiceByEmployeeIdServiceId`;

  // 38. url для получения рабочих дней сотрудника за заданный период
  public static readonly urlGetAllWorkDaysBreakSlotsByEmployeeIdFromTo: string =
    `${this.urlHost}/api/schedule/getAllWorkDaysBreakSlotsByEmployeeIdFromTo`;

  // 39. url для добавления на сервере новой записи в таблицу "РАСПИСАНИЕ" БД
  public static readonly urlCreateWorkDay: string =
    `${this.urlHost}/api/schedule/createWorkDay`;

  // 40. url для изменения на сервере выбранной записи в таблице "РАСПИСАНИЕ" БД
  public static readonly urlEditWorkDay: string =
    `${this.urlHost}/api/schedule/editWorkDay`;

  // 41. url для получения данных из таблицы "КЛИЕНТЫ" (Clients) от сервера,
  // соответствующих параметру идентификатора компании
  public static readonly urlGetAllClientsByCompanyId: string =
    `${this.urlHost}/api/clients/getAllByCompanyId`;

  // 42. url для получения данных из таблицы "ЗАПИСИ_НА_СЕАНС" (Records) от сервера,
  // соответствующих параметру идентификатора компании
  public static readonly urlGetAllRecordsByCompanyId: string =
    `${this.urlHost}/api/records/getAllByCompanyId`;

  // 43. url для получения данных о сотрудниках по идентификатору компании с заданной
  // услугой из таблицы "СОТРУДНИКИ" (Employees) от сервера
  public static readonly urlGetAllEmployeesByCompanyIdByServiceId: string =
    `${this.urlHost}/api/employees/getAllByCompanyIdByServiceId`;

  // 44. url для получения свободных для записи промежутков
  // времени заданного сотрудника в заданную дату
  public static readonly urlGetAllFreeSlotsByEmployeeIdByDate: string =
    `${this.urlHost}/api/schedule/getAllFreeSlotsByEmployeeIdByDate`;

  // 45. url для добавления на сервере новой записи в таблицу "ЗАПИСИ_НА_СЕАНС" БД
  public static readonly urlCreateOnlineRecord: string =
    `${this.urlHost}/api/records/createOnlineRecord`;


  // адрес хоста (пример)
  // для package.json - "start": "ng serve --host 192.168.1.83",
  // private static readonly _urlHost: string = 'http://192.168.1.83:5263';
  // private static readonly _urlHost: string = 'http://localhost:5263';

} // class Config
// ----------------------------------------------------------------------------
