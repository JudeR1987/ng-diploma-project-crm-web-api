// ----------------------------------------------------------------------------
// класс со вспомогательными функциями
// ----------------------------------------------------------------------------
import {Literals} from './Literals';

export class Utils {

  // генерация случайного вещественного числа
  // !!! диапазон [min, max] !!!
  public static getRand(min: number, max: number): number {

    return Math.random() * (max - min + 1) + min;

  } // getRand


  // генерация случайного целого числа
  // !!! диапазон [min, max] !!!
  public static getIntRand(min: number, max: number): number {

    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1) + min);

  } // getIntRand


  // приветствие в консоли
  public static hello(): void {
    console.log("* --------------------------- *");
    console.log("* --- Работает - Utils.ts --- *");
    console.log("* --------------------------- *");
    console.log("");
  } // hello

  public static helloComponent(component: string = ''): void {

    console.log("* --------------------------- *");
    console.log(`* Работает ${component === '' ? 'home' : component}.component.ts *`);
    console.log("* --------------------------- *");
    console.log("");

  } // helloComponent


  // метод, удаляющий повторяющиеся элементы(типа Distinct)
  public static distinct<T>(array: T[]): T[] {

    return array
      .filter((value: T, index: number) =>
        array.indexOf(value) === index);

  } // distinct


  // преобразование даты к формату YYYY-MM-dd типа string
  public static dateToString(date: Date): string {
    return date.toLocaleDateString().split('.').reverse().join('-');
  } // dateToString


  // преобразование даты из формата YYYY-MM-dd типа string
  public static stringToDate(string: string): Date {

    // если получена строка формата "2024-07-02T08:46:37.808Z", то требуется обрезка
    // если получена строка формата "2024-07-02", то обрезка не требуется
    if (string.length > 10) string = string.slice(0, 10);

    // получить параметры даты
    let year: number = parseInt(string.split('-')[0]);
    let month: number = parseInt(string.split('-')[1]);
    let day: number = parseInt(string.split('-')[2]);

    return new Date(year, month - 1, day);
  } // stringToDate


  // получить даты первого и последнего дня недели относительно заданной даты
  public static getFirstLastDatesOfWeek(date: Date): [first: Date, last: Date] {

    // переопределяем день недели: понедельник = 0...воскресенье = 6
    let dayOfWeek: number = date.getDay() === 0
      ? 6                  // воскресенье делаем последним днём недели
      : date.getDay() - 1; // остальные дни смещаем по индексу для удобства вычислений
    //console.log(`*- dayOfWeek: '${dayOfWeek}' -*`);

    // число месяца даты
    let numberDay = date.getDate();
    //console.log(`*- numberDay: '${numberDay}' -*`);

    // первый день недели (создаём из копии заданной даты)
    let firstDay: Date = new Date(date);
    //console.log(`*- firstDay.toLocaleString(): '${firstDay.toLocaleString()}' -*`);
    firstDay.setDate(numberDay - dayOfWeek);
    //console.log(`*- firstDay.toLocaleString(): '${firstDay.toLocaleString()}' -*`);
    firstDay.setHours(0, 0, 0, 0);
    //console.log(`*- firstDay.toLocaleString(): '${firstDay.toLocaleString()}' -*`);

    // последний день недели (создаём из копии заданной даты)
    let lastDay: Date = new Date(date);
    //console.log(`*- lastDay.toLocaleString(): '${lastDay.toLocaleString()}' -*`);
    lastDay.setDate(numberDay + (6 - dayOfWeek));
    //console.log(`*- lastDay.toLocaleString(): '${lastDay.toLocaleString()}' -*`);
    lastDay.setHours(0, 0, 0, 0);
    //console.log(`*- lastDay.toLocaleString(): '${lastDay.toLocaleString()}' -*`);

    return [firstDay, lastDay];
  } // getFirstLastDatesOfWeek


  // получить массив дат дней заданной недели
  public static getAllDatesOfWeek(firstDay: Date, lastDay: Date): Date[] {
    //console.log(`[-Utils-getAllDatesOfWeek--`);

    //console.log(`*- firstDay.toLocaleString(): '${firstDay.toLocaleString()}' -*`);
    //console.log(`*- lastDay.toLocaleString(): '${lastDay.toLocaleString()}' -*`);

    let dates: Date[] = [];
    //console.log(`*- dates: -*`);
    //console.dir(dates);

    let date: Date = new Date(firstDay);
    //console.log(`*- date.toLocaleString(): '${date.toLocaleString()}' -*`);

    while (date <= lastDay) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
      //console.log(`*- date.toLocaleString(): '${date.toLocaleString()}' -*`);
    } // while

    //console.log(`*- dates: -*`);
    //console.dir(dates);

    //console.log(`--Utils-getAllDatesOfWeek-]`);
    return dates;
  } // getAllDatesOfWeek


  // дополнить нулями строку со значением времени до формата "00:00"
  public static toTime(time: string): string {

    let items: string[] = time.split(Literals.doublePoint);
    let hours: string = items[0];
    let minutes: string = items[1];

    return `${hours.length < 2 ? '0' : ''}${hours}:${minutes.length < 2 ? '0' : ''}${minutes}`;
  } // toTime


  // метод перехода в начало страницы
  public static toStart(): void {
    //window.scrollTo(0, 0); // при y=0 прокрутка не работает после перезагрузки страницы !?!?
    window.scrollTo(0, 1);
  } // toStart

} // class Utils
// ----------------------------------------------------------------------------

// преобразование даты к формату / dd*MM*YYYY или dd*MM*YY /
// где * - разделитель
// или
// дата в формате: DD.MM.YY - new Date().toISOString().slice(0,10).split('-').reverse().join('.') => "2024-07-02T08:46:37.808Z" => "02.07.2024" ! но UTC-0
// дата в формате: DD.MM.YY - new Date().toLocaleString().slice(0,10) => "02.07.2024, 11:46:37" => "02.07.2024"
// console.log(`${new Date().toLocaleDateString("ru-RU")}`); => "02.07.2024"
// console.log(`${new Date().toLocaleTimeString("ru-RU")}`); => "11:46:37"
// console.log(`${new Date().toLocaleString().slice(0, 10).split('.').reverse().join('-') }`); => "2024-07-02"

// ----------------------------------------------------------------------------
