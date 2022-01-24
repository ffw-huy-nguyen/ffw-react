import React, { useEffect, useState } from "react";
import { IPostApi } from "./apis/Api.interface";
import GridItem from "./components/GridItem/GridItem";
import { IGridItem } from "./components/GridItem/GridItem.props";
import container from "./DI/container";
import TYPES from "./DI/types";

const postApi = container.get<IPostApi>(TYPES.IProductApi);

function App() {
  const [items, setItems] = useState<IGridItem[]>([]);
  useEffect(() => {
    const getPosts = async () => {
      const response = await postApi.getAll();
      console.log("response", response);
    };
    getPosts();
  }, []);
  return (
    <>
      <GridItem items={items} column={4} />
    </>
  );
}

export default App;
