import React, { FunctionComponent, ReactNode } from "react";

const MainLayout = (props: { children: ReactNode }) => {
  return (
    <>
      <main>{props.children}</main>
      <footer>Footer</footer>
    </>
  );
};

export const withMainLayout = (Component: FunctionComponent) => {
  return function withMainLayoutComponent(props: any) {
    return (
      <MainLayout>
        <Component {...props} />
      </MainLayout>
    );
  };
};
