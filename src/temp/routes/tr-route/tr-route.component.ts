import {Component, Input} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Route} from '../../../temp/Route';

@Component({
  selector: '[tr-route]',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './tr-route.component.html',
  styleUrl: './tr-route.component.css'
})
export class TrRouteComponent {

  // номер выводимой строки таблицы
  @Input() row: number = 0;

  // сведения о маршруте
  @Input() route: Route = new Route();

} // class TrRouteComponent
