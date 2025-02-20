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

  // 7. url для загрузки изображения
  public static readonly urlUploadTempUserPhoto: string =
    `${this.urlHost}/upload/tempUserPhoto`;

  // 8. url для удаления временной папки
  // со всеми временными фотографиями пользователя
  public static readonly urlDeleteTempUserPhotos: string =
    `${this.urlHost}/profile/deleteTempUserPhotos`;

  // 9. url для удаления данных о пользователе
  public static readonly urlDeleteUser: string =
    `${this.urlHost}/profile/deleteUser`;



  // адрес хоста
  // для package.json - "start": "ng serve --host 192.168.1.83",
  // private static readonly _urlHost: string = 'http://192.168.1.83:5263';
  //private static readonly _urlHost: string = 'http://localhost:5263';

  // 1. url для получения данных из таблицы "СТРАНЫ" (Countries) от сервера
  public static readonly urlGetAllCountriesByPage: string =
    `${this.urlHost}/api/countries/getAll`;

  // 2. url для получения данных из таблицы "ЦЕЛИ" (Purposes) от сервера
  public static readonly urlGetAllPurposesByPage: string =
    `${this.urlHost}/api/purposes/getAll`;

  // 3. url для получения данных из таблицы "ПЕРСОНЫ" (People) от сервера
  public static readonly urlGetAllPeopleByPage: string =
    `${this.urlHost}/api/people/getAll`;

  // 4. url для получения данных из таблицы "КЛИЕНТЫ" (Clients) от сервера
  public static readonly urlGetAllClientsByPage: string =
    `${this.urlHost}/api/clients/getAll`;

  // 5. url для получения данных из таблицы "МАРШРУТЫ" (Routes) от сервера
  public static readonly urlGetAllRoutesByPage: string =
    `${this.urlHost}/api/routes/getAll`;

  // 6. url для получения данных из таблицы "ПОЕЗДКИ" (Trips) от сервера
  public static readonly urlGetAllTripsByPage: string =
    `${this.urlHost}/api/trips/getAll`;


  // запросы

  // 7. url для получения данных о параметрах запроса №1 от сервера
  public static readonly urlGetQuery01Params: string =
    `${this.urlHost}/api/purposes/getQuery01Params`;

  // 8. url для получения результатов запроса №1 от сервера
  public static readonly urlQuery01: string =
    `${this.urlHost}/api/routes/query01`;

  // 9. url для получения данных о параметрах запроса №2 от сервера
  public static readonly urlGetQuery02Params: string =
    `${this.urlHost}/api/purposes/getQuery02Params`;

  // 10. url для получения результатов запроса №2 от сервера
  public static readonly urlQuery02: string =
    `${this.urlHost}/api/routes/query02`;

  // 11. url для получения данных о параметрах запроса №3 от сервера
  public static readonly urlGetQuery03Params: string =
    `${this.urlHost}/api/trips/getQuery03Params`;

  // 12. url для получения результатов запроса №3 от сервера
  public static readonly urlQuery03: string =
    `${this.urlHost}/api/trips/query03`;

  // 13. url для получения результатов запроса №4 от сервера
  public static readonly urlQuery04: string =
    `${this.urlHost}/api/trips/query04`;

  // 14. url для получения результатов запроса №5 от сервера
  public static readonly urlQuery05: string =
    `${this.urlHost}/api/trips/query05`;


  // добавление/изменение/удаление записей таблиц БД

  // таблица "КЛИЕНТЫ"

  // 15. url для получения параметров формы добавления/изменения
  // сведений о клиенте из БД от сервера
  public static readonly urlGetClientFormParams: string =
    `${this.urlHost}/api/clients/getClientFormParams`;

  // 16. url для добавления на сервере новой записи в таблицу "КЛИЕНТЫ" БД
  public static readonly urlCreatingClient: string =
    `${this.urlHost}/api/clients/createClient`;

  // 17. url для изменения на сервере выбранной записи в таблице "КЛИЕНТЫ" БД
  public static readonly urlEditingClient: string =
    `${this.urlHost}/api/clients/editClient`;

  // 18. url для удаления на сервере выбранной записи в таблице "КЛИЕНТЫ" БД
  public static readonly urlDeletingClient: string =
    `${this.urlHost}/api/clients/deleteClient`;

  // таблица "ПОЕЗДКИ"

  // 19. url для получения параметров формы добавления/изменения
  // сведений о поездке из БД от сервера
  public static readonly urlGetTripFormParams: string =
    `${this.urlHost}/api/trips/getTripFormParams`;

  // 20. url для добавления на сервере новой записи в таблицу "ПОЕЗДКИ" БД
  public static readonly urlCreatingTrip: string =
    `${this.urlHost}/api/trips/createTrip`;

  // 21. url для изменения на сервере выбранной записи в таблице "ПОЕЗДКИ" БД
  public static readonly urlEditingTrip: string =
    `${this.urlHost}/api/trips/editTrip`;

  // 22. url для удаления на сервере выбранной записи в таблице "ПОЕЗДКИ" БД
  public static readonly urlDeletingTrip: string =
    `${this.urlHost}/api/trips/deleteTrip`;

} // class Config
// ----------------------------------------------------------------------------
