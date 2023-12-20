'use client';

import {CustomFlowbiteTheme, Spinner, Table} from 'flowbite-react';
import { useEffect, useState } from 'react';
import CoursesComboBox from './coursesComboBox';
import FetchCoursesData from './fetchCoursesData';
import Cookies from 'universal-cookie';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';


export default function CoursesTable() {
    const [allCourses, setAllCourses]: any = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const cookies = new Cookies()
    const customTheme: CustomFlowbiteTheme['table'] = {
        head: {
            base: "group/head text-xs uppercase text-black-color-one bg-white-color p-[15px] text-center",
            cell: {
                base: "group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-white-color px-6 py-3"
            }
        }
    }

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const getPaginatedData = () => {
        const endIndex = first + rows;
        return allCourses.slice(first, endIndex);
    };
    const displaydCourses = getPaginatedData()

    const fetchAllCourses = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/course`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
        }).then(response => response.json()).then(data => {
            setAllCourses(data.data)
            setIsLoading(false)
        }).catch(err => {
            console.log(err)
            setIsLoading(false)
        })
    };

    useEffect(() => {
        fetchAllCourses()
    }, [])

    return (
        <>
        <CoursesComboBox  updateComponent={fetchAllCourses}/>
        <div className={"px-5 py-4"}>
        <Table>
            <Table.Head theme={customTheme.head}>
                <Table.HeadCell theme={customTheme.head}>
                    #ID
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Title
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Description
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Details
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Created At
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
             (allCourses && allCourses.length > 0 ? displaydCourses.map((teacher: any, index: number) => {
                    return(
                        <FetchCoursesData key={index} coursesData={teacher} updateComponent={fetchAllCourses}/>
                    )
                })
                : <tr>
                    <td className='p-3'>No courses found</td>
                </tr>
                )
            }
            </Table.Body>
        </Table>
        <div className='card mt-4'>
            <Paginator  first={first} rows={rows} totalRecords={allCourses.length} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
        </div>
        </div>
        </>
    )
}