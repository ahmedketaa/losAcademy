'use client';

import {CustomFlowbiteTheme, Spinner, Table} from 'flowbite-react';
import { useEffect, useState } from 'react';
import FetchTeacherData from '../teacher/fetchTeacherData';
import TeacherComboBox from './teacherComboBox';
import Cookies from 'universal-cookie';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';


export default function TeacherTable() {
    const [allTeachers, setAllTeachers]: any = useState([])
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
        return allTeachers.slice(first, endIndex);
    };
    const displaydTeachers = getPaginatedData()


    const customTheme: CustomFlowbiteTheme['table'] = {
        head: {
            base: "group/head text-xs uppercase text-black-color-one bg-white-color p-[15px] text-center",
            cell: {
                base: "group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-white-color px-6 py-3"
            }
        }
    }

    const fetchAllTechers = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
        }).then(response => response.json()).then(data => {
            console.log(data)
            setAllTeachers(data.data)
            setIsLoading(false)
        }).catch(err => {
            console.log(err)
            setIsLoading(false)
        })
    };

    useEffect(() => {
        fetchAllTechers()
    }, [])

    return (
        <>
        <TeacherComboBox  updateComponent={fetchAllTechers}/>
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
                    Role
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Sessions Completed
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Session Cost
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Contact
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    options
                </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                {isLoading ? (
                    <Table.Row>
                    <td><Spinner size="xl" /></td>
                    </Table.Row>
                 ) :
             (allTeachers && allTeachers.length > 0 ? displaydTeachers.map((teacher: any, index: number) => {
                    return(
                        <FetchTeacherData key={index} teacherData={teacher} updateComponent={fetchAllTechers}/>
                    )
                }): 
                    (
                        (
                        <tr><td className="p-5">There is No Teachers</td></tr>
                        )
                    )
                )
            }
            </Table.Body>
        </Table>
        <div className='card mt-4'>
            <Paginator  first={first} rows={rows} totalRecords={allTeachers.length} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
        </div>
        </div>
        </>
    )
}