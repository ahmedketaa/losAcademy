"use client";

import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPeople, BsPerson } from "react-icons/bs";
import StudentPlane from "./StudentPlane";
import PrimaryButton from "../../components/PrimaryButton";
import Cookies from "universal-cookie";
interface Plan {
  planId: number;
  title: string;
  price: number;
  features: string[];
}
export default function StudentPlanModal(
  { openPlansModal, setOpenPlansModal }: any,
  continueFlag?: any
) {
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const token = cookie.get("token");

  const [allPlans, setAllPlan]: any = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openContinueWithModal, setopenContinueWithModal] =
    useState<boolean>(false);

  useEffect(() => {
    // Fetch plans from the backend API
    const fetchAllPlans = () => {
      fetch(`${process.env.NEXT_PUBLIC_APIURL}/plan`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const sortedData = data.data.sort((x: any, y: any) => x.id - y.id);
          // console.log(sortedData);
          setAllPlan(sortedData);
          setIsLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          setIsLoading(false);
        });
    };

    fetchAllPlans();
  }, []);

  const activePlans = allPlans.filter((plan: any) => plan.active);
  let numberOfPlans = activePlans.length;

  const getModalSizeClass = () => {
    numberOfPlans++;
    if (numberOfPlans >= 3) {
      return "7xl";
    } else if (numberOfPlans === 2) {
      return "4xl";
    } else {
      return "3xl";
    }
  };
  return (
    <>
      {/* <Button onClick={() => setOpenPlansModal(true)}>Toggle Plans modal</Button> */}
      <Modal
        show={openPlansModal}
        className="block space-y-0 md:flex md:space-y-0 md:space-x-4 "
        size={getModalSizeClass()}
        onClose={() => setOpenPlansModal(false)}
      >
        <Modal.Header className="p-0 m-0 border-0"></Modal.Header>

        <Modal.Body className="">
          <div className=" -translate-y-6">
            <div
              className={`modal_header flex justify-center align-center gap-4 font-bold text-center text-lg flex-col mt-0 pt-0`}
            >
              <h1 className="text-lg m-0 ">
                Choose the plan that works for you
              </h1>
              <div className="flex justify-center">
                <div className="bg-secondary-color text-sm text-white py-2 px-4 w-fit text-center flex items-center gap-1  rounded-3xl">
                  <BsPerson /> 1 Kid
                </div>
              </div>
            </div>
            <div className="max-md:flex-col max-md:mt-5 flex justify-center items-center gap-5 pt-3">
              {activePlans?.map((plan: any) => (
                <StudentPlane
                  key={plan.id}
                  planId={plan.id}
                  title={plan.title}
                  price={plan.price}
                  recommended={plan.recommended}
                  continueFlag={continueFlag}
                  features={[
                    "Private one-to-one",
                    `${plan.sessionDuration} mins`,
                    `${plan.sessionsPerWeek} Classes per week`,
                    `All Sessions Count ${plan.sessionsCount}`,
                    `Professional & Qualified`,
                  ]}
                />
              ))}
              <StudentPlane
                planId={1}
                title="Customize your Plan"
                price={50}
                features={[
                  "Fixed times",
                  "Fixed Prices",
                  "You can choose days",
                  "Private one-to-one",
                  "Professional & Qualified",
                ]}
              />
            </div>
            <div className="buttons flex gap-4 justify-center mt-8 mb-0">
              <PrimaryButton
                onClick={() => setOpenPlansModal(false)}
                text="Discard"
                ourStyle="border-[--secondary-color]  border-2 hover:bg-[--secondary-color] text-red-500 font-medium hover:text-white	py-2 border rounded-3xl text-xl px-10	transition-all	duration-500 "
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
