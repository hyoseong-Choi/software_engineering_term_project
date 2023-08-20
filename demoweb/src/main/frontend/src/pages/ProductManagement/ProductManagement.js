import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Narvar from "../MapPage/Narvar"; // common Narvar page(on the top of page)
import axios from "axios"; // HTTP communication with spring

// HTTP communication with spring Controller Route URL List
const additemURL = "http://localhost:8080/api/additem";
const deleteitemURL = "http://localhost:8080/api/deleteitem";
const storeInfoURL = "http://localhost:8080/api/storeinfo";
const menusURL = "http://localhost:8080/api/menus";

function ProductManagement() {
  const [userSession, setUserSession] = useState("");
  const [storeInfo, setStoreInfo] = useState("");
  const [menu, setMenu] = useState({
    // user's input init
    name: "",
    cost: "",
    time: "",
  });
  const [menus, setMenus] = useState([]);

  const location = useLocation();
  const userInfo = { ...location.state };

  useEffect(() => {
    setUserSession(userInfo.userSession); // get Session after login
    fetchStoreInfo();
    fetchMenus();
  });

  const fetchStoreInfo = () => {
    const data = {
      session: userSession,
    };
    axios
      .post(storeInfoURL, JSON.stringify(data), {
        //then response from spring store in variable
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        if (res != null) {
          setStoreInfo(res.data.name); // get StoreInfo in variable
        }
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMenu({ ...menu, [name]: value });
  };

  const handleAddMenu = () => {
    // prevent blank input
    if (
      menu.name.trim() === "" ||
      menu.cost.trim() === "" ||
      menu.time.trim() === ""
    ) {
      return;
    }

    const data = {
      session: userSession,
      storeName: storeInfo ? storeInfo.name : "",
      itemname: menu.name,
      price: menu.cost,
      time: menu.time,
    };

    axios
      .post(additemURL, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setMenus([...menus, response.data]);
        setMenu({ name: "", cost: "", time: "" }); // init after user's addItem
      })
      .catch((error) => {
        console.error("메뉴 추가 에러:", error);
      });
  };

  const handleDeleteMenu = (index) => {
    const menuId = menus[index]._id;
    const data = {
      session: userSession,
      storeName: storeInfo ? storeInfo.name : "",
      itemname: menus[index].name,
      price: menus[index].cost,
      time: menus[index].time,
    };

    axios
      .post(deleteitemURL, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        fetchMenus(); // menu delete and rerendering after delete
      })
      .catch((error) => {
        console.error("메뉴 삭제 에러:", error);
      });
  };

  const fetchMenus = () => {
    const data = {
      session: userSession,
    };
    axios
      .post(menusURL, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setMenus(response.data); // menu list get
      })
      .catch((error) => {
        console.error("메뉴 목록 불러오기 에러:", error);
      });
  };

  return (
    <div>
      <Narvar user={userSession} userSession></Narvar>
      <div
        className="Main"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="d-grid gap-2">
          <div>
            <h1 style={{ marginTop: "40px" }}>메뉴 관리</h1>
            <form>
              <label>
                메뉴 이름:
                <input
                  type="text"
                  name="name"
                  value={menu.name}
                  onChange={handleChange}
                />
              </label>
              <br />
              <br />
              <label>
                메뉴 가격:
                <input
                  type="text"
                  name="cost"
                  value={menu.cost}
                  onChange={handleChange}
                />
              </label>
              <br />
              <br />
              <label>
                메뉴 시간:
                <input
                  type="text"
                  name="time"
                  value={menu.time}
                  onChange={handleChange}
                />
              </label>
            </form>
            <br />
            <button onClick={handleAddMenu}>메뉴 추가</button>
            <br />
            <br />
            <ul>
              {menus &&
                menus.map((menu, index) => (
                  <div>
                    <li key={index}>
                      {menu.name} {menu.cost} {menu.time}
                      <spane>&nbsp;&nbsp;</spane>
                      <button onClick={() => handleDeleteMenu(index)}>
                        삭제
                      </button>
                    </li>
                    <br />
                  </div>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;
