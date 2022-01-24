import React, { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = (props: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main>
        <div className="main-content">
          {props.children}
        </div>
      </main>
      <footer>Footer</footer>
    </>
  );
};

export const withBlogLayout = (Component: FunctionComponent) => {
  return function withMainLayoutComponent(props: any) {
    return (
      <MainLayout>
        <Component {...props} />
      </MainLayout>
    );
  };
};
