import { http, HttpResponse } from 'msw'
import type { Order } from '~/types/api'

/**
 * テスト用のサンプル注文データ
 */
const mockOrders: Order[] = [
  {
    id: 1,
    dish_id: 1,
    user_id: 1,
    quantity: 2,
    total_price: 1000,
    status: 'pending',
    created_at: '2025-01-20T10:00:00Z',
    updated_at: '2025-01-20T10:00:00Z',
    dish: {
      id: 1,
      name: 'カレーライス',
      price: 500,
      created_at: '2025-01-15T08:00:00Z',
      updated_at: '2025-01-15T08:00:00Z',
    },
    user: {
      id: 1,
      name: 'テストユーザー',
      email: 'test@example.com',
    },
  },
  {
    id: 2,
    dish_id: 2,
    user_id: 1,
    quantity: 1,
    total_price: 700,
    status: 'completed',
    created_at: '2025-01-19T14:30:00Z',
    updated_at: '2025-01-19T15:00:00Z',
    dish: {
      id: 2,
      name: 'ラーメン',
      price: 700,
      created_at: '2025-01-15T08:00:00Z',
      updated_at: '2025-01-15T08:00:00Z',
    },
    user: {
      id: 1,
      name: 'テストユーザー',
      email: 'test@example.com',
    },
  },
  {
    id: 3,
    dish_id: 1,
    user_id: 1,
    quantity: 1,
    total_price: 500,
    status: 'preparing',
    created_at: '2025-01-21T12:15:00Z',
    updated_at: '2025-01-21T12:20:00Z',
    dish: {
      id: 1,
      name: 'カレーライス',
      price: 500,
      created_at: '2025-01-15T08:00:00Z',
      updated_at: '2025-01-15T08:00:00Z',
    },
    user: {
      id: 1,
      name: 'テストユーザー',
      email: 'test@example.com',
    },
  },
]

/**
 * MSWハンドラー定義
 * APIエンドポイントのモックレスポンスを提供
 */
export const handlers = [
  /**
   * 注文一覧取得API
   * GET /api/v1/orders
   */
  http.get('http://localhost:3001/api/v1/orders', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const startDate = url.searchParams.get('start_date')
    const endDate = url.searchParams.get('end_date')
    const cursor = url.searchParams.get('cursor')

    // フィルタリング処理
    let filteredOrders = [...mockOrders]

    // ステータスフィルター
    if (status) {
      filteredOrders = filteredOrders.filter(
        order => order.status === status,
      )
    }

    // 日付範囲フィルター
    if (startDate) {
      filteredOrders = filteredOrders.filter(
        order =>
          order.created_at && new Date(order.created_at) >= new Date(startDate),
      )
    }
    if (endDate) {
      filteredOrders = filteredOrders.filter(
        order =>
          order.created_at && new Date(order.created_at) <= new Date(endDate),
      )
    }

    // ページネーション処理（カーソルベース）
    const pageSize = 10
    let startIndex = 0
    if (cursor) {
      startIndex = parseInt(cursor, 10)
    }

    const paginatedOrders = filteredOrders.slice(
      startIndex,
      startIndex + pageSize,
    )
    const hasNextPage = startIndex + pageSize < filteredOrders.length
    const nextCursor = hasNextPage ? String(startIndex + pageSize) : undefined

    return HttpResponse.json({
      orders: paginatedOrders,
      next_cursor: nextCursor,
    })
  }),

  /**
   * 注文ステータス更新API
   * PATCH /api/v1/orders/:id
   */
  http.patch(
    'http://localhost:3001/api/v1/orders/:id',
    async ({ params, request }) => {
      const orderId = parseInt(params.id as string, 10)
      const body = (await request.json()) as { order: { status: string } }

      const orderIndex = mockOrders.findIndex(order => order.id === orderId)
      if (orderIndex === -1) {
        return new HttpResponse(null, { status: 404 })
      }

      // ステータスを更新
      const validStatuses = [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'completed',
        'cancelled',
      ] as const
      type ValidStatus = (typeof validStatuses)[number]
      if (validStatuses.includes(body.order.status as ValidStatus)) {
        mockOrders[orderIndex] = {
          ...mockOrders[orderIndex],
          status: body.order.status as ValidStatus,
          updated_at: new Date().toISOString(),
        }
      }
      else {
        return new HttpResponse(null, { status: 422 })
      }

      return HttpResponse.json(mockOrders[orderIndex])
    },
  ),

  /**
   * 認証関連のモック
   * DeviseTokenAuthのエンドポイント
   */
  http.post('http://localhost:3001/api/v1/auth/sign_in', () => {
    return HttpResponse.json(
      {
        data: {
          id: 1,
          email: 'test@example.com',
          name: 'テストユーザー',
        },
      },
      {
        headers: {
          'access-token': 'mock-access-token',
          'client': 'mock-client',
          'uid': 'test@example.com',
        },
      },
    )
  }),

  http.delete('http://localhost:3001/api/v1/auth/sign_out', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('http://localhost:3001/api/v1/auth/validate_token', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 1,
        email: 'test@example.com',
        name: 'テストユーザー',
      },
    })
  }),
]
