"use client";
import React, { useEffect, useRef, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import moment, { min } from "moment-timezone";
import styles from "../page.module.css";
import Cookies from "universal-cookie";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import ContentLoader from "react-content-loader";
import { ProgressSpinner } from 'primereact/progressspinner';
import RescheduleSession from "./rescheduleSession";
import Image from "next/image";
import Countdown from "react-countdown";
import { Toast } from "primereact/toast";
import { Tooltip } from "flowbite-react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { IoTimeOutline } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { getSocket } from "@/utilities/connectWithSocket";
import { Socket } from "socket.io-client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import StudentPlanModal from "./StudentPlanModal";
import { useRouter } from "next/navigation";
import ContinueWithModal from "./continueWithModal";

interface ContinueStatus {
  createdAt: string;
  id: number;
  sessionRequestId: number;
  teacher: {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
    // ... other properties
  };
  teacherId: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
    availableFreeSession: number;
    // ... other properties
  };
  userId: string;
  willContinue: boolean;
}

function UpcomingSessions() {
  const cookie = new Cookies();
  const [upComingSession, setUpComingSession]: any = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [openRescheduleModal, setopenRescheduleModal] = useState(false);
  const [sessionId, setsessionId] = useState("");
  const [isImHereButtonDisabled, setIsImHereButtonDisabled] = useState(true);
  const [openPlansModal, setOpenPlansModal] = useState(false);
  const [sessionLink, setSessionLink] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isRescheduleButtonDisabled, setIsRescheduleButtonDisabled] =
    useState(false);
  const [userContinueStatus, setUserContinueStatus] =
    useState<ContinueStatus>();
  useState<moment.Moment | null>(null);
  const [ongoingSession, setOngoingSession]: any = useState<any[]>([]);
  const [countdownCompleted, setCountdownCompleted] = useState<boolean>(false);
  const [latestSession, setLatestSession]:any = useState<any[]>([]);
  const [mySubscription, setMySubscription]:any = useState<any[]>([]);
  const [openContinueWithModal, setOpenContinueWithModal] = useState(false)
  const router=useRouter()
  // socet function
  useEffect(() => {
    const newSocket: Socket = getSocket(cookie.get("token"));
    newSocket.on("event", (object) => {
      // console.log(newSocket);
    });
    // console.log(newSocket.connect());
    newSocket.on("finished_session", (data: object) => {
      console.log("finished_session", data);
      setUpComingSession({ upComingSession: data });
      setLatestSession(data)
      setCountdownCompleted(true);
    });
    newSocket.on("ongoing_session", (data: object) => {
      // console.log("ongoing_session", data);
      setOngoingSession({ ongoingSession: data });
    });
  }, []);

  // handle show confirmDialog state
  useEffect(() => {
    // Check your conditions here
    if (
      latestSession.length>0 &&
      latestSession[0]?.type === "free" &&
      latestSession[0]?.status === "taken" &&
      userContinueStatus?.willContinue === null&&
      mySubscription.length === 0
      ) {
      setShowConfirmDialog(true);
    }
    // const shouldShowDialog =
    //   latestSession[0]?.type === 'free' &&
    //   latestSession[0]?.status === 'taken' &&
    //   ongoingSession.length === 0 &&
    //   userContinueStatus?.willContinue === null;

    // Update the state based on the conditions
  }, [latestSession, ongoingSession, userContinueStatus]);
  // handle accept continue with teacher
  
  const accept = (sessionId: any) => {

    if(mySubscription.length>0){
      setOpenContinueWithModal(true)
    }
    setOpenPlansModal(true);

    // setSelectedFreeSessionId(sessionId);
    // const continueData = {
    //   sessionId: Number(sessionId),
    //   willContinue: true,
    // };
    // console.log(continueData);

    // fetch(`${process.env.NEXT_PUBLIC_APIURL}/session/continueWithTeacher`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${cookie.get("token")}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(continueData),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);

    //     if (data.status === "success") {
    //       // console.log("POST request successful:", data);
    //       toast.current?.show({
    //         severity: "info",
    //         summary: "Confirmed",
    //         detail: "You have accepted",
    //         life: 3000,
    //       });
    //       setTimeout(() => {
    //       }, 3000);
    //     } else {
    //       // console.error(data);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error during POST request:", error);
    //   });
  };

  // handle reject continue with teacher
  const reject = (sessionId: any) => {
    console.log(sessionId);

    fetch(`${process.env.NEXT_PUBLIC_APIURL}/session/continueWithTeacher`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, willContinue: false }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        if (data.status === "success") {
          // console.log("POST request successful:", data);
          toast.current?.show({
            severity: "warn",
            summary: "Rejected",
            detail: "You have rejected",
            life: 3000,
          });
          fetchContinueStatus();
        } else {
          // console.error(data);
          // Handle error if needed
        }
      })
      .catch((error) => {
        // console.error("Error during POST request:", error);
      });
  };
  const fetchMySubscription=()=>{
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/mySubscription`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`, // Correct the header key to 'Authorization'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
          if(data.status==="success"){
        setMySubscription(data.data);
          }
        // Set the retrieved Seeions in the state
      })
      .catch((error) => {
        console.error("Error fetching subscription:", error);
      });
  }
    useEffect(() => {
      fetchMySubscription();  
    }, []);
  const toast = useRef<Toast>(null);
  const showSuccess = (msg: any) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 5000,
    });
  };
  const showError = (msg: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 5000,
    });
  };

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

  const time = new Date();
  time.setSeconds(time.getSeconds() + 600); // 10 minutes timer
  const isSessionRunning = (session: any) => {
    const currentTime = moment().tz(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const sessionStartTime = moment(session.sessionDate);
    const sessionEndTime = moment(session.sessionDate).add(
      session.sessionDuration,
      "minutes"
    );

    return currentTime.isBetween(sessionStartTime, sessionEndTime);
  };

  useEffect(() => {
    fetchLatestSession();
  }, []);

  const fetchLatestSession = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/myLatestSession`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`, // Correct the header key to 'Authorization'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("latest", data.data);

        setLatestSession(data.data);
        // console.log(data?.data[0]?.id);

        // Set the retrieved Seeions in the state
      })
      .catch((error) => {
        // console.error("Error fetching sessions:", error);
      });
  };

  useEffect(() => {
    const updateButtonsState = () => {
      if (upComingSession.length > 0) {
        const sessionStartTime = moment.utc(upComingSession[0].sessionDate);
        const allowedStartTimeForJoin = sessionStartTime
          .clone()
          .subtract(1, "minute");
        const allowedStartTimeForReschedule = sessionStartTime
          .clone()
          .subtract(20, "minute");

        const currentTime = moment().tz(
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );

        setIsImHereButtonDisabled(
          currentTime.isBefore(allowedStartTimeForJoin)
        );
        setIsRescheduleButtonDisabled(
          currentTime.isAfter(allowedStartTimeForReschedule)
        );
      }
    };

    // Schedule the update after the component has been rendered
    const timerId = setTimeout(updateButtonsState, 0);

    // Cleanup function to clear the timer
    return () => clearTimeout(timerId);
  }, [
    upComingSession,
    setIsImHereButtonDisabled,
    setIsRescheduleButtonDisabled,
  ]);

  // custom theme
  const CustomTHeme = {
    target: "w-full",
    animation: "transition-opacity",
    arrow: {
      base: "absolute z-10 h-2 w-2 rotate-45",
      style: {
        dark: "bg-gray-900 dark:bg-gray-700",
        light: "bg-white",
        auto: "bg-white dark:bg-gray-700",
      },
      placement: "-4px",
    },
    base: "absolute inline-block z-10 rounded-lg py-2 px-3 text-sm font-medium shadow-sm",
    hidden: "invisible opacity-0",
    style: {
      dark: "bg-gray-900 text-white dark:bg-gray-700",
      light: "border border-gray-200 bg-white text-gray-900",
      auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white",
    },
    content: "relative z-20",
  };
  // check for user continue Status
  useEffect(() => {
    fetchContinueStatus();
  }, []);

  const fetchContinueStatus = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/myContinueStatus`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`, // Correct the header key to 'Authorization'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // setUserContinueSessionId(data?.data?.id)
        // console.log("user status", data);
        setUserContinueStatus(data?.data);
        // Set the retrieved Seeions in the state
      })
      .catch((error) => {
        console.error("Error fetching continue status:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  useEffect(() => {
    if (upComingSession.length > 0) {
      const sessionDate: number = new Date(
        upComingSession[0].sessionDate
      ).getTime();

      const intervalId = setInterval(() => {
        const currentDate: Date = new Date();
        const diff = sessionDate - currentDate.getTime();
        // const diffInSec = diff / 1000
        const diffInSec = Math.floor(diff / 1000);

        if (diffInSec === 0) {
          // console.log("done");
          fetchOngoingSessions();
          clearInterval(intervalId); // Stop the interval once fetch is triggered
        }
      }, 1000); // Check every second

      return () => clearInterval(intervalId);
    }
  }, [upComingSession]);

  const fetchOngoingSessions = () => {
    // Fetch ongoing sessions
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/ongoingSession`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("ongoing", data.data);
        setOngoingSession(data.data);
        if (data.data.length > 0) {
          // If there are ongoing sessions, display them
          setUpComingSession(data.data);
          setsessionId(data?.data[0]?.id);
          setLoading(false);
          setSessionLink(data?.data[0]?.meetingLink);
        }
      })
      .catch((error) => {
        // console.error("Error fetching ongoing sessions:", error);
        // Handle error if needed
      });
  };

  useEffect(() => {
    // Fetch ongoing sessions
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/ongoingSession`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOngoingSession(data.data);
        // console.log("ongoingSession", data);
        setsessionId(data?.data[0]?.id);
        setUpComingSession(data.data);
        // Check if the local storage item is set to true
        if (data.data.length > 0) {
          // If there are ongoing sessions, display them
          setLoading(false);
          setSessionLink(data?.data[0]?.meetingLink);
        } else {
          // If there are no ongoing sessions, fetch upcoming sessions
          fetchUpcomingSessions();
        }
      })
      .catch((error) => {
        // console.error("Error fetching ongoing sessions:", error);
        // If there's an error, fetch upcoming sessions
        fetchUpcomingSessions();
      });
  }, []);

  const fetchUpcomingSessions = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/upcomingSession`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.data);
        setUpComingSession(data.data);
        setsessionId(data?.data[0]?.id);
        setLoading(false);
      })
      .catch((error) => {
        // console.error("Error fetching upcoming sessions:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (countdownCompleted) {
        router.refresh()
      // fetchLatestSession();========================================+
      fetchContinueStatus();
      fetchUpcomingSessions();
    }
  }, [countdownCompleted]);

  // Cleanup function not needed for this case

  // Updated updateAttendance function
  const updateAttendance = () => {
    // console.log(sessionId);

    fetch(`${process.env.NEXT_PUBLIC_APIURL}/session/updateUserAttendance`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        if (data.status === "success") {
          // console.log("POST request successful:", data);
          showSuccess(`${data.message}`);
          window.open(sessionLink, "_blank");
        }
      })
      .catch((error) => {
        console.error("Error during POST request:", error);
      });
  };

  if (loading) {
    return (
      <div
        className={` w-full bg-white-color pr-3 p-5 shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] rounded-[24px]`}
        style={{ overflow: "hidden" }}
      >
        <ContentLoader
          speed={2}
          width={340}
          height={100}
          viewBox="0 0 340 100"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="232" y="-10" rx="3" ry="3" width="152" height="10" />
          <rect x="139" y="30" rx="3" ry="3" width="78" height="13" />
          <rect x="8" y="29" rx="3" ry="3" width="113" height="15" />
          <rect x="9" y="63" rx="3" ry="3" width="113" height="15" />
          <rect x="142" y="64" rx="3" ry="3" width="78" height="13" />
          <rect x="239" y="62" rx="3" ry="3" width="78" height="13" />
        </ContentLoader>
      </div>
    
    ); // You can replace this with a loading spinner or any other loading indicator
  }
  //

  return (
    <div
      className={` w-full p-5 shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] rounded-[24px]`}
    >
      {showConfirmDialog && (
        <ConfirmDialog
          closable={false}
          visible={true}
          message={"Do you want to Continue With This Teacher?"}
          acceptClassName="bg-secondary-color text-white px-2 py-1 rounded-md"
          rejectClassName="px-2 text-white mr-2 bg-red-500 hover:bg-red-600 py-1"
          header="Continue With This Teacher"
          icon="bi bi-info-circle"
          position="top"
          accept={() => accept(latestSession[0].id)}
          reject={() => reject(latestSession[0].id)}
        />
      )}
      <ContinueWithModal
      openContinueWithModal={openContinueWithModal}
      setOpenContinueWithModal={setOpenContinueWithModal}
      />
      <StudentPlanModal
        openPlansModal={openPlansModal}
        setOpenPlansModal={setOpenPlansModal}
        continueFlag={true}
      />
      <Toast ref={toast} />

      <h4 className={`${styles.secondary_head} my-2`}>
        {upComingSession[0]?.status || "upcoming session"}
      </h4>
      {upComingSession?.length > 0 ? (
        upComingSession?.map((session: any, index: any) => (
          <div className="relative" key={index}>
            <p>{`Session #${session.id} with title ${session.type}`}</p>
            <div
              className={`${styles.date}  max-[400px]:flex-col sm:flex-col  xl:flex-row flex justify- gap-5 my-2`}
            >
              <div className={`flex justify-center  items-center `}>
                <p className="text-md">
                  <FaCalendarDays />
                </p>
                <p className={`ml-3 mr-1`}>
                  {moment(session.sessionDate).format("D-MMM-YYYY")}
                </p>
              </div>
              <div className={`ml-3 gap-1  flex justify-center items-center`}>
                <p className="text-md">
                  <IoTimeOutline />
                </p>
                <p className={``}>
                  {convertDateTimeZone(
                    session.sessionDate,
                    "UTC",
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    "h:mm A"
                  )}
                  {" - "}
                  {convertDateTimeZone(
                    moment(session.sessionDate)
                      .add(session.sessionDuration, "minutes")
                      .format(), // Calculate end time by adding sessionDuration
                    "UTC",
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    "h:mm A"
                  )}
                </p>
                {/* <MyTimer expiryTimestamp={time} /> */}
              </div>
            </div>
            <div className="flex justify-center items-center">
              {isSessionRunning(session) ? (
                <Countdown
                  onStart={()=>fetchOngoingSessions()}
                  date={moment(session.sessionDate)
                    .add(session.sessionDuration, "minutes")
                    .toDate()}
                  renderer={({ hours, minutes, seconds, completed }) => {
                    if (completed) {
                      setTimeout(() => {
                        setCountdownCompleted(true);
                      });
                      return <></>;
                    } else {
                      // Update the value state for the knob
                      return (
                        <div className=" flex flex-col items-center gap-5 rounded-3xl px-3 py-1 ">
                          <p className="text-[#333]">
                            This Session will End within
                          </p>{" "}
                          <p>
                            {" "}
                            <span className="font-bold text-lg">
                              {minutes} mins
                            </span>{" "}
                            <span className="font-bold text-lg">
                              {seconds} sec
                            </span>
                          </p>
                        </div>

                        // <span className="font-bold text-lg">{hours} hours</span>
                      );
                    }
                  }}
                />
              ) : null}
            </div>
            <div className={`flex justify-center items-center gap-4 mb-3 mt-7`}>
              <Tooltip
                theme={CustomTHeme}
                className=" px-5"
                content={
                  isImHereButtonDisabled
                    ? `The session cannot be attended until session starts `
                    : "update your Attendence"
                }
              >
                <PrimaryButton
                  disabled={isImHereButtonDisabled}
                  onClick={() => updateAttendance()}
                  ourStyle={`w-full   text-sm font-semibold transition-colors text-white xl:py-[10px] md:px-[5px] max-[400px]:py-3 md:py-2 w-full shadow rounded-full mx-auto  max-md:w-45 ${
                    isImHereButtonDisabled
                      ? " bg-gray-500 cursor-not-allowed"
                      : "bg-secondary-color hover:bg-secondary-hover"
                  }`}
                  text={`${"Join Meeting"}`}
                />
              </Tooltip>
              <Tooltip
                theme={CustomTHeme}
                className=" px-5"
                content={
                  isRescheduleButtonDisabled
                    ? `Rescheduling is not allowed at the moment`
                    : "Reschedule your session"
                }
              >
                <button
                  onClick={() => setopenRescheduleModal(true)}
                  className={` text-sm text-secondary-color border-4  font-semibold transition-colors  xl:py-2 px-3 py-2  w-full rounded-full w-50 mx-auto md:py-0 max-md:w-45 ${
                    isRescheduleButtonDisabled
                      ? "bg-gray-500 border-gray-500 cursor-not-allowed text-white"
                      : "hover:bg-secondary-color border-[--secondary-color] hover:text-white"
                  }`}
                  disabled={isRescheduleButtonDisabled}
                >
                  reschedule Session
                </button>
              </Tooltip>
            </div>
            <span></span>
            <RescheduleSession
              sessionId={sessionId}
              openRescheduleModal={openRescheduleModal}
              setOpenRescheduleModal={setopenRescheduleModal}
              fromUpdcoming={true}
            />
            <StudentPlanModal
              openPlansModal={openPlansModal}
              setOpenPlansModal={setOpenPlansModal}
              continueFlag={true}
            />
          </div>
        ))
      ) : (
        <>
          <div className="flex justify-center mt-2 items-center flex-col gap-3 h-[200px]">
            <p className="font-meduim">No Upcoming Sessions</p>
            <Image
              src={"/vectors/empty-calendar.png"}
              alt="no upcoming session"
              width={120}
              height={100}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default UpcomingSessions;
