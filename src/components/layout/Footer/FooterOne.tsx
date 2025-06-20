import React from "react";
import Image from "next/image";
import Link from "next/link";
import LogoLight from "public/images/logo-light.png";
import { useEffect, useState } from "react";

const FooterOne = () => {
  const [contactInfo, setContactInfo] = useState({
    email: "info@photodit.com",
    phone: "+1 (732) 798-0976",
    address: "785 15h Street, Office 478 Berlin",
    googleMapUrl: "https://maps.app.goo.gl/sPRBkpkodse4YU5c9",
    socialLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
      youtube: "https://youtube.com",
    },
  });

  useEffect(() => {
    // Fetch contact info data from the admin panel
    fetch("/api/content/contact-info")
      .then((res) => res.json())
      .then((data) => {
        setContactInfo(data);
      })
      .catch((err) => {
        console.error("Error fetching contact info:", err);
      });
  }, []);

  return (
    <footer className="section section--space-top footer ">
      <div className="container">
        <div className="row gaper">
          <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
            <div className="footer__single ">
              <div className="logo">
                <Link href="/">
                  <Image src={LogoLight} alt="Image" />
                </Link>
              </div>
              <div className="content">
                <p>
                  We isolate images from their backgrounds using clipping paths
                  or masks. We do it 100% hand-made.
                </p>
              </div>
              <ul className="social">
                {contactInfo.socialLinks?.facebook && (
                  <li>
                    <Link
                      href={contactInfo.socialLinks.facebook}
                      aria-label="Facebook"
                      target="_blank"
                    >
                      <i className="fa-brands fa-facebook-f"></i>
                    </Link>
                  </li>
                )}
                {contactInfo.socialLinks?.twitter && (
                  <li>
                    <Link
                      href={contactInfo.socialLinks.twitter}
                      aria-label="Twitter"
                      target="_blank"
                    >
                      <i className="fa-brands fa-twitter"></i>
                    </Link>
                  </li>
                )}
                {contactInfo.socialLinks?.youtube && (
                  <li>
                    <Link
                      href={contactInfo.socialLinks.youtube}
                      aria-label="YouTube"
                      target="_blank"
                    >
                      <i className="fa-brands fa-youtube"></i>
                    </Link>
                  </li>
                )}
                {contactInfo.socialLinks?.instagram && (
                  <li>
                    <Link
                      href={contactInfo.socialLinks.instagram}
                      aria-label="Instagram"
                      target="_blank"
                    >
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </li>
                )}
                {contactInfo.socialLinks?.linkedin && (
                  <li>
                    <Link
                      href={contactInfo.socialLinks.linkedin}
                      aria-label="LinkedIn"
                      target="_blank"
                    >
                      <i className="fa-brands fa-linkedin-in"></i>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
            <div className="footer__single ">
              <div className="footer__head">
                <h5 className="h5">Meet with photodit</h5>
              </div>
              <div className="footer__list">
                <ul>
                  <li>
                    <Link href="about-us">
                      <i className="fa-solid fa-angle-right"></i>About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="contact-us">
                      <i className="fa-solid fa-angle-right"></i>Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="blog">
                      <i className="fa-solid fa-angle-right"></i>News & Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="contact-us">
                      <i className="fa-solid fa-angle-right"></i>Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
            <div className="footer__single ">
              <div className="footer__head">
                <h5 className="h5">get in touch</h5>
              </div>
              <div className="footer__address">
                <ul>
                  {contactInfo.address && (
                    <li>
                      <Link
                        href={
                          contactInfo.googleMapUrl || "https://maps.google.com"
                        }
                        target="_blank"
                      >
                        <i className="fa-solid fa-location-dot"></i>
                        {contactInfo.address}
                      </Link>
                    </li>
                  )}
                  {contactInfo.email && (
                    <li>
                      <Link href={`mailto:${contactInfo.email}`}>
                        <i className="fa-solid fa-envelope"></i>
                        {contactInfo.email}
                      </Link>
                    </li>
                  )}
                  {contactInfo.phone && (
                    <li>
                      <Link
                        href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                      >
                        <i className="fa-solid fa-phone-volume"></i>
                        {contactInfo.phone}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="footer__bottom">
              <div className="row align-items-center">
                <div className="col-12 col-lg-7">
                  <div className="footer__nav">
                    <ul>
                      <li>
                        <Link href="about-us">
                          <i className="fa-solid fa-angle-right"></i>Privacy
                          Policy
                        </Link>
                      </li>
                      <li>
                        <Link href="about-us">
                          <i className="fa-solid fa-angle-right"></i>Terms &
                          Conditions
                        </Link>
                      </li>
                      <li>
                        <Link href="sign-in">
                          <i className="fa-solid fa-angle-right"></i>Free Trial
                        </Link>
                      </li>
                      <li>
                        <Link href="pricing">
                          <i className="fa-solid fa-angle-right"></i>Payment
                        </Link>
                      </li>
                      <li>
                        <Link href="contact-us">
                          <i className="fa-solid fa-angle-right"></i>Contact Us
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-12 col-lg-5">
                  <div className="footer__copy text-center text-lg-end">
                    <p>
                      Copyright &copy; {new Date().getFullYear()}{" "}
                      <Link href="/">Photodit</Link> All Rights Reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterOne;
