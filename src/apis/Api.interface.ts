export interface IApi {
  getAll<ItemType>(): Promise<ItemType[]>;

  getDetail(): string;

  create(): string;

  updated(): string;

  delete(): string;
}

export interface IPostApi extends IApi {}
