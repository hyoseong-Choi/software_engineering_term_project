import React, { useEffect, useRef, useState } from "react";
import {
  Dropdown,
  DropdownButton,
  Overlay,
  Popover,
  Form,
  ListGroup,
  CloseButton,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";

import Narvar from "../MapPage/Narvar"; // common Narvar page(on the top of page)
import Swal from "sweetalert2"; // alert design
import axios from "axios"; // HTTP communication with spring
import SeatTimer from "./SeatTimer"; // show Timer

// HTTP communication with spring Controller Route URL List
const SeatInfoURL = "http://localhost:8080/api/seatinfo";
const StoreInfoURL = "http://localhost:8080/api/storeinfo";
const SetStoreURL = "http://localhost:8080/api/setstore";
const SetPurchaseURL = "http://localhost:8080/api/setpurchase";
const GetMenusURL = "http://localhost:8080/api/menus";
const SeatAvailableURL = "http://localhost:8080/api/seatavailable";

function SeatManagementPage() {
  const ref = useRef(null);
  const [storeName, setStoreName] = useState("매장을 선택하세요."); // depending on which store
  const [existStore, setExistStore] = useState(false);
  const [userSession, setUserSession] = useState("");
  const [target, setTarget] = useState(null);
  const [show, setShow] = useState(false); // whether show PopOver or not
  const [currentButton, setCurrentButton] = useState(0); // current clicked button
  const [buttons, setButtons] = useState([]); // seat position
  const [available, setAvailable] = useState([]); // wheter the seat using or not
  const [endTimeString, setEndTimeString] = useState("");
  const [timer, setTimer] = useState(0); // timer
  const [dropdownItems, setDropdownItems] = useState([]); // menu list
  const [menuPrice, setMenuPrice] = useState({}); // menu and price object
  const [selectedMenu, setSelectedMenu] = useState(null); // selected menu list
  const [selectedItems, setSelectedItems] = useState([]); // ordered menu list

  // receive the location information of the saved button and renders it again
  const location = useLocation();
  const UserInfo = { ...location.state };
  useEffect(() => {
    setUserSession(UserInfo.userSession); // get Session after login
    confirmStore(); // check for store based on session
  });

  // Check if there is a store or not
  const confirmStore = () => {
    const data = {
      session: userSession,
    };
    axios
      .post(StoreInfoURL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        if (res.data != null) {
          // If there's a store
          setExistStore(true); // Existence of store set true
          setStoreName(res.data.name); // update store name
          fetchData(); // after that, get seat information based on store name
        } else {
          // Existence of store set false
          setExistStore(false);
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
        var use = [false];
        for (var i = 0; i < res.data.length; i++) {
          use[i + 1] = res.data[i].available; // whether it's in use or not
        }
        setAvailable(use); // update on the use of the seats received
        setButtons(res.data); // updated seat contents received
      });
  };

  // if you press the right, whether you are using it or not, whether you want to add a menu, etc
  const handleRightClick = (event, buttonId) => {
    setCurrentButton(buttonId); // current Button id set
    event.preventDefault();
    fetchDropDownItems(); // get store's menu in DB
    setSelectedItems([]); // current selected menu
    setShow(true); // popover show set true
    setTarget(event.target);
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
        setStoreName(res.data.name);
      });
  };

  // Dropdown showing menu list
  const fetchDropDownItems = () => {
    var itemList = {};
    const data = {
      session: userSession,
    };
    axios
      .post(GetMenusURL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          itemList[res.data[i].name] = res.data[i].time;
        }
        setMenuPrice(itemList);
        setDropdownItems(Object.keys(itemList));
      });
  };

  // show list when menu is selected
  const handleMenuSelect = (menu) => {
    setSelectedItems((prevItems) => [...prevItems, menu]);
    setSelectedMenu(menu);
  };

  // Using button click event
  const handlePurchaseButtonClick = () => {
    var max_time = 0;
    var time_list = [];
    for (var i = 0; i < selectedItems.length; i++) {
      time_list[i] = menuPrice[selectedItems[i]]; // find time with the selected menu
    }
    max_time = Math.max(...time_list); // highest time of the selected menu
    const data = {
      session: userSession,
      name: storeName,
      seatnum: currentButton,
      item: Object.keys(menuPrice).find((key) => menuPrice[key] === max_time), // The most time item
    };
    setShow(false);
    axios
      .post(SetPurchaseURL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        new Swal({
          icon: "success",
          title: "좌석 이용을 시작합니다.",
        });
      });
  };

  // Termination button click event
  const handleEndButtonClick = () => {
    const data = {
      session: userSession,
      seatnum: currentButton,
    };
    setShow(false);
    axios
      .post(SeatAvailableURL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        new Swal({
          icon: "success",
          title: "좌석이용이 종료되었습니다.",
        });
      });
  };

  // Existence user's store is false, then user can register user's store
  const handleSetStoreButtonClick = () => {
    new Swal({
      title: "매장 등록하기",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "매장 추가하기",
      showLoaderOnConfirm: true,
      showCancelButton: true,
      cancelButtonText: "취소",
    }).then((result) => {
      const data = {
        session: userSession,
        name: result.value,
      };
      axios
        .post(SetStoreURL, JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          setExistStore(true);
          setStoreName(result.value);
        });
    });
  };

  // when user's store doesn't exist, show below UI
  const notExistStore = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div>
          <h2>매장이 존재하지 않습니다.</h2>내 매장을 먼저 등록해주세요!
          <br />
          <br />
          <button onClick={handleSetStoreButtonClick}>등록하러 가기</button>
        </div>
      </div>
    );
  };

  // when user's store exist, show below UI
  const ifExistStore = () => {
    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          height: "100vh",
        }}
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
                backgroundColor: available[button.seatnum]
                  ? "#F0F0F0"
                  : "#1B9C85",
              }}
              onContextMenu={(event) => handleRightClick(event, button.seatnum)}
            >
              {button.seatnum}
            </button>
          ))}
        <Overlay
          show={show}
          target={target}
          placement="bottom"
          container={ref}
          containerPadding={20}
        >
          {!available[currentButton] ? ( // if Using
            <Popover id="popover-contained">
              <Popover.Header as="h3">
                <CloseButton
                  onClick={() => {
                    setShow(false);
                  }}
                />
                <span>&nbsp;&nbsp;&nbsp;</span>사용중인 좌석
                <span>&nbsp;</span>
                <button onClick={handlePurchaseButtonClick}>추가</button>
                <button onClick={handleEndButtonClick}>종료</button>
              </Popover.Header>
              <Popover.Body>
                <strong>시간을 추가하시겠습니까?</strong>
                <h2>
                  <SeatTimer
                    userSession={userSession}
                    currentButton={currentButton}
                  />
                </h2>
                <br />
                <br />
                메뉴를 선택해주세요
                <Dropdown>
                  <Dropdown.Toggle
                    as={CustomToggle}
                    id="dropdown-custom-components"
                  >
                    메뉴 추가하기
                  </Dropdown.Toggle>
                  <Dropdown.Menu as={CustomMenu}>
                    {dropdownItems.map((menu, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => handleMenuSelect(menu)}
                      >
                        {menu}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                  <br />
                  <br />
                  <ListGroup>
                    <ListGroup.Item disabled>주문하신 메뉴</ListGroup.Item>
                    {selectedItems.map((item, index) => (
                      <ListGroup.Item key={index}>{item}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Dropdown>
              </Popover.Body>
            </Popover>
          ) : (
            // If not using
            <Popover id="popover-contained">
              <Popover.Header as="h3">
                <CloseButton
                  onClick={() => {
                    setShow(false);
                  }}
                />
                <span>&nbsp;&nbsp;&nbsp;</span>비어있는 좌석
                <span>&nbsp;&nbsp;&nbsp;</span>
                <button onClick={handlePurchaseButtonClick}>이용</button>
              </Popover.Header>
              <Popover.Body>
                <strong>메뉴를 추가해주세요</strong>
                <br />
                <Dropdown>
                  <Dropdown.Toggle
                    as={CustomToggle}
                    id="dropdown-custom-components"
                  >
                    메뉴 추가하기
                  </Dropdown.Toggle>
                  <Dropdown.Menu as={CustomMenu}>
                    {dropdownItems.map((menu, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => handleMenuSelect(menu)}
                      >
                        {menu}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                  <br />
                  <br />
                  <ListGroup>
                    <ListGroup.Item disabled>주문하신 메뉴</ListGroup.Item>
                    {selectedItems.map((item, index) => (
                      <ListGroup.Item key={index}>{item}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Dropdown>
              </Popover.Body>
            </Popover>
          )}
        </Overlay>
      </div>
    );
  };
  return (
    <div>
      <Narvar user={userSession}></Narvar>
      <div>{existStore ? ifExistStore() : notExistStore()}</div>
    </div>
  );
}

// react-bootstrap library
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    style={{
      textDecoration: "none",
    }}
    onClick={(e) => {
      e.preventDefault();
      console.log("test");
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="메뉴를 선택해주세요!"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);

export default SeatManagementPage;
