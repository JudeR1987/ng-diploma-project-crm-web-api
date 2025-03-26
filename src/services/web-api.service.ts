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
    url: string, file: File, userId: number, companyId: number,
    tempDir: string, imageType: string, token: string): Observable<any> {
    console.log(`[-WebApiService-uploadImagePOST--`);

    console.log(`*- file: -*`);
    console.dir(file);
    console.log(`*- userId: '${userId}' -*`);
    console.log(`*- companyId: '${companyId}' -*`);
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
          .set(Literals.companyId, companyId)
          .set(Literals.tempDir, tempDir)
          .set(Literals.imageType, imageType)
      }
    );
  } // uploadImagePOST


  // DELETE-запрос на удалённый сервер для удаления
  // папок со всеми временными изображениями
  deleteTempImages(
    url: string, userId: number, companyId: number,
    imageType: string, token: string): Observable<any> {
    console.log(`[-WebApiService-deleteTempImages--`);

    console.log(`*- userId: '${userId}' -*`);
    console.log(`*- companyId: '${companyId}' -*`);
    console.log(`*- imageType: '${imageType}' -*`);
    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-deleteTempImages-]`);
    return this._http.delete<any>(url, {
      headers: httpHeaders,
      params: new HttpParams()
        .set(Literals.userId, userId)
        .set(Literals.companyId, companyId)
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


  // GET-запрос на удалённый сервер для получения части коллекции
  // записей заданной таблицы из БД на заданной странице
  getAllByPage(url: string, page: number): Observable<any> {
    return this._http.get<any>(url, {
      params: new HttpParams().set(Literals.page, page)
    });
  } // getAllByPage


  // GET-запрос на удалённый сервер для получения всей коллекции
  // записей заданной таблицы из БД
  getAll(url: string, token: string): Observable<any> {
    console.log(`[-WebApiService-getAll--`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-getAll-]`);
    return this._http.get<any>(url, { headers: httpHeaders });
  } // getAll


  // GET-запрос на удалённый сервер для получения части коллекции
  // записей таблицы "КОМПАНИИ" из БД на заданной странице,
  // соответствующих параметру идентификатора пользователя
  getAllCompaniesByUserIdByPage(
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
  } // getAllCompaniesByUserIdByPage


  // GET-запрос на удалённый сервер для получения записи из БД по идентификатору
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
  } // getCompanyFormParams


  // GET-запрос на удалённый сервер для получения
  // параметров формы создания/изменения данных о компании
  getCompanyFormParams(url: string, token: string): Observable<any> {
    console.log(`[-WebApiService-getCompanyFormParams--`);

    console.log(`*- token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-getCompanyFormParams-]`);
    return this._http.get<any>(url, { headers: httpHeaders });
  } // getCompanyFormParams


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


  // метод формирования нового заголовка запроса с jwt-токеном
  private authNewHttpHeaders(token: string): HttpHeaders {

    return new HttpHeaders()
      .set(Literals.accept, Literals.applicationJson)
      // передача токена в заголовке
      .set(Literals.authorization, `${Literals.bearer}${Literals.space}${token}`);

  } // authNewHttpHeaders

} // class WebApiService
// ----------------------------------------------------------------------------
