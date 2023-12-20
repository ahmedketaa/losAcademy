"use client";

import { Button, CustomFlowbiteTheme, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import Cookies from "universal-cookie";
import ForgetPassword from "../../student_profile/components/forgetPassword";
import PrimaryButton from "../PrimaryButton";
import LoadingButton from "../../admin/components/loadingButton";

export default function loginTap() {
    const cookies = new Cookies();
    const router = useRouter();
    const [openForgetPasswordModal, setOpenForgetPasswordModal] =useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const url = process.env.NEXT_PUBLIC_APIURL;

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
    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
      };
    
      const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
      };
    
      const formDataLogin = {
        email: email,
        password: password,
      };

    const handleLogin = () => {
        // console.log(formDataLogin);
    
        // Perform basic client-side validation
        if (!email || !password) {
          showError("Please fill in all fields");
          return;
        }
        setIsProcessing(true);
        // Send a POST request to the login endpoint
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataLogin),
        })
          .then((response) => response.json())
          .then((data) => {
            setIsProcessing(false);
            if (data.status === "success") {
              showSuccess("Login Successfully");
                setIsLoading(true)
              // console.log(data);
              localStorage.setItem("myName", data?.data?.name);
              setTimeout(() => {
                // Redirect to a protected route upon successful login
                router.push("/student_profile");
              }, 3000);
              // Save user token in a cookie or state as needed
              cookies.set("token", data.token);
              cookies.set("id", data.data.id);
              cookies.set("name", data.data.name);
            } else {
              if (
                data.message ===
                "Can't log in before you verify you email if you miss the first mail you can always resend it!"
              ) {
                // Display the div for email verification
                showError(`${data.message}`);
                setShowEmailVerification(true);
              } else {
                showError(`${data.message || "Login Faild "}`);
              }
              console.log(data);
            }
            setIsProcessing(false);
          })
          .catch((error) => {
            console.log(error);
            setIsProcessing(false);
            showError("An error occurred ");
          });
      };
    

      // resend mail
      const handleResendMail = () => {
        // Send a request to resend the confirmation email
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/auth/resendMailConfirmation?email=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              showSuccess("Mail resent successfully");
            } else {
              showError(data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            showError("An error occurred while resending the mail");
          });
      };

  return (
    <div
      className=" flex justify-center items-center gap-3  flex-wrap "
      style={{ minHeight: "300px", width: "100%" }}
    >
      <Toast ref={toast} />
      {isLoading ? (
        <div>
          <Spinner
            color={"purple"}
            style={{
              width: "2rem",
              height: "2rem",
              zIndex: "1000",
              position: "fixed",
              top: "14%",
              left: "1%",
            }}
          />
        </div>
      ) : (
        ""
      )}
      <h3 className="font-bold	 text-xl	"> Welcome Back ! </h3>
      <div className="flex flex-col gap-4" style={{ width: "100%" }}>
        <input
          className="border-[--secondary-color] gradiant-color	 rounded-3xl w-full		border-2	"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email address "
          required
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <input
          className="border-[--secondary-color] gradiant-color	 rounded-3xl w-full		border-2	"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button
          onClick={() => setOpenForgetPasswordModal(true)}
          className=" font-semibold	 underline"
        >
          Forget Password ?
        </button>
        <ForgetPassword
          openForgetPassword={openForgetPasswordModal}
          setOpenForgetPasswordModal={setOpenForgetPasswordModal}
        />
        {showEmailVerification && (
          <div>
            <div className="text-red-500 text-md font-medium text-center">
              Check Gmail and confirm your mail
            </div>
            <div className="text-center font-sm">
              Didn't receive a mail?{" "}
              <button
                onClick={handleResendMail}
                className="underline text-lg font-medium"
              >
                Resend mail
              </button>
            </div>
          </div>
        )}
        <LoadingButton
          isProcessing={isProcessing}
          title="Login"
          customStyle={
            "text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors"
          }
          action={handleLogin}
        />
        {/* <Button
          onClick={handleLogin}
          color="purple"
          isProcessing={isProcessing}
          pill
          size="lg"
          className={
            "transition-colors rounded-full font-semibold px-5 py-2 text-white"
          }
        >
          <p>Login</p>
        </Button> */}

        <span className="text-center">Or Login with </span>
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
