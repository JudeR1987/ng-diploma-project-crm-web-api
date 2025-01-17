import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {Route} from '../../temp/Route';
import {PageViewModel} from '../../temp/PageViewModel';
import {WebApiService} from '../../temp/web-api.service';
import {Utils} from '../../infrastructure/Utils';
import {Config} from '../../infrastructure/Config';
import {TaskButtonComponent} from '../../temp/shared/task-button/task-button.component';
import {TableHeaderRoutesComponent} from './table-header-routes/table-header-routes.component';
import {TrRouteComponent} from './tr-route/tr-route.component';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [NgIf, TaskButtonComponent, TableHeaderRoutesComponent, TrRouteComponent],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent implements OnInit {

  // флаг включения спиннера при ожидании данных с сервера
  public isWaitFlag: boolean = false;

  // заголовок таблицы для отображения
  public displayTitle: string = "";

  // коллекция для получения информации с сервера
  private _routes: Route[] = [];

  // коллекция для отображения
  public displayRoutes: Route[] = [];

  // информация о пагинации страницы
  public pageViewModel: PageViewModel = new PageViewModel();

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  public route: string = "";


  // конструктор с DI для подключения к WebApiService-сервису получения данных
  // и подключения к объекту маршрутизатора для получения маршрута
  constructor(private _webApiService: WebApiService, private _router: Router) {
    Utils.helloComponent('routes');

    // получить маршрут
    this.route = this._router.url.slice(1);

  } // constructor


  // 0. обращение к серверу сразу после загрузки компонента
  ngOnInit(): void {

    // номер начальной страницы для вывода
    let page: number = 1;

    // начальный запрос на получение части коллекции для первой страницы
    this.getAllByPage(page);

  } // ngOnInit


  // запрос на получение части коллекции для заданной страницы
  private getAllByPage(page: number): void {

    // url для получения данных о маршрутах из БД от сервера
    let url: string = Config.urlGetAllRoutesByPage;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // подписка на получение результата запроса
    this._webApiService.getAllByPage(url, page)
      .subscribe((webResult: {routes: Route[], pageViewModel: PageViewModel}) => {

        // сведения о маршрутах, полученные при помощи сервиса
        this._routes = Route.parseRoutes(webResult.routes);
        this.pageViewModel = PageViewModel.newPageViewModel(webResult.pageViewModel);

        // вывод данных в разметку
        this.show(
          `Сведения о маршрутах (стр. &numero;${this.pageViewModel.pageNumber})`,
          this._routes
        ); // show

      } // subscribe
    ); // getAllByPage

  } // getAllByPage


  // метод вывода коллекции в разметку
  private show(title: string, routes: Route[]): void {

    this.displayTitle = title;
    this.displayRoutes = routes;
    this.isWaitFlag = false;

  } // show


  // обработчик кликов по кнопкам пагинации
  getByPageHandler(page: number): void {

    // запрос на получение части коллекции для заданной страницы
    this.getAllByPage(page);

  } // getByPageHandler

} // class RoutesComponent
