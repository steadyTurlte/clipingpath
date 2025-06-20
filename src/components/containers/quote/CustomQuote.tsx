import React, { useState, useRef } from "react";
import Image from "next/image";
import one from "public/images/quote/one.png";
import two from "public/images/quote/two.png";
import three from "public/images/quote/three.png";
import four from "public/images/quote/four.png";
import five from "public/images/quote/five.png";
import six from "public/images/quote/six.png";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

interface Gallery {
  title: string;
  description: string;
  images: GalleryImage[];
}

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

interface Form {
  title: string;
  description: string;
  personalInfo: FormField[];
  serviceSelection: {
    label: string;
    title: string;
    options: string[];
  };
  outputOptions: {
    title: string;
    fileFormat: Array<{ id: string; label: string; isDefault: boolean }>;
    background: Array<{ id: string; label: string; isDefault: boolean }>;
    path: Array<{ id: string; label: string; isDefault: boolean }>;
  };
  message: {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
  };
  fileUpload: {
    label: string;
    description: string;
    maxSize: string;
    alternativeText: string;
    linkPlaceholder: string;
  };
  terms: {
    text: string;
    required: boolean;
  };
  submitButton: string;
  successMessage?: string;
  errorMessage?: string;
}

interface CustomQuoteProps {
  gallery?: Gallery;
  form?: Form;
}

