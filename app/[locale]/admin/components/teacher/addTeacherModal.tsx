"use client";

import {
  CustomFlowbiteTheme,
  Label,
  Modal,
  Select,
} from "flowbite-react";
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { GiTeacher } from "react-icons/gi";
import LoadingButton from "../loadingButton";
import Cookies from "universal-cookie";
import { TeacherSchema } from "@/schemas";
import { useFormik } from "formik";

export default function AddTeacherModal({
  openAssignModal,
  handleCloseModal,
  updateComponent,
}: {
  openAssignModal: boolean;
  handleCloseModal: () => void;
  updateComponent: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const toast = useRef<Toast>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cookies = new Cookies();
  const onSubmit = async (values: any) => {
    const data = (({ sessionCost, ...values }) => { return {...values,sessionCost:parseInt(sessionCost,10)}})(values) // remove b and c
    console.log(data)
    
  
    addTeacher(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // actions.resetForm();
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: '',
        email: '',
        phone: '',
        nationalId: '',
        password: '',
        passwordConfirmation: '',
        role: '',
        sessionCost: '',
      },
      validationSchema: TeacherSchema,
      onSubmit,
    });

  const showSuccess = (msg: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 3000,
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    if (openAssignModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openAssignModal, handleCloseModal]);
  if (!openAssignModal) {
    return null;
  }
  const modalTheme: CustomFlowbiteTheme["modal"] = {
    header: {
      base: "flex items-start justify-between rounded-t px-5 py-2",
      title: "w-full flex items-center gap-4 text-2xl font-semibold",
    },
  };

  const addTeacher = (formData: any) => {
    setIsProcessing(true);

    fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          showSuccess("Teacher added successfully");
          updateComponent();
        } else if(data.status === "fail"){
          showError(data.message);
        } else {
          showError(data.message);
        }
        setIsProcessing(false);
      })
      .catch((err) => {
        console.log(err);
        showError(err);
        setIsProcessing(false);
      });
  };

  return (
    <Modal
      ref={modalRef}
      show={openAssignModal}
      onClose={handleCloseModal}
      size={"3xl"}
    >
      <Modal.Header theme={modalTheme.header}>
        Add Teacher
        <GiTeacher />
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="felx flex-col gap-4 w-full">
            <Toast ref={toast} />
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Teacher Name" />
              </div>
              <div className="flex flex-col items-start gap-2">
              <input
                className={`w-full rounded-lg focus:border-secondary-color  border-2 ${errors.name && touched.name ? "border-danger-color" : "border-gray-300"} `}
                id="name"
                placeholder={"Name"}
                onBlur={handleBlur}
                value={values.name}
                onChange={handleChange}
                type="text"
              />
              {
                errors.name && touched.name ? <span className="text-danger-color">{errors.name}</span> : ""
              }
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Teacher Email" />
              </div>
              <div className="flex flex-col items-start gap-2">
              <input
                className={`w-full rounded-lg focus:border-secondary-color border-2 ${errors.email && touched.email ? "border-danger-color" : "border-gray-300"}`}
                id="email"
                placeholder={"Email"}
                onBlur={handleBlur}
                value={values.email}
                onChange={handleChange}
                type="email"
              />
              {
                errors.email && touched.email ? <span className="text-danger-color">{errors.email}</span> : ""
              }
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" value="Teacher Phone" />
              </div>
              <div className="flex flex-col items-start gap-2">
              <input
                className={`w-full rounded-lg focus:border-secondary-color border-2 ${errors.phone && touched.phone ? "border-danger-color" : "border-gray-300"}`}
                id="phone"
                placeholder={"Phone"}
                onBlur={handleBlur}
                value={values.phone}
                onChange={handleChange}
                type="tel"
              />
              {
                errors.phone && touched.phone ? <span className="text-danger-color">{errors.phone}</span> : ""
              }
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="role" value="Role" />
              </div>
              <select
                className={`w-full rounded-lg focus:border-secondary-color border-2 ${errors.role && touched.role ? "border-danger-color" : "border-gray-300"}`}
                id="role"
                placeholder={"Select Role"}
                value={values.role}
                onBlur={handleBlur}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
              </select>
              {
                errors.role && touched.role ? <span className="text-danger-color">{errors.role}</span> : ""
              }
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nationalId" value="National ID" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <input
                  className={`w-full rounded-lg focus:border-secondary-color border-2 ${errors.nationalId && touched.nationalId ? "border-danger-color" : "border-gray-300"}`}
                  id="nationalId"
                  type="text"
                  defaultValue={values.nationalId}
                  onBlur={handleBlur}
                  placeholder={"National ID is unique"}
                  onChange={handleChange}
                />
                {
                  errors.nationalId && touched.nationalId ? <span className="text-danger-color">{errors.nationalId}</span> : ""
                }
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <div className="flex flex-col items-start gap-2">
              <input
                className={`w-full rounded-lg focus:border-secondary-color border-2 ${errors.password && touched.password ? "border-danger-color" : "border-gray-300"}`}
                id="password"
                type="text"
                onBlur={handleBlur}
                value={values.password}
                placeholder={"It's recommended to use a strong passord"}
                onChange={handleChange}
              />
              {
                errors.password && touched.password ? <span className="text-danger-color">{errors.password}</span> : ""
              }
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="passwordConfirmation"
                  value="Password Confirmation"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
              <input
                className={`w-full rounded-lg focus:border-secondary-color border-2 ${errors.passwordConfirmation && touched.passwordConfirmation ? "border-danger-color" : "border-gray-300"}`}
                id="passwordConfirmation"
                type="text"
                onBlur={handleBlur}
                value={values.passwordConfirmation}
                placeholder={"make sure you enter the same password"}
                onChange={handleChange}
              />
              {
                errors.passwordConfirmation && touched.passwordConfirmation ? <span className="text-danger-color">{errors.passwordConfirmation}</span> : ""
              }
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="sessionCost" value="Session Cost" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <input
                  className={`w-full rounded-lg focus:border-secondary-color border-2 ${errors.sessionCost && touched.sessionCost ? "border-danger-color" : "border-gray-300"}`}
                  id="sessionCost"
                  type="text"
                  onBlur={handleBlur}
                  defaultValue={values.sessionCost}
                  placeholder={"Cost currency is USD / $"}
                  onChange={handleChange}
                />
                {
                  errors.sessionCost && touched.sessionCost ? <span className="text-danger-color">{errors.sessionCost}</span> : ""
                }
              </div>
            </div>
            <div className="w-full mt-5">
              <LoadingButton
                title={"Add Teacher"}
                isProcessing={isProcessing}
                customStyle={
                  "text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors"
                }
              />
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
