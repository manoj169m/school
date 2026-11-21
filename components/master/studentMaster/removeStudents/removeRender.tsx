"use client";

import React, { useState } from "react";

import RemoveStudentSelectionForm from "./studentDeleteSelectionForm";



const RemoveSelectionPage: React.FC = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Handler to set the form as submitted
  const handleFormSubmit = () => {
    setIsFormSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <RemoveStudentSelectionForm onFormSubmit={handleFormSubmit} />

      {/* Additional Details Section */}
      {isFormSubmitted && (
        <div>
         Deleted
        </div>
      )}
    </div>
  );
};

export default RemoveSelectionPage;
