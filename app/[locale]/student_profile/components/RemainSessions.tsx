"use client";
import React, { useEffect, useState } from "react";
import styles from "../page.module.css";
import moment from "moment-timezone";
import Cookies from "universal-cookie";
import Image from "next/image";
import RescheduleSession from "./rescheduleSession";
import MyLoaderContainer from "./MyLoader";

function RemainSessions() {
  const cookie = new Cookies();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null
  );

  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
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

  const handleRescheduleClick = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    // Open the reschedule modal
    setOpenRescheduleModal(true);

  };

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to fetch data

    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/remainSessions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setSessions(data.data);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false when data fetching is complete
      });
  }, []);

  return (
    <div>
      <div className={`${styles.sessions} px-2 h-[200px]  scrollAction`}>
        {loading ? (
          <div style={{ overflow: "hidden" }}>
            <MyLoaderContainer />
          </div>
        ) : sessions?.length > 0 ? (
          <>
            {sessions.map((session, index) => {
              const sessionStartTime = moment.utc(session.sessionDate);
              const currentTime = moment().tz(
                Intl.DateTimeFormat().resolvedOptions().timeZone
              );
              const allowedStartTimeForReschedule = sessionStartTime
                .clone()
                .subtract(20, "minute");

              const check = currentTime.isBetween(
                allowedStartTimeForReschedule,
                sessionStartTime.clone().add(session.sessionDuration, "minutes")
              );
              return (
                <div
                  key={index}
                  className={`${styles.session} bg-white-color px-2 rounded-2xl py-3 w-full sm:flex-col lg:flex-row max-[400px]:flex-col flex justify-between items-center gap- my-3`}
                >
                  <div>
                    <p className="">Session #{session.id}</p>
                    <p className="max-lg:text-sm">
                      Time:{" "}
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
                          .format(),
                        "UTC",
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                        "h:mm A"
                      )}
                    </p>
                    <p className="">
                      Date:{" "}
                      {convertDateTimeZone(
                        session.sessionDate,
                        "UTC",
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                        "MMM D,YYYY"
                      )}
                    </p>
                    
                    <div className={"  py-1 "}>
                      with teacher:{" "}
                      <span className="font-bold">
                        {session.SessionInfo.teacher.name}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRescheduleClick(session.id)}
                    className={`${check ? "cursor-not-allowed" : ""} bg-${
                      check ? "gray-500" : "[--secondary-color]"
                    } hover:bg-${
                      check ? "gray-500" : "[#453ed2]"
                    } h-fit text-sm rounded-full py-2 text-white px-4`}
                    disabled={check}
                  >
                    Reschedule
                  </button>
                </div>
              );
            })}{" "}
          </>
        ) : (
          <div className="flex justify-center mt-2 items-center flex-col gap-5">
            <p className="font-meduim"> No Remmain Sessions</p>
            <Image
              src={"/vectors/list.png"}
              alt="no upcoming session"
              width={120}
              height={90}
            />
          </div>
        )}
      </div>
      <RescheduleSession
        sessionId={selectedSessionId}
        openRescheduleModal={openRescheduleModal}
        setOpenRescheduleModal={setOpenRescheduleModal} 
        fromTeacherRequest={false}
        />
    </div>
  );
}

export default RemainSessions;
