'use client';

import {CustomFlowbiteTheme, Spinner, Table} from 'flowbite-react';
import { useEffect, useState } from 'react';
import PlanComboBox from './planComboBox';
import FetchPlanData from './fetchPlanData';
import Cookies from 'universal-cookie';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';


export default function PlanTable() {
    const [allPlans, setAllPlan]: any = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const cookies = new Cookies();
    const customTheme: CustomFlowbiteTheme['table'] = {
        head: {
            base: "group/head text-xs uppercase text-black-color-one bg-white-color p-[15px] text-center",
            cell: {
                base: "group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-white-color px-6 py-3"
            }
        }
    }
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(10);
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const getPaginatedData = () => {
        const endIndex = first + rows;
        return allPlans.slice(first, endIndex);
    };
    const displaydPlans = getPaginatedData()
    const fetchAllPlans = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/plan`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
        }).then(response => response.json()).then(data => {
            const sortedData = data.data.sort((x: any, y: any) => x.id - y.id)
            console.log(sortedData)
            setAllPlan(sortedData)
            setIsLoading(false)
        }).catch(err => {
            console.log(err)
            setIsLoading(false)
        })
    };

    useEffect(() => {
        fetchAllPlans()
    }, [])

    const updateComponent = () => {
        fetchAllPlans()
    }

    return (
        <>
        <PlanComboBox  updateComponent={fetchAllPlans}/>
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
                    Session Duration
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Sessions Count
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Sessions Per Week
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Recommended
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Discount
                </Table.HeadCell>
                <Table.HeadCell theme={customTheme.head}>
                    Status
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
             (allPlans && allPlans.length > 0 ? displaydPlans.map((plan: any, index: number) => {
                    return(
                        <FetchPlanData key={index} planData={plan} updateComponent={updateComponent}/>
                    )
                }):
                    (<tr>
                        <td className='p-3'>There is no plans</td>
                    </tr>)
                )
            }
            </Table.Body>
        </Table>
        <div className='card mt-4'>
            <Paginator  first={first} rows={rows} totalRecords={allPlans.length} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
        </div>
        </div>
        </>
    )
}