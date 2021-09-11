/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { BaseRepo, Params } from "../repositories/Base";
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

export default function useList<ItemType>(repo: BaseRepo, params?: Params) {
  const [items, setItems] = useState<ItemType[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    perPage: 10,
    skip: 0,
    totalPages: 0,
    pages: [],
  });

  const getItems = async () => {
    const data = await repo.getAll<ItemType>(pagination, params);
    setItems(data.items);
    const totalPages = Math.ceil(data.total / pagination.perPage);
    setPagination({
      ...pagination,
      totalPages,
    });
  };

  useEffect(() => {
    getItems();
  }, [pagination.currentPage, params?.value]);

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
