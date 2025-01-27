import { IEvents } from "../base/events";
import { Form } from "./Form";

export interface IOrder {
	buttons: HTMLButtonElement[];
	paymentMethod: string;
}

// Класс для отображения формы заказа
export class Order extends Form implements IOrder {
	buttons: HTMLButtonElement[];

	constructor(template: HTMLTemplateElement, events: IEvents) {
		super(template, events);
		this.buttons = Array.from(this.formElement.querySelectorAll('.button_alt'));

		this.buttons.forEach(button => {
			button.addEventListener('click', () => {
				this.paymentMethod = button.name;
				events.emit('order:paymentMethod', button);
			});
		});
	}

	set paymentMethod(method: string) {
		this.buttons.forEach(button => {
			button.classList.toggle('button_alt-active', button.name === method);
		});
	}

}