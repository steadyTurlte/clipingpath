import React from "react";
import Image from "next/image";
import Link from "next/link";
import large from "public/images/team/large.png";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  social: {
    facebook: string;
    twitter: string;
    instagram?: string;
    linkedin: string;
  };
}

interface TeamData {
  subtitle: string;
  title: string;
  description: string;
  largeImage: string;
  members: TeamMember[];
}

interface TeamMainSecProps {
  teamData: TeamData;
}

const TeamMainSec = ({ teamData }: TeamMainSecProps) => {
  const team = {
    ...teamData,
  };
  return (
    <section className="section team-main pb-0">
      <div className="container">
        <div className="row align-items-center section__header--alt">
          <div className="col-12 col-xl-6 col-xxl-5">
            <div className="section__header">
              <h2
                className="h2 title "
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                {team.title}
              </h2>
            </div>
          </div>
          <div className="col-12 col-xl-6 col-xxl-5 offset-xxl-2">
            <div
              className="paragraph "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <p>{team.description}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="section__header">
              <Image
                src={team.largeImage || large}
                alt="Team Image"
                width={1410}
                height={605}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
        <div className="row gaper">
          {team.members &&
            team.members.map((member, index) => (
              <div
                className="col-12 col-md-6 col-xxl-4"
                key={member.id || index}
              >
                <div
                  className="team-main__single "
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay={index % 3 === 0 ? "600" : "100"}
                >
                  <div className="thumb">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={300}
                      height={300}
                    />
                  </div>
                  <div className="single">
                    <div className="content">
                      <h5 className="h5">{member.name}</h5>
                      <p>{member.position}</p>
                    </div>
                    <ul className="social">
                      {member.social.facebook && (
                        <li>
                          <Link
                            href={member.social.facebook}
                            aria-label="Facebook"
                          >
                            <i className="fa-brands fa-facebook-f"></i>
                          </Link>
                        </li>
                      )}
                      {member.social.twitter && (
                        <li>
                          <Link
                            href={member.social.twitter}
                            aria-label="Twitter"
                          >
                            <i className="fa-brands fa-twitter"></i>
                          </Link>
                        </li>
                      )}
                      {member.social.instagram && (
                        <li>
                          <Link
                            href={member.social.instagram}
                            aria-label="Instagram"
                          >
                            <i className="fa-brands fa-instagram"></i>
                          </Link>
                        </li>
                      )}
                      {member.social.linkedin && (
                        <li>
                          <Link
                            href={member.social.linkedin}
                            aria-label="LinkedIn"
                          >
                            <i className="fa-brands fa-linkedin-in"></i>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMainSec;
