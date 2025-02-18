// ----------------------------------------------------------------------------
// компонент для изменения значения языка отображения данных в приложении,
// использует сервис LanguageService для передачи другим компонентам этого
// значения, подписавшимся на изменения
// ----------------------------------------------------------------------------
import {Component, /*Input,*/ OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {Resources} from '../../infrastructure/Resources';
import {FormsModule} from '@angular/forms';
import {ILanguageComponent} from '../../models/interfaces/ILanguageComponent';

@Component({
  selector: 'language-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './language.component.html',
  styleUrl: './language.component.css'
})
export class LanguageComponent implements OnInit {

  // свойство для установки компонентом AppComponent
  // языка отображения данных на странице
  //@Input() public language: string = Literals.empty;
  //public language: string = Literals.empty;

  // объект с параметрами компонента
  public component: ILanguageComponent = {
    // параметры меняющиеся при смене языка
    dropdownTitle:    Literals.empty,
    imageTitleRus:    Literals.empty,
    imageTitleEng:    Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language:         Literals.empty,
    languageRus:      Literals.rus,
    languageEng:      Literals.eng,
    srcImagePath:     Literals.srcImagePath,
    fileNameImageRus: Literals.fileNameImageRus,
    fileNameImageEng: Literals.fileNameImageEng
  };


  // конструктор с DI для подключения к сервису
  // хранения значения языка отображения
  constructor(private _languageService: LanguageService) {
    Utils.helloComponent(Literals.language);

    console.log(`[-LanguageComponent-constructor--`);

    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    console.log(`--LanguageComponent-constructor-]`);

  } // constructor


  // 0. получение значения языка отображения из сервиса
  // сразу после загрузки компонента
  ngOnInit(): void {

    console.log(`[-LanguageComponent-ngOnInit--`);

    // сохраним значение языка отображения в поле сервиса
    //console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    //this._languageService.language = this.language;
    //console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить значение языка отображения из сервиса-хранилища
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.component.language = this._languageService.language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    /*console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);*/

    // установить значения строковых переменных
    this.changeLiterals();

    // задать значение языка отображения
    //this.changeLanguage();

    console.log(`--LanguageComponent-ngOnInit-]`);

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {
    console.log(`[-LanguageComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // производим изменение языка, только если язык изменился
    if (language === this.component.language) {
      console.log(`--LanguageComponent-changeLanguageLiterals-]`);
      return;
    } // if

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // переназначение собственных строковых переменных
    this.changeLiterals();

    // сохраним значение языка отображения в сервисе-хранилище
    // и передать изменённые данные всем подписчикам
    this._languageService.language = this.component.language;

    // запишем данные в хранилище
    this._languageService.saveLanguageToLocalStorage();

    console.log(`--LanguageComponent-changeLanguageLiterals-]`);
  } // changeLanguageLiterals


  // метод переназначения строковых переменных
  private changeLiterals(): void {

    console.log(`[-LanguageComponent-changeLiterals--`);

    // установить значения строковых переменных
    this.component.dropdownTitle = Resources.langDropdownTitle[this.component.language];
    this.component.imageTitleRus = Resources.langImageTitleRus[this.component.language];
    this.component.imageTitleEng = Resources.langImageTitleEng[this.component.language];

    console.log(`--LanguageComponent-changeLiterals-]`);

  } // changeLiterals


  // обработчик события изменения значения языка отображения
  /*changeLanguage(language: string): void {

    console.log(`[-LanguageComponent-changeLanguage--`);
    console.log(`*-input-language='${language}'-*`);
    console.log(`*-language='${this.language}'-*`);

    // производим изменение языка, только если язык изменился
    if (language != this.language) {

      // задать значение языка отображения
      this.language = language;
      console.log(`*-language='${this.language}'-*`);

      // переназначение собственных строковых переменных
      this.changeLiterals();

      // сохраним значение языка отображения в поле сервиса
      this._languageService.language = this.language;

      // сохраним изменения в хранилище
      //localStorage.setItem(Literals.language, this.language);

      // передадим значение языка отображения через объект сервиса
      // другим компонентам, подписавшимся на изменение объекта
      //this._languageService.languageSubject.next(this.language);

    } // if

    console.log(`--LanguageComponent-changeLanguage-]`);

  } // changeLanguage*/


  // обработчик события изменения значения языка отображения
  /*changeLanguage(): void {

    console.log(`[-LanguageComponent-changeLanguage--`);
    console.log(`*-language='${this.language}'-*`);

    // сохраним значение языка отображения в поле сервиса
    this._languageService.language = this.language;

    // сохраним изменения в хранилище
    localStorage.setItem(Literals.language, this.language);

    // переназначение собственных строковых переменных
    this.changeLiterals();

    // передадим значение языка отображения через объект сервиса
    // другим компонентам, подписавшимся на изменение объекта
    this._languageService.subject.next(this.language);

    console.log(`--LanguageComponent-changeLanguage-]`);

  } // changeLanguage*/

} // class LanguageComponent
// ----------------------------------------------------------------------------
