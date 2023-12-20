'use client';

import {CustomFlowbiteTheme, Spinner, Table} from 'flowbite-react';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import SessionsComboBox from './sessionsComboBox';
import FetchSessionsData from './fetchSessionsData';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';

export default function SessionsTable() {
    const [allSessions, setAllSessions]: any = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const cookies = new Cookies()
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(10);
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const getPaginatedData = () => {
        const endIndex = first + rows;
        return allSessions.slice(first, endIndex);
    };
    const displaydSessions = getPaginatedData()
    const customTheme: CustomFlowbiteTheme['table'] = {
        head: {
            base: "group/head text-xs uppercase text-black-color-one bg-white-color p-[15px] text-center",
            cell: {
                base: "group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-white-color px-6 py-3"
            }
        }
    }

    const fetchAllSessions = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher/sessions`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setAllSessions(data.sessions)
            setIsLoading(false)
        }).catch(err => {
            console.log(err)
            setIsLoading(false)
        })
    };

    useEffect(() => {
        fetchAllSessions()
    }, [])

    return (
        <>
        <SessionsComboBox  updateComponent={fetchAllSessions}/>
        <div className={"px-5 py-4"}>
        <Table>
            <Table.Head theme={customTheme.head}>
                <Table.HeadCell theme={customTheme.head}>
                    #Session ID
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Student Name
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Student Email
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Gender
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Session Date
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Session Type
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Status
                </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                {isLoading ? (
                    <Table.Row>
                    <td><Spinner size="xl" /></td>
                    </Table.Row>
                 ) :
             (allSessions && allSessions.length > 0 
                    ? displaydSessions.map((session: any, index: number) => {
                    return(
                        <FetchSessionsData key={index} sessionData={session} updateComponent={fetchAllSessions}/>
                    )
                })
                : <tr><td className="p-5">There is No Sessions</td></tr>
                )
            }
            </Table.Body>
        </Table>
        <div className="card mt-4">
            <Paginator  first={first} rows={rows} totalRecords={allSessions.length} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
        </div>
        </div>
        </>
    )
}