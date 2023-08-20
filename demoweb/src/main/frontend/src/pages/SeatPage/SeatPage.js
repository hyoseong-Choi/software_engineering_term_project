import React, { useEffect, useRef, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { AiFillPlusCircle } from "react-icons/ai";

import Narvar from "../MapPage/Narvar"; // common Narvar page(on the top of page)
import axios from "axios"; // HTTP communication with spring

// HTTP communication with spring Controller Route URL List
const SetSeatURL = "http://localhost:8080/api/setseat";
const SeatInfoURL = "http://localhost:8080/api/seatinfo";
const SetStoreURL = "http://localhost:8080/api/setstore";
const StoreInfoURL = "http://localhost:8080/api/storeinfo";

function SeatPage() {
  var test = "메가커피";
  const [userSession, setUserSession] = useState("");
  const ref = useRef(null);
  const [storeName, setStoreName] = useState("매장을 선택하세요."); // depending on which store it is
  const [existStore, setExistStore] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // whether draggin or not
  const [draggingButton, setDraggingButton] = useState(null); // dragging button
  const [buttonCount, setButtonCount] = useState(1); // how many button
  const [buttons, setButtons] = useState([]); // button list

  const location = useLocation();
  const UserInfo = { ...location.state };
  useEffect(() => {
    setUserSession(UserInfo.userSession); // store user's session in variable
    confirmStore();
    fetchData();
  }, [storeName]);

  // check if there is a store or not
  const confirmStore = () => {
    const data = {
      session: userSession,
    };

    axios
      .post(StoreInfoURL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res);
        if (res.data != null) {
          setExistStore(true);
          setStoreName(res.data.name);
          fetchData();
        } else {
          console.log("------no store!!!");
        }
      });
  };

  // get stored seat information
  const fetchData = () => {
    const data = {
      session: userSession,
      name: storeName,
    };
    axios
      .post(SeatInfoURL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data);
        setButtons(res.data);
        setButtonCount(res.data.length + 1);
      });
  };

  // when drag the button to move
  const handleMouseDown = (event, buttonId) => {
    setIsDragging(true);
    setDraggingButton(buttonId);
  };

  // when you move your mouse
  const handleMouseMove = (event) => {
    if (isDragging) {
      const updatedButtons = buttons.map((button) => {
        if (button.seatnum === draggingButton) {
          return {
            ...button,
            x: event.clientX,
            y: event.clientY,
          };
        }
        return button;
      });
      setButtons(updatedButtons);
    }
  };

  // when we played drag and mouse
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingButton(null);
  };

  // add a seat button
  const handleAddButtonClick = () => {
    if (!isDragging) {
      const newButton = {
        seatnum: buttonCount,
        x: 150,
        y: 150,
      };
      setButtonCount(buttonCount + 1);
      setButtons([...buttons, newButton]);
    }
  };

  // double-click to delete the seat
  const handleButtonDoubleClick = (buttonId) => {
    const data = {
      session: userSession,
      name: test,
      seatNum: buttonId,
    };
    console.log(JSON.stringify(data));
    axios
      .delete(
        SetSeatURL,
        {
          data: {
            session: userSession,
            name: test,
            seatNum: buttonId,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        console.log(res);
        if (!isDragging) {
          const updatedButtons = buttons.filter(
            (button) => button.seatnum !== buttonId
          );
          setButtons(updatedButtons);
          setButtonCount(buttonCount - 1);
        }
      });
  };

  //  the data of the data sheet when the deployment is completed.
  const handleSendSeatInfo = (event, buttonId) => {
    console.log(buttonId, event.clientX, event.clientY);
    const data = {
      session: userSession,
      name: "메가커피",
      seatnum: buttonId,
      x: event.clientX,
      y: event.clientY,
    };
    console.log(JSON.stringify(data));
    axios
      .post(SetSeatURL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res);
      });
  };

  // where store information is received from the drop-down
  const StoreList = () => {
    const data = {
      session: userSession,
    };
    axios
      .post(StoreInfoURL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data.name);
        setStoreName(res.data.name);
      });
  };

  // function that runs when the store name is pressed in the drop-down.
  const storeSelect = (storeName) => {
    console.log("-------", storeName);
    setStoreName(storeName);
  };

  return (
    <div>
      <Narvar user={userSession}></Narvar>
      <div
        ref={ref}
        style={{
          width: "100%",
          height: "100vh",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          style={{ margin: "20px", display: "flex", justifyContent: "center" }}
        >
          <DropdownButton
            id="dropdown-basic-button"
            title={storeName}
            onClick={StoreList}
          >
            <Dropdown.Item>{storeName}</Dropdown.Item>
          </DropdownButton>
        </div>
        <button
          className="seatButton"
          style={{
            margin: "50px",
            border: "none",
            backgroundColor: "transparent",
          }}
          onClick={handleAddButtonClick}
        >
          <AiFillPlusCircle className="icon" size="70px" color="black" />
        </button>
        {buttons &&
          buttons.map((button) => (
            <button
              key={button.seatnum}
              style={{
                border: "none",
                position: "absolute",
                left: button.x,
                top: button.y,
                width: "70px",
                height: "70px",
                backgroundColor: "#F0F0F0",
              }}
              onMouseDown={(event) => handleMouseDown(event, button.seatnum)}
              onDoubleClick={() => handleButtonDoubleClick(button.seatnum)}
              onMouseUp={(event) => handleSendSeatInfo(event, button.seatnum)}
            >
              {button.seatnum}
            </button>
          ))}
      </div>
    </div>
  );
}

export default SeatPage;
