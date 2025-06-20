import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Arrow from "public/images/arrow.png";

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  googleMapUrl: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram?: string;
    linkedin: string;
    youtube: string;
  };
}

interface MapData {
  embedUrl: string;
}

interface ContactSecProps {
  contactInfo: ContactInfo;
  mapData: MapData;
}

const ContactSec = ({ contactInfo, mapData }: ContactSecProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Select Subject",
    message: "",
    termsAccepted: false,
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null as string | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.message ||
      formData.subject === "Select Subject" ||
      !formData.termsAccepted
    ) {
      setFormStatus({
        submitting: false,
        success: false,
        error: "Please fill in all fields and accept the terms & conditions.",
      });
      return;
    }

    setFormStatus({
      submitting: true,
      success: false,
      error: null,
    });

    try {
      const response = await fetch("/api/contact/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          termsAccepted: formData.termsAccepted,
        }),
      });

      if (response.ok) {
        setFormStatus({
          submitting: false,
          success: true,
          error: null,
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "Select Subject",
          message: "",
          termsAccepted: false,
        });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setFormStatus((prev) => ({
            ...prev,
            success: false,
          }));
        }, 5000);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      setFormStatus({
        submitting: false,
        success: false,
        error:
          error.message || "Failed to send message. Please try again later.",
      });
    }
  };

  const address = contactInfo.address;
  const phone = contactInfo.phone;
  const email = contactInfo.email;
  const mapUrl = contactInfo.googleMapUrl;

  const contactTitle = "Have something in mind? Let's talk.";
  const contactDescription =
    "We're here to answer any questions you may have about our services. Reach out to us and we'll respond as soon as we can.";
  const contactImage = Arrow;

  // Static form field placeholders
  const formFields = {
    name: "Enter Full Name",
    email: "Enter Your Email",
    subject: ["Account", "Service", "Pricing", "Support"],
    message: "Write a Message",
    termsText: "I accept your terms & conditions",
  };

  const mapEmbedUrl = mapData.embedUrl;

  return (
    <>
      <section className="section contact-main">
        <div className="container">
          <div className="row gaper">
            <div className="col-12 col-lg-6">
              <div className="contact-main__thumb">
                <div className="content">
                  <h2
                    className="h2 title "
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                  >
                    {contactTitle}
                  </h2>
                  <div
                    className="paragraph "
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                  >
                    <p>{contactDescription}</p>
                  </div>
                </div>
                <div className="thumb">
                  <Image
                    src={
                      typeof contactImage === "string" ? contactImage : Arrow
                    }
                    alt="Image"
                    width={200}
                    height={200}
                  />
                </div>
                <div
                  className="single-group "
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  <ul>
                    <li>
                      <Link href={mapUrl} target="_blank">
                        <i className="fa-solid fa-location-dot"></i>
                        {address}
                      </Link>
                    </li>
                    <li>
                      <Link href={`tel:${phone.replace(/\s+/g, "")}`}>
                        <i className="fa-solid fa-phone-volume"></i>
                        {phone}
                      </Link>
                    </li>
                    <li>
                      <Link href={`mailto:${email}`}>
                        <i className="fa-solid fa-envelope"></i>
                        {email}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="contact-main__content">
                {formStatus.success && (
                  <div className="form-success-message">
                    <p>
                      Thank you for your message! We&apos;ll get back to you
                      soon.
                    </p>
                  </div>
                )}

                {formStatus.error && (
                  <div className="form-error-message">
                    <p>{formStatus.error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div
                    className="group-input "
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                  >
                    <input
                      type="text"
                      name="name"
                      id="contactName"
                      placeholder={formFields.name}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="group-input "
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                  >
                    <input
                      type="email"
                      name="email"
                      id="contactEmail"
                      placeholder={formFields.email}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="group-input "
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                  >
                    <select
                      name="subject"
                      className="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option data-display="Select Subject">
                        Select Subject
                      </option>
                      {formFields.subject &&
                        formFields.subject.map((subject, index) => (
                          <option key={index} value={subject}>
                            {subject}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div
                    className="group-input "
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="600"
                  >
                    <textarea
                      name="message"
                      id="contactMessage"
                      placeholder={formFields.message}
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="group-radio">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      id="contactCheck"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                    />
                    <label htmlFor="contactCheck">{formFields.termsText}</label>
                  </div>
                  <div className="cta__group justify-content-start">
                    <button
                      type="submit"
                      className="btn btn--primary"
                      disabled={formStatus.submitting}
                    >
                      {formStatus.submitting ? "Sending..." : "Send Message"}
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="map-wrapper "
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="100"
      >
        <iframe
          src={mapEmbedUrl}
          width="100"
          height="800"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <style jsx>{`
        .form-success-message {
          background-color: #d1fae5;
          color: #065f46;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }

        .form-error-message {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }
      `}</style>
    </>
  );
};

export default ContactSec;
