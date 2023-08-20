import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; //design alert
import axios from "axios"; // HTTP communication with spring

// HTTP communication with spring Controller Route URL List
const GetEndTimeURL = "http://localhost:8080/api/endtime";
const SeatAvailableURL = "http://localhost:8080/api/seatavailable";

const SeatTimer = (props) => {
  const [endTime, setEndTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const { userSession, currentButton } = props;
  useEffect(() => {
    const data = {
      session: userSession,
      seatnum: currentButton,
    };
    // asynchronous function to get end time from DB when seat bitton is pressed
    const fetchEndTime = () => {
      axios
        .post(GetEndTimeURL, JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          setEndTime(new Date(res.data)); // convert the end time to a Date object and save it
          console.log(res.data);
        });
    };

    fetchEndTime(); // get end time
  }, []);

  useEffect(() => {
    // timer function that calculates the remaining time when the end time is set
    const timer = setInterval(() => {
      if (endTime) {
        const currentTime = new Date().getTime();
        const difference = endTime.getTime() - currentTime;
        if (difference > 0) {
          setRemainingTime(difference);
        } else {
          clearInterval(timer);
          const data = {
            session: userSession,
            seatnum: currentButton,
          };
          axios
            .post(SeatAvailableURL, JSON.stringify(data), {
              headers: { "Content-Type": "application/json" },
            })
            .then((res) => {
              new Swal({
                title: "시간이 종료된 좌석입니다!",
              });
            });
        }
      }
    }, 1000); // update every second

    return () => {
      clearInterval(timer); // clean up timers when components are unmounted
    };
  }, [endTime]);

  // functions that convert time into hour:minute:second format
  const formatTimer = () => {
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);
    return `${hours < 10 ? "0" + hours : hours} : ${
      minutes < 10 ? "0" + minutes : minutes
    } : ${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // return to rendering
  return (
    <div>
      <div>{formatTimer()}</div>
    </div>
  );
};

export default SeatTimer;
