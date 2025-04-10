// ----------------------------------------------------------------------------
// компонент отображения данных о рабочем дне сотрудника с коллекцией
// промежутков времени перерывов сотрудника
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output, OnInit, OnDestroy} from '@angular/core';
import {DisplayWorkDayBreakSlots} from '../../models/classes/DisplayWorkDayBreakSlots';
import {Literals} from '../../infrastructure/Literals';
import {DatePipe, NgClass, NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Slot} from '../../models/classes/Slot';

@Component({
  selector: 'display-work-day-break-slots',
  standalone: true,
  imports: [
    NgClass, DatePipe, FormsModule, NgForOf, ReactiveFormsModule
  ],
  templateUrl: './display-work-day-break-slots.component.html',
  styleUrl: './display-work-day-break-slots.component.css'
})
export class DisplayWorkDayBreakSlotsComponent implements OnInit, OnDestroy {

  // входные параметры

  // флаг включения спиннера при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // объект сведений о рабочем дне сотрудника с коллекцией
  // промежутков времени перерывов сотрудника
  @Input() displayWorkDayBreakSlots: DisplayWorkDayBreakSlots = new DisplayWorkDayBreakSlots();

  // всплывающая подсказка на поле отображения дня недели
  @Input() labelWeekDayTitle: string = Literals.empty;

  // значение поля отображения дня недели
  @Input() labelWeekDayValue: string = Literals.empty;

  // всплывающие подсказки в поле чек-бокса "рабочий/НЕ_рабочий день"
  @Input() labelCheckboxWeekendTitle: string    = Literals.empty;
  @Input() labelCheckboxWorkingDayTitle: string = Literals.empty;

  // значения заголовка чек-бокса выбора признака рабочего дня
  @Input() labelCheckboxWeekend: string    = Literals.empty;
  @Input() labelCheckboxWorkingDay: string = Literals.empty;

  // заголовок поля выбора времени начала рабочего дня сотрудника
  @Input() labelWorkDayStartTime: string = Literals.empty;

  // заголовок поля выбора времени окончания рабочего дня сотрудника
  @Input() labelWorkDayEndTime: string = Literals.empty;

  // всплывающая подсказка на кнопке "добавить перерыв"
  @Input() butAddBreakSlotTitle: string = Literals.empty;

  // всплывающая подсказка на кнопке "убрать перерыв"
  @Input() butRemoveBreakSlotTitle: string = Literals.empty;

  // части заголовка дополнительного фрагмента контейнера промежутка времени
  @Input() labelDuration: string = Literals.empty;
  @Input() labelFrom: string     = Literals.empty;

  // всплывающая подсказка на кнопке "изменить параметры"
  @Input() butEditWorkDayTitle: string = Literals.empty;

  // дополнительные свойства
  protected readonly zero: number             = Literals.zero;
  protected readonly one: number              = Literals.one;
  protected readonly two: number              = Literals.two;
  protected readonly bgSuccessSubtle: string  = Literals.bgSuccessSubtle;
  protected readonly bgMainColor: string      = Literals.bgMainColor;

  // свойство для генерации события передачи данных для изменения об объекте
  // рабочего дня сотрудника с коллекцией промежутков времени перерывов сотрудника
  @Output() onSendDisplayWorkDayBreakSlots: EventEmitter<DisplayWorkDayBreakSlots> =
    new EventEmitter<DisplayWorkDayBreakSlots>();


  // конструктор
  constructor() {
    console.log(`[-DisplayWorkDayBreakSlotsComponent-constructor--`);

    console.log(`*-this.displayWorkDayBreakSlots: -*`);
    console.dir(this.displayWorkDayBreakSlots);

    console.log(`--DisplayWorkDayBreakSlotsComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit() {
    console.log(`[-DisplayWorkDayBreakSlotsComponent-ngOnInit--`);

    console.log(`*- параметры должны быть получены -*`);
    console.log(`*-this.displayWorkDayBreakSlots: -*`);
    console.dir(this.displayWorkDayBreakSlots);

    console.log(`--DisplayWorkDayBreakSlotsComponent-ngOnInit-]`);
  } // ngOnInit


  // обработчик события изменения значения выбора времени
  inputTimeHandler(): void {
    console.log(`[-DisplayWorkDayBreakSlotsComponent-inputTimeHandler--`);

    console.log(`*-this.displayWorkDayBreakSlots: -*`);
    console.dir(this.displayWorkDayBreakSlots);

    console.log(`*-this.displayWorkDayBreakSlots.workDay.startTime: '${this.displayWorkDayBreakSlots.workDay.startTime}' [${typeof this.displayWorkDayBreakSlots.workDay.startTime}] -*`);
    console.log(`*-this.displayWorkDayBreakSlots.workDay.endTime: '${this.displayWorkDayBreakSlots.workDay.endTime}' [${typeof this.displayWorkDayBreakSlots.workDay.endTime}] -*`);

    console.log(`--DisplayWorkDayBreakSlotsComponent-inputTimeHandler-]`);
  } // inputTimeHandler


  // обработчик события добавления нового промежутка времени для перерыва сотрудника
  addBreakSlot(): void {
    console.log(`[-DisplayWorkDayBreakSlotsComponent-addBreakSlot--`);

    console.log(`*-this.displayWorkDayBreakSlots.slots.length: '${this.displayWorkDayBreakSlots.slots.length}' -*`);

    // добавить новый промежуток времени
    this.displayWorkDayBreakSlots.slots.push(new Slot());

    console.log(`*-this.displayWorkDayBreakSlots.slots.length: '${this.displayWorkDayBreakSlots.slots.length}' -*`);

    console.log(`--DisplayWorkDayBreakSlotsComponent-addBreakSlot-]`);
  } // addBreakSlot


  // обработчик события удаления последнего в коллекции
  // промежутка времени для перерыва сотрудника
  removeBreakSlot(): void {
    console.log(`[-DisplayWorkDayBreakSlotsComponent-removeBreakSlot--`);

    console.log(`*-this.displayWorkDayBreakSlots.slots.length: '${this.displayWorkDayBreakSlots.slots.length}' -*`);

    // удалить последний в коллекции промежуток времени
    this.displayWorkDayBreakSlots.slots = this.displayWorkDayBreakSlots.slots
      .slice(0, this.displayWorkDayBreakSlots.slots.length - 1);

    console.log(`*-this.displayWorkDayBreakSlots.slots.length: '${this.displayWorkDayBreakSlots.slots.length}' -*`);

    console.log(`--DisplayWorkDayBreakSlotsComponent-removeBreakSlot-]`);
  } // removeBreakSlot


  // метод передачи данных об объекте для изменения
  sendDisplayWorkDayBreakSlots(): void {
    console.log(`[-DisplayWorkDayBreakSlotsComponent-sendDisplayWorkDayBreakSlots--`);

    // зажигаем событие передачи данных
    this.onSendDisplayWorkDayBreakSlots.emit(this.displayWorkDayBreakSlots);

    console.log(`--DisplayWorkDayBreakSlotsComponent-sendDisplayWorkDayBreakSlots-]`);
  } // sendDisplayWorkDayBreakSlots


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-DisplayWorkDayBreakSlotsComponent-ngOnDestroy--`);
    console.log(`--DisplayWorkDayBreakSlotsComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class DisplayWorkDayBreakSlotsComponent
// ----------------------------------------------------------------------------
