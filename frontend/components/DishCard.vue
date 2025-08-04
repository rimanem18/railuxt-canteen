<template>
  <article
    class="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 overflow-hidden"
    role="article"
    :aria-labelledby="`dish-title-${dish.id}`"
    :aria-describedby="`dish-price-${dish.id}`"
  >
    <!-- 背景グラデーション装飾 -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <!-- 料理情報 -->
    <div class="relative z-10">
      <!-- 料理名 -->
      <h2
        :id="`dish-title-${dish.id}`"
        class="font-semibold text-lg text-gray-900 leading-tight mb-3 group-hover:text-gray-800 transition-colors duration-200"
      >
        {{ dish.name }}
      </h2>

      <!-- 価格表示 -->
      <div class="mb-6">
        <span class="sr-only">価格:</span>
        <p
          :id="`dish-price-${dish.id}`"
          class="text-2xl font-bold text-gray-800 tracking-tight"
        >
          ¥{{ formatPrice(dish.price) }}
        </p>
      </div>

      <!-- 注文ボタン -->
      <button
        type="button"
        class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out shadow-sm hover:shadow-md"
        :aria-label="`${dish.name}を注文する（価格: ¥${formatPrice(dish.price)}）`"
        @click="$emit('order', dish.id)"
      >
        <span class="flex items-center gap-2">
          <!-- カートアイコン -->
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m5.5-5a1 1 0 100 2 1 1 0 000-2zm5 0a1 1 0 100 2 1 1 0 000-2z"
            />
          </svg>
          注文する
        </span>
      </button>
    </div>

    <!-- ホバー時の微細な装飾線 -->
    <div class="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
  </article>
</template>

<script setup lang="ts">
/** 料理の型定義 */
interface Dish {
  /** 料理ID */
  id: number
  /** 料理名 */
  name: string
  /** 価格（円） */
  price: number
}

/** 料理カードを表示するコンポーネント */
defineProps<{
  /** 表示する料理の情報 */
  dish: Dish
}>()

/**
 * 料理の注文イベント
 * @param order - 料理IDを受け取る
 */
defineEmits<{
  order: [dishId: number]
}>()

/**
 * 価格をカンマ区切りでフォーマットする
 * @param price - フォーマットする価格
 * @returns カンマ区切りの価格文字列
 */
const formatPrice = (price: number): string => {
  // 数値の妥当性確認
  if (typeof price !== 'number' || isNaN(price)) {
    return '0'
  }

  // 3桁区切りのカンマを挿入してより読みやすく表示
  return price.toLocaleString('ja-JP')
}
</script>
