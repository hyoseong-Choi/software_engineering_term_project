import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { BiCoffeeTogo } from "react-icons/bi";
import "./mapPage.css";

var session = "";
const Narvar = (props) => {
  const navigate = useNavigate();
  // current route information
  const location = useLocation().pathname;
  var isLogin; // wheter user login or not
  session = props.user;
  if (session == undefined) isLogin = false; // session check
  else isLogin = true;
  return (
    <Navbar className="topNarvar" variant="dark">
      <BiCoffeeTogo className="icon" size="40px" color="#C1EFFF"></BiCoffeeTogo>
      <Navbar.Brand href="/">Cafe</Navbar.Brand>
      {isLogin ? ( // user's session valid(login)
        <Nav className="me-auto">
          <Nav.Link
            onClick={() =>
              navigate("/seatManage", { state: { userSession: session } })
            }
            active={location == "/seatManage" ? true : false}
          >
            좌석 관리
          </Nav.Link>
          <Nav.Link
            onClick={() =>
              navigate("/ProductManagement", {
                state: { userSession: session },
              })
            }
            active={location == "/ProductManagement" ? true : false}
          >
            제품 관리
          </Nav.Link>
          <Nav.Link
            onClick={() =>
              navigate("/seat", { state: { userSession: session } })
            }
            active={location == "/seat" ? true : false}
          >
            좌석 배치
          </Nav.Link>
          <Nav.Link
            onClick={() =>
              navigate("/userInfo", { state: { userSession: session } })
            }
            active={location == "/userInfo" ? true : false}
          >
            내 정보
          </Nav.Link>
        </Nav>
      ) : (
        // user's session invalid(not login)
        <Nav className="me-auto">
          <Nav.Link href="/login" active={location == "/login" ? true : false}>
            로그인
          </Nav.Link>
          <Nav.Link
            href="/register"
            active={location == "/register" ? true : false}
          >
            회원가입
          </Nav.Link>
        </Nav>
      )}
    </Navbar>
  );
};

export default Narvar;
