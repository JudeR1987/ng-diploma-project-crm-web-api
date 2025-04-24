// ----------------------------------------------------------------------------
// компонент выбора возможности удаления данных
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Literals} from '../../infrastructure/Literals';

@Component({
  selector: 'checkbox-deleting',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkbox-deleting.component.html',
  styleUrl: './checkbox-deleting.component.css'
})
export class CheckboxDeletingComponent {

  // входные параметры
  // заголовок чек-бокса изменения возможности удаления данных
  @Input() labelCheckboxDeletingFlag: string = Literals.empty;

  // флаг включения возможности удаления данных
  @Input() isDeletingFlag: boolean = false;

  // свойство для генерации события передачи данных о возможности удаления данных
  @Output() onSendIsDeletingFlag: EventEmitter<boolean> = new EventEmitter<boolean>();


  // конструктор
  constructor() {
  } // constructor


  // обработчик события передачи данных о возможности удаления данных
  sendIsDeletingFlag(): void {

    // зажигаем событие передачи данных
    this.onSendIsDeletingFlag.emit(this.isDeletingFlag);

  } // sendIsDeletingFlag

} // class CheckboxDeletingComponent
// ----------------------------------------------------------------------------
