// ----------------------------------------------------------------------------
// web-сервис - поставщик данных
// ----------------------------------------------------------------------------
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginModel} from '../models/classes/LoginModel';
import {User} from '../models/classes/User';
import {Literals} from '../infrastructure/Literals';

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

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

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
    console.log(`[-WebApiService-LoginModel.LoginModelToDto--`);
    console.dir(LoginModel.LoginModelToDto(loginModel));

    console.log(`--WebApiService-registrationPOST-]`);

    return this._http.post<any>(url, LoginModel.LoginModelToDto(loginModel));
  } // registrationPOST


  // POST-запрос на удалённый сервер для изменения данных о пользователе
  editUserPOST(url: string, user: User, token: string): Observable<any> {

    console.log(`[-WebApiService-editUserPOST--`);
    console.log(`[-WebApiService-user: -*`);
    console.dir(user);
    console.log(`[-WebApiService-token: '${token}' -*`);

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
    console.log(`[-WebApiService-userId: '${userId}' -*`);
    console.log(`[-WebApiService-newPassword: '${newPassword}' -*`);
    console.log(`[-WebApiService-token: '${token}' -*`);

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
  uploadImagePOST(url: string, file: File, userId: number, token: string): Observable<any> {

    console.log(`[-WebApiService-uploadImagePOST--`);
    console.log(`[-WebApiService-file: -*`);
    console.dir(file);
    console.log(`[-WebApiService-userId: '${userId}' -*`);
    console.log(`[-WebApiService-token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    // полезная нагрузка формы
    let formData: FormData = new FormData();

    // добавим в форму данные
    formData.append(Literals.tempPhoto, file);
    //formData.append(Literals.userId, userId);

    console.log(`--WebApiService-uploadImagePOST-]`);

    return this._http.post<any>(
      url,
      formData,
      {
        headers: httpHeaders,
        params: new HttpParams().set(Literals.userId, userId)
      }
    );
  } // uploadImagePOST


  // DELETE-запрос на удалённый сервер для удаления временной
  // папки со всеми временными фотографиями пользователя
  deleteTempUserPhotos(url: string, userId: number, token: string): Observable<any> {

    console.log(`[-WebApiService-deleteTempUserPhotos--`);
    console.log(`[-WebApiService-userId: '${userId}' -*`);
    console.log(`[-WebApiService-token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-deleteTempUserPhotos-]`);

    return this._http.delete<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.userId, userId)
    });
  } // deleteTempUserPhotos


  // DELETE-запрос на удалённый сервер для удаления данных о пользователе
  deleteUser(url: string, userId: number, token: string): Observable<any> {

    console.log(`[-WebApiService-deleteUser--`);
    console.log(`[-WebApiService-userId: '${userId}' -*`);
    console.log(`[-WebApiService-token: '${token}' -*`);

    // заголовок запроса с jwt-токеном
    let httpHeaders: HttpHeaders = this.authNewHttpHeaders(token);

    console.log(`--WebApiService-deleteUser-]`);

    return this._http.delete<any>(url, {
      headers: httpHeaders,
      params: new HttpParams().set(Literals.userId, userId)
    });
  } // deleteUser


  // метод формирования нового заголовка запроса с jwt-токеном
  private authNewHttpHeaders(token: string): HttpHeaders {

    return new HttpHeaders()
      .set(Literals.accept, Literals.applicationJson)
      // передача токена в заголовке
      .set(Literals.authorization, `${Literals.bearer}${Literals.space}${token}`);

  } // authNewHttpHeaders

} // class WebApiService
// ----------------------------------------------------------------------------
