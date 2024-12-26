// ----------------------------------------------------------------------------
// интерфейс объекта с параметрами компонента AboutComponent
// ----------------------------------------------------------------------------
export interface IAboutComponent {

  // заголовок
  title: string,

  // параметр языка отображения
  language: string,

  // параметр, передающий маршрут в родительский компонент для
  // выделения активной кнопки навигации после перезагрузки страницы
  route: string

} // interface IAboutComponent
// ----------------------------------------------------------------------------
