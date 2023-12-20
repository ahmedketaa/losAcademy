"use client";

import { CustomFlowbiteTheme, Tabs } from "flowbite-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import "./login.module.css";
import "./login.css";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
import ForgetPassword from "../student_profile/components/forgetPassword";
import SignupTap from "../components/loginComponents/signupTap";
import LoginTap from "../components/loginComponents/loginTap";

function page() {
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);

  const buttonTheme: CustomFlowbiteTheme["button"] = {
    color: {
      purple: "bg-secondary-color hover:bg-secondary-hover",
    },
  };

  const showSuccess = (msg: any) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 5000,
    });
  };
  const showError = (msg: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 5000,
    });
  };

  const [activeTab, setActiveTab] = useState<boolean>(false);

  useEffect(() => {
    // Check if we are on the client side before using window
    setIsLoading(true);
    if (typeof window !== "undefined") {
      const storedMessage = localStorage.getItem("registrationSuccessMessage");
      if (storedMessage) {
        showSuccess(storedMessage);

        // Clear the stored message after displaying it
        localStorage.removeItem("registrationSuccessMessage");
      }
    }
  }, []);

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
              },
            },
          },
        },
      },
    },
  };

  return (
    <section className="mt-8">
      <div className="flex items-center mt-40 justify-evenly gap-20 sm:flex-row flex-col-reverse ">
        <Toast ref={toast} />
        <div
          className={`image transition-all duration-500 opacity-${
            isLoading ? "5" : "0"
          } duration-500 transition-opacity`}
        >
          <Image
            src={`${activeTab ? "/vectors/login.svg" : "/vectors/signup.svg"}`}
            className="transition-all duration-500 w-auto h-auto"
            width={400}
            height={300}
            alt={"login image"}
            loading="eager"
            priority={true}
          />
        </div>
        <div className="login_contnet sm:w-auto mx-3" style={{ width: "" }}>
          <Tabs.Group
            theme={customeTheme.tab}
            aria-label="Pills"
            style="pills"
            onActiveTabChange={() => setActiveTab(!activeTab)}
          >
            <Tabs.Item active title="Login">
              <LoginTap />
            </Tabs.Item>
            <Tabs.Item title="Signup" onClick={() => setActiveTab(false)}>
              <SignupTap />
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
    </section>
  );
}

export default page;
