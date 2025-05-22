import React from 'react';
import BeforeAfterComparison from './BeforeAfterComparison';
import Image from 'next/image';

interface BeforeAfterComparisonWrapperProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
}

/**
 * A wrapper component for BeforeAfterComparison that handles Next.js Image optimization
 * This is needed because BeforeAfterComparison uses regular img tags which don't work with Next.js Image optimization
 */
const BeforeAfterComparisonWrapper: React.FC<BeforeAfterComparisonWrapperProps> = ({
  beforeImage,
  afterImage,
  alt
}) => {
  // Create URLs that will bypass Next.js Image optimization
  // This is necessary because BeforeAfterComparison uses regular img tags
  const beforeImageUrl = beforeImage?.startsWith('/images/')
    ? `${beforeImage}?unoptimized=true`
    : beforeImage;

  const afterImageUrl = afterImage?.startsWith('/images/')
    ? `${afterImage}?unoptimized=true`
    : afterImage;

  // Swap the before and after images to fix the issue where they appear reversed on the main website
  return (
    <BeforeAfterComparison
      beforeImage={afterImageUrl}  // Swapped: using afterImage as beforeImage
      afterImage={beforeImageUrl}  // Swapped: using beforeImage as afterImage
      alt={alt}
    />
  );
};

export default BeforeAfterComparisonWrapper;
