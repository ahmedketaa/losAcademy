import React, { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import Cookies from "universal-cookie";
import moment from "moment-timezone";
import { Toast } from "primereact/toast";
import OurSpinner from "../../admin/components/spinner";

function StudentAttendance() {
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const token = cookie.get("token");
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [lectureStartTime, setLectureStartTime] = useState<string>("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setloading] = useState<boolean>(true);
  const [isHere, setIsHere] = useState<boolean>(false);

  const toast = useRef<Toast>(null);
  const showSuccess = (msg: any) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 3000,
    });
  };
  const showError = (msg: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 7000,
    });
  };

  function calculateTimeLeft() {
    if (!lectureStartTime) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const currentTime = new Date().getTime();
    const startTime = new Date(lectureStartTime).getTime() - 30 * 60 * 1000;
    const difference = startTime - currentTime;
    console.log(difference);

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(difference / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);

    return { hours, minutes, seconds };
  }

  useEffect(() => {
    const convertDateTimeZone = (
      inputTime: moment.MomentInput,
      inputTimezone: string,
      outputTimezone: string,
      ourFormat: string
    ) => {
      const convertedTime = moment(inputTime)
        .tz(inputTimezone)
        .clone()
        .tz(outputTimezone);
      return convertedTime.format(ourFormat);
    };

    fetch(`${url}/user/upcomingSession`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setloading(false);
        setSessionId(data.data[0].id);
        const sessionStartTime = data.data?.sessionStartTime;
        const convertedStartTime = convertDateTimeZone(
          sessionStartTime,
          "UTC",
          Intl.DateTimeFormat().resolvedOptions().timeZone,
          "h:mm A"
        );
        setLectureStartTime(convertedStartTime);

        // Now, we can safely use calculateTimeLeft
        const timer = setInterval(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Cleanup the interval when the component is unmounted or when lectureStartTime changes
        return () => clearInterval(timer);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
        setloading(false); // Make sure to set loading to false in case of an error
        // Show an error message to the user
      });
  }, [token]);

  // I'm Here
  const updateAttendance = () => {
    console.log(sessionId);

    fetch(`${url}/session/updateUserAttendance`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.status === "success") {
          console.log("POST request successful:", data);
          setIsHere(true);
          showSuccess(`${data.message}`);
        } else {
          console.error(data);
          showError(`${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error during POST request:", error);
        // Handle error
      });
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <OurSpinner />
      </div>
    ); // You can replace this with a loading spinner or any other loading indicator
  }
  return (
    <div className={`flex flex-col justify-center items-center gap-5`}>
      <Toast ref={toast} />

      <h4 className={`${styles.secondary_head}`}>
        Are you here and ready for the session ?
      </h4>
      <p>This Session will Start within</p>
      <h1 className={`font-bold text-lg`}>
        {timeLeft.hours} hours {timeLeft.minutes} mins {timeLeft.seconds} sec
      </h1>
      <button
        disabled={isHere}
        className={` ${
          isHere ? "bg-gray-500" : "bg-secondary-color hover:bg-secondary-hover"
        }   text-sm font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] h-10 w-75 px-8 m-auto my-3  rounded-full mx-auto max-md:py-2.5 max-md:px-10 max-md:w-45`}
        onClick={updateAttendance}
      >
        {isHere ? `You Here` : `I’m here`}
      </button>
    </div>
  );
}

export default StudentAttendance;
