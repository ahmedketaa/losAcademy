'use client';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primereact/resources/primereact.min.css';
import {CustomFlowbiteTheme, Spinner, Table} from 'flowbite-react';
import { useEffect, useState } from 'react';
import FetchSessionData from './fetchSessionData';
import SessionComboBox from './sessionComboBox';
import Cookies from 'universal-cookie';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';

export default function SesstionsTable() {
    const [allSessions, setAllSessions]: any = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const cookies = new Cookies();
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
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/session`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
        }).then(response => response.json()).then(data => {
            // console.log(data)
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

    return (
        <>
        <SessionComboBox  updateComponent={fetchAllSessions}/>
        <div className={"px-5 py-4"}>
        <Table>
            <Table.Head theme={customTheme.head}>
                <Table.HeadCell theme={customTheme.head}>
                    #ID
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Teacher Name
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Student Name
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Date
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Time
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Type
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
             (allSessions && allSessions.length > 0 ? displaydSessions.map((session: any, index: number) => {
                    return(
                        <FetchSessionData key={index} sessionData={session} updateComponent={fetchAllSessions}/>
                    )
                }) : 
                    (<p className="p-3">There is No Sessions</p>)
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