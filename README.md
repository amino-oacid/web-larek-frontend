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

Методы:           
- handleResponse<T>(response: Response): Promise<T> — метод для обработки ответов сервера. Если ответ успешный, он преобразует его в JSON и возвращает в виде промиса.
В случае ошибки возвращает ее.
- get<T>(uri: string): Promise<T> — метод для выполнения GET запроса.
- post(uri: string, data: object, method: ApiPostMethods = 'POST') — метод для выполнения POST запроса.

#### EventEmitter

Класс EventEmitter представляет собой брокер событий, реализующий подписку на события. Методы класса позволяют устанавливать и снимать слушатели событий, вызывать слушатели при возникновении события.           

Методы:     
- on<T extends object>(eventName: EventName, callback: (event: T) => void) — метод для подписки на событие. Если событие ещё не зарегистрировано, оно создаётся в объекте.   
- off(eventName: EventName, callback: Subscriber) — метод для снятия подписки, удаляет указанный обработчик с события. Если для события больше не осталось обработчиков, оно удаляется из объекта.   
• emit<T extends object>(eventName: string, data?: T) — метод для инициирования события.  
• onAll(callback: (event: EmitterEvent) => void) — метод для подписки на все события 
• offAll() — метод для сброса всех подписчиков, очищает все события и обработчики.   
• trigger<T extends object>(eventName: string, context?: Partial<T>) — метод для создания функции-триггера, которая генерирует событие с переданными данными.  

### Описание классов слоя Model 

#### ApiModel

Класс ApiModel наследуется от класса Api и предназначен для получения данных с сервера.

Методы:   
- getProductList(): Promise<ApiListResponse<IProductItem>> — получает список товаров с сервера и возвращает ответ, содержащий общее количество товаров (total) и массив товаров (items). При обработке каждого товара добавляет к полю image полный URL изображения.      
- postOrderForm(orderData: IOrderForm): Promise<IOrderResult> — отправляет данные формы заказа на сервер методом POST и возвращает успешный ответ от сервера с общей суммой заказа (total) и идентификатором заказа (id).   

#### BasketModel

Класс BasketModel реализует интерфейс IBasketModel и управляет данными в корзине товаров.   

Методы:   
• getProductsCount(): number — возвращает общее количество товаров в корзине.   
• getBasketPrice(): number — возвращает общую стоимость товаров в корзине.   
• addProduct(product: IProductItem): void — добавляет товар в корзину.   
• removeProduct(product: IProductItem): void — удаляет продукт из корзины.   
• clearBasket(): void — очищает корзину.     

#### DataModel

DataModel реализует интерфейс IDataModel и управляет данными о товарах и взаимодействует с событиями через интерфейс IEvents.     

Методы:     
• setModalWindowProduct(product: IProductItem) — устанавливает выбранный продукт для модального окна и инициирует событие открытия модального окна modalWindowProduct:open.    

#### OrderFormModel

Класс OrderFormModel реализует интерфейсы IOrderFormModel и IOrderForm и управляет данными при оформлении заказа.    

Методы:    
- setOrderAddress(field: string, value: string): void — устанавливает значение адреса. Если валидация заказа успешна, инициирует событие orderForm:ready с обновлёнными данными заказа.    
- validateOrder(): boolean — выполняет проверку адреса и способа оплаты. Если валидация не проходит, заполняет объект ошибок errors и генерирует событие orderFormErrors:address.    
- setContactData(field: string, value: string): void — устанавливает контактные данные.  Если валидация успешна, вызывает событие orderForm:ready.    
- validateContacts(): boolean — выполняет проверку контактных данных. Если валидация не проходит, заполняет объект ошибок errors и генерирует событие orderFormErrors:contacts.    
- getOrderDetails(): object — возвращает объект с текущими данными заказа.       

### Описание классов слоя View

#### Card

Класс Card реализует интерфейс ICard и предназначен для отображения карточки товара в списке на странице.   

Методы:    
- setText(element: HTMLElement, value: unknown): void — устанавливает текстовое содержимое для указанного элемента.    
- setPrice(value: number | null): string — устанавливает цену товара.    
- setCardCategory(value: string): void — устанавливает текст категории товара и класс элемента категории товара.       
- render(product: IProductItem): HTMLElement — создает и возвращает элемент карточки товара.

#### CardPreview

Класс CardPreview наследуется от класса Card, реализует интерфейс ICardPreview  и предназначен для отображения детальной карточки товара в модальном окне.  

Методы:    
- getActionButtonText(product: IProductItem): string — устанавливает текст кнопки в зависимости от наличия цены у товара.  
- render(product: IProductItem): HTMLElement — создает и возвращает элемент детальной карточки товара. 

#### BasketItem

Класс BasketItem реализует интерфейс IBasketItem и необходим для отображения товаров в корзине.  

Методы:        
• setPrice(value: number | null): string — возвращает цену товара для отображения.   
• render(product: IProductItem, index: number): HTMLElement — создает и возвращает элемент товара в корзине. 

#### Basket

Класс Basket реализует интерфейс IBasket и необходим для отображения корзины товаров.   

Методы:   
- set items(items: HTMLElement[]) — обновляет отображение корзины в зависимости от ее содержимого: если корзина не пустая, то отображаются товары и активируется кнопка оформления заказа, иначе отключается кнопка оформления заказа и отображается сообщение "Корзина пуста".   
- updateBasketHeaderCounter(value: number) — обновляет счетчик товаров корзины.   
- updateBasketPrice(price: number) — обновляет общую стоимость товаров в корзине.   
- render() — устанавливает заголовок корзины и возвращает контейнер с её содержимым.     

#### Order

Класс Order реализует интерфейс IOrder и предназначен для отображения формы заказа.   

Методы:    
- set paymentMethod(method: string) — устанавливает выбранный метод оплаты, активируя соответствующую кнопку и деактивируя остальные.    
- set isValid(value: boolean) — устанавливает состояние кнопки отправки формы.   
- render() — возвращает элемент формы заказа.

#### Contacts

Класс Contacts реализует интерфейс IContacts и предназначен для отображения формы с контактами.   

Методы:   
- set isValid(value: boolean) — устанавливает состояние кнопки отправки формы.        
- render(): HTMLElement — возвращает элемент формы.          

#### ModalWindow

Класс ModalWindow реализует интерфейс IModalWindow и предназначен для отображения модального окна.

Методы:      
- open(): void — отображает модальное окно и генерирует событие 'modal:open'.    
- close(): void — закрывает модальное окно и генерирует событие 'modal:close'.
- setContent(content: HTMLElement): void — заменяет содержимое модального окна на переданный элемент. 
- set isLocked(locked: boolean) - управляет активацией или снятия блокировки страницы.    
- render(): HTMLElement — отображает модальное окно, вызывая метод open() и возвращает элемент контейнера модального окна.        

#### SuccessModalWindow

Класс SuccessModalWindow реализует интерфейс ISuccessModalWindow и предназначен для отображения модального окна с успешным оформлением заказа.    

Методы:         
- render(total: number): HTMLElement — обновляет описание в окне, отображая информацию о списании средств, и возвращает элемент окна с успешным оформлением заказа.      
