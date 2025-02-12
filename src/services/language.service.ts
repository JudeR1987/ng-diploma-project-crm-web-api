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
    console.log(`[-LanguageService-constructor--`);
    console.log(`*-(было)-this._language: '${this._language}' -*`);

    // прочитать значение языка отображения из локального хранилища
    this.loadLanguageFromLocalStorage();

    console.log(`--LanguageService-constructor-]`);
  } // constructor


  // чтение свойства
  get language(): string { return this._language; }


  // запись свойства (записываем значение языка отображения
  // в свойство-хранилище и передаём данные подписчикам)
  set language(value: string) {
    console.log(`[-LanguageService-set--`);

    console.log(`*-(было)-this._language: '${this._language}' -*`);

    // сохранить данные
    this._language = value;

    console.log(`*-(стало)-this._language: '${this._language}' -*`);

    // передать данные
    this.languageSubject.next(value);

    console.log(`--LanguageService-set-]`);
  } // set


  // запись значения языка отображения в локальное хранилище
  saveLanguageToLocalStorage(): void {
    console.log(`[-LanguageService-saveLanguageToLocalStorage--`);

    localStorage.setItem(Literals.language, this._language);

    console.log(`--LanguageService-saveLanguageToLocalStorage-]`);
  } // saveLanguageToLocalStorage


  // чтение значения языка отображения из локального хранилища
  loadLanguageFromLocalStorage(): void {

    console.log(`[-LanguageService-loadLanguageFromLocalStorage--`);

    // получить запись из хранилища, если она есть
    console.log(`*-(было)-this._language: '${this._language}' -*`);
    this._language = localStorage.getItem(Literals.language) ?? Literals.rus;
    console.log(`*-(стало)-this._language: '${this._language}' -*`);

    console.log(`--LanguageService-loadLanguageFromLocalStorage-]`);

  } // loadLanguageFromLocalStorage

} // class LanguageService
// ----------------------------------------------------------------------------
