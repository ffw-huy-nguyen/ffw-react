import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { IPostApi } from "../apis/Api.interface";
import container from "../DI/container";
import TYPES from "../DI/types";
const postApi = container.get<IPostApi>(TYPES.IProductApi);

const BlogDetail = () => {
  let params = useParams();
  console.log(params);
  let blogId = params.blogId;

  useEffect(() => {
    const getPosts = async () => {
      const response = await postApi.getDetail(`${blogId}`);
      console.log("response", response);
    };
    getPosts();
  }, []);

  return <div>Detail</div>;
};

export default BlogDetail;
