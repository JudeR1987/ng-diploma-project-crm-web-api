// ----------------------------------------------------------------------------
// компонент отображения страницы приложения со сведениями о приложении
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {Resources} from '../../infrastructure/Resources';
import {IAboutComponent} from '../../models/interfaces/IAboutComponent';
import {WebApiService} from '../../services/web-api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: IAboutComponent = {
    // параметры меняющиеся при смене языка
    title:    Literals.empty,
    // параметры НЕ меняющиеся при смене языка
    language: Literals.empty,
    route:    Literals.empty
  };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута и подключения к сервису установки языка
  constructor(private _router: Router,
              private _languageService: LanguageService,
              private _webApiService: WebApiService) {
    Utils.helloComponent(Literals.about);

    // получить маршрут
    this.component.route = this._router.url.slice(1);

  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit(): void {

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

      }); // subscribe

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    // задать значение языка отображения
    this.component.language = language;

    // установить значения строковых переменных
    this.component.title = Resources.aboutTitle[this.component.language];

  } // changeLanguageLiterals


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy(): void {

    // отмена подписки
    this._languageSubscription.unsubscribe();

  } // ngOnDestroy

} // class AboutComponent
// ----------------------------------------------------------------------------
