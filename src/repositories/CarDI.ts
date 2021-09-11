import Base from "./BaseDI";

class Car extends Base {
  constructor() {
    super('car')
  }
}

export default new Car();
