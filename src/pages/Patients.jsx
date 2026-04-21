// src/pages/Patients.jsx
import React, { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import NewPatientModal from "../components/NewPatientModal";

// 1. Rename to initial data (moved outside so it doesn't recreate on every render)
const INITIAL_PATIENTS = [
  {
    id: "260421-001",
    name: "Sokha Chea",
    dob: "March 31, 1996",
    address: "Toul Kork, Phnom Penh",
  },
  {
    id: "260421-002",
    name: "Mony Sovann",
    dob: "March 21, 2003",
    address: "Daun Penh, Phnom Penh",
  },
  {
    id: "260421-003",
    name: "Bopha Heng",
    dob: "August 12, 1988",
    address: "Chamkar Mon, Phnom Penh",
  },
  {
    id: "260421-004",
    name: "Rithy Ouk",
    dob: "November 05, 1975",
    address: "7 Makara, Phnom Penh",
  },
  {
    id: "260421-005",
    name: "Chenda Meas",
    dob: "April 15, 1990",
    address: "Chbar Ampov, Phnom Penh",
  },
  {
    id: "260421-006",
    name: "Makara Tep",
    dob: "January 22, 1982",
    address: "Sen Sok, Phnom Penh",
  },
];

export default function Patients({ onPatientSelect }) {
  // 2. Put the patients list into React State!
  const [patients, setPatients] = useState(INITIAL_PATIENTS);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. Update state when the modal sends back new patient data
  const handleSavePatient = (newPatientData) => {
    // This takes all existing patients (...patients) and adds the new one at the end
    setPatients([...patients, newPatientData]);
  };

  // Optional: Make the search bar actually work!
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.includes(searchTerm),
  );

  return (
    <div className="patients-page">
      {/* ... (Header stays exactly the same) ... */}
      <header className="patients-header">
        <div className="header-tabs">
          <button className="tab-active">PATIENTS</button>
          <button className="tab-inactive">APPOINTMENTS</button>
          <button className="tab-inactive">REPORTS</button>
        </div>
        <div className="header-user">
          <span className="user-name">Hak</span>
          <button className="btn-settings">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <div className="action-bar">
        <div className="search-wrapper">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          className="btn-new-patient"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          NEW PATIENT
        </button>
      </div>

      <div className="patients-table">
        <div className="table-header">
          <div>Name</div>
          <div>ID Number</div>
          <div>Date of Birth</div>
          <div>Address</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="table-body">
          {/* 4. Map over the FILTERED state array instead of the dummy array */}
          {filteredPatients.map((patient, index) => (
            <div
              key={patient.id} // Better to use ID as key than index
              className="table-row"
              onClick={() => onPatientSelect && onPatientSelect(patient)}
            >
              <div className="patient-info">
                <div className="patient-avatar">{index + 1}</div>
                <span className="patient-name">{patient.name}</span>
              </div>

              <div className="text-cell">{patient.id}</div>
              <div className="text-cell">{patient.dob}</div>
              <div className="text-cell text-truncate">{patient.address}</div>

              <div className="action-cell">
                <button
                  className="btn-action"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pagination">
        {/* 5. Update the count to reflect the live state */}
        <div>
          Showing 1 to {filteredPatients.length} of {patients.length} results
        </div>
        <div className="pagination-buttons">
          <button className="btn-page">
            <ChevronLeft size={16} />
          </button>
          <button className="btn-page">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 6. Pass the live patient count to the modal for ID generation */}
      <NewPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePatient}
        patientCount={patients.length}
      />
    </div>
  );
}
