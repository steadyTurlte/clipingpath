import React from "react";
import Image from "next/image";
import Thumb from "public/images/trial-thumb.png";
import Link from "next/link";

interface TrialData {
  title?: string;
  description?: string;
  image?: string;
}

interface TrialProps {
  data?: TrialData;
}

const Trial = ({ data }: TrialProps) => {
  // Default data
  const trialData = data || {
    title: "Get Started With the free trail",
    description: "Welcome to our professional clipping path service, where we provide high-quality and affordable image editing solutions to businesses and individuals around the world.",
    image: ""
  };
  return (
    <section className="section trial">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section__header">
              <p
                className="h6 sub-title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                contact now
              </p>
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {trialData.title}
              </h2>
              <div
                className="paragraph "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <p>
                  {trialData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row gaper">
          <div className="col-12 col-xl-6">
            <div className="trial__thumb">
              <Image
                src={trialData.image || Thumb}
                alt="Trial Image"
                width={600}
                height={400}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px"
                }}
              />
            </div>
          </div>
          <div className="col-12 col-xl-6">
            <div className="trial__form">
              <form action="#" method="post">
                <div
                  className="form-group-wrapper "
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  <div className="form-group-single">
                    <label htmlFor="trialName">full name*</label>
                    <input
                      type="text"
                      name="trial-name"
                      id="trialName"
                      placeholder="enter your name"
                      required
                    />
                  </div>
                  <div className="form-group-single">
                    <label htmlFor="trialEmail">email address*</label>
                    <input
                      type="email"
                      name="trial-email"
                      id="trialEmail"
                      placeholder="enter your email"
                      required
                    />
                  </div>
                </div>
                <div className="form-group-single">
                  <p>select service*</p>
                  <select className="select-services">
                    <option data-display="Please Select">Our Services</option>
                    <option value="1">Background Remove</option>
                    <option value="2">Clipping Path</option>
                    <option value="3">Photo Manipulation</option>
                    <option value="4">Multiple Background</option>
                  </select>
                </div>
                <div className="form-group-single">
                  <label htmlFor="trialMessage">your message</label>
                  <textarea
                    name="trial-message"
                    id="trialMessage"
                    placeholder="Type Here"
                  ></textarea>
                </div>
                <div className="drag">
                  <div className="drag__content">
                    <input type="file" name="trail-file" id="trialFile" />
                    <p>Drag & Drop Files Here</p>
                    <p>or</p>
                    <p>browse file</p>
                  </div>
                  <p>
                    If the size is more than 50 Mb, share your images via cloud
                    (Google Drive, Dropbox)
                  </p>
                </div>
                <div className="form-group-single">
                  <input
                    type="text"
                    name="trail-link"
                    id="trailLink"
                    placeholder="paste the link here"
                  />
                </div>
                <div className="group-radio">
                  <input type="checkbox" name="read-terms" id="readTerms" />
                  <label htmlFor="readTerms">
                    I have read and agree to the Terms & Conditions
                  </label>
                </div>
                <div className="cta__group">
                  <Link href="/contact" className="btn btn--primary">
                    Submit Now
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trial;
