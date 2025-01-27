import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/AppApi';
import { DataModel } from './components/model/DataModel';
import { ModalWindow } from './components/view/ModalWindow';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { ApiListResponse } from './components/base/api';
import { IOrderForm, IProductItem } from './types';
import { Card } from './components/view/Card';
import { CardPreview } from './components/view/CardPreview';
import { Basket } from './components/view/Basket';
import { BasketModel } from './components/model/BasketModel';
import { BasketItem } from './components/view/BasketItem';
import { OrderFormModel } from './components/model/OrderFormModel';
import { Order } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { SuccessModalWindow } from './components/view/ModalWindowSuccess';
import { Page } from './components/view/Page';

// Переменные элементов на странице
const cardCatalogElement = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewElement = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketElement = document.querySelector('#basket') as HTMLTemplateElement;
const basketItemElement = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderFormElement = document.querySelector('#order') as HTMLTemplateElement;
const contactsFormElement = document.querySelector('#contacts') as HTMLTemplateElement;
const successModalWindowElement = document.querySelector('#success') as HTMLTemplateElement;

// Экземпляры классов для работы с данными и событиями
const appApi = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();
const page = new Page(events);
const dataModel = new DataModel(events);
const modalWindow = new ModalWindow(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketElement, events);
const basketModel = new BasketModel();
const orderFormModel = new OrderFormModel(events);
const orderForm = new Order(orderFormElement, events);
const contactsForm = new Contacts(contactsFormElement, events);

// Получение всего списка товаров
appApi.getProductList()
  .then(function(data: ApiListResponse<IProductItem>) {
    dataModel.products = data.items;
  })
  .catch(error => console.log(error));

// Обработка события получения списка товаров и рендеринг карточек товаров
events.on('products:receive', () => {
  page.catalog = dataModel.products.map(product => {
    const card = new Card(cardCatalogElement, { onClick: () => events.emit('product:select', product)});
    return card.render(product);
  });
});

// Обработка события выбора товара
events.on('product:select', (product: IProductItem) => { dataModel.setModalWindowProduct(product)});

// Обработка события открытия модального окна товара
events.on('modalWindowProduct:open', (product: IProductItem) => {
  const cardPreview = new CardPreview(cardPreviewElement, events);
  modalWindow.setContent(cardPreview.render(product));
  modalWindow.render();
});

// Обработка события добавления товара в корзину
events.on('product:addToBasket', () => {
  basketModel.addProduct(dataModel.product);
  page.counter = basketModel.getProductsCount();
  modalWindow.close();
});

// Обработка события открытия корзины и рендеринг ее содержимого
events.on('basket:open', () => {
  basket.updateBasketPrice(basketModel.getBasketPrice());
  basket.items = basketModel.products.map((item, index) => {
    const basketItem = new BasketItem(basketItemElement, { onClick: () => events.emit('basket:removeBasketProduct', item)});
    return basketItem.render(item, index+1);
  });

  modalWindow.setContent(basket.render());
  modalWindow.render();
});

// Обработка события удаления товара из корзины
events.on('basket:removeBasketProduct', (item: IProductItem) => {
	basketModel.removeProduct(item);
  page.counter = basketModel.getProductsCount();
	basket.updateBasketPrice(basketModel.getBasketPrice());
	basket.items = basketModel.products.map((item, index) => {
		const basketItem = new BasketItem(basketItemElement, { onClick: () => events.emit('basket:removeBasketProduct', item)});
		return basketItem.render(item, index+1);
	});
});

// Обработка события открытия формы заказа
events.on('order:open', () => {
	modalWindow.setContent(orderForm.render())
	modalWindow.render();
	orderFormModel.items = basketModel.products.map(item => item.id);
});

// Обработка события выбора метода оплаты
events.on('order:paymentMethod', (button: HTMLButtonElement) => { 
  orderFormModel.payment = button.name });

// Обработка события изменения значения адреса в форме заказа
events.on('order:input', (data: {field: string, value: string}) => {
  orderFormModel.setOrderAddress(data.field, data.value);
});

// Обработка ошибки валидации адреса и метода оплаты
events.on('orderFormErrors:address', (errors: Partial<IOrderForm>) => {
  const {address, payment} = errors;
  orderForm.isValid = !address && !payment;
  orderForm.formErrorsElement.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
});

// Обработка события открытия формы контактов
events.on('order:submit', () => {
	orderFormModel.total = basketModel.getBasketPrice();
	modalWindow.setContent(contactsForm.render());
	modalWindow.render();
});

// Обработка события изменения значения контактов в форме
events.on(`contacts:change`, (data: { field: string, value: string }) => {
	orderFormModel.setContactData(data.field, data.value);
});

// Обработка ошибки валидации контактов
events.on('orderFormErrors:contacts', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contactsForm.isValid = !email && !phone;
  contactsForm.formErrorsElement.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

// Обработка события открытия модального окна с успешным оформлением заказа
events.on('contacts:submit', () => {
  appApi.postOrderForm(orderFormModel.getOrderDetails())
    .then((data) => {
      console.log(data); // ответ сервера
      const successModalWindow = new SuccessModalWindow(successModalWindowElement, events);
      modalWindow.setContent(successModalWindow.render(basketModel.getBasketPrice()));
      basketModel.clearBasket();
      page.counter = basketModel.getProductsCount();
      modalWindow.render();
    })
    .catch(error => console.log(error));
});

// Обработка события закрытия модального окна с успешным оформлением заказа
events.on('successModalWindow:close', () => modalWindow.close());

// Блокировка прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
  page.isLocked = true;
});

// Снятие блокировки прокрутки страницы при закрытии модального окна
events.on('modal:close', () => {
  page.isLocked = false;
});