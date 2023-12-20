"use client";

import { Radio } from "flowbite-react";
import PrimaryButton from "../PrimaryButton";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { signupSchema } from "@/schemas";
import { useFormik } from "formik";
import LoadingButton from "../../admin/components/loadingButton";
import { useRouter } from "next/navigation";
export default function signupTap() {
  const toast = useRef<Toast>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const router = useRouter();
  const onSubmit = async (values: any, actions: any) => {
    const data = (({ age, ...values }) => {
      return { ...values, age: parseInt(age, 10) };
    })(values);

    signupSubmit(data);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        phone: "",
        age: "",
        password: "",
        passwordConfirmation: "",
        gender: "",
      },
      validationSchema: signupSchema,
      onSubmit,
    });

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

  const url = process.env.NEXT_PUBLIC_APIURL;
  const signupSubmit = (formData: any) => {
    setIsProcessing(true);
    fetch(`${url}/user/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsProcessing(false);
        if (data.status === "success") {
          showSuccess("Registration Successfully");
          showSuccess(data.message);
          console.log(data);
          localStorage.setItem(
            "registrationSuccessMessage",
            "Registration successful. Please log in."
          );

          setTimeout(() => {
            router.refresh();
          }, 3000);
        } else if (
          data.status === "fail" &&
          data.message === "Duplicate field Please use another value!"
        ) {
          showError("Email Already Exist Please Login");
        } else {
          showError(data.message);
        }
        setIsProcessing(false);
      })
      .catch((error) => {
        console.log(error);
        showError("An error occurred");
      });
  };

  useEffect(() => {
    // Check if we are on the client side before using window
    if (typeof window !== "undefined") {
      const storedMessage = localStorage.getItem("registrationSuccessMessage");
      if (storedMessage) {
        showSuccess(storedMessage);

        // Clear the stored message after displaying it
        localStorage.removeItem("registrationSuccessMessage");
      }
    }
  }, []);

  return (
    <div
      className=" flex justify-center items-center gap-3 flex-col flex-wrap "
      style={{ minHeight: "300px", width: "100%" }}
    >
      <Toast ref={toast} />
      <h3 className="font-bold	 text-xl	"> Welcome to LOS Accademy ! </h3>
      <div className="flex flex-col gap-4" style={{ width: "100%" }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[450px]">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 justify-center items-center w-full">
              <input
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${
                  errors.name && touched.name
                    ? "border-[--danger-color]"
                    : "border-[--secondary-color]"
                } gradiant-color rounded-3xl w-full border-2`}
                type="text"
                placeholder="Full Name"
              />
              {errors.name && touched.name ? (
                <span className="text-danger-color capitalize">
                  {errors.name}
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="flex flex-col gap-1 justify-center items-center w-full">
              <input
                name="age"
                placeholder="Age"
                value={values.age}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${
                  errors.age && touched.age
                    ? "border-[--danger-color]"
                    : "border-[--secondary-color]"
                } gradiant-color rounded-3xl w-full appearance-none border-2`}
                type="number"
              />
              {errors.age && touched.age ? (
                <span className="text-danger-color capitalize">
                  {errors.age}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 justify-center items-center">
            <input
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              type="tel"
              className={`${
                errors.phone && touched.phone
                  ? "border-[--danger-color]"
                  : "border-[--secondary-color]"
              } gradiant-color rounded-3xl w-full appearance-none border-2`}
              placeholder="Phone number"
            />

            {errors.phone && touched.phone ? (
              <span className="text-danger-color capitalize">
                {errors.phone}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col gap-1 justify-center items-center">
            <input
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${
                errors.email && touched.email
                  ? "border-[--danger-color]"
                  : "border-[--secondary-color]"
              } gradiant-color rounded-3xl w-full border-2`}
              type="email"
              placeholder="Email address"
            />
            {errors.email && touched.email ? (
              <span className="text-danger-color capitalize">
                {errors.email}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col gap-1 justify-center items-center">
            <input
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${
                errors.password && touched.password
                  ? "border-[--danger-color]"
                  : "border-[--secondary-color]"
              } gradiant-color rounded-3xl w-full border-2`}
              type="password"
              placeholder="Password"
            />
            {errors.password && touched.password ? (
              <span className="text-danger-color capitalize">
                {errors.password}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col gap-1 justify-center items-center">
            <input
              name="passwordConfirmation"
              value={values.passwordConfirmation}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${
                errors.passwordConfirmation && touched.passwordConfirmation
                  ? "border-[--danger-color]"
                  : "border-[--secondary-color]"
              } gradiant-color rounded-3xl w-full border-2`}
              type="password"
              placeholder="Confirm Password"
            />
            {errors.passwordConfirmation && touched.passwordConfirmation ? (
              <span className="text-danger-color capitalize">
                {errors.passwordConfirmation}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col gap-1 justify-center items-center">
            <div className="flex justify-between items-center  px-10 flex-wrap gap-9 py-3">
              <div className="flex items-center  ">
                <Radio
                  className={`border focus-within:border-none focus-within:bg-[--secondary-color] border-[--secondary-color] rounded-full`}
                  id="male"
                  name={"gender"}
                  value={"male"}
                  onChange={() =>
                    handleChange({ target: { name: "gender", value: "male" } })
                  }
                  onBlur={handleBlur}
                  checked={values.gender === "male"}
                />
                <label htmlFor="male" className="ml-2">
                  Male
                </label>
              </div>
              <div className="flex items-center">
                <Radio
                  className="border focus-within:border-none focus-within:bg-[--secondary-color] border-[--secondary-color]   rounded-full"
                  id="female"
                  name={"gender"}
                  value={"female"}
                  onChange={() =>
                    handleChange({
                      target: { name: "gender", value: "female" },
                    })
                  }
                  onBlur={handleBlur}
                  checked={values.gender === "female"}
                />
                <label htmlFor="female" className="ml-2 ">
                  Female
                </label>
              </div>
            </div>

            {errors.gender && touched.gender ? (
              <span className="text-danger-color text-center">
                {errors.gender}
              </span>
            ) : (
              ""
            )}
          </div>

          <LoadingButton
            title={"Register"}
            // action={handleFormSubmit}
            customStyle={
              "text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors"
            }
            isProcessing={isProcessing}
          />
        </form>
        <span className="text-center">Or Register with </span>
        <div className="flex gap-3">
          <PrimaryButton
            text="Google"
            ourStyle="border-blue-700 rounded-3xl w-full	py-2	border-2 hover:bg-blue-700 hover:text-white transition-all	duration-500	"
          />
          <PrimaryButton
            text="Facebook"
            ourStyle="border-blue-700 rounded-3xl w-full	py-2	border-2 hover:bg-blue-700 hover:text-white transition-all	duration-500	"
          />
        </div>
      </div>
    </div>
  );
}
