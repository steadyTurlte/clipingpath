import React, { useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

interface Category {
  id: number;
  name: string;
  filter: string;
}

interface PortfolioItem {
  id: number;
  category: string;
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
}

interface PortfolioMainProps {
  data?: {
    categories?: Category[];
    items?: PortfolioItem[];
  };
  categories?: Category[];
  items?: PortfolioItem[];
}

const PortfolioMain = ({ data, categories, items }: PortfolioMainProps) => {
  const [activeFilter, setActiveFilter] = useState("*");

  // Default categories if none provided
  const defaultCategories = [
    { id: 1, name: 'All', filter: '*' },
    { id: 2, name: 'Photo Retouch', filter: '.retouch' },
    { id: 3, name: 'Background Remove', filter: '.background' },
    { id: 4, name: 'Clipping Path', filter: '.path' },
    { id: 5, name: 'Color Correction', filter: '.color' },
    { id: 6, name: 'Drop Shadow', filter: '.drop' },
    { id: 7, name: 'E-commerce Image', filter: '.ecommerce' }
  ];

  // Default items if none provided
  const defaultItems = [
    {
      id: 1,
      category: 'retouch',
      beforeImage: '/images/after/one-before.png',
      afterImage: '/images/after/one-after.png',
      title: 'Photo Retouch Example',
      description: 'Professional photo retouching service'
    },
    {
      id: 2,
      category: 'background',
      beforeImage: '/images/after/two-before.png',
      afterImage: '/images/after/two-after.png',
      title: 'Background Removal Example',
      description: 'Clean background removal service'
    },
    {
      id: 3,
      category: 'path',
      beforeImage: '/images/after/three-before.png',
      afterImage: '/images/after/three-after.png',
      title: 'Clipping Path Example',
      description: 'Precise clipping path service'
    },
    {
      id: 4,
      category: 'color',
      beforeImage: '/images/after/four-before.png',
      afterImage: '/images/after/four-after.png',
      title: 'Color Correction Example',
      description: 'Professional color correction service'
    }
  ];

  // Use provided data or defaults
  const displayCategories = data?.categories || categories || defaultCategories;
  const displayItems = data?.items || items || defaultItems;

  const handleTabClick = (filter: string) => {
    setActiveFilter(filter);
  };
  return (
    <div className="section portfolio">
      <style jsx global>{`
        .portfolio__item-info {
          padding: 16px;
          background-color: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .portfolio__item-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .portfolio__item-description {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 0;
        }
      `}</style>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              className="portfolio__filter-btns "
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              {displayCategories.map((category) => (
                <button
                  key={category.id}
                  aria-label="Filter Items"
                  className={activeFilter === category.filter ? "active" : ""}
                  onClick={() => handleTabClick(category.filter)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="row grid">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className={`col-12 col-md-6 col-xl-4 grid-item ${item.category} ${
                activeFilter === `.${item.category}` || activeFilter === "*"
                  ? ""
                  : "hidden"
              }`}
            >
              <div className="portfolio__single-item">
                <div className="rangu">
                  <ReactCompareSlider
                    itemOne={
                      <ReactCompareSliderImage
                        src={item.afterImage}
                        alt={`After: ${item.title}`}
                      />
                    }
                    itemTwo={
                      <ReactCompareSliderImage
                        src={item.beforeImage}
                        alt={`Before: ${item.title}`}
                      />
                    }
                  />
                </div>
                {item.title && (
                  <div className="portfolio__item-info">
                    <h4 className="portfolio__item-title">{item.title}</h4>
                    {item.description && (
                      <p className="portfolio__item-description">{item.description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioMain;
