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

  // имя выбранного файла изображения
  @Input() newFileName: string = Literals.empty;

  // свойства для генерации событий выдачи данных из компонента
  // выбранный файл с изображением
  @Output() onSendFile: EventEmitter<File> = new EventEmitter<File>();


  // конструктор с DI для подключения к web-сервису
  // и подключения к сервису хранения данных о jwt-токене
  constructor(/*private _webApiService: WebApiService,
              private _tokenService: TokenService*/) {
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


  // 0.
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


  // обработчик события выбора изображения
  onFileSelected(event: any): void {
    console.log(`[-FileUploadComponent-onFileSelected--`);

    console.log(`*-event.target-*`);
    console.dir(event.target);

    // получим выбранный файл
    let newFile: File = event.target.files[0];
    console.log(`*-newFile-*`);
    console.dir(newFile);

    // если файл отсутствует, завершаем обработку
    if (!newFile) {
      console.log(`*- файл отсутствует -*`);
      console.log(`--FileUploadComponent-onFileSelected-]`);
      return;
    } // if

    // получим имя выбранного файла изображения
    //console.log(`*-(было)-this.newFileName= '${this.newFileName}' -*`);
    //this.newFileName = newFile.name;
    //console.log(`*-(стало)-this.newFileName= '${this.newFileName}' -*`);

    // зажигаем событие передачи данных
    this.onSendFile.emit(newFile);

    console.log(`--FileUploadComponent-onFileSelected-]`);
  } // onFileSelected


  //
  ngOnDestroy() {
    console.log(`[-FileUploadComponent-ngOnDestroy--`);
    console.log(`--FileUploadComponent-ngOnDestroy-]`);
  } // ngOnDestroy

} // class FileUploadComponent
// ----------------------------------------------------------------------------
