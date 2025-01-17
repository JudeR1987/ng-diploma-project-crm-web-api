import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {Route} from '../../temp/Route';
import {WebApiService} from '../../temp/web-api.service';
import {Utils} from '../../infrastructure/Utils';
import {Config} from '../../infrastructure/Config';
import {TaskButtonComponent} from '../../temp/shared/task-button/task-button.component';
import {TableHeaderRoutesComponent} from '../routes/table-header-routes/table-header-routes.component';
import {TrRouteComponent} from '../routes/tr-route/tr-route.component';

@Component({
  selector: 'app-query01',
  standalone: true,
  imports: [NgIf, TaskButtonComponent, TableHeaderRoutesComponent, TrRouteComponent],
  templateUrl: './query01.component.html',
  styleUrl: './query01.component.css'
})
export class Query01Component implements OnInit {

  // параметр запроса, получаемый через маршрутизацию
  public purposeId: number = 0;

  // флаг включения спиннера при ожидании данных с сервера
  public isWaitFlag: boolean = false;

  // заголовок таблицы для отображения
  public displayTitle: string = "";

  // коллекция для получения информации с сервера
  private _routes: Route[] = [];

  // коллекция для отображения
  public displayRoutes: Route[] = [];

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  public route: string = "";


  // конструктор с DI для подключения к WebApiService-сервису получения данных,
  // подключения к данным активного маршрута
  // и подключения к объекту маршрутизатора для получения маршрута
  constructor(private _webApiService: WebApiService,
              private _activatedRoute: ActivatedRoute, private _router: Router) {
    Utils.helloComponent('query01');

    // получить маршрут
    this.route = this._router.url.slice(1, 8);

  } // constructor


  // 0. получение параметров маршрута сразу после загрузки компонента
  // и отправка запроса №1 на сервер
  ngOnInit() {

    // подписка на получение результата перехода по маршруту
    this._activatedRoute.queryParams.subscribe(params => {

      // полученный параметр запроса
      this.purposeId = +params['purposeId'];

      // url для получения данных запроса №1 от сервера
      let url: string = Config.urlQuery01;

      // включение спиннера ожидания данных
      this.isWaitFlag = true;

      // сброс отображаемых данных
      this.displayRoutes = [];

      // подписка на получение результата запроса №1 к БД
      this._webApiService.putQuery01(url, this.purposeId).subscribe({

        // вызов метода при получении данных
        next: (webResult: {routes: Route[], purposeName: string}) => {

          // сведения о маршрутах, полученные при помощи сервиса
          this._routes = Route.parseRoutes(webResult.routes);

          // вывод данных в разметку
          this.show(
            `Маршрут${(this._routes.length === 1) ? '' : 'ы'} с целью поездки
            &laquo;${webResult.purposeName}&raquo;
            ${(this._routes.length === 0) ? ' отсутствуют' : ''}`,
            this._routes
          ); // show

        }, // next

        // вызов метода при обнаружении ошибки в данных
        error: (err: any) => {
          this.displayTitle = 'Ошибка сервера при запросе №1';
          this.isWaitFlag = false;
          console.dir(err);
        } // error

      }); // putQuery01

    }); // queryParams.subscribe

  } // ngOnInit


  // метод вывода коллекции в разметку
  private show(title: string, routes: Route[]): void {

    this.displayTitle = title;
    this.displayRoutes = routes;
    this.isWaitFlag = false;

  } // show

} // class Query01Component
