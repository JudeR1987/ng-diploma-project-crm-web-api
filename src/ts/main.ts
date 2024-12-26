import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '../components/app/app.config';
import { AppComponent } from '../components/app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(e => {
    console.log("* -------------------------- *");
    console.log("* -- Привет, пользователь -- *");
    console.log("* -------------------------- *");
    console.log("* --- Работает - main.ts --- *");
    console.log("* -------------------------- *");
    console.log("");
  })
  .catch((err) => console.error(err));
