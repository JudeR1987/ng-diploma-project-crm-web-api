// ----------------------------------------------------------------------------
// сервис хранения значения языка отображения данных в приложении
// (сервис передачи строкового значения названия выбранного языка,
// подписавшимся на изменения этого значения компонентам)
// ----------------------------------------------------------------------------
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  // свойство для установки языка отображения данных на странице
  private _language: string = '';

  // объект для передачи строкового значения названия выбранного языка
  public subject: Subject<string> = new Subject<string>();


  constructor() {
    console.log(`[-LanguageService-constructor-]`);
  } // constructor


  // открытые аксессоры свойств
  get language(): string { return this._language; }

  set language(value: string) { this._language = value; }

} // class LanguageService
// ----------------------------------------------------------------------------
