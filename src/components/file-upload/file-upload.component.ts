// ----------------------------------------------------------------------------
// пользовательский компонент загрузки файлов
// ----------------------------------------------------------------------------
import {Component, Input, EventEmitter, Output, OnInit, OnDestroy} from '@angular/core';
import {Literals} from '../../infrastructure/Literals';

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent implements OnInit, OnDestroy {

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
    console.log(`[-FileUploadComponent-constructor--`);

    console.log(`*-this.imagePath= '${this.imagePath}' -*`);
    console.log(`*-this.fileName= '${this.fileName}' -*`);
    console.log(`*-this.imageTitle= '${this.imageTitle}' -*`);
    console.log(`*-this.labelInputImage= '${this.labelInputImage}' -*`);
    console.log(`*-this.butNewFileNameTitle= '${this.butNewFileNameTitle}' -*`);
    console.log(`*-this.butNewFileNameValue= '${this.butNewFileNameValue}' -*`);

    console.log(`*-this.newFileName= '${this.newFileName}' -*`);

    console.log(`--FileUploadComponent-constructor-]`);
  } // constructor


  // 0. установка начальных значений и подписок
  // сразу после загрузки компонента
  ngOnInit() {
    console.log(`[-FileUploadComponent-ngOnInit--`);

    console.log(`*- параметры должны быть получены -*`);
    console.log(`*-this.imagePath= '${this.imagePath}' -*`);
    console.log(`*-this.fileName= '${this.fileName}' -*`);
    console.log(`*-this.imageTitle= '${this.imageTitle}' -*`);
    console.log(`*-this.labelInputImage= '${this.labelInputImage}' -*`);
    console.log(`*-this.butNewFileNameTitle= '${this.butNewFileNameTitle}' -*`);
    console.log(`*-this.butNewFileNameValue= '${this.butNewFileNameValue}' -*`);

    console.log(`*-this.newFileName= '${this.newFileName}' -*`);

    console.log(`--FileUploadComponent-ngOnInit-]`);
  } // ngOnInit


  // обработчик события передачи данных о выбранном файле с изображением
  sendSelectedFile(event: any): void {
    console.log(`[-FileUploadComponent-sendSelectedFile--`);

    console.log(`*-event.target-*`);
    console.dir(event.target);

    // получим выбранный файл
    let newFile: File = event.target.files[0];
    console.log(`*-newFile-*`);
    console.dir(newFile);

    // если файл отсутствует, завершаем обработку
    if (!newFile) {
      console.log(`*- файл отсутствует -*`);
      console.log(`--FileUploadComponent-sendSelectedFile-]`);
      return;
    } // if

    // зажигаем событие передачи данных
    this.onSendFile.emit(newFile);

    console.log(`--FileUploadComponent-sendSelectedFile-]`);
  } // sendSelectedFile


  // метод для передачи текста с html-разметкой в атрибут title
  toHtml(imageHTMLElement: HTMLElement, spanHTMLElement: HTMLElement): void {
    //console.log(`[-FileUploadComponent-toHtml--`);

    //console.log(`*- spanHTMLElement.innerHTML: '${spanHTMLElement.innerHTML}' -*`);

    imageHTMLElement.title = spanHTMLElement.innerHTML;
    //console.log(`*- imageHTMLElement.title: '${imageHTMLElement.title}' -*`);

    //console.log(`--FileUploadComponent-toHtml-]`);
  } // toHtml


  // отмены подписок и необходимые методы при уничтожении компонента
  ngOnDestroy() {
    console.log(`[-FileUploadComponent-ngOnDestroy--`);
    console.log(`--FileUploadComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class FileUploadComponent
// ----------------------------------------------------------------------------
