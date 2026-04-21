import React, { useCallback } from "react";
import { useDental } from "../context/DentalContext";
import { FDI_LIST } from "../constants/teethData";

export default function SummaryModal() {
  const { state, closeSummary, getDentalRecord } = useDental();
  const { summaryOpen } = state.ui;

  const handleExportPdf = useCallback(async () => {
    const record = getDentalRecord();
    console.log("Dental Record JSON:", JSON.stringify(record, null, 2));

    try {
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");

      const chartEl =
        document.getElementById("mainView") ??
        document.getElementById("singleToothView");
      const summaryEl = document.getElementById("summaryModalBody");
      if (!chartEl || !summaryEl) return;

      document.body.classList.add("pdf-exporting");
      const canvas = await html2canvas(chartEl, { scale: 2, useCORS: true });
      document.body.classList.remove("pdf-exporting");

      const imgData = canvas.toDataURL("image/png");

      // Create a custom PDF page that is the EXACT pixel size of your scaled canvas
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      // Add the image starting at the top left corner (0,0) and fill the exact dimensions.
      // Because the page and image are the exact same size, it will never stretch or have weird margins.
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      const date = new Date().toISOString().split("T")[0];
      pdf.save(`Dental_Chart_${date}.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
    }
  }, [getDentalRecord]);

  if (!summaryOpen) return null;

  const hasRecords = FDI_LIST.some((fdi) => {
    const t = state.teeth[fdi];
    return (
      t.history.length > 0 ||
      t.notes.apical ||
      t.notes.devDisorder ||
      t.probing.plaque ||
      t.probing.bleeding ||
      t.probing.pus ||
      t.probing.tartar
    );
  });

  return (
    <div
      id="summaryModal"
      style={{ display: "flex" }}
      className="modal-backdrop"
    >
      <div className="modal-box">
        <div className="modal-header">
          <h2>Chart Summary</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="view-btn summary-btn" onClick={handleExportPdf}>
              Export Chart &amp; Summary as PDF
            </button>
            <button className="close-modal-btn" onClick={closeSummary}>
              &times;
            </button>
          </div>
        </div>
        <div id="summaryModalBody" className="modal-body">
          {!hasRecords ? (
            <div className="summary-empty-state">
              No chart history recorded yet. Please apply conditions to teeth to
              see the summary.
            </div>
          ) : (
            <table className="summary-table">
              <thead>
                <tr>
                  <th className="summary-tooth-col">Tooth</th>
                  <th>Recorded History &amp; Conditions</th>
                </tr>
              </thead>
              <tbody>
                {FDI_LIST.map((fdi) => {
                  const t = state.teeth[fdi];
                  const hasProbing =
                    t.probing.plaque ||
                    t.probing.bleeding ||
                    t.probing.pus ||
                    t.probing.tartar;
                  const hasData =
                    t.history.length > 0 ||
                    t.notes.apical ||
                    t.notes.devDisorder ||
                    hasProbing;
                  if (!hasData) return null;
                  return (
                    <tr key={fdi}>
                      <td className="summary-tooth-col">{fdi}</td>
                      <td>
                        {t.history.map((item, i) => {
                          const niceName = item.condition
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase());
                          const detailStr =
                            item.details && Object.keys(item.details).length > 0
                              ? " — " +
                                Object.entries(item.details)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(", ")
                              : "";
                          return (
                            <span key={i}>
                              <span className="summary-badge">{niceName}</span>{" "}
                              <span style={{ color: "#64748b" }}>
                                {item.section}
                                {detailStr}
                              </span>
                              {i < t.history.length - 1 && <br />}
                            </span>
                          );
                        })}
                        {t.notes.apical && (
                          <>
                            <br />
                            <span
                              className="summary-badge"
                              style={{
                                background: "#fae8ff",
                                color: "#a21caf",
                              }}
                            >
                              Apical Note
                            </span>{" "}
                            <span style={{ color: "#64748b" }}>
                              {t.notes.apical}
                            </span>
                          </>
                        )}
                        {t.notes.devDisorder && (
                          <>
                            <br />
                            <span
                              className="summary-badge"
                              style={{
                                background: "#dcfce7",
                                color: "#15803d",
                              }}
                            >
                              Dev. Disorder
                            </span>{" "}
                            <span style={{ color: "#64748b" }}>
                              {t.notes.devDisorder}
                            </span>
                          </>
                        )}
                        {hasProbing && (
                          <>
                            <br />
                            <span
                              className="summary-badge"
                              style={{ background: "#f1f5f9" }}
                            >
                              Probing Indicators
                            </span>{" "}
                            <span
                              style={{ color: "#64748b", fontWeight: "bold" }}
                            >
                              {[
                                t.probing.plaque && "Plaque",
                                t.probing.bleeding && "Bleeding",
                                t.probing.pus && "Pus",
                                t.probing.tartar && "Tartar",
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
