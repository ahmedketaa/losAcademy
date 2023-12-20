"use client"

import {Table} from 'flowbite-react';
import {LiaPhoneSolid} from "react-icons/lia";
import {GoMail} from "react-icons/go";
import {BsTrash} from "react-icons/bs";
import { BiSolidEditAlt } from 'react-icons/bi';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import EditPlanModal from './editPlanModal';
import Cookies from 'universal-cookie';



export default function FetchPlanData({planData, updateComponent} : {planData: any; updateComponent: () => void}) {
    const [handleModal, setHandleModal] = useState(false)
    const plan = planData
    const cookies = new Cookies()
    // Toast reference
    const [visible, setVisible] = useState(false);
    const toast = useRef<Toast>(null);
    const toastB = useRef<Toast>(null);
    const toastC = useRef<Toast>(null);
    const showError = (msg: string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail: msg, life: 4000});
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

    // Confirm Delete plan

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

        fetch(`${process.env.NEXT_PUBLIC_APIURL}/plan/${plan.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
        }).then(response => response.json()).then(data => {
            if(data.status === 'success') {
                updateComponent()
                showError('Deleted Success')
            } else if (data.status === 'fail') {
                showError('Deleted Failed Try Again later or contact support')
            }
        }).catch(err => {
            console.log(err)
        })
    }

  return (

    <Table.Row key={plan.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {plan.id}
            </Table.Cell>
            <Table.Cell>
                {plan.title}
            </Table.Cell>
            <Table.Cell>
                {plan.sessionDuration}
            </Table.Cell>
            <Table.Cell>
                {plan.sessionsCount}
            </Table.Cell>
            <Table.Cell>
                {plan.sessionsPerWeek}
            </Table.Cell>
            <Table.Cell>
                {plan.recommended === true ? ( <p className="bg-success-color text-white px-2 py-1 rounded-full font-semibold">Yes</p>) : (<p className="bg-danger-color text-white px-2 py-1 rounded-full font-semibold">No</p>) }
            </Table.Cell>
            <Table.Cell>
                {plan.discount}
            </Table.Cell>
            <Table.Cell>
            {plan.active === true ? ( <p className="bg-success-color text-white px-4 py-1 rounded-full font-semibold">Active</p>) : (<p className="bg-danger-color text-white px-4 py-1 rounded-full font-semibold">Inactive</p>) }
            </Table.Cell>
            <Table.Cell>
                <div className="flex flex-row justify-between gap-4">
                    <Toast ref={toast} />
                    <BiSolidEditAlt className={"text-2xl cursor-pointer"} style={{color: "green"}} onClick={openModal}/>
                    <BsTrash className={"text-2xl cursor-pointer"} style={{color: "red"}} onClick={confirm}/>
                    <EditPlanModal openAssignModal={handleModal} handleCloseModal={closeModal} planDetails={plan} updateComponent={updateComponent} />
                    <Toast ref={toastB} />
                    <Toast ref={toastC} position="bottom-center" />
                </div>
            </Table.Cell>
        </Table.Row>
  )
}
