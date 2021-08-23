import React from "react";
import useList from "../hooks/useList";

interface Car {
  fields: {
    name: string;
  };
}

function CarListHook() {
  const { items, pagination, Pagination } = useList<Car>();

  return (
    <div>
      <h2>Hello</h2>
      {pagination.totalPages > 0 &&
        items.map((item, index) => {
          return <div key={index}>{item.fields.name}</div>;
        })}
      <Pagination />
    </div>
  );
}

export default CarListHook;
