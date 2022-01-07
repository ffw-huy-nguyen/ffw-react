import { ComponentMeta, ComponentStory } from "@storybook/react";

import GridItem from "./GridItem";
import { IGridItem } from "./GridItem.props";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/Layouts/Grid Item",
  component: GridItem,
} as ComponentMeta<typeof GridItem>;

const Template: ComponentStory<typeof GridItem> = (args) => (
  <GridItem {...args} />
);

export const Nodata = Template.bind({});
Nodata.args = { items: [], column: 3 };

const data: IGridItem[] = [
  {
    name: "Item 1",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 2",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 3",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 4",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 5",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 6",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 7",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 8",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 9",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 10",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 11",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 12",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 13",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 14",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 15",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 16",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 17",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 18",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 19",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 20",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 21",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 22",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 23",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 24",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 25",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 26",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 27",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 28",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
  {
    name: "Item 29",
    image: "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
  },
];

export const Data = Template.bind({});
Data.args = { items: data, column: 3 };

export const Data4Column = Template.bind({});
Data4Column.args = { items: data, column: 4 };
