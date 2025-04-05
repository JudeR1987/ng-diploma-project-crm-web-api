// ----------------------------------------------------------------------------
// компонент отображения данных о сотруднике компании в виде карточки
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output, OnInit, OnDestroy} from '@angular/core';
import {Employee} from '../../models/classes/Employee';
import {Literals} from '../../infrastructure/Literals';

@Component({
  selector: 'card-employee',
  standalone: true,
  imports: [],
  templateUrl: './card-employee.component.html',
  styleUrl: './card-employee.component.css'
})
export class CardEmployeeComponent implements OnInit, OnDestroy {

  // входные параметры

  // флаг включения режима редактирования данных о сотруднике
  @Input() isManagementFlag: boolean = false;

  // объект сведений о сотруднике компании для отображения
  @Input() employee: Employee = new Employee();

  // начальный фрагмент всплывающей подсказки на поле отображения рейтинга сотрудника
  @Input() ratingTitleStart: string = Literals.empty;

  // заголовок поля отображения имени сотрудника
  @Input() labelName: string = Literals.empty;

  // заголовок поля отображения телефона сотрудника
  @Input() labelPhone: string = Literals.empty;

  // заголовок поля отображения e-mail сотрудника
  @Input() labelEmail: string = Literals.empty;

  // заголовок поля отображения специальности сотрудника
  @Input() labelSpecialization: string = Literals.empty;

  // заголовок поля отображения должности сотрудника
  @Input() labelPosition: string = Literals.empty;

  // заголовок поля отображения рейтинга сотрудника
  // @Input() labelRating: string = Literals.empty;

  // всплывающая подсказка на кнопке "отправителяIDModeSchedule" ("показать расписание")
  @Input() butSenderEmployeeIdModeScheduleTitle: string = Literals.empty;

  // значение кнопки "отправителяIDModeSchedule" ("показать расписание")
  @Input() butSenderEmployeeIdModeScheduleValue: string = Literals.empty;

  // всплывающая подсказка на кнопке "отправителяIDModeServices" ("показать услуги")
  @Input() butSenderEmployeeIdModeServicesTitle: string = Literals.empty;

  // значение кнопки "отправителяIDModeServices" ("показать услуги")
  @Input() butSenderEmployeeIdModeServicesValue: string = Literals.empty;

  // всплывающая подсказка на кнопке "отправителяIDModeEdit" ("изменить")
  @Input() butSenderEmployeeIdModeEditTitle: string = Literals.empty;

  // всплывающая подсказка на кнопке "отправителяIDModeDelete" ("удалить")
  @Input() butSenderEmployeeIdModeDeleteTitle: string = Literals.empty;

  // путь расположения фотографий в приложении
  public srcPhotoPath: string = Literals.srcPhotoPath;

  // имя файла с фотографией сотрудника по умолчанию
  public fileNamePhotoDef: string = Literals.fileNamePhotoDef;

  // свойство для генерации события передачи данных об Id выбранного сотрудника компании
  // (передаём режим - mode:
  // showSchedule-показать расписание, showServices-показать услуги,
  // editEmployee-изменение, deleteEmployee-удаление)
  @Output() onSendEmployeeIdMode: EventEmitter<{ employeeId: number, mode: string }> =
    new EventEmitter<{ employeeId: number, mode: string }>();

  // дополнительные свойства
  protected readonly showSchedule: string   = Literals.showSchedule;  // "показать расписание"
  protected readonly showServices: string   = Literals.showServices;  // "показать услуги"
  protected readonly editEmployee: string   = Literals.editEmployee;
  protected readonly deleteEmployee: string = Literals.deleteEmployee;


  // конструктор
  constructor() {
    console.log(`[-CardEmployeeComponent-constructor--`);

    console.log(`*-this.employee: -*`);
    console.dir(this.employee);

    console.log(`--CardEmployeeComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit() {
    console.log(`[-CardEmployeeComponent-ngOnInit--`);

    console.log(`*- параметры должны быть получены -*`);
    console.log(`*-this.employee: -*`);
    console.dir(this.employee);

    console.log(`--CardEmployeeComponent-ngOnInit-]`);
  } // ngOnInit


  // метод передачи данных об Id выбранного сотрудника
  sendEmployeeIdMode(mode: string): void {
    console.log(`[-CardEmployeeComponent-sendEmployeeIdMode--`);

    // зажигаем событие передачи данных
    this.onSendEmployeeIdMode.emit({
      employeeId: this.employee.id, mode: mode
    });

    console.log(`--CardEmployeeComponent-sendEmployeeIdMode-]`);
  } // sendEmployeeIdMode


  // метод отображения рейтинга в виде звёзд
  // (рейтинг сотрудника отображают закрашенные звёзды)
  ratingToStar(rating: number): string {

    let maxRating: number = Literals.five;

    let string: string = Literals.empty;

    // рейтинг сотрудника
    for (let i: number = 0; i < rating; i++) {
      string += `<span>&starf;</span>`;
    } // for

    // дополнение до максимального рейтинга
    for (let i: number = 0; i < maxRating - rating; i++) {
      string += `<span>&star;</span>`;
    } // for

    return string;
  } // ratingToStar


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-CardEmployeeComponent-ngOnDestroy--`);
    console.log(`--CardEmployeeComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class CardEmployeeComponent
// ----------------------------------------------------------------------------
