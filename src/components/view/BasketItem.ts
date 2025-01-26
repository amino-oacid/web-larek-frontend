import { IActions, IProductItem } from "../../types";

export interface IBasketItem {
  basketItemElement: HTMLElement;
  render(product: IProductItem, index: number): HTMLElement;
}

// Класс для отображения товаров в корзине
export class BasketItem implements IBasketItem {
  basketItemElement: HTMLElement;
	private indexElement: HTMLElement;
	private titleBasketItemElement: HTMLElement;
	private priceBasketItemElement: HTMLElement;
	private deleteBasketItemElement: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected actions?: IActions) {
		this.basketItemElement = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
		this.indexElement = this.basketItemElement.querySelector('.basket__item-index');
		this.titleBasketItemElement = this.basketItemElement.querySelector('.card__title');
		this.priceBasketItemElement = this.basketItemElement.querySelector('.card__price');
		this.deleteBasketItemElement = this.basketItemElement.querySelector('.basket__item-delete');
		
		if (this.actions?.onClick) {
			this.deleteBasketItemElement.addEventListener('click', this.actions.onClick);
		}
	}

	private setPrice(value: number | null): string {
		return value === null ? 'Бесценно' : `${value} синапсов`;
	}

	render(product: IProductItem, index: number): HTMLElement {
		this.indexElement.textContent = String(index);
		this.titleBasketItemElement.textContent = product.title;
		this.priceBasketItemElement.textContent = this.setPrice(product.price);

		return this.basketItemElement;
	}

}