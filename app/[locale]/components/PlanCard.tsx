'use client';

import { Card, CustomFlowbiteTheme } from "flowbite-react";
import PrimaryButton from './PrimaryButton'
import { useState, useRef } from "react";
import PriceModal from "./PriceModal/PriceModal";
import Cookies from 'universal-cookie';
import { Toast } from 'primereact/toast';
import {useRouter} from "next/navigation"
function PlanCard({planData}: any) {
  
  const plan = planData && planData
  const cookeis = new Cookies()
  const toast = useRef<Toast>(null);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter()
  const showSuccess = () => {
    toast.current?.show({severity:'success', summary: 'Success', detail:'Add Success You will Redirect To Payment Page', life: 4000});
  }
  const showError = (msg: string) => {
      toast.current?.show({severity:'error', summary: 'Error', detail: msg, life: 4000});
    }
  const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };


  const customTheme: CustomFlowbiteTheme = {
    card: {
      root: {
        children: "flex h-full flex-col justify-center gap-1 p-6 max-sm:gap-0",
      }
    }
  }

  const choosePlan = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/subscription/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${cookeis.get('token')}`,
      },
      body: JSON.stringify({
        planId: plan.id
      }),
    })
    .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status=='success') {
              showSuccess()
              const timer = setTimeout(() => {
                router.push(data.data.url)
              }, 4000)
              return () => clearTimeout(timer)
          } else if (data.status === 'fail' && data.message === "Invalid token. Please log in again!") {
            showError("You Can't Choose This Plan Please Log In First")
          } else {
            showError(data.message)
          }
      })
      .catch((error) => {
        console.error('Error creating custom plan:', error);
      });
  
  }

  return (
    <Card theme={customTheme.card} className=" h-[auto] w-[300] relative">
      <Toast ref={toast} />
      {plan.recommended && <span className="recommended flagwave">Recommended</span>}
      <h5 className="mb-4 text-xl font-medium text-black-color-two capitalize">
        {plan.title}
      </h5>
      <div className="flex items-baseline text-black-color-two h-[60px] w-[200px]">
        <span className="text-2xl font-semibold tracking-tight">
          {plan.price}$/ per month
        </span>
      </div>
      <ul className="mt-5 mb-3 space-y-5 h-auto">
        <li className="flex space-x-3 rtl:gap-2">
        <i className="bi bi-check-circle-fill text-gray-500"></i>
          <span className="text-base font-normal leading-tight text-black-color-two">
            Session Duration: {plan.sessionDuration}
          </span>
        </li>
        <li className="flex space-x-3 rtl:gap-2">
        <i className="bi bi-check-circle-fill text-gray-500"></i>
          <span className="text-base font-normal leading-tight text-black-color-two">
            Session Count: {plan.sessionsCount}
          </span>
        </li>
        <li className="flex space-x-3 rtl:gap-2">
        <i className="bi bi-check-circle-fill text-gray-500"></i>
          <span className="text-base font-normal leading-tight text-black-color-two">
            Session Per Week: {plan.sessionsPerWeek}
          </span>
        </li>
      </ul>
      <button
        className="bg-secondary-color hover:bg-secondary-hover text-sm font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-4 px-12 rounded-full w-50 mx-auto max-md:py-2.5 max-md:px-10 max-md:w-45"
        onClick={choosePlan}
      >
        Get Plan
      </button>
    </Card>
  )
}

export default PlanCard