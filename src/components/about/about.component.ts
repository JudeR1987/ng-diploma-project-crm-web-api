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
import {User} from '../../models/classes/User';
import {WebApiService} from '../../services/web-api.service';
import {Config} from '../../infrastructure/Config';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  //public route: string = Literals.empty;

  // параметр языка отображения
  //public language: string = Literals.empty;

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

    console.log(`[-AboutComponent-constructor--`);

    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1);
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`--AboutComponent-constructor-]`);

  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit(): void {

    console.log(`[-AboutComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    console.log(`*-this.component.language='${this.component.language}'-*`);
    console.log(`*-this._languageService.language='${this._languageService.language}'-*`);
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.languageSubject
      .subscribe((language: string) => {
        console.log(`[-AboutComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--AboutComponent-subscribe-]`);

      }); // subscribe

    // пока не нужно, но не удалять!!!
    /*// получить jwt-токен
    let token: string | null = localStorage.getItem(Literals.jwt);
    console.log(`--AboutComponent-ngOnInit-token: ${token}`);

    // получить данные о пользователе
    let user: User = User.loadUser();

    // подписка на получение результата запроса
    this._webApiService.refreshPOST(Config.urlAuthRefresh, user).subscribe({

      // вызов метода при получении данных
      next: (webResult: {token: string, user: User} ) => {

        console.log(`[-AboutComponent-ngOnInit-subscribe-`);

        console.dir(webResult);
        console.dir(webResult.token);
        console.dir(webResult.user);

        console.log(`--AboutComponent-ngOnInit-subscribe-]`);

      }, // next

      // вызов метода при обнаружении ошибки в данных
      error: (err: any) => {
        console.dir(err);
      } // error

    }); // refreshPOST*/

    console.log(`--AboutComponent-ngOnInit-]`);

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    console.log(`[-AboutComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title = Resources.aboutTitle[this.component.language];

    console.log(`--AboutComponent-changeLanguageLiterals-]`);

  } // changeLanguageLiterals


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy(): void {

    console.log(`[-AboutComponent-ngOnDestroy--`);

    // отмена подписки
    this._languageSubscription.unsubscribe();

    console.log(`--AboutComponent-ngOnDestroy-]`);

  } // ngOnDestroy

} // class AboutComponent
// ----------------------------------------------------------------------------
