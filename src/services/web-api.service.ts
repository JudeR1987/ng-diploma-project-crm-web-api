// ----------------------------------------------------------------------------
// web-сервис - поставщик данных
// ----------------------------------------------------------------------------
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginModel} from '../models/classes/LoginModel';
import {User} from '../models/classes/User';
import {Literals} from '../infrastructure/Literals';
import {Company} from '../models/classes/Company';
import {Service} from '../models/classes/Service';
import {Employee} from '../models/classes/Employee';
import {EmployeeService} from '../models/classes/EmployeeService';
import {Utils} from '../infrastructure/Utils';
import {DisplayWorkDayBreakSlots} from '../models/classes/DisplayWorkDayBreakSlots';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  // конструктор с DI для http-сервиса
  constructor(private _http: HttpClient) {
    console.log(`[-WebApiService-constructor--`);
    console.log(`--WebApiService-constructor-]`);
  } // constructor


  // GET-запрос без параметров на удалённый сервер для получения данных
  get(url: string, token: string): Observable<any> {
    console.log(`[-WebApiService-get--`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-get-]`);
    return this._http.get<any>(url, { headers: httpHeaders });
  } // get

  // GET-запрос на удалённый сервер для получения данных из БД по идентификатору
  getById(url: string, id: number, token: string): Observable<any> {
    console.log(`[-WebApiService-getById--`);

    console.log(`*- id: '${id}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-getById-]`);
    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.id, id)
    });
  } // getById

  // GET-запрос на удалённый сервер для получения части коллекции
  // записей заданной таблицы из БД на заданной странице
  getAllByPage(url: string, page: number, token: string): Observable<any> {
    console.log(`[-WebApiService-getAllByPage--`);

    console.log(`*- page: '${page}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-getAllByPage-]`);
    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.page, page)
    });
  } // getAllByPage

  // GET-запрос на удалённый сервер для получения части коллекции
  // записей заданной таблицы из БД на заданной странице,
  // соответствующих параметру с заданным идентификатором
  getAllByIdByPage(url: string, id: number, page: number, token: string): Observable<any> {
    console.log(`[-WebApiService-getAllByIdByPage--`);

    console.log(`*- id: '${id}' -*`);
    console.log(`*- page: '${page}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-getAllByIdByPage-]`);
    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.id, id)
        .set(Literals.page, page)
    });
  } // getAllByIdByPage

  // GET-запрос на удалённый сервер для получения части данных из БД
  // по идентификатору за заданный период времени
  getAllByIdFromTo(url: string, id: number, firstDay: Date, lastDay: Date, token: string): Observable<any> {
    console.log(`[-WebApiService-getAllByIdFromTo--`);

    console.log(`*- id: '${id}' -*`);
    console.log(`*- firstDay: '${Utils.dateToString(firstDay)}' -*`);
    console.log(`*- lastDay: '${Utils.dateToString(lastDay)}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-getAllByIdFromTo-]`);
    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.id, id)
        // дату передаём в виде строки формата YYYY-MM-dd
        .set(Literals.firstDateString, Utils.dateToString(firstDay))
        .set(Literals.secondDateString, Utils.dateToString(lastDay))
    });
  } // getAllByIdFromTo

  // GET-запрос на удалённый сервер для получения
  // данных о пользователе из БД по номеру телефона
  getUserByPhone(url: string, phone: string, token: string): Observable<any> {
    console.log(`[-WebApiService-getUserByPhone--`);

    console.log(`*- phone: '${phone}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-getUserByPhone-]`);
    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.phone, phone)
    });
  } // getUserByPhone

  // GET-запрос на удалённый сервер для получения
  // данных о пользователе из БД по email
  getUserByEmail(url: string, email: string, token: string): Observable<any> {
    console.log(`[-WebApiService-getUserByEmail--`);

    console.log(`*- email: '${email}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-getUserByEmail-]`);
    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.email, email)
    });
  } // getUserByEmail


  // DELETE-запрос на удалённый сервер для удаления данных по идентификатору
  deleteById(url: string, id: number, token: string): Observable<any> {
    console.log(`[-WebApiService-deleteById--`);

    console.log(`*- id: '${id}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-deleteById-]`);
    return this._http.delete<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.id, id)
    });
  } // deleteById


  // DELETE-запрос на удалённый сервер для удаления данных по двум идентификаторам
  deleteByFirstIdSecondId(url: string, firstId: number, secondId: number, token: string): Observable<any> {
    console.log(`[-WebApiService-deleteByFirstIdSecondId--`);

    console.log(`*- firstId: '${firstId}' -*`);
    console.log(`*- secondId: '${secondId}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-deleteByFirstIdSecondId-]`);
    return this._http.delete<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.firstId, firstId)
        .set(Literals.secondId, secondId)
    });
  } // deleteByFirstIdSecondId


  // POST-запрос на удалённый сервер для входа в систему
  loginPOST(url: string, loginModel: LoginModel): Observable<any> {
    console.log(`[-WebApiService-loginPOST--`);

    console.log(`--WebApiService-loginPOST-]`);
    return this._http.post<any>(url, LoginModel.LoginModelToDto(loginModel));
  } // loginPOST

  // POST-запрос на удалённый сервер для выхода из системы
  logOutPOST(url: string, user: User): Observable<any> {
    console.log(`[-WebApiService-logOutPOST--`);

    console.log(`--WebApiService-logOutPOST-]`);
    return this._http.post<any>(
      url,
      { userId: user.id, userToken: user.userToken, isLogin: user.isLogin }
    );
  } // logOutPOST

  // POST-запрос на удалённый сервер для обновления jwt-токена
  refreshPOST(url: string, user: User): Observable<any> {
    console.log(`[-WebApiService-refreshPOST--`);

    console.log(`--WebApiService-refreshPOST-]`);
    return this._http.post<any>(
      url, { userId: user.id, userToken: user.userToken }
    );
  } // refreshPOST

  // POST-запрос на удалённый сервер для регистрации в системе
  registrationPOST(url: string, loginModel: LoginModel): Observable<any> {
    console.log(`[-WebApiService-registrationPOST--`);

    console.log(`*- LoginModel.LoginModelToDto -*`);
    console.dir(LoginModel.LoginModelToDto(loginModel));

    console.log(`--WebApiService-registrationPOST-]`);
    return this._http.post<any>(url, LoginModel.LoginModelToDto(loginModel));
  } // registrationPOST


  // POST-запрос на удалённый сервер для изменения данных о пользователе
  editUserPOST(url: string, user: User, token: string): Observable<any> {
    console.log(`[-WebApiService-editUserPOST--`);

    console.log(`*- user: -*`);
    console.dir(user);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-editUserPOST-]`);
    return this._http.post<any>(
      url,
      //User.UserToDto(user),
      new HttpParams()
        .set(Literals.userId,   user.id)
        .set(Literals.userName, user.userName)
        .set(Literals.phone,    user.phone)
        .set(Literals.email,    user.email)
        .set(Literals.avatar,   user.avatar),
      { headers: httpHeaders }
    );
  } // editUserPOST

  // POST-запрос на удалённый сервер для смены пароля пользователя
  editPasswordPOST(url: string, userId: number, newPassword: string, token: string): Observable<any> {
    console.log(`[-WebApiService-editPasswordPOST--`);

    console.log(`*- userId: '${userId}' -*`);
    console.log(`*- newPassword: '${newPassword}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-editPasswordPOST-]`);
    return this._http.post<any>(
      url,
      new HttpParams()
        .set(Literals.userId, userId)
        .set(Literals.newPassword, newPassword),
      { headers: httpHeaders }
    );
  } // editPasswordPOST


  // POST-запрос на удалённый сервер для загрузки файла с изображением
  uploadImagePOST(
    url: string, file: File, userId: number, id: number,
    tempDir: string, imageType: string, token: string): Observable<any> {
    console.log(`[-WebApiService-uploadImagePOST--`);

    console.log(`*- file: -*`);
    console.dir(file);
    console.log(`*- userId: '${userId}' -*`);
    console.log(`*- id: '${id}' -*`); // используется для разных сущностей (companyId, employeeId и т.д.)
    console.log(`*- tempDir: '${tempDir}' -*`);
    console.log(`*- imageType: '${imageType}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    // полезная нагрузка формы
    let formData: FormData = new FormData();

    // добавим в форму данные
    formData.append(Literals.tempImage, file);

    console.log(`--WebApiService-uploadImagePOST-]`);
    return this._http.post<any>(
      url,
      formData,
      {
        headers: httpHeaders,
        params: new HttpParams()
          .set(Literals.userId, userId)
          .set(Literals.id, id)
          .set(Literals.tempDir, tempDir)
          .set(Literals.imageType, imageType)
      }
    );
  } // uploadImagePOST


  // DELETE-запрос на удалённый сервер для удаления
  // папок со всеми временными изображениями
  deleteTempImages(
    url: string, userId: number, id: number,
    imageType: string, token: string): Observable<any> {
    console.log(`[-WebApiService-deleteTempImages--`);

    console.log(`*- userId: '${userId}' -*`);
    console.log(`*- id: '${id}' -*`); // используется для разных сущностей (companyId, employeeId и т.д.)
    console.log(`*- imageType: '${imageType}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-deleteTempImages-]`);
    return this._http.delete<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.userId, userId)
        .set(Literals.id, id)
        .set(Literals.imageType, imageType)
    });
  } // deleteTempImages


  // DELETE-запрос на удалённый сервер для удаления данных о пользователе
  /*deleteUser(url: string, userId: number, token: string): Observable<any> {
    console.log(`[-WebApiService-deleteUser--`);

    console.log(`*- userId: '${userId}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-deleteUser-]`);
    return this._http.delete<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.userId, userId)
    });
  } // deleteUser*/


  // GET-запрос на удалённый сервер для получения части коллекции         // ЭТО getAllByIdByPage
  // записей таблицы "КОМПАНИИ" из БД на заданной странице,
  // соответствующих параметру идентификатора пользователя
  /*getAllCompaniesByUserIdByPage(
    url: string, userId: number, page: number, token: string): Observable<any> {
    console.log(`[-WebApiService-getAllCompaniesByUserIdByPage--`);

    console.log(`*- userId: '${userId}' -*`);
    console.log(`*- page: '${page}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-getAllCompaniesByUserIdByPage-]`);
    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.userId, userId)
        .set(Literals.page, page)
    });
  } // getAllCompaniesByUserIdByPage*/


  // PUT-запрос на удалённый сервер для создания новой записи в таблице "КОМПАНИИ" БД
  createCompanyPUT(url: string, company: Company, token: string): Observable<any> {
    console.log(`[-WebApiService-createCompanyPUT--`);

    console.log(`*- company: -*`);
    console.dir(company);
    console.dir(Company.CompanyToDto(company));
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-createCompanyPUT-]`);
    return this._http.put<any>(
      url,
      Company.CompanyToDto(company),
      { headers: httpHeaders }
    );
  } // createCompanyPUT

  // POST-запрос на удалённый сервер для изменения
  // на сервере выбранной записи в таблице "КОМПАНИИ" БД
  editCompanyPOST(url: string, company: Company, token: string): Observable<any> {
    console.log(`[-WebApiService-editCompanyPOST--`);

    console.log(`*- company: -*`);
    console.dir(company);
    console.dir(Company.CompanyToDto(company));
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-editCompanyPOST-]`);
    return this._http.post<any>(
      url,
      Company.CompanyToDto(company),
      { headers: httpHeaders }
    );
  } // editCompanyPOST


  // PUT-запрос на удалённый сервер для создания новой записи в таблице "УСЛУГИ" БД
  createServicePUT(url: string, service: Service, token: string): Observable<any> {
    console.log(`[-WebApiService-createServicePUT--`);

    console.log(`*- service: -*`);
    console.dir(service);
    console.dir(Service.ServiceToDto(service));
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-createServicePUT-]`);
    return this._http.put<any>(
      url,
      Service.ServiceToDto(service),
      { headers: httpHeaders }
    );
  } // createServicePUT

  // POST-запрос на удалённый сервер для изменения
  // на сервере выбранной записи в таблице "УСЛУГИ" БД
  editServicePOST(url: string, service: Service, token: string): Observable<any> {
    console.log(`[-WebApiService-editServicePOST--`);

    console.log(`*- service: -*`);
    console.dir(service);
    console.dir(Service.ServiceToDto(service));
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-editServicePOST-]`);
    return this._http.post<any>(
      url,
      Service.ServiceToDto(service),
      { headers: httpHeaders }
    );
  } // editServicePOST


  // PUT-запрос на удалённый сервер для создания новой записи в таблице "СОТРУДНИКИ" БД
  createEmployeePUT(url: string, employee: Employee, token: string): Observable<any> {
    console.log(`[-WebApiService-createEmployeePUT--`);

    console.log(`*- employee: -*`);
    console.dir(employee);
    console.dir(Employee.EmployeeToDto(employee));
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-createEmployeePUT-]`);
    return this._http.put<any>(
      url,
      Employee.EmployeeToDto(employee),
      { headers: httpHeaders }
    );
  } // createEmployeePUT

  // POST-запрос на удалённый сервер для изменения
  // на сервере выбранной записи в таблице "СОТРУДНИКИ" БД
  editEmployeePOST(url: string, employee: Employee, token: string): Observable<any> {
    console.log(`[-WebApiService-editEmployeePOST--`);

    console.log(`*- employee: -*`);
    console.dir(employee);
    console.dir(Employee.EmployeeToDto(employee));
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-editEmployeePOST-]`);
    return this._http.post<any>(
      url,
      Employee.EmployeeToDto(employee),
      { headers: httpHeaders }
    );
  } // editEmployeePOST


  // PUT-запрос на удалённый сервер для создания новой записи в таблице "СОТРУДНИКИ_УСЛУГИ" БД
  createEmployeeServicePUT(url: string, employeeService: EmployeeService, token: string): Observable<any> {
    console.log(`[-WebApiService-createEmployeeServicePUT--`);

    console.log(`*- employeeService: -*`);
    console.dir(employeeService);
    console.dir(EmployeeService.EmployeeServiceToDto(employeeService));
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-createEmployeeServicePUT-]`);
    return this._http.put<any>(
      url,
      EmployeeService.EmployeeServiceToDto(employeeService),
      { headers: httpHeaders }
    );
  } // createEmployeeServicePUT


  // PUT-запрос на удалённый сервер для создания новой записи в таблице "РАСПИСАНИЕ" БД
  createWorkDayPUT(url: string, displayWorkDayBreakSlots: DisplayWorkDayBreakSlots, token: string): Observable<any> {
    console.log(`[-WebApiService-createWorkDayPUT--`);

    console.log(`*- displayWorkDayBreakSlots: -*`);
    console.dir(displayWorkDayBreakSlots);
    console.dir(DisplayWorkDayBreakSlots.DisplayWorkDayBreakSlotsToDto(displayWorkDayBreakSlots));
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-createWorkDayPUT-]`);
    return this._http.put<any>(
      url,
      DisplayWorkDayBreakSlots.DisplayWorkDayBreakSlotsToDto(displayWorkDayBreakSlots),
      { headers: httpHeaders }
    );
  } // createWorkDayPUT

  // POST-запрос на удалённый сервер для изменения
  // на сервере выбранной записи в таблице "РАСПИСАНИЕ" БД
  editWorkDayPOST(url: string, displayWorkDayBreakSlots: DisplayWorkDayBreakSlots, token: string): Observable<any> {
    console.log(`[-WebApiService-editWorkDayPOST--`);

    console.log(`*- displayWorkDayBreakSlots: -*`);
    console.dir(displayWorkDayBreakSlots);
    console.dir(DisplayWorkDayBreakSlots.DisplayWorkDayBreakSlotsToDto(displayWorkDayBreakSlots));
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-editWorkDayPOST-]`);
    return this._http.post<any>(
      url,
      DisplayWorkDayBreakSlots.DisplayWorkDayBreakSlotsToDto(displayWorkDayBreakSlots),
      { headers: httpHeaders }
    );
  } // editWorkDayPOST


  // метод формирования нового заголовка запроса с jwt-токеном
  private authNewHttpHeaders(token: string): HttpHeaders {

    return new HttpHeaders()
      .set(Literals.accept, Literals.applicationJson)
      // передача токена в заголовке
      .set(Literals.authorization, `${Literals.bearer}${Literals.space}${token}`);

  } // authNewHttpHeaders

} // class WebApiService
// ----------------------------------------------------------------------------
