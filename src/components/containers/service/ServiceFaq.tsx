import React, { useState } from "react";
import Image from "next/image";
import Thumb from "public/images/faq-three-thumb.png";

interface FaqItem {
  id?: number;
  question?: string;
  answer?: string;
}

interface FaqData {
  subtitle?: string;
  title?: string;
  description?: string;
  image?: string;
  items?: FaqItem[];
}

interface ServiceFaqProps {
  data?: FaqData;
}

const ServiceFaq = ({ data }: ServiceFaqProps) => {
  const [imgTab, setImgTab] = useState(0);

  // Default data
  const faqData = data || {
    subtitle: "FAQ",
    title: "frequently ask questions",
    description: "Find answers to common questions about our services.",
    image: "/images/faq-three-thumb.png",
    items: [
      {
        id: 1,
        question: "What is a stock media platform?",
        answer: "Yes, the images are free, but the usage depends on the image license. Photographers can select 3 types of license to share their photos"
      },
      {
        id: 2,
        question: "Can I upload other music than my own?",
        answer: "Yes, the images are free, but the usage depends on the image license. Photographers can select 3 types of license to share their photos"
      },
      {
        id: 3,
        question: "What format are the files in?",
        answer: "Yes, the images are free, but the usage depends on the image license. Photographers can select 3 types of license to share their photos"
      },
      {
        id: 4,
        question: "What is a stock media platform?",
        answer: "Yes, the images are free, but the usage depends on the image license. Photographers can select 3 types of license to share their photos"
      },
      {
        id: 5,
        question: "Can I upload other music than my own?",
        answer: "Yes, the images are free, but the usage depends on the image license. Photographers can select 3 types of license to share their photos"
      }
    ]
  };
  return (
    <section className="section faq-two faq-three">
      <div className="container">
        <div className="row gaper align-items-center">
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
                {faqData.description && (
                  <p
                    className="paragraph"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                  >
                    {faqData.description}
                  </p>
                )}
              </div>
              <div className="accordion" id="accordion">
                {faqData.items && faqData.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={
                      "accordion-item " + (imgTab == index ? " faq-two-active" : " ")
                    }
                    data-aos-duration="600"
                    data-aos-delay={100 + (index % 2) * 500}
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
                        {item.question}
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
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div
              className="faq-two__thumb "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              {faqData.image && faqData.image.startsWith('/') ? (
                <Image
                  src={faqData.image}
                  alt="FAQ Image"
                  width={400}
                  height={500}
                />
              ) : (
                <Image src={Thumb} alt="FAQ Image" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceFaq;
