export default interface IHttp {
  get(url: string): any;
  post(url: string, data: {}): any;
  put(url: string, data: {}): any;
  delete(url: string): any;
}
