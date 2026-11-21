"use client";

import React, { useState } from "react";
import EmpUpdateHeaderAndLinks from "./updateEmpForm";
import EmpUpdateSelection_Form from "./EmpUpdateSelectionForm";

const EmpUpdateSelectionPage: React.FC = () => {
  // State to track form submission
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Handler to set the form as submitted
  const handleFormSubmit = () => {
    setIsFormSubmitted(true); // Trigger display of additional details
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <EmpUpdateSelection_Form onFormSubmit={handleFormSubmit} />

      {/* Additional Details Section */}
      {isFormSubmitted && (
        <div>
          <EmpUpdateHeaderAndLinks />
        </div>
      )}
    </div>
  );
};

export default EmpUpdateSelectionPage;
