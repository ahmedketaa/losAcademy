import React, { useRef } from "react";

import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Toast } from "primereact/toast";

function UserFeedBack({ setUserFeedbackModal, userFeedbackModal }: any) {
  // const [feedbackModal, setFeedbackModal] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const toast = useRef<Toast>(null);
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const token = cookie.get("token");

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
  const handlePublish = () => {
    // Check if the name and feedback are not empty
    if (!feedback.trim()) {
      showError("Please enter your  feedback before publishing.");
      return;
    }

    const feedbackData = {
      feedback: feedback,
    };

    // Perform API request to submit feedback
    fetch(`${url}/feedback/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add this line to specify JSON content type

      },
      body: JSON.stringify(feedbackData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle success response
        if (data.status === "success") {
          showSuccess(`Feedback Sent Successfully`);
          // console.log("Feedback submitted successfully", data);
          setUserFeedbackModal(false);
        } else {
          // console.log(data);
          showError(`${data.message}`);
        }

        // Reset the input fields
        setName("");
        setFeedback("");
      })
      .catch((error) => {
        // Handle error
        console.error("Error submitting feedback:", error);
        showError("Error submitting feedback. Please try again.");
      });
  };

  return (
    <>
      <Toast ref={toast} />
      {/* <Button onClick={() => setUserFeedbackModal(true)}>
        Toggle Feedback modal
      </Button> */}
      <Modal
        show={userFeedbackModal}
        className="block space-y-0 md:flex md:space-y-0 md:space-x-4 "
        size={"xl"}
        onClose={() => setUserFeedbackModal(false)}
      >
        <Modal.Header className="p-0 m-0 border-0"></Modal.Header>

        <Modal.Body>
          <div className="pl-5">
            <h3 className="font-semibold text-lg mb-3 ">Add Feedback</h3>
            {/* <p className="font-medium mb-3">Your name </p>
            <input
              type="text"
              placeholder="Enter Your Name"
              className="rounded-xl border-[#828282]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            /> */}
            <div className="feedback pe-3 mt-10">
              <label htmlFor="feedback" className="font-medium mb-4">
                Your Feedback{" "}
              </label>
              <textarea
                name="feedback"
                id="feedback"
                placeholder="Tell us how was your experience with us "
                className="w-full focus:outline-0 	focus:border-[--secondary-color] focus:border-0 mt-4 resize-none rounded-xl border-[#8d8c8c]"
                rows={8}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-center mt-3">
              <button
                onClick={handlePublish}
                className="px-10 py-2 bg-[--secondary-color] rounded-full text-white font-semibold m-auto"
              >
                Publish
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserFeedBack;
