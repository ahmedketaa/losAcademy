'use client';

import { CustomFlowbiteTheme, Label, Modal, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import LoadingButton from '../loadingButton';
import Cookies from 'universal-cookie';

export default function EditPlanModal({openAssignModal, handleCloseModal, planDetails, updateComponent}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        planDetails: any;
        updateComponent: () => void
    }) {
    const planData = planDetails && planDetails
    const modalRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<boolean | any>(planData.active);
    const [title, setTitle] = useState<string>(planData.title);
    const [sessionDuration, setSessionDuration] = useState<number>(planData.sessionDuration);
    const [sessionsCount, setSessionsCount] = useState<number>(planData.sessionsCount);
    const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(planData.sessionsPerWeek);
    const [discount, setDiscount] = useState<number>(planData.discount);
    const [recommended, setRecommended] = useState<boolean>(planData.recommended);
    
    const toast = useRef<Toast>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const cookies = new Cookies()
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

      const updateStudent = () => {
        const updatedData: {[key: string]: any} = {}

        if (title !== planDetails.title && title !== '') {
            updatedData.title = title
        }
        if (sessionDuration !== planDetails.sessionDuration && sessionDuration !== 0) {
            updatedData.sessionDuration = sessionDuration
        }
        if (sessionsCount !== planDetails.sessionsCount && sessionsCount !== 0) {
            updatedData.sessionsCount = sessionsCount
        }
        if (sessionsPerWeek !== planDetails.sessionsPerWeek && sessionsPerWeek !== 0) {
            updatedData.sessionsPerWeek = sessionsPerWeek
        }
        if (discount !== planDetails.discount && discount !== 0) {
            updatedData.discount = discount
        }
        if (recommended !== planDetails.recommended) {
            updatedData.recommended = recommended
        }
        if(status !== planDetails.active) {
            updatedData.active = status
        }
        if (Object.keys(updatedData).length === 0) {
            showError("Nothing to update")
            return
        }
        setIsProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/plan/${planDetails.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
            body: JSON.stringify(updatedData),
        }).then(response => response.json())
        .then((data) => {
          if(data.status === "success") {
            showSuccess("Plan updated successfully")
            updateComponent()
          } else {
            showError("Something went wrong in fields")
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
        <Modal.Header theme={modalTheme.header}>Edit Plan: {planDetails.id}</Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
        <Toast ref={toast} />
        <div>
            <div className="mb-2 block">
                <Label htmlFor="title" value="Plan Title" />
              </div>
              <TextInput id="title" defaultValue={planData.title} onChange={(e) => setTitle(e.target.value)} type='text' />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="sessionDuration" value="Session Duration" />
              </div>
              <TextInput min={0} id="sessionDuration" defaultValue={planData.sessionDuration} onChange={(e: any) => setSessionDuration(parseInt(e.target.value, 10))} type="number" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="sessionsCount" value="Sessions Count" />
              </div>
              <TextInput min={0} id="sessionsCount" defaultValue={planData.sessionsCount} onChange={(e: any) => setSessionsCount(parseInt(e.target.value, 10))} type="number" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="sessionsPerWeek" value="Sessions Per Week" />
              </div>
              <TextInput min={0} id="sessionsPerWeek" defaultValue={planData.sessionsPerWeek} onChange={(e: any) => setSessionsPerWeek(parseInt(e.target.value, 10))} type="number" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="discount" value="Discount" />
              </div>
              <TextInput min={0} id="discount" defaultValue={planData.discount} onChange={(e: any) => setDiscount(parseInt(e.target.value, 10))} type="number" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="recommended" value="Recommended" />
              </div>
              <Select id="recommended" onChange={(e: any) => setRecommended(e.target.value === 'true')} defaultValue={planData.recommended}>
                <option value="">Select Recommended</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
          <div>
            <div className="mb-2 block">
                <Label htmlFor="status" value="Plan Active" />
              </div>
              <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)} >
                <option value={'true'}>Active</option>
                <option value={'false'}>Inactive</option>
              </Select>
            </div>
            <div className="w-full">
            <LoadingButton 
                title='Save Changes'
                isProcessing={isProcessing}
                customStyle='text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors'
                action={updateStudent}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
