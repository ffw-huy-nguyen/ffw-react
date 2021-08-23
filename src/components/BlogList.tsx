import React, { Component } from "react";
import withListItems from "../hocs/withListItems";

interface Blog {
  fields: {
    name: string;
    description: string;
  };
}

class BlogList extends Component<{ items: Blog[] }, {}> {
  render() {
    return (
      <>
        <h2>My blogs</h2>
        {this.props.items.map((item, index) => {
          return <div key={index}>{item.fields.name}</div>;
        })}
      </>
    );
  }
}

export default withListItems<Blog>(BlogList, 'blog');
