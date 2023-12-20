"use client";

import { useEffect, useState } from "react";
import AssignModal from "./assignModal";
import Cookies from "universal-cookie";
import { Spinner } from "flowbite-react";
import { convertDateTimeZone } from "@/utilities";
export default function PaidSesstionsTable() {
  const [totalPaid, setTotlaPaid] = useState([]);
  const [selectedSession, setSelectedSession]: any = useState(null);
  const [loading, setLoading] = useState(true);

  const cookies = new Cookies();

  const convertDate = convertDateTimeZone;
  const totalPaidSession = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/session/paid/available`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTotlaPaid(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    totalPaidSession();
  }, []);

  const rerenderComponent = () => {
    totalPaidSession();
  };

  const handleAssignSession = (session: any) => {
    setSelectedSession(session);
  };
  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  return (
    <div className={"w-full my-5"}>
      <h3 className={"adminBoxTitle responsiveText"}>Paid Sessions Requests</h3>
      <div className={"adminBox mt-4 flex flex-col w-[390px] mx-auto"}>
        {loading ? (
          <Spinner />
        ) : totalPaid && totalPaid.length > 0 ? (
          totalPaid.map((paidSession: any, index: number) => {
            return (
              <div
                key={index}
                className={
                  "p-1 my-2 font-semibold flex w-full justify-between items-center text-base"
                }
              >
                <details>
                  <summary>Session Details</summary>
                  <div className="flex justify-center items-center gap-3">
                    <ul className="ps-4">
                      <li>Student Name: {paidSession.user?.name}</li>
                      <li>
                        courses:
                        <br />
                        {paidSession.courses.map(
                          (course: any, index: number) => {
                            return (
                              <span key={index}>
                                {course}
                                <br />
                              </span>
                            );
                          }
                        )}
                      </li>
                      <li>
                        <span>
                          start time:{" "}
                          {convertDate(
                            paidSession.sessionDates[0],
                            "UTC",
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                            "h:mm A"
                          )}
                        </span>
                      </li>
                      <li>
                        <span
                          className={`${
                            paidSession.status === "pending"
                              ? "text-warning-color"
                              : "text-success-color"
                          }`}
                        >
                          <span className="text-black">status:</span>{" "}
                          {paidSession.status}
                        </span>
                      </li>
                      <li>
                        <span>type: {paidSession.type}</span>
                      </li>
                      sessions dates:
                      {paidSession.sessionDates.map(
                        (date: any, index: number) => {
                          return (
                            <li key={index} className="ps-2">
                              {convertDate(
                                date,
                                "UTC",
                                Intl.DateTimeFormat().resolvedOptions()
                                  .timeZone,
                                "MM/DD/YYYY hh:mm A"
                              )}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                </details>
                <h5
                  onClick={() => handleAssignSession(paidSession)}
                  key={paidSession.id}
                  className={
                    "cursor-pointer bg-secondary-color hover:bg-secondary-hover transition-colors px-[10px] py-[6px] text-[12px] text-white rounded-[16px]"
                  }
                >
                  Assign Session #{paidSession.id}
                </h5>
                {selectedSession && selectedSession.id === paidSession.id && (
                  <AssignModal
                    openAssignModal={true}
                    handleCloseModal={handleCloseModal}
                    sessionReqId={selectedSession.id}
                    user={selectedSession.user.name}
                    updateComponent={rerenderComponent}
                    api={"session/paid/accept"}
                  />
                )}
              </div>
            );
          })
        ) : (
          <p className="p-3 bg-warning-color text-white w-fit rounded-full font-bold">
            No paid sessions
          </p>
        )}
      </div>
    </div>
  );
}
