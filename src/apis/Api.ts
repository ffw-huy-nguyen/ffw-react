import { IApi } from "./Api.interface";
import { injectable } from "inversify";

@injectable()
class Api implements IApi {
  constructor(private path: string) {}
  async getAll() {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/${this.path}`
    );
    return await res.json();
  }

  async getDetail<ItemType>(id: string): Promise<ItemType> {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/${this.path}/${id}`
    );
    return await res.json();
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

export default Api;
