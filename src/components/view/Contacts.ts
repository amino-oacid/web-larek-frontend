import { IEvents } from "../base/events";
import { Form } from "./Form";

export interface IContacts {
	inputs: HTMLInputElement[];
}

// Класс для отображения формы заказа
export class Contacts extends Form implements IContacts {
	inputs: HTMLInputElement[];

	constructor(template: HTMLTemplateElement, events: IEvents) {
		super(template, events);
		this.inputs = Array.from(this.formElement.querySelectorAll('.form__input'));

		this.inputs.forEach(input => {
			input.addEventListener('input', (event) => {
				const target = event.target as HTMLInputElement;
				const fieldName = target.name;
				const fieldValue = target.value;
				this.events.emit('contacts:change', { field: fieldName, value: fieldValue });
			});
		});
	}

}