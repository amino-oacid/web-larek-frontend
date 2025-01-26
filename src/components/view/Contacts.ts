import { IEvents } from "../base/events";

export interface IContacts {
	formContactsElement: HTMLFormElement;
	inputs: HTMLInputElement[];
	submitButton: HTMLButtonElement;
	formErrorsElement: HTMLElement;
	render(): HTMLElement;
}

// Класс для отображения формы с контактами
export class Contacts implements IContacts {
	formContactsElement: HTMLFormElement;
	inputs: HTMLInputElement[];
	submitButton: HTMLButtonElement;
	formErrorsElement: HTMLElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.formContactsElement = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
		this.inputs = Array.from(this.formContactsElement.querySelectorAll('.form__input'));
		this.submitButton = this.formContactsElement.querySelector('.button');
		this.formErrorsElement = this.formContactsElement.querySelector('.form__errors');
		
    this.inputs.forEach(input => {
			input.addEventListener('input', (event) => {
				const target = event.target as HTMLInputElement;
				const fieldName = target.name;
				const fieldValue = target.value;
				this.events.emit('contacts:change', { field: fieldName, value: fieldValue });
			});
		});
		this.formContactsElement.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit('successModalWindow:open');
		});
	}

  set isValid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	render(): HTMLElement {
		return this.formContactsElement;
	}
}