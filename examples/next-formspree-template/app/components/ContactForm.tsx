"use client";

import { useForm, ValidationError } from "@formspree/react";
import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORM || "");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = (formData: FormData): boolean => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (!email || email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!message || message.trim() === "") {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (validateForm(formData)) {
      handleSubmit(e);
    }
  };

  if (state.succeeded) {
    return (
      <div className="form-card success-card">
        <div className="success-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2>Thank You!</h2>
        <p>Your message has been sent successfully. We will get back to you soon.</p>
        <button onClick={() => window.location.reload()} className="reset-btn">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="form-header">
        <h1>Contact Us</h1>
        <p>We would love to hear from you</p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name"><span className="required">*</span> Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Your name"
            className={errors.name ? "error" : ""}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
          <ValidationError prefix="Name" field="name" errors={state.errors} className="error-message" />
        </div>

        <div className="form-group">
          <label htmlFor="email"><span className="required">*</span> Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            className={errors.email ? "error" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          <ValidationError prefix="Email" field="email" errors={state.errors} className="error-message" />
        </div>

        <div className="form-group">
          <label htmlFor="message"><span className="required">*</span> Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Your message..."
            className={errors.message ? "error" : ""}
          />
          {errors.message && <p className="error-message">{errors.message}</p>}
          <ValidationError prefix="Message" field="message" errors={state.errors} className="error-message" />
        </div>

        {state.errors && Object.keys(state.errors).length > 0 && (
          <div className="server-error">
            <p>Something went wrong. Please try again.</p>
          </div>
        )}

        <button type="submit" disabled={state.submitting} className="submit-btn">
          {state.submitting ? (
            <>
              <span className="spinner"></span>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
