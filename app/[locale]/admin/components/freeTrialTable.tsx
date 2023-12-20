"use client"

import { useEffect, useState } from "react"
import AssignModal from "./assignModal"
import Cookies from "universal-cookie"
import moment from 'moment-timezone';
import { Spinner } from "flowbite-react";
export default function FreeSesstionsTable() {
    const [totalFree, setTotlaFree] = useState([]);
    const [selectedSession, setSelectedSession]: any = useState(null);
    const [loading, setLoading] = useState(true);

    const cookies = new Cookies();
    
    const convertDateTimeZone = (inputTime: moment.MomentInput, inputTimezone: string, outputTimezone: string, ourFormat: string) => {
        const convertedTime = moment(inputTime)
          .tz(inputTimezone)
          .clone()
          .tz(outputTimezone);
        return convertedTime.format(ourFormat);
      };
    
    const totalFreeSessions = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/session/free/available`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            }
        })
        .then(response => response.json())
        .then(data => {
           setTotlaFree(data.data)
           setLoading(false);
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
        }
        )
    }
    useEffect(() => {
        totalFreeSessions()
    }, [])

    const rerenderComponent = () => {
        totalFreeSessions();
    }


    const handleAssignSession = (session: any) => {
        setSelectedSession(session);
    };
    const handleCloseModal = () => {
        setSelectedSession(null);
    };



    return(
        <div className={"w-full mb-5"}>
            <h3 className={"adminBoxTitle responsiveText"}>Free Sessions Requests</h3>
            <div className={"adminBox mt-4 flex flex-col w-[390px] mx-auto"}>
                {loading ? (
                    <Spinner />
                    ) : (
                        totalFree && totalFree.length > 0 ? totalFree.map((freeSession: any, index: number) => {
                        return(
                            <div key={index} className={"p-1 my-2 font-semibold flex w-full justify-between items-center text-base"}>
                                <details>
                                    <summary>Session Details</summary>
                                    <div className="flex justify-center items-center gap-3">
                                        <ul className="ps-4">
                                            <li>
                                                <span>
                                                    start time: {convertDateTimeZone(freeSession.sessionDates[0], "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone, "h:mm A")}
                                                </span>
                                            </li>
                                            <li>
                                                <span className={`${freeSession.status === 'pending' ? 'text-warning-color' : 'text-success-color'}`}>
                                                    <span className="text-black">status:</span> {freeSession.status}
                                                </span>
                                            </li>
                                            <li>
                                                <span>
                                                    type: {freeSession.type}
                                                </span>
                                            </li>
                                            sessions dates: 
                                            {freeSession.sessionDates.map((date: any, index: number) => {
                                                return(
                                                    <li key={index} className="ps-2">
                                                            {convertDateTimeZone(date, "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone, "MM/DD/YYYY hh:mm A")}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </details>
                                <h5 onClick={() => handleAssignSession(freeSession)} className={
                                    "cursor-pointer bg-secondary-color hover:bg-secondary-hover transition-colors px-[10px] py-[6px] text-[12px] text-white rounded-[16px]"
                                }>Assign Session #{freeSession.id}</h5>
                                {selectedSession && selectedSession.id === freeSession.id && (
                                    <AssignModal openAssignModal={true} handleCloseModal={handleCloseModal} sessionReqId={selectedSession.id} user={selectedSession.user.name} updateComponent={rerenderComponent} />
                                )}
                            </div>
                        )
                    }) : (
                        <p className="p-3 bg-warning-color text-white w-fit rounded-full font-bold">There is no free requests</p>
                    )
                )}
            </div>
        </div>
    )
}