// ----------------------------------------------------------------------------
// сервис хранения значения языка отображения данных в приложении
// (сервис передачи строкового значения названия выбранного языка,
// подписавшимся на изменения этого значения компонентам)
// ----------------------------------------------------------------------------
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Literals} from '../infrastructure/Literals';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  // свойство для хранения значения языка отображения данных на странице
  private _language: string = Literals.empty;

  // объект для передачи строкового значения названия выбранного языка
  public languageSubject: Subject<string> = new Subject<string>();


  // в конструкторе получим исходное значение языка отображения
  constructor() {

    // прочитать значение языка отображения из локального хранилища
    this.loadLanguageFromLocalStorage();

  } // constructor


  // чтение свойства
  get language(): string { return this._language; }


  // запись свойства (записываем значение языка отображения
  // в свойство-хранилище и передаём данные подписчикам)
  set language(value: string) {

    // сохранить данные
    this._language = value;

    // передать данные
    this.languageSubject.next(value);

  } // set


  // запись значения языка отображения в локальное хранилище
  saveLanguageToLocalStorage(): void {
    localStorage.setItem(Literals.language, this._language);
  } // saveLanguageToLocalStorage


  // чтение значения языка отображения из локального хранилища
  loadLanguageFromLocalStorage(): void {

    // получить запись из хранилища, если она есть
    this._language = localStorage.getItem(Literals.language) ?? Literals.rus;

  } // loadLanguageFromLocalStorage

} // class LanguageService
// ----------------------------------------------------------------------------
