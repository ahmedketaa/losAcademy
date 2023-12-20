"use client";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/primereact.min.css";

import {
  Button,
  CustomFlowbiteTheme,
  Label,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import Cookies from "universal-cookie";

export default function AdminLoginForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [checked, setChecked] = useState<boolean | any>(false);
  const url = process.env.NEXT_PUBLIC_APIURL;

  const cookies = new Cookies();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);
  const showSuccess = () => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Login Success",
      life: 2000,
    });
  };
  const showError = (msg: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 4000,
    });
  };

  const buttonTheme: CustomFlowbiteTheme["button"] = {
    color: {
      purple: "bg-secondary-color hover:bg-secondary-hover",
    },
  };
  const inputTheme: CustomFlowbiteTheme["textInput"] = {
    field: {
      input: {
        colors: {
          gray: "bg-gray-50 border-secondary-color text-gray-900 focus:primary-color focus:primary-color border-2 rounded-full",
        },
        withAddon: {
          off: "rounded-full",
        },
      },
    },
  };

  function handleLogin(event: any) {
    event.preventDefault();
    setIsProcessing(true);
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    fetch(`${url}/teacher/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          // if the role is admin or teacher
          setIsLoading(true);
          if (data.data.role === "admin") {
            cookies.set("token", data.token, {
              secure: true,
              maxAge: checked ? 2592000000 : 3600,
            });
            cookies.set("id", data.data.id, {
              secure: true,
              maxAge: checked ? 2592000000 : 3600,
            });
            showSuccess();
            router.replace("/admin");
          } else if (data.data.role === "teacher") {
            cookies.set("token", data.token, {
              secure: true,
              maxAge: checked ? 2592000000 : 3600,
            });
            cookies.set("id", data.data.id, {
              secure: true,
              maxAge: checked ? 2592000000 : 3600,
            });
            showSuccess();
            router.replace("/teacher");
          } else {
            showError("Login Failed you are not an admin");
          }
        } else {
          showError(
            "Email or password is incorrect, please make sure you entered the correct email and password"
          );
        }
        setIsProcessing(false);
      })
      .catch((err) => {
        err
          ? showError(
              "Something went wrong. Please try again later. or Contact Support Team"
            )
          : "";
      });
  }

  return (
    <form
      className="flex max-w-md flex-col gap-4 max-md:m-auto"
      onSubmit={handleLogin}
    >
      <Toast ref={toast} position={"top-center"} />
      {isLoading && (
        <Spinner
          color={"purple"}
          style={{
            width: "2rem",
            height: "2rem",
            zIndex: "1000",
            position: "fixed",
            top: "5%",
            left: "1%",
          }}
        />
      )}
      <h5 className="text-center font-semibold">Welcome back !</h5>
      <div>
        <div className="mb-2 block">
          <label htmlFor="login-email"></label>
          {/* <Label
                htmlFor="email"
            /> */}
        </div>
        <TextInput
          theme={inputTheme}
          id="login-email"
          placeholder="Email address"
          required
          type="email"
          name="email"
          className="rounded-full"
          autoFocus={true}
          autoComplete="on"
        />
      </div>
      <div>
        <div className="mb-2 block">
          <label htmlFor="login-password"></label>
        </div>
        <TextInput
          theme={inputTheme}
          id="login-password"
          required
          type="password"
          name="password"
          placeholder="Password"
          className="rounded-full"
          autoComplete="off"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex justify-content-center border-[1px] border-gray-300 rounded-[25%] p-[1px]">
          <Checkbox
            onChange={(e) => setChecked(e.checked)}
            checked={checked}
            id="remember"
          ></Checkbox>
        </div>
        <label htmlFor="remember">Keep me login</label>
      </div>
      <Button
        type="submit"
        theme={buttonTheme}
        color="purple"
        isProcessing={isProcessing}
        pill
        size="lg"
        className={
          "transition-colors rounded-full font-semibold px-5 py-2 text-white"
        }
      >
        Login
      </Button>
    </form>
  );
}
