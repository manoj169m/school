import React from "react";

export default function DairyRemainderCard() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <h2 className="text-custom-pink-300 text-xl font-bold mb-4">
        Dairy Remainder !
      </h2>

      {/* Grid Section */}
      <div className="grid grid-cols-6 gap-4 text-custom-pink-300 font-semibold text-center">
        {/* Row 1 */}
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg"></div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">PRE KG</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">LKG</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">UKG</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">I</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">II</div>

        {/* Row 2 */}
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg"></div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">III</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">IV</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">V</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">VI</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">VII</div>

        {/* Row 3 */}
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg"></div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">VIII</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">IX</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">X</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">XI</div>
        <div className="col-span-1 bg-custom-pink-100 p-6 rounded-lg">XII</div>
      </div>
    </div>
  );
}
