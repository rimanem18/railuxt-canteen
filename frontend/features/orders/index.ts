/**
 * 注文機能の外部公開API
 * 他のfeatureから注文機能を利用する際は、このファイルを通してアクセスする
 */

// Components
export { default as OrdersOrderList } from './components/OrderList.vue'
export { default as OrdersIndex } from './components/OrdersIndex.vue'

// Types
export type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderListResponse,
  OrderDetailResponse,
  CreateOrderResponse,
} from './types/index'

// Schemas (バリデーション用)
export {
  OrderSchema,
  CreateOrderRequestSchema,
  UpdateOrderRequestSchema,
  OrderListResponseSchema,
  OrderDetailResponseSchema,
  CreateOrderResponseSchema,
} from './types/index'
