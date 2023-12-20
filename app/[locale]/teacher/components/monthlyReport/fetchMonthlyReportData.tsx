"use client"

import {Table, Tooltip} from 'flowbite-react';
import {LiaPhoneSolid} from "react-icons/lia";
import {GoMail} from "react-icons/go";
import {BsTrash} from "react-icons/bs";
import { BiFile, BiSolidEditAlt } from 'react-icons/bi';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { convertDateTimeZone } from '@/utilities';
import DisplayReportModal from './displayReportModal';



export default function FetchMonthlyReportsData({reportData, updateComponent} : {reportData: any; updateComponent: () => void}) {
    const [handleModal, setHandleModal] = useState(false)
    const report = reportData

    const openReportModal = () => {
        setHandleModal(true)
    }
    const closeReportModal = () => {
        setHandleModal(false)
    }

  return (

    <Table.Row key={report.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {report.id}
            </Table.Cell>
            <Table.Cell>
                {report.user.name}
            </Table.Cell>
            <Table.Cell>
                {convertDateTimeZone(report.createdAt, "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone, "YYYY-MM-DD h:mm A")}
            </Table.Cell>
            <Table.Cell>
                <div className="flex flex-row items-center justify-center gap-3">
                    <Tooltip content="View Report" style='light'>
                        <BiFile className={"text-2xl cursor-pointer"} onClick={openReportModal} />
                    </Tooltip>
                </div>
                <DisplayReportModal openAssignModal={handleModal} handleCloseModal={closeReportModal} details={report} />
            </Table.Cell>
        </Table.Row>
  )
}