import {Component, Input, EventEmitter, Output} from "@angular/core";
import {FormsModule, NgForm} from "@angular/forms";
import {Client} from '../../../temp/Client';
import {IClientFormParams} from '../../../temp/IClientFormParams';

@Component({
  selector: 'client-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent {

  // получаемый объект сведений о клиенте для добавления/изменения
  @Input() client: Client = new Client();

  // объект-копия для обработчика сброса данных в форме
  @Input() clientCopy: Client = new Client();

  // параметры формы добавления/изменения
  @Input() clientFormParams: IClientFormParams = { passportList: [] };

  // флаг включения спиннера при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // флаг запрета взаимодействия с кнопками
  @Input() isDisabledFlag: boolean = false;

  // свойства для генерации событий выдачи данных из компонента
  // добавляемый/изменяемый объект сведений о клиенте
  @Output() onSendClient: EventEmitter<Client> = new EventEmitter<Client>();

  // сообщение об ошибке для вывода в родительском компоненте
  @Output() onSendMessage: EventEmitter<string> = new EventEmitter<string>();


  // метод передачи данных
  sendClient(form: NgForm): void {

    // если значения введены не корректно - остаёмся в форме

    // ввод фамилии клиента
    if (this.client.surname === '') {
      // зажигаем событие передачи сообщения об ошибке
      this.onSendMessage.emit('Фамилия не введена!');
      return;
    } // if

    // ввод имени клиента
    if (this.client.name === '') {
      // зажигаем событие передачи сообщения об ошибке
      this.onSendMessage.emit('Имя не введено!');
      return;
    } // if

    // ввод отчества клиента
    if (this.client.patronymic === '') {
      // зажигаем событие передачи сообщения об ошибке
      this.onSendMessage.emit('Отчество не введено!');
      return;
    } // if

    // ввод паспортных данных клиента
    if (this.client.passport === '') {
      // зажигаем событие передачи сообщения об ошибке
      this.onSendMessage.emit('Данные паспорта не введены!');
      return;
    } // if

    // ввод паспортных данных клиента
    if (this.client.passport.length > 12) {
      // зажигаем событие передачи сообщения об ошибке
      this.onSendMessage.emit(
        'Данные паспорта должны быть не длиннее 12-ти символов!'
      );
      return;
    } // if

    // проверка на уникальность паспортных данных
    if (!this.isUniqPassport()) {
      // зажигаем событие передачи сообщения об ошибке
      this.onSendMessage.emit(
        `Паспортные данные &laquo;${this.client.passport}&raquo; уже существуют!`
      );
      return;
    } // if

    // зажигаем событие передачи данных
    this.onSendClient.emit(this.client);

    // сброс данных формы
    this.client = new Client();

  } // sendClient


  // метод обработчика события сброса данных в форме
  resetClient(): void {

    // восстановим начальные значения обрабатываемого объекта
    this.client = Client.newClient(this.clientCopy);

  } // resetClient


  // проверка на уникальность паспортных данных
  isUniqPassport(): boolean {

    let result: boolean = true;

    for (let passport of this.clientFormParams.passportList) {

      if (passport === this.client.passport) {
        result = false;
        break
      } // if

    } // for of

    return result;

  } // isUniqPassport

} // class ClientFormComponent
