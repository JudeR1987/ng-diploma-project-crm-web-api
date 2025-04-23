// ----------------------------------------------------------------------------
// компонент отображения строки таблицы с данными о записи
// ----------------------------------------------------------------------------
import {Component, Input} from '@angular/core';
import {Literals} from '../../../infrastructure/Literals';
import {DatePipe, DecimalPipe} from '@angular/common';
import {Record} from '../../../models/classes/Record';

@Component({
  selector: '[tr-record]',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './tr-record.component.html',
  styleUrl: './tr-record.component.css'
})
export class TrRecordComponent {

  // номер выводимой строки таблицы
  @Input() row: number = Literals.zero;

  // сведения о клиенте
  @Input() record: Record = new Record();

  protected readonly empty: string = Literals.empty;
  protected readonly zero: number  = Literals.zero;
  protected readonly one: number   = Literals.one;

} // class TrRecordComponent
// ----------------------------------------------------------------------------
