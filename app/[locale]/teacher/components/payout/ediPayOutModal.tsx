'use client';

import { CustomFlowbiteTheme, Label, Modal, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import LoadingButton from '@/app/[locale]/admin/components/loadingButton';
import Cookies from 'universal-cookie';

export default function EditRequestPayOut({openAssignModal, handleCloseModal, updateComponent, payoutID}: 
    {
        openAssignModal: boolean;
        handleCloseModal: () => void;
        updateComponent: () => void;
        payoutID: string | any;
    }) {

    const payOutid = payoutID && payoutID
    const modalRef = useRef<HTMLDivElement>(null);
    const [amount, setAmount] = useState(payOutid.amount);
    const toast = useRef<Toast>(null);
    const cookies = new Cookies()
    const [isProcessing, setIsProcessing] = useState(false)

    const showSuccess = () => {
        toast.current?.show({severity:'success', summary: 'Success', detail:'Updated Success', life: 3000});
    }
    const showError = () => {
        toast.current?.show({severity:'error', summary: 'Error', detail:'Updated failed make sure all fields are correct', life: 4000});
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

      const requestPayout = () => {
        setIsProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/payout/${payOutid.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
            body: JSON.stringify({
                amount: amount
            }),
        }).then(response => response.json()).then(data => {
          if(data.status === "success") {
            showSuccess()
            updateComponent()
          } else {
            showError()
          }
          setIsProcessing(false)
        }).catch(err => {
          console.log(err)
        })
      }
  return (
    <>
      <Modal ref={modalRef} show={openAssignModal} onClose={handleCloseModal} size={"3xl"}>
        <Modal.Header theme={modalTheme.header}>Requset Payout</Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
        <Toast ref={toast} />
            <div>
              <div className="mb-2 block">
                <Label htmlFor="amount" value="Amount" />
              </div>
              <TextInput id="amount" defaultValue={amount} onChange={(e) => setAmount(e.target.value)} type='text' />
            </div>
            <div className="w-full">
                <LoadingButton
                    isProcessing={isProcessing}
                    title="Request Payout"
                    customStyle="text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors"
                    action={requestPayout}
                />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
