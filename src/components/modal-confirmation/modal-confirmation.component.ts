// ----------------------------------------------------------------------------
// модальный компонент подтверждения/НЕ_подтверждения действия
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output, OnInit, OnDestroy}
  from '@angular/core';
import {Literals} from '../../infrastructure/Literals';
import {Resources} from '../../infrastructure/Resources';

@Component({
  selector: 'modal-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirmation.component.html',
  styleUrl: './modal-confirmation.component.css'
})
export class ModalConfirmationComponent implements OnInit, OnDestroy {

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
    console.log(`[-ModalConfirmationComponent-constructor--`);

    console.log(`*-this.isConfirmed= '${this.isConfirmed}' -*`);
    console.log(`*-this.title= '${this.title}' -*`);
    console.log(`*-this.isDeletingFlag= '${this.isDeletingFlag}' -*`);

    console.log(`--ModalConfirmationComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit() {
    console.log(`[-ModalConfirmationComponent-ngOnInit--`);

    console.log(`*- параметры должны быть получены -*`);
    console.log(`*-this.isConfirmed= '${this.isConfirmed}' -*`);
    console.log(`*-this.title= '${this.title}' -*`);
    console.log(`*-this.isDeletingFlag= '${this.isDeletingFlag}' -*`);

    console.log(`--ModalConfirmationComponent-ngOnInit-]`);
  } // ngOnInit


  // обработчик события передачи данных о возможности удаления данных
  sendIsConfirmed(value: boolean): void {
    console.log(`[-ModalConfirmationComponent-sendIsConfirmed--`);

    console.log(`-(было)-this.isConfirmed: '${this.isConfirmed}'`);
    this.isConfirmed = value;
    console.log(`-(стало)-this.isConfirmed: '${this.isConfirmed}'`);

    // зажигаем событие передачи данных
    this.onSendIsConfirmed.emit(this.isConfirmed);

    // установить исходное значение параметра
    console.log(`-(было)-this.isConfirmed: '${this.isConfirmed}'`);
    this.isConfirmed = false;
    console.log(`-(стало)-this.isConfirmed: '${this.isConfirmed}'`);

    console.log(`--ModalConfirmationComponent-sendIsConfirmed-]`);
  } // sendIsConfirmed


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-ModalConfirmationComponent-ngOnDestroy--`);
    console.log(`--ModalConfirmationComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class ModalConfirmationComponent
// ----------------------------------------------------------------------------
