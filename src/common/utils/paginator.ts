import { Model, ModelCtor } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';

export interface PaginateResponse<T> {
  lastPage: number;
  totalRecords: number;
  currentPage: number;
  hasMorePages: boolean;
  data: T[];
}

export default class Paginator<T extends Model> {
  private model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async paginate(
    options: FindOptions,
    currentPage: number,
    limitTo: number,
    optionsForCalculateTotal?: FindOptions,
  ): Promise<PaginateResponse<T>> {
    const offset = (currentPage - 1) * limitTo;

    const resultsTotal = await this.model.findAll<T>(
      optionsForCalculateTotal ?? options,
    );

    const totalRecords = resultsTotal.length;

    const results = await this.model.findAll<T>({
      ...options,
      offset,
      limit: limitTo,
    });

    const lastPage = totalRecords > 0 ? Math.ceil(totalRecords / limitTo) : 0;
    const hasMorePages = currentPage < lastPage;

    return { lastPage, totalRecords, currentPage, hasMorePages, data: results };
  }
}
