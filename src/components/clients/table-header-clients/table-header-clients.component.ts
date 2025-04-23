// ----------------------------------------------------------------------------
// компонент отображения заголовка таблицы с данными о клиентах
// ----------------------------------------------------------------------------
import {Component, EventEmitter, Output} from '@angular/core';
import {Literals} from '../../../infrastructure/Literals';

@Component({
  selector: '[table-header-clients]',
  standalone: true,
  imports: [],
  templateUrl: './table-header-clients.component.html',
  styleUrl: './table-header-clients.component.css'
})
export class TableHeaderClientsComponent {

  // режим сортировки
  public sortMode: string = Literals.asc;

  // поле для сортировки
  public sortProp: string = Literals.surname;

  protected readonly empty: string     = Literals.empty;
  protected readonly asc: string       = Literals.asc;
  protected readonly desc: string      = Literals.desc;
  protected readonly surname: string   = Literals.surname;
  protected readonly phone: string     = Literals.phone;
  protected readonly email: string     = Literals.email;
  protected readonly birthDate: string = Literals.birthDate;
  protected readonly gender: string    = Literals.gender;
  protected readonly discount: string  = Literals.discount;
  protected readonly card: string      = Literals.card;
  protected readonly balance: string   = Literals.balance;

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

} // TableHeaderClientsComponent
// ----------------------------------------------------------------------------
