import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {Purpose} from "../../temp/Purpose";

@Component({
  selector: 'query01-modal-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './query01-modal-form.component.html',
  styleUrl: './query01-modal-form.component.css'
})
export class Query01ModalFormComponent {

  // параметр для запроса №1
  public purposeId: number = 0;

  // получаемая коллекция целей поездки для списка выбора
  @Input() purposes: Purpose[] = [];

  // флаг включения спиннера при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // свойство для генерации события выдачи данных из компонента,
  // параметр для запроса №1
  @Output() onSendQuery01Params: EventEmitter<number> = new EventEmitter<number>();


  // метод передачи данных
  sendQuery01Params(form: NgForm): void {

    // т.к. select присваивает строку, требуется доп. присваивание
    this.purposeId = +this.purposeId;

    // если не выбран элемент в списке - остаёмся в форме
    if (this.purposeId === 0) return;

    // зажигаем событие передачи данных
    this.onSendQuery01Params.emit(this.purposeId);

    // сброс значения параметра
    this.purposeId = 0;

  } // sendQuery01Params

} // class Query01ModalFormComponent
