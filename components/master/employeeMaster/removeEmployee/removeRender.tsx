"use client";

import React, { useState } from "react";
import EmpRemoveSelection_Form from "./EmpRemoveSelectionForm";

const EmpRemoveSelectionPage: React.FC = () => {
  // State to track form submission
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Handler to set the form as submitted
  const handleFormSubmit = () => {
    setIsFormSubmitted(true); // Trigger display of additional details
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <EmpRemoveSelection_Form onFormSubmit={handleFormSubmit} />

      {/* Additional Details Section */}
      {isFormSubmitted && (
        <div>
          removed
        </div>
      )}
    </div>
  );
};

export default EmpRemoveSelectionPage;
