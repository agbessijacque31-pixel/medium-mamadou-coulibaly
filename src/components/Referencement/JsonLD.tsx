// components/JsonLD.tsx
import React from "react";
import { generateJSONLD, SEOProps } from "@/lib/seo";

export const JsonLD: React.FC<{ seo: SEOProps }> = ({ seo }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: generateJSONLD(seo) }}
    />
  );
};


