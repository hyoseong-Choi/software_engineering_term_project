//client/src/pages/Login.js
import React, { useState } from "react";
import { Card, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2"; // alert design
import axios from "axios"; // HTTP communication with spring
import Narvar from "../MapPage/Narvar"; // common Narvar page(on the top of page)
import "./button.css"; // decorate to React component

// HTTP communication with spring Controller Route URL List
const LoginURL = "http://localhost:8080/api/login";
const SessionURL = "http://localhost:8080/api/userinfo";
var session = "";

function LoginPage(props) {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    // email that user write
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    // password thar user write
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    // prevent page refresh
    event.preventDefault();
  };

  const onClickLogin = (event) => {
    // Login Click event
    const data = {
      email: Email,
      pw: Password,
    };

    axios
      .post(LoginURL, JSON.stringify(data), {
        // send data with JSON
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        if (res.data == "login fail") {
          // if user's password incorrect
          new Swal({
            title: "비밀번호가 일치하지 않습니다.",
            icon: "error",
          });
        } else if (res.data == "sign up first") {
          // if user's is doesn't register
          new Swal({
            title: "존재하지 않는 회원입니다. 회원가입부터 해주세요",
            icon: "warning",
          });
        } else {
          session = res.data; // if user's id and user's password correct in DB
          new Swal({
            title: "로그인 되었습니다!",
            icon: "success",
          }).then(function () {
            navigate("/seatManage", { state: { userSession: session } }); // after login, move page seatManage with session
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Narvar></Narvar>
      <div
        style={{
          // center arrangement
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <Row>
          <h2>로그인</h2>
          <Card body style={{ marginTop: "1rem", borderRadius: "10px" }}>
            <br />
            <form
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={onSubmitHandler}
            >
              <lable>이메일</lable>
              <input type="text" value={Email} onChange={onEmailHandler} />
              <br />
              <lable>비밀번호</lable>
              <input
                type="Password"
                value={Password}
                onChange={onPasswordHandler}
              />
              <br />
              <pre>
                <a href="http://localhost:3000/register">회원가입</a>{" "}
              </pre>
              <button className="button" type="submit" onClick={onClickLogin}>
                로그인
              </button>
            </form>
          </Card>
        </Row>
      </div>
    </div>
  );
}
export default LoginPage;
