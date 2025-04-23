// ----------------------------------------------------------------------------
// компонент отображения заголовка таблицы с данными о записях
// ----------------------------------------------------------------------------
import {Component, EventEmitter, Output} from '@angular/core';
import {Literals} from '../../../infrastructure/Literals';

@Component({
  selector: '[table-header-records]',
  standalone: true,
  imports: [],
  templateUrl: './table-header-records.component.html',
  styleUrl: './table-header-records.component.css'
})
export class TableHeaderRecordsComponent {

  // режим сортировки
  public sortMode: string = Literals.asc;

  // поле для сортировки
  public sortProp: string = Literals.surname;

  protected readonly empty: string      = Literals.empty;
  protected readonly asc: string        = Literals.asc;
  protected readonly desc: string       = Literals.desc;
  protected readonly employee: string   = Literals.employee;
  protected readonly client: string     = Literals.client;
  protected readonly date: string       = Literals.date;
  protected readonly length: string     = Literals.length;
  protected readonly attendance: string = Literals.attendance;
  protected readonly isOnline: string   = Literals.isOnline;
  protected readonly price: string      = Literals.price;

  // свойство для генерации события передачи данных о режиме сортировки
  @Output() onSendSortParams: EventEmitter<{sortMode: string, sortProp: string}> =
    new EventEmitter<{sortMode: string, sortProp: string}>();


  // обработчик клика по заголовку столбца
  sorted(prop: string): void {

    // установить свойства сортировки
    if (this.sortProp === prop) {

      if (this.sortMode === this.asc) {
        this.sortMode = this.desc;
      } else if (this.sortMode === this.desc) {
        this.sortMode = this.empty;
      } else {
        this.sortMode = this.asc;
      } // if

    } else {
      this.sortMode = this.asc;
    } // if

    this.sortProp = prop;

    // передать свойства сортировки
    this.sendSortParams();

  } // sorted


  // метод передачи данных
  sendSortParams(): void {

    // зажигаем событие передачи данных
    this.onSendSortParams.emit({
      sortMode: this.sortMode, sortProp: this.sortProp
    });

  } // sendSortParams

} // class TableHeaderRecordsComponent
// ----------------------------------------------------------------------------
