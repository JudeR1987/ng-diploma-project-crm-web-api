// ----------------------------------------------------------------------------
// компонент отображения данных о рабочем дне сотрудника с коллекцией
// промежутков времени перерывов сотрудника
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {DisplayWorkDayBreakSlots} from '../../models/classes/DisplayWorkDayBreakSlots';
import {Literals} from '../../infrastructure/Literals';
import {DatePipe, NgClass, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Slot} from '../../models/classes/Slot';

@Component({
  selector: 'display-work-day-break-slots',
  standalone: true,
  imports: [NgClass, DatePipe, FormsModule, NgForOf],
  templateUrl: './display-work-day-break-slots.component.html',
  styleUrl: './display-work-day-break-slots.component.css'
})
export class DisplayWorkDayBreakSlotsComponent {

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
  } // constructor


  // обработчик события добавления нового промежутка времени для перерыва сотрудника
  addBreakSlot(): void {

    // добавить новый промежуток времени
    this.displayWorkDayBreakSlots.slots.push(new Slot());

  } // addBreakSlot


  // обработчик события удаления последнего в коллекции
  // промежутка времени для перерыва сотрудника
  removeBreakSlot(): void {

    // удалить последний в коллекции промежуток времени
    this.displayWorkDayBreakSlots.slots = this.displayWorkDayBreakSlots.slots
      .slice(0, this.displayWorkDayBreakSlots.slots.length - 1);

  } // removeBreakSlot


  // метод передачи данных об объекте для изменения
  sendDisplayWorkDayBreakSlots(): void {

    // зажигаем событие передачи данных
    this.onSendDisplayWorkDayBreakSlots.emit(this.displayWorkDayBreakSlots);

  } // sendDisplayWorkDayBreakSlots

} // class DisplayWorkDayBreakSlotsComponent
// ----------------------------------------------------------------------------
