"use client"

import {Table} from 'flowbite-react';

import { BiSolidEditAlt } from 'react-icons/bi';
import { useState } from 'react';
import EditRequestPayOut from './ediPayOutModal';
import { convertDateTimeZone } from '@/utilities';



export default function FetchPayOutData({payOutData, updateComponent} : {payOutData: any; updateComponent: () => void}) {
    
    const payout = payOutData && payOutData
    const convertTime = convertDateTimeZone
    const [handleModal, setHandleModal] = useState(false)

    const openModal = () => {
        setHandleModal(true)
    }
    const closeModal = () => {
        setHandleModal(false)
    }


  return (

    <Table.Row key={payout.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {payout.id}
            </Table.Cell>
            <Table.Cell>
                {convertTime(payout.createdAt, "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone, "YYYY-MM-DD h:mm A")}
            </Table.Cell>
            <Table.Cell>
            {payout.amount}$
            </Table.Cell>
            <Table.Cell>
            {payout.status === "pending" 
                ? 
                    <p className="p-2 bg-warning-color text-white rounded-full font-semibold">Pending</p>
                : 
                    payout.status === "failed" 
                ? 
                    <p className="p-2 bg-danger-color text-white rounded-full font-semibold">Failed</p> 
                : 
                    <p className="p-2 bg-success-color text-white rounded-full font-semibold">Successful</p>
                }
                </Table.Cell>
                <Table.Cell>
                    <div className="flex items-center justify-center">
                        <BiSolidEditAlt className={"text-2xl cursor-pointer"} style={{color: "green"}} onClick={openModal}/>
                        <EditRequestPayOut openAssignModal={handleModal} handleCloseModal={closeModal} payoutID={payout} updateComponent={updateComponent} />
                    </div>
            </Table.Cell>
        </Table.Row>
  )
}
