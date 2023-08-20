import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row } from "react-bootstrap";

import axios from "axios"; // HTTP communication with spring
import Swal from "sweetalert2"; // alert design
import Narvar from "../MapPage/Narvar"; // common Narvar page(on the top of page)

// HTTP communication with spring Controller Route URL List
const url = "http://localhost:8080/api/signin";

function RegisterPage(props) {
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
    // email that user write
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    // password that user write
    setPassword(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    // name that user write
    setName(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    // confirm password that user write
    setConfirmPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    // prevent page refresh
    event.preventDefault();
  };

  const onClickRegister = (event) => {
    if (Password === ConfirmPassword) {
      // if password and confirm password correspond
      const data = {
        email: Email,
        name: Name,
        pw: Password,
      };

      console.log(JSON.stringify(data));

      axios
        .post(url, JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          // already exist in DB same id
          if (res.data == "ID already used") {
            new Swal({
              title: "이미 존재하는 아이디입니다.",
              icon: "warning",
            }).then(function () {
              navigate("/"); //then move to login page
            });
          } else {
            // if id doesn't exist in DB
            new Swal({
              title: "회원가입 완료되었습니다!",
              icon: "success",
            }).then(function () {
              navigate("/"); //then move to login page
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // if password and confirm password incorrespond
      new Swal({
        title: "비밀번호가 일치하지 않습니다!",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Narvar></Narvar>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <Row>
          <h2>회원가입</h2>
          <Card body style={{ marginTop: "1rem", borderRadius: "10px" }}>
            <br />
            <form
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={onSubmitHandler}
            >
              <lable>이메일</lable>
              <input type="text" value={Email} onChange={onEmailHandler} />
              <br />

              <lable>이름</lable>
              <input type="text" value={Name} onChange={onNameHandler} />
              <br />

              <lable>비밀번호</lable>
              <input
                type="Password"
                value={Password}
                onChange={onPasswordHandler}
              />
              <br />

              <lable>비밀번호 확인</lable>
              <input
                type="Password"
                value={ConfirmPassword}
                onChange={onConfirmPasswordHandler}
              />
              <br />
              <br />
              <button
                className="button"
                type="submit"
                onClick={onClickRegister}
              >
                회원가입
              </button>
            </form>
          </Card>
        </Row>
      </div>
    </div>
  );
}

export default RegisterPage;
