// src/components/NewPatientModal.jsx
import React, { useState, useEffect, forwardRef } from "react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// 1. We create the "Smart Text Box" as a custom component
// 1. The Glitch-Free, Auto-Slashing Smart Text Box
const SmartDateInput = forwardRef(({ value, onClick, onChange }, ref) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleType = (e) => {
    // Detect if the user is pressing the Backspace/Delete key
    const isDeleting = e.nativeEvent.inputType === "deleteContentBackward";

    // 1. Strip out everything except numbers
    let rawNum = e.target.value.replace(/\D/g, "");

    // 2. Stop at 8 digits
    if (rawNum.length > 8) {
      rawNum = rawNum.slice(0, 8);
    }

    // 3. Format with slashes for the numbers we already have
    let formattedDate = rawNum;
    if (rawNum.length > 2 && rawNum.length <= 4) {
      formattedDate = `${rawNum.slice(0, 2)}/${rawNum.slice(2)}`;
    } else if (rawNum.length > 4) {
      formattedDate = `${rawNum.slice(0, 2)}/${rawNum.slice(2, 4)}/${rawNum.slice(4)}`;
    }

    // 4. THE MAGIC: Auto-append the slash IMMEDIATELY, but ONLY if we are typing forward!
    if (!isDeleting) {
      if (rawNum.length === 2) formattedDate += "/";
      if (rawNum.length === 4) formattedDate += "/";
    }

    // Update what the user sees
    setLocalValue(formattedDate);

    // Only talk to the calendar when the date is fully complete or fully empty
    if (formattedDate.length === 10 || formattedDate.length === 0) {
      onChange({ target: { value: formattedDate } });
    }
  };

  return (
    <input
      type="text"
      className="form-input"
      placeholder="DD/MM/YYYY"
      value={localValue || ""}
      onClick={onClick}
      onChange={handleType}
      ref={ref}
      required
    />
  );
});
export default function NewPatientModal({
  isOpen,
  onClose,
  onSave,
  patientCount,
}) {
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    dob: null, // DatePicker uses a null/Date object
    address: "",
  });

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const yy = String(today.getFullYear()).slice(-2);
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");

      const nextNum = String(patientCount + 1).padStart(3, "0");
      const newId = `${yy}${mm}${dd}-${nextNum}`;

      setFormData({
        name: "",
        id: newId,
        dob: null, // Keep the box blank initially so they can just start typing
        address: "",
      });
    }
  }, [isOpen, patientCount]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    // This fires whether they click the calendar OR type a valid date!
    setFormData({ ...formData, dob: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formattedDob = "";
    if (formData.dob) {
      // Format the synced Date object back to a simple string for your table
      const day = String(formData.dob.getDate()).padStart(2, "0");
      const month = String(formData.dob.getMonth() + 1).padStart(2, "0");
      const year = formData.dob.getFullYear();

      formattedDob = `${day}/${month}/${year}`;
    } else {
      alert("Please enter a valid Date of Birth");
      return;
    }

    onSave({
      ...formData,
      dob: formattedDob,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Patient</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Sokha Chea"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>ID Number (Auto-Generated)</label>
            <input
              type="text"
              name="id"
              readOnly
              value={formData.id}
              className="form-input"
              style={{
                backgroundColor: "#f8fafc",
                color: "#64748b",
                cursor: "not-allowed",
              }}
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <div className="datepicker-wrapper">
              <DatePicker
                selected={formData.dob}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                // 2. We inject our Smart Box here!
                customInput={<SmartDateInput />}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                openToDate={new Date(2000, 0, 1)} // If they use the calendar, start at 2000
                maxDate={new Date()}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              required
              placeholder="e.g. Toul Kork, Phnom Penh"
              value={formData.address}
              onChange={handleChange}
              className="form-input textarea"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
