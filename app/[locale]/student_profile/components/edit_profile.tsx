"use client";

import { Button, Modal } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMobileAlt,
  FaBirthdayCake,
} from "react-icons/fa";
import PrimaryButton from "../../components/PrimaryButton";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import ChangePassword from "./ChangePassword";

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  id: number;
  // ... add other properties as needed
  age?: number; // make age optional if it may not be present in the API response
}
export default function EditProfile({
  setMyInfo,
  openEditeProfileModal,
  setOpenEditeProfileModal,
}: any) {
  const [showChangePassword, setShowChangePassword] = useState(false); // New state
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const token = cookie.get("token");
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(); // Use UserInfo type
  const [successStatus, setSuccessStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  const showToast = (
    severity: "success" | "info" | "warn" | "error",
    summary: string,
    detail: string
  ) => {
    setToastMessage(null);
    setToastMessage(`${summary}: ${detail}`);
    toast.current?.show({ severity, summary, detail });
  };


  useEffect(() => {
    fetch(`${url}/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Correct the header key to 'Authorization'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.data);
        setMyInfo(data?.data);
        setUserInfo(data.data);
        // Set the retrieved Seeions in the state
      })
      .catch((error) => {
        console.error("Error fetching my profile:", error);
      });
  }, []);
  
  const [editedInfo, setEditedInfo] = useState({ ...(userInfo || {}) });

  // update user data
  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setEditedInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleSaveChanges = (e: any) => {
    e.preventDefault(); // Corrected typo: preventDefault
    // Make PATCH request with editedInfo
    fetch(`${url}user/${userInfo?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        showToast(
          "success",
          "Update Successful",
          "Profile has been updated successfully."
        );
        // console.log("Update successful:", data);

        setSuccessStatus(true);
        setOpenEditeProfileModal(false); // Close the modal after a successful update
      })
      .catch((error) => {
        showToast(
          "success",
          "Update Successful",
          "Profile has been updated successfully."
        );
        console.error("Error updating profile:", error);
      });
  };
 

  return (
    <>
      <Toast ref={toast} />

      {/* <Button onClick={() => setOpenEditeProfileModal(true)}>Toggle Profiel modal</Button> */}
      <Modal
        show={openEditeProfileModal}
        className="block space-y-0 md:flex md:space-y-0 md:space-x-4 "
        size={"2xl"}
        onClose={() => setOpenEditeProfileModal(false)}
      >
        <Modal.Header className="p-0 m-0 border-0"></Modal.Header>
        <Modal.Body>
          {showChangePassword ? (
            <ChangePassword onCancel={() => setShowChangePassword(false)} />
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-10">My Profile</h3>
              <div className="profile">
                <form onSubmit={handleSaveChanges}>
                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-6 group">
                      <FaUser className="absolute top-3 left-3 text-gray-500 dark:text-gray-400" />
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        defaultValue={userInfo?.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="full_name"
                        className="pl-10 peer-focus:font-medium    absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Full name
                      </label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <FaBirthdayCake className="absolute top-3 left-3 text-gray-500 dark:text-gray-400" />
                      <input
                        type="text"
                        name="age"
                        id="age"
                        defaultValue={userInfo?.age || ""}
                        onChange={(e) =>
                          handleInputChange("age", e.target.value)
                        }
                        className="block .5 px-10 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="age"
                        className="pl-10 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Age
                      </label>
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                      <FaPhone className="absolute top-3 left-3 text-gray-500 dark:text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        defaultValue={userInfo?.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="phone"
                        className="peer-focus:font-medium absolute    pl-10 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Phone number
                      </label>
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                      <FaMobileAlt className="absolute top-3 left-3 text-gray-500 dark:text-gray-400" />
                      <input
                        type="tel"
                        name="whatsapp"
                        id="whatsapp"
                        className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="whatsapp"
                        className="peer-focus:font-medium absolute   pl-10 te text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        WhatsApp number
                      </label>
                    </div>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <FaEnvelope className="absolute top-3 left-3 text-gray-500 dark:text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={userInfo?.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="email"
                      className="peer-focus:font-medium    pl-10 absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Email address
                    </label>
                  </div>
                  <div
                    className="underline text-lg font-medium cursor-pointer"
                    onClick={() => setShowChangePassword(true)}
                  >
                    Change Password
                  </div>
                  <div className="buttons flex gap-4 justify-center mt-8 mb-0">
                    <PrimaryButton
                      onClick={() => setOpenEditeProfileModal(false)}
                      text="Discard"
                      ourStyle="border-[--secondary-color]  border-2 hover:bg-[--secondary-color]  font-semibold hover:text-white	py- border rounded-3xl text-md px-5	transition-all	duration-500 "
                    />
                    <button
                      type="submit"
                      className="w-[150px] justify-center rounded-full bg-[--secondary-color] py-2.5 text-center text-sm font-medium text-white hover:bg-[#221f7b] duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
