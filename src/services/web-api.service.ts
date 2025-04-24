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
import {Record} from '../models/classes/Record';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  // конструктор с DI для http-сервиса
  constructor(private _http: HttpClient) {
  } // constructor


  // GET-запрос без параметров на удалённый сервер для получения данных
  get(url: string, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.get<any>(url, { headers: httpHeaders });
  } // get

  // GET-запрос на удалённый сервер для получения данных из БД по идентификатору
  getById(url: string, id: number, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.id, id)
    }); // return
  } // getById

  // GET-запрос на удалённый сервер для получения части коллекции
  // записей заданной таблицы из БД на заданной странице
  getAllByPage(url: string, page: number, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.page, page)
    }); // return
  } // getAllByPage

  // GET-запрос на удалённый сервер для получения части коллекции
  // записей заданной таблицы из БД на заданной странице,
  // соответствующих параметру с заданным идентификатором
  getAllByIdByPage(url: string, id: number, page: number, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.id, id)
        .set(Literals.page, page)
    }); // return
  } // getAllByIdByPage

  // GET-запрос на удалённый сервер для получения части данных из БД
  // по идентификатору за заданный период времени
  getAllByIdFromTo(url: string, id: number, firstDay: Date, lastDay: Date, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.id, id)
        // дату передаём в виде строки формата YYYY-MM-dd
        .set(Literals.firstDateString, Utils.dateToString(firstDay))
        .set(Literals.secondDateString, Utils.dateToString(lastDay))
    }); // return
  } // getAllByIdFromTo

  // GET-запрос на удалённый сервер для получения
  // данных о пользователе из БД по номеру телефона
  getUserByPhone(url: string, phone: string, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.phone, phone)
    }); // return
  } // getUserByPhone

  // GET-запрос на удалённый сервер для получения
  // данных о пользователе из БД по email
  getUserByEmail(url: string, email: string, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.email, email)
    }); // return
  } // getUserByEmail

  // GET-запрос на удалённый сервер для получения данных по двум идентификаторам
  getByFirstIdSecondId(url: string, firstId: number, secondId: number, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.get<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.firstId, firstId)
        .set(Literals.secondId, secondId)
    }); // return
  } // getByFirstIdSecondId


  // DELETE-запрос на удалённый сервер для удаления данных по идентификатору
  deleteById(url: string, id: number, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.delete<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.id, id)
    }); // return
  } // deleteById


  // DELETE-запрос на удалённый сервер для удаления данных по двум идентификаторам
  deleteByFirstIdSecondId(url: string, firstId: number, secondId: number, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.delete<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.firstId, firstId)
        .set(Literals.secondId, secondId)
    }); // return
  } // deleteByFirstIdSecondId


  // POST-запрос на удалённый сервер для входа в систему
  loginPOST(url: string, loginModel: LoginModel): Observable<any> {
    return this._http.post<any>(url, LoginModel.LoginModelToDto(loginModel));
  } // loginPOST

  // POST-запрос на удалённый сервер для выхода из системы
  logOutPOST(url: string, user: User): Observable<any> {
    return this._http.post<any>(
      url,
      { userId: user.id, userToken: user.userToken, isLogin: user.isLogin }
    ); // return
  } // logOutPOST

  // POST-запрос на удалённый сервер для обновления jwt-токена
  refreshPOST(url: string, user: User): Observable<any> {
    return this._http.post<any>(
      url, { userId: user.id, userToken: user.userToken }
    ); // return
  } // refreshPOST

  // POST-запрос на удалённый сервер для регистрации в системе
  registrationPOST(url: string, loginModel: LoginModel): Observable<any> {
    return this._http.post<any>(url, LoginModel.LoginModelToDto(loginModel));
  } // registrationPOST


  // POST-запрос на удалённый сервер для изменения данных о пользователе
  editUserPOST(url: string, user: User, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.post<any>(
      url,
      new HttpParams()
        .set(Literals.userId,   user.id)
        .set(Literals.userName, user.userName)
        .set(Literals.phone,    user.phone)
        .set(Literals.email,    user.email)
        .set(Literals.avatar,   user.avatar),
      { headers: httpHeaders }
    ); // return
  } // editUserPOST

  // POST-запрос на удалённый сервер для смены пароля пользователя
  editPasswordPOST(url: string, userId: number, newPassword: string, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.post<any>(
      url,
      new HttpParams()
        .set(Literals.userId, userId)
        .set(Literals.newPassword, newPassword),
      { headers: httpHeaders }
    ); // return
  } // editPasswordPOST


  // POST-запрос на удалённый сервер для загрузки файла с изображением
  // 'id' используется для разных сущностей (companyId, employeeId и т.д.)
  uploadImagePOST(url: string, file: File, userId: number, id: number,
                  tempDir: string, imageType: string, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    // полезная нагрузка формы
    let formData: FormData = new FormData();

    // добавим в форму данные
    formData.append(Literals.tempImage, file);

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
    ); // return
  } // uploadImagePOST


  // DELETE-запрос на удалённый сервер для удаления
  // папок со всеми временными изображениями
  // 'id' используется для разных сущностей (companyId, employeeId и т.д.)
  deleteTempImages(url: string, userId: number, id: number,
                   imageType: string, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.delete<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.userId, userId)
        .set(Literals.id, id)
        .set(Literals.imageType, imageType)
    }); // return
  } // deleteTempImages


  // PUT-запрос на удалённый сервер для создания новой записи в таблице "КОМПАНИИ" БД
  createCompanyPUT(url: string, company: Company, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.put<any>(
      url,
      Company.CompanyToDto(company),
      { headers: httpHeaders }
    ); // return
  } // createCompanyPUT

  // POST-запрос на удалённый сервер для изменения
  // на сервере выбранной записи в таблице "КОМПАНИИ" БД
  editCompanyPOST(url: string, company: Company, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.post<any>(
      url,
      Company.CompanyToDto(company),
      { headers: httpHeaders }
    ); // return
  } // editCompanyPOST


  // PUT-запрос на удалённый сервер для создания новой записи в таблице "УСЛУГИ" БД
  createServicePUT(url: string, service: Service, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.put<any>(
      url,
      Service.ServiceToDto(service),
      { headers: httpHeaders }
    ); // return
  } // createServicePUT

  // POST-запрос на удалённый сервер для изменения
  // на сервере выбранной записи в таблице "УСЛУГИ" БД
  editServicePOST(url: string, service: Service, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.post<any>(
      url,
      Service.ServiceToDto(service),
      { headers: httpHeaders }
    ); // return
  } // editServicePOST


  // PUT-запрос на удалённый сервер для создания новой записи в таблице "СОТРУДНИКИ" БД
  createEmployeePUT(url: string, employee: Employee, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.put<any>(
      url,
      Employee.EmployeeToDto(employee),
      { headers: httpHeaders }
    ); // return
  } // createEmployeePUT

  // POST-запрос на удалённый сервер для изменения
  // на сервере выбранной записи в таблице "СОТРУДНИКИ" БД
  editEmployeePOST(url: string, employee: Employee, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.post<any>(
      url,
      Employee.EmployeeToDto(employee),
      { headers: httpHeaders }
    ); // return
  } // editEmployeePOST


  // PUT-запрос на удалённый сервер для создания новой записи в таблице "СОТРУДНИКИ_УСЛУГИ" БД
  createEmployeeServicePUT(url: string, employeeService: EmployeeService, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.put<any>(
      url,
      EmployeeService.EmployeeServiceToDto(employeeService),
      { headers: httpHeaders }
    ); // return
  } // createEmployeeServicePUT


  // PUT-запрос на удалённый сервер для создания новой записи в таблице "РАСПИСАНИЕ" БД
  createWorkDayPUT(url: string, displayWorkDayBreakSlots: DisplayWorkDayBreakSlots, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.put<any>(
      url,
      DisplayWorkDayBreakSlots.DisplayWorkDayBreakSlotsToDto(displayWorkDayBreakSlots),
      { headers: httpHeaders }
    ); // return
  } // createWorkDayPUT

  // POST-запрос на удалённый сервер для изменения
  // на сервере выбранной записи в таблице "РАСПИСАНИЕ" БД
  editWorkDayPOST(url: string, displayWorkDayBreakSlots: DisplayWorkDayBreakSlots, token: string): Observable<any> {

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    return this._http.post<any>(
      url,
      DisplayWorkDayBreakSlots.DisplayWorkDayBreakSlotsToDto(displayWorkDayBreakSlots),
      { headers: httpHeaders }
    ); // return
  } // editWorkDayPOST


  // POST-запрос на удалённый сервер для создания новой онлайн-записи в таблице "ЗАПИСИ_НА_СЕАНС" БД
  createOnlineRecordPUT(url: string, record: Record): Observable<any> {
    return this._http.put<any>(
      url,
      new HttpParams()
        .set('employeeId', record.employee.id)
        .set('clientName', `${record.client.name}`)
        .set('clientPhone', `${record.client.phone}`)
        .set('clientEmail', `${record.client.email}`)
        .set('dateString', `${Utils.dateToString(record.date)}`)
        .set('timeString', `${record.date.toLocaleTimeString()}`)
        .set('createDateString', `${Utils.dateToString(record.createDate)}`)
        .set('createTimeString', `${record.createDate.toLocaleTimeString()}`)
        .set('length', record.length)
        .set('comment', record.comment === null ? Literals.empty : record.comment)
        .set('attendance', record.attendance)
        .set('isOnline', record.isOnline)
        .set('isPaid', record.isPaid)
    ); // return
  } // createOnlineRecordPUT


  // метод формирования нового заголовка запроса с jwt-токеном
  private authNewHttpHeaders(token: string): HttpHeaders {

    return new HttpHeaders()
      .set(Literals.accept, Literals.applicationJson)
      // передача токена в заголовке
      .set(Literals.authorization, `${Literals.bearer}${Literals.space}${token}`);

  } // authNewHttpHeaders

} // class WebApiService
// ----------------------------------------------------------------------------
