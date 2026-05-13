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
  Trash2,
  UploadCloud,
} from "lucide-react";

// --- Procedure Catalog ---
const procedureCatalog = [
  {
    category: "Endodontics",
    items: [
      {
        code: "D3310",
        name: "Root Canal Treatment (Anterior)",
        khmer: "ព្យាបាលឫសធ្មេញមុខ",
        time: "60min",
        price: "$350.00",
      },
      {
        code: "D3320",
        name: "Root Canal Treatment (Premolar)",
        khmer: "ព្យាបាលឫសធ្មេញមុនថ្គាម",
        time: "75min",
        price: "$450.00",
      },
      {
        code: "D3330",
        name: "Root Canal Treatment (Molar)",
        khmer: "ព្យាបាលឫសធ្មេញថ្គាម",
        time: "90min",
        price: "$600.00",
      },
    ],
  },
  {
    category: "Examination",
    items: [
      {
        code: "D0120",
        name: "Periodic Oral Evaluation",
        khmer: "ការពិនិត្យមាត់ទៀងទាត់",
        time: "15min",
        price: "$15.00",
      },
      {
        code: "D0140",
        name: "Limited Oral Evaluation",
        khmer: "ការពិនិត្យមាត់មានកម្រិត",
        time: "15min",
        price: "$20.00",
      },
      {
        code: "D0150",
        name: "Comprehensive Oral Evaluation",
        khmer: "ការពិនិត្យមាត់ទូលំទូលាយ",
        time: "30min",
        price: "$35.00",
      },
    ],
  },
  {
    category: "Imaging",
    items: [
      {
        code: "D0210",
        name: "Full Mouth Radiographs (FMX)",
        khmer: "ថតកាំរស្មី X ពេញមាត់",
        time: "20min",
        price: "$80.00",
      },
      {
        code: "D0220",
        name: "Periapical Radiograph",
        khmer: "ថតកាំរស្មី X ជុំវិញចុងឫស",
        time: "5min",
        price: "$15.00",
      },
      {
        code: "D0272",
        name: "Bitewing Radiographs",
        khmer: "ថតកាំរស្មី X ខាំស្លាប",
        time: "10min",
        price: "$25.00",
      },
      {
        code: "D0330",
        name: "Panoramic Radiograph",
        khmer: "ថតកាំរស្មី X វិលជុំ",
        time: "10min",
        price: "$60.00",
      },
    ],
  },
  {
    category: "Orthodontics",
    items: [
      {
        code: "D8080",
        name: "Comprehensive Ortho (Adolescent)",
        khmer: "ការតម្រឹមធ្មេញ វ័យក្មេង",
        time: "60min",
        price: "$3000.00",
      },
      {
        code: "D8090",
        name: "Comprehensive Ortho (Adult)",
        khmer: "ការតម្រឹមធ្មេញ មនុស្សពេញវ័យ",
        time: "60min",
        price: "$3500.00",
      },
    ],
  },
  {
    category: "Other",
    items: [
      {
        code: "D9110",
        name: "Emergency Treatment (Palliative)",
        khmer: "ព្យាបាលបន្ទាន់",
        time: "20min",
        price: "$50.00",
      },
      {
        code: "D9230",
        name: "Nitrous Oxide Analgesia",
        khmer: "ថ្នាំស្ពឹកក្លិន N2O",
        time: "15min",
        price: "$40.00",
      },
      {
        code: "D9944",
        name: "Occlusal Guard (Night Guard)",
        khmer: "ឧបករណ៍ការពារពេលយប់",
        time: "30min",
        price: "$250.00",
      },
      {
        code: "D9972",
        name: "External Bleaching (Whitening)",
        khmer: "បំភ្លឺធ្មេញ ក្នុង១ជួរ",
        time: "45min",
        price: "$150.00",
      },
    ],
  },
  {
    category: "Pediatric",
    items: [
      {
        code: "D1120",
        name: "Prophylaxis (Child)",
        khmer: "សម្អាតធ្មេញក្មេង",
        time: "20min",
        price: "$35.00",
      },
      {
        code: "D1351",
        name: "Dental Sealant (per tooth)",
        khmer: "បិទស៊ីឡង់ធ្មេញ",
        time: "10min",
        price: "$25.00",
      },
    ],
  },
  {
    category: "Periodontics",
    items: [
      {
        code: "D4341",
        name: "Scaling & Root Planing",
        khmer: "កំចាត់គ្រាប់ថ្ម ១/៤មាត់",
        time: "45min",
        price: "$120.00",
      },
      {
        code: "D4910",
        name: "Periodontal Maintenance",
        khmer: "ថែរក្សាជំងឺអញ្ចាញ",
        time: "40min",
        price: "$80.00",
      },
    ],
  },
  {
    category: "Prophylaxis",
    items: [
      {
        code: "D1110",
        name: "Prophylaxis (Adult)",
        khmer: "សម្អាតធ្មេញមនុស្សពេញវ័យ",
        time: "30min",
        price: "$50.00",
      },
      {
        code: "D1208",
        name: "Topical Fluoride Application",
        khmer: "បិទជាតិស្ពាន់ហ្វ្លួរ",
        time: "10min",
        price: "$20.00",
      },
    ],
  },
  {
    category: "Prosthodontics",
    items: [
      {
        code: "D2740",
        name: "Porcelain/Ceramic Crown",
        khmer: "មកុដសេរ៉ាមិក",
        time: "60min",
        price: "$500.00",
      },
      {
        code: "D2750",
        name: "PFM Crown",
        khmer: "មកុដផូសេឡែន-លោហៈ",
        time: "60min",
        price: "$400.00",
      },
      {
        code: "D5110",
        name: "Complete Denture (Upper)",
        khmer: "ធ្មេញក្លែងពេញ ខាងលើ",
        time: "60min",
        price: "$800.00",
      },
      {
        code: "D5120",
        name: "Complete Denture (Lower)",
        khmer: "ធ្មេញក្លែងពេញ ខាងក្រោម",
        time: "60min",
        price: "$800.00",
      },
      {
        code: "D5213",
        name: "Partial Denture (Upper)",
        khmer: "ធ្មេញក្លែងផ្នែក ខាងលើ",
        time: "45min",
        price: "$600.00",
      },
      {
        code: "D6058",
        name: "Abutment Supported Crown",
        khmer: "មកុដលើរន្ធដោត",
        time: "60min",
        price: "$700.00",
      },
      {
        code: "D6240",
        name: "Pontic (Porcelain/Ceramic)",
        khmer: "ខ្នើសរពូថ សេរ៉ាមិក",
        time: "45min",
        price: "$450.00",
      },
    ],
  },
  {
    category: "Restorations",
    items: [
      {
        code: "D2140",
        name: "Amalgam Restoration (1 Surface)",
        khmer: "ស្ដារអាម៉ាល់ហ្គាម ១ផ្ទៃ",
        time: "30min",
        price: "$60.00",
      },
      {
        code: "D2150",
        name: "Amalgam Restoration (2 Surfaces)",
        khmer: "ស្ដារអាម៉ាល់ហ្គាម ២ផ្ទៃ",
        time: "40min",
        price: "$80.00",
      },
      {
        code: "D2330",
        name: "Resin Composite (1 Surf, Anterior)",
        khmer: "ស្ដារកុំផូហ្ស៊ីត ១ផ្ទៃ មុខ",
        time: "30min",
        price: "$75.00",
      },
      {
        code: "D2331",
        name: "Resin Composite (2 Surf, Anterior)",
        khmer: "ស្ដារកុំផូហ្ស៊ីត ២ផ្ទៃ មុខ",
        time: "40min",
        price: "$100.00",
      },
      {
        code: "D2391",
        name: "Resin Composite (1 Surf, Posterior)",
        khmer: "ស្ដារកុំផូហ្ស៊ីត ១ផ្ទៃ ក្រោយ",
        time: "35min",
        price: "$85.00",
      },
      {
        code: "D2950",
        name: "Core Buildup",
        khmer: "កសាងស្នូលធ្មេញ",
        time: "30min",
        price: "$120.00",
      },
    ],
  },
  {
    category: "Surgery",
    items: [
      {
        code: "D6010",
        name: "Endosseous Implant Placement",
        khmer: "ដាក់រន្ធដោតធ្មេញ",
        time: "90min",
        price: "$1500.00",
      },
      {
        code: "D7140",
        name: "Simple Extraction",
        khmer: "ដកធ្មេញធម្មតា",
        time: "20min",
        price: "$80.00",
      },
      {
        code: "D7210",
        name: "Surgical Extraction",
        khmer: "ដកធ្មេញវះកាត់",
        time: "45min",
        price: "$150.00",
      },
      {
        code: "D7240",
        name: "Impacted Tooth Removal",
        khmer: "ដកធ្មេញជាប់",
        time: "45min",
        price: "$200.00",
      },
      {
        code: "D7510",
        name: "Incision & Drainage of Abscess",
        khmer: "កាត់បង្ហូរពពោង",
        time: "30min",
        price: "$100.00",
      },
    ],
  },
];

