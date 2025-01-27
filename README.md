# Проектная работа "Веб-ларек"

<a href="https://amino-oacid.github.io/web-larek-frontend/" target="_blank">"Веб-ларек"</a>

## Используемый стек
HTML, SCSS, TS, Webpack

## Установка и запуск проекта
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка проекта
Для сборки проекта необходимо выполнить команды

```
npm run build
```

или

```
yarn build
```

## Описание архитектуры проекта

### Архитектура проектной работы:  

Проект разработан с использованием архитектуры Model-View-Presenter (MVP), суть которой заключается в разделении кода на три слоя:    
• слой данных (model) - отвечает за хранение и управление данными,    
• слой отображения (view) - обеспечивает отображение интерфейса,    
• слой взаимодействия между model и view (presenter) - связывает модель данных и отображение, обрабатывая события.

Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.


### Основная структура файлов проекта

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/index.ts — точка входа приложения
- src/components/base/api.ts — содержит класс Api, который реализует запросы к серверу
- src/components/base/events.ts — содержит класс EventEmitter, который выступает в роли Presenter
- src/components/model/ — содержит файлы с классами для работы с данными, реализующие слой Model 
- src/components/view/ — содержит компоненты пользовательского интерфейса, реализующие слой View
- src/types/index.ts — файл с типами
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/scss/styles.scss — корневой файл стилей

### Описание базовых классов

#### Api

Класс Api предназначен для реализации HTTP запросов к серверу. 

Свойства:
- baseUrl: string — базовый URL для всех запросов, используется вместе с URI, передаваемыми в методы.
- options: RequestInit — параметры запроса, включая заголовки и другие настройки.

Методы:
- constructor(baseUrl: string, options: RequestInit = {}) — конструктор класса инициализирует объект с базовым URL и опциями запроса.
- handleResponse<T>(response: Response): Promise<T> — метод для обработки ответов сервера. Если ответ успешный, он преобразует его в JSON и возвращает в виде промиса.
В случае ошибки возвращает ее.
- get<T>(uri: string): Promise<T> — метод для выполнения GET запроса.
- post(uri: string, data: object, method: ApiPostMethods = 'POST') — метод для выполнения POST запроса.

#### EventEmitter

Класс EventEmitter представляет собой брокер событий, реализующий подписку на события. Методы класса позволяют устанавливать и снимать слушатели событий, вызывать слушатели при возникновении события.  

Типы:
- EventName — тип для имени события. Может быть строкой или регулярным выражением.
- Subscriber — тип для обработчика события, который является функцией.
- EmitterEvent — объект, представляющий событие с данными, содержащий имя события и данные.

Свойства:
- _events: Map<EventName, Set<Subscriber>> — объект, хранящий события и наборы их подписчиков.

Методы:
- constructor() - конструктор инициализирует пустой объект для хранения событий и подписчиков. 
- on<T extends object>(eventName: EventName, callback: (event: T) => void) — метод для подписки на событие. Если событие ещё не зарегистрировано, оно создаётся в объекте.   
- off(eventName: EventName, callback: Subscriber) — метод для снятия подписки, удаляет указанный обработчик с события. Если для события больше не осталось обработчиков, оно удаляется из объекта.   
• emit<T extends object>(eventName: string, data?: T) — метод для инициирования события.  
• onAll(callback: (event: EmitterEvent) => void) — метод для подписки на все события 
• offAll() — метод для сброса всех подписчиков, очищает все события и обработчики.   
• trigger<T extends object>(eventName: string, context?: Partial<T>) — метод для создания функции-триггера, которая генерирует событие с переданными данными.  

#### AppApi

Класс AppApi наследуется от класса Api и предназначен для получения данных с сервера.

Методы: 
- constructor(private cdn: string, baseUrl: string, options?: RequestInit) - конструктор класса, инициализирующий объект с cdn для путей изображений, базовым URL, параметрами запроса.   
- getProductList(): Promise<ApiListResponse<IProductItem>> — получает список товаров с сервера и возвращает ответ, содержащий общее количество товаров (total) и массив товаров (items). При обработке каждого товара добавляет к полю image полный URL изображения.      
- postOrderForm(orderData: IOrderForm): Promise<IOrderResult> — отправляет данные формы заказа на сервер методом POST и возвращает успешный ответ от сервера с общей суммой заказа (total) и идентификатором заказа (id).   

### Описание классов слоя Model 

#### BasketModel

Класс BasketModel реализует интерфейс IBasketModel и управляет данными в корзине товаров.   

Свойства:
- _products: IProductItem[] - массив товаров в корзине.

Методы:  
- constructor() - конструктор инициализирует пустую корзину. 
- getProductsCount(): number — возвращает общее количество товаров в корзине.   
- getBasketPrice(): number — возвращает общую стоимость товаров в корзине.   
- addProduct(product: IProductItem): void — добавляет товар в корзину.   
- removeProduct(product: IProductItem): void — удаляет продукт из корзины.   
- clearBasket(): void — очищает корзину.     

#### DataModel

