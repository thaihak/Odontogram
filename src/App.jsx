import React, { useState } from "react";
import { DentalProvider, useDental } from "./context/DentalContext";

import OdontogramChart from "./components/OdontogramChart";
import ConditionSidebar from "./components/ConditionSidebar";
import SingleToothEditor from "./components/SingleToothEditor";
import SummaryModal from "./components/SummaryModal";
import SvgPatternDefs from "./components/SvgPatternDefs";
import Patients from "./pages/Patients"; // <-- Don't forget to import this

function AppContent() {
  // 1. Setup state for routing and selected patient
  const [activeView, setActiveView] = useState("patients");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Get sidebar state from context
  const { state } = useDental();
  const { sidebarOpen, sidebarPosition, editorOpen } = state.ui;

  // 2. Handle what happens when a patient is clicked
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setActiveView("odontogram");
  };

  // Build className for main-content based on sidebar state
  let mainContentClass = "main-content";
  if ((sidebarOpen || editorOpen) && activeView === "odontogram") {
    mainContentClass += ` sidebar-open-${sidebarPosition}`;
  }

  return (
    <>
      <SvgPatternDefs />

      <div className={mainContentClass} id="appContainer">
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
    </>
  );
}

export default function App() {
  return (
    <DentalProvider>
      <AppContent />
    </DentalProvider>
  );
}
