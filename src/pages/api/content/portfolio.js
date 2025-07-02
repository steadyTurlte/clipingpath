import { getData, saveData } from "@/utils/dataUtils";

// Default portfolio data
const DEFAULT_PORTFOLIO_DATA = {
  banner: {
    title: "Portfolio",
    image: "",
    breadcrumbs: [
      { text: "Home", link: "/" },
      { text: "Portfolio", link: "/portfolio" },
    ],
  },
  video: {
    embedId: "fSv6UgCkuTU",
    backgroundImage: "/images/video-modal-bg.png",
  },
  categories: [
    { id: 1, name: "All", filter: "*" },
    { id: 2, name: "Photo Retouch", filter: ".retouch" },
    { id: 3, name: "Background Remove", filter: ".background" },
    { id: 4, name: "Clipping Path", filter: ".path" },
    { id: 5, name: "Color Correction", filter: ".color" },
    { id: 6, name: "Drop Shadow", filter: ".drop" },
    { id: 7, name: "E-commerce Image", filter: ".ecommerce" },
  ],
  items: [
    {
      id: 1,
      category: "retouch",
      beforeImage: "/images/after/one-before.png",
      afterImage: "/images/after/one-after.png",
      title: "Photo Retouch Example",
      description: "Professional photo retouching service",
    },
    {
      id: 2,
      category: "background",
      beforeImage: "/images/after/two-before.png",
      afterImage: "/images/after/two-after.png",
      title: "Background Removal Example",
      description: "Clean background removal service",
    },
    {
      id: 3,
      category: "path",
      beforeImage: "/images/after/three-before.png",
      afterImage: "/images/after/three-after.png",
      title: "Clipping Path Example",
      description: "Precise clipping path service",
    },
    {
      id: 4,
      category: "color",
      beforeImage: "/images/after/four-before.png",
      afterImage: "/images/after/four-after.png",
      title: "Color Correction Example",
      description: "Professional color correction service",
    },
    {
      id: 5,
      category: "drop",
      beforeImage: "/images/after/one-before.png",
      afterImage: "/images/after/one-after.png",
      title: "Drop Shadow Example",
      description: "Natural drop shadow service",
    },
    {
      id: 6,
      category: "ecommerce",
      beforeImage: "/images/after/one-before.png",
      afterImage: "/images/after/one-after.png",
      title: "E-commerce Image Example",
      description: "E-commerce ready image editing",
    },
  ],
  sponsors: {
    title: "Trusted by Leading Brands",
    logos: [
      "/images/sponsor/one.png",
      "/images/sponsor/two.png",
      "/images/sponsor/three.png",
      "/images/sponsor/four.png",
      "/images/sponsor/five.png",
    ],
  },
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      let data = await getData("portfolio");
      if (!data || Object.keys(data).length === 0) {
        await saveData("portfolio", DEFAULT_PORTFOLIO_DATA);
        data = { ...DEFAULT_PORTFOLIO_DATA };
      }
      const { section } = req.query;
      if (section) {
        if (!data[section] && DEFAULT_PORTFOLIO_DATA[section]) {
          data[section] = DEFAULT_PORTFOLIO_DATA[section];
          await saveData("portfolio", data);
          return res.status(200).json(DEFAULT_PORTFOLIO_DATA[section]);
        }
        return res.status(200).json(data[section] || {});
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  if (req.method === "PUT") {
    try {
      const { section } = req.query;
      const updatedData = req.body;
      let data = (await getData("portfolio")) || {};
      if (section) {
        data = {
          ...data,
          [section]: updatedData,
        };
      } else {
        data = updatedData;
      }
      const success = await saveData("portfolio", data);
      if (!success) {
        return res.status(500).json({ message: "Failed to save portfolio data" });
      }
      return res.status(200).json({ message: "Portfolio data updated successfully", data });
    } catch (error) {
      console.error("Error updating portfolio data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
}
