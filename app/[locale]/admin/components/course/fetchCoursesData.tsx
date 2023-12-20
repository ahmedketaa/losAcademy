"use client"
import {CustomFlowbiteTheme, Table} from 'flowbite-react';
import {BsTrash} from "react-icons/bs";
import { BiSolidEditAlt } from 'react-icons/bi';
import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import EditCoursesModal from './editCoursesModal';
import Cookies from 'universal-cookie';
import { convertDateTimeZone } from '@/utilities';

export default function FetchCoursesData({coursesData, updateComponent} : {coursesData: any; updateComponent: () => void}) {
    const [handleModal, setHandleModal] = useState(false)
    const course = coursesData
    const convertTime = convertDateTimeZone
    // Toast reference
    const [visible, setVisible] = useState(false);
    const toast = useRef<Toast>(null);
    const toastB = useRef<Toast>(null);
    const toastC = useRef<Toast>(null);
    const cookies = new Cookies();
    const showError = (msg: string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail: msg, life: 3000});
    }

    const openModal = () => {
        setHandleModal(true)
    }

    const closeModal = () => {
        setHandleModal(false)
    }

     // Delete Confirmation
     const clear = () => {
        toastC.current?.clear();
        setVisible(false);
    };

    // Confirm Delete Student
    const confirm = () => {
        if (!visible) {
            setVisible(true);
            toastC.current?.clear();
            toastC.current?.show({
                severity: 'warn',
                sticky: true,
                content: (
                    <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                    <div className="flex flex-col">
                    <div className="text-center">
                            <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                            <div className="font-bold text-xl my-3">Are you sure you want to delete?</div>
                        </div>
                        <div className="flex gap-4 items-center justify-center">
                            <button 
                                className="bg-danger-color hover:bg-red-400 transition-colors text-white px-5 py-2 rounded-xl" 
                                onClick={() => {
                                                confirmDelete()
                                                clear()
                                            }}
                            >Yes</button>
                            <button 
                                className='bg-primary-color hover:bg-blue-900 transition-colors text-white px-5 py-2 rounded-xl' 
                                onClick={() => clear()}
                            >No</button>
                        </div>
                       </div>
                    </div>
                )
            });
        }
    };


    const confirmDelete = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/course/${course.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
        }).then(response => response.json())
        .then((data) => {
            showError(data.message)
            updateComponent()
        }).catch(err => {
            console.log(err)
            showError(err)
        })
    }

  return (

    <Table.Row key={course.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
        
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {course.id}
            </Table.Cell>
            <Table.Cell>
                {course.title}
            </Table.Cell>
            <Table.Cell>
                {course.description}
            </Table.Cell>
            <Table.Cell>
                {course.details.length > 100 ? course.details.substring(0, 100) + "..." : course.details}
            </Table.Cell>
            <Table.Cell>
                {convertTime(course.createdAt, "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone, "YYYY-MM-DD h:mm A")}
            </Table.Cell>
            <Table.Cell>
                <div className="flex flex-row justify-between gap-4">
                    <Toast ref={toast} />
                    <BiSolidEditAlt className={"text-2xl cursor-pointer"} style={{color: "green"}} onClick={openModal}/>
                    <BsTrash className={"text-2xl cursor-pointer"} style={{color: "red"}} onClick={confirm}/>
                    <EditCoursesModal openAssignModal={handleModal} handleCloseModal={closeModal} courseDetails={course} updateComponent={updateComponent} />
                    <Toast ref={toastB} />
                    <Toast ref={toastC} position="bottom-center" />
                </div>
            </Table.Cell>
        </Table.Row>
  )
}
