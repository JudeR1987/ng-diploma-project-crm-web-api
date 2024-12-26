import {Component, Input} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Country} from '../../Country';

@Component({
  selector: '[tr-country]',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './tr-country.component.html',
  styleUrl: './tr-country.component.css'
})
export class TrCountryComponent {

  // номер выводимой строки таблицы
  @Input() row: number = 0;

  // сведения о стране
  @Input() country: Country = new Country();

} // class TrCountryComponent
