import { IEvents } from "../base/events";

export interface IModalWindow {
  open(): void;
  close(): void;
  setContent(content: HTMLElement): void;
  render(): HTMLElement;
}

// Класс для отображения модального окна
export class ModalWindow implements IModalWindow {
  private modalContainer: HTMLElement;
	private closeButton: HTMLButtonElement;
	private modalContent: HTMLElement;

	constructor(modalContainer: HTMLElement, private events: IEvents) {
		this.modalContainer = modalContainer;
		this.closeButton = modalContainer.querySelector('.modal__close');
		this.modalContent = modalContainer.querySelector('.modal__content');

		this.closeButton.addEventListener('click', () => this.close());
		this.modalContainer.addEventListener('click', () => this.close());
		this.modalContainer.querySelector('.modal__container').addEventListener('click', (event) => event.stopPropagation());
	}

	open(): void {
		this.modalContainer.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close(): void {
		this.modalContainer.classList.remove('modal_active');
		this.modalContent.innerHTML = '';
		this.events.emit('modal:close');
	}

	setContent(content: HTMLElement): void {
		this.modalContent.replaceChildren(content);
	}

	render(): HTMLElement {
		this.open();
		return this.modalContainer;
	}

}