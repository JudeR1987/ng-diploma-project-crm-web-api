import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DecimalPipe, NgIf} from '@angular/common';
import {IQuery04} from '../../temp/IQuery04';
import {WebApiService} from '../../temp/web-api.service';
import {Utils} from '../../infrastructure/Utils';
import {Queries} from '../../temp/Queries';
import {TaskButtonComponent} from '../../temp/shared/task-button/task-button.component';
import {TableHeaderQuery04Component} from './table-header-query04/table-header-query04.component';
import {TrGroupQuery04Component} from './tr-group-query04/tr-group-query04.component';

@Component({
  selector: 'app-query04',
  standalone: true,
  imports: [
    DecimalPipe, NgIf, TaskButtonComponent,
    TableHeaderQuery04Component, TrGroupQuery04Component
  ],
  templateUrl: './query04.component.html',
  styleUrl: './query04.component.css'
})
export class Query04Component implements OnInit {

  // флаг включения спиннера при ожидании данных с сервера
  public isWaitFlag: boolean = false;

  // заголовок таблицы для отображения
  public displayTitle: string = "";

  // коллекция для получения информации с сервера
  private _groups: IQuery04[] = [];

  // коллекция для отображения
  public displayGroups: IQuery04[] = [];

  // минимальная, средняя и максимальная стоимость 1 дня пребывания
  public minDayCost: number = 0;
  public avgDayCost: number = 0;
  public maxDayCost: number = 0;

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  public route: string = "";


  // конструктор с DI для подключения к WebApiService-сервису получения данных
  // и подключения к объекту маршрутизатора для получения маршрута
  constructor(private _webApiService: WebApiService, private _router: Router) {
    Utils.helloComponent('query04');

    // получить маршрут
    this.route = this._router.url.slice(1);

  } // constructor


  // 0. отправка запроса №4 на сервер сразу после загрузки компонента
  ngOnInit() {

    // url для получения данных запроса №4 от сервера
    let url: string = Queries.urlQuery04;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // подписка на получение результата запроса №4 к БД
    this._webApiService.putQuery04(url).subscribe({

      // вызов метода при получении данных
      next: (webResult: {
        groupsQuery04: IQuery04[], minDayCost: number, avgDayCost: number, maxDayCost: number
      }) => {

        // сведения о сгруппированных данных, полученные при помощи сервиса
        this._groups = webResult.groupsQuery04;

        // минимальная, средняя и максимальная стоимость 1 дня пребывания
        this.minDayCost = webResult.minDayCost;
        this.avgDayCost = webResult.avgDayCost;
        this.maxDayCost = webResult.maxDayCost;

        // вывод данных в разметку
        this.show(
          `Записи о поездках ${(this._groups.length === 0)
            ? 'отсутствуют'
            : 'сгруппированы по полю &laquo;Цель поездки&raquo;'}`,
          this._groups
        ); // show

      }, // next

      // вызов метода при обнаружении ошибки в данных
      error: (err: any) => {
        this.displayTitle = 'Ошибка сервера при запросе №4';
        this.isWaitFlag = false;
        console.dir(err);
      } // error

    }); // putQuery04

  } // ngOnInit


  // метод вывода коллекции в разметку
  private show(title: string, groups: IQuery04[]): void {

    this.displayTitle = title;
    this.displayGroups = groups;
    this.isWaitFlag = false;

  } // show

} // class Query04Component
