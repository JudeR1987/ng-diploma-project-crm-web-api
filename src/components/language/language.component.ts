// ----------------------------------------------------------------------------
// компонент для изменения значения языка отображения данных в приложении,
// использует сервис LanguageService для передачи другим компонентам этого
// значения, подписавшимся на изменения
// ----------------------------------------------------------------------------
import {Component, OnInit} from '@angular/core';
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
  } // constructor


  // 0. получение значения языка отображения из сервиса
  // сразу после загрузки компонента
  ngOnInit(): void {

    // получить значение языка отображения из сервиса-хранилища
    this.component.language = this._languageService.language;

    // установить значения строковых переменных
    this.changeLiterals();

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // производим изменение языка, только если язык изменился
    if (language === this.component.language) return;

    // задать значение языка отображения
    this.component.language = language;

    // переназначение собственных строковых переменных
    this.changeLiterals();

    // сохраним значение языка отображения в сервисе-хранилище
    // и передать изменённые данные всем подписчикам
    this._languageService.language = this.component.language;

    // запишем данные в хранилище
    this._languageService.saveLanguageToLocalStorage();

  } // changeLanguageLiterals


  // метод переназначения строковых переменных
  private changeLiterals(): void {

    // установить значения строковых переменных
    this.component.dropdownTitle = Resources.langDropdownTitle[this.component.language];
    this.component.imageTitleRus = Resources.langImageTitleRus[this.component.language];
    this.component.imageTitleEng = Resources.langImageTitleEng[this.component.language];

  } // changeLiterals

} // class LanguageComponent
// ----------------------------------------------------------------------------
