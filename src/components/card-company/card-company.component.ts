// ----------------------------------------------------------------------------
// компонент отображения данных о компании в виде карточки
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Company} from '../../models/classes/Company';
import {Literals} from '../../infrastructure/Literals';

@Component({
  selector: 'card-company',
  standalone: true,
  imports: [],
  templateUrl: './card-company.component.html',
  styleUrl: './card-company.component.css'
})
export class CardCompanyComponent {

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

  // путь расположения изображений логотипов в приложении
  public srcLogoPath: string = Literals.srcLogoPath;

  // имя файла с изображением логотипа по умолчанию
  public fileNameLogoDef: string = Literals.fileNameLogoDef;

  // путь расположения изображений в приложении
  public srcImagePath: string = Literals.srcImagePath;

  // имя файла с основным изображением компании по умолчанию
  public fileNameCompanyTitleImageDef: string = Literals.fileNameCompanyTitleImageDef;

  // свойство для генерации события передачи данных об Id выбранной компании
  @Output() onSendCompanyId: EventEmitter<number> = new EventEmitter<number>();


  // конструктор
  constructor() {
  } // constructor


  // метод передачи данных
  sendCompanyId(): void {

    // зажигаем событие передачи данных
    this.onSendCompanyId.emit(this.company.id);

  } // sendCompanyId

} // class CardCompanyComponent
// ----------------------------------------------------------------------------
