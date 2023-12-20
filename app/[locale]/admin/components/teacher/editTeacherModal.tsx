'use client';

import { CustomFlowbiteTheme, Label, Modal, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import LoadingButton from '../loadingButton';
import Cookies from 'universal-cookie';

export default function EditTeacherModal({openAssignModal, handleCloseModal, teacherDetails, updateComponent}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        teacherDetails: any;
        updateComponent: () => void
    }) {

    const modalRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState(teacherDetails.name);
    const [email, setEmail] = useState(teacherDetails.email);
    const [phone, setPhone] = useState(teacherDetails.phone);
    const [role, setRole] = useState(teacherDetails.role);
    const [cost, setCost] = useState(teacherDetails.sessionCost);
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false)
    const cookies = new Cookies()
    
    const toast = useRef<Toast>(null);
    const showSuccess = (msg:string) => {
        toast.current?.show({severity:'success', summary: 'Success', detail: msg, life: 3000});
    }
    const showError = (msg:string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail: msg , life: 4000});
      }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | any) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            handleCloseModal();
          }
        };

        if (openAssignModal) {
          document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openAssignModal, handleCloseModal]);
      if (!openAssignModal) {
        return null;
      } 
      const modalTheme: CustomFlowbiteTheme['modal'] = {
        header: {
          base: "flex items-start justify-between rounded-t px-5 py-2"
        }
      }

      const updateTeacher = () => {
        const updatedData: { [key: string]: any } = {} 

        if (name !== teacherDetails.name && name !== '') {
            updatedData.name = name
        }
        if (email !== teacherDetails.email && email !== '') {
            updatedData.email = email
        }
        if (phone !== teacherDetails.phone && phone !== '') {
            updatedData.phone = phone
        }
        if (role !== teacherDetails.role && role !== '') {
            updatedData.role = role
        }
        if (password !== '') {
            updatedData.password = password
        }
        if (cost !== teacherDetails.sessionCost && cost !== '' && cost > 0) {
            updatedData.sessionCost = cost
        }

        if (Object.keys(updatedData).length === 0) {
            showSuccess('No changes made')
            return
        }
        setIsProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher/${teacherDetails.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
            body: JSON.stringify(updatedData),
        }).then(response => response.json()).then(data => {
          if(data.status === "success") {
            showSuccess(data.message)
            updateComponent()
          } else {
            showError(data.message)
          }
          setIsProcessing(false)
        }).catch(err => {
          console.log(err)
          setIsProcessing(false)
          showError(err)
        })
      }
  return (
    <>
      <Modal ref={modalRef} show={openAssignModal} onClose={handleCloseModal} size={"3xl"}>
        <Modal.Header theme={modalTheme.header}>Edit Teacher: {teacherDetails.name}</Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
        <Toast ref={toast} />
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Teacher Name" />
              </div>
              <TextInput id="name" defaultValue={teacherDetails.name} onChange={(e) => setName(e.target.value)} type='text' />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Teacher Email" />
              </div>
              <TextInput id="email" defaultValue={teacherDetails.email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" value="Teacher Phone" />
              </div>
              <TextInput id="phone" defaultValue={teacherDetails.phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="role" value="Role" />
              </div>
              <Select id="role" defaultValue={teacherDetails.role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Update Teacher Password" />
              </div>
              <TextInput id="password" type="text" placeholder='update password' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cost" value="Cost" />
              </div>
              <TextInput id="cost" type="text" defaultValue={teacherDetails.sessionCost} onChange={(e) => setCost(e.target.value)} />
            </div>
            <div className="w-full">
            <LoadingButton
                title={"Save Changes"} 
                isProcessing={isProcessing}
                customStyle={"text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors"}
                action={updateTeacher}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
