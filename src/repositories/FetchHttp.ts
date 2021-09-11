import { injectable } from "inversify";
import IHttp from "./IHttp";

@injectable()
class FetchHttp implements IHttp {
  async get(url: string) {
    console.log('get method fecth')
    const res = await fetch(url)
    return await res.json();
  }
  post(url: string, data: {}){
  
  }
  put(url: string, data: {}){
  
  }
  delete(url: string){
  
  }
}

export default FetchHttp
