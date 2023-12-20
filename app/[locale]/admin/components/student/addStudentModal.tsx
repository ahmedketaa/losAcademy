"use client";

import {
  CustomFlowbiteTheme,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { PiStudentBold } from "react-icons/pi";
import LoadingButton from "../loadingButton";
import Cookies from "universal-cookie";
import { useFormik } from "formik";
import {signupSchema} from "@/schemas";
export default function AddStudentModal({
  openAssignModal,
  handleCloseModal,
  updateComponent,
}: {
  openAssignModal: boolean;
  handleCloseModal: () => void;
  updateComponent: () => void;
}) {
  const onSubmit = async (values: any, actions: any) => {
    addStudent(values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();

  }
  const modalRef = useRef<HTMLDivElement>(null);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      age: 0,
      password: "",
      passwordConfirmation: "",
      gender: "",
    },
    validationSchema: signupSchema,
    onSubmit,
  });


  const [isProcessing, setIsProcessing] = useState(false);
  const cookies = new Cookies();
  const toast = useRef<Toast>(null);
  const showSuccess = () => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Add Success",
      life: 3000,
    });
  };
  const showError = () => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Add failed make sure all fields are correct",
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
      base: "flex items-start justify-between rounded-t px-5 py-2 w-full",
      title: "w-full flex items-center gap-4 text-2xl font-semibold",
    },
  };

  const addStudent = (formData: any) => {

    setIsProcessing(true);
    
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user`, {
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
          showSuccess();
          const timeToClose = setTimeout(() => {
            handleCloseModal();
          }, 2000);
          updateComponent();
          return () => clearTimeout(timeToClose)
        } else {
          showError();
        }
        setIsProcessing(false);
      })
      .catch((err) => {
        console.log(err);
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
        Add Student <PiStudentBold />
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <Toast ref={toast} />
          <form onSubmit={handleSubmit} className="felx flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Student Name" />
              </div>
              <TextInput
                id="name"
                placeholder="Student Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
              />
              {errors.name && touched.name ? <span className="text-danger-color">{errors.name}</span> : ""}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Student Email" />
              </div>
              <TextInput
                id="email"
                placeholder="Student Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                type="email"
              />
                {errors.email && touched.email ? <span className="text-danger-color">{errors.email}</span> : ""}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="gender" value="Student Gender" />
              </div>
              <Select
                id="gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
              {errors.gender && touched.gender ? <span className="text-danger-color">{errors.gender}</span> : ""}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" value="Student Phone" />
              </div>
              <TextInput
                id="phone"
                placeholder="Student Phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                type="tel"
              />
              {errors.phone && touched.phone ? <span className="text-danger-color">{errors.phone}</span> : ""}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                type="text"
                value={values.password}
                placeholder="It is recommended to create complex password "
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && touched.password ? <span className="text-danger-color">{errors.password}</span> : ""}
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="passwordConfirmation"
                  value="Password Confirmation"
                />
              </div>
              <TextInput
                id="passwordConfirmation"
                type="text"
                value={values.passwordConfirmation}
                placeholder="Password Confirmation "
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.passwordConfirmation && touched.passwordConfirmation ? <span className="text-danger-color">{errors.passwordConfirmation}</span> : ""}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="age" value="Age" />
              </div>
              <TextInput
                id="age"
                type="number"
                value={values.age}
                placeholder="Student Age"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.age && touched.age ? <span className="text-danger-color">{errors.age}</span> : ""}
            </div>
            <div className="w-full">
              <LoadingButton
                title={"Add Student"}
                customStyle={
                  "text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors mt-5"
                }
                isProcessing={isProcessing}
              />
              </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
