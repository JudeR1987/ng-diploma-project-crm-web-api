// ----------------------------------------------------------------------------
// компонент отображения данных о компании в виде карточки
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output, OnInit, OnDestroy} from '@angular/core';
import {Company} from '../../models/classes/Company';
import {Literals} from '../../infrastructure/Literals';

@Component({
  selector: 'card-company',
  standalone: true,
  imports: [],
  templateUrl: './card-company.component.html',
  styleUrl: './card-company.component.css'
})
export class CardCompanyComponent implements OnInit, OnDestroy {

  // входные параметры
  // объект сведений о компании для отображения
  @Input() company: Company = new Company();

  // заголовок поля отображения графика работы компании
  @Input() labelSchedule: string = Literals.empty;

  // заголовок поля отображения телефона компании
  @Input() labelPhone: string = Literals.empty;

  // всплывающая подсказка на кнопке "отправителяID"
  @Input() butSenderCompanyIdTitle: string = Literals.empty;

  // значение кнопки "отправителяID"
  @Input() butSenderCompanyIdValue: string = Literals.empty;

  // режим "онлайн-записи"
  //@Input() isOnlineRecord: boolean = false;

  // путь расположения изображений логотипов в приложении
  public srcLogoPath: string = Literals.srcLogoPath;
  //@Input() srcLogoPath: string = Literals.empty;

  // имя файла с изображением логотипа по умолчанию
  public fileNameLogoDef: string = Literals.fileNameLogoDef;
  //@Input() fileNameLogoDef: string = Literals.empty;

  // путь расположения изображений в приложении
  public srcImagePath: string = Literals.srcImagePath;
  //@Input() srcImagePath: string = Literals.empty;

  // имя файла с основным изображением компании по умолчанию
  public fileNameCompanyTitleImageDef: string = Literals.fileNameCompanyTitleImageDef;
  //@Input() fileNameCompanyTitleImageDef: string = Literals.empty;

  // свойство для генерации события передачи данных об Id выбранной компании
  @Output() onSendCompanyId: EventEmitter<number> = new EventEmitter<number>();

  // свойство для генерации события передачи данных об Id выбранной компании и режима выбора
  /*@Output() onSendCompanyIdMode: EventEmitter<{companyId: number, mode: string}> =
    new EventEmitter<{companyId: number, mode: string}>();*/


  // конструктор
  constructor() {
    console.log(`[-CardCompanyComponent-constructor--`);

    console.log(`*-this.company: -*`);
    console.dir(this.company);

    console.log(`--CardCompanyComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit() {
    console.log(`[-CardCompanyComponent-ngOnInit--`);

    console.log(`*- параметры должны быть получены -*`);
    console.log(`*-this.company: -*`);
    console.dir(this.company);

    console.log(`--CardCompanyComponent-ngOnInit-]`);
  } // ngOnInit


  // метод передачи данных
  sendCompanyId(): void {
    console.log(`[-CardCompanyComponent-sendCompanyId--`);

    // зажигаем событие передачи данных
    this.onSendCompanyId.emit(this.company.id);

    console.log(`--CardCompanyComponent-sendCompanyId-]`);
  } // sendCompanyId


  // метод передачи данных + режим выбора
  /*sendCompanyIdMode(mode: string): void {
    console.log(`[-CardCompanyComponent-sendCompanyIdMode--`);

    // зажигаем событие передачи данных
    this.onSendCompanyIdMode.emit({ companyId: this.company.id, mode: mode });

    console.log(`--CardCompanyComponent-sendCompanyIdMode-]`);
  } // sendCompanyIdMode*/


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-CardCompanyComponent-ngOnDestroy--`);
    console.log(`--CardCompanyComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class CardCompanyComponent
// ----------------------------------------------------------------------------
