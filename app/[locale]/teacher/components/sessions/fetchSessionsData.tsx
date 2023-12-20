"use client"

import {Table} from 'flowbite-react';
import { GrDocumentDownload } from 'react-icons/gr';

import Link from 'next/link';
import Cookies from 'universal-cookie';
import { convertDateTimeZone } from '@/utilities';



export default function FetchSessionsData({sessionData, updateComponent} : {sessionData: any; updateComponent: () => void}) {
    
    const cookie = new Cookies()
    const session = sessionData && sessionData

    const convertTime = convertDateTimeZone

  return (

    <Table.Row key={session.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {session.id}
            </Table.Cell>
            <Table.Cell>
                {session.SessionInfo.user.name}
            </Table.Cell>
            <Table.Cell>
                {session.SessionInfo.user.email}
            </Table.Cell>
            <Table.Cell>
                {session.SessionInfo.user.gender}
            </Table.Cell>
            <Table.Cell>
                {convertTime(session.sessionDate, "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone, "MMM D,YYYY h:mm A")}
            </Table.Cell>
            <Table.Cell>
                {session.type}
            </Table.Cell>
            <Table.Cell>
                {session.status === "pending" ? 
                            <div className='bg-warning-color p-2 rounded-full text-white font-semibold capitalize'>{session.status}</div> 
                        : session.status === 'ongoing' ?
                            <div className='bg-secondary-color p-2 rounded-full text-white font-semibold capitalize'>{session.status}</div> 
                        : session.status === 'taken' ?
                            <div className='bg-success-color p-2 rounded-full text-white font-semibold capitalize'>{session.status}</div>
                        :   <div className='bg-danger-color p-2 rounded-full text-white font-semibold capitalize'>{session.status}</div>
                        
                        } 
            </Table.Cell>
        </Table.Row>
  )
}
