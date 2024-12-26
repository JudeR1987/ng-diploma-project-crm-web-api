import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";

@Component({
  selector: 'query03-modal-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './query03-modal-form.component.html',
  styleUrl: './query03-modal-form.component.css'
})
export class Query03ModalFormComponent {

  // параметры для запроса №3

  // заданное количество дней пребывания в стране
  @Input() public amountDays: number = 0;


  // получаемые сведения о минимальном и максимальном количестве
  // дней пребывания клиентов в стране для элемента ввода
  @Input() minAmountDays: number = 0;
  @Input() maxAmountDays: number = 0;

  // флаг включения спиннера при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // свойство для генерации события выдачи данных из компонента,
  // параметры для запроса №3
  @Output() onSendQuery03Params: EventEmitter<number> = new EventEmitter<number>();


  // метод передачи данных
  sendQuery03Params(form: NgForm): void {

    // если количество дней пребывания в стране задано не корректно - остаёмся в форме
    if (this.amountDays <= 0) return;

    // зажигаем событие передачи данных
    this.onSendQuery03Params.emit(this.amountDays);

    // сброс значений параметров
    this.amountDays = 0;

  } // sendQuery03Params

} // class Query03ModalFormComponent
