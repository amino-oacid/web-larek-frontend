import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IPage {
  counter: number;
  catalog: HTMLElement[];
  isLocked: boolean;
}

// Класс для отображения страницы
export class Page implements IPage {
  protected _counterElement: HTMLElement;
  protected _catalogElement: HTMLElement;
  protected _pageWrapperElement: HTMLElement;
  protected _basketElement: HTMLElement;

  constructor(protected events: IEvents) {
    this._counterElement = ensureElement<HTMLElement>('.header__basket-counter');
    this._catalogElement = ensureElement<HTMLElement>('.gallery');
    this._pageWrapperElement = ensureElement<HTMLElement>('.page__wrapper');
    this._basketElement = ensureElement<HTMLElement>('.header__basket');

    this._basketElement.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  protected setText(element: HTMLElement, value: unknown): void {
    element.textContent = String(value);
  }

  set counter(value: number) {
    this.setText(this._counterElement, String(value));
  }

  set catalog(items: HTMLElement[]) {
    this._catalogElement.replaceChildren(...items);
  }

  set isLocked(locked: boolean) {
    this._pageWrapperElement.classList.toggle('page__wrapper_locked', locked);
  }
}