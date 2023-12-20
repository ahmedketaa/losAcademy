'use client';

import { CustomFlowbiteTheme, Label, Modal, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import LoadingButton from '../loadingButton';
import Cookies from 'universal-cookie';

export default function EditStudentModal({openAssignModal, handleCloseModal, studentDetails, updateComponent}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        studentDetails: any;
        updateComponent: () => void
    }) {

    const modalRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState(studentDetails.name);
    const [email, setEmail] = useState(studentDetails.email);
    const [phone, setPhone] = useState(studentDetails.phone);
    const [availableFreeSession, setAvailableFreeSession] = useState(studentDetails.role);
    const [age, setAge] = useState(studentDetails.sessionCost);
    const [password, setPassword] = useState('');
    const [remainSessions, setRemainSessions] = useState(studentDetails.remainSessions);
    const [gender, setGender] = useState(studentDetails.gender);
    const [verified, setVerified] = useState(studentDetails.verified);
    const [isProcessing, setIsProcessing] = useState(false)
    const cookies = new Cookies();



    const toast = useRef<Toast>(null);
    const showSuccess = (msg: string) => {
        toast.current?.show({severity:'success', summary: 'Success', detail:msg, life: 4000});
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

      const updateStudent = () => {

        const updatedData:{[key: string]: any } = {}

        if (name !== studentDetails.name && name !== '') {
          updatedData.name = name
        }
        if (email !== studentDetails.email && email !== '') {
          updatedData.email = email
        }
        if (phone !== studentDetails.phone && phone !== '') {
          updatedData.phone = phone
        }
        if (availableFreeSession !== studentDetails.role && availableFreeSession !== '') {
          updatedData.role = availableFreeSession
        }
        if (age !== studentDetails.sessionCost && age !== 0) {
          updatedData.sessionCost = age
        }
        if (password !== studentDetails.password && password !== '') {
          updatedData.password = password
        }
        if (remainSessions !== studentDetails.remainSessions && remainSessions !== 0) {
          updatedData.remainSessions = remainSessions
        }
        if (gender !== studentDetails.gender && gender !== '') {
          updatedData.gender = gender
        }
        if (verified !== studentDetails.verified && verified !== false) {
          updatedData.verified = verified
        }

        if(Object.keys(updatedData).length === 0) {
            showError("No data to update")
            return
        }

        console.log(JSON.stringify(updatedData))
        setIsProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/${studentDetails.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
            body: JSON.stringify(updatedData),
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
            showError("Update Failed make sure all fields are filled correctly")
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
        <Modal.Header theme={modalTheme.header}>Edit Student: {studentDetails.name}</Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
        <Toast ref={toast} />
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Student Name" />
              </div>
              <TextInput id="name" defaultValue={studentDetails.name} onChange={(e) => setName(e.target.value)} type='text' />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Student Email" />
              </div>
              <TextInput id="email" defaultValue={studentDetails.email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="gender" value="Student Gender" />
              </div>
              <Select id="gender" defaultValue={studentDetails.gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" value="Student Phone" />
              </div>
              <TextInput id="phone" defaultValue={studentDetails.phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="availableFreeSession" value="Available Free Session" />
              </div>
              <TextInput id="availableFreeSession" type="text" defaultValue={studentDetails.availableFreeSession} onChange={(e) => setAvailableFreeSession(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Update Student Password" />
              </div>
              <TextInput id="password" type="text" placeholder='update password' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="age" value="Age" />
              </div>
              <TextInput id="age" type="text" defaultValue={studentDetails.age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="remainSessions" value="Remain Sessions" />
              </div>
              <TextInput id="remainSessions" type="text" defaultValue={studentDetails.remainSessions} onChange={(e) => setRemainSessions(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="verified" value="Verified" />
              </div>
              <Select
                id="verified"
                defaultValue={studentDetails.verified}
                onChange={(e) => setVerified(e.target.value)}
              >
                <option value="">Verified</option>
                <option value="true">True</option>
                <option value="false">false</option>
              </Select>
            </div>
            <div className="w-full">
            <LoadingButton 
                title={"Save Changes"}
                action={updateStudent}
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
