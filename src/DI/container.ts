import { Container } from "inversify";
import "reflect-metadata";
import { IPostApi } from "../apis/Api.interface";
import Posts from "../apis/Post";
import MockPost from "../apis/MockPost";
import TYPES from "./types";

const container = new Container({ skipBaseClassChecks: true });
container.bind<IPostApi>(TYPES.IProductApi).to(MockPost);

export default container;
