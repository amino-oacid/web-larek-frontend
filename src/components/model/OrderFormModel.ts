import { IOrderForm, IOrderResult, OrderError } from "../../types";
import { IEvents } from '../base/events'

export interface IOrderFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  setOrderAddress(field: string, value: string): void;
  validateOrder(): boolean;
  setContactData(field: string, value: string): void
  validateContacts(): boolean;
  getOrderDetails(): object;
}

// Класс, управляющий данными при оформлении заказа
export class OrderFormModel implements IOrderFormModel, IOrderForm {
	payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
	errors: OrderError = {};

	constructor(protected events: IEvents) {
		this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
	}

	setOrderAddress(field: string, value: string): void {
		if(field === 'address') {
			this.address = value;
		}
		if(this.validateOrder()) {
			this.events.emit('orderForm:ready', this.getOrderDetails());
		}
	}

	validateOrder(): boolean {
		const errors: OrderError = {};
		const regexpAdress = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;

		if(!this.address) {
			errors.address = 'Необходимо указать адрес';
		} else if(!regexpAdress.test(this.address)) {
			errors.address = 'Укажите верный адрес';
		}
		
		if(!this.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		this.errors = errors;
		this.events.emit('orderFormErrors:address', errors);

		return Object.keys(errors).length === 0
	}

	setContactData(field: string, value: string): void {
		if(field === 'email') {
			this.email = value;
		} else if(field === 'phone') {
			this.phone = value;
		}
		if(this.validateContacts()) {
			this.events.emit('orderForm:ready', this.getOrderDetails());
		}
	}

	validateContacts(): boolean {
		const errors: OrderError = {};
		const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;

		if (!this.email) {
			errors.email = 'Необходимо указать email';
		} else if (!regexpEmail.test(this.email)) {
			errors.email = 'Укажите верный email';
		}

		if (this.phone && this.phone[0] === '8') {
			this.phone = `+7${this.phone.slice(1)}`;
		}
		if (!this.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		} else if (!regexpPhone.test(this.phone)) {
			errors.phone = 'Укажите верный номер телефона';
		}

		this.errors = errors;
		this.events.emit('orderFormErrors:contacts', errors);
		return Object.keys(errors).length === 0;
	}

	getOrderDetails() {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: this.items,
		};
	}
}