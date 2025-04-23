import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: '[table-header-clientsTemp]',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './table-header-clientsTemp.component.html',
  styleUrl: './table-header-clientsTemp.component.css'
})
export class TableHeaderClientsTempComponent {

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

} // class TableHeaderClientsTempComponent
