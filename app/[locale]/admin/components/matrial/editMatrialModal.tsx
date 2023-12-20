'use client';

import { CustomFlowbiteTheme, FileInput, Label, Modal, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import Cookies from 'universal-cookie';
import LoadingButton from '../loadingButton';
export default function EditMatrialModal({openAssignModal, handleCloseModal, matrialDetails, updateComponent}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        matrialDetails: any;
        updateComponent: () => void
    }) {

    const modalRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState(matrialDetails.name);
    const [age, setAge] = useState(matrialDetails.age);
    const [course, setCourse] = useState(matrialDetails.course);
    const [status, setStatus] = useState(matrialDetails.status);
    const [isProcessing, setIsProcessing] = useState(false)

    const cookie = new Cookies()

    const toast = useRef<Toast>(null);
    const showSuccess = (msg: string) => {
        toast.current?.show({severity:'success', summary: 'Success', detail: msg, life: 4000});
    }
    const showError = (msg: string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail: msg, life: 4000});
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

      const updateBook = () => {

        const updateData: { [key: string]: any } = {}

        if(name !== matrialDetails.name && name !== '') {
            updateData.name = name
        }
        if(age !== matrialDetails.age && age !== 0) {
            updateData.age = age
        }
        if(course !== matrialDetails.course && course !== '') {
            updateData.course = course
        }
        if(status !== matrialDetails.status) {
            updateData.status = status
        }

        if(Object.keys(updateData).length === 0) {
            showError("Nothing to update")
            return
        }

        setIsProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/material/${matrialDetails.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookie.get("token")}`
            },
            body: JSON.stringify(updateData),
        }).then(response => response.json())
        .then((data) => {
          if(data.status === "success") {
            showSuccess("Updated Successfully")
            updateComponent()
  
          } else {
            showError("Something went wrong make sure all fields are filled correctly")
          }
          setIsProcessing(false)
        }).catch((err) => {
          console.log(err)
          showError(err)
          setIsProcessing(false)
        })
      }
  return (
    <>
      <Modal ref={modalRef} show={openAssignModal} onClose={handleCloseModal} size={"3xl"}>
        <Modal.Header theme={modalTheme.header}>Edit Book: {matrialDetails.id}</Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
        <Toast ref={toast} />
        <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Book Name" />
              </div>
              <TextInput id="name" defaultValue={name} onChange={(e) => setName(e.target.value)} type='text' />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="age" value="up to Age" />
              </div>
              <TextInput id="age" defaultValue={age} onChange={(e) => setAge(e.target.value)} type="text" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="course" value="Course" />
              </div>
              <TextInput id="course" defaultValue={course} onChange={(e) => setCourse(e.target.value)} type="text" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="courseStatus" value="Course Status" />
              </div>
              <Select defaultValue={status} id="courseStatus" onChange={(e) => setStatus(e.target.value)}>
                <option value="new Arrival">new Arrival</option>
                <option value="active">active</option>
                <option value="archived">archived</option>
              </Select>
              {/* <TextInput id="course" defaultValue={course} onChange={(e) => setCourse(e.target.value)} type="text" /> */}
            </div>
            <div className="w-full">
            <LoadingButton 
                title={"Save Changes"}
                action={updateBook}
                customStyle={"text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors"}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
