import {Component, Input, EventEmitter, Output} from '@angular/core';
import {ClientTemp} from '../../ClientTemp';

@Component({
  selector: '[tr-clientTemp]',
  standalone: true,
  imports: [],
  templateUrl: './tr-clientTemp.component.html',
  styleUrl: './tr-clientTemp.component.css'
})
export class TrClientTempComponent {

  // номер выводимой строки таблицы
  @Input() row: number = 0;

  // сведения о клиенте
  @Input() client: ClientTemp = new ClientTemp();

  // флаг включения спиннера при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // флаг включения режима удаления записей
  @Input() isDeleteFlag: boolean = false;

  // флаг отображения кнопок управления в таблице
  @Input() isQueryFlag: boolean = false;

  // свойство для генерации события передачи
  // данных об Id изменяемой/удаляемой записи
  @Output() onSendClientId: EventEmitter<{ clientId: number, mode: string }> =
    new EventEmitter<{ clientId: number, mode: string }>();


  // метод передачи данных
  sendClientId(mode: string): void {

    // зажигаем событие передачи данных
    this.onSendClientId.emit({ clientId: this.client.id, mode: mode });

  } // sendClientId

} // class TrClientTempComponent
