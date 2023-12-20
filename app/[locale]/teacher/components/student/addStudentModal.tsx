'use client';

import { CustomFlowbiteTheme, Label, Modal, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { PiStudentBold } from 'react-icons/pi';

export default function AddStudentModal({openAssignModal, handleCloseModal, updateComponent}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        updateComponent: () => void
    }) {

    const modalRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [availableFreeSession, setAvailableFreeSession] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [remainSessions, setRemainSessions] = useState('');
    const [gender, setGender] = useState('');

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

      const addStudent = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                availableFreeSession: availableFreeSession,
                remainSessions: remainSessions,
                age: age,
                password: password,
                gender: gender
            }),
        }).then(response => response.json()).then(data => {
            console.log(data)
          if(data.status === "success") {
            showSuccess()
            updateComponent()
          } else {
            showError()
          }
        }).catch(err => {
          console.log(err)
        })
      }

  return (
      <Modal ref={modalRef} show={openAssignModal} onClose={handleCloseModal} size={"3xl"}>
         <Modal.Header theme={modalTheme.header}>
            Add Student <PiStudentBold />
          </Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
        <Toast ref={toast} />
        <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Student Name" />
              </div>
              <TextInput id="name" placeholder='Student Name' onChange={(e) => setName(e.target.value)} type='text' />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Student Email" />
              </div>
              <TextInput id="email" placeholder='Student Email' onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="gender" value="Student Gender" />
              </div>
              <Select id="gender" onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </div>
              {/* <TextInput id="gender" placeholder='Student Email' onChange={(e) => setEmail(e.target.value)} type="email" /> */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" value="Student Phone" />
              </div>
              <TextInput id="phone" placeholder='Student Phone' onChange={(e) => setPhone(e.target.value)} type="tel" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="availableFreeSession" value="Available Free Session" />
              </div>
              <TextInput id="availableFreeSession" type="text" placeholder='Available Free Session' onChange={(e) => setAvailableFreeSession(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput id="password" type="text" placeholder='It is recommended to create complex password ' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="age" value="Age" />
              </div>
              <TextInput id="age" type="text" placeholder='Student Age' onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="remainSessions" value="Remain Sessions" />
              </div>
              <TextInput id="remainSessions" type="text" placeholder='Remain Sessions' onChange={(e) => setRemainSessions(e.target.value)} />
            </div>
            <div className="w-full">
                <button
                    onClick={addStudent}
                    type="submit"
                    className="text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors"
                >
                  Add
                </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
  )
}
