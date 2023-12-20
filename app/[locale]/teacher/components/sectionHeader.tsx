"use client";

import { PiPlusBold } from "react-icons/pi";
import AddReportModal from "./addReportModal";
import { useState } from "react";


export default function SectionHeader() {
    const [handleModal, setHandleModal] = useState(false)

    const handleCloseModal = () => {
        setHandleModal(false)
    }
    const openModal = () => {
        setHandleModal(true)
    }

    return (
    <div className="flex justify-between items-center">
        <h3 className={"adminBoxTitle"}>Reports</h3>
        <button 
            className="flex items-center justify-center gap-2 smallBtn font-semibold hover:bg-secondary-hover cursor-pointer"
            onClick={openModal}
            >
            Add Report <PiPlusBold />
        </button>
        <AddReportModal openAssignModal={handleModal} handleCloseModal={handleCloseModal} />
    </div>
  )
}
