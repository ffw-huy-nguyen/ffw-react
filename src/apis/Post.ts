import Api from "./Api";
import { IPostApi } from "./Api.interface";
import { injectable } from "inversify";

@injectable()
class Post extends Api implements IPostApi {
  constructor() {
    super("posts");
  }
}

export default Post;
