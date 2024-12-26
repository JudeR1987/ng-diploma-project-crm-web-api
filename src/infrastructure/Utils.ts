// ----------------------------------------------------------------------------
// класс со вспомогательными функциями
// ----------------------------------------------------------------------------
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
