import type { CustomLabels } from 'mongoose'

export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error)

/** Labels used by every paginated list response. */
export const paginationLabels: CustomLabels = {
  totalDocs: 'itemCount',
  docs: 'data',
  meta: 'paginator',
}

export interface ListQuery {
  q?: string
  limit?: string
  page?: string
}

/** Same defaults the API has always used: 25 items, first page. */
export const pageOptions = ({ limit, page }: ListQuery) => ({
  limit: limit ? Number(limit) : 25,
  page: page ? Number(page) : 1,
})
