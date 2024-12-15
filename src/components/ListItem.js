import "../css/ListItem.css";
import arrowLeft from "../assets/arrow_left.png";
import arrowRight from "../assets/arrow_right.png";

const ListItem = ({
  name,
  description,
  isCreateNewList,
  idx,
  handleChangeListItem,
  id,
}) => {
  return (
    <div className="list-item">
      <p className="list-item-title">{name}</p>
      <p>{description}</p>
      {isCreateNewList && (
        <div className="list-item-icons">
          <img
            src={arrowLeft}
            alt="arrow_left"
            width={25}
            height={25}
            style={{ visibility: idx > 0 ? "unset" : "hidden" }}
            onClick={() => handleChangeListItem(idx, "left", id)}
          />
          <img
            src={arrowRight}
            alt="arrow_right"
            width={25}
            height={25}
            style={{ visibility: idx < 2 ? "unset" : "hidden" }}
            onClick={() => handleChangeListItem(idx, "right", id)}
          />
        </div>
      )}
    </div>
  );
};

export default ListItem;