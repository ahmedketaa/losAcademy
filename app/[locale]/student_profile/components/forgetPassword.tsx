import React, { useRef } from "react";
import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";
function ForgetPassword({
  openForgetPassword,
  setOpenForgetPasswordModal,
}: any) {
  const [email, setEmail] = useState("");
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const [isProcessing, setIsProcessing] = useState(false)
  const toast = useRef<Toast>(null);
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

  const handleForgetPassword = () => {
    // Perform basic client-side validation
    if (!email) {
      showError("Enter Your Mail");
      return;
    }

    setIsProcessing(true)
    // Send a POST request to the forget password endpoint
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/auth/forgetPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsProcessing(false)
        if (data.status === "success") {
          showSuccess(`${data.message} please check your gmail`);
          console.log(data);
        } else {
          showError(`${data.message}`);
          console.log(data);
        }
      })
      .catch((error) => {
        setIsProcessing(false)
        console.log(error);
        showError(`${error.message}`);

        // Handle error (show an error message, etc.)
      });
  };

  return (
    <div>
      <Modal
        show={openForgetPassword}
        className="block space-y-0 md:flex md:space-y-0 md:space-x-4 "
        size={"xl"}
        onClose={() => setOpenForgetPasswordModal(false)}
      >
        <Modal.Header className=" border-0">
          <div className="flex justify-center items-center">
            Forget Password
          </div>
        </Modal.Header>

        <Modal.Body>
          <Toast ref={toast} />
          <div className="forgetPassword flex gap-5 items-center py-12   justify-center">
            <label htmlFor="forgetMail" className="text-xl">
              Email:
            </label>
            <input
              className=" border-[--secondary-color] gradiant-color	 rounded-3xl 		border-2	"
              type="email"
              value={email}
              onChange={handleEmailChange}
              id="forgetMail"
              placeholder="Enter Your Email "
            />
          </div>
          <div className="flex justify-center items-center">
          <Button
                onClick={handleForgetPassword}
                color="purple"
                isProcessing={isProcessing}
                pill
                size="lg"
                className="bg-secondary-color  hover:bg-[#413ca3e5]  font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-1 px-10   rounded-full w-50 mx-auto max-md:py-2.5 max-md:px-10 max-md:w-45"

              >
                <p>Send Mail</p>
              </Button>
            {/* <button
              onClick={handleForgetPassword}
              className="bg-secondary-color  hover:bg-[#413ca3e5]  font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-3 px-16   rounded-full w-50 mx-auto max-md:py-2.5 max-md:px-10 max-md:w-45"
            >
              Send Mail
            </button> */}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ForgetPassword;
