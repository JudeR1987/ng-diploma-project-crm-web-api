import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DecimalPipe, NgIf} from '@angular/common';
import {IQuery05} from '../../temp/IQuery05';
import {WebApiService} from '../../temp/web-api.service';
import {Utils} from '../../infrastructure/Utils';
import {Queries} from '../../temp/Queries';
import {TaskButtonComponent} from '../../temp/shared/task-button/task-button.component';
import {TableHeaderQuery05Component} from './table-header-query05/table-header-query05.component';
import {TrGroupQuery05Component} from './tr-group-query05/tr-group-query05.component';

@Component({
  selector: 'app-query05',
  standalone: true,
  imports: [
    DecimalPipe, NgIf, TaskButtonComponent,
    TableHeaderQuery05Component, TrGroupQuery05Component
  ],
  templateUrl: './query05.component.html',
  styleUrl: './query05.component.css'
})
export class Query05Component implements OnInit {

  // флаг включения спиннера при ожидании данных с сервера
  public isWaitFlag: boolean = false;

  // заголовок таблицы для отображения
  public displayTitle: string = "";

  // коллекция для получения информации с сервера
  private _groups: IQuery05[] = [];

  // коллекция для отображения
  public displayGroups: IQuery05[] = [];

  // среднее значение стоимости транспортных услуг для проданных поездок
  public avgTransportCost: number = 0;

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  public route: string = "";


  // конструктор с DI для подключения к WebApiService-сервису получения данных
  // и подключения к объекту маршрутизатора для получения маршрута
  constructor(private _webApiService: WebApiService, private _router: Router) {
    Utils.helloComponent('query05');

    // получить маршрут
    this.route = this._router.url.slice(1);

  } // constructor


  // 0. отправка запроса №5 на сервер сразу после загрузки компонента
  ngOnInit() {

    // url для получения данных запроса №5 от сервера
    let url: string = Queries.urlQuery05;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // подписка на получение результата запроса №5 к БД
    this._webApiService.putQuery05(url).subscribe({

      // вызов метода при получении данных
      next: (webResult: {groupsQuery05: IQuery05[], avgTransportCost: number}) => {

        // сведения о сгруппированных данных, полученные при помощи сервиса
        this._groups = webResult.groupsQuery05;

        // среднее значение стоимости транспортных услуг для проданных поездок
        this.avgTransportCost = webResult.avgTransportCost;

        // вывод данных в разметку
        this.show(
          `Записи о поездках ${(this._groups.length === 0)
            ? 'отсутствуют'
            : 'сгруппированы по полю &laquo;Страна назначения&raquo;'}`,
          this._groups
        ); // show

      }, // next

      // вызов метода при обнаружении ошибки в данных
      error: (err: any) => {
        this.displayTitle = 'Ошибка сервера при запросе №5';
        this.isWaitFlag = false;
        console.dir(err);
      } // error

    }); // putQuery03

  } // ngOnInit


  // метод вывода коллекции в разметку
  private show(title: string, groups: IQuery05[]): void {

    this.displayTitle = title;
    this.displayGroups = groups;
    this.isWaitFlag = false;

  } // show

} // class Query05Component
