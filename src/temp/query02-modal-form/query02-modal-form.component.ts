import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {Purpose} from "../Purpose";

@Component({
  selector: 'query02-modal-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './query02-modal-form.component.html',
  styleUrl: './query02-modal-form.component.css'
})
export class Query02ModalFormComponent {

  // параметры для запроса №2

  // Id заданной цели поездки
  public purposeId: number = 0;

  // стоимость транспортных услуг
  @Input() public transportCost: number = 0;


  // получаемая коллекция целей поездки для списка выбора
  @Input() purposes: Purpose[] = [];

  // получаемые сведения о минимальной и максимальной
  // стоимости транспортных услуг для элемента ввода
  @Input() minTransportCost: number = 0;
  @Input() maxTransportCost: number = 0;

  // флаг включения спиннера при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // свойство для генерации события выдачи данных из компонента,
  // параметры для запроса №2
  @Output() onSendQuery02Params: EventEmitter<{purposeId: number, transportCost: number}> =
    new EventEmitter<{purposeId: number, transportCost: number}>();


  // метод передачи данных
  sendQuery02Params(form: NgForm): void {

    // т.к. select присваивает строку, требуется доп. присваивание
    this.purposeId = +this.purposeId;

    // если не выбран элемент в списке - остаёмся в форме
    if (this.purposeId === 0) return;

    // если стоимость транспортных услуг задана не корректно - остаёмся в форме
    if (this.transportCost <= 0) return;

    // зажигаем событие передачи данных
    this.onSendQuery02Params.emit(
      {purposeId: this.purposeId, transportCost: this.transportCost}
    ); // emit

    // сброс значений параметров
    this.purposeId = 0;
    this.transportCost = 0;

  } // sendQuery02Params

} // class Query02ModalFormComponent
