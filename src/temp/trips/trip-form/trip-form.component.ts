import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {Trip} from '../../Trip';
import {Route} from '../../Route';
import {ClientTemp} from '../../ClientTemp';
import {DecimalPipe} from '@angular/common';
import {Utils} from '../../../infrastructure/Utils';
import {ITripFormParams} from '../../ITripFormParams';

@Component({
  selector: 'trip-form',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.css'
})
export class TripFormComponent {

  // получаемый объект сведений о поездке для добавления/изменения
  @Input() trip: Trip = new Trip();

  // объект-копия для обработчика сброса данных в форме
  @Input() tripCopy: Trip = new Trip();

  // параметры формы добавления/изменения
  @Input() tripFormParams: ITripFormParams = {
    allClients: [], allRoutes: [], clientList: [], routeList: []
  };

  // флаг включения спиннера при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // флаг запрета взаимодействия с кнопками
  @Input() isDisabledFlag: boolean = false;

  // вспомогательный параметр для привязки к свойству объекта типа Date
  @Input() displayDate: string = "";

  // свойства для генерации событий выдачи данных из компонента
  // добавляемый/изменяемый объект сведений о поездке
  @Output() onSendTrip: EventEmitter<Trip> = new EventEmitter<Trip>();

  // сообщение об ошибке для вывода в родительском компоненте
  @Output() onSendMessage: EventEmitter<string> = new EventEmitter<string>();


  // метод передачи данных
  sendTrip(form: NgForm): void {

    // если значения введены не корректно - остаёмся в форме

    // выбор клиента
    if (this.trip.client.id === 0) {

      // зажигаем событие передачи сообщения об ошибке
      this.onSendMessage.emit('Клиент не выбран!');

      // восстановление значения даты
      this.displayDate = Utils.dateToString(this.tripCopy.startDate);

      return;
    } // if

    // выбор маршрута
    if (this.trip.route.id === 0) {

      // зажигаем событие передачи сообщения об ошибке
      this.onSendMessage.emit('Маршрут не выбран!');

      // восстановление значения даты
      this.displayDate = Utils.dateToString(this.tripCopy.startDate);

      return;
    } // if

    // ввод количества дней пребывания в стране назначения
    if (this.trip.amountDays < 1 || this.trip.amountDays > 30) {

      // зажигаем событие передачи сообщения об ошибке
      this.onSendMessage.emit(`Количество дней пребывания должно быть
        ${ this.trip.amountDays < 1 ? 'положительным' : 'не более 30-ти' }!`);

      // восстановление значения даты
      this.displayDate = Utils.dateToString(this.tripCopy.startDate);

      return;
    } // if

    // зажигаем событие передачи данных
    this.onSendTrip.emit(this.trip);

    // сброс данных формы
    this.trip = new Trip();
    this.trip.amountDays = 1;
    this.displayDate = Utils.dateToString(this.trip.startDate);

  } // sendTrip


  // обработчик события сброса данных в форме
  resetTrip(): void {

    // восстановим начальные значения обрабатываемого объекта
    this.trip = Trip.newTrip(this.tripCopy);
    this.displayDate = Utils.dateToString(this.trip.startDate);

  } // resetTrip


  // обработчик события клика по кнопке закрытия модального окна с формой
  closeForm(): void {

    // восстановление значения даты
    this.displayDate = Utils.dateToString(this.tripCopy.startDate);

  } // closeForm


  // обработчик события изменения значения выбора даты
  // начала пребывания в стране назначения
  inputStartDateHandler(): void {

    // привязать выбранное значение даты к объекту
    this.trip.startDate = Utils.stringToDate(this.displayDate);

  } // inputStartDateHandler


  // обработчик события изменения списка выбора клиента
  changeClientHandler(): void {

    // т.к. select присваивает строку, требуется доп. присваивание
    this.trip.client.id = +this.trip.client.id;

    // получим выбранного клиента из коллекции
    // (!!! не ссылку, а новый объект-копию !!!)
    let client: ClientTemp = this.tripFormParams.allClients
      .find((client: ClientTemp) => client.id === this.trip.client.id)!;

    this.trip.client = ClientTemp.newClient(client);

  } // changeClientHandler


  // обработчик события изменения списка выбора маршрута
  changeRouteHandler(): void {

    // т.к. select присваивает строку, требуется доп. присваивание
    this.trip.route.id = +this.trip.route.id;

    // получим выбранный маршрут из коллекции
    // (!!! не ссылку, а новый объект-копию !!!)
    let route: Route = this.tripFormParams.allRoutes
      .find((route: Route) => route.id === this.trip.route.id)!;

    this.trip.route = Route.newRoute(route);

  } // changeRouteHandler

} // class TripFormComponent
