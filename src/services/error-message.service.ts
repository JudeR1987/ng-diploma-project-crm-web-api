// ----------------------------------------------------------------------------
// сервис хранения значения сообщения об ошибке для отображения в AppComponent
// ----------------------------------------------------------------------------
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  // объект для передачи строкового значения сообщения об ошибке
  public errorMessageSubject: Subject<string> = new Subject<string>();

  constructor() {
    console.log(`[-ErrorMessageService-constructor-]`);
  } // constructor

} // class ErrorMessageService
// ----------------------------------------------------------------------------
