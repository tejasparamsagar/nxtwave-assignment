import "../css/List.css";
import ListItem from "./ListItem";

const List = ({
  listNo = "",
  listItems = [],
  isSelected,
  handleSelectList,
  isCreateNewList,
  idx,
  handleChangeListItem,
}) => {
  return (
    <div className="list-container">
      <div className="list-header">
        {!isCreateNewList && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(event) => handleSelectList(event, listNo)}
          />
        )}
        <span>List {`${listNo} (${listItems?.length})`}</span>
      </div>
      <div className="list-items">
        {listItems?.map((listItem) => (
          <ListItem
            key={listItem?.id}
            name={listItem?.name}
            description={listItem?.description}
            isCreateNewList={isCreateNewList}
            idx={idx}
            handleChangeListItem={handleChangeListItem}
            id={listItem?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default List;