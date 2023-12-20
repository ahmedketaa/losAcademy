'use client';

import { Accordion, Label, Modal, TextInput } from 'flowbite-react';
import Image from 'next/image';
import { CustomFlowbiteTheme } from 'flowbite-react';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import LoadingButton from './loadingButton';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
export default function AdminProfile({openAssignModal, handleCloseModal, user, updateComponent}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        user: string | any;
        updateComponent: () => void;
    }) {

      const modalRef = useRef<HTMLDivElement>(null);
      const cookies = new Cookies();
      const userDetails = user && user
      const router = useRouter();
      const [name, setName] = useState('')
      const [phone, setPhone] = useState('')
      const [password, setPassword] = useState('')
      const [isProcessing, setIsProcessing] = useState(false)
      const toast = useRef<Toast>(null);


      const showSuccess = (message: string) => {
        toast.current?.show({severity:'success', summary: 'Success', detail: message, life: 5000 });
      }

      const showError = (message: string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail: message , life: 5000 });
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
          base: "flex items-start justify-between rounded-t p-5"
        }
      }

      const updateInfo = () => {

        // Create an object to store updated fields
        const updatedFields: { [key: string]: any } = {};

        // Compare and assign updated fields to the object
        if (name !== userDetails.name && name !== '') {
          updatedFields.name = name;
        }
        if (phone !== userDetails.phone && phone !== '') {
          updatedFields.phone = phone;
        }
        if (password !== '') {
          updatedFields.password = password;
        }

        // Check if any fields have been updated
        if (Object.keys(updatedFields).length === 0) {
          setIsProcessing(false);

          // For example, show a message or handle it as needed
          showError('No updates made');
          return;
        }

        // console.log(JSON.stringify(updatedFields))
        setIsProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher/me`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
            body: JSON.stringify(updatedFields)
        })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if(data.status === 'success') {
              showSuccess(data.message)
              router.refresh();
              updateComponent()
            }
          setIsProcessing(false)
        })
        .catch(err => {
          console.log(err)
          setIsProcessing(false)
          showError(err)
        })
      }

  return (
    <>
      <Modal ref={modalRef} show={openAssignModal} onClose={handleCloseModal} size={"lg"}>
        <Modal.Header theme={modalTheme.header}>Teacher Profile</Modal.Header>
        <Toast ref={toast} />
        <Modal.Body>
          <div className="flex flex-col items-center pb-10">
              <Image
                  alt="Avatar image"
                  height="60"
                  src="/vectors/feedback2.svg"
                  width="60"
                  className="mb-3 rounded-full shadow-lg"
                  loading={"lazy"}
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{userDetails.name}</h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">{userDetails.role}</span>
              <div className="mt-4 flex space-x-3 lg:mt-6 w-full bg-white-color p-5 rounded-xl">
                  <span>Name: {userDetails.name}</span>
              </div>
              <div className="mt-4 flex space-x-3 lg:mt-6 w-full bg-white-color p-5 rounded-xl">
                  <span>Email: {userDetails.email}</span>
              </div>
              <div className="mt-4 flex space-x-3 lg:mt-6 w-full bg-white-color p-5 rounded-xl">
                  <span>Phone: {userDetails.phone}</span>
              </div>
              <div className="mt-4 flex space-x-3 lg:mt-6 w-full bg-white-color p-5 rounded-xl">
                  <span>Session Cost: {userDetails.sessionCost}$</span>
              </div>
          </div>
          <div>
          <Accordion collapseAll>
            <Accordion.Panel>
              <Accordion.Title>Edit Your Details</Accordion.Title>
              <Accordion.Content>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Teacher Name" />
                </div>
                <TextInput id="name" defaultValue={userDetails.name} onChange={(e) => setName(e.target.value)} type='text' />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="phone" value="Teacher Phone" />
                </div>
                <TextInput id="phone" defaultValue={userDetails.phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Update Your Password" />
                </div>
                <TextInput id="password" type="text" placeholder='update password' onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="w-full">
              <LoadingButton
                  title={"Save Changes"} 
                  isProcessing={isProcessing}
                  customStyle={"text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors mt-3"}
                  action={updateInfo}
                />
              </div>
              </Accordion.Content>
              </Accordion.Panel>
              </Accordion>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
