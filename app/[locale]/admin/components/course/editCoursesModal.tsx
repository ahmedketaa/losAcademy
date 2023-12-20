'use client';

import { CustomFlowbiteTheme, Label, Modal, Select, TextInput, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import LoadingButton from '../loadingButton';
import Cookies from 'universal-cookie';
export default function EditCoursesModal({openAssignModal, handleCloseModal, courseDetails, updateComponent}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        courseDetails: any;
        updateComponent: () => void
    }) {

    const modalRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState(courseDetails.title);
    const [description, setDescription] = useState(courseDetails.description);
    const [details, setDetails] = useState(courseDetails.details);
    const [isProcessing, setIsProcessing] = useState(false)
    const cookies = new Cookies();
    const toast = useRef<Toast>(null);
    const showSuccess = (msg: string) => {
        toast.current?.show({severity:'success', summary: 'Success', detail: msg, life: 3000});
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

      const updateCourse = () => {
        const updateData: { [key: string]: any } = {}

        if(title !== courseDetails.title && title !== '') {
            updateData.title = title
        }
        if(description !== courseDetails.description && description !== '') {
            updateData.description = description
        }
        if(details !== courseDetails.details && details !== '') {
            updateData.details = details
        }

        if(Object.keys(updateData).length === 0) {
          showError("Nothing to update")  
          return
        }
        
        setIsProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/course/${courseDetails.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
            body: JSON.stringify({
              title,
              description,
              details
            }),
        }).then(response => response.json())
        .then((data) => {
            console.log(data)
            if(data.status === "success") {
              showSuccess("Updated Successfully")
              const timer = setTimeout(() => {
                updateComponent()
                clearTimeout(timer)
              }, 4000)
            } else {
              showError("Something went wrong make sure all fields are filled correctly")
          }
          setIsProcessing(false)
        }).catch((err) => {
          console.log(err)
          showError(err)
        })
      }
  return (
    <>
      <Modal ref={modalRef} show={openAssignModal} onClose={handleCloseModal} size={"3xl"}>
        <Modal.Header theme={modalTheme.header}>Edit Course: {courseDetails.title}</Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
        <Toast ref={toast} />
        <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Course Title" />
              </div>
              <TextInput id="title" defaultValue={title} onChange={(e) => setTitle(e.target.value)} type='text' />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Course Description" />
              </div>
              <TextInput id="description" defaultValue={description} onChange={(e) => setDescription(e.target.value)} type="text" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="details" value="Course Details" />
              </div>
              <Textarea id="details" defaultValue={details} cols={50} onChange={(e) => setDetails(e.target.value)} />
              {/* <TextInput id="description" defaultValue={description} onChange={(e) => setDescription(e.target.value)} type="text" /> */}
            </div>
            <div className="w-full">
            <LoadingButton 
                title='Save Changes'
                isProcessing={isProcessing}
                customStyle='text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors'
                action={updateCourse}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
