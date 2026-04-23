import React, { useState } from "react";
import { DentalProvider, useDental } from "./context/DentalContext";

// Imports
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import DentalSpace from "./pages/DentalSpace";
import OdontogramChart from "./components/OdontogramChart";
import ConditionSidebar from "./components/ConditionSidebar";
import SingleToothEditor from "./components/SingleToothEditor";
import SummaryModal from "./components/SummaryModal";
import SvgPatternDefs from "./components/SvgPatternDefs";

function AppContent() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showOdontogram, setShowOdontogram] = useState(false);

  const { state } = useDental();
  const { sidebarOpen, sidebarPosition, editorOpen } = state.ui;
  let mainContentClass = "main-content";
  if (
    (sidebarOpen || editorOpen) &&
    (activeView === "odontogram" || showOdontogram)
  ) {
    mainContentClass += ` sidebar-open-${sidebarPosition}`;
  }

  return (
    <>
      <SvgPatternDefs />

      {activeView === "dashboard" && (
        <Dashboard onNewEncounter={() => setActiveView("patients")} />
      )}

      {activeView === "patients" && (
        <Patients
          onPatientSelect={(patient) => {
            setSelectedPatient(patient);
            setActiveView("dentalspace");
          }}
          onBack={() => setActiveView("dashboard")}
        />
      )}

      <div className={mainContentClass}>
        {activeView === "dentalspace" && (
          <>
            {!showOdontogram ? (
              <DentalSpace
                patient={selectedPatient}
                onBack={() => setActiveView("patients")}
                onOpenOdontogram={() => setShowOdontogram(true)}
              />
            ) : (
              <>
                <OdontogramChart
                  patient={selectedPatient}
                  onBack={() => setShowOdontogram(false)}
                />
                <SingleToothEditor />
                <ConditionSidebar />
              </>
            )}
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
