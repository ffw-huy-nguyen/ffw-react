/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
interface Pagination {
  currentPage: number;
  skip: number;
  perPage: number;
  totalPages: number;
  pages: {
    page: number;
    active: boolean;
  }[];
}

export default function useList<ItemType>(contentType: string = "car") {
  const [items, setItems] = useState<ItemType[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    perPage: 10,
    skip: 0,
    totalPages: 0,
    pages: [],
  });

  useEffect(() => {
    (function () {
      fetch(
        `https://cdn.contentful.com/spaces/5jo55pzix7dl/environments/master/entries?access_token=kLs7q43KVc1rnH70ugLXV-w-pIJcSM9lOY2gT8PyvZk&content_type=${contentType}&limit=${pagination.perPage}&skip=${pagination.skip}`
      )
        .then((results) => results.json())
        .then((data) => {
          setItems(data.items);
          const totalPages = Math.ceil(data.total / pagination.perPage);
          setPagination({
            ...pagination,
            totalPages,
          });
        });
    })();
  }, [pagination.currentPage]);

  useEffect(() => {
    (function () {
      const pages = [];
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push({
          page: i,
          active: i === pagination.currentPage,
        });
      }
      setPagination({
        ...pagination,
        pages,
      });
    })();
  }, [pagination.totalPages]);

  function changePagination(e: any) {
    let page = e.target.value;
    setPagination({
      ...pagination,
      currentPage: parseInt(page),
      skip: (page - 1) * pagination.perPage,
    });
  }

  function Pagination() {
    return (
      <select value={pagination.currentPage} onChange={changePagination}>
        {pagination.totalPages > 0 &&
          pagination.pages.map((page) => {
            return (
              <option value={page.page} key={`page_${page.page}`}>
                {page.page}
              </option>
            );
          })}
      </select>
    );
  }
  return {
    items,
    pagination,
    Pagination,
  };
}
