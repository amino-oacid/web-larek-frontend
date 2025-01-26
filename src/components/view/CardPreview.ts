import { IActions, IProductItem } from "../../types";
import { IEvents } from "../base/events";
import { Card } from "./Card";

export interface ICardPreview {
	cardDescriptionElement: HTMLElement;
	actionButton: HTMLElement;
	render(product: IProductItem): HTMLElement;
}

// Класс для отображения детальной карточки товара в модальном окне
export class CardPreview extends Card implements ICardPreview {
	cardDescriptionElement: HTMLElement;
	actionButton: HTMLElement;

	constructor(template: HTMLTemplateElement, private events: IEvents, actions?: IActions) {
		super(template, actions);
		this.cardDescriptionElement = this._cardElement.querySelector('.card__text');
		this.actionButton = this._cardElement.querySelector('.card__button');
		this.actionButton.addEventListener('click', () => this.events.emit('product:addToBasket'))
	}

	private getActionButtonText(product: IProductItem): string {
		if(product.price) {
			return 'Купить';
		} else {
			this.actionButton.setAttribute('disabled', 'true');
			return 'Не продается';
		}
	}

	render(product: IProductItem): HTMLElement {
		this.setText(this._cardTitleElement, product.title);
    this._cardImageElement.src = product.image;
    this._cardImageElement.alt = this._cardTitleElement.textContent;
    this.setText(this._cardPriceElement, this.setPrice(product.price));
    this.setCardCategory(product.category);
		this.setText(this.cardDescriptionElement, product.description);
		this.actionButton.textContent = this.getActionButtonText(product);

    return this._cardElement;
	}

}