"use client";

import { useEffect, useState } from "react";
import RescheduleModal from "./requestRescheduleModal";
import { convertDateTimeZone } from "@/utilities";
function TeacherScheduleData({ data }: { data: any }) {
  const [openModal, setOpenModal]: any = useState(false);

  const session = data && data;
  const userName =
    (session &&
      session.SessionInfo &&
      session.SessionInfo.user &&
      session.SessionInfo.user.name) ||
    "name not found :)";

  const convertDate = convertDateTimeZone;
  const sessionDate = convertDate(
    session.sessionDate,
    "UTC",
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    "MM/DD/YYYY hh:mm A"
  );
  const [isCanReschedual, setIsCanReschedual] = useState(false);
  const handleSessionTime = (time: any) => {
    // convert time to date object
    const convertedTime = new Date(time);
    // get current time
    const currentTime = new Date();
    // compare time with current time
    const deffTime = convertedTime.getTime() - currentTime.getTime();
    // if time is less than current time by 10 minutes, return true
    if (deffTime < 60 * 10 * 1000) {
      setIsCanReschedual(true);
    } else {
      // else return false
      setIsCanReschedual(false);
      console.log("false");
    }
  };

  // useEffect(() => {
  //     console.log(sessionDate)
  //     console.log(session)
  //     console.log(userName)
  //     // handleSessionTime(sessionDate)
  // },[])
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div
      className={
        "py-5 px-4 bg-white-color rounded-[16px] my-4 flex gap-3 font-semibold flex-wrap"
      }
    >
      <p>Session ID: {session.id}</p>
      <span>{sessionDate}</span>
      <p>{`with ${userName}`}</p>
      <button
        className="smallBtn hover:bg-secondary-hover transition-colors ms-auto"
        onClick={handleOpenModal}
      >
        Reschedule
      </button>

      <RescheduleModal
        openAssignModal={openModal}
        handleCloseModal={handleCloseModal}
        session={session}
      />
    </div>
  );
}

export default TeacherScheduleData;
