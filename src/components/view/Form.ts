import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

export interface IForm {
  formName: string;
  formElement: HTMLFormElement;
  formErrorsElement: HTMLElement;
  submitButton: HTMLButtonElement;
  render(): HTMLElement;
}

// Родительский класс для отображения формы
export abstract class Form implements IForm {
  formName: string;
  formElement: HTMLFormElement;
  formErrorsElement: HTMLElement;
  submitButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formElement = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.formName = this.formElement.getAttribute('name');
    this.formErrorsElement = this.formElement.querySelector('.form__errors') as HTMLElement;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.formElement);
  
    this.formElement.addEventListener('submit', (evt:Event)=>{
      evt.preventDefault();
      this.events.emit(`${this.formName}:submit`);
    });

    this.formElement.addEventListener('input', (evt:InputEvent)=>{
      const target = evt.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`${this.formName}:input`, {field, value});
    });
  
  }

  set isValid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  render(): HTMLElement {
    return this.formElement;
  }
}
