// ----------------------------------------------------------------------------
// компонент отображения строки таблицы с данными о клиенте
// ----------------------------------------------------------------------------
import {Component, Input} from '@angular/core';
import {Literals} from '../../../infrastructure/Literals';
import {Client} from '../../../models/classes/Client';
import {DatePipe, DecimalPipe} from '@angular/common';

@Component({
  selector: '[tr-client]',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './tr-client.component.html',
  styleUrl: './tr-client.component.css'
})
export class TrClientComponent {

  // номер выводимой строки таблицы
  @Input() row: number = Literals.zero;

  // сведения о клиенте
  @Input() client: Client = new Client();

  protected readonly empty: string = Literals.empty;
  protected readonly zero: number  = Literals.zero;
  protected readonly one: number   = Literals.one;

} // class TrClientComponent
// ----------------------------------------------------------------------------
