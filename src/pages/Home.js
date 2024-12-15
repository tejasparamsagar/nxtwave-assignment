import { useEffect, useState } from "react";
import Button from "../components/Button";
import "../css/Home.css";
import List from "../components/List";
import Spinner from "../components/Spinner";

const Home = () => {
  const [list, setList] = useState([]);
  const [isCreateNewList, setIsCreateNewList] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  //handle select unselect checkbox
  const handleSelectList = (event, id) => {
    const checked = event.target.checked;

    if (checked && selectedList.length === 2) {
      setErrorMsg("*You can select only 2 lists");
      return;
    }

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

  //handle create new list
  const handleCreateNewList = () => {
    if (selectedList.length === 2) {
      setIsCreateNewList(true);
      setSelectedList((prev) => {
        const temp = [...prev];
        const lastElement = temp.pop();
        temp.push({
          id: list.length + 1,
          isSelected: false,
          listItems: [],
        });
        temp.push(lastElement);
        return temp;
      });
    } else {
      setErrorMsg("*You should select exactly 2 lists to create a new list");
    }
  };

  // arrow clicks
  const handleChangeListItem = (sourceListIdx, type, itemId) => {
    if (sourceListIdx === 0) {
      setSelectedList((prev) => {
        let temp = [...prev];
        let selectedItem = temp[sourceListIdx]?.listItems?.find(
          (ele) => ele?.id === itemId
        );
        temp[sourceListIdx].listItems = temp[sourceListIdx]?.listItems?.filter(
          (ele) => ele?.id !== itemId
        );
        if (selectedItem) {
          temp[sourceListIdx + 1].listItems.push(selectedItem);
        }
        return temp;
      });
    }

    if (sourceListIdx === 2) {
      setSelectedList((prev) => {
        let temp = [...prev];
        let selectedItem = temp[sourceListIdx]?.listItems?.find(
          (ele) => ele?.id === itemId
        );
        temp[sourceListIdx].listItems = temp[sourceListIdx]?.listItems?.filter(
          (ele) => ele?.id !== itemId
        );
        if (selectedItem) {
          temp[sourceListIdx - 1].listItems.push(selectedItem);
        }
        return temp;
      });
    }

    if (sourceListIdx === 1) {
      if (type === "left") {
        setSelectedList((prev) => {
          let temp = [...prev];
          let selectedItem = temp[sourceListIdx]?.listItems?.find(
            (ele) => ele?.id === itemId
          );
          temp[sourceListIdx].listItems = temp[
            sourceListIdx
          ]?.listItems?.filter((ele) => ele?.id !== itemId);
          if (selectedItem) {
            temp[sourceListIdx - 1].listItems.push(selectedItem);
          }
          return temp;
        });
      } else {
        setSelectedList((prev) => {
          let temp = [...prev];
          let selectedItem = temp[sourceListIdx]?.listItems?.find(
            (ele) => ele?.id === itemId
          );
          temp[sourceListIdx].listItems = temp[
            sourceListIdx
          ]?.listItems?.filter((ele) => ele?.id !== itemId);
          if (selectedItem) {
            temp[sourceListIdx + 1].listItems.push(selectedItem);
          }
          return temp;
        });
      }
    }
  };

  const handleCancel = () => {
    setIsCreateNewList(false);
    setSelectedList([]);
    setList((prev) => prev.map((ele) => ({ ...ele, isSelected: false })));
  };

  const handleUpdate = () => {
    setList((prev) => {
      const [list1, list2, list3] = selectedList;
      const temp = prev?.filter((ele) => {
        return ele?.id !== list1?.id && ele?.id !== list3?.id;
      });
      temp.push(list1);
      temp.push(list3);
      temp.push(list2);
      temp.sort((a, b) => a.id - b.id);
      return temp;
    });
    handleCancel();
  };

  //group by with list_no
  const getGroupedDataByListNo = (lists = []) => {
    const groupedItems = lists.reduce((acc, item) => {
      if (!acc[item.list_number]) {
        acc[item.list_number] = [];
      }

      acc[item.list_number].push(item);
      return acc;
    }, {});

    const data = [];
    for (let i in groupedItems) {
      data.push({
        id: Number(i),
        isSelected: false,
        listItems: groupedItems[i],
      });
    }
    return data;
  };

  const fetchListData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://apis.ccbp.in/list-creation/lists");
      const data = await response.json();
      const groupedData = getGroupedDataByListNo(data?.lists);
      setList(groupedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListData();
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrorMsg("");
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMsg]);

  return (
    <div className="home-container">
      {!isCreateNewList && (
        <div className="home-header">
          <h1>List Creation</h1>
          <Button content="Create a new list" onClick={handleCreateNewList} />
          <p className="home-error-msg">{errorMsg}</p>
        </div>
      )}
      {loading ? (
        <Spinner />
      ) : (
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
                handleChangeListItem={handleChangeListItem}
              />
            ))}
        </div>
      )}
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