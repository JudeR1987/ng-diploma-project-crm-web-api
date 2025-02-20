// ----------------------------------------------------------------------------
// компонент выбора возможности удаления данных
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output, OnInit, OnDestroy}
  from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Literals} from '../../infrastructure/Literals';

@Component({
  selector: 'checkbox-deleting',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './checkbox-deleting.component.html',
  styleUrl: './checkbox-deleting.component.css'
})
export class CheckboxDeletingComponent implements OnInit, OnDestroy {

  // входные параметры
  // заголовок чек-бокса изменения возможности удаления данных
  @Input() labelCheckboxDeletingFlag: string = Literals.empty;

  // флаг включения возможности удаления данных
  @Input() isDeletingFlag: boolean = false;

  // свойство для генерации события передачи данных о возможности удаления данных
  @Output() onSendIsDeletingFlag: EventEmitter<boolean> = new EventEmitter<boolean>();


  // конструктор
  constructor() {
    console.log(`[-CheckboxDeletingComponent-constructor--`);

    console.log(`*-this.labelCheckboxDeletingFlag= '${this.labelCheckboxDeletingFlag}' -*`);
    console.log(`*-this.isDeletingFlag= '${this.isDeletingFlag}' -*`);

    console.log(`--CheckboxDeletingComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit() {
    console.log(`[-CheckboxDeletingComponent-ngOnInit--`);

    console.log(`*- параметры должны быть получены -*`);
    console.log(`*-this.labelCheckboxDeletingFlag= '${this.labelCheckboxDeletingFlag}' -*`);
    console.log(`*-this.isDeletingFlag= '${this.isDeletingFlag}' -*`);

    console.log(`--CheckboxDeletingComponent-ngOnInit-]`);
  } // ngOnInit


  // обработчик события передачи данных о возможности удаления данных
  sendIsDeletingFlag(): void {
    console.log(`[-CheckboxDeletingComponent-sendIsDeletingFlag--`);

    console.log(`*-this.isDeletingFlag= '${this.isDeletingFlag}' -*`);

    // зажигаем событие передачи данных
    this.onSendIsDeletingFlag.emit(this.isDeletingFlag);

    console.log(`--CheckboxDeletingComponent-sendIsDeletingFlag-]`);
  } // sendIsDeletingFlag


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-CheckboxDeletingComponent-ngOnDestroy--`);
    console.log(`--CheckboxDeletingComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class CheckboxDeletingComponent
// ----------------------------------------------------------------------------
