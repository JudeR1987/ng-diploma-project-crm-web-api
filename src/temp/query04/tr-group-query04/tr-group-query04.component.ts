import {Component, Input} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {IQuery04} from '../../../temp/IQuery04';

@Component({
  selector: '[tr-group-query04]',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './tr-group-query04.component.html',
  styleUrl: './tr-group-query04.component.css'
})
export class TrGroupQuery04Component {

  // номер выводимой строки таблицы
  @Input() row: number = 0;

  // сведения о записи группы
  @Input() group: IQuery04 = {
    purpose: '', amountTrips: 0, minDayCost: 0, avgDayCost: 0, maxDayCost: 0
  };

} // class TrGroupQuery04Component
