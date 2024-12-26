import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {Country} from '../../temp/Country';
import {PageViewModel} from '../../temp/PageViewModel';
import {WebApiService} from '../../temp/web-api.service';
import {Utils} from '../../infrastructure/Utils';
import {Queries} from '../../temp/Queries';
import {TaskButtonComponent} from '../../temp/shared/task-button/task-button.component';
import {TableHeaderCountriesComponent} from './table-header-countries/table-header-countries.component';
import {TrCountryComponent} from './tr-country/tr-country.component';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [NgIf, TaskButtonComponent, TableHeaderCountriesComponent, TrCountryComponent],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent implements OnInit {

  // флаг включения спиннера при ожидании данных с сервера
  public isWaitFlag: boolean = false;

  // заголовок таблицы для отображения
  public displayTitle: string = "";

  // коллекция для получения информации с сервера
  private _countries: Country[] = [];

  // коллекция для отображения
  public displayCountries: Country[] = [];

  // информация о пагинации страницы
  public pageViewModel: PageViewModel = new PageViewModel();

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  public route: string = "";


  // конструктор с DI для подключения к WebApiService-сервису получения данных
  // и подключения к объекту маршрутизатора для получения маршрута
  constructor(private _webApiService: WebApiService, private _router: Router) {
    Utils.helloComponent('countries');

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

    // url для получения данных о странах из БД от сервера
    let url: string = Queries.urlGetAllCountriesByPage;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // подписка на получение результата запроса
    this._webApiService.getAllByPage(url, page)
      .subscribe((webResult: {countries: Country[], pageViewModel: PageViewModel}) => {

        // сведения о странах, полученные при помощи сервиса
        this._countries = Country.parseCountries(webResult.countries);
        this.pageViewModel = PageViewModel.newPageViewModel(webResult.pageViewModel);

        // вывод данных в разметку
        this.show(
          `Сведения о странах (стр. &numero;${this.pageViewModel.pageNumber})`,
          this._countries
        ); // show

      } // subscribe
    ); // getAllByPage

  } // getAllByPage


  // метод вывода коллекции в разметку
  private show(title: string, countries: Country[]): void {

    this.displayTitle = title;
    this.displayCountries = countries;
    this.isWaitFlag = false;

  } // show


  // обработчик кликов по кнопкам пагинации
  getByPageHandler(page: number): void {

    // запрос на получение части коллекции для заданной страницы
    this.getAllByPage(page);

  } // getByPageHandler

} // class CountriesComponent
