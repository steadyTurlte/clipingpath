import React, { useState } from "react";
import Image from "next/image";
import Thumb from "public/images/faq-two-thumb.png";

interface AboutFaqProps {
  data?: {
    subtitle?: string;
    title?: string;
    description?: string;
    image?: string;
    items?: {
      id: number;
      question: string;
      answer: string;
    }[];
    questions?: {
      id: number;
      question: string;
      answer: string;
    }[];
  };
}

const AboutFaq = ({ data }: AboutFaqProps) => {
  const [imgTab, setImgTab] = useState(0);

  // Default data
  const defaultData = {
    subtitle: "FAQ",
    title: "Frequently Asked Questions",
    image: "/images/faq/thumb.png",
    questions: [
      {
        id: 1,
        question: "What is clipping path service?",
        answer:
          "Clipping path is a photo editing technique that involves creating a closed vector path or shape to remove the background from an image. It's commonly used in product photography, e-commerce, and catalog production to isolate objects from their backgrounds.",
      },
      {
        id: 2,
        question: "How long does it take to complete an order?",
        answer:
          "Our standard turnaround time is 24-48 hours, depending on the complexity and volume of images. We also offer rush services for urgent projects that can be completed in as little as 6 hours.",
      },
      {
        id: 3,
        question: "What file formats do you accept?",
        answer:
          "We accept most common image formats including JPEG, PNG, TIFF, PSD, and RAW files. For best results, we recommend providing high-resolution images in their original format.",
      },
      {
        id: 4,
        question: "How do I place an order?",
        answer:
          "You can place an order by filling out our quote form or contacting us directly via email. Once we understand your requirements, we'll provide a quote and timeline for completion.",
      },
      {
        id: 5,
        question: "Do you offer bulk discounts?",
        answer:
          "Yes, we offer volume-based discounts for bulk orders. The more images you need edited, the lower the per-image price will be. Contact us for a custom quote.",
      },
    ],
  };

  // Merge with default data
  const faqData = {
    ...defaultData,
    ...data,
    questions: data?.items || data?.questions || defaultData.questions,
  };
  return (
    <section className="section faq-two">
      <div className="container">
        <div className="row gaper align-items-center">
          <div className="col-12 col-lg-4">
            <div
              className="faq-two__thumb "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <Image
                src={faqData.image || Thumb}
                alt="FAQ Image"
                width={400}
                height={500}
              />
            </div>
          </div>
          <div className="col-12 col-lg-8">
            <div className="faq-two__content">
              <div className="section__header">
                <p
                  className="h6 sub-title "
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  {faqData.subtitle}
                </p>
                <h2
                  className="h2 title "
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  {faqData.title}
                </h2>
              </div>
              <div className="accordion" id="accordion">
                {faqData.questions.map((question, index) => (
                  <div
                    key={question.id || index}
                    className={
                      "accordion-item " +
                      (imgTab == index ? " faq-two-active" : " ")
                    }
                    data-aos-duration="600"
                    data-aos-delay={index < 3 ? "100" : "600"}
                  >
                    <h5 className="accordion-header" id={`heading${index}`}>
                      <button
                        className={
                          (imgTab == index ? "  " : " collapsed") +
                          " accordion-button"
                        }
                        onClick={() => setImgTab(imgTab === index ? -1 : index)}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${index}`}
                        aria-expanded={imgTab === index ? "true" : "false"}
                        aria-controls={`collapse${index}`}
                      >
                        {question.question}
                      </button>
                    </h5>
                    <div
                      id={`collapse${index}`}
                      className={`accordion-collapse collapse${
                        imgTab === index ? " show " : ""
                      }`}
                      aria-labelledby={`heading${index}`}
                      data-bs-parent="#accordion"
                    >
                      <div className="accordion-body">
                        <p>{question.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFaq;
