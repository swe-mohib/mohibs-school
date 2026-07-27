import { useState } from "react";
import { toast } from "react-hot-toast";

import axiosInstance from "../helpers/axiosInstance";
import { isValidEmail } from "../helpers/regexMatcher";
import HomeLayout from "../layout/HomeLayout";

function Contact() {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.email || !userInput.name || !userInput.message) {
      toast.error("All fields are mandatory");
      return;
    }

    if (!isValidEmail(userInput.email)) {
      toast.error("Invalid email");
      return;
    }

    try {
      const response = axiosInstance.post("/contact", userInput);
      toast.promise(response, {
        loading: "Submitting your message...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to submit the form",
      });
      const contactResponse = await response;
      if (contactResponse?.data?.success) {
        setUserInput({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  }

  return (
    <HomeLayout>
      <div className="page-wrap flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <form
          noValidate
          onSubmit={onFormSubmit}
          className="form-card flex flex-col items-center justify-center gap-4"
        >
          <div className="w-full">
            <span className="eyebrow">We’re here to help</span>
            <h1 className="display-font mt-3 text-3xl font-bold">
              Get in touch
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Send us a message and we’ll get back to you.
            </p>
          </div>

          <div className="form-field w-full">
            <label htmlFor="name">Name</label>
            <input
              className=""
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleInputChange}
              value={userInput.name}
            />
          </div>

          <div className="form-field w-full">
            <label htmlFor="email">Email</label>
            <input
              className=""
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleInputChange}
              value={userInput.email}
            />
          </div>

          <div className="form-field w-full">
            <label htmlFor="message">Message</label>
            <textarea
              className=""
              id="message"
              name="message"
              placeholder="Enter your message"
              onChange={handleInputChange}
              value={userInput.message}
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Submit
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Contact;
