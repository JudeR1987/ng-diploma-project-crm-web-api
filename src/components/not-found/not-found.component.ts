// ----------------------------------------------------------------------------
// компонент отображения страницы приложения
// при вводе незарегистрированного маршрута
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {Resources} from '../../infrastructure/Resources';
import {INotFoundComponent} from '../../models/interfaces/INotFoundComponent';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit, OnDestroy {

  // параметр, передающий маршрут в родительский компонент
  //public route: string = Literals.empty;

  // параметр языка отображения
  //public language: string = Literals.empty;

  // объект с параметрами компонента
  public component: INotFoundComponent =
    { title: Literals.empty, language: Literals.empty, route: Literals.empty };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута и подключения к сервису установки языка
  constructor(private _router: Router, private _languageService: LanguageService) {
    Utils.helloComponent(Literals.notFound);

    console.log(`[-NotFoundComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1);
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`--NotFoundComponent-constructor-]`);

  } // constructor


  // 0. установка языка отображения и значений строковых
  // переменных сразу после загрузки компонента
  ngOnInit(): void {

    console.log(`[-NotFoundComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.subject
      .subscribe((language: string) => {
        console.log(`[-NotFoundComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--NotFoundComponent-subscribe-]`);

      }); // subscribe

    console.log(`--NotFoundComponent-ngOnInit-]`);

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    console.log(`[-NotFoundComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title = Resources.notFoundTitle[this.component.language];

    console.log(`--NotFoundComponent-changeLanguageLiterals-]`);

  } // changeLanguageLiterals


  // отмена подписки на изменение значения языка
  // отображения при уничтожении компонента
  ngOnDestroy(): void {

    console.log(`[-NotFoundComponent-ngOnDestroy--`);

    this._languageSubscription.unsubscribe();

    console.log(`--NotFoundComponent-ngOnDestroy-]`);

  } // ngOnDestroy

} // class NotFoundComponent
// ----------------------------------------------------------------------------
