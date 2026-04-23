import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  ClipboardList,
  Image as ImageIcon,
  Stethoscope,
  ChevronDown as SelectIcon,
  Activity,
  FileText,
  AlertCircle,
} from "lucide-react";

// Reusable UI Components
const Card = ({ children, className = "" }) => (
  <div className={`card ${className}`}>{children}</div>
);

const TextAreaField = ({ label, placeholder, minHeight = "80px" }) => (
  <div className="textarea-field">
    <label className="textarea-label">{label}</label>
    <textarea
      className="textarea-input"
      style={{ minHeight }}
      placeholder={placeholder}
    />
  </div>
);

// Main Application Component
export default function App({ patient, onBack, onOpenOdontogram }) {
  return (
    <div className="app-container">
      {/* Header (Fixed) */}
      <header className="app-header">
        <div className="header-group">
          {onBack && (
            <button className="btn-back" onClick={onBack}>
              <ArrowLeft className="icon-sm" />
              Back
            </button>
          )}
          <div className="header-divider"></div>
          <h1 className="header-title">
            Dental Encounter{" "}
            <span className="header-subtitle">
              — {patient?.name || "Unknown Patient"}
            </span>
          </h1>
        </div>
        <div className="header-group">
          <button className="btn-save">
            <Save className="icon-sm" />
            Save
          </button>
          <button className="btn-complete">
            <CheckCircle className="icon-sm" />
            Sign & Complete
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout - No Page Scroll */}
      <main className="main-content">
        {/* Column 1: Clinical Notes (Continuous Scroll) */}
        <Card className="col-notes">
          <div className="col-notes-header">
            <div className="col-notes-title">
              <ClipboardList className="icon-md text-gray" />
              <h2>Clinical Notes</h2>
            </div>
          </div>

          <div className="notes-scroll-area">
            {/* Chief Complaint */}
            <div className="section-container">
              <h3 className="section-header">
                <ClipboardList className="icon-sm text-teal" /> Chief Complaint
                & History
              </h3>
              <div className="section-body">
                <TextAreaField
                  label="Chief Complaint"
                  placeholder="Patient's primary reason for visit..."
                  minHeight="80px"
                />
                <TextAreaField
                  label="Medical / Dental History"
                  placeholder="Relevant medical conditions, allergies, past dental work..."
                  minHeight="100px"
                />
              </div>
            </div>

            {/* Examination */}
            <div className="section-container">
              <h3 className="section-header">
                <Activity className="icon-sm text-teal" /> Clinical Examination
              </h3>
              <div className="section-body">
                <TextAreaField
                  label="Extraoral Examination"
                  placeholder="TMJ, lymph nodes, facial symmetry..."
                  minHeight="60px"
                />
                <TextAreaField
                  label="Intraoral - Soft Tissue"
                  placeholder="Mucosa, tongue, floor of mouth, palate..."
                  minHeight="60px"
                />
                <TextAreaField
                  label="Intraoral - Hard Tissue"
                  placeholder="Detailed intraoral findings, existing restorations..."
                  minHeight="80px"
                />
                <div className="grid-2">
                  <TextAreaField
                    label="Occlusion"
                    placeholder="Class I/II/III..."
                    minHeight="60px"
                  />
                  <TextAreaField
                    label="Hygiene"
                    placeholder="Plaque, calculus..."
                    minHeight="60px"
                  />
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="section-container">
              <h3 className="section-header">
                <FileText className="icon-sm text-teal" /> Diagnosis
              </h3>
              <div className="section-body section-body-last">
                <TextAreaField
                  label="Diagnosis Summary"
                  placeholder="List of current diagnoses..."
                  minHeight="100px"
                />
                <TextAreaField
                  label="Caries Risk Assessment"
                  placeholder="Low / Moderate / High with reasoning..."
                  minHeight="60px"
                />
                <div className="alert-box">
                  <AlertCircle className="icon-md text-amber" />
                  <p className="alert-text">
                    Ensure all diagnoses align with the documented intraoral
                    examination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Column 2: Interactive Charting */}
        <div className="col-interactive">
          <Card className="card-odontogram">
            <div className="odontogram-header">
              <Stethoscope className="icon-md text-dark" strokeWidth={2} />
              <h2 className="odontogram-title">Odontogram</h2>
            </div>

            <div className="odontogram-content">
              <div className="tooth-graphic-container">
                <img
                  src="/normal-img/Frame.png"
                  alt="Dental chart"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <p className="odontogram-desc">
                Interactive multi-view dental chart with surface-level condition
                mapping
              </p>
            </div>

            <button className="btn-open-chart" onClick={onOpenOdontogram}>
              <Stethoscope className="icon-md" />
              Open Odontogram
            </button>
          </Card>

          <Card className="card-procedures">
            <div className="proc-header">
              <h2 className="proc-title">Procedures Performed</h2>
              <span className="proc-badge">0 items</span>
            </div>

            <div className="select-container">
              <select defaultValue="" className="select-input">
                <option value="" disabled>
                  Search and add procedure code (e.g. D1110)...
                </option>
              </select>
              <SelectIcon className="icon-sm select-icon" />
            </div>

            <div className="empty-procedures">
              <p className="empty-text">
                No procedures logged for today's encounter.
              </p>
            </div>
          </Card>
        </div>

        {/* Column 3: Reference & Planning */}
        <div className="col-reference">
          <Card className="card-half">
            <div className="panel-header">
              <div className="panel-title-wrapper">
                <ImageIcon className="icon-md text-gray" />
                <h2 className="panel-title">Dental Images</h2>
              </div>
              <button className="link-upload">Upload</button>
            </div>

            <div className="tabs-scroll">
              <button className="tab-button active">All</button>
              <button className="tab-button">PA</button>
              <button className="tab-button">BW</button>
              <button className="tab-button">OPG</button>
            </div>

            <div className="empty-images">
              <ImageIcon className="icon-lg text-light" strokeWidth={1.5} />
              <p className="empty-images-text">No images</p>
            </div>
          </Card>

          <Card className="card-half plan-card">
            <div className="panel-header">
              <div className="panel-title-wrapper">
                <FileText className="icon-md text-gray" />
                <h2 className="panel-title">Treatment Plan</h2>
              </div>
            </div>

            <div className="plan-container">
              <textarea
                className="plan-textarea"
                placeholder="Outline the proposed treatment plan, phases, and notes for the front desk..."
              />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
