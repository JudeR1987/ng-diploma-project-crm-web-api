// ----------------------------------------------------------------------------
// класс, хранящий информацию о пагинации
// ----------------------------------------------------------------------------
export class PageViewModel {

  // конструктор с параметрами по умолчанию
  constructor(
    // номер текущей страницы
    private _pageNumber: number = 0,

    // количество элементов коллекции на одной странице
    private _pageSize: number = 0,

    // общее количество страниц
    private _totalPages: number = 0,

    // наличие страниц "ДО" текущей
    private _hasPreviousPage: boolean = false,

    // наличие страниц "ПОСЛЕ" текущей
    private _hasNextPage: boolean = false
  ) {
  } // constructor


  //#region открытые аксессоры свойств

  get pageNumber(): number { return this._pageNumber; }
  set pageNumber(value: number) { this._pageNumber = value; }

  get pageSize(): number { return this._pageSize; }
  set pageSize(value: number) { this._pageSize = value; }

  get totalPages(): number { return this._totalPages; }
  set totalPages(value: number) { this._totalPages = value; }

  get hasPreviousPage(): boolean { return this._hasPreviousPage; }
  set hasPreviousPage(value: boolean) { this._hasPreviousPage = value; }

  get hasNextPage(): boolean { return this._hasNextPage; }
  set hasNextPage(value: boolean) { this._hasNextPage = value; }

  //#endregion


  // статический метод, возвращающий новый объект-копию
  public static newPageViewModel(srcPageViewModel: PageViewModel | any): PageViewModel {
    return new PageViewModel(
      srcPageViewModel.pageNumber,
      srcPageViewModel.pageSize,
      srcPageViewModel.totalPages,
      srcPageViewModel.hasPreviousPage,
      srcPageViewModel.hasNextPage
    ); // return
  } // newPageViewModel

} // class PageViewModel
// ----------------------------------------------------------------------------
