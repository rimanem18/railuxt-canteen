/**
 * 料理機能の外部公開API
 * 他のfeatureから料理機能を利用する際は、このファイルを通してアクセスする
 */

// Components
export { default as DishesDishCard } from './components/DishCard.vue'
export { default as DishesIndex } from './components/DishesIndex.vue'

// Types
export type {
  Dish,
  PaginationMeta,
  DishListResponse,
  DishDetailResponse,
} from './types/index'

// Schemas (バリデーション用)
export {
  DishSchema,
  PaginationMetaSchema,
  DishListResponseSchema,
  DishDetailResponseSchema,
} from './types/index'
