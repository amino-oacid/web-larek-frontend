
// Интерфейс, описывающий товар
export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс, описывающий список товаров
export interface IProductList {
  total: number;
  items: IProductItem[];
}

// Интерфейс, описывающий заказ
export interface IOrderForm {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Интерфейс, описывающий успешный результат заказа
export interface IOrderResult {
  id: string;
  total: number;
}

// Интерфейс, описывающий ошибку
export interface IError {
  error: string;
}

// Интерфейс с методом клика
export interface IActions {
  onClick: (event: MouseEvent) => void;
}

// Тип ошибки при заказе
export type OrderError = Record<string, string>