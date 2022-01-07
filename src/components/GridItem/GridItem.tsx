import { useEffect, useState } from "react";
import { IGridItem } from "./GridItem.props";
const GridItem = ({
  items,
  column,
}: {
  items: IGridItem[];
  column: number;
}) => {
  const perPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState<IGridItem[]>([]);

  useEffect(() => {
    const tempItems = [...items];
    setPaginatedItems(tempItems.splice((currentPage - 1) * perPage, perPage));
  }, [currentPage, items]);

  return (
    <>
      {items.length > 0 ? (
        <>
          <div className={`grid-column grid-column--${column}`}>
            {paginatedItems.map((item, index) => {
              return (
                <div className="grid-item" key={`grid_item_${index}`}>
                  <img
                    style={{ width: "150px" }}
                    src={item.image}
                    alt={item.name}
                  />
                  <h3>{item.name}</h3>
                </div>
              );
            })}
          </div>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          <button
            disabled={currentPage === Math.ceil(items.length / perPage)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </>
      ) : (
        <>No data</>
      )}
    </>
  );
};

export default GridItem;
