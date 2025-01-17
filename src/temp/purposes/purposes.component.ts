import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {Purpose} from '../../temp/Purpose';
import {PageViewModel} from '../../temp/PageViewModel';
import {WebApiService} from '../../temp/web-api.service';
import {Utils} from '../../infrastructure/Utils';
import {Config} from '../../infrastructure/Config';
import {TaskButtonComponent} from '../../temp/shared/task-button/task-button.component';
import {TableHeaderPurposesComponent} from './table-header-purposes/table-header-purposes.component';
import {TrPurposeComponent} from './tr-purpose/tr-purpose.component';

@Component({
  selector: 'app-purposes',
  standalone: true,
  imports: [NgIf, TaskButtonComponent, TableHeaderPurposesComponent, TrPurposeComponent],
  templateUrl: './purposes.component.html',
  styleUrl: './purposes.component.css'
})
export class PurposesComponent implements OnInit {

  // флаг включения спиннера при ожидании данных с сервера
  public isWaitFlag: boolean = false;

  // заголовок таблицы для отображения
  public displayTitle: string = "";

  // коллекция для получения информации с сервера
  private _purposes: Purpose[] = [];

  // коллекция для отображения
  public displayPurposes: Purpose[] = [];

  // информация о пагинации страницы
  public pageViewModel: PageViewModel = new PageViewModel();

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  public route: string = "";


  // конструктор с DI для подключения к WebApiService-сервису получения данных
  // и подключения к объекту маршрутизатора для получения маршрута
  constructor(private _webApiService: WebApiService, private _router: Router) {
    Utils.helloComponent('purposes');

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

    // url для получения данных о целях поездок из БД от сервера
    let url: string = Config.urlGetAllPurposesByPage;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // подписка на получение результата запроса
    this._webApiService.getAllByPage(url, page)
      .subscribe((webResult: {purposes: Purpose[], pageViewModel: PageViewModel}) => {

        // сведения о целях поездок, полученные при помощи сервиса
        this._purposes = Purpose.parsePurposes(webResult.purposes);
        this.pageViewModel = PageViewModel.newPageViewModel(webResult.pageViewModel);

        // вывод данных в разметку
        this.show(
          `Сведения о целях поездок (стр. &numero;${this.pageViewModel.pageNumber})`,
          this._purposes
        ); // show

      } // subscribe
    ); // getAllByPage

  } // getAllByPage


  // метод вывода коллекции в разметку
  private show(title: string, purposes: Purpose[]): void {

    this.displayTitle = title;
    this.displayPurposes = purposes;
    this.isWaitFlag = false;

  } // show


  // обработчик кликов по кнопкам пагинации
  getByPageHandler(page: number): void {

    // запрос на получение части коллекции для заданной страницы
    this.getAllByPage(page);

  } // getByPageHandler

} // class PurposesComponent
