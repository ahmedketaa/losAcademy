import React, { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import ContentLoader from "react-content-loader";
import moment from "moment-timezone";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

function MyRescheduleRequest({
  fromStudentProfile,
}: {
  fromStudentProfile?: boolean;
}) {
  const cookie = new Cookies();
  const [myReschedule, setMyReschedule] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/requestReschedule`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        const pendingRequests = data.data.filter(
          (request: any) => request.status === "pending"
        );
        const sortedPendingRequests = pendingRequests.sort((a: any, b: any) =>
          moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0]) ? 1 : -1
        );

        const sortedRequests = data.data.sort((a: any, b: any) =>
          moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0]) ? 1 : -1
        );
        setMyReschedule(sortedRequests);

        if (fromStudentProfile === true) {
          setMyReschedule(sortedPendingRequests);
        }
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchMyReschedule = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/requestReschedule`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        const pendingRequests = data.data.filter(
          (request: any) => request.status === "pending"
        );
        const sortedPendingRequests = pendingRequests.sort((a: any, b: any) =>
          moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0]) ? 1 : -1
        );
        const sortedRequests = data.data.sort((a: any, b: any) =>
          moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0]) ? 1 : -1
        );
        setMyReschedule(sortedRequests);

        if (fromStudentProfile === true) {
          setMyReschedule(sortedPendingRequests);
        }
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
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
  // cancel reschedule request
  const confirm2 = (requestId: number) => {
    confirmDialog({
      message: "Do you want to delete this request?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      rejectClassName: "bg-secondary-color mr-2 text-white px-2 py-1 rounded-md",
      acceptClassName: "px-3 text-white  bg-red-500 hover:bg-red-600 py-1",
      accept: () => cancelMyRescheduleRequest(requestId), // Use accept instead of cancelMySessionRequest in accept callback
      reject: () => {},
    });
  };
  const cancelMyRescheduleRequest = (requestId: number) => {
    if (!requestId || isNaN(requestId)) {
      showError("Please enter a valid number for the request!");
      return;
    }

    const requestBody = {
      requestId: Number(requestId),
    };

    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/cancelRescheduleRequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.status === "success") {
          showSuccess(data.message);
        } else {
          showError(data.message);
        }
        fetchMyReschedule();
      })
      .catch((error) => {
        showError("An Error Occurred");
        console.error(error);
      });
  };

  return (
    <div className={`${myReschedule.length>0?"scrollAction":''} sm:h-[120px] max-[400px]:h-[120px] lg:h-[150px]`}>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="md:min-h-[190px] max-md:min-h-[150px]  ">
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
          </ContentLoader>
         </>
        ) : (
          <>
            {myReschedule?.length === 0 ? (
              <p>No pending reschedule requests available.</p>
            ) : (
              <div className="">
                <ul className="mx-2">
                {myReschedule.map((request, index) => (
                  <li className="flex flex-col gap-5 mb-3" key={request.id}>
                    <div className="bg-white-color p-2 flex flex-col gap-1 rounded-xl ">
                      {/* <div className="flex justify-center items-center  mt-2">
                        <h3 className="px-2 py-1 font-semibold text-lg bg-blueviolet-600 rounded-xl">
                          With Teacher:{" "}
                          {request.session.SessionInfo.teacher.name}
                        </h3>{" "}
                      </div> */}
                      {/* <p className="my-1  font-medium">
                        Session ID:{" "}
                        <span className="bg-[--secondary-color] text-white p-1 rounded-2xl">
                          {request.sessionId}
                        </span>
                      </p> */}
                      {fromStudentProfile?'':
                      (
                        <p className="my-1  font-medium">
                        Status:{" "}
                        <span
                          className={`${
                            request.status === "pending"
                              ? "bg-[#ffaa38] text-white"
                              : "border shadow bg-white"
                          } px-3 py-1  rounded-lg`}
                        >
                          {request.status}
                        </span>
                      </p>
                      )}
                    
                      {/* <p className="my-1  font-medium">
                        Requested By:{" "}
                        {request.requestedBy === "user"
                          ? "Me"
                          : request.requestedBy.toUpperCase()}
                      </p> */}
                      {request.newDatesOptions.map(
                        (date: string, i: number) => (
                          <div
                            className="max-[400px]:flex-col sm:flex-col lg:flex-row  flex gap-2 items-center justify-start"
                            key={i}
                          >
                           <p>
                           <span>Date:</span>
                            {convertDateTimeZone(
                              date,
                              "UTC",
                              Intl.DateTimeFormat().resolvedOptions().timeZone,
                              "DD/MMM/YYYY "
                            )}
                           </p>
                            <p className="flex gap-2 items-center justify-start">
                              <span>Time:</span>
                              {convertDateTimeZone(
                                date,
                                "UTC",
                                Intl.DateTimeFormat().resolvedOptions()
                                  .timeZone,
                                "h:mm A"
                              )}
                            </p>
                          </div>
                        )
                      )}
                      <p className="my-1  font-medium">
                        Teacher Name: {request.session.SessionInfo.teacher.name}
                      </p>
                      {request.status === "approved" ? (
                        <p className="my-1  font-medium flex  gap-4">
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
                      )}
                      {request.status === "pending" ? (
                        <>
                          {/* <div className=" flex flex-col gap-3 ">
                            <h3 className="font-semibold text-lg ">
                              The Date You Chose :
                            </h3>
                            <div className="flex m-auto items-center gap-3">
                              {request.newDatesOptions.map(
                                (date: string, i: number) => (
                                  <p
                                    className="my-1 "
                                    key={i}
                                  >
                                    {convertDateTimeZone(
                                      date,
                                      "UTC",
                                      Intl.DateTimeFormat().resolvedOptions()
                                        .timeZone,
                                      "DD/MMM/YYYY h:mm A"
                                    )}
                                  </p>
                                )
                              )}
                            </div>
                          </div> */}
                          <div className="flex justify-center items-center">
                            <button
                              onClick={() =>
                                confirm2(request.id)
                              }
                              className={`hover:text-white hover:bg-secondary-color px-3 py-1 text-secondary-color border-2 border-[--secondary-color] font-semibold transition-colors  w-fit rounded-full `}
                            >
                              Cancel
                            </button>
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

export default MyRescheduleRequest;
