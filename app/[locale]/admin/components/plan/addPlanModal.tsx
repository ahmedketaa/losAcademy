'use client';

import { CustomFlowbiteTheme, Label, Modal, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { PiStudentBold } from 'react-icons/pi';
import Cookies from 'universal-cookie';
import LoadingButton from '../loadingButton';
import { PlanDetails } from '@/types';

export default function AddPlanModal({openAssignModal, handleCloseModal, updateComponent}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        updateComponent: () => void
    }) {

    const modalRef = useRef<HTMLDivElement>(null);

    const [title, setTitle] = useState<string>('');
    const [sessionDuration, setSessionDuration] = useState<number>(0);
    const [sessionsCount, setSessionsCount] = useState<number>(0);
    const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [recommended, setRecommended] = useState<boolean>(false);

    const cookies = new Cookies();
    const toast = useRef<Toast>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const showSuccess = (msg: string) => {
        toast.current?.show({severity:'success', summary: 'Success', detail:msg, life: 3000});
    }
    const showError = (msg: string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail:msg, life: 4000});
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

      const addPlan = () => {
        if(title === '') {
            showError("Title can't be blank")
            return
        }
        if(sessionDuration === 0) {
            showError("Session duration can't be blank")
            return
        }
        if(sessionsCount === 0) {
            showError("Session count can't be blank")
            return
        }
        if(sessionsPerWeek === 0) {
            showError("Sessions per week can't be blank")
            return
        }
        const planData: PlanDetails = {
            title: title,
            sessionDuration: sessionDuration,
            sessionsCount: sessionsCount,
            sessionsPerWeek: sessionsPerWeek,
            discount: discount,
            recommended: recommended,
            type: 'standard'
        }
        setIsProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/plan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
            body: JSON.stringify(planData),
        }).then(response => response.json()).then(data => {
            console.log(data)
          if(data.status === "success") {
            showSuccess("Plan added successfully")
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
      <Modal ref={modalRef} show={openAssignModal} onClose={handleCloseModal} size={"3xl"}>
         <Modal.Header theme={modalTheme.header}>
            Add Plan <PiStudentBold />
          </Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
        <Toast ref={toast} />
        <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Plan Title" />
              </div>
              <TextInput id="title" placeholder='Plan Title' onChange={(e) => setTitle(e.target.value)} type='text' />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="sessionDuration" value="Session Duration" />
              </div>
              <TextInput min={0} id="sessionDuration" placeholder='Session Duration' onChange={(e: any) => setSessionDuration(parseInt(e.target.value, 10))} type="number" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="sessionsCount" value="Sessions Count" />
              </div>
              <TextInput min={0} id="sessionsCount" placeholder='Session Count' onChange={(e: any) => setSessionsCount(parseInt(e.target.value, 10))} type="number" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="sessionsPerWeek" value="Sessions Per Week" />
              </div>
              <TextInput min={0} id="sessionsPerWeek" placeholder='Sessions Per Week' onChange={(e: any) => setSessionsPerWeek(parseInt(e.target.value, 10))} type="number" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="discount" value="Discount" />
              </div>
              <TextInput min={0} id="discount" placeholder='Add Discount ?' onChange={(e: any) => setDiscount(parseInt(e.target.value, 10))} type="number" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="recommended" value="Recommended" />
              </div>
              <Select id="recommended" onChange={(e: any) => setRecommended(e.target.value === 'true')}>
                <option value="">Select Recommended</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
            <div className="w-full">
              <LoadingButton 
                title='Add Plan'
                isProcessing={isProcessing}
                customStyle='text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors'
                action={addPlan}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
  )
}
