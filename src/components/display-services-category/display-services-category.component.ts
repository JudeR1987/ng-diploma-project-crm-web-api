// ----------------------------------------------------------------------------
// компонент отображения данных о категории услуг салона с соответствующим
// списком услуг салона (collapsable-элемент)
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output, OnInit, OnDestroy} from '@angular/core';
import {DisplayServicesCategory} from '../../models/classes/DisplayServicesCategory';
import {Literals} from '../../infrastructure/Literals';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'display-services-category',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './display-services-category.component.html',
  styleUrl: './display-services-category.component.css'
})
export class DisplayServicesCategoryComponent implements OnInit, OnDestroy {

  // входные параметры

  // флаг включения спиннера при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // флаг включения режима выбора услуг при записи в салон
  @Input() isRecordFlag: boolean = false;

  // флаг включения режима редактирования услуг при управлении услугами
  @Input() isManagementFlag: boolean = false;

  // начальный фрагмент всплывающей подсказки на поле отображения наименования категории услуг
  @Input() collapseServicesCategoryNameTitleStart: string = Literals.empty;

  // всплывающая подсказка на кнопке "отправителяServicesCategoryId"
  @Input() butSenderServicesCategoryIdTitle: string = Literals.empty;

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

  // всплывающая подсказка на кнопке "отправителяServiceIdModeEdit"
  @Input() butSenderServiceIdModeEditTitle: string = Literals.empty;

  // значение кнопки "отправителяServiceIdModeEdit"
  //@Input() butSenderServiceIdModeEditValue: string = Literals.empty;

  // всплывающая подсказка на кнопке "отправителяServiceIdModeDelete"
  @Input() butSenderServiceIdModeDeleteTitle: string = Literals.empty;

  // значение кнопки "отправителяServiceIdModeDelete"
  //@Input() butSenderServiceIdModeDeleteValue: string = Literals.empty;

  // объект сведений о категории услуг с коллекцией услуг для отображения
  @Input() displayServicesCategory: DisplayServicesCategory = new DisplayServicesCategory();

  // массив идентификаторов выбранных услуг
  @Input() selectedServicesIds: number[] = [];

  // флаг переключения картинки при открытии/закрытии скрываемого элемента
  public isShowFlag: boolean = false;

  // свойство для генерации события передачи данных об Id выбранной категории услуг
  @Output() onSendServicesCategoryId: EventEmitter<number> = new EventEmitter<number>();

  // свойство для генерации события передачи данных об Id выбранной услуги
  // (передаём режим - mode: editService-изменение, chooseService-выбор для чек-бокса)
  @Output() onSendServiceIdMode: EventEmitter<{ servicesCategoryId: number, serviceId: number, mode: string }> =
    new EventEmitter<{ servicesCategoryId: number, serviceId: number, mode: string }>();

  // свойство для генерации события передачи данных об Id выбранной услуги
  @Output() onSendSelectedServiceId: EventEmitter<{ serviceId: number, isSelected: boolean }> =
    new EventEmitter<{ serviceId: number, isSelected: boolean }>();

  // дополнительные свойства
  protected readonly editService: string = Literals.editService;
  protected readonly deleteService: string = Literals.deleteService;


  // конструктор
  constructor() {
    console.log(`[-DisplayServicesCategoryComponent-constructor--`);

    console.log(`*-this.displayServicesCategory: -*`);
    console.dir(this.displayServicesCategory);

    console.log(`--DisplayServicesCategoryComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit() {
    console.log(`[-DisplayServicesCategoryComponent-ngOnInit--`);

    console.log(`*- параметры должны быть получены -*`);
    console.log(`*-this.displayServicesCategory: -*`);
    console.dir(this.displayServicesCategory);

    console.log(`--DisplayServicesCategoryComponent-ngOnInit-]`);
  } // ngOnInit


  // метод передачи данных об Id выбранной категории услуг
  sendServicesCategoryId(servicesCategoryId: number): void {
    console.log(`[-DisplayServicesCategoryComponent-sendServicesCategoryId--`);

    // зажигаем событие передачи данных
    this.onSendServicesCategoryId.emit(servicesCategoryId);

    console.log(`--DisplayServicesCategoryComponent-sendServicesCategoryId-]`);
  } // sendServicesCategoryId


  // метод передачи данных об Id выбранной услуги
  sendServiceIdMode(servicesCategoryId: number, serviceId: number, mode: string): void {
    console.log(`[-DisplayServicesCategoryComponent-sendServiceId--`);

    // зажигаем событие передачи данных
    this.onSendServiceIdMode.emit({
      servicesCategoryId: servicesCategoryId, serviceId: serviceId, mode: mode
    });

    console.log(`--DisplayServicesCategoryComponent-sendServiceId-]`);
  } // sendServiceIdMode


  // метод передачи данных об Id выбранной услуги
  sendSelectedServiceId(serviceId: number, checkbox: HTMLInputElement): void {
    console.log(`[-DisplayServicesCategoryComponent-sendSelectedServiceId--`);

    console.log(`*- serviceId: '${serviceId}' [${typeof serviceId}] -*`);
    //console.log(`*- checkbox: -*`);
    //console.dir(checkbox);
    //console.log(`*- checkbox.value: '${checkbox.value}' [${typeof checkbox.value}] -*`);
    console.log(`*- checkbox.checked: '${checkbox.checked}' [${typeof checkbox.checked}] -*`);

    // зажигаем событие передачи данных
    this.onSendSelectedServiceId.emit({ serviceId: serviceId, isSelected: checkbox.checked });

    console.log(`--DisplayServicesCategoryComponent-sendSelectedServiceId-]`);
  } // sendSelectedServiceId


  // метод для выбора заданных услуг
  setChecked(serviceId: number): boolean {
    //console.log(`[-DisplayServicesCategoryComponent-setChecked--`);

    //console.log(`*- serviceId: '${serviceId}' [${typeof serviceId}] -*`);

    //console.log(`--DisplayServicesCategoryComponent-setChecked-]`);
    return this.selectedServicesIds.some((id: number) => id === serviceId);
  } // setChecked


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-DisplayServicesCategoryComponent-ngOnDestroy--`);
    console.log(`--DisplayServicesCategoryComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class DisplayServicesCategoryComponent
// ----------------------------------------------------------------------------
