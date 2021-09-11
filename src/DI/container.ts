import { Container } from "inversify";
import "reflect-metadata";
import IHttp from "../repositories/IHttp";
import Http from "../repositories/FetchHttp";
import TYPES from "./types";

const container = new Container();
container.bind<IHttp>(TYPES.IHttp).to(Http);
export default container