// Reusable UI Components Styled with Modern Inline CSS
const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: "#ffffff",
      borderRadius: "1.25rem",
      border: "1px solid #f1f5f9",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden", // Ensures content stays inside rounded corners
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

const TextAreaField = ({
  label,
  placeholder,
  minHeight = "80px",
  isYellow = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <label
        style={{
          fontSize: "0.75rem",
          fontWeight: "700",
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: "100%",
          minHeight,
          padding: "1rem",
          borderRadius: "0.75rem",
          border: isFocused ? "1px solid #0d9488" : "1px solid #e2e8f0",
          backgroundColor: isYellow ? "#fffbeb" : "#f8fafc",
          outline: "none",
          boxSizing: "border-box",
          fontSize: "0.875rem",
          color: "#0f172a",
          resize: "vertical",
          boxShadow: isFocused
            ? "0 0 0 3px rgba(13, 148, 136, 0.1)"
            : "inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
          transition: "all 0.2s ease",
        }}
      />
    </div>
  );
};

// Main Application Component
export default function App({
  patient = { name: "Sokha Chea" },
  onBack,
  onOpenOdontogram,
}) {
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [saveHover, setSaveHover] = useState(false);
  const [completeHover, setCompleteHover] = useState(false);
  const [imageTab, setImageTab] = useState("All");

  const handleAddProcedure = (e) => {
    const code = e.target.value;
    if (!code) return;

    let foundProc = null;
    for (const category of procedureCatalog) {
      const item = category.items.find((i) => i.code === code);
      if (item) {
        foundProc = item;
        break;
      }
    }

    if (foundProc) {
      setSelectedProcedures((prev) => [
        ...prev,
        { ...foundProc, id: Date.now() + Math.random() },
      ]);
    }
    e.target.value = ""; // Reset after selection
  };

  const handleRemoveProcedure = (idToRemove) => {
    setSelectedProcedures((prev) => prev.filter((p) => p.id !== idToRemove));
  };

  const totalPrice = selectedProcedures.reduce((sum, proc) => {
    return sum + parseFloat(proc.price.replace("$", ""));
  }, 0);

  return (
    <div
      style={{
        /* FORCE FULL SCREEN OVERLAY: Breaks out of parent container's margins */
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999, // Ensure it's on top of everything else in your app
        overflowX: "hidden",
        overflowY: "auto",
        margin: 0,
        padding: 0,

        /* STYLES */
        backgroundColor: "#f8fafc",
        backgroundImage:
          "radial-gradient(ellipse at top right, rgba(204, 251, 241, 0.4), transparent), radial-gradient(ellipse at bottom left, rgba(241, 245, 249, 0.9), transparent)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Header (Fixed and Full Width) */}
      <header
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#64748b",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                fontWeight: "600",
                fontSize: "0.875rem",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f8fafc")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <div
            style={{
              width: "1px",
              height: "24px",
              backgroundColor: "#e2e8f0",
              margin: "0 0.5rem",
            }}
          ></div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            Dental Encounter{" "}
            <span style={{ color: "#cbd5e1", fontWeight: "400" }}>—</span>{" "}
            <span
              style={{
                color: "#0d9488",
                fontWeight: "600",
                fontSize: "1.125rem",
              }}
            >
              {patient?.name || "Unknown Patient"}
            </span>
          </h1>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onMouseEnter={() => setSaveHover(true)}
            onMouseLeave={() => setSaveHover(false)}
            style={{
              background: saveHover ? "#f8fafc" : "#fff",
              border: "1px solid #e2e8f0",
              color: "#475569",
              padding: "0.625rem 1.25rem",
              borderRadius: "9999px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease",
            }}
          >
            <Save size={18} /> Save
          </button>
          <button
            onMouseEnter={() => setCompleteHover(true)}
            onMouseLeave={() => setCompleteHover(false)}
            style={{
              background: completeHover
                ? "linear-gradient(to right, #0f4d4a, #0d3b39)"
                : "linear-gradient(to right, #115e59, #0f4d4a)",
              color: "white",
              padding: "0.625rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: completeHover
                ? "0 10px 15px -3px rgba(17, 94, 89, 0.2)"
                : "0 4px 6px -1px rgba(17, 94, 89, 0.1)",
              transform: completeHover ? "translateY(-1px)" : "translateY(0)",
              transition: "all 0.2s ease",
            }}
          >
            <CheckCircle size={18} strokeWidth={2.5} /> Sign & Complete
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout - Strictly Forced to 3 Columns */}
      <main
        style={{
          flex: 1,
          padding: "1.5rem",
          width: "100%",
          boxSizing: "border-box",
          display: "grid",
          // FORCED 3 COLUMNS: This strictly locks the grid to 3 equal columns, no wrapping.
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Column 1: Clinical Notes */}
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              borderBottom: "1px solid #f1f5f9",
              padding: "1.25rem",
              paddingBottom: "1rem",
            }}
          >
            <div
              style={{
                background: "#f0fdfa",
                padding: "0.5rem",
                borderRadius: "0.6rem",
                color: "#0d9488",
              }}
            >
              <ClipboardList size={20} />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.125rem",
                fontWeight: "bold",
                color: "#0f172a",
              }}
            >
              Clinical Notes
            </h2>
          </div>

          <div
            style={{
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* Section 1 */}
            <div>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#0f172a",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                  marginTop: 0,
                }}
              >
                <ClipboardList size={16} className="text-teal-600" /> Chief
                Complaint & History
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
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

            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#f1f5f9",
              }}
            ></div>

            {/* Section 2 */}
            <div>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#0f172a",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                  marginTop: 0,
                }}
              >
                <Activity size={16} className="text-teal-600" /> Clinical
                Examination
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                  }}
                >
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

            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#f1f5f9",
              }}
            ></div>

            {/* Section 3 */}
            <div>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#0f172a",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                  marginTop: 0,
                }}
              >
                <FileText size={16} className="text-teal-600" /> Diagnosis
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <TextAreaField
                  label="Diagnosis Summary"
                  placeholder="List of current diagnoses..."
                  minHeight="100px"
                />
                <TextAreaField
                  label="Caries Risk"
                  placeholder="Low / Moderate / High..."
                  minHeight="60px"
                />

                <div
                  style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    padding: "0.75rem",
                    borderRadius: "0.75rem",
                    display: "flex",
                    gap: "0.6rem",
                    alignItems: "flex-start",
                  }}
                >
                  <AlertCircle
                    size={18}
                    color="#d97706"
                    style={{ flexShrink: 0, marginTop: "0.125rem" }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "#b45309",
                      lineHeight: "1.4",
                    }}
                  >
                    Ensure all diagnoses align with findings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Column 2: Interactive Charting & Procedures */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <Card style={{ padding: "1.25rem", gap: "1rem" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <div style={{ color: "#475569" }}>
                <Stethoscope size={22} strokeWidth={2} />
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: "#0f172a",
                }}
              >
                Odontogram
              </h2>
            </div>

            <div
              style={{
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "280px",
                  aspectRatio: "16/9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f8fafc",
                  borderRadius: "0.75rem",
                  border: "1px solid #f1f5f9",
                }}
              >
                <img
                  src="/normal-img/Frame.png"
                  alt="Dental chart"
                  style={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <p
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "0.85rem",
                  margin: "0.75rem 0 0 0",
                  lineHeight: "1.5",
                }}
              >
                Interactive multi-view dental chart mapping.
              </p>
            </div>

            <button
              onClick={onOpenOdontogram}
              style={{
                width: "100%",
                background: "#115e59",
                color: "white",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#0f4d4a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#115e59")
              }
            >
              <Stethoscope size={18} />
              Open Odontogram
            </button>
          </Card>

          <Card style={{ flex: 1, padding: "1.25rem", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: "#0f172a",
                }}
              >
                Procedures
              </h2>
              <span
                style={{
                  background: "#f0fdfa",
                  color: "#0d9488",
                  border: "1px solid #ccfbf1",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                }}
              >
                {selectedProcedures.length} items
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <select
                defaultValue=""
                onChange={handleAddProcedure}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  outline: "none",
                  boxSizing: "border-box",
                  fontSize: "0.85rem",
                  appearance: "none",
                  backgroundColor: "#f8fafc",
                  cursor: "pointer",
                  color: "#0f172a",
                }}
              >
                <option value="" disabled>
                  Add procedure...
                </option>
                {procedureCatalog.map((category) => (
                  <optgroup key={category.category} label={category.category}>
                    {category.items.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} - {item.name} ({item.price})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <SelectIcon
                size={16}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {selectedProcedures.length === 0 ? (
                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "1.5rem",
                    border: "1px dashed #e2e8f0",
                    borderRadius: "0.75rem",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                    backgroundColor: "#fafaf9",
                  }}
                >
                  No procedures logged.
                </div>
              ) : (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0.5rem 0 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  {selectedProcedures.map((proc) => (
                    <li
                      key={proc.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.75rem",
                        border: "1px solid #f1f5f9",
                        borderRadius: "0.6rem",
                        backgroundColor: "#fff",
                        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.02)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                        }}
                      >
                        <strong
                          style={{ fontSize: "0.8rem", color: "#0f172a" }}
                        >
                          {proc.code} - {proc.name}
                        </strong>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color: "#64748b",
                            display: "flex",
                            gap: "0.4rem",
                            alignItems: "center",
                          }}
                        >
                          <span>{proc.time}</span>
                          <span
                            style={{
                              width: "3px",
                              height: "3px",
                              borderRadius: "50%",
                              backgroundColor: "#cbd5e1",
                            }}
                          ></span>
                          <span style={{ color: "#0d9488", fontWeight: "600" }}>
                            {proc.price}
                          </span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveProcedure(proc.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          padding: "0.4rem",
                          borderRadius: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedProcedures.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.75rem",
                  borderTop: "1px dashed #e2e8f0",
                  marginTop: "auto",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: "#64748b",
                  }}
                >
                  Total:
                </span>
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "#0f172a",
                  }}
                >
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            )}
          </Card>
        </div>

        {/* Column 3: Reference & Planning */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <Card style={{ padding: "1.25rem", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <ImageIcon size={20} className="text-slate-500" />
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#0f172a",
                  }}
                >
                  Images
                </h2>
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#0d9488",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Upload
              </button>
            </div>

            <div style={{ display: "flex", gap: "0.4rem" }}>
              {["All", "PA", "BW", "OPG"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setImageTab(tab)}
                  style={{
                    background: imageTab === tab ? "#0d9488" : "#f1f5f9",
                    color: imageTab === tab ? "#fff" : "#64748b",
                    border: "none",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div
              style={{
                padding: "2.5rem 1rem",
                border: "2px dashed #e2e8f0",
                borderRadius: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                gap: "0.5rem",
                backgroundColor: "#fafaf9",
              }}
            >
              <UploadCloud size={28} />
              <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>
                No images
              </span>
            </div>
          </Card>

          <Card style={{ flex: 1, padding: "1.25rem", gap: "1rem" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FileText size={20} className="text-slate-500" />
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: "#0f172a",
                }}
              >
                Treatment Plan
              </h2>
            </div>
            <textarea
              placeholder="Outline proposed treatment plan..."
              style={{
                width: "100%",
                minHeight: "200px",
                flex: 1,
                padding: "1rem",
                borderRadius: "0.75rem",
                border: "1px solid #fde68a",
                backgroundColor: "#fffbeb",
                outline: "none",
                boxSizing: "border-box",
                fontSize: "0.875rem",
                color: "#0f172a",
                resize: "vertical",
                boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
              }}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
