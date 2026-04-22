import React from "react";
import { useDental } from "../context/DentalContext";
import ProbingTab from "./tabs/ProbingTab";
import PathologyTab from "./tabs/PathologyTab";
import RestorationTab from "./tabs/RestorationTab";

// History tab removed from the list
const TABS = [
  { key: "probing", label: "Probing" },
  { key: "pathology", label: "Pathology" },
  { key: "restoration", label: "Restoration" },
];

export default function ConditionSidebar() {
  const { state, closeSidebar, openEditor, setActiveTab } = useDental();
  const {
    sidebarOpen,
    sidebarPosition,
    focusedToothFDI,
    activeTab,
    editorOpen,
  } = state.ui;

  if (!sidebarOpen && !editorOpen) return null;

  const sideClass = `condition-sidebar${sidebarOpen || editorOpen ? " show" : ""} sidebar-${editorOpen ? "right" : sidebarPosition}`;

  return (
    <div id="conditionSidebar" className={sideClass}>
      <div className="sidebar-header">
        <h3 id="sidebarTitle">
          {focusedToothFDI ? `Tooth ${focusedToothFDI}` : "Conditions"}
        </h3>
        <button className="close-sidebar-btn" onClick={closeSidebar}>
          &times;
        </button>
      </div>

      <div className="sidebar-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-btn${activeTab === t.key ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        id="tab-probing"
        className={`tab-content${activeTab === "probing" ? " active" : ""}`}
      >
        <ProbingTab fdi={focusedToothFDI} />
      </div>
      <div
        id="tab-pathology"
        className={`tab-content${activeTab === "pathology" ? " active" : ""}`}
      >
        <PathologyTab fdi={focusedToothFDI} />
      </div>
      <div
        id="tab-restoration"
        className={`tab-content${activeTab === "restoration" ? " active" : ""}`}
      >
        <RestorationTab fdi={focusedToothFDI} />
      </div>

      {!editorOpen && (
        <button
          className="sidebar-isolate-btn"
          id="isolateToothBtn"
          onClick={openEditor}
        >
          Open Detailed Editor
        </button>
      )}
    </div>
  );
}
