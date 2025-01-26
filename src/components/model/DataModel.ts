import { IProductItem } from "../../types";
import { IEvents } from "../base/events";


export interface IDataModel {
  products: IProductItem[];
}

// Класс, управляющий данными о товарах и взаимодействующий с событиями
export class DataModel implements IDataModel {
  protected _products: IProductItem[];
  product: IProductItem;

  constructor(protected events: IEvents) {
    this._products = [];
  }

  get products(): IProductItem[] {
    return this._products;
  }

  set products(products: IProductItem[]) {
    this._products = products;
    this.events.emit('products:receive');
  }

  setModalWindowProduct(product: IProductItem) {
    this.product = product;
    this.events.emit('modalWindowProduct:open', product);
  }

}