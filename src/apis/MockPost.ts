import { IGridItem } from "../components/GridItem/GridItem.props";
import { IPostApi } from "./Api.interface";
import { injectable } from "inversify";

const data = [
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

@injectable()
class MockPost implements IPostApi {
  async getAll<ItemType>(): Promise<ItemType[]> {
    return await new Promise((resolve) => {
      resolve(data as unknown as ItemType[]);
    });
  }

  async getDetail<ItemType>(id: string): Promise<ItemType> {
    const detail = {
      name: "Item 29",
      image:
        "https://thienanblog.com/wp-content/uploads/2017/10/react-logo.png",
    };
    return await new Promise((resolve) => {
      resolve(detail as unknown as ItemType);
    });
  }

  create(): string {
    return "";
  }

  updated(): string {
    return "";
  }

  delete(): string {
    return "";
  }
}

export default MockPost;
