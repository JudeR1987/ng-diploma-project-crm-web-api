import {Component, Input} from '@angular/core';
import {Person} from '../../../temp/Person';

@Component({
  selector: '[tr-person]',
  standalone: true,
  imports: [],
  templateUrl: './tr-person.component.html',
  styleUrl: './tr-person.component.css'
})
export class TrPersonComponent {

  // номер выводимой строки таблицы
  @Input() row: number = 0;

  // сведения о персональных данных
  @Input() person: Person = new Person();

} // class TrPersonComponent
