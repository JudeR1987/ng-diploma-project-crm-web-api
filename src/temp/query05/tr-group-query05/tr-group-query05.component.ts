import {Component, Input} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {IQuery05} from '../../../temp/IQuery05';

@Component({
  selector: '[tr-group-query05]',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './tr-group-query05.component.html',
  styleUrl: './tr-group-query05.component.css'
})
export class TrGroupQuery05Component {

  // номер выводимой строки таблицы
  @Input() row: number = 0;

  // сведения о записи группы
  @Input() group: IQuery05 = {
    country: '', amountTrips: 0, minTransportCost: 0, avgTransportCost: 0, maxTransportCost: 0
  };

} // class TrGroupQuery05Component
