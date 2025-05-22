import React from "react";

interface InstructionStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Instructions {
  title: string;
  steps: InstructionStep[];
}

interface QuoteInstructionsProps {
  instructions?: Instructions;
}

const QuoteInstructions = ({ instructions }: QuoteInstructionsProps) => {
  // Static instructions - no longer using dynamic data from admin panel
  const staticInstructions = {
    title: "Get a Quote Instructions",
    steps: [
      {
        id: "01",
        title: "Choose services",
        description:
          "Select the service that best fits your project needs from our comprehensive list of options.",
        icon: "fa-list-check",
      },
      {
        id: "02",
        title: "Choose Output File Options",
        description:
          "Specify your preferred file format, background type, and other output options for your edited images.",
        icon: "fa-file-export",
      },
      {
        id: "03",
        title: "Drag & Drop Files",
        description:
          "Upload your images by dragging and dropping them into the designated area or browse your files.",
        icon: "fa-cloud-upload-alt",
      },
      {
        id: "04",
        title: "Get a Quote",
        description:
          "Submit your request and our team will provide you with a custom quote based on your specific requirements.",
        icon: "fa-file-invoice-dollar",
      },
    ],
  };

  // Always use the static instructions
  const displayInstructions = staticInstructions;
  return (
    <section className="section quote-instructions">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section__header text-center">
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {displayInstructions.title}
              </h2>
            </div>
          </div>
        </div>
        <div className="row gaper">
          {displayInstructions.steps.map((step, index) => (
            <div key={step.id} className="col-12 col-sm-6 col-xl-3">
              <div
                className="quote-instructions__single "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={index < 3 ? "100" : "600"}
              >
                <div className="thumb">
                  <div className="thumb-inner">
                    <span>{step.id}</span>
                  </div>
                </div>
                <div className="content">
                  <h5 className="h5">{step.title}</h5>
                  <p>{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuoteInstructions;
