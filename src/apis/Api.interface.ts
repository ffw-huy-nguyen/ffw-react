export interface IApi {
  getAll<ItemType>(): Promise<ItemType[]>;

  getDetail<ItemType>(id: string): Promise<ItemType>;

  create(): string;

  updated(): string;

  delete(): string;
}

export interface IPostApi extends IApi {}
