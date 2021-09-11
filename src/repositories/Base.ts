interface Pagination {
  perPage: number;
  skip: number
}

export interface Params {
  field: string;
  value: string
}

export interface BaseRepo {
  getAll<ItemType>(pagination: Pagination, params?: Params): Promise<{ items: ItemType[], total: number }>;

  getDetail(): string;

  create(): string;

  updated(): string;

  delete(): string;
}

export default class Base implements BaseRepo {
  private endpointUrl: string;
  constructor(contentType: string) {
    this.endpointUrl = `${process.env.REACT_APP_API_URL}/spaces/${process.env.REACT_APP_SPACE_ID}/environments/${process.env.REACT_APP_ENVIROMENT}/entries?content_type=${contentType}&access_token=${process.env.REACT_APP_ACCESS_TOKEN}`
  }

  async getAll<ItemType>(pagination: Pagination, params?: Params): Promise<{ items: ItemType[], total: number }> {
    let search = '';
    if (params && params.field && params.value) {
      search = `&fields.${params.field}[match]=${params.value}`
    }
    const res = await fetch(
      `${this.endpointUrl}&limit=${pagination.perPage}&skip=${pagination.skip}${search}`
    )
    return await res.json();
  }

  getDetail(): string {
    return "";
  }

  create(): string {
    return "";
  }

  updated(): string {
    return "";
  }

  delete(): string {
    return "";
  }

}