DataModel реализует интерфейс IDataModel и управляет данными о товарах и взаимодействует с событиями через интерфейс IEvents. 

Свойства:
- _products: IProductItem[] - массив товаров.
- product: IProductItem - один экземпляр товара.

Методы:  
- constructor(protected events: IEvents) - конструктор создает объект с событиями и пустым каталогом товаров.
- setModalWindowProduct(product: IProductItem) — устанавливает выбранный товар для модального окна и инициирует событие открытия модального окна modalWindowProduct:open.
- get products(): IProductItem[] - геттер, возвращающий массив товаров.
- set products(products: IProductItem[]) - сеттер, устанавливающий массив товаров и инициирующий событие products:receive.


#### OrderFormModel

Класс OrderFormModel реализует интерфейсы IOrderFormModel и IOrderForm и управляет данными при оформлении заказа.  

Свойства:
- payment: string, 
  email: string,
  phone: string,
  address: string  - данные заказа.
- total: number - общая сумма заказа.
- items: string[] - массив идентификаторов товаров в заказе.
- errors: OrderError = {} - объект, хранящий ошибки валидации.

Методы:    
- constructor(protected events: IEvents) - конструктор инициализирует объект с событиями и пустыми данными заказа.
- setOrderAddress(field: string, value: string): void — устанавливает значение адреса. Если валидация заказа успешна, инициирует событие orderForm:ready с обновлёнными данными заказа.    
- validateOrder(): boolean — выполняет проверку адреса и способа оплаты. Если валидация не проходит, заполняет объект ошибок errors и генерирует событие order:address.    
- setContactData(field: string, value: string): void — устанавливает контактные данные.  Если валидация успешна, вызывает событие orderForm:ready.    
- validateContacts(): boolean — выполняет проверку контактных данных. Если валидация не проходит, заполняет объект ошибок errors и генерирует событие order:contacts.    
- getOrderDetails(): object — возвращает объект с текущими данными заказа.       

### Описание классов слоя View

#### Page

Класс Page реализует интерфейс IPage и предназначен для отображения элементов на главной странице.

Свойства:
- _counterElement: HTMLElement - элемент счетчика товаров в корзине. 
- _catalogElement: HTMLElement - элемент каталога товаров на странице.
- _pageWrapperElement: HTMLElement - элемент обертки страницы.
- _basketElement: HTMLElement - элемент иконки корзины на странице.

Методы:
- constructor(protected events: IEvents) - конструктор инициализирует объект с событиями и находит все элементы на странице, а также устанавливает событие basket:open на иконку корзины.
- setText(element: HTMLElement, value: unknown): void - — устанавливает текстовое содержимое для указанного элемента.    
- set counter(value: number) - сеттер, устанавливающий счетчику корзины количество товаров.
- set catalog(items: HTMLElement[]) - сеттер, устанавливающий карточки товаров в каталог.
- set isLocked(locked: boolean) - сеттер, блокирующий прокрутку страницы.

#### Card

Класс Card реализует интерфейс ICard и предназначен для отображения карточки товара в списке на странице.   

Свойства:
- _cardElement: HTMLElement - элемент карточки товара.
- _cardTitleElement: HTMLElement - элемент заголовка товара.
-  _cardImageElement: HTMLImageElement - элемент изображения товара.
- _cardCategoryElement: HTMLElement - элемент категории товара.
- _cardPriceElement: HTMLElement - элемент цены товара.
- _categories: Record<string, string> - список, сопоставляющий категорию товара и класс элемента.

Методы:    
- constructor(protected template: HTMLTemplateElement, protected actions?: IActions) - конструктор, инициализирующий все элементы карточки товара и добавляет возможность пользовательских действий, таких как клик.
- setText(element: HTMLElement, value: unknown): void — устанавливает текстовое содержимое для указанного элемента.    
- setPrice(value: number | null): string — устанавливает цену товара.    
- setCardCategory(value: string): void — устанавливает текст категории товара и класс элемента категории товара.       
- render(product: IProductItem): HTMLElement — создает и возвращает элемент карточки товара.

#### CardPreview

Класс CardPreview наследуется от класса Card, реализует интерфейс ICardPreview  и предназначен для отображения детальной карточки товара в модальном окне.  

Свойства:
- cardDescriptionElement: HTMLElement - элемент описания товара.
-	actionButton: HTMLElement - элемент кнопки покупки товара.

Методы:    
- constructor(template: HTMLTemplateElement, private events: IEvents, actions?: IActions) - конструктор находит элементы детальной карточки товара и инициализирует событие product:addToBasket при клике на кнопку покупки товара.
- getActionButtonText(product: IProductItem): string — устанавливает текст кнопки в зависимости от наличия цены у товара.  
- render(product: IProductItem): HTMLElement — создает и возвращает элемент детальной карточки товара. 

#### BasketItem

Класс BasketItem реализует интерфейс IBasketItem и необходим для отображения товаров в корзине.  

Свойства:
- basketItemElement: HTMLElement - элемент товара в корзине.
- indexElement: HTMLElement - элемент индекса товара в корзине.
- titleBasketItemElement: HTMLElement - элемент заголовка товара в корзине.
- priceBasketItemElement: HTMLElement - элемент цены товара в корзине.
- deleteBasketItemElement: HTMLButtonElement - элемент иконки для удаления товара из корзины.

