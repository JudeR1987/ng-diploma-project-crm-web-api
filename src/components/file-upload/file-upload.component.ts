// ----------------------------------------------------------------------------
// пользовательский компонент загрузки файлов
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Literals} from '../../infrastructure/Literals';

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {

  // входные параметры
  // путь расположения изображения
  @Input() imagePath: string = Literals.empty;

  // имя файла изображения
  @Input() fileName: string = Literals.empty;

  // всплывающая подсказка к изображению
  @Input() imageTitle: string = Literals.empty;

  // заголовок поля выбора файла с изображением
  @Input() labelInputImage: string = Literals.empty;

  // заголовок поля имени выбранного файла изображения
  @Input() labelNewFileName: string = Literals.empty;

  // заголовок при невыбранном файле изображения
  @Input() labelFileNotSelected: string = Literals.empty;

  // всплывающая подсказка на кнопке "выбрать"
  @Input() butNewFileNameTitle: string = Literals.empty;

  // значение кнопки "выбрать"
  @Input() butNewFileNameValue: string = Literals.empty;

  // флаг включения спиннера при ожидании данных с сервера
  @Input() isWaitFlag: boolean = false;

  // флаг включения возможности удаления данных
  @Input() isDeletingFlag: boolean = false;

  // имя выбранного файла изображения
  @Input() newFileName: string = Literals.empty;

  // класс, определяющий допустимые размеры отображаемого изображения
  @Input() sizeImage: string = Literals.empty;

  // свойство для генерации события передачи данных о выбранном файле с изображением
  @Output() onSendFile: EventEmitter<File> = new EventEmitter<File>();


  // конструктор
  constructor() {
  } // constructor


  // обработчик события передачи данных о выбранном файле с изображением
  sendSelectedFile(event: any): void {

    // получим выбранный файл
    let newFile: File = event.target.files[0];

    // если файл отсутствует, завершаем обработку
    if (!newFile) return;

    // зажигаем событие передачи данных
    this.onSendFile.emit(newFile);

  } // sendSelectedFile


  // метод для передачи текста с html-разметкой в атрибут title
  toHtml(imageHTMLElement: HTMLElement, spanHTMLElement: HTMLElement): void {
    imageHTMLElement.title = spanHTMLElement.innerHTML;
  } // toHtml

} // class FileUploadComponent
// ----------------------------------------------------------------------------
