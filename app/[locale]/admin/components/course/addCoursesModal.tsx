'use client';

import { CustomFlowbiteTheme, Label, Modal, Select, TextInput, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { GiTeacher } from 'react-icons/gi';
import LoadingButton from '../loadingButton';
import Cookies from 'universal-cookie';
export default function AddCourseModal({openAssignModal, handleCloseModal, updateComponent}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        updateComponent: () => void
    }) {

    const modalRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [details, setDetails] = useState('');
    const [isProcessing, setIsProcessing] = useState(false)
    const toast = useRef<Toast>(null);
    const cookies = new Cookies();


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
          base: "flex items-start justify-between rounded-t px-5 py-2",
          title: "w-full flex items-center gap-4 text-2xl font-semibold"
        }
      }

      const addCourse = () => {
        setIsProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/course`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
            body: JSON.stringify({
                title,
                description,
                details
            }),
        }).then(response => response.json()).then(data => {
            console.log(data)
          if(data.status === "success") {
            showSuccess(data.message)
            updateComponent()
            const timerToClose = setTimeout(() => {
              handleCloseModal()
              clearTimeout(timerToClose)
            }, 3000)
          } else {
            showError(data.message)
          }
          setIsProcessing(false)
        }).catch(err => {
          console.log(err)
          showError(err)
        })
      }

  return (
      <Modal ref={modalRef} show={openAssignModal} onClose={handleCloseModal} size={"3xl"}>
         <Modal.Header theme={modalTheme.header}>
            Add Course
            <GiTeacher />
          </Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
        <Toast ref={toast} />
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Course Title" />
              </div>
              <TextInput id="title" placeholder={"Title"} onChange={(e) => setTitle(e.target.value)} type='text' />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Course Description" />
              </div>
              <TextInput id="description" placeholder={"Description"} onChange={(e) => setDescription(e.target.value)} type="text" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="details" value="Course Details" />
              </div>
              <Textarea id="details" placeholder={"Details"} className='h-[150px]' onChange={(e) => setDetails(e.target.value)} />
            </div>
            <div className="w-full">
            <LoadingButton 
                title='Add Course'
                isProcessing={isProcessing}
                customStyle='text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors'
                action={addCourse}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
  )
}