Методы:  
- constructor(template: HTMLTemplateElement, protected actions?: IActions) - конструктор находит элементы товаров в корзине и инициализирует добавляет клик на иконку для удаления товара из корзины.    
- setPrice(value: number | null): string — возвращает цену товара для отображения.   
- render(product: IProductItem, index: number): HTMLElement — создает и возвращает элемент товара в корзине. 

#### Basket

Класс Basket реализует интерфейс IBasket и необходим для отображения корзины товаров.   

Свойства:
- basketElement: HTMLElement - элемент корзины.
- basketTitle: HTMLElement - элемент заголовка корзины.
- basketList: HTMLElement - элемент списка товаров в корзине.
-	button: HTMLButtonElement - элемент кнопки оформления заказа в корзине.
-	basketPrice: HTMLElement - элемент общей стоимости товаров в корзине.

Методы:   
- constructor(template: HTMLTemplateElement, protected events: IEvents) - конструктор находит элементы корзины и инициализирует событие order:open для начала оформления заказа.
- set items(items: HTMLElement[]) — обновляет отображение корзины в зависимости от ее содержимого: если корзина не пустая, то отображаются товары и активируется кнопка оформления заказа, иначе отключается кнопка оформления заказа и отображается сообщение "Корзина пуста".   
- updateBasketPrice(price: number) — обновляет общую стоимость товаров в корзине.   
- render() — устанавливает заголовок корзины и возвращает контейнер с её содержимым.     

#### Form

Абстрактный класс Form реализует интерфейс IForm и предназначен для выноса общей логики двух форм заказа с данными заказа и контактами.

Свойства:
- formName: string - наименование формы.
- formElement: HTMLFormElement - элемент формы.
- formErrorsElement: HTMLElement - элемент для отображения сообщений об ошибках.
-  submitButton: HTMLButtonElement - элемент кнопки отправки формы.

Методы:
- constructor(template: HTMLTemplateElement, protected events: IEvents) - конструктор находит все элементы формы и иницииализирует события ${this.formName}:submit для отправки формы и ${this.formName}:input для ввода новых данных в форму.
- set isValid(value: boolean) - сеттер для деактивации кнопки отправки формы.
- render(): HTMLElement - возвращает элемент формы заказа.

#### Order

Класс Order наследуется от класса Form, реализует интерфейс IOrder и предназначен для отображения формы заказа, содержащей способ оплаты и адрес доставки.   

Свойства:
- buttons: HTMLButtonElement[] - массив кнопок выбора способа оплаты.

Методы:    
- constructor(template: HTMLTemplateElement, events: IEvents) - конструктор находит кнопки выбора способа оплаты и инициализирует событие order:paymentMethod выбора способа оплаты.
- set paymentMethod(method: string) — устанавливает выбранный метод оплаты, активируя соответствующую кнопку и деактивируя остальные.    

#### Contacts

Класс Contacts наследуется от класса Form, реализует интерфейс IContacts и предназначен для отображения формы с контактами.   

Свойства:
- inputs: HTMLInputElement[] - элементы ввода контактных данных.

Методы: 
- constructor(template: HTMLTemplateElement, events: IEvents) - конструктор находит элементы для ввода контактов и инициализирует событие contacts:change изменения данных.   

#### ModalWindow

Класс ModalWindow реализует интерфейс IModalWindow и предназначен для отображения модального окна.

Свойства:
- modalContainer: HTMLElement - элемент модального окна.
- closeButton: HTMLButtonElement - элемент кнопки закрытия окна.
- modalContent: HTMLElement - элемент содержимого окна.

Методы:      
- constructor(modalContainer: HTMLElement, private events: IEvents) - конструктор, инициализирующий элементы модального окна и навешивающий действие закрытия окна по клику на кнопку и вне окна.
- open(): void — отображает модальное окно и генерирует событие 'modal:open'.    
- close(): void — закрывает модальное окно и генерирует событие 'modal:close'.
- setContent(content: HTMLElement): void — заменяет содержимое модального окна на переданный элемент. 
- render(): HTMLElement — отображает модальное окно, вызывая метод open() и возвращает элемент контейнера модального окна.        

#### SuccessModalWindow

Класс SuccessModalWindow реализует интерфейс ISuccessModalWindow и предназначен для отображения модального окна с успешным оформлением заказа.    

Свойства:
- successElement: HTMLElement - элемент окна успешного оформления заказа.
- descriptionElement: HTMLElement - элемент описания модального окна.
- button: HTMLButtonElement - элемент кнопка закрытия окна.

Методы:         
- constructor(template: HTMLTemplateElement, private events: IEvents) - конструктор находит элементы модального окна с успешным оформлением заказа и инициализирует событие successModalWindow:close закрытия окна.
- render(total: number): HTMLElement — обновляет описание в окне, отображая информацию о списании средств, и возвращает элемент окна с успешным оформлением заказа.      
