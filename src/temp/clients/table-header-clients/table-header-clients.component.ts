import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: '[table-header-clients]',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './table-header-clients.component.html',
  styleUrl: './table-header-clients.component.css'
})
export class TableHeaderClientsComponent {

  // флаг включения режима удаления записей
  public isDeleteFlag: boolean = false;

  // флаг отображения кнопок управления в таблице
  @Input() isQueryFlag: boolean = false;

  // свойство для генерации события передачи
  // данных о режиме удаления записей
  @Output() onSendIsDeleteFlag: EventEmitter<boolean> = new EventEmitter<boolean>();


  // метод передачи данных
  sendIsDeleteFlag(): void {

    // зажигаем событие передачи данных
    this.onSendIsDeleteFlag.emit(this.isDeleteFlag);

  } // sendIsDeleteFlag

} // class TableHeaderClientsComponent
