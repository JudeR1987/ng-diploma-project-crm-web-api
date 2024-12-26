import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {Person} from '../../temp/Person';
import {PageViewModel} from '../../temp/PageViewModel';
import {WebApiService} from '../../temp/web-api.service';
import {Utils} from '../../infrastructure/Utils';
import {Queries} from '../../temp/Queries';
import {TaskButtonComponent} from '../../temp/shared/task-button/task-button.component';
import {TableHeaderPeopleComponent} from './table-header-people/table-header-people.component';
import {TrPersonComponent} from './tr-person/tr-person.component';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [NgIf, TaskButtonComponent, TableHeaderPeopleComponent, TrPersonComponent],
  templateUrl: './people.component.html',
  styleUrl: './people.component.css'
})
export class PeopleComponent implements OnInit {

  // флаг включения спиннера при ожидании данных с сервера
  public isWaitFlag: boolean = false;

  // заголовок таблицы для отображения
  public displayTitle: string = "";

  // коллекция для получения информации с сервера
  private _people: Person[] = [];

  // коллекция для отображения
  public displayPeople: Person[] = [];

  // информация о пагинации страницы
  public pageViewModel: PageViewModel = new PageViewModel();

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  public route: string = "";


  // конструктор с DI для подключения к WebApiService-сервису получения данных
  // и подключения к объекту маршрутизатора для получения маршрута
  constructor(private _webApiService: WebApiService, private _router: Router) {
    Utils.helloComponent('people');

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

    // url для получения данных о персональных данных из БД от сервера
    let url: string = Queries.urlGetAllPeopleByPage;

    // включение спиннера ожидания данных
    this.isWaitFlag = true;

    // подписка на получение результата запроса
    this._webApiService.getAllByPage(url, page)
      .subscribe((webResult: {people: Person[], pageViewModel: PageViewModel}) => {

        // сведения о персональных данных, полученные при помощи сервиса
        this._people = Person.parsePeople(webResult.people);
        this.pageViewModel = PageViewModel.newPageViewModel(webResult.pageViewModel);

        // вывод данных в разметку
        this.show(
          `Сведения о персональных данных (стр. &numero;${this.pageViewModel.pageNumber})`,
          this._people
        ); // show

      } // subscribe
    ); // getAllByPage

  } // getAllByPage


  // метод вывода коллекции в разметку
  private show(title: string, people: Person[]): void {

    this.displayTitle = title;
    this.displayPeople = people;
    this.isWaitFlag = false;

  } // show


  // обработчик кликов по кнопкам пагинации
  getByPageHandler(page: number): void {

    // запрос на получение части коллекции для заданной страницы
    this.getAllByPage(page);

  } // getByPageHandler

} // class PeopleComponent
