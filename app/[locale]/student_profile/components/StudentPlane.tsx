import React, { useRef, useState } from "react";
import { Button, Card } from "flowbite-react";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import CustomPlanModal from "../../components/PriceModal/customPlanModal";
import { Toast } from "primereact/toast";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
interface StudentPlaneProps {
  title: string;
  price: number;
  features: string[];
  recommended?: boolean;
  planId?: number;
  continueFlag?: boolean;
}

const StudentPlane: React.FC<StudentPlaneProps> = ({
  title,
  price,
  features = [],
  recommended,
  planId,
  continueFlag,
}) => {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const showSuccess = (msg: any) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 7000,
    });
  };
  const showError = (msg: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 7000,
    });
  };
  const url = process.env.NEXT_PUBLIC_APIURL;
  const cookie = new Cookies();
  const token = cookie.get("token");
  const [openCustomPlan, setOpenCustomPlan] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleClose = () => {
    setOpenCustomPlan(false);
  };
  const handleCustomPlan = () => {
    // Ensure that a planId is provided before making the API request
    if (planId === undefined || planId === null) {
      // console.error("Invalid planId");
      return;
    }

    const customPlanData = {
      planId: planId,
      continueFlag: continueFlag,
    };
    setIsProcessing(true);
    fetch(`${url}/subscription/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customPlanData),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsProcessing(false);
        // console.log(data);
        if (data.status == "success") {
          showSuccess('You Will Redirect To "Pay"');
          setTimeout(() => {
            router.push(`${data?.data?.url}`);
          }, 3000);
        } else {
          setIsProcessing(false);
          showError(data.message);
        }
      })
      .catch((error) => {
        // console.error("Error creating custom plan:", error);
      });
  };
  return (
    <>
      <Card className=" rounded-2xl relative hover:shadow-xl hover:-translate-y-5	 transition-all duration-300">
        <span
          style={{ top: "-6%", left: "20%" }}
          className={
            recommended
              ? `px-4 bg-[#27AE60] rounded-full py-2 text-white absolute`
              : "hidden	"
          }
        >
          Recommended
        </span>
        <h5 className="mb-0 pb-0 text-xl font-medium dark:text-gray-400 text-center">
          {title}
        </h5>
        <div className="flex items-baseline text-gray-900 dark:text-white mt-0 pt-0 w-full max-md:text-xs">
          <span
            style={{ top: "15% ", transform: "translateY(-30px)" }}
            className={
              title == "Customize your Plan" ? "my-0 font-medium	" : "hidden"
            }
          >
            Started from:
          </span>

          <span className="text-3xl font-semibold">$</span>
          <span className="text-5xl font-extrabold tracking-tight">
            {price}
          </span>
          <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400 max-sm:text-sm w-content">
            /month
          </span>
        </div>
        <ul className="my-7 space-y-5">
          {features &&
            features.map((feature, index) => (
              <li key={index} className="flex space-x-3">
               <IoCheckmarkCircleSharp  className="text-secondary-color text-lg"/>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  {feature}
                </span>
              </li>
            ))}
        </ul>

        <Button
          isProcessing={isProcessing}
          onClick={
            title === "Customize your Plan"
              ? () => setOpenCustomPlan(true)
              : handleCustomPlan
          }
          pill
          color="purple"
          type="button"
          className=" justify-center rounded-full bg-[--secondary-color] hover:bg-[#625ee6]  py-2.5 text-center text-sm font-medium text-white  m-auto focus:outline-none focus:ring-4"
        >
          {title == "Customize your Plan" ? "Get Started" : "Get this plan"}
        </Button>
        <CustomPlanModal
          targetComponent={1}
          handleCloseModal={handleClose}
          handleOpen={openCustomPlan}
        />
      </Card>
      <Toast ref={toast} />
    </>
  );
};

export default StudentPlane;
