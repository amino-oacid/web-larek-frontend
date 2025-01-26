import { IEvents } from "../base/events";

export interface ISuccessModalWindow {
	successElement: HTMLElement;
	descriptionElement: HTMLElement;
	button: HTMLButtonElement;
	render(total: number): HTMLElement;
}

// Класс для отображения окна с успешным оформлением заказа
export class SuccessModalWindow implements ISuccessModalWindow {
	successElement: HTMLElement;
	descriptionElement: HTMLElement;
	button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, private events: IEvents) {
    this.successElement = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
		this.descriptionElement = this.successElement.querySelector('.order-success__description');
    this.button = this.successElement.querySelector('.order-success__close');

		this.button.addEventListener('click', () => { events.emit('successModalWindow:close') });
	}

	render(total: number): HTMLElement {
		this.descriptionElement.textContent = `Списано ${total} синапсов`;
		return this.successElement;
	}
}