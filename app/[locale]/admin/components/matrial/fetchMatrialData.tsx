"use client"

import {Table} from 'flowbite-react';
import {BsTrash} from "react-icons/bs";
import { BiSolidEditAlt } from 'react-icons/bi';
import { GrDocumentDownload } from 'react-icons/gr';
import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import EditMatrialModal from './editMatrialModal';
import Link from 'next/link';
import Cookies from 'universal-cookie';
import { convertDateTimeZone } from '@/utilities';



export default function FetchMatrialData({matrialData, updateComponent} : {matrialData: any; updateComponent: () => void}) {
    const [handleModal, setHandleModal] = useState(false)
    const cookie = new Cookies()
    const matrial = matrialData
    // Toast reference
    const [visible, setVisible] = useState(false);
    const toast = useRef<Toast>(null);
    const toastB = useRef<Toast>(null);
    const toastC = useRef<Toast>(null);
    const convertTime = convertDateTimeZone
    const showError = () => {
        toast.current?.show({severity:'error', summary: 'Error', detail:'Deleted Success', life: 3000});
    }
    

    // Modal Handling
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

    // Confirm Delete matrial

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

        fetch(`${process.env.NEXT_PUBLIC_APIURL}/material/${matrial.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookie.get("token")}`
            },
        }).then(response => response.json()).then(data => {
            // console.log(data)
            updateComponent()
            showError()
        }).catch(err => {
            console.log(err)
        })
    }

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
                            <div className='bg-danger-color p-2 rounded-full text-white font-semibold capitalize'>{matrial.status}</div> 
                        : matrial.status === 'active' ?
                            <div className='bg-success-color p-2 rounded-full text-white font-semibold capitalize'>{matrial.status}</div> 
                        : 
                            <div className='bg-warning-color p-2 rounded-full text-white font-semibold capitalize'>{matrial.status}</div>
                        } 
            </Table.Cell>
            <Table.Cell>
                <div className='flex items-center justify-center'>
                    <Link href={matrial.b2Link} download={matrial.b2Link} target="_blank" rel="noopener noreferrer" >
                        <GrDocumentDownload className="text-2xl cursor-pointer"/>
                    </Link>
                </div>
            </Table.Cell>
            <Table.Cell>
                <div className="flex flex-row justify-between gap-4">
                    <Toast ref={toast} />
                    <BiSolidEditAlt className={"text-2xl cursor-pointer"} style={{color: "green"}} onClick={openModal}/>
                    <BsTrash className={"text-2xl cursor-pointer"} style={{color: "red"}} onClick={confirm}/>
                    <EditMatrialModal openAssignModal={handleModal} handleCloseModal={closeModal} matrialDetails={matrial} updateComponent={updateComponent} />
                    <Toast ref={toastB} />
                    <Toast ref={toastC} position="bottom-center" />
                </div>
            </Table.Cell>
        </Table.Row>
  )
}
