"use client";

import { convertDateTimeZone } from "@/utilities";
import { Spinner } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react"
import Cookies from "universal-cookie";

export default function OnGoingBox() {
    const [isLoading, setIsLoading] = useState(true)
    const [allSessions, setAllSessions] = useState<any>([])
    const cookies = new Cookies()
    const convertTime = convertDateTimeZone;
    const fetchAllSessions = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/session/?status=ongoing`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const sorted = data.data.sort((a: any, b: any) => {
                return new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime();
            })
            setAllSessions(sorted)
            setIsLoading(false)
        }).catch(err => {
            console.log(err)
            setIsLoading(false)
        })
    };

    useEffect(() => {
        fetchAllSessions()
    }, [])


    return(
        <div className={"flex-col justify-center items-center gap-[16px] h-[240px] w-full text-center adminBox"}>
            <h3 className={"adminBoxTitle"}>Ongoing Sessions</h3>
            <div className={"bg-white-color p-5 rounded-[16px]"}>
                {isLoading ? (<Spinner />) : 
                    allSessions && allSessions.length > 0 ? 
                        (
                            <div className={"flex flex-col items-center text-md font-semibold text-[black-color-one]"}>
                                <span>{convertTime(allSessions[0].sessionDate, "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone, "YYYY-MM-DD h:mm A")}</span>
                                <p>{allSessions[0].SessionInfo.teacher.name} with {allSessions[0].SessionInfo.user.name}</p>
                                <Link 
                                    href={allSessions[0].meetingLink}
                                    target="_blank"
                                    className={
                                    "bg-secondary-color hover:bg-secondary-hover transition-colors rounded-full mt-1 font-semibold px-5 py-2 text-white"
                                }>Join</Link>
                            </div>
                        )
                    : (
                        <p className="mt-3 p-3 bg-warning-color text-white w-fit rounded-full font-bold">No Sessions</p>
                    )}
            </div>
        </div>
    )
}
