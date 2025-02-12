// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента AboutComponent
// ----------------------------------------------------------------------------
export interface IAboutComponent {

  //#region параметры меняющиеся при смене языка

  // заголовок
  title: string,

  //endregion


  //#region параметры НЕ меняющиеся при смене языка

  // параметр языка отображения
  language: string,

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  route: string

  //endregion

} // interface IAboutComponent
// ----------------------------------------------------------------------------
