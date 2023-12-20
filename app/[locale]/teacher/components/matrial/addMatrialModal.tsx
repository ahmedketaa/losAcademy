'use client';

import { CustomFlowbiteTheme, FileInput, Label, Modal, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { PiStudentBold } from 'react-icons/pi';
import Cookies from 'universal-cookie';

export default function AddMatrialModal({openAssignModal, handleCloseModal, updateComponent}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        updateComponent: () => void
    }) {

    const modalRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [course, setCourse] = useState('');
    const [file, setFile] = useState('');
    const cookie = new Cookies()
    const toast = useRef<Toast>(null);
 

    const showSuccess = () => {
        toast.current?.show({severity:'success', summary: 'Success', detail:'Add Success', life: 3000});
    }
    const showError = () => {
        toast.current?.show({severity:'error', summary: 'Error', detail:'Add failed make sure all fields are correct', life: 4000});
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
          base: "flex items-start justify-between rounded-t px-5 py-2 w-full",
          title: "w-full flex items-center gap-4 text-2xl font-semibold"
        }
      }

      const addBook= (e : any) => {
        e.preventDefault(); 
        const formData = new FormData();
        formData.append('name', name);
        formData.append('age', age);
        formData.append('course', course);
        formData.append('file', file);

        fetch(`${process.env.NEXT_PUBLIC_APIURL}/material`, {
            method: "POST",
            headers: {
                // "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${cookie.get('token')}`
            },
            body: formData,
        }).then(response => response.json()).then(data => {
          console.log(data)
            if(data.status === "success") {
                showSuccess()
                updateComponent()
            } else {
                showError()
            }
        }).catch((err) => {
            console.log(err)
        })
      }
    
  return (
      <Modal ref={modalRef} show={openAssignModal} onClose={handleCloseModal} size={"3xl"}>
         <Modal.Header theme={modalTheme.header}>
            Add Book <PiStudentBold />
          </Modal.Header>
        <Modal.Body>
          <form onSubmit={addBook} >
        <div className="space-y-6">
        <Toast ref={toast} />
        <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Book Name" />
              </div>
              <TextInput id="name" placeholder='Book Name' onChange={(e) => setName(e.target.value)} type='text' />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="age" value="up to Age" />
              </div>
              <TextInput id="age" placeholder='up to Age' onChange={(e) => setAge(e.target.value)} type="text" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="course" value="Course" />
              </div>
              <TextInput id="course" placeholder='Course' onChange={(e) => setCourse(e.target.value)} type="text" />
            </div>
            <div id="fileUpload" className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="file" value="Upload file" />
              </div>
              <FileInput id="file" helperText="Accepted PDF files only" onChange={(e: any) => setFile(e.target.files[0])} />
            </div>
            <div className="w-full">
                <button
                    type="submit"
                    className="text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors"
                >
                  Add
                </button>
            </div>
          </div>
          </form>
        </Modal.Body>
      </Modal>
  )
}
