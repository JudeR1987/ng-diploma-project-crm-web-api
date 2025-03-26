// ----------------------------------------------------------------------------
// класс, представляющий сведения о записи в таблице "ДОЛЖНОСТИ" (Positions)
// ----------------------------------------------------------------------------
import {Literals} from '../../infrastructure/Literals';

export class Position {

  // конструктор с параметрами по умолчанию
  constructor(
    // идентификатор записи о должности
    private _id: number = Literals.zero,

    // наименование должности
    private _name: string = Literals.empty,

    // дата и время удаления записи о должности
    private _deleted: Date | null = null
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get deleted(): Date | null { return this._deleted; }
  set deleted(value: Date | null) { this._deleted = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newPosition(srcPosition: Position | any): Position {
    return new Position(
      srcPosition.id,
      srcPosition.name,
      srcPosition.deleted
    ); // return
  } // newPosition


  // статический метод, возвращающий массив новых объектов-копий
  public static parsePositions(srcPositions: Position[] | any[]): Position[] {
    return srcPositions.map((position: Position | any) => this.newPosition(position));
  } // parsePositions


  // статический метод, возвращающий объект-DTO
  public static PositionToDto(srcPosition: Position): any {
    return {
      id:      srcPosition.id,
      name:    srcPosition.name,
      deleted: srcPosition.deleted
    }; // return
  } // PositionToDto


  // статический метод, возвращающий массив объектов-DTO
  public static PositionsToDto(srcPositions: Position[]): any[] {
    return srcPositions.map((position: Position) => this.PositionToDto(position));
  } // PositionsToDto


  // статический метод, возвращающий объект
  // с интерфейсом для отображения в списке выбора
  public static newPositionToSelect(srcPosition: Position): { id: number, name: string } {
    return { id: srcPosition.id, name: srcPosition.name };
  } // newPositionToSelect


  // статический метод, возвращающий массив объектов
  // с интерфейсом для отображения в списке выбора
  public static parsePositionsToSelect(srcPositions: Position[]): { id: number, name: string }[] {
    return srcPositions.map((position: Position) => this.newPositionToSelect(position));
  } // parsePositionsToSelect

} // class Position
// ----------------------------------------------------------------------------
