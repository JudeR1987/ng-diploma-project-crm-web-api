// ----------------------------------------------------------------------------
// класс, представляющий набор пользовательских валидаторов
// ----------------------------------------------------------------------------
import {AbstractControl, FormControl, ValidatorFn} from '@angular/forms';
import {Literals} from '../infrastructure/Literals';

export class UserValidators {

  // статический метод - пользовательский валидатор без параметров,
  // валидация ввода номера телефона пользователя
  public static phone(control: AbstractControl): { [key: string]: any } {

    // количество цифр телефона без префикса "+7"
    let phoneLength: number = Literals.phoneLength - 2;

    // выражение для проверки данных
    let phoneRegex: RegExp = new RegExp(`^\\+7[0-9]{${phoneLength}}$`);// = /^\+7[0-9]{10}$/

    // значение поля из формы
    let value = control.value;

    // проверка поля по регулярному выражению
    return phoneRegex.test(value) ? null! : {'phoneValidator': {value}};
  } // phone


  // статический метод - пользовательский валидатор без параметров,
  // валидация ввода e-mail пользователя
  public static email(control: AbstractControl): { [key: string]: any } {

    // выражение для проверки данных
    let emailRegex: RegExp = /[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i;

    // значение поля из формы
    let value = control.value;

    // проверка поля по регулярному выражению
    return emailRegex.test(value) ? null! : {'emailValidator': {value}};
  } // email


  // статический метод - пользовательский валидатор с параметрами,
  // валидация ввода пароля пользователя
  public static password(password: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      // значение поля из формы
      let value = control.value;

      // проверка вводимого пароля
      return value === password ? null! : {'passwordValidator': {value}};
    };// return
  } // password


  // статический метод - пользовательский валидатор без параметров,
  // валидация ввода логина пользователя (номер телефона ИЛИ e-mail)
  public static login(control: AbstractControl): { [key: string]: any } {

    // значение поля из формы
    let value = control.value;

    // если значение начинается на символ "+" или "+7", а остальные символы
    // можно преобразовать в число, то проверяем значение как номер телефона
    if (value === Literals.plus ||
        value === Literals.plusSeven ||
        UserValidators.isNumbers(value)) return UserValidators.phone(control);
    // иначе, проверяем значение как e-mail
    else return UserValidators.email(control);

  } // login


  // метод проверки строки на принадлежность к номеру телефона
  private static isNumbers(string: string): boolean {

    // если строка пустая, возвращаем false
    if (string.length === 0) return false;

    // номер телефона должен начинаться с префикса "+7"
    if (!string.startsWith(Literals.plusSeven)) return false;

    // номер телефона должен состоять из чисел без префикса "+7"
    let numbers: string = string.substring(2);

    // выражение для проверки строки символов на принадлежность к числу
    let numberRegex: RegExp = /^[+-]?\d+$/;

    return numberRegex.test(numbers);
  } // isNumbers


  // статический метод - пользовательский валидатор с параметрами,
  // валидация совпадения паролей в двух полях ввода
  public static match(passControl1: FormControl, passControl2: FormControl): ValidatorFn {
    return (): { [key: string]: any } => {

      // если значения в полях отсутствуют, вернуть НЕ null, т.е. - НЕ валидно
      if (!passControl1.value || !passControl2.value)
        return {'matchValidator': true};

      // проверка совпадения паролей
      return (passControl1.value === passControl2.value)
        ? null! : {'matchValidator': true};
    };// return
  } // match


  // статический метод - пользовательский валидатор без параметров,
  // валидация выбора не нулевого значения списка выбора или ввода нулевого значения
  public static selectedZero(control: AbstractControl): { [key: string]: any } {

    // значение поля из формы
    let value: number = +control.value;

    // проверка поля по регулярному выражению
    return value != Literals.zero ? null! : {'selectedZeroValidator': {value}};
  } // selectedZero

} // UserValidators
// ----------------------------------------------------------------------------
