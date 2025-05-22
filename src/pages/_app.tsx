import React, { Suspense, useEffect } from "react";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// font awesome 6
import "public/font-awesome/css/all.min.css";

// custom icons
import "public/glyphter/css/photodit.css";

// aos
import AOS from "aos";
import "aos/dist/aos.css";

// main css
import "@/styles/main.scss";

// admin css
import "@/styles/admin.css";

import type { AppProps } from "next/app";

// Initialize data on the server side
if (typeof window === "undefined") {
  try {
    // Use require instead of dynamic import to avoid webpack issues
    const { getData } = require("@/utils/dataUtils");

    // Check if data files exist and have content
    const homeData = getData("home");
    const settingsData = getData("settings");
    const newsData = getData("news");
  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Suspense>
      <Component {...pageProps} />
    </Suspense>
  );
}
