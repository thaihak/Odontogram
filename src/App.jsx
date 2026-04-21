import React, { useState } from "react";
import { DentalProvider } from "./context/DentalContext";

import OdontogramChart from "./components/OdontogramChart";
import ConditionSidebar from "./components/ConditionSidebar";
import SingleToothEditor from "./components/SingleToothEditor";
import SummaryModal from "./components/SummaryModal";
import SvgPatternDefs from "./components/SvgPatternDefs";
import Patients from "./pages/Patients"; // <-- Don't forget to import this

export default function App() {
  // 1. Setup state for routing and selected patient
  const [activeView, setActiveView] = useState("patients");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // 2. Handle what happens when a patient is clicked
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setActiveView("odontogram");
  };

  return (
    <DentalProvider>
      <SvgPatternDefs />

      <div className="main-content" id="appContainer">
        {/* Render Patients List */}
        {activeView === "patients" && (
          <Patients onPatientSelect={handlePatientSelect} />
        )}

        {/* Render Odontogram & its sidebars */}
        {activeView === "odontogram" && (
          <>
            {/* Pass the patient prop so the chart knows who is loaded */}
            <OdontogramChart patient={selectedPatient} />

            {/* Keep these tied to the odontogram view so they don't overlay the patient list */}
            <SingleToothEditor />
            <ConditionSidebar />
          </>
        )}
      </div>
      <SummaryModal />
    </DentalProvider>
  );
}
