import {Component, Input, EventEmitter, Output} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {Trip} from '../../Trip';

@Component({
  selector: '[tr-trip]',
  standalone: true,
  imports: [DecimalPipe, DatePipe],
  templateUrl: './tr-trip.component.html',
  styleUrl: './tr-trip.component.css'
})
export class TrTripComponent {

  // номер выводимой строки таблицы
  @Input() row: number = 0;

  // сведения о поездке
  @Input() trip: Trip = new Trip();

  // флаг включения спиннера при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // флаг включения режима удаления записей
  @Input() isDeleteFlag: boolean = false;

  // свойство для генерации события передачи
  // данных об Id изменяемой/удаляемой записи
  @Output() onSendTripId: EventEmitter<{ tripId: number, mode: string }> =
    new EventEmitter<{ tripId: number, mode: string }>();


  // метод передачи данных
  sendTripId(mode: string): void {

    // зажигаем событие передачи данных
    this.onSendTripId.emit({ tripId: this.trip.id, mode: mode });

  } // sendTripId

} // class TrTripComponent
