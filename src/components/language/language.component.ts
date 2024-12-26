// ----------------------------------------------------------------------------
// компонент для изменения значения языка отображения данных в приложении,
// использует сервис LanguageService для передачи другим компонентам этого
// значения, подписавшимся на изменения
// ----------------------------------------------------------------------------
import {Component, Input, OnInit} from '@angular/core';
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
  @Input() public language: string = Literals.empty;

  // объект с параметрами компонента
  public component: ILanguageComponent = {
    //selectTitle: Literals.empty,
    dropdownTitle: Literals.empty,
    //optionTitleRus: Literals.empty,
    imageTitleRus: Literals.empty,
    //optionTitleEng: Literals.empty,
    imageTitleEng: Literals.empty,
    languageRus: Literals.rus,
    languageEng: Literals.eng,
    srcImage: Literals.srcImage,
    fileNameImageRus: Literals.fileNameImageRus,
    fileNameImageEng: Literals.fileNameImageEng
  };


  // конструктор с DI для подключения к сервису установки языка
  constructor(private _languageService: LanguageService) {
    Utils.helloComponent(Literals.language);

    console.log(`[-LanguageComponent-constructor--`);
    console.log(`*-language='${this.language}'-*`);
    console.log(`--LanguageComponent-constructor-]`);

  } // constructor


  // 0. получение от AppComponent значения языка отображения
  // сразу после загрузки компонента
  ngOnInit(): void {

    console.log(`[-LanguageComponent-ngOnInit--`);
    console.log(`*-language='${this.language}'-*`);

    // сохраним значение языка отображения в поле сервиса
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this._languageService.language = this.language;
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // установить значения строковых переменных
    this.changeLiterals();

    // задать значение языка отображения
    //this.changeLanguage();

    console.log(`--LanguageComponent-ngOnInit-]`);

  } // ngOnInit


  // обработчик события изменения значения языка отображения
  changeLanguage(language: string): void {

    console.log(`[-LanguageComponent-changeLanguage--`);
    console.log(`*-input-language='${language}'-*`);
    console.log(`*-language='${this.language}'-*`);

    // производим изменение языка, только если язык изменился
    if (this.language != language) {

      // задать значение языка отображения
      this.language = language;
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

    } // if

    console.log(`--LanguageComponent-changeLanguage-]`);

  } // changeLanguage


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


  // метод переназначения строковых переменных
  private changeLiterals(): void {

    console.log(`[-LanguageComponent-changeLiterals--`);

    // установить значения строковых переменных
    //this.component.selectTitle    = Resources.langSelectTitle[this.language];
    this.component.dropdownTitle  = Resources.langDropdownTitle[this.language];
    //this.component.optionTitleRus = Resources.langOptionTitleRus[this.language];
    this.component.imageTitleRus = Resources.langImageTitleRus[this.language];
    //this.component.optionTitleEng = Resources.langOptionTitleEng[this.language];
    this.component.imageTitleEng = Resources.langImageTitleEng[this.language];

    console.log(`--LanguageComponent-changeLiterals-]`);

  } // changeLiterals

} // class LanguageComponent
// ----------------------------------------------------------------------------
