import React from "react";
import { QUADRANTS } from "../constants/teethData";
import Tooth from "./Tooth";

export default function Arch({ archType, viewMode }) {
  const quadrants = QUADRANTS.filter(
    (q) => q.isUpper === (archType === "upper"),
  );

  return (
    <>
      {quadrants.map((q) => (
        <div
          key={q.key}
          id={`${archType === "upper" ? (q.key === "UL" ? "upperLeft" : "upperRight") : q.key === "LR" ? "lowerRight" : "lowerLeft"}`}
          className="quadrant"
        >
          <div className="quadrant-header">{q.label}</div>
          <div className="teeth-row">
            {q.fdis.map((fdi) => (
              <Tooth
                key={fdi}
                fdi={fdi}
                isUpper={q.isUpper}
                forceNormalView={viewMode === "all"}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
