import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import { Toast } from "primereact/toast";
import ContentLoader from "react-content-loader";
import RescheduleSession from "./rescheduleSession";
import { RadioButton } from "primereact/radiobutton";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
function TeacherRescduleRequests({
  fromStudentProfile,
}: {
  fromStudentProfile?: boolean;
}) {
  const cookie = new Cookies();
  const [teatcherreschedule, setTeatcherReschedule] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openRescheduleModal, setOpenRescheduleModal] =
    useState<boolean>(false);
  const [sessionId, setSessionId] = useState<Number>();
  const [ingredient, setIngredient] = useState("");

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
  useEffect(() => {
    // console.log(ingredient);
  }, [ingredient]);

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
  //
  const fetchTeacherRescheduleRequests = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/receivedRescheduleRequests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        const pendingRescheduleRequests = data.data.filter(
          (request: any) => request.status === "pending"
        );

        const sortedPendingRescheduleRequests = pendingRescheduleRequests.sort(
          (a: any, b: any) => {
            // Adjust the sorting logic based on your specific requirements
            return moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0])
              ? 1
              : -1;
          }
        );
        const sortedTeacherRequests = data.data.sort((a: any, b: any) =>
          moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0]) ? 1 : -1
        );
        setTeatcherReschedule(sortedTeacherRequests);
        if (fromStudentProfile === true) {
          setTeatcherReschedule(sortedPendingRescheduleRequests);
        }
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const acceptReschedule = (requestId: number, newTime: string) => {
    if (!ingredient) {
      showError("please select a date ");
      return;
    }

    const newData = {
      rescheduleRequestId: requestId,
      newDate: newTime,
    };
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/acceptReschedule`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data); // Log the response data
        if (data.status === "success") {
          showSuccess(data.message);
        } else {
          showError(data.message);
        }
        fetchTeacherRescheduleRequests();
        // Handle success, e.g., update state or show a success message
        // console.log("Reschedule request accepted successfully");
      })
      .catch((error) => {
        showError("some thing went wrong");
        console.error("Error accepting reschedule request:", error);
      });
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/receivedRescheduleRequests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.data);

        const pendingRescheduleRequests = data.data.filter(
          (request: any) => request.status === "pending"
        );

        const sortedPendingRescheduleRequests = pendingRescheduleRequests.sort(
          (a: any, b: any) => {
            // Adjust the sorting logic based on your specific requirements
            return moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0])
              ? 1
              : -1;
          }
        );
        const sortedTeacherRequests = data.data.sort((a: any, b: any) =>
          moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0]) ? 1 : -1
        );
        setTeatcherReschedule(sortedTeacherRequests);
        if (fromStudentProfile === true) {
          setTeatcherReschedule(sortedPendingRescheduleRequests);
        }
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const denyAllReschedule = (requestId: number, sessionId: Number) => {
    setSessionId(sessionId);
    const newData = {
      rescheduleRequestId: requestId,
    };

    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/declineReschedule`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data); // Log the response data
        if (data.status === "success") {
          showSuccess(data.message);
          setOpenRescheduleModal(true);
          fetchTeacherRescheduleRequests();
          // Handle success, e.g., update state or show a success message
          // console.log("Reschedule request declined successfully");
        } else {
          showError(data.message);
          fetchTeacherRescheduleRequests();
        }
      })
      .catch((error) => {
        showError("Something went wrong");
        console.error("Error declining reschedule request:", error);
      });
  };
  return (
    <div className={`${teatcherreschedule.length>0? 'scrollAction':''} sm:h-[120px] max-[400px]:h-[120px] lg:h-[150px]`} >
      <RescheduleSession
        setOpenRescheduleModal={setOpenRescheduleModal}
        openRescheduleModal={openRescheduleModal}
        sessionId={sessionId}
        fromTeacherRequest={true}

      />
      <Toast ref={toast} />
      <div className="md:min-h-[190px] max-md:min-h-[150px] ">
        {loading ? (
          // React Content Loader while data is being fetched
          <>
          <ContentLoader
            speed={2}
            width={800}
            height={300}
            viewBox="0 0 800 300"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="3" ry="3" width="70" height="10" />
            <rect x="80" y="0" rx="3" ry="3" width="100" height="10" />
            <rect x="190" y="0" rx="3" ry="3" width="10" height="10" />
          </ContentLoader>
          </>
        ) : (
          <>
            {teatcherreschedule?.length === 0 ? (
              <p>No pending reschedule requests available.</p>
            ) : (
              <div className="">
                <ul className="h-full mx-2">
                  {teatcherreschedule.map((request) => (
                    <li className="flex flex-col gap-5 mb-3" key={request.id}>
                      <div className="bg-white-color p-2 flex flex-col gap-1 rounded-xl ">
                        <p className="  font-medium">
                          Session ID:{" "}
                          <span className="">#{request.sessionId}</span>
                        </p>
                        <p className="  font-medium">
                          Teacher Name:{" "}
                          {request.session?.SessionInfo?.teacher.name}
                        </p>
                        {fromStudentProfile?'':
                      (
                        <p className="  font-medium">
                        Status:{" "}
                        <span
                          className={`${
                            request.status === "pending"
                              ? "bg-yellow-400 text-white"
                              : "border shadow bg-white"
                          }  px-3 py-1 font-semibold rounded-lg `}
                        >
                          {request.status}
                        </span>
                      </p>
                      )}
                        {/* 
                    <p className="  font-medium">
                      Requested By: {request.requestedBy.toUpperCase()}
                    </p> */}
                        {/* <p className="  font-medium flex  gap-4">
                      Old Date:
                      <span className="text-red-600">
                        {convertDateTimeZone(
                          request.oldDate,
                          "UTC",
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                          "DD/MMM/YYYY h:mm A"
                        )}
                      </span>
                    </p> */}
                        {/* {request.status === "approved" ? (
                        <p className="  font-medium flex  gap-4">
                          New Date:
                          <span className="text-green-600">
                            {convertDateTimeZone(
                              request.newDate,
                              "UTC",
                              Intl.DateTimeFormat().resolvedOptions().timeZone,
                              "DD/MMM/YYYY h:mm A"
                            )}
                          </span>
                        </p>
                      ) : (
                        ""
                      )} */}
                        {request.status === "pending" ? (
                          <>
                            <div className="mt-2 flex flex-col gap-3 ">
                              <div className="flex justify-center  items-center">
                                <div className="flex  items-center gap-5">
                                  {request.newDatesOptions?.map(
                                    (date: string, index: number) => (
                                      <div
                                        className="flex flex-col items-center"
                                        key={index}
                                      >
                                        <div className="flex items-center">
                                          <div className="bg-white dark:bg-gray-100 rounded-full w-4 h-4 flex flex-shrink-0 justify-center items-center relative">
                                            <input
                                              id={`label${index}`}
                                              type="radio"
                                              name="radio"
                                              value={date}
                                              onChange={(e) =>
                                                setIngredient(e.target.value)
                                              }
                                              className="ring-1 focus:bg-secondary-color checked:bg-secondary-color  ring-secondary-color  focus:opacity-100 focus:ring-2  focus:ring-secondary-color  border-2 rounded-full border-secondary-color absolute cursor-pointer  checked:border-none"
                                            />
                                          </div>
                                          <label
                                            htmlFor={`label${index}`}
                                            className="ml-2 text-sm leading-4 font-normal text-gray-800 dark:text-gray-100"
                                          >
                                            {convertDateTimeZone(
                                              date,
                                              "UTC",
                                              Intl.DateTimeFormat().resolvedOptions()
                                                .timeZone,
                                              "DD/MMM/YYYY h:mm A"
                                            )}
                                          </label>
                                        </div>
                                        {/* <div className="flex align-items-center">
                                      <RadioButton
                                        className="border-2 rounded-[100%] fo focus-within:border-none focus-within:bg-[--secondary-color] border-[--secondary-color]   "
                                        inputId={`ingredient${index}`}
                                        name="Date"
                                        value={date}
                                        onChange={(e) => setIngredient(e.value)}
                                      />
                                      <label
                                        htmlFor={`ingredient${index}`}
                                        className="ml-2"
                                      >
                                        {convertDateTimeZone(
                                          date,
                                          "UTC",
                                          Intl.DateTimeFormat().resolvedOptions()
                                            .timeZone,
                                          "DD/MMM/YYYY h:mm A"
                                        )}
                                      </label>
                                    </div> */}

                                        {/* <p className=" text-[--secondary-color]">
                                      {convertDateTimeZone(
                                        date,
                                        "UTC",
                                        Intl.DateTimeFormat().resolvedOptions()
                                          .timeZone,
                                        "DD/MMM/YYYY h:mm A"
                                      )}
                                    </p> */}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                              <div className="m-auto flex justify-center gap-3 items-center">
                                <button
                                  onClick={() =>
                                    acceptReschedule(request.id, ingredient)
                                  }
                                  className={`${
                                    request.status != "pending" ? "hidden" : ""
                                  } px-5 py-1 bg-secondary-color rounded-3xl text-white`}
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() =>
                                    denyAllReschedule(
                                      request.id,
                                      request.sessionId
                                    )
                                  }
                                  className={`hover:text-white hover:bg-secondary-color px-3 py-1 text-secondary-color border-2 border-[--secondary-color] font-semibold transition-colors  w-fit rounded-full `}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherRescduleRequests;
