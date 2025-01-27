import { IProductItem } from "../../types";

export interface IBasketModel {
  products: IProductItem[];
  getProductsCount(): number;
  getBasketPrice(): number;
  addProduct(product: IProductItem): void;
  removeProduct(product: IProductItem): void;
  clearBasket(): void;
}

// Класс управления данными в корзине
export class BasketModel implements IBasketModel {
  protected _products: IProductItem[];

  constructor() {
    this._products = [];
  }

  set products(data: IProductItem[]) {
    this._products = data;
  }

  get products() {
    return this._products;
  }

  getProductsCount(): number {
    return this._products.length;
  }

  getBasketPrice(): number {
    return this._products.reduce((total, product) => total + product.price, 0);
  }

  addProduct(product: IProductItem): void {
    const isProductInBasket = this._products.some(p => p.id === product.id);
		if (!isProductInBasket) {
			this._products.push(product);
		}
  }

  removeProduct(product: IProductItem): void {
    const index = this._products.indexOf(product);
    if (index >= 0) {
			this._products.splice(index, 1);
		}
  }

  clearBasket(): void {
    this._products = [];
  }
}