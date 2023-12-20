"use client";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import AddReportModal from "./addReportModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "flowbite-react";
import { convertDateTimeZone } from "@/utilities";
import { getSocket } from "@/utilities/connectWithSocket";
import { Socket } from "socket.io-client";
export default function OnGoingBox(session: any) {
  let workingSession = session && session.session;

  const [onGoingSession, setOnGoingSession]: any = useState<any>([]);
  const [lastTakenSession, setLastTakenSession]: any = useState<any>([]);
  const [targetSession, setTargetSession] = useState<any>([]);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [finishedSession, setFinishedSession] = useState<any>([]);
  const [showReport, setShowReport] = useState(false);
  const router = useRouter();
  // const [finishedSession, setFinishedSession] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const cookies = new Cookies();
  const toast = useRef<any>(null);
  const [openModal, setOpenModal] = useState(false);

  // socket connection
  useEffect(() => {
    const newSocket: Socket = getSocket(cookies.get("token"));
    console.log(newSocket.connect());
    newSocket.on("finished_session", (data: object) => {
      console.log(data);
      if (data) {
        setTargetSession({ ongoingSession: data });
        setShowReport(true);
        // router.refresh();
      }
    });
    newSocket.on("ongoing_session", (data: object) => {
      console.log(data);
      if (data) {
        router.refresh();
      }
    });
    newSocket.on("session_requested", (data: object) => {
      console.log(data);
      setTargetSession({ ongoingSession: data });
    });
  }, []);

  const convertTimeZone = convertDateTimeZone;
  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };
  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 4000,
    });
  };

  // Convert session time to a Date object
  // const sessionDate: any = convertTimeZone(
  //   upComingSession.sessionDate,
  //   "UTC",
  //   Intl.DateTimeFormat().resolvedOptions().timeZone,
  //   "MMM D,YYYY h:mm A"
  // );
  // const ourSessionDate = new Date(sessionDate);
  // // Get the current time
  // const currentDate: any = new Date();
  // // Calculate the time difference in milliseconds
  // const timeDifference = ourSessionDate.getTime() - currentDate.getTime();
  // // Convert the time difference to seconds
  // const seconds = Math.floor(timeDifference / 1000);

  // useEffect(() => {
  //   setCountdownSeconds(seconds);
  // }, []);
  // Counter down Functionality
  // useEffect(() => {
  //   let timeoutId: any;
  //   const handleCountdown = () => {
  //     if (countdownSeconds > 0) {
  //       setCountdownSeconds((prevSeconds) => prevSeconds - 1);
  //       timeoutId = setTimeout(handleCountdown, 1000);
  //     }
  //   };

  //   if (countdownSeconds > 0) {
  //     timeoutId = setTimeout(handleCountdown, 1000);
  //   }

  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [countdownSeconds]);

  // Format time in minutes and seconds
  // const formatTime = (seconds: number) => {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
  //     2,
  //     "0"
  //   )}:${String(remainingSeconds).padStart(2, "0")}`;
  // };
  const handleUpdateAttendance = (id: string) => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/session/updateTeacherAttendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`,
      },
      body: JSON.stringify({
        sessionId: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          showSuccess(data.message);
        } else {
          showError(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        showError(err.message);
      });
  };

  // const getOngoing = () => {
  //   fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher/ongoingSession`, {
  //     method: "get",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${cookies.get("token")}`,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       if (data && data.data.length > 0) {
  //         // setTargetSession(data.data);
  //         setOnGoingSession(data.data);
  //         // setOngoingSession(data.data);
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  const getLastTakenSession = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher/myLatestTakenSession`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          // setLastTakenSession(data.data);
          // setTargetSession(data);
          setLastTakenSession(data.data[0]);
        }
        // console.log(data.data[0]);
        // console.log(data.data[0].hasReport);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // setTargetSession(upComingSession);
    // getOngoing();
    getLastTakenSession();
  }, []);

  // useEffect(() => {
  //   if (countdownSeconds <= 0) {
  //     const time = setTimeout(() => {
  //       getOngoing();
  //       clearTimeout(time);
  //     }, 5000);
  //   }
  // }, [countdownSeconds]);

  useEffect(() => {
    console.log(workingSession);
    console.log(lastTakenSession);
    console.log(targetSession);
    setIsLoading(false);
  }, []);

  return (
    <div className={"bg-white-color p-2 rounded-[16px] h-full"}>
      <Toast ref={toast} />
      {isLoading ? (
        <Spinner />
      ) : lastTakenSession && lastTakenSession.hasReport === false ? (
        <div>
          <h4 className="mb-3">
            add report for the last session with{" "}
            {lastTakenSession && lastTakenSession.SessionInfo?.user?.name}
          </h4>
          <button
            className="smallBtn hover:bg-secondary-hover transition-colors"
            onClick={handleOpen}
          >
            Add Report +
          </button>
          <AddReportModal
            sessionID={lastTakenSession && lastTakenSession.id}
            openAssignModal={openModal}
            handleCloseModal={handleClose}
          />
        </div>
      ) : workingSession && workingSession.length > 0 ? (
        workingSession.data.map((session: any, index: number) => {
          if (session.status === "ongoing") {
            return (
              <div
                key={index}
                className="h-full flex flex-col items-center gap-2"
              >
                <h4 className="">
                  session <b>{session.SessionInfo?.user?.name}</b>{" "}
                  <b className="text-success-color">session started !!</b>
                </h4>
                <Link
                  target="_blank"
                  className="smallBtn hover:bg-secondary-hover transition-colors "
                  onClick={() => handleUpdateAttendance(session.id)}
                  href={session.meetingLink}
                >
                  Join Meeting Now !!
                </Link>
                <span>
                  start:
                  {convertDateTimeZone(
                    session.sessionDate,
                    "UTC",
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    "hh:mm A"
                  )}
                </span>
                <span>
                  end:
                  {new Date(
                    new Date(session.sessionDate).getTime() +
                      session.sessionDuration * 60 * 1000
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
                <span>session duration : {session.sessionDuration}</span>
                {showReport && (
                  <div>
                    <button
                      className="smallBtn hover:bg-secondary-hover transition-colors"
                      onClick={handleOpen}
                    >
                      Add Report +
                    </button>
                    <AddReportModal
                      sessionID={session && session.id}
                      openAssignModal={openModal}
                      handleCloseModal={handleClose}
                    />
                  </div>
                )}
              </div>
            );
          } else if (session.status === "pending") {
            return (
              <div
                key={index}
                className="h-full flex flex-col items-center gap-2"
              >
                <h4>
                  Next session with <b>{session.SessionInfo?.user?.name}</b>{" "}
                </h4>
                <span>
                  {convertDateTimeZone(
                    session.sessionDate,
                    "UTC",
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    "MM/DD/YYYY hh:mm A"
                  )}
                </span>
                <span>session duration : {session.sessionDuration}min</span>
              </div>
            );
          }
        })
      ) : (
        <p className="p-3 bg-warning-color text-white w-fit rounded-full mt-2 font-bold">
          No Sessions
        </p>
      )}
    </div>
  );
}
