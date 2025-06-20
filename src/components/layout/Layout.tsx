import React, { Fragment, useState } from "react";
import Head from "next/head";
import HeaderOne from "./Header/HeaderOne";
import FooterOne from "./Footer/FooterOne";
import ScrollProgressBtn from "./ScrollProgressBtn/ScrollProgressBtn";

type LayoutProps = {
  children: React.ReactNode;
  settings?: any;
  title?: string;
  description?: string;
  keywords?: string;
};

const Layout = ({
  children,
  settings,
  title = "Photodit | Clipping Path Service React NextJs Template",
  description = "Clipping Path Service React NextJs Template",
  keywords = "photodit, image editing, edit, react",
}: LayoutProps) => {
  const [openNav, setOpenNav] = useState(false);

  const handleNav = () => {
    setOpenNav(!openNav);
  };

  const combinedClasses = "my-app";

  return (
    <Fragment>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="shortcut icon"
          href={settings?.site?.favicon || "/favicon.png"}
          type="image/x-icon"
        />
        <title>{settings?.site?.title || title}</title>
        <meta name="keywords" content={settings?.site?.keywords || keywords} />
        <meta
          name="description"
          content={settings?.site?.description || description}
        />
      </Head>
      <div className={`${combinedClasses}${openNav ? " body-active" : " "}`}>
        <HeaderOne
          openNav={openNav}
          handleNav={handleNav}
          setOpenNav={setOpenNav}
        />
        <main>{children}</main>
        <FooterOne />
        <ScrollProgressBtn />
      </div>
    </Fragment>
  );
};

export default Layout;
