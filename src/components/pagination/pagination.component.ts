// ----------------------------------------------------------------------------
// компонент отображения данных о пагинации страницы
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {PageViewModel} from '../../infrastructure/PageViewModel';
import {Literals} from '../../infrastructure/Literals';

@Component({
  selector: 'pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  // входные параметры
  // информация о пагинации страницы
  @Input() pageViewModel: PageViewModel = new PageViewModel();

  // всплывающая подсказка на кнопке "перейти на 1-ю"
  @Input() butToFirstPageTitle: string = Literals.empty;

  // всплывающая подсказка на кнопке "перейти на предыдущую"
  @Input() butPreviousTitle: string = Literals.empty;

  // значение кнопки "перейти на предыдущую"
  @Input() butPreviousValue: string = Literals.empty;

  // всплывающая подсказка на кнопке "текущая страница"
  @Input() butCurrentPageTitle: string = Literals.empty;

  // всплывающая подсказка на кнопке "перейти на следующую"
  @Input() butNextTitle: string = Literals.empty;

  // значение кнопки "перейти на следующую"
  @Input() butNextValue: string = Literals.empty;

  // всплывающая подсказка на кнопке "перейти на последнюю"
  @Input() butToLastPageTitle: string = Literals.empty;

  // свойство для генерации события передачи
  // данных о номере выбранной страницы
  @Output() onSendPage: EventEmitter<number> = new EventEmitter<number>();

  // свойство для ограничения отображения кнопок пагинации
  protected readonly one: number = Literals.one
  protected readonly two: number = Literals.two
  protected readonly ellipsis: string = Literals.ellipsis


  // конструктор
  constructor() {
  } // constructor


  // метод передачи данных
  sendPage(page: number): void {

    // зажигаем событие передачи данных
    this.onSendPage.emit(page);

  } // sendCompanyId

} // class TempComponent
// ----------------------------------------------------------------------------
