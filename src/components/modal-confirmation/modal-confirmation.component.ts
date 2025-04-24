// ----------------------------------------------------------------------------
// модальный компонент подтверждения/НЕ_подтверждения действия
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Literals} from '../../infrastructure/Literals';

@Component({
  selector: 'modal-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirmation.component.html',
  styleUrl: './modal-confirmation.component.css'
})
export class ModalConfirmationComponent {

  // входные параметры
  // заголовок сообщения
  @Input() title: string = Literals.empty;

  // сообщение подтверждения удаления данных
  @Input() messageConfirmation: string = Literals.empty;

  // всплывающая подсказка на кнопке "подтвердить удаление"
  @Input() butConfirmedOkTitle: string = Literals.empty;

  // значение кнопки "подтвердить удаление"
  @Input() butConfirmedOkValue: string = Literals.empty;

  // всплывающая подсказка на кнопке "отменить удаление"
  @Input() butConfirmedCancelTitle: string = Literals.empty;

  // значение кнопки "отменить удаление"
  @Input() butConfirmedCancelValue: string = Literals.empty;

  // флаг включения возможности удаления данных о пользователе
  // false - запрещено удалять, true - разрешено удалять
  // (для сокрытия иконок не используя aria-hidden)
  @Input() isDeletingFlag: boolean = false;


  // свойство для передачи решения о действии
  // (true - подтверждено, false - НЕ_подтверждено)
  public isConfirmed: boolean = false;

  // свойство для генерации события подтверждения/НЕ_подтверждения действия
  @Output() onSendIsConfirmed: EventEmitter<boolean> = new EventEmitter<boolean>();


  // конструктор
  constructor() {
  } // constructor


  // обработчик события передачи данных о возможности удаления данных
  sendIsConfirmed(value: boolean): void {

    // установить заданное значение
    this.isConfirmed = value;

    // зажигаем событие передачи данных
    this.onSendIsConfirmed.emit(this.isConfirmed);

    // установить исходное значение параметра
    this.isConfirmed = false;

  } // sendIsConfirmed

} // class ModalConfirmationComponent
// ----------------------------------------------------------------------------
