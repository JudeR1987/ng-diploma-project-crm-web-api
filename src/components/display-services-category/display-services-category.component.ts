// ----------------------------------------------------------------------------
// компонент отображения данных о категории услуг салона с соответствующим
// списком услуг салона (collapsable-элемент)
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {DisplayServicesCategory} from '../../models/classes/DisplayServicesCategory';
import {Literals} from '../../infrastructure/Literals';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'display-services-category',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './display-services-category.component.html',
  styleUrl: './display-services-category.component.css'
})
export class DisplayServicesCategoryComponent {

  // входные параметры
  // флаг включения режима выбора услуг
  // (при записи в салон или при добавлении/удалении услуг сотруднику)
  @Input() isCheckingFlag: boolean = false;

  // флаг включения режима disabled при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // флаг переключения картинки при открытии/закрытии скрываемого элемента
  @Input() isShowFlag: boolean = false;

  // начальный фрагмент всплывающей подсказки на поле отображения наименования категории услуг
  @Input() collapseServicesCategoryNameTitleStart: string = Literals.empty;

  // начальный фрагмент всплывающей подсказки чек-бокса выбора услуги
  @Input() labelIsSelectedServiceTitleStart: string = Literals.empty;

  // всплывающая подсказка на фрагменте отображения цены услуги
  @Input() labelPriceTitle: string = Literals.empty;

  // значение фрагмента отображения цены услуги
  @Input() labelPriceValue: string = Literals.empty;

  // всплывающая подсказка на фрагменте отображения минимальной цены услуги
  @Input() labelMinPriceTitle: string = Literals.empty;

  // значение фрагмента отображения минимальной цены услуги
  @Input() labelMinPriceValue: string = Literals.empty;

  // всплывающая подсказка на фрагменте отображения максимальной цены услуги
  @Input() labelMaxPriceTitle: string = Literals.empty;

  // значение фрагмента отображения максимальной цены услуги
  @Input() labelMaxPriceValue: string = Literals.empty;

  // всплывающая подсказка на фрагменте отображения длительности услуги
  @Input() labelDurationTitle: string = Literals.empty;

  // значение фрагмента отображения длительности услуги
  @Input() labelDurationValue: string = Literals.empty;

  // всплывающая подсказка на кнопке "отправителяServicesCategoryId"
  @Input() butSenderServicesCategoryIdTitle: string = Literals.empty;

  // всплывающая подсказка на кнопке "отправителяServiceIdModeEdit"
  @Input() butSenderServiceIdModeEditTitle: string = Literals.empty;

  // всплывающая подсказка на кнопке "отправителяServiceIdModeDelete"
  @Input() butSenderServiceIdModeDeleteTitle: string = Literals.empty;

  // объект сведений о категории услуг с коллекцией услуг для отображения
  @Input() displayServicesCategory: DisplayServicesCategory = new DisplayServicesCategory();

  // массив идентификаторов выбранных услуг
  @Input() selectedServicesIds: number[] = [];

  // свойство для генерации события передачи данных об Id выбранной категории услуг
  @Output() onSendServicesCategoryId: EventEmitter<number> = new EventEmitter<number>();

  // свойство для генерации события передачи данных об Id выбранной услуги для изменения/удаления
  // (передаём режим - mode: editService-изменение, deleteService-удаление)
  @Output() onSendServiceIdMode: EventEmitter<{ servicesCategoryId: number, serviceId: number, mode: string }> =
    new EventEmitter<{ servicesCategoryId: number, serviceId: number, mode: string }>();

  // свойство для генерации события передачи данных об Id выбранной услуги
  // (в режиме выбора чек-боксом)
  @Output() onSendSelectedServiceId: EventEmitter<{ serviceId: number, isSelected: boolean }> =
    new EventEmitter<{ serviceId: number, isSelected: boolean }>();

  // дополнительные свойства
  protected readonly editService: string   = Literals.editService;
  protected readonly deleteService: string = Literals.deleteService;


  // конструктор
  constructor() {
  } // constructor


  // метод передачи данных об Id выбранной категории услуг
  sendServicesCategoryId(servicesCategoryId: number): void {

    // зажигаем событие передачи данных
    this.onSendServicesCategoryId.emit(servicesCategoryId);

  } // sendServicesCategoryId


  // метод передачи данных об Id выбранной услуги
  sendServiceIdMode(servicesCategoryId: number, serviceId: number, mode: string): void {

    // зажигаем событие передачи данных
    this.onSendServiceIdMode.emit({
      servicesCategoryId: servicesCategoryId, serviceId: serviceId, mode: mode
    });

  } // sendServiceIdMode


  // метод передачи данных об Id выбранной услуги
  sendSelectedServiceId(serviceId: number, checkbox: HTMLInputElement): void {

    // зажигаем событие передачи данных
    this.onSendSelectedServiceId.emit({ serviceId: serviceId, isSelected: checkbox.checked });

  } // sendSelectedServiceId


  // метод для выбора заданных услуг
  setChecked(serviceId: number): boolean {
    return this.selectedServicesIds.some((id: number) => id === serviceId);
  } // setChecked

} // class DisplayServicesCategoryComponent
// ----------------------------------------------------------------------------
