"use client"

import {Table} from 'flowbite-react';
import { GrDocumentDownload } from 'react-icons/gr';
import { useState, useRef } from 'react';

import Link from 'next/link';
import Cookies from 'universal-cookie';
import { convertDateTimeZone } from '@/utilities';



export default function FetchMatrialData({matrialData, updateComponent} : {matrialData: any; updateComponent: () => void}) {
    const cookie = new Cookies()
    const matrial = matrialData

    const convertTime = convertDateTimeZone

  return (

    <Table.Row key={matrial.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {matrial.id}
            </Table.Cell>
            <Table.Cell>
                {matrial.name}
            </Table.Cell>
            <Table.Cell>
                {matrial.course}
            </Table.Cell>
            <Table.Cell>
                {matrial.age}
            </Table.Cell>
            <Table.Cell>
                {convertTime(matrial.createdAt, "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone, "MMM D,YYYY h:mm A")}
            </Table.Cell>
            <Table.Cell>
                {matrial.status === "new Arrival" ? 
                            <div className='bg-danger-color p-2 rounded-full text-white font-semibold'>{matrial.status}</div> 
                        : matrial.status === 'active' ?
                            <div className='bg-success-color p-2 rounded-full text-white font-semibold'>{matrial.status}</div> 
                        : 
                            <div className='bg-warning-color p-2 rounded-full text-white font-semibold'>{matrial.status}</div>
                        } 
            </Table.Cell>
            <Table.Cell>
                <div className='flex items-center justify-center'>
                    <Link href={matrial.b2Link} download={matrial.b2Link} target="_blank">
                        <GrDocumentDownload className="text-2xl cursor-pointer"/>
                    </Link>
                </div>
            </Table.Cell>
        </Table.Row>
  )
}
