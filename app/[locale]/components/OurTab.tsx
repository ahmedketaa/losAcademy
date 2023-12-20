
"use client"

import { CustomFlowbiteTheme, Tabs } from "flowbite-react"
import PlanCard from "./PlanCard"
import { useTranslations } from "next-intl";
import { BsPeople, BsPerson } from "react-icons/bs";
import { useEffect, useState } from "react";
import CustomPlanCard from "./customPlanCard";

export default function OurTab() {
    const [plans, setPlans] = useState([])


    const customeTheme: CustomFlowbiteTheme = {
        tab: {
            tablist: {
                base: "flex justify-center items-center m-auto w-auto bg-secondary-color rounded-full px-12 py-2",
                tabitem: {
                  styles: {
                    pills: {
                      active: {
                        on: "rounded-full bg-white focus:ring-0 text-black px-8 py-2",
                        off: "rounded-full px-8 py-2 focus:ring-0 bg-secondary-color hover:bg-white hover:text-black text-white transition-colors",
                      }
                    }
                  }
                }
              },
        },
    }
    
    const getAllPlans = () => {
      fetch(`${process.env.NEXT_PUBLIC_APIURL}/plan`)
      .then(response => response.json())
      .then((data) => {
        console.log(data)
        if(data.status === 'success') {
          setPlans(data.data)
        }
      }).catch((err) => {
        console.log(err)
      })
    }

    useEffect(() => {
        getAllPlans();
    }, [])



    return (
    <>
      <Tabs.Group
      theme={customeTheme.tab}
      aria-label="Pills"
      style="pills"
    >
      <Tabs.Item
        active
        title="1 kid"
        icon={BsPerson }
      >
        <div className="py-8 px-8 flex justify-center items-center gap-10 flex-row-reverse flex-wrap">
        {plans.map((plan: any, index: number) => {
          if(plan.active === true) {
            return (
              <PlanCard planData={plan} key={index}/>
            )
          }
        })}
        <CustomPlanCard />
        </div>
      </Tabs.Item>
    </Tabs.Group>
    </>
  )
}
