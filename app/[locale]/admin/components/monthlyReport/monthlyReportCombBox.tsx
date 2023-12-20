"use client"
import {CustomFlowbiteTheme, Dropdown} from "flowbite-react";
import { useState } from "react";
import AddMonthlyReport from "./addMonthlyReport";


export default function MonthlyReportCombBox({...props}: any) {
    const [handleModal, setHandleModal] = useState(false)

    const openModal = () => {
        setHandleModal(true)
    }
    const closeModal = () => {
        setHandleModal(false)
    }

    return(
        <section className={"px-5"}>
            <div className={"flex flex-row w-full justify-between items-center bg-white-color p-5 rounded-[16px] flex-wrap"}>
                <form>
                    <input className={
                        "border-0 rounded-[16px] w-[420px] max-md:w-full focus:border-[2px] border-secondary-color transition-all"
                    } type={"search"} placeholder={"search"} />
                </form>
                <button 
                    onClick={openModal}
                    className={
                        "bg-white hover:bg-gray-100 transition-colors text-black-color-one px-5 py-2 rounded-[16px] font-normal my-3"
                    }
                    >Add Report +</button>
            </div>
            <AddMonthlyReport openReportModal={handleModal} handleCloseModal={closeModal} updateComponent={props.updateComponent}/>
        </section>
    )
}