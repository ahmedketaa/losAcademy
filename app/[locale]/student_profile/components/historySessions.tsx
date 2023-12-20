import React, { useEffect, useState } from "react";
import { CustomFlowbiteTheme, Tabs } from "flowbite-react";
import Cookies from "universal-cookie";
import moment from "moment-timezone";
import MyLoader from "./MyLoader";
import Image from "next/image";
function HistorySessions() {
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const token = cookie.get("token");
  const [historySessions, setHistorySessions] = useState<any[]>([]);

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

  // History Sessions Api

  useEffect(() => {
    fetch(`${url}/user/myHistorySessions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Correct the header key to 'Authorization'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.data);

        setHistorySessions(data.data);
        // Set the retrieved Seeions in the state
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      });
  }, []);

  return (
    <div className={` md:min-h-[190px] max-md:min-h-[150px]`}>
      {historySessions === null ? (
        <MyLoader />
      ) : historySessions?.length > 0 ? (
        historySessions.map((session, index) => (
          <div
            key={index}
            className={`flex justify-between max-md:flex-col bg-white-color p-3 rounded-xl max-md:gap-3 gap-5 my-3 md:items-center`}
          >
            <p>Session #{session.id}</p>
            <p>Time: {" "}
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
            <p>Date:
              {" "}
              {convertDateTimeZone(
                session.sessionDate,
                "UTC",
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                "MMM D,YYYY"
              )}
            </p>
            {session.type === "free" ? (
              <p className="px-4 bg-white rounded-full max-md:w-fit py-2 border shadow">
                {" "}
                {session.type} session
              </p>
            ) : (
              ""
            )}
          </div>
        ))
      ) : (
        <div className="flex justify-center mt-5 items-center flex-col gap-5">
          <p className="font-meduim"> No History Sessions</p>
          <Image
            src={"/vectors/list.png"}
            alt="no upcoming session"
            width={150}
            height={100}
          />
        </div>
      )}
    </div>
  );
}

export default HistorySessions;
