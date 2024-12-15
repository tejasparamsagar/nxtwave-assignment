import { useState } from "react";
import Button from "../components/Button";
import "../css/Home.css";
import List from "../components/List";

const Home = () => {
  const [list, setList] = useState([
    {
      id: 1,
      isSelected: false,
      listItems: [
        { id: 1, title: "test title", subTitle: "test subtitle" },
        { id: 2, title: "test title", subTitle: "test subtitle" },
      ],
    },
    {
      id: 2,
      isSelected: false,
      listItems: [
        { id: 1, title: "test title", subTitle: "test subtitle" },
        { id: 2, title: "test title", subTitle: "test subtitle" },
      ],
    },
  ]);
  const [isCreateNewList, setIsCreateNewList] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectList = (id) => {
    const selectedListIdx = list.findIndex((ele) => ele?.id === id);

    if (selectedListIdx > -1) {
      const checked = !list[selectedListIdx]?.isSelected;
      setList((prev) => {
        const temp = [...prev];
        temp[selectedListIdx].isSelected = checked;
        return temp;
      });

      setSelectedList((prev) => {
        let temp = [...prev];
        if (checked) {
          temp.push(list[selectedListIdx]);
        } else {
          temp = prev?.filter((ele) => ele?.id !== id);
        }
        return temp;
      });
    }
  };

  const handleCreateNewList = () => {
    if (selectedList.length === 2) {
      setIsCreateNewList(true);
      setSelectedList((prev) => {
        const temp = [...prev];
        const lastElement = temp.pop();
        temp.push({
          id: null,
          isSelected: false,
          listItems: [],
        });
        temp.push(lastElement);
        return temp;
      });
    } else {
      setErrorMsg("*You should create exactly 2 lists to create a new list");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  };

  const handleCancel = () => {
    setIsCreateNewList(false);
    setSelectedList([]);
    setList((prev) => prev.map((ele) => ({ ...ele, isSelected: false })));
  };

  const handleUpdate = () => {};

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>List Creation</h1>
        <Button content="Create a new list" onClick={handleCreateNewList} />
        <p className="home-error-msg">{errorMsg}</p>
      </div>
      <div className="all-listing">
        {!isCreateNewList &&
          list?.map((item, idx) => (
            <List
              isCreateNewList={isCreateNewList}
              key={item?.id}
              listNo={item?.id}
              listItems={item?.listItems}
              isSelected={item?.isSelected}
              handleSelectList={handleSelectList}
              idx={idx}
            />
          ))}
        {isCreateNewList &&
          selectedList?.map((item, idx) => (
            <List
              isCreateNewList={isCreateNewList}
              key={item?.id}
              listNo={item?.id}
              listItems={item?.listItems}
              isSelected={item?.isSelected}
              handleSelectList={handleSelectList}
              idx={idx}
            />
          ))}
      </div>
      {isCreateNewList && (
        <div className="home-footer">
          <Button content="Cancel" variant="secondary" onClick={handleCancel} />
          <Button content="Update" onClick={handleUpdate} />
        </div>
      )}
    </div>
  );
};

export default Home;
