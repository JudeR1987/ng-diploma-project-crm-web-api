import {Component, Input} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Purpose} from '../../../temp/Purpose';

@Component({
  selector: '[tr-purpose]',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './tr-purpose.component.html',
  styleUrl: './tr-purpose.component.css'
})
export class TrPurposeComponent {

  // номер выводимой строки таблицы
  @Input() row: number = 0;

  // сведения о стране
  @Input() purpose: Purpose = new Purpose();

} // class TrPurposeComponent
