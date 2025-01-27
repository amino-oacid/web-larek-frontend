import { IActions, IProductItem } from "../../types";

export interface ICard {
  render(product: IProductItem): HTMLElement;
}

// Класс для отображения карточки товара в списке на странице
export class Card implements ICard {
  protected _cardElement: HTMLElement;
  protected _cardTitleElement: HTMLElement;
  protected _cardImageElement: HTMLImageElement;
  protected _cardCategoryElement: HTMLElement;
  protected _cardPriceElement: HTMLElement;

  protected _categories: Record<string, string> = {
    "дополнительное": "additional",
    "другое": "other",
    "софт-скил": "soft",
    "хард-скил": "hard",
    "кнопка": "button"
  };

  constructor(protected template: HTMLTemplateElement, protected actions?: IActions) {
    this._cardElement = this.template.content.querySelector('.card').cloneNode(true) as HTMLElement;
    this._cardCategoryElement = this._cardElement.querySelector('.card__category');
    this._cardTitleElement = this._cardElement.querySelector('.card__title');
    this._cardImageElement = this._cardElement.querySelector('.card__image');
    this._cardPriceElement = this._cardElement.querySelector('.card__price');    
  
    if (this.actions?.onClick) {
      this._cardElement.addEventListener('click', this.actions.onClick);
    }
  
  }

  protected setText(element: HTMLElement, value: unknown): void {
		element.textContent = String(value);
	}
  
  protected setPrice(value: number | null): string {
	  return value === null ? 'Бесценно' : `${value} синапсов`;
	}

  protected setCardCategory(value: string): void {
    this.setText(this._cardCategoryElement, value);
    this._cardCategoryElement.className = `card__category card__category_${this._categories[value]}`;
  }

  render(product: IProductItem): HTMLElement {
    this.setText(this._cardTitleElement, product.title);
    this._cardImageElement.src = product.image;
    this._cardImageElement.alt = this._cardTitleElement.textContent;
    this.setText(this._cardPriceElement, this.setPrice(product.price));
    this.setCardCategory(product.category);

    return this._cardElement;
  }
  
}