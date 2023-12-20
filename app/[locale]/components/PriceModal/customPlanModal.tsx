'use client';

import {CustomFlowbiteTheme, Datepicker, Modal} from 'flowbite-react';
import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Label, Radio } from 'flowbite-react';
import Cookies from 'universal-cookie';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

export default function CustomPlanModal({handleOpen, handleCloseModal, targetComponent}: {
    
    handleOpen: boolean; handleCloseModal: () => void, targetComponent: number }) {
    
    const modalRef = useRef<HTMLDivElement>(null);
    
    const [sessionsDuration, setSessionDuraion] = useState<any>('');
    const [sessionsCount, setSessionCount] = useState<any>('');
    const [sessionsPerWeek, setSessionPerWeek] = useState<any>('');
    const cookies = new Cookies();
    const [isDisabled, setIsDisabled] = useState(false)
    const [resData, setResData] = useState<any>({})
    const toast = useRef<Toast>(null);
    const showSuccess = (msg: string) => {
        toast.current?.show({severity:'success', summary: 'Success', detail:msg, life: 3000});
    }
    const showError = (msg: string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail: msg, life: 4000});
      }

  const customeTheme: CustomFlowbiteTheme['modal'] = {
    body: {
      base: "p-4 flex-1 overflow-auto"
    },
    header: {
      base: "flex items-start justify-between rounded-t border-none",
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    if (handleOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleOpen, handleCloseModal]);

    if (!handleOpen) {
        return null;
    }

    const submitPlan = () => {
        console.log({
            sessionDuration: parseInt(sessionsDuration),
            sessionsCount: parseInt(sessionsCount),
            sessionsPerWeek: parseInt(sessionsPerWeek)
        })
        if(!sessionsDuration || !sessionsCount || !sessionsPerWeek) {
            showError("Please fill all the fields")
            return
        }
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/subscription/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
            body: JSON.stringify({
                sessionDuration: parseInt(sessionsDuration),
                sessionsCount: parseInt(sessionsCount),
                sessionsPerWeek: parseInt(sessionsPerWeek)
            })
        }).then(response => response.json()).then(data => {
            console.log(data)
            if(data.status === "success") {
                showSuccess(data.message)
                setResData(data)
                setIsDisabled(true)
            } else if(data.status === "fail" && data.message === "Invalid token. Please log in again!") {
                showError("You Can't Create Plan Until Login")
            } else {
                showError(data.message)
            }
        }).catch(err => {
            console.log(err)
            showError(err)
        })
    }


  return (
    <>
      <Modal ref={modalRef} show={handleOpen} onClose={handleCloseModal} size={"5xl"} id={"ourModal"}>
        <Modal.Header theme={customeTheme.header}></Modal.Header>
        <Modal.Body theme={customeTheme.body}>
        <Toast ref={toast} />
        {isDisabled ? 
            (<>
                <div className='flex flex-col justify-center items-center gap-4'>
                    <h3 className='font-bold'>Your plan has been created</h3>
                    <ul>
                        <li>Plan ID: {resData.data?.id}</li>
                        <li>Plan Price: <span className='font-bold'>{resData.data?.amount_total / 100}$</span></li>
                    </ul>
                    <Link
                        href={resData?.data?.url}
                        target='_blank'
                        className="flex items-center justify-center gap-2 smallBtn ms-auto font-semibold hover:bg-secondary-hover cursor-pointer mb-4"
                    >Go to Buy</Link>
                </div>
            </>) : (<>
            <div className={"flex flex-col justify-center items-center gap-8"}>
                <h2 className='text-3xl text-black-color-one'>Create Your Plan</h2>
                <fieldset
                    className="flex max-w-md flex-col gap-4"
                    id="radio"
                >
                    <legend className="mb-4">
                        Choose Session Duration
                    </legend>
                    <div className={"flex flex-row gap-4"}>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="15-min"
                        >
                            <Radio
                                id="15-min"
                                name="radio"
                                defaultValue="15"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionDuraion(e.target.value)
                                }}
                            />
                            <span className="ml-2">15 min</span>
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="20-min"
                        >
                            <Radio
                                id="20-min"
                                name="radio"
                                value="20"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionDuraion(e.target.value)
                                }}
                            />
                            <span className="ml-2">20 min</span>
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="25-min"
                        >
                            <Radio
                                id="25-min"
                                name="radio"
                                value="25"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionDuraion(e.target.value)
                                }}
                            />
                            <span className="ml-2">25 min</span>
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="30-min"
                        >
                            <Radio
                                id="30-min"
                                name="radio"
                                value="30"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionDuraion(e.target.value)
                                }}
                            />
                            <span className="ml-2">30 min</span>
                        </Label>
                    </div>
                    </div>
                </fieldset>
                <fieldset
                    className="flex max-w-md flex-col gap-4"
                    id="radio2"
                >
                    <legend className="mb-4">
                        Choose Sessions Count
                    </legend>
                    <div className={"flex flex-row gap-4"}>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="8-sessions"
                        >
                            <Radio
                                id="8-sessions"
                                name="radio2"
                                value="8"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionCount(e.target.value)
                                }}
                            />
                            <span className="ml-2">8</span>
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="10-sessions"
                        >
                            <Radio
                                id="10-sessions"
                                name="radio2"
                                value="10"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionCount(e.target.value)
                                }}
                            />
                            <span className="ml-2">10</span>
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="12-sessions"
                        >
                            <Radio
                                id="12-sessions"
                                name="radio2"
                                value="12"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionCount(e.target.value)
                                }}
                            />
                            <span className="ml-2">12</span>
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="14-sessions"
                        >
                            <Radio
                                id="14-sessions"
                                name="radio2"
                                value="14"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionCount(e.target.value)
                                }}
                            />
                            <span className="ml-2">14</span>
                        </Label>
                    </div>
                    </div>
                </fieldset>
                <fieldset
                    className="flex max-w-md flex-col gap-4"
                    id="radio3"
                >
                    <legend className="mb-4">
                        Choose Session Per Week
                    </legend>
                    <div className={"flex flex-row gap-4"}>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="2-per"
                        >
                            <Radio
                                id="2-per"
                                name="radio3"
                                value="2"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionPerWeek(e.target.value)
                                }}
                            />
                            <span className="ml-2">2</span>
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="3-per"
                        >
                            <Radio
                                id="3-per"
                                name="radio3"
                                value="3"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionPerWeek(e.target.value)
                                }}
                            />
                            <span className="ml-2">3</span>
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="4-per"
                        >
                            <Radio
                                id="4-per"
                                name="radio3"
                                value="4"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionPerWeek(e.target.value)
                                }}
                            />
                            <span className="ml-2">4</span>
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label
                            className="cursor-pointer"
                            htmlFor="5-per"
                        >
                            <Radio
                                id="5-per"
                                name="radio3"
                                value="5"
                                className="h-4 w-4"
                                onClick={(e: any) => {
                                    setSessionPerWeek(e.target.value)
                                }}
                            />
                            <span className="ml-2">5</span>
                        </Label>
                    </div>
                    </div>
                </fieldset>
                <button className={
                    "bg-secondary-color hover:bg-secondary-hover text-sm font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] w-52 h-12 my-auto px-16 rounded-full disabled:bg-green-300"
                }
                onClick={submitPlan}
                disabled={isDisabled}
                >Confirm</button>
            </div>
        </>)}

        </Modal.Body>
      </Modal>
    </>
  )
}
