import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import moment from "moment-timezone";
import ContentLoader from "react-content-loader";
import RescheduleSession from "./rescheduleSession";

function TeacherUbsent() {
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const [teacherUbsentSessions, setTeacherUbsentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null
  );
  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);

  const handleRescheduleClick = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    // Open the reschedule modal
    setOpenRescheduleModal(true);
  };
  const convertDateTimeZone = (
    inputTime: moment.MomentInput,
    inputTimezone: string,
    outputTimezone: string,
    ourFormat: string
  ) => {
    const convertedTime = moment(
      `${moment().format("YYYY-MM-DD")}T${inputTime}`,
      "YYYY-MM-DDTHH:mm:ss.SSS"
    )
      .tz(inputTimezone)
      .clone()
      .tz(outputTimezone);
    return convertedTime.format(ourFormat);
  };

 const fetchTeacherUbsentSession=()=>{
  fetch(
    `${process.env.NEXT_PUBLIC_APIURL}/user/mySessions?status=teacher_absent`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data.data);

      setTeacherUbsentSessions(data.data);

    })
    .catch((error) => {
      console.error("Error fetching sessions:", error);
    });
  }
  useEffect(() => {
    
    fetch(
      `${process.env.NEXT_PUBLIC_APIURL}/user/mySessions?status=teacher_absent`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.get("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.data);

        // Assuming data.data contains the sessions
        setTeacherUbsentSessions(data.data);

        // Assuming data.data.status contains the status
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      });
  }, []);

  useEffect(() => {
   
      fetchTeacherUbsentSession();
    
  }, [openRescheduleModal])
  

  return (
    <>
      <div>
        <div className="md:min-h-[190px]  max-md:min-h-[100px]">
          {loading ? (
            // React Content Loader while data is being fetched
            <ContentLoader
              className="flex flex-col"
              speed={2}
              width={800}
              height={300}
              viewBox="0 0 800 300"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              {/* Add your loader shapes here */}
            </ContentLoader>
          ) : (
            <ul className="">
              {teacherUbsentSessions?.map((sessionInfo, index) => (
                <li
                  className="flex flex-col gap-4 mb-3 pr-2"
                  key={sessionInfo.id}
                >
                  <div className="bg-white-color p-4 flex flex-col gap-2 rounded-xl">
                    {/* <p className="my-1  font-medium">
                      Session ID:{" "}
                      <span className="bg-[--secondary-color] text-white p-1 rounded-2xl">
                        {sessionInfo.id}
                      </span>
                    </p>
                    <p>
                      Type :{" "}
                      <span
                        className={`${
                          sessionInfo.type != "free"
                            ? "bg-red-500 text-white"
                            : "bg-white border"
                        } shadow  px-3 py-1  rounded-lg`}
                      >
                        {" "}
                        {sessionInfo.type.toUpperCase()}
                      </span>
                    </p>
                    <div className=" flex justify-between items-center  font-medium">
                      <div>
                        Status:{" "}
                        <span
                          className={`
                         px-3  text-red-500 rounded-lg`}
                        >
                          {sessionInfo.status === "teacher_absent"
                            ? "Teacher Absent"
                            : ""}
                        </span>
                      </div>
                    </div> */}
                    <div className="flex  justify-between items-center sm:flex-col gap-3 xl:gap-0 xl:flex-row max-[400px]:flex-col">
                    <div className="flex flex-col justify-center items-start">
                    <p className=" font-medium">
                      Teacher Name: {sessionInfo?.SessionInfo?.teacher?.name}
                    </p>
                   
                      <p className=" font-medium flex  gap-4">
                      Date:
                      <span className="text-red-600">
                        {convertDateTimeZone(
                          sessionInfo.sessionDate,
                          "UTC",
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                          "DD/MMM/YYYY h:mm A"
                        )}
                      </span>
                    </p>
                    </div>
                    <button
                        onClick={() => handleRescheduleClick(sessionInfo.id)}
                        className="bg-[--secondary-color]  hover:bg-[#453ed2] h-fit text-sm py-2 rounded-full  text-white px-4"
                      >
                        Reschedule
                      </button>
                    </div>
                    
                   
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <RescheduleSession
          sessionId={selectedSessionId}
          openRescheduleModal={openRescheduleModal}
          setOpenRescheduleModal={setOpenRescheduleModal}
        />
      </div>
    </>
  );
}

export default TeacherUbsent;
