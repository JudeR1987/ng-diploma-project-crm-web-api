// ----------------------------------------------------------------------------
// компонент отображения формы входа в аккаунт
// ----------------------------------------------------------------------------
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {Utils} from '../../infrastructure/Utils';
import {Literals} from '../../infrastructure/Literals';
import {Resources} from '../../infrastructure/Resources';
import {ILoginComponent} from '../../models/interfaces/ILoginComponent';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  // объект с параметрами компонента
  public component: ILoginComponent =
    { title: Literals.empty, language: Literals.empty, route: Literals.empty };

  // объект подписки на изменение языка, для отмены подписки при уничтожении компонента
  private _languageSubscription: Subscription = new Subscription();


  // конструктор с DI для подключения к объекту маршрутизатора
  // для получения маршрута и подключения к сервису установки языка
  constructor(private _router: Router, private _languageService: LanguageService) {
    Utils.helloComponent(Literals.login);

    console.log(`[-LoginComponent-constructor--`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // получить маршрут
    this.component.route = this._router.url.slice(1);
    console.log(`*-this.component.route='${this.component.route}'-*`);

    console.log(`--LoginComponent-constructor-]`);

  } // constructor


  // 0. установка языка отображения и значений строковых
  // переменных сразу после загрузки компонента
  ngOnInit(): void {

    console.log(`[-LoginComponent-ngOnInit--`);

    // задать значение языка отображения и установить
    // значения строковых переменных
    this.changeLanguageLiterals(this._languageService.language);

    // подписаться на изменение значения названия выбранного языка
    this._languageSubscription = this._languageService.subject
      .subscribe((language: string) => {
        console.log(`[-LoginComponent-subscribe--`);
        console.log(`*-subscribe-language='${language}'-*`);

        // задать значение языка отображения и установить
        // значения строковых переменных
        this.changeLanguageLiterals(language);

        console.log(`--LoginComponent-subscribe-]`);

      }); // subscribe

    console.log(`--LoginComponent-ngOnInit-]`);

  } // ngOnInit


  // метод изменения значения языка отображения
  // и переназначения строковых переменных
  changeLanguageLiterals(language: string): void {

    console.log(`[-LoginComponent-changeLanguageLiterals--`);

    console.log(`*-input-language='${language}'-*`);
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // задать значение языка отображения
    this.component.language = language;
    console.log(`*-this.component.language='${this.component.language}'-*`);

    // установить значения строковых переменных
    this.component.title = Resources.loginTitle[this.component.language];

    console.log(`--LoginComponent-changeLanguageLiterals-]`);

  } // changeLanguageLiterals


  // отмена подписки на изменение значения языка
  // отображения при уничтожении компонента
  ngOnDestroy(): void {

    console.log(`[-LoginComponent-ngOnDestroy--`);

    this._languageSubscription.unsubscribe();

    console.log(`--LoginComponent-ngOnDestroy-]`);

  } // ngOnDestroy

} // class LoginComponent
// ----------------------------------------------------------------------------
