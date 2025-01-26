import { IEvents } from "../base/events";

export interface IOrder {
  orderFormElement: HTMLFormElement;
	buttons: HTMLButtonElement[];
	paymentMethod: string;
	formErrorsElement: HTMLElement;
	render(): HTMLElement;
}

// Класс для отображения формы заказа
export class Order implements IOrder {
	orderFormElement: HTMLFormElement;
	buttons: HTMLButtonElement[];
	submitButton: HTMLButtonElement;
	formErrorsElement: HTMLElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.orderFormElement = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
		this.buttons = Array.from(this.orderFormElement.querySelectorAll('.button_alt'));
		this.submitButton = this.orderFormElement.querySelector('.order__button');
		this.formErrorsElement = this.orderFormElement.querySelector('.form__errors');
		
		this.buttons.forEach(button => {
			button.addEventListener('click', () => {
				this.paymentMethod = button.name;
				events.emit('orderForm:paymentMethod', button);
			});
		});

		this.orderFormElement.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			this.events.emit('orderForm:change', { field: target.name, value: target.value });
		});

		this.orderFormElement.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit('contacts:open');
		});
	}

	set paymentMethod(method: string) {
		this.buttons.forEach(button => {
			button.classList.toggle('button_alt-active', button.name === method);
		});
	}
	
	set isValid(value: boolean) {
		this.submitButton.disabled = !value;
	}
	
	render() {
		return this.orderFormElement;
	}
}