const CustomQuote = ({ gallery, form }: CustomQuoteProps) => {
  // Static form configuration
  const staticForm: Form = {
    title: "Custom Quote Request",
    description:
      "Please provide as much detail as possible to help us understand your project requirements.",
    personalInfo: [
      {
        id: "name",
        label: "Full Name*",
        type: "text",
        placeholder: "Enter your name",
        required: true,
      },
      {
        id: "email",
        label: "Email Address*",
        type: "email",
        placeholder: "Enter your email",
        required: true,
      },
      {
        id: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "Enter your phone number",
        required: false,
      },
    ],
    serviceSelection: {
      label: "Select Service*",
      title: "Our Services",
      options: [
        "Clipping Path",
        "Background Removal",
        "Image Masking",
        "Shadow Creation",
        "Color Correction",
        "Photo Retouching",
        "Other",
      ],
    },
    outputOptions: {
      title: "Output File Options",
      fileFormat: [
        { id: "jpg", label: "JPG", isDefault: true },
        { id: "png", label: "PNG", isDefault: false },
      ],
      background: [
        { id: "transparent", label: "Transparent Background", isDefault: true },
        { id: "white", label: "White Background", isDefault: false },
      ],
      path: [
        { id: "includePath", label: "Include Path", isDefault: true },
        { id: "noPath", label: "No Path", isDefault: false },
      ],
    },
    message: {
      id: "message",
      label: "Your Message",
      type: "textarea",
      placeholder: "Tell us about your project requirements",
      required: true,
    },
    fileUpload: {
      label: "Upload Files",
      description: "Drag & Drop Files Here or browse file",
      maxSize: "50MB",
      alternativeText:
        "If the size is more than 50 MB, share your images via cloud (Google Drive, Dropbox)",
      linkPlaceholder: "Paste the link here",
    },
    terms: {
      text: "I have read and agree to the Terms & Conditions",
      required: true,
    },
    submitButton: "Submit Now",
    successMessage:
      "Thank you for your quote request! We'll get back to you soon.",
    errorMessage:
      "Please fill in all required fields and accept the terms & conditions.",
  };

  // Use the static form configuration instead of the dynamic one
  const formConfig = staticForm;

  interface FileOptions {
    jpg: boolean;
    png: boolean;
    transparent: boolean;
    white: boolean;
    includePath: boolean;
    noPath: boolean;
    [key: string]: boolean;
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Our Services",
    fileOptions: {
      jpg: false,
      png: false,
      transparent: false,
      white: false,
      includePath: false,
      noPath: false,
    } as FileOptions,
    message: "",
    cloudLink: "",
    termsAccepted: false,
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null as string | null | undefined,
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name.startsWith("c-")) {
      // Handle checkboxes for file options
      const option = name.replace("c-", "");
      setFormData((prev) => ({
        ...prev,
        fileOptions: {
          ...prev.fileOptions,
          [option]: checked,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name === "read-terms" ? "termsAccepted" : name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name === "trial-name"
          ? "name"
          : name === "trial-email"
          ? "email"
          : name === "select-services"
          ? "service"
          : name === "trial-message"
          ? "message"
          : name === "trail-link"
          ? "cloudLink"
          : name]: value,
      }));
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedFileName(file.name);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("drag-over");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("drag-over");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("drag-over");
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setUploadedFileName(file.name);

      // Update the file input
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      formData.service === "Our Services" ||
      !formData.termsAccepted
    ) {
      setFormStatus({
        submitting: false,
        success: false,
        error: formConfig.errorMessage,
      });
      return;
    }

    setFormStatus({
      submitting: true,
      success: false,
      error: null,
    });

    try {
      // Upload file if selected
      let filePath = "";
      if (uploadedFile) {
        try {
          const formDataObj = new FormData();
          formDataObj.append("file", uploadedFile);

          const uploadResponse = await fetch(
            "/api/upload/image?folder=quotes",
            {
              method: "POST",
              body: formDataObj,
            }
          );

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            filePath = uploadData.path;
            setUploadedFilePath(filePath);
          } else {
            const errorData = await uploadResponse.json();
            console.error("Upload response error:", errorData);
            throw new Error(errorData.message || "Failed to upload file");
          }
        } catch (uploadError: any) {
          console.error("File upload error:", uploadError);
          setFormStatus({
            submitting: false,
            success: false,
            error: `File upload failed: ${uploadError.message}`,
          });
          return;
        }
      }

      // Prepare file options string
      const fileOptionsArray = Object.entries(formData.fileOptions)
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option);

      const fileOptionsString =
        fileOptionsArray.length > 0
          ? fileOptionsArray.join(", ")
          : "None selected";

      // Send email with form data
      const emailResponse = await fetch("/api/quote/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.service,
          fileOptions: fileOptionsString,
          message: formData.message,
          uploadedFile: filePath || "",
          cloudLink: formData.cloudLink || "",
        }),
      });

      if (emailResponse.ok) {
        setFormStatus({
          submitting: false,
          success: true,
          error: null,
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          service: "Our Services",
          fileOptions: {
            jpg: false,
            png: false,
            transparent: false,
            white: false,
            includePath: false,
            noPath: false,
          },
          message: "",
          cloudLink: "",
          termsAccepted: false,
        });
        setUploadedFile(null);
        setUploadedFileName("");
        setUploadedFilePath("");

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Clear success message after 5 seconds
        setTimeout(() => {
          setFormStatus((prev) => ({
            ...prev,
            success: false,
          }));
        }, 5000);
      } else {
        const data = await emailResponse.json();
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Error submitting quote form:", error);
      setFormStatus({
        submitting: false,
        success: false,
        error:
          error.message || "Failed to submit form. Please try again later.",
      });
    }
  };

  return (
    <div className="custom-quote">
      <div className="container">
        <div className="row gaper align-items-center">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="quote-wrapper">
              <div className="custom-quote__left custom-quote__left1">
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[0] &&
                      gallery.images[0].src
                        ? gallery.images[0].src
                        : one
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[0] &&
                      gallery.images[0].alt
                        ? gallery.images[0].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[1] &&
                      gallery.images[1].src
                        ? gallery.images[1].src
                        : two
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[1] &&
                      gallery.images[1].alt
                        ? gallery.images[1].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[2] &&
                      gallery.images[2].src
                        ? gallery.images[2].src
                        : three
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[2] &&
                      gallery.images[2].alt
                        ? gallery.images[2].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
              </div>
              <div className="custom-quote__left custom-quote__left2">
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[0] &&
                      gallery.images[0].src
                        ? gallery.images[0].src
                        : one
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[0] &&
                      gallery.images[0].alt
                        ? gallery.images[0].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[1] &&
                      gallery.images[1].src
                        ? gallery.images[1].src
                        : two
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[1] &&
                      gallery.images[1].alt
                        ? gallery.images[1].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[2] &&
                      gallery.images[2].src
                        ? gallery.images[2].src
                        : three
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[2] &&
                      gallery.images[2].alt
                        ? gallery.images[2].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
              </div>
              <div className=" custom-quote__left custom-quote__left3">
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[0] &&
                      gallery.images[0].src
                        ? gallery.images[0].src
                        : one
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[0] &&
                      gallery.images[0].alt
                        ? gallery.images[0].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[1] &&
                      gallery.images[1].src
                        ? gallery.images[1].src
                        : two
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[1] &&
                      gallery.images[1].alt
                        ? gallery.images[1].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[2] &&
                      gallery.images[2].src
                        ? gallery.images[2].src
                        : three
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[2] &&
                      gallery.images[2].alt
                        ? gallery.images[2].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="quote-wrapper">
              <div className="custom-quote__right custom-quote__right1">
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[3] &&
                      gallery.images[3].src
                        ? gallery.images[3].src
                        : four
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[3] &&
                      gallery.images[3].alt
                        ? gallery.images[3].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[4] &&
                      gallery.images[4].src
                        ? gallery.images[4].src
                        : five
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[4] &&
                      gallery.images[4].alt
                        ? gallery.images[4].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[5] &&
                      gallery.images[5].src
                        ? gallery.images[5].src
                        : six
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[5] &&
                      gallery.images[5].alt
                        ? gallery.images[5].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
              </div>
              <div className="custom-quote__right custom-quote__right2">
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[3] &&
                      gallery.images[3].src
                        ? gallery.images[3].src
                        : four
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[3] &&
                      gallery.images[3].alt
                        ? gallery.images[3].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[4] &&
                      gallery.images[4].src
                        ? gallery.images[4].src
                        : five
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[4] &&
                      gallery.images[4].alt
                        ? gallery.images[4].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[5] &&
                      gallery.images[5].src
                        ? gallery.images[5].src
                        : six
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[5] &&
                      gallery.images[5].alt
                        ? gallery.images[5].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
              </div>
              <div className="custom-quote__right custom-quote__right3">
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[3] &&
                      gallery.images[3].src
                        ? gallery.images[3].src
                        : four
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[3] &&
                      gallery.images[3].alt
                        ? gallery.images[3].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[4] &&
                      gallery.images[4].src
                        ? gallery.images[4].src
                        : five
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[4] &&
                      gallery.images[4].alt
                        ? gallery.images[4].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
                <div className="single">
                  <Image
                    src={
                      gallery &&
                      gallery.images &&
                      gallery.images[5] &&
                      gallery.images[5].src
                        ? gallery.images[5].src
                        : six
                    }
                    alt={
                      gallery &&
                      gallery.images &&
                      gallery.images[5] &&
                      gallery.images[5].alt
                        ? gallery.images[5].alt
                        : "Image"
                    }
                    width={200}
                    height={150}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-6">
            <div className="trial__form">
              {formStatus.success && (
                <div className="form-success-message">
                  <p>{formConfig.successMessage}</p>
                </div>
              )}

              {formStatus.error && (
                <div className="form-error-message">
                  <p>{formStatus.error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div
                  className="form-group-wrapper"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  {formConfig.personalInfo.map((field, index) => (
                    <div className="form-group-single" key={field.id || index}>
                      <label htmlFor={field.id}>{field.label}</label>
                      <input
                        type={field.type || "text"}
                        name={
                          field.id === "name"
                            ? "trial-name"
                            : field.id === "email"
                            ? "trial-email"
                            : field.id
                        }
                        id={field.id}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={
                          field.id === "name"
                            ? formData.name
                            : field.id === "email"
                            ? formData.email
                            : ""
                        }
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                </div>
                <div
                  className="form-group-single"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  <p>{formConfig.serviceSelection.label}</p>
                  <select
                    className="select-services"
                    name="select-services"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option data-display="Please Select">
                      {formConfig.serviceSelection.title}
                    </option>
                    {formConfig.serviceSelection.options.map(
                      (option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div
                  className="form-group-single"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  <p>{formConfig.outputOptions.title}</p>
                  <div className="check-ready-single">
                    {/* File Format Options */}
                    {formConfig.outputOptions.fileFormat.map(
                      (option, index) => (
                        <div
                          className="singlee"
                          key={`format-${option.id || index}`}
                        >
                          <input
                            type="checkbox"
                            name={`c-${option.id}`}
                            id={`format-${option.id || index}`}
                            checked={formData.fileOptions[option.id] || false}
                            onChange={handleChange}
                          />
                          <label htmlFor={`format-${option.id || index}`}>
                            {option.label}
                          </label>
                        </div>
                      )
                    )}

                    {/* Background Options */}
                    {formConfig.outputOptions.background.map(
                      (option, index) => (
                        <div
                          className="singlee"
                          key={`bg-${option.id || index}`}
                        >
                          <input
                            type="checkbox"
                            name={`c-${option.id}`}
                            id={`bg-${option.id || index}`}
                            checked={formData.fileOptions[option.id] || false}
                            onChange={handleChange}
                          />
                          <label htmlFor={`bg-${option.id || index}`}>
                            {option.label}
                          </label>
                        </div>
                      )
                    )}

                    {/* Path Options */}
                    {formConfig.outputOptions.path.map((option, index) => (
                      <div
                        className="singlee"
                        key={`path-${option.id || index}`}
                      >
                        <input
                          type="checkbox"
                          name={`c-${option.id}`}
                          id={`path-${option.id || index}`}
                          checked={formData.fileOptions[option.id] || false}
                          onChange={handleChange}
                        />
                        <label htmlFor={`path-${option.id || index}`}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="form-group-single"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  <label htmlFor="trialMessage">
                    {formConfig.message.label}
                  </label>
                  <textarea
                    name="trial-message"
                    id="trialMessage"
                    placeholder={formConfig.message.placeholder}
                    value={formData.message}
                    onChange={handleChange}
                    required={formConfig.message.required}
                  ></textarea>
                </div>
                <div className="drag">
                  <div
                    ref={dropAreaRef}
                    className="drag__content"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="600"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      name="trail-file"
                      id="trialFile"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    {uploadedFileName ? (
                      <>
                        <p className="file-selected">File selected:</p>
                        <p className="file-name">{uploadedFileName}</p>
                        <p className="change-file">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <p>
                          {formConfig.fileUpload.description.split(" or ")[0]}
                        </p>
                        <p>or</p>
                        <p>
                          {formConfig.fileUpload.description.split(" or ")[1]}
                        </p>
                      </>
                    )}
                  </div>
                  <p>{formConfig.fileUpload.alternativeText}</p>
                </div>
                <div
                  className="form-group-single"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="600"
                >
                  <input
                    type="text"
                    name="trail-link"
                    id="trailLink"
                    placeholder={formConfig.fileUpload.linkPlaceholder}
                    value={formData.cloudLink}
                    onChange={handleChange}
                  />
                </div>
                <div className="group-radio">
                  <input
                    type="checkbox"
                    name="read-terms"
                    id="readTerms"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                  <label htmlFor="readTerms">{formConfig.terms.text}</label>
                </div>
                <div className="cta__group">
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={formStatus.submitting}
                  >
                    {formStatus.submitting
                      ? "Submitting..."
                      : formConfig.submitButton}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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

        .drag__content {
          cursor: pointer;
        }

        .drag__content.drag-over {
          background-color: #f0f9ff;
          border-color: #3b82f6;
        }

        .file-selected {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .file-name {
          color: #3b82f6;
          margin-bottom: 5px;
          word-break: break-all;
        }

        .change-file {
          font-size: 0.8rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default CustomQuote;
