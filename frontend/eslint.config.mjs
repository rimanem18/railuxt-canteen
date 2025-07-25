import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // TypeScript関連のルール
      '@typescript-eslint/no-explicit-any': 'warn', // まずは警告から開始
      '@typescript-eslint/no-unused-vars': 'warn',

      // Vue関連のルール
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',

      // 一般的なルール
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },
)
