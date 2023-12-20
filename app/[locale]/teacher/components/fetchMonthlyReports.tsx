"use client"

import { useEffect, useState } from "react"
import Cookies from "universal-cookie"
import ReportData from "./reportData"
import AddMonthlyReportModal from "./addMonthlyReport"
import { Spinner } from "flowbite-react"

export default function FetchMonthlyReports() {
    const [allReports, setAllReports] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const cookies = new Cookies()
    const [openModal, setOpenModal] = useState(false)


    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }



    const getMonthlyReport = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/monthlyReport/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`,
            },
        }).then((response) => response.json())
        .then((data) => {
            console.log(data);
            setAllReports(data.data);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        })
    }


    useEffect(() => {
        getMonthlyReport();
    }, [])


    return (
        <div className='adminBox w-full flex-col my-5'>
            <div className="w-full">
                <button
                    className="flex items-center justify-center gap-2 smallBtn ms-auto font-semibold hover:bg-secondary-hover cursor-pointer mb-4"
                    onClick={handleOpenModal}
                >Add Report +</button>
            </div>
            <div className="w-full flex-col gap-2 h-[200px]">
                {

                    isLoading ? <Spinner /> 
                        
                        :
                            allReports && allReports.length > 0 ? allReports.map(
                                (report: any, index: number) => {
                            return (
                                <ReportData data={report} key={index} />
                            )
                        }) 
                        : <p className="p-3 bg-warning-color text-white w-fit rounded-full font-bold">No Reports</p>
                }
            </div>
                <AddMonthlyReportModal openAssignModal={openModal} handleCloseModal={handleCloseModal} />
        </div>
  )
}
