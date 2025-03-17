// ----------------------------------------------------------------------------
// компонент отображения данных о пагинации страницы
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output, OnInit, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './temp.component.html',
  styleUrl: './temp.component.css'
})
export class TempComponent implements OnInit, OnDestroy {

  // входные параметры
  // заголовок чек-бокса изменения возможности удаления данных
  //@Input() company: Company = new Company();

  // свойство для генерации события передачи
  // данных об Id выбранной компании
  @Output() onSendCompanyId: EventEmitter<number> = new EventEmitter<number>();


  // конструктор
  constructor() {
    console.log(`[-PaginationComponent-constructor--`);

    console.log(`*-this.company: -*`);
    //console.dir(this.company);

    console.log(`--PaginationComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit() {
    console.log(`[-PaginationComponent-ngOnInit--`);

    console.log(`*- параметры должны быть получены -*`);
    console.log(`*-this.company: -*`);
    //console.dir(this.company);

    console.log(`--PaginationComponent-ngOnInit-]`);
  } // ngOnInit


  // метод передачи данных
  sendCompanyId(companyId: number): void {
    console.log(`[-PaginationComponent-sendCompanyId--`);

    // зажигаем событие передачи данных
    this.onSendCompanyId.emit(companyId);

    console.log(`--PaginationComponent-sendCompanyId-]`);
  } // sendCompanyId


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-PaginationComponent-ngOnDestroy--`);
    console.log(`--PaginationComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class TempComponent
// ----------------------------------------------------------------------------
