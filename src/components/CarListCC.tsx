/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component } from "react";
interface Car {
  fields: {
    name: string;
  };
}
interface PaginationPage {
  page: number;
  active: boolean;
}
interface Pagination {
  currentPage: number;
  skip: number;
  perPage: number;
  totalPages: number;
  pages: PaginationPage[];
}

interface StateTypes {
  items: Car[];
  pagination: Pagination;
}

class CarListCC extends Component<{}, StateTypes> {
  constructor(props: {}) {
    super(props);
    this.state = {
      items: [],
      pagination: {
        currentPage: 1,
        perPage: 10,
        skip: 0,
        totalPages: 0,
        pages: [],
      },
    };

  }

  getItems() {
    fetch(
      `https://cdn.contentful.com/spaces/5jo55pzix7dl/environments/master/entries?access_token=kLs7q43KVc1rnH70ugLXV-w-pIJcSM9lOY2gT8PyvZk&content_type=car&limit=${this.state.pagination.perPage}&skip=${this.state.pagination.skip}`
    )
      .then((results) => results.json())
      .then((data) => {
        const totalPages = Math.ceil(
          data.total / this.state.pagination.perPage
        );
        this.setState(
          (state) => {
            return {
              ...state,
              items: data.items,
              pagination: {
                ...state.pagination,
                totalPages,
              },
            };
          } //,() => this.renderPagination()
        );

      });
  }

  changePagination(e: any) {
    let page = e.target.value;
    this.setState((state) => {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          currentPage: page,
          skip: (page - 1) * state.pagination.perPage,
        },
      };
    });
  }

  renderPagination() {
    const pages: PaginationPage[] = [];
    for (let i = 1; i <= this.state.pagination.totalPages; i++) {
      pages.push({
        page: i,
        active: i === this.state.pagination.currentPage,
      });
    }

    this.setState((state) => {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          pages,
        },
      };
    });
  }

  componentDidMount() {
    this.getItems();
  }

  componentDidUpdate(prvProp: {}, prevState: StateTypes) {
    if (
      this.state.pagination.currentPage !== prevState.pagination.currentPage
    ) {
      this.getItems();
    }
    if (
      this.state.pagination.totalPages !== prevState.pagination.totalPages
    ) {
      this.renderPagination()
    }
  }

  //componentWillUnmount()

  render() {
    const { pagination, items } = this.state;
    return (
      <div>
        <h2>Hello</h2>
        {pagination.totalPages > 0 &&
          items.map((item, index) => {
            return <div key={index}>{item.fields.name}</div>;
          })}
        <select value={pagination.currentPage} onChange={this.changePagination}>
          {pagination.totalPages > 0 &&
            pagination.pages.map((page) => {
              return (
                <option value={page.page} key={`page_${page.page}`}>
                  {page.page}
                </option>
              );
            })}
        </select>
      </div>
    );
  }
}

export default CarListCC;
