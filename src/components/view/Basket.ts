import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IBasket {
  basketElement: HTMLElement;
  basketTitle: HTMLElement;
  basketList: HTMLElement;
	button: HTMLButtonElement;
	basketPrice: HTMLElement;
	updateBasketPrice(price: number): void;
	render(): HTMLElement;
}

// Класс для отображения корзины с товарами
export class Basket implements IBasket {
  basketElement: HTMLElement;
  basketTitle: HTMLElement;
  basketList: HTMLElement;
	button: HTMLButtonElement;
	basketPrice: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basketElement = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.basketTitle = this.basketElement.querySelector('.modal__title');
		this.basketList = this.basketElement.querySelector('.basket__list');
		this.button = this.basketElement.querySelector('.basket__button');
		this.basketPrice = this.basketElement.querySelector('.basket__price');
		
    this.button.addEventListener('click', () => this.events.emit('order:open'));

		this.items = [];
  }

  set items(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items);
			this.button.removeAttribute('disabled');
		} else {
			this.button.setAttribute('disabled', 'disabled');
			this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
		}
	}

	updateBasketPrice(price: number) {
		this.basketPrice.textContent = `${price} синапсов`;
	}

	render() {
		this.basketTitle.textContent = 'Корзина';
		return this.basketElement;
	}

}