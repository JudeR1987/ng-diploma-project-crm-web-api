import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: '[table-header-trips]',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './table-header-trips.component.html',
  styleUrl: './table-header-trips.component.css'
})
export class TableHeaderTripsComponent {

  // флаг включения режима удаления записей
  public isDeleteFlag: boolean = false;

  // свойство для генерации события передачи
  // данных о режиме удаления записей
  @Output() onSendIsDeleteFlag: EventEmitter<boolean> = new EventEmitter<boolean>();


  // метод передачи данных
  sendIsDeleteFlag(): void {

    // зажигаем событие передачи данных
    this.onSendIsDeleteFlag.emit(this.isDeleteFlag);

  } // sendIsDeleteFlag

} // class TableHeaderTripsComponent
