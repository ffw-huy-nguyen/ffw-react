import { injectable } from "inversify";
import IHttp from "./IHttp";

@injectable()
class AxiosHttp implements IHttp {
  async get(url: string) {
    console.log('get method from axios')
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

export default AxiosHttp
