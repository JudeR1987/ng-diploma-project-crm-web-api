import {Component} from '@angular/core';
import {TaskTablesComponent} from "../task-tables/task-tables.component";

@Component({
  selector: 'task-button',
  standalone: true,
  imports: [TaskTablesComponent],
  templateUrl: './task-button.component.html',
  styleUrl: './task-button.component.css'
})
export class TaskButtonComponent {

} // class TaskButtonComponent
