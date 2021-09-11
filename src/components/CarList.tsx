import React, { useState } from "react";
import useList from "../hooks/useList";
import CarRepo from "../repositories/Car";
import SearchField from "react-search-field";

interface Car {
  fields: {
    name: string;
    brand: string;
    price: number;
  };
}

function CarListHook() {
  const [searchText, setSearchText] = useState("");
  const { items, pagination, Pagination } = useList<Car>(CarRepo, {
    field: "name",
    value: searchText,
  });

  function onChange(value: string) {
    setSearchText(value)
  }

  return (
    <div>
      <h2>Hello</h2>
      <SearchField
        placeholder="Search..."
        onChange={onChange}
        searchText={searchText}
        classNames="test-class"
      />
      {pagination.totalPages > 0 &&
        items.map((item, index) => {
          return (
            <div key={index}>
              {item.fields.name} {item.fields.name} | {item.fields.brand} - $
              {item.fields.price}
            </div>
          );
        })}
      <Pagination />
    </div>
  );
}

export default CarListHook;
