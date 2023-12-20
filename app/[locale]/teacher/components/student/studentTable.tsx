'use client';

import {CustomFlowbiteTheme, Spinner, Table} from 'flowbite-react';
import { useEffect, useState } from 'react';
import FetchStudentData from './fetchStudentData';
import StudentComboBox from './studentComboBox';
import Cookies from 'universal-cookie';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';


export default function StudentTable() {
    const [allStudents, setAllStudents]: any = useState([])
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
        return allStudents.slice(first, endIndex);
    };
    const displaydStudents = getPaginatedData()

    const customTheme: CustomFlowbiteTheme['table'] = {
        head: {
            base: "group/head text-xs uppercase text-black-color-one bg-white-color p-[15px] text-center",
            cell: {
                base: "group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-white-color px-6 py-3"
            }
        }
    }

    const fetchAllStudents = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher/myStudents`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`,
            },
        }).then(response => response.json()).then(data => {
            console.log(data)
            setAllStudents(data.data)
            setIsLoading(false)
        }).catch(err => {
            console.log(err)
            setIsLoading(false)
        })
    };

    useEffect(() => {
        fetchAllStudents()
    }, [])

    return (
        <>
        <StudentComboBox  updateComponent={fetchAllStudents}/>
        <div className={"px-5 py-4"}>
        <Table>
            <Table.Head theme={customTheme.head}>
                <Table.HeadCell theme={customTheme.head}>
                    #ID
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Name
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Gender
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Age
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Available Free Session
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Remain Sessions
                </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                {isLoading ? (
                    <Table.Row>
                    <td><Spinner size="xl" /></td>
                    </Table.Row>
                 ) :
             (allStudents && allStudents.length > 0 ? displaydStudents.map((student: any, index: number) => {
                    return(
                        <FetchStudentData key={index} studentData={student} updateComponent={fetchAllStudents}/>
                    )
                })
                : <tr><td className="p-5">There is No Students</td></tr>
                )
            }
            </Table.Body>
        </Table>
        <div className="card mt-4">
            <Paginator  first={first} rows={rows} totalRecords={allStudents.length} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
        </div>
        </div>
        </>
    )
}