import { Api, ApiListResponse } from '../base/api';
import { IOrderForm, IOrderResult, IProductItem } from '../../types/index';

// Класс, наследующийся от Api и получающий данные с сервера
export class ApiModel extends Api {
  
  constructor(private cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  async getProductList(): Promise<ApiListResponse<IProductItem>> {
    const data = await this.get<ApiListResponse<IProductItem>>('/product');
    return {
      total: data.total,
      items: data.items.map(item => ({
        ...item,
        image: this.cdn + item.image
      }))
    };
  }

  postOrderForm(orderData: IOrderForm): Promise<IOrderResult> {
		return this.post('/order', orderData).then((data: IOrderResult) => data)
	}

}