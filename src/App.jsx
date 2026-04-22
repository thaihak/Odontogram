import React, { useState } from "react";
import { DentalProvider, useDental } from "./context/DentalContext";

// Imports
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import OdontogramChart from "./components/OdontogramChart";
import ConditionSidebar from "./components/ConditionSidebar";
import SingleToothEditor from "./components/SingleToothEditor";
import SummaryModal from "./components/SummaryModal";
import SvgPatternDefs from "./components/SvgPatternDefs";

function AppContent() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { state } = useDental();
  const { sidebarOpen, sidebarPosition, editorOpen } = state.ui;
  let mainContentClass = "main-content";
  if ((sidebarOpen || editorOpen) && activeView === "odontogram") {
    mainContentClass += ` sidebar-open-${sidebarPosition}`;
  }

  return (
    <>
      <SvgPatternDefs />

      <div className={mainContentClass}>
        {activeView === "dashboard" && (
          <Dashboard onNewEncounter={() => setActiveView("patients")} />
        )}

        {activeView === "patients" && (
          <Patients
            onPatientSelect={(patient) => {
              setSelectedPatient(patient);
              setActiveView("odontogram");
            }}
          />
        )}

        {activeView === "odontogram" && (
          <>
            <OdontogramChart patient={selectedPatient} />
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
