'use client';

import { Card, CustomFlowbiteTheme } from "flowbite-react";
import { useState } from "react";
import CustomPlanModal from "./PriceModal/customPlanModal";
function CustomPlanCard() {
  
  const plan = {
    id: 1,
    title: "Customize your Plan",
    price: 50,
    // sessionDuration: "30 min",
    // sessionsCount: "10",
    // sessionsPerWeek: "2",
  }


  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    }

  const customTheme: CustomFlowbiteTheme = {
    card: {
      root: {
        children: "flex h-full flex-col justify-center gap-1 p-6 max-sm:gap-0",
      }
    }
  }

  return (
    <Card theme={customTheme.card} className=" h-[auto] w-[300]">
      <h5 className="mb-4 text-xl font-medium text-black-color-two capitalize">
        {plan.title}
      </h5>
      <div className="flex items-baseline text-black-color-two h-[60px] w-[200px]">
        <span className="text-2xl font-semibold tracking-tight">
          Started from {plan.price}$/ per month
        </span>
      </div>
      <ul className="mt-5 mb-3 space-y-5 h-auto">
        <li className="flex space-x-3 rtl:gap-2">
        <i className="bi bi-check-circle-fill text-gray-500"></i>
          <span className="text-base font-normal leading-tight text-black-color-two">
            Choose Session Duration
          </span>
        </li>
        <li className="flex space-x-3 rtl:gap-2">
        <i className="bi bi-check-circle-fill text-gray-500"></i>
          <span className="text-base font-normal leading-tight text-black-color-two">
            Choose Session Count
          </span>
        </li>
        <li className="flex space-x-3 rtl:gap-2">
        <i className="bi bi-check-circle-fill text-gray-500"></i>
          <span className="text-base font-normal leading-tight text-black-color-two">
            Choose Session Per Week
          </span>
        </li>
      </ul>
      <button
        className="bg-secondary-color hover:bg-secondary-hover text-sm font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-4 px-12 rounded-full w-50 mx-auto max-md:py-2.5 max-md:px-10 max-md:w-45"
        onClick={handleOpenModal}
      >
        Get Plan
      </button>
      <CustomPlanModal
            handleOpen={openModal} 
            handleCloseModal={handleCloseModal}
            targetComponent={plan.id}
        />
    </Card>
  )
}

export default CustomPlanCard