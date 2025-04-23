import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {ClientTemp} from '../ClientTemp';
import {WebApiService} from '../web-api.service';
import {Utils} from '../../infrastructure/Utils';
import {Config} from '../../infrastructure/Config';
import {TaskButtonComponent} from '../shared/task-button/task-button.component';
import {TableHeaderClientsComponent} from '../../components/clientsTemp/table-header-clientsTemp/table-header-clientsTemp.component';
import {TrClientComponent} from '../../components/clientsTemp/tr-clientTemp/tr-clientTemp.component';

@Component({
  selector: 'app-query03',
  standalone: true,
  imports: [NgIf, TaskButtonComponent, TableHeaderClientsComponent, TrClientComponent],
  templateUrl: './query03.component.html',
  styleUrl: './query03.component.css'
})
export class Query03Component implements OnInit {

  // параметр запроса, получаемый через маршрутизацию:

  // количество дней пребывания клиентов в стране
  public amountDays: number = 0;


  // флаг включения спиннера при ожидании данных с сервера
  public isWaitFlag: boolean = false;

  // флаг отображения кнопок управления в таблице
  public isQueryFlag: boolean = true;

  // заголовок таблицы для отображения
  public displayTitle: string = "";

  // коллекция для получения информации с сервера
  private _clients: ClientTemp[] = [];

  // коллекция для отображения
  public displayClients: ClientTemp[] = [];

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  public route: string = "";


  // конструктор с DI для подключения к WebApiService-сервису получения данных,
  // подключения к данным активного маршрута
  // и подключения к объекту маршрутизатора для получения маршрута
  constructor(private _webApiService: WebApiService,
              private _activatedRoute: ActivatedRoute, private _router: Router) {
    Utils.helloComponent('query03');

    // получить маршрут
    this.route = this._router.url.slice(1, 8);

  } // constructor


  // 0. получение параметров маршрута сразу после загрузки компонента
  // и отправка запроса №3 на сервер
  ngOnInit() {

    // подписка на получение результата перехода по маршруту
    this._activatedRoute.queryParams.subscribe(params => {

      // полученные параметры запроса
      this.amountDays = +params['amountDays'];

      // url для получения данных запроса №3 от сервера
      let url: string = Config.urlQuery03;

      // включение спиннера ожидания данных
      this.isWaitFlag = true;

      // сброс отображаемых данных
      this.displayClients = [];

      // подписка на получение результата запроса №3 к БД
      this._webApiService.putQuery03(url, this.amountDays).subscribe({

        // вызов метода при получении данных
        next: (webResult: {clients: ClientTemp[], amountDays: number}) => {

          // сведения о клиентах, полученные при помощи сервиса
          this._clients = ClientTemp.parseClients(webResult.clients);

          // вывод данных в разметку
          this.show(
            `Клиент${(this._clients.length === 1) ? '' : 'ы'} с количеством
            дней пребывания &laquo;${webResult.amountDays}&raquo;
            ${(this._clients.length === 0) ? ' отсутствуют' : ''}`,
            this._clients
          ); // show

        }, // next

        // вызов метода при обнаружении ошибки в данных
        error: (err: any) => {
          this.displayTitle = 'Ошибка сервера при запросе №3';
          this.isWaitFlag = false;
          console.dir(err);
        } // error

      }); // putQuery03

    }); // queryParams.subscribe

  } // ngOnInit


  // метод вывода коллекции в разметку
  private show(title: string, clients: ClientTemp[]): void {

    this.displayTitle = title;
    this.displayClients = clients;
    this.isWaitFlag = false;

  } // show

} // class Query03Component
