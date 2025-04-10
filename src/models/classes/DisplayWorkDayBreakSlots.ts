// ----------------------------------------------------------------------------
// класс для отображения рабочего дня сотрудника с коллекцией
// промежутков времени перерывов сотрудника
// ----------------------------------------------------------------------------
import {WorkDay} from './WorkDay';
import {Slot} from './Slot';

export class DisplayWorkDayBreakSlots {

  // конструктор с параметрами по умолчанию
  constructor(
    // данные о рабочем дне сотрудника
    private _workDay: WorkDay = new WorkDay(),

    // коллекция промежутков времени перерывов сотрудника
    private _slots: Slot[] = []
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get workDay(): WorkDay { return this._workDay; }
  set workDay(value: WorkDay) { this._workDay = value; }

  get slots(): Slot[] { return this._slots; }
  set slots(value: Slot[]) { this._slots = Slot.parseSlots(value); }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newDisplayWorkDayBreakSlots(srcDisplayWorkDayBreakSlots: DisplayWorkDayBreakSlots | any): DisplayWorkDayBreakSlots {
    return new DisplayWorkDayBreakSlots(
      WorkDay.newWorkDay(srcDisplayWorkDayBreakSlots.workDay),
      Slot.parseSlots(srcDisplayWorkDayBreakSlots.slots)
    ); // return
  } // newDisplayWorkDayBreakSlots


  // статический метод, возвращающий массив новых объектов-копий
  public static parseDisplayWorkDaysBreakSlots(srcDisplayWorkDaysBreakSlots: DisplayWorkDayBreakSlots[] | any[]): DisplayWorkDayBreakSlots[] {
    return srcDisplayWorkDaysBreakSlots.map((displayWorkDayBreakSlots: DisplayWorkDayBreakSlots | any) => this.newDisplayWorkDayBreakSlots(displayWorkDayBreakSlots));
  } // parseDisplayWorkDaysBreakSlots


  // статический метод, возвращающий коллекцию промежутков времени перерывов сотрудника
  // !!! возможно НЕ НУЖЕН !!!
  public static allSlots(srcDisplayWorkDaysBreakSlots: DisplayWorkDayBreakSlots[]): Slot[] {

    // коллекция всех промежутков времени перерывов сотрудника всех рабочих дней
    let slots: Slot[] = [];

    // на каждом рабочем дне получим каждый элемент коллекции промежутков времени перерывов сотрудника
    srcDisplayWorkDaysBreakSlots.forEach((displayWorkDayBreakSlots: DisplayWorkDayBreakSlots) => {
      displayWorkDayBreakSlots.slots.forEach((slot: Slot) => {
        slots.push(slot);
      }); // forEach
    }); // forEach

    return slots;
  } // allSlots


  // статический метод, возвращающий объект-DTO
  public static DisplayWorkDayBreakSlotsToDto(srcDisplayWorkDayBreakSlots: DisplayWorkDayBreakSlots): any {
    return {
      workDay: WorkDay.WorkDayToDto(srcDisplayWorkDayBreakSlots.workDay),
      slots:   Slot.SlotsToDto(srcDisplayWorkDayBreakSlots.slots)
    }; // return
  } // DisplayWorkDayBreakSlotsToDto


  // статический метод, возвращающий массив объектов-DTO
  /*public static ServicesCategoriesToDto(srcServicesCategories: ServicesCategory[]): any[] {
    return srcServicesCategories.map((servicesCategory: ServicesCategory) => this.ServicesCategoryToDto(servicesCategory));
  } // ServicesCategoriesToDto*/


  // статический метод, возвращающий объект
  // с интерфейсом для отображения в списке выбора
  /*public static newServicesCategoryToSelect(srcServicesCategory: ServicesCategory): { id: number, name: string } {
    return { id: srcServicesCategory.id, name: srcServicesCategory.name };
  } // newServicesCategoryToSelect*/


  // статический метод, возвращающий массив объектов
  // с интерфейсом для отображения в списке выбора
  /*public static parseServicesCategoriesToSelect(srcServicesCategories: ServicesCategory[]): { id: number, name: string }[] {
    return srcServicesCategories.map((servicesCategory: ServicesCategory) => this.newServicesCategoryToSelect(servicesCategory));
  } // parseServicesCategoriesToSelect*/

} // class DisplayWorkDayBreakSlots
// ----------------------------------------------------------------------------
