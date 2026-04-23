// src/components/NewPatientModal.jsx
import React, { useState, useEffect, forwardRef } from "react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// 1. The Glitch-Free, Auto-Slashing Smart Text Box
const SmartDateInput = forwardRef(
  ({ value, onClick, onChange, onBlur, onDateTyped }, ref) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const parseTypedDate = (dateString) => {
      if (!dateString || dateString.length !== 10) return null;
      const parts = dateString.split("/");
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (day < 1 || day > 31 || month < 1 || month > 12) return null;
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day ||
        date > new Date()
      ) {
        return null;
      }
      return date;
    };

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

      // When the date is fully complete, parse it
      if (formattedDate.length === 10) {
        const parsedDate = parseTypedDate(formattedDate);
        if (parsedDate) {
          console.log("Date parsed:", parsedDate);
          // Notify parent with the parsed date
          if (onDateTyped) {
            onDateTyped(parsedDate);
          }
          // Also call the standard onChange for DatePicker
          onChange(parsedDate);
        }
      } else if (formattedDate.length === 0) {
        if (onDateTyped) {
          onDateTyped(null);
        }
        onChange(null);
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
        onBlur={onBlur}
        ref={ref}
        required
      />
    );
  },
);

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

  const [dobError, setDobError] = useState(""); // Track DOB validation errors

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
      setDobError("");
    }
  }, [isOpen, patientCount]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper function to parse DD/MM/YYYY string to Date object
  const parseDate = (dateString) => {
    if (!dateString || dateString.length !== 10) return null;

    const parts = dateString.split("/");
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Validate ranges
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return null;
    }

    const date = new Date(year, month - 1, day);

    // Check if the date is valid and not in the future
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day ||
      date > new Date()
    ) {
      return null;
    }

    return date;
  };

  const handleDateChange = (date) => {
    // This fires whether they click the calendar OR type a valid date!
    console.log("handleDateChange called with:", date);
    setFormData({ ...formData, dob: date });
    // Clear error when they select a valid date
    if (date) {
      setDobError("");
    }
  };

  // Called when user types a complete date in the input
  const handleDateTyped = (date) => {
    console.log("handleDateTyped called with:", date);
    if (date) {
      setFormData({ ...formData, dob: date });
      setDobError("");
    }
  };

  // When the user finishes typing a date string, validate it
  const handleDateInputBlur = (e) => {
    const dateString = e.target.value;
    console.log("handleDateInputBlur called with:", dateString);
    // If the field is empty, clear the error
    if (!dateString) {
      setDobError("");
      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate DOB before submission
    if (!formData.dob) {
      setDobError("Date of birth is required");
      return;
    }

    // Validate all required fields
    if (!formData.name.trim()) {
      alert("Please enter a patient name");
      return;
    }
    if (!formData.address.trim()) {
      alert("Please enter a patient address");
      return;
    }

    try {
      // Format the synced Date object back to a simple string for your table
      const day = String(formData.dob.getDate()).padStart(2, "0");
      const month = String(formData.dob.getMonth() + 1).padStart(2, "0");
      const year = formData.dob.getFullYear();
      const formattedDob = `${day}/${month}/${year}`;

      const patientToSave = {
        name: formData.name.trim(),
        id: formData.id,
        dob: formattedDob,
        address: formData.address.trim(),
      };

      console.log("Saving patient:", patientToSave);

      // Save patient with all data including DOB
      onSave(patientToSave);

      setDobError("");
      onClose();
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Error saving patient. Please try again.");
    }
  };

  // Cleaner variable to check if the form is invalid
  const isFormInvalid =
    !formData.name || !formData.address || !formData.dob || dobError;

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
                customInput={
                  <SmartDateInput
                    onBlur={handleDateInputBlur}
                    onDateTyped={handleDateTyped}
                  />
                }
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                openToDate={new Date(2000, 0, 1)} // If they use the calendar, start at 2000
                maxDate={new Date()}
              />
            </div>
            {dobError && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "0.875rem",
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>⚠</span> {dobError}
              </div>
            )}
            <p
              style={{
                color: "#64748b",
                fontSize: "0.75rem",
                marginTop: "0.5rem",
                marginBottom: 0,
              }}
            >
              Must be a valid past date (DD/MM/YYYY)
            </p>
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
            <button
              type="submit"
              className="btn-save"
              disabled={isFormInvalid}
              style={{
                backgroundColor: "rgb(13, 100, 102)",
                color: "#ffffff",
                border: "none",
                opacity: isFormInvalid ? 0.5 : 1,
                cursor: isFormInvalid ? "not-allowed" : "pointer",
              }}
            >
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
