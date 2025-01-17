import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Client} from './Client';
import {Trip} from './Trip';
import {Utils} from '../infrastructure/Utils';

@Injectable({
  providedIn: 'root'
})
export class WebApiService2 {

  // конструктор с DI для http-сервиса
  constructor(private _http: HttpClient) {
  } // constructor


  // GET-запрос без параметров на удалённый сервер для получения данных
  get(url: string): Observable<any> {
    return this._http.get<any>(url);
  } // get


  // GET-запрос на удалённый сервер для получения части коллекции
  // записей заданной таблицы из БД на заданной странице
  getAllByPage(url: string, page: number): Observable<any> {
    return this._http.get<any>(url, {
      params: new HttpParams().set('page', page)
    });
  } // getAllByPage


  // PUT-запрос на удалённый сервер для
  // получения результатов запроса №1
  putQuery01(url: string, purposeId: number): Observable<any> {
    return this._http.put<any>(url, new HttpParams().set('purposeId', purposeId));
  } // putQuery01


  // PUT-запрос на удалённый сервер для
  // получения результатов запроса №2
  putQuery02(url: string, purposeId: number, transportCost: number): Observable<any> {
    return this._http.put<any>(
      url,
      new HttpParams()
        .set('purposeId', purposeId)
        .set('transportCost', transportCost)
    ); // put
  } // putQuery02


  // PUT-запрос на удалённый сервер для
  // получения результатов запроса №3
  putQuery03(url: string, amountDays: number): Observable<any> {
    return this._http.put<any>(url, new HttpParams().set('amountDays', amountDays));
  } // putQuery03


  // PUT-запрос на удалённый сервер для
  // получения результатов запроса №4
  putQuery04(url: string): Observable<any> {
    return this._http.put<any>(url, new HttpParams());
  } // putQuery04


  // PUT-запрос на удалённый сервер для
  // получения результатов запроса №5
  putQuery05(url: string): Observable<any> {
    return this._http.put<any>(url, new HttpParams());
  } // putQuery05


  // POST-запрос на удалённый сервер для получения параметров
  // формы добавления/изменения сведений о клиенте
  getClientFormParams(url: string, clientId: number): Observable<any> {
    return this._http.post<any>(url, new HttpParams().set('clientId', clientId));
  } // getClientFormParams


  // PUT-запрос на удалённый сервер для
  // добавления новой записи в таблицу "КЛИЕНТЫ" БД
  addClient(url: string, client: Client): Observable<any> {
    return this._http.put<any>(url,
      new HttpParams()
        .set('id', client.id)
        .set('surname', client.surname)
        .set('name', client.name)
        .set('patronymic', client.patronymic)
        .set('passport', client.passport)
    );
  } // addClient


  // POST-запрос на удалённый сервер для
  // изменения выбранной записи в таблице "КЛИЕНТЫ" БД
  editClient(url: string, client: Client): Observable<any> {
    return this._http.post<any>(url,
      new HttpParams()
        .set('id', client.id)
        .set('surname', client.surname)
        .set('name', client.name)
        .set('patronymic', client.patronymic)
        .set('passport', client.passport)
    );
  } // editClient


  // DELETE-запрос на удалённый сервер для
  // удаления выбранной записи в таблице "КЛИЕНТЫ" БД
  deleteClientById(url: string, clientId: number): Observable<any> {
    return this._http.delete<any>(url, {
      params: new HttpParams().set('clientId', clientId)
    });
  } // deleteClientById


  // POST-запрос на удалённый сервер для получения параметров
  // формы добавления/изменения сведений о поездке
  getTripFormParams(url: string, tripId: number): Observable<any> {
    return this._http.post<any>(url, new HttpParams().set('tripId', tripId));
  } // getTripFormParams


  // PUT-запрос на удалённый сервер для
  // добавления новой записи в таблицу "ПОЕЗДКИ" БД
  addTrip(url: string, trip: Trip): Observable<any> {
    return this._http.put<any>(url,
      new HttpParams()
        .set('tripId', trip.id)
        // дату требуется передавать в виде строки
        .set('startDateString', Utils.dateToString(trip.startDate))
        .set('clientId', trip.client.id)
        .set('routeId', trip.route.id)
        .set('amountDays', trip.amountDays)
    );
  } // addTrip


  // POST-запрос на удалённый сервер для
  // изменения выбранной записи в таблице "ПОЕЗДКИ" БД
  editTrip(url: string, trip: Trip): Observable<any> {
    return this._http.post<any>(url,
      new HttpParams()
        .set('tripId', trip.id)
        // дату требуется передавать в виде строки
        .set('startDateString', Utils.dateToString(trip.startDate))
        .set('clientId', trip.client.id)
        .set('routeId', trip.route.id)
        .set('amountDays', trip.amountDays)
    );
  } // editTrip


  // DELETE-запрос на удалённый сервер для
  // удаления выбранной записи в таблице "ПОЕЗДКИ" БД
  deleteTripById(url: string, tripId: number): Observable<any> {
    return this._http.delete<any>(url, {
      params: new HttpParams().set('tripId', tripId)
    });
  } // deleteTripById

} // class WebApiService2
