import React, { useRef, useState } from "react";
import { BsEye, BsEyeSlashFill } from "react-icons/bs";
import PrimaryButton from "../../components/PrimaryButton";
import { Toast } from "primereact/toast";
import Cookies from "universal-cookie";
import "primereact/resources/themes/lara-light-indigo/theme.css";

interface ChangePasswordProps {
  onCancel: () => void;
}
function ChangePassword({ onCancel }: ChangePasswordProps) {
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const token = cookie.get("token");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
  const togglePasswordVisibility = (passwordType: String) => {
    switch (passwordType) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handlePasswordUpdate = async (e: any) => {
    const updatePassword = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      newPasswordConfirm: confirmPassword,
    };
    console.log(updatePassword);

    e.preventDefault();
    alert("sf");
    fetch(`${url}/user/auth/updateMyPassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatePassword),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showToast(
            "success",
            "Password Update Successful",
            "Password has been updated successfully."
          );
        } else {
          showToast("error", "Password Update Failed", `${data?.message}`);
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        console.log(data);
      })

      .catch((error) => {
        showToast("error", "Password Update Failed", `${error?.message}`);
        console.error("Error updating password:", error);
        // Handle error scenarios
      });
  };

  return (
    <div className="md:px-11">
      <Toast ref={toast} />

      <h3 className="font-semibold text-lg mb-10">Change Password</h3>
      <form onSubmit={handlePasswordUpdate}>
        <div className="mb-6 relative z-0 group">
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your old Password"
            className="rounded-2xl shadow-sm placeholder-black  border border-[#828282] pl-5 text-gray-900 text-sm   focus:border-[--secondary-color] block w-full p-2.5 "
            required
          />
          <span
            className="absolute top-3 right-3 cursor-pointer"
            onClick={() => togglePasswordVisibility("current")}
          >
            {showCurrentPassword ? <BsEyeSlashFill /> : <BsEye />}
          </span>
        </div>

        <div className="max-md:flex-col  flex justify-center items-center gap-6">
          <div className="relative z-0  max-md:w-full  group">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new Password"
              className="rounded-2xl shadow-sm max-md:w-full grow w-[240px] placeholder-black  border border-[#828282] pl-5 text-gray-900 text-sm   focus:border-[--secondary-color] block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />
            <span
              className="absolute top-3 right-3  cursor-pointer"
              onClick={() => togglePasswordVisibility("new")}
            >
              {showNewPassword ? <BsEyeSlashFill /> : <BsEye />}
            </span>
          </div>
          <div className="relative z-0 max-md:w-full max-md:mb-6 group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="newPasswordConfirm"
              name="newPasswordConfirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="rounded-2xl shadow-sm max-md:w-full  grow placeholder-black w-[240px]	 border border-[#828282] pl-5 text-gray-900 text-sm   focus:border-[--secondary-color] block  p-2.5   "
              required
            />
            <span
              className="absolute top-3 right-3   cursor-pointer"
              onClick={() => togglePasswordVisibility("confirm")}
            >
              {showConfirmPassword ? <BsEyeSlashFill /> : <BsEye />}
            </span>
          </div>
        </div>

        <div className="buttons flex gap-4 justify-center mt-4 mb-0">
          <PrimaryButton
            onClick={onCancel} // Call the onCancel prop here
            text="Discard"
            ourStyle="border-[--secondary-color]  border-2 hover:bg-[--secondary-color]  font-semibold hover:text-white	py- border rounded-3xl text-md px-5	transition-all	duration-500 "
          />
          <button
            type="submit"
            className="w-[160px] justify-center rounded-full bg-[--secondary-color] py-2.5 text-center text-sm font-medium text-white hover:bg-[#221f7b] duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
