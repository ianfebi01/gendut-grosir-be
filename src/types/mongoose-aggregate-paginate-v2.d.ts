declare module 'mongoose-aggregate-paginate-v2' {
  import type { Schema } from 'mongoose'
  function aggregatePaginate(schema: Schema): void
  export = aggregatePaginate
}

declare module 'mongoose' {
  interface AggregatePaginateModel<T> extends Model<T> {
    aggregatePaginate<R = unknown>(
      query: Aggregate<R[]>,
      options?: PaginateOptions
    ): Promise<PaginateResult<R>>
  }
}
