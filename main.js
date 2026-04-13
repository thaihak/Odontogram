// --- BACKEND-READY DATA STRUCTURE ---
// This object seamlessly holds the complete state of the dental chart.
// It uses the standard FDI numbering format for easy integration.
window.dentalRecord = {
  patientId: "PAT-001", // Example ID
  lastUpdated: null,
  teeth: {},
};

// Initialize the 32 teeth in the backend object
const fdiStandardList = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46,
  45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];

fdiStandardList.forEach((fdi) => {
  window.dentalRecord.teeth[fdi] = {
    fdi: fdi,
    history: [], // Stores every action applied { date, section, condition, details }
    notes: { apical: "", devDisorder: "" },
    probing: {
      plaque: false,
      bleeding: false,
      pus: false,
      tartar: false,
    },
  };
});

// --- GLOBAL STATE (UI) ---
const globalHistory = {}; // UI History mapper
const globalToothNotes = {}; // Stores Apical and Dev Disorder notes per tooth visually
let currentFocusedToothFDI = null;

const allStatuses = [
  "healthy",
  "missing",
  "to-be-extracted",
  "pontic-root",
  "veneer",
  "implant", // Added Implant
  "pfm", // Added PFM
  "endo",
  "eruption",
  "treated",
  "decay",
  "wear",
  "fracture-crown-vertical",
  "fracture-crown-horizontal",
  "fracture-root-vertical",
  "fracture-root-horizontal",
  "discoloration-gray",
  "discoloration-red",
  "discoloration-yellow",
  "apical",
  "devdisorder",
];
let currentActiveTool = "decay"; // Default selected tool

// --- SVG CACHE MANAGER ---
// (Used ONLY for the clickable SVG overlays now)
const SvgCacheManager = {
  async getSvgText(url) {
    const cacheKey = `svg_cache_${url}`;
    const cachedData = localStorage.getItem(cacheKey);

    // 1. Return from cache if it exists
    if (cachedData) {
      return cachedData;
    }

    // 2. Otherwise, fetch from network
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Network error for ${url}`);
      const text = await response.text();

      // 3. Save to localStorage (with quota limit protection)
      try {
        localStorage.setItem(cacheKey, text);
      } catch (e) {
        console.warn("localStorage quota exceeded, clearing SVG cache.", e);
      }

      return text;
    } catch (error) {
      console.error("Failed to fetch SVG:", url, error);
      throw error;
    }
  },
};

// Tab Switching Logic
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

// Handle Tool Selection logic (Cross-tab support)
document.querySelectorAll('input[name="conditionTool"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    currentActiveTool = e.target.value;
    document
      .querySelectorAll(".tool-btn")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.closest(".tool-btn").classList.add("active");

    // Toggle specific sub-options dynamically
    const fracOpts = document.getElementById("fractureSubOptions");
    if (fracOpts)
      fracOpts.style.display =
        currentActiveTool === "fracture" ? "block" : "none";

    const wearOpts = document.getElementById("wearSubOptions");
    if (wearOpts)
      wearOpts.style.display = currentActiveTool === "wear" ? "block" : "none";

    const discolorOpts = document.getElementById("discolorationSubOptions");
    if (discolorOpts)
      discolorOpts.style.display =
        currentActiveTool === "discoloration" ? "block" : "none";

    const apicalOpts = document.getElementById("apicalSubOptions");
    if (apicalOpts)
      apicalOpts.style.display =
        currentActiveTool === "apical" ? "block" : "none";

    const endoOpts = document.getElementById("endoSubOptions");
    if (endoOpts)
      endoOpts.style.display = currentActiveTool === "endo" ? "block" : "none";

    const devOpts = document.getElementById("devDisorderSubOptions");
    if (devOpts)
      devOpts.style.display =
        currentActiveTool === "eruption" || currentActiveTool === "devdisorder"
          ? "block"
          : "none";

    const restOpts = document.getElementById("restorationSubOptions");
    if (restOpts)
      restOpts.style.display =
        currentActiveTool === "treated" ? "block" : "none";

    const implantOpts = document.getElementById("implantSubOptions");
    if (implantOpts)
      implantOpts.style.display =
        currentActiveTool === "implant" ? "block" : "none";

    // Show decay details button if decay is selected
    const decayOpts = document.getElementById("decaySubOptions");
    const showDecayBtn = document.getElementById("showDecayDetailsBtn");
    if (currentActiveTool === "decay") {
      if (decayOpts && decayOpts.style.display !== "block" && showDecayBtn) {
        showDecayBtn.style.display = "block";
      }
    } else {
      if (showDecayBtn) showDecayBtn.style.display = "none";
      if (decayOpts) decayOpts.style.display = "none";
    }
  });
});

// Decay details toggle handlers
document
  .getElementById("showDecayDetailsBtn")
  .addEventListener("click", function () {
    this.style.display = "none";
    document.getElementById("decaySubOptions").style.display = "block";
  });

document
  .getElementById("hideDecayDetailsBtn")
  .addEventListener("click", function () {
    document.getElementById("decaySubOptions").style.display = "none";
    document.getElementById("showDecayDetailsBtn").style.display = "block";
  });

// Periodontal Probing Toggle Handlers
["Plaque", "Bleeding", "Pus", "Tartar"].forEach((probe) => {
  document.querySelectorAll(`input[name="probe${probe}"]`).forEach((r) => {
    r.addEventListener("change", (e) => {
      if (!currentFocusedToothFDI) return;
      const isYes = e.target.value === "yes";

      // Update Backend Object
      window.dentalRecord.teeth[currentFocusedToothFDI].probing[
        probe.toLowerCase()
      ] = isYes;

      // Update Visual Grid Dots
      const toothEl = document.querySelector(".tooth.focused-tooth");
      if (toothEl) {
        const dot = toothEl.querySelector(`.probe-dot.${probe.toLowerCase()}`);
        if (dot) {
          isYes ? dot.classList.add("active") : dot.classList.remove("active");
        }
      }

      // Log Action
      logAction(
        currentFocusedToothFDI,
        "Probing",
        "probing",
        `${probe}: ${isYes ? "Yes" : "No"}`,
      );
    });
  });
});

// Save Endo Tests function
window.saveEndoTests = function () {
  if (!currentFocusedToothFDI) return;
  const cold = document.getElementById("endoCold").value;
  const perc = document.getElementById("endoPercussion").value;
  const palp = document.getElementById("endoPalpation").value;
  const heat = document.getElementById("endoHeat").value;
  const elec = document.getElementById("endoElectricity").value || "None";

  const details = `Cold: ${cold} | Perc: ${perc} | Palp: ${palp} | Heat: ${heat} | Elec: ${elec}`;

  // visually mark as endo
  const toothEl = document.querySelector(".tooth.focused-tooth");
  if (toothEl) {
    const rootPaths = Array.from(toothEl.querySelectorAll("path")).filter((p) =>
      (p.getAttribute("data-section-label") || "")
        .toLowerCase()
        .includes("root"),
    );
    rootPaths.forEach((p) => {
      p.classList.remove(...allStatuses);
      p.classList.add("endo");
    });
  }

  logAction(currentFocusedToothFDI, "Endo Tests", "endo", details);

  const btn = document.querySelector(`button[onclick="saveEndoTests()"]`);
  if (btn) {
    const originalText = btn.textContent;
    const originalBg = btn.style.background;
    btn.textContent = "Saved!";
    btn.style.background = "#10b981";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = originalBg;
    }, 2000);
  }
};

// Save Note function
window.saveToothNote = function (conditionName, textareaId) {
  if (!currentFocusedToothFDI) return;
  const noteText = document.getElementById(textareaId).value.trim();

  if (!globalToothNotes[currentFocusedToothFDI])
    globalToothNotes[currentFocusedToothFDI] = {};

  if (conditionName === "Apical Condition") {
    if (!globalToothNotes[currentFocusedToothFDI].apical)
      globalToothNotes[currentFocusedToothFDI].apical = {
        toggled: "yes",
      };
    globalToothNotes[currentFocusedToothFDI].apical.note = noteText;
    window.dentalRecord.teeth[currentFocusedToothFDI].notes.apical = noteText; // Backend Sync

    const toothEl = document.querySelector(".tooth.focused-tooth");
    if (toothEl) {
      const rootPaths = Array.from(toothEl.querySelectorAll("path")).filter(
        (p) =>
          (p.getAttribute("data-section-label") || "")
            .toLowerCase()
            .includes("root"),
      );
      rootPaths.forEach((p) => {
        p.classList.remove(...allStatuses);
        p.classList.add("apical");
      });
    }
  } else {
    if (!globalToothNotes[currentFocusedToothFDI].devDisorder)
      globalToothNotes[currentFocusedToothFDI].devDisorder = {
        toggled: "yes",
      };
    globalToothNotes[currentFocusedToothFDI].devDisorder.note = noteText;
    window.dentalRecord.teeth[currentFocusedToothFDI].notes.devDisorder =
      noteText; // Backend Sync

    const toothEl = document.querySelector(".tooth.focused-tooth");
    if (toothEl) {
      const allToothPaths = Array.from(toothEl.querySelectorAll("path")).filter(
        (p) =>
          !(p.getAttribute("data-section-label") || "")
            .toLowerCase()
            .startsWith("tooth "),
      );
      allToothPaths.forEach((p) => {
        p.classList.remove(...allStatuses);
        p.classList.add("eruption");
      });
    }
  }

  if (noteText) {
    logAction(currentFocusedToothFDI, conditionName, "note", noteText);
  }

  // Visual feedback for the button
  const btn = document.querySelector(`button[onclick*="${textareaId}"]`);
  if (btn) {
    const originalText = btn.textContent;
    const originalBg = btn.style.background;
    btn.textContent = "Saved!";
    btn.style.background = "#10b981"; // success green
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = originalBg;
    }, 2000);
  }
};

// Loads the state for the newly selected tooth
function loadToothState(fdi, toothElement) {
  // Notes logic
  const hasDev =
    toothElement &&
    Array.from(toothElement.querySelectorAll("path")).some(
      (p) =>
        p.classList.contains("eruption") || p.classList.contains("devdisorder"),
    );

  const devVal = globalToothNotes[fdi]?.devDisorder || {
    toggled: hasDev ? "yes" : "no",
    note: "",
  };

  const devNoteEl = document.getElementById("devDisorderNote");
  if (devNoteEl) {
    devNoteEl.value = devVal.note;
  }

  // Probing Logic
  const probingData = window.dentalRecord.teeth[fdi].probing;
  ["Plaque", "Bleeding", "Pus", "Tartar"].forEach((probe) => {
    const val = probingData[probe.toLowerCase()] ? "yes" : "no";
    const radio = document.querySelector(
      `input[name="probe${probe}"][value="${val}"]`,
    );
    if (radio) radio.checked = true;
  });

  // Dynamic Restoration Types based on Tooth
  const isMolar = toothElement.classList.contains("type-molar");
  const isPremolar = toothElement.classList.contains("type-premolar");
  const typeSel = document.getElementById("restTypeSel");
  if (typeSel) {
    const currentTypeVal = typeSel.value;
    typeSel.innerHTML = "";

    let restOptions = [];
    if (isMolar || isPremolar) {
      restOptions = [
        "Filling",
        "Inlay",
        "Onlay",
        "Veneer",
        "Pontic",
        "Partial Crown",
        "Crown",
      ];
    } else {
      restOptions = ["Filling", "Veneer", "Pontic", "Crown"];
    }

    restOptions.forEach((opt) => {
      const optionEl = document.createElement("option");
      optionEl.value = opt;
      optionEl.textContent = opt;
      typeSel.appendChild(optionEl);
    });
    if (restOptions.includes(currentTypeVal)) {
      typeSel.value = currentTypeVal;
    }
  }
}

// --- GLOBAL ACTION LOGGER & BACKEND SYNC ---
function logAction(toothFDI, sectionName, toolKey, extraNote = "") {
  const logList = document.getElementById("actionLogList");
  const emptyState = document.getElementById("emptyLogState");
  if (emptyState) emptyState.remove();

  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let badgeClass = toolKey;
  if (toolKey.includes("fracture")) badgeClass = "fracture";
  if (toolKey.includes("discoloration")) badgeClass = "discoloration";

  let friendlyToolName = toolKey
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  let backendDetails = {}; // Stores specific parameters cleanly

  // UI Label Adjustments
  if (
    toolKey === "condition" ||
    toolKey === "apical" ||
    toolKey === "devdisorder" ||
    toolKey === "eruption" ||
    toolKey === "endo"
  ) {
    badgeClass = "treated";
    friendlyToolName = `${friendlyToolName} <div style="font-size: 10.5px; font-weight: normal; margin-top: 4px; color: #333; line-height: 1.3;">${extraNote}</div>`;
    backendDetails = { status: extraNote };
  } else if (toolKey === "note") {
    badgeClass = "note";
    friendlyToolName = `Note <div style="font-size: 10.5px; font-weight: normal; margin-top: 4px; color: #333; line-height: 1.3;">"${extraNote}"</div>`;
    backendDetails = { note: extraNote };
  } else if (toolKey === "probing") {
    badgeClass = "treated";
    friendlyToolName = `Probing <div style="font-size: 10.5px; font-weight: normal; margin-top: 4px; color: #333; line-height: 1.3;">${extraNote}</div>`;
    backendDetails = { probingUpdate: extraNote };
  } else if (extraNote === "Applied" || extraNote === "Removed") {
    friendlyToolName += ` <div style="font-size: 10.5px; font-weight: normal; margin-top: 4px; color: #333; line-height: 1.3;">${extraNote}</div>`;
    backendDetails = { status: extraNote };
  }

  // Decay specific logic
  if (toolKey === "decay") {
    const decayExtent = document.getElementById("decayExtentSel").value;
    const decaySubOptions = document.getElementById("decaySubOptions");
    let detailsHtml = `Extent: ${decayExtent}`;
    backendDetails = { extent: decayExtent };

    if (decaySubOptions && decaySubOptions.style.display === "block") {
      const stage = document.getElementById("decayStageSel").value;
      const cav = document.getElementById("decayCavitationSel").value;
      const pulp = document.getElementById("decayPulpSel").value;
      const lvl = document.getElementById("decayLevelSel").value;
      detailsHtml += `<br> Stage: ${stage} <br> Cavitation: ${cav} | Pulp: ${pulp} | Lvl: ${lvl}`;
      backendDetails = {
        ...backendDetails,
        stage,
        cavitation: cav,
        pulp,
        level: lvl,
      };
    }
    friendlyToolName = `Decay <div style="font-size: 10.5px; font-weight: normal; margin-top: 4px; color: #b71c1c; line-height: 1.3;">${detailsHtml}</div>`;
  }

  // Implant specific logic
  if (toolKey === "implant") {
    const mat = document.getElementById("implantMaterialSel").value;
    backendDetails = { material: mat };
    friendlyToolName = `Implant <div style="font-size: 10.5px; font-weight: normal; margin-top: 4px; color: #475569; line-height: 1.3;">Metal: ${mat}</div>`;
  }

  // Wear specific logic
  if (toolKey === "wear") {
    const type = document.querySelector('input[name="wearType"]:checked').value;
    friendlyToolName = `Wear <div style="font-size: 10.5px; font-weight: normal; margin-top: 4px; color: #000; line-height: 1.3;">Type: ${type}</div>`;
    backendDetails = { type: type };
  }

  // Discoloration specific logic
  if (toolKey.startsWith("discoloration")) {
    const color = toolKey.split("-")[1];
    friendlyToolName = `Discolor <div style="font-size: 10.5px; font-weight: normal; margin-top: 4px; color: #475569; line-height: 1.3;">Color: ${color.charAt(0).toUpperCase() + color.slice(1)}</div>`;
    backendDetails = { color: color };
  }

  // Restoration (Treated/PFM) specific logic
  if (toolKey === "treated") {
    const restOpts = document.getElementById("restorationSubOptions");
    if (restOpts && restOpts.style.display === "block") {
      const type = document.getElementById("restTypeSel").value;
      const mat = document.getElementById("restMatSel").value;
      const qual = document.getElementById("restQualSel").value;
      const det = document.getElementById("restDetailSel").value;

      backendDetails = {
        type,
        material: mat,
        quality: qual,
        detail: det,
      };

      if (mat === "PFM") {
        friendlyToolName = `PFM Crown <div style="font-size: 10.5px; font-weight: normal; margin-top: 4px; color: #334155; line-height: 1.3;">Type: ${type}<br>Mat: ${mat} | Qual: ${qual}<br>Det: ${det}</div>`;
        badgeClass = "pfm";
      } else {
        friendlyToolName = `Restoration <div style="font-size: 10.5px; font-weight: normal; margin-top: 4px; color: #3333bb; line-height: 1.3;">Type: ${type}<br>Mat: ${mat} | Qual: ${qual}<br>Det: ${det}</div>`;
      }
    }
  }

  // 1. SYNC TO BACKEND STRUCTURE
  window.dentalRecord.lastUpdated = now.toISOString();
  window.dentalRecord.teeth[toothFDI].history.push({
    date: now.toISOString(),
    section: sectionName,
    condition: toolKey,
    details: backendDetails,
  });

  // 2. UI LOGGING (Global)
  const mainLogHtml = `
          <strong style="color:#888;">[${timeString}]</strong> 
          Tooth <strong>${toothFDI}</strong>: 
          <span style="color:#222; font-weight:500;">${sectionName}</span> marked as 
          <span class="status-badge ${badgeClass}">${friendlyToolName}</span>
        `;
  const li = document.createElement("li");
  li.innerHTML = mainLogHtml;
  logList.insertBefore(li, logList.firstChild);
  if (logList.children.length > 8) logList.removeChild(logList.lastChild);

  // 3. UI LOGGING (Sidebar Specific)
  if (!globalHistory[toothFDI]) globalHistory[toothFDI] = [];
  const sidebarLogHtml = `
          <strong style="color:#94a3b8; font-size: 11px;">[${timeString}]</strong> 
          <span style="color:#334155; font-weight:500;">${sectionName}</span>: 
          <span class="status-badge ${badgeClass}">${friendlyToolName}</span>
        `;
  globalHistory[toothFDI].unshift(sidebarLogHtml);

  const sidebarTitle = document.getElementById("sidebarTitle");
  if (sidebarTitle && sidebarTitle.textContent === "Tooth " + toothFDI) {
    updateSidebarHistory(toothFDI);
  }
}

function updateSidebarHistory(fdi) {
  const historyList = document.getElementById("sidebarHistoryList");
  if (!historyList) return;
  historyList.innerHTML = "";

  if (globalHistory[fdi] && globalHistory[fdi].length > 0) {
    globalHistory[fdi].forEach((log) => {
      const li = document.createElement("li");
      li.innerHTML = log;
      historyList.appendChild(li);
    });
  } else {
    historyList.innerHTML = `<li style="padding: 10px 0; color: #94a3b8;"><em>No activity yet.</em></li>`;
  }
}

// Helper function to resolve dynamic tools (e.g. fracture sub-choices)
function resolveActiveToolClass() {
  if (currentActiveTool === "fracture") {
    const loc = document
      .querySelector('input[name="fracLocation"]:checked')
      .value.toLowerCase();
    const dir = document
      .querySelector('input[name="fracDirection"]:checked')
      .value.toLowerCase();
    return `fracture-${loc}-${dir}`;
  }
  if (currentActiveTool === "discoloration") {
    const color = document
      .querySelector('input[name="discolorColor"]:checked')
      .value.toLowerCase();
    return `discoloration-${color}`;
  }
  return currentActiveTool;
}

// Helper function handling logic across all paths & views seamlessly
function handleConditionApplication(
  tooth,
  displayLabel,
  sectionLabel,
  isDoubleClick,
  pathsToUpdate,
) {
  const tool = document.querySelector(
    'input[name="conditionTool"]:checked',
  ).value;
  const appliedClass = resolveActiveToolClass();
  const topOverlay = tooth.querySelector(".top-overlay");

  // Helper to identify specific parts and ignore the "Tooth XX" full-background path and "Root"
  const isCrownPath = (p) => {
    const lbl = (p.getAttribute("data-section-label") || "").toLowerCase();
    return !lbl.includes("root") && !lbl.startsWith("tooth ");
  };

  const rootPaths = Array.from(tooth.querySelectorAll("path")).filter((p) => {
    const lbl = (p.getAttribute("data-section-label") || "").toLowerCase();
    return lbl.includes("root");
  });

  // 1. Wear Override - Crown surface coverage (excl. root) + Top Buccal/Palatal parts
  if (tool === "wear") {
    const wearSurface = document.querySelector(
      'input[name="wearSurface"]:checked',
    ).value;
    let pathsToApply = [];

    if (wearSurface === "Buccal") {
      const frontOverlay = tooth.querySelector(".normal-overlay");
      if (frontOverlay) {
        const frontPaths = Array.from(
          frontOverlay.querySelectorAll("path"),
        ).filter(isCrownPath);
        pathsToApply.push(...frontPaths);
      }
      if (topOverlay) {
        const topPaths = Array.from(topOverlay.querySelectorAll("path")).filter(
          (p) => {
            const lbl = (
              p.getAttribute("data-section-label") || ""
            ).toLowerCase();
            return (
              (lbl.includes("buccal") || lbl.includes("facial")) &&
              !lbl.startsWith("tooth ")
            );
          },
        );
        pathsToApply.push(...topPaths);
      }
    } else {
      const backOverlay = tooth.querySelector(".normal-back-overlay");
      if (backOverlay) {
        const backPaths = Array.from(
          backOverlay.querySelectorAll("path"),
        ).filter(isCrownPath);
        pathsToApply.push(...backPaths);
      }
      if (topOverlay) {
        const topPaths = Array.from(topOverlay.querySelectorAll("path")).filter(
          (p) => {
            const lbl = (
              p.getAttribute("data-section-label") || ""
            ).toLowerCase();
            return (
              (lbl.includes("palatal") || lbl.includes("lingual")) &&
              !lbl.startsWith("tooth ")
            );
          },
        );
        pathsToApply.push(...topPaths);
      }
    }

    if (pathsToApply.length > 0) {
      let isApplied = false;
      pathsToApply.forEach((p) => {
        if (p.classList.contains("wear")) isApplied = true;
      });

      pathsToApply.forEach((p) => {
        p.classList.remove(...allStatuses);
        if (!isApplied) p.classList.add("wear");
      });
      logAction(displayLabel, `${wearSurface} Crown & Top`, "wear");
    }
    return;
  }

  // 2. Decay Override - Check if Whole Crown extent was selected
  if (tool === "decay") {
    const decayExtent = document.getElementById("decayExtentSel").value;
    if (decayExtent === "Crown") {
      const allCrownPaths = Array.from(tooth.querySelectorAll("path")).filter(
        isCrownPath,
      );
      if (allCrownPaths.length > 0) {
        let isApplied = false;
        allCrownPaths.forEach((p) => {
          if (p.classList.contains("decay")) isApplied = true;
        });
        allCrownPaths.forEach((p) => {
          p.classList.remove(...allStatuses);
          if (!isApplied) p.classList.add("decay");
        });
        logAction(displayLabel, "Whole Crown", "decay");
      }
      return;
    }
  }

  // 3. Discoloration Override - Whole Tooth (except Background)
  if (tool === "discoloration") {
    const allToothPaths = Array.from(tooth.querySelectorAll("path")).filter(
      (p) => {
        const lbl = (p.getAttribute("data-section-label") || "").toLowerCase();
        return !lbl.startsWith("tooth ");
      },
    );
    if (allToothPaths.length > 0) {
      let isApplied = false;
      allToothPaths.forEach((p) => {
        if (p.classList.contains(appliedClass)) isApplied = true;
      });
      allToothPaths.forEach((p) => {
        p.classList.remove(...allStatuses);
        if (!isApplied) p.classList.add(appliedClass);
      });
      logAction(displayLabel, "Whole Tooth", appliedClass);
    }
    return;
  }

  // 4. Missing Override - Whole Tooth on Double Click (Single click falls through to section)
  if (tool === "missing") {
    if (isDoubleClick) {
      const allToothPaths = Array.from(tooth.querySelectorAll("path")).filter(
        (p) => {
          const lbl = (
            p.getAttribute("data-section-label") || ""
          ).toLowerCase();
          return !lbl.startsWith("tooth ");
        },
      );
      if (allToothPaths.length > 0) {
        let isApplied = false;
        allToothPaths.forEach((p) => {
          if (p.classList.contains(appliedClass)) isApplied = true;
        });
        allToothPaths.forEach((p) => {
          p.classList.remove(...allStatuses);
          if (!isApplied) p.classList.add(appliedClass);
        });
        logAction(displayLabel, "Whole Tooth", appliedClass);
      }
      return;
    }
  }

  // 5. To be Extracted - Whole Tooth automatically
  if (tool === "to-be-extracted") {
    const allToothPaths = Array.from(tooth.querySelectorAll("path")).filter(
      (p) => {
        const lbl = (p.getAttribute("data-section-label") || "").toLowerCase();
        return !lbl.startsWith("tooth ");
      },
    );
    if (allToothPaths.length > 0) {
      let isApplied = allToothPaths.some((p) =>
        p.classList.contains(appliedClass),
      );
      allToothPaths.forEach((p) => {
        p.classList.remove(...allStatuses);
        if (!isApplied) p.classList.add(appliedClass);
      });
      logAction(displayLabel, "Whole Tooth", appliedClass);
    }
    return;
  }

  // 6. Pontic - Root only black out
  if (tool === "pontic") {
    if (rootPaths.length > 0) {
      let isApplied = rootPaths.some((p) =>
        p.classList.contains("pontic-root"),
      );
      rootPaths.forEach((p) => {
        p.classList.remove(...allStatuses);
        if (!isApplied) p.classList.add("pontic-root");
      });
      logAction(displayLabel, "Root Blacked Out", "pontic");
    }
    return;
  }

  // 7. Veneer - Buccal surfaces
  if (tool === "veneer") {
    let pathsToApply = [];
    const frontOverlay = tooth.querySelector(".normal-overlay");
    if (frontOverlay) {
      pathsToApply.push(
        ...Array.from(frontOverlay.querySelectorAll("path")).filter(
          isCrownPath,
        ),
      );
    }
    if (topOverlay) {
      pathsToApply.push(
        ...Array.from(topOverlay.querySelectorAll("path")).filter((p) => {
          const lbl = (
            p.getAttribute("data-section-label") || ""
          ).toLowerCase();
          return (
            (lbl.includes("buccal") || lbl.includes("facial")) &&
            !lbl.startsWith("tooth ")
          );
        }),
      );
    }

    if (pathsToApply.length > 0) {
      let isApplied = pathsToApply.some((p) => p.classList.contains("veneer"));
      pathsToApply.forEach((p) => {
        p.classList.remove(...allStatuses);
        if (!isApplied) p.classList.add("veneer");
      });
      logAction(displayLabel, "Buccal Crown & Top", "veneer");
    }
    return;
  }

  // 8. Crown Fracture
  if (appliedClass.startsWith("fracture-crown")) {
    if (topOverlay) {
      const isApplied = topOverlay.classList.contains(appliedClass);
      topOverlay.classList.remove(
        "fracture-crown-vertical",
        "fracture-crown-horizontal",
      );
      if (!isApplied) topOverlay.classList.add(appliedClass);
      const dir = appliedClass.includes("vertical") ? "Vertical" : "Horizontal";
      logAction(displayLabel, "Crown " + dir, appliedClass);
    }
    return;
  }

  // 9. Root Fracture
  if (appliedClass.startsWith("fracture-root")) {
    if (rootPaths.length > 0) {
      let isApplied = false;
      rootPaths.forEach((p) => {
        if (p.classList.contains(appliedClass)) isApplied = true;
      });
      rootPaths.forEach((p) => {
        p.classList.remove(...allStatuses);
        if (!isApplied) p.classList.add(appliedClass);
      });
      const dir = appliedClass.includes("vertical") ? "Vertical" : "Horizontal";
      logAction(displayLabel, "Root " + dir, appliedClass);
    }
    return;
  }

  // 10. Implant Logic (Targets specific Implant/Root paths natively & Swaps underlying image)
  if (tool === "implant") {
    if (rootPaths.length > 0) {
      let isApplied = false;
      rootPaths.forEach((p) => {
        if (p.classList.contains("implant")) isApplied = true;
      });
      rootPaths.forEach((p) => {
        p.classList.remove(...allStatuses);
        if (!isApplied) p.classList.add("implant");
      });

      // Visually Swap the Root Images!
      const normalImg = tooth.querySelector(".tooth-view-item.normal img");
      const normalBackImg = tooth.querySelector(
        ".tooth-view-item.normal-back img",
      );

      if (!isApplied) {
        if (normalImg)
          normalImg.src = "normal-implant-root/" + displayLabel + ".png";
        if (normalBackImg)
          normalBackImg.src =
            "normal-back-view-implant-root/" + displayLabel + ".png";
      } else {
        if (normalImg) normalImg.src = "normal-img/" + displayLabel + ".png";
        if (normalBackImg)
          normalBackImg.src = "normal-back-view-img/" + displayLabel + ".png";
      }

      logAction(displayLabel, "Root (Implant Applied)", "implant");
    }
    return;
  }

  // 11. Apical Condition, Endo, Eruption (Ignored here since it's driven by UI button, but left for safety)
  if (tool === "apical" || tool === "endo" || tool === "eruption") return;

  // 12. Clearing / Healthy logic
  if (appliedClass === "healthy") {
    if (topOverlay)
      topOverlay.classList.remove(
        "fracture-crown-vertical",
        "fracture-crown-horizontal",
      );
  }

  // 13. Standard Specific Section application
  let finalClassToAdd = appliedClass;

  // Intercept the 'treated' class to see if we should map it to PFM Crown instead!
  if (appliedClass === "treated") {
    const mat = document.getElementById("restMatSel").value;
    if (mat === "PFM") {
      finalClassToAdd = "pfm";
    }
  }

  if (isDoubleClick && pathsToUpdate) {
    pathsToUpdate.forEach((p) => {
      const lbl = (p.getAttribute("data-section-label") || "").toLowerCase();
      if (!lbl.startsWith("tooth ")) {
        p.classList.remove(...allStatuses);
        p.classList.add(finalClassToAdd);
      }
    });
    logAction(displayLabel, "Entire View", finalClassToAdd);
  } else if (sectionLabel) {
    const matchingPaths = tooth.querySelectorAll(
      `path[data-section-label="${sectionLabel}"]`,
    );
    let isApplied = false;
    matchingPaths.forEach((p) => {
      if (p.classList.contains(finalClassToAdd)) isApplied = true;
    });
    matchingPaths.forEach((p) => {
      p.classList.remove(...allStatuses);
      if (!isApplied || appliedClass === "healthy")
        p.classList.add(finalClassToAdd);
    });
    logAction(displayLabel, sectionLabel, finalClassToAdd);
  }
}

// --- FOCUS AND SIDEBAR LOGIC ---
function closeSidebar() {
  const odontogram = document.querySelector(".odontogram");
  const sidebar = document.getElementById("conditionSidebar");
  const mainContent = document.querySelector(".main-content");

  odontogram.classList.remove("focus-mode");
  document
    .querySelectorAll(".tooth.focused-tooth")
    .forEach((t) => t.classList.remove("focused-tooth"));
  sidebar.classList.remove("show");
  mainContent.classList.remove("sidebar-open-left", "sidebar-open-right");
  currentFocusedToothFDI = null;
}

document
  .getElementById("closeSidebarBtn")
  .addEventListener("click", closeSidebar);

function openSidebar(fdi, toothElement, isolateCallback) {
  const odontogram = document.querySelector(".odontogram");
  const sidebar = document.getElementById("conditionSidebar");
  const sidebarTitle = document.getElementById("sidebarTitle");
  const mainContent = document.querySelector(".main-content");

  if (
    toothElement.classList.contains("focused-tooth") &&
    sidebar.classList.contains("show")
  ) {
    // If already focused, clicking again doesn't close it to avoid jumpy behavior
    return;
  }

  document
    .querySelectorAll(".tooth.focused-tooth")
    .forEach((t) => t.classList.remove("focused-tooth"));
  odontogram.classList.add("focus-mode");
  toothElement.classList.add("focused-tooth");

  sidebarTitle.textContent = "Tooth " + fdi;
  currentFocusedToothFDI = fdi;

  const quadDigit = fdi.toString().charAt(0);
  sidebar.classList.remove("sidebar-left", "sidebar-right");
  mainContent.classList.remove("sidebar-open-left", "sidebar-open-right");

  if (quadDigit === "1" || quadDigit === "4") {
    sidebar.classList.add("sidebar-right");
    mainContent.classList.add("sidebar-open-right");
  } else {
    sidebar.classList.add("sidebar-left");
    mainContent.classList.add("sidebar-open-left");
  }

  updateSidebarHistory(fdi);
  loadToothState(fdi, toothElement); // Load notes + Probing state + dynamic Restoration dropdowns
  document.getElementById("isolateToothBtn").onclick = isolateCallback;
  sidebar.classList.add("show");
}

// --- TOOTH GENERATION LOGIC ---
function createToothElement(toothNumber, displayLabel, isUpper = true) {
  const tooth = document.createElement("div");
  tooth.className = "tooth " + (isUpper ? "upper" : "lower");

  const fdiQuadrantDigit = displayLabel.toString().charAt(0);
  tooth.classList.add("q" + fdiQuadrantDigit);

  if (
    [
      4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    ].includes(toothNumber)
  ) {
    tooth.classList.add("tight");
  }

  let sectionType = "normal";
  const molars = [1, 2, 3, 14, 15, 16, 17, 18, 19, 30, 31, 32];
  const premolars = [4, 5, 12, 13, 20, 21, 28, 29];

  if (molars.includes(toothNumber)) sectionType = "molar";
  else if (premolars.includes(toothNumber)) sectionType = "premolar";

  tooth.classList.add("type-" + sectionType);

  const numberWrapper = document.createElement("div");
  numberWrapper.className = "tooth-number-wrapper";

  const number = document.createElement("div");
  number.className = "tooth-number";
  number.textContent = displayLabel;

  const probingContainer = document.createElement("div");
  probingContainer.className = "probing-indicators";
  probingContainer.innerHTML = `
            <div class="probe-dot plaque" title="Plaque"></div>
            <div class="probe-dot bleeding" title="Bleeding"></div>
            <div class="probe-dot pus" title="Pus"></div>
            <div class="probe-dot tartar" title="Tartar"></div>
        `;

  numberWrapper.appendChild(number);
  numberWrapper.appendChild(probingContainer);

  const views = document.createElement("div");
  views.className = "tooth-views";

  // ----------- TOP VIEW SETUP -----------
  const topView = document.createElement("div");
  topView.className = "tooth-view-item top";

  const topImg = document.createElement("img");
  topImg.alt = "Top view - Tooth " + displayLabel;
  // NOTE: Changed to native .png mapping
  topImg.src = "top-img/" + displayLabel + ".png";
  topView.appendChild(topImg);

  const topOverlay = document.createElement("div");
  topOverlay.className = "section-overlay top-overlay";
  topView.appendChild(topOverlay);

  SvgCacheManager.getSvgText("top/top-" + sectionType + "-section.svg")
    .then((svgContent) => {
      topOverlay.innerHTML = svgContent;
      const topPaths = topOverlay.querySelectorAll("path");

      topView.addEventListener("dblclick", (e) => {
        if (!tooth.classList.contains("focused-tooth")) return;
        e.stopPropagation();
        e.preventDefault();
        handleConditionApplication(tooth, displayLabel, null, true, topPaths);
      });

      let topAnatomyLabels = [];
      if (sectionType === "molar") {
        topAnatomyLabels = [
          "Tooth " + displayLabel,
          "Occlusal",
          "Mesial",
          "Distal",
          "Mesio Palatal Cusp",
          "Disto Palatal Cusp",
          "Mesio Buccal Cusp",
          "Disto Buccal Cusp",
        ];
      } else if (sectionType === "premolar") {
        topAnatomyLabels = [
          "Tooth " + displayLabel,
          "Mesial",
          "Buccal Cusp",
          "Buccal Surface",
          "Palatal Cusp",
          "Palatal Surface",
          "Distal",
          "Occlusal",
        ];
      } else {
        topAnatomyLabels = [
          "Tooth " + displayLabel,
          "Distal",
          "Palatal Surface",
          "Mesial",
          "Buccal Surface",
          "Incisal",
        ];
      }

      topPaths.forEach((path, index) => {
        const fallbackName =
          topAnatomyLabels[index] || `Top Section ${index + 1}`;
        const sectionNameRaw =
          path.id || path.getAttribute("name") || fallbackName;
        const sectionLabel =
          sectionNameRaw.charAt(0).toUpperCase() +
          sectionNameRaw.slice(1).replace(/[-_]/g, " ");

        path.setAttribute("data-section-label", sectionLabel);
        const tooltipElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "title",
        );
        tooltipElement.textContent = sectionLabel;
        path.appendChild(tooltipElement);

        path.addEventListener("click", function (e) {
          if (!tooth.classList.contains("focused-tooth")) return; // Let tooth listener handle focusing
          e.stopPropagation();
          handleConditionApplication(
            tooth,
            displayLabel,
            sectionLabel,
            false,
            null,
          );
        });
      });
    })
    .catch((err) => console.log("Could not load top section overlay:", err));

  // ----------- NORMAL VIEW SETUP -----------
  const normalView = document.createElement("div");
  normalView.className = "tooth-view-item normal";

  const normalImg = document.createElement("img");
  normalImg.alt = "Normal view - Tooth " + displayLabel;
  // NOTE: Changed to native .png mapping
  normalImg.src = "normal-img/" + displayLabel + ".png";
  normalView.appendChild(normalImg);

  const normalOverlay = document.createElement("div");
  normalOverlay.className = "section-overlay normal-overlay";
  normalView.appendChild(normalOverlay);

  SvgCacheManager.getSvgText("normal-img/" + sectionType + "-section.svg")
    .then((svgContent) => {
      normalOverlay.innerHTML = svgContent;
      const normalPaths = normalOverlay.querySelectorAll("path");

      normalView.addEventListener("dblclick", (e) => {
        if (!tooth.classList.contains("focused-tooth")) return;
        e.stopPropagation();
        e.preventDefault();
        handleConditionApplication(
          tooth,
          displayLabel,
          null,
          true,
          normalPaths,
        );
      });

      let normalAnatomyLabels = [];
      if (sectionType === "molar") {
        normalAnatomyLabels = [
          "Tooth " + displayLabel,
          "Root",
          "Disto Buccal Cusp",
          "Mesio Buccal Cusp",
          "Mesial",
          "Distal",
          "Cervical Buccal",
          "Buccal",
        ];
      } else if (sectionType === "premolar") {
        normalAnatomyLabels = [
          "Tooth " + displayLabel,
          "Root",
          "Buccal",
          "Buccal Surface",
          "Mesial",
          "Distal",

          "Cervical Buccal",
        ];
      } else {
        normalAnatomyLabels = [
          "Tooth " + displayLabel,
          "Root",
          "Buccal Surface",
          "Incisal",
          "Cervical Buccal",
          "Buccal",
          "Mesial",
          "Distal",
        ];
      }

      normalPaths.forEach((path, index) => {
        const fallbackName =
          normalAnatomyLabels[index] || `Front Section ${index + 1}`;
        const sectionNameRaw =
          path.id || path.getAttribute("name") || fallbackName;
        const sectionLabel =
          sectionNameRaw.charAt(0).toUpperCase() +
          sectionNameRaw.slice(1).replace(/[-_]/g, " ");

        path.setAttribute("data-section-label", sectionLabel);
        const tooltipElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "title",
        );
        tooltipElement.textContent = sectionLabel;
        path.appendChild(tooltipElement);

        path.addEventListener("click", function (e) {
          if (!tooth.classList.contains("focused-tooth")) return;
          e.stopPropagation();
          handleConditionApplication(
            tooth,
            displayLabel,
            sectionLabel,
            false,
            null,
          );
        });
      });
    })
    .catch((err) => console.log("Could not load normal section overlay:", err));

  // ----------- NORMAL BACK VIEW SETUP -----------
  const normalBackView = document.createElement("div");
  normalBackView.className = "tooth-view-item normal-back";

  const normalBackImg = document.createElement("img");
  normalBackImg.alt = "Normal back view - Tooth " + displayLabel;
  // NOTE: Changed to native .png mapping
  normalBackImg.src = "normal-back-view-img/" + displayLabel + ".png";
  normalBackView.appendChild(normalBackImg);

  const normalBackOverlay = document.createElement("div");
  normalBackOverlay.className = "section-overlay normal-back-overlay";
  normalBackView.appendChild(normalBackOverlay);

  SvgCacheManager.getSvgText(
    "normal-back-view-img/" + sectionType + "-section.svg",
  )
    .catch(() =>
      SvgCacheManager.getSvgText("normal-img/" + sectionType + "-section.svg"),
    )
    .then((svgContent) => {
      normalBackOverlay.innerHTML = svgContent;
      const backPaths = normalBackOverlay.querySelectorAll("path");

      normalBackView.addEventListener("dblclick", (e) => {
        if (!tooth.classList.contains("focused-tooth")) return;
        e.stopPropagation();
        e.preventDefault();
        handleConditionApplication(tooth, displayLabel, null, true, backPaths);
      });

      let backAnatomyLabels = [];
      if (sectionType === "molar") {
        backAnatomyLabels = [
          "Tooth " + displayLabel,
          "Root",
          "Disto Palatal Cusp",
          "Mesio Palatal Cusp",
          "Mesial",
          "Distal",

          "Cervical Palatal",
          "Palatal",
        ];
      } else if (sectionType === "premolar") {
        backAnatomyLabels = [
          "Tooth " + displayLabel,
          "Root",
          "Buccal",
          "Buccal Surface",
          "Mesial",
          "Distal",

          "Cervical Buccal",
        ];
      } else {
        backAnatomyLabels = [
          "Tooth " + displayLabel,
          "Root",
          "Palatal Surface",
          "Incisal",
          "Cervical Palatal",
          "Palatal",
          "Mesial",
          "Distal",
        ];
      }

      backPaths.forEach((path, index) => {
        const fallbackName =
          backAnatomyLabels[index] || `Back Section ${index + 1}`;
        const sectionNameRaw =
          path.id || path.getAttribute("name") || fallbackName;
        const sectionLabel =
          sectionNameRaw.charAt(0).toUpperCase() +
          sectionNameRaw.slice(1).replace(/[-_]/g, " ");

        path.setAttribute("data-section-label", sectionLabel);
        const tooltipElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "title",
        );
        tooltipElement.textContent = sectionLabel;
        path.appendChild(tooltipElement);

        path.addEventListener("click", function (e) {
          if (!tooth.classList.contains("focused-tooth")) return;
          e.stopPropagation();
          handleConditionApplication(
            tooth,
            displayLabel,
            sectionLabel,
            false,
            null,
          );
        });
      });
    })
    .catch((err) =>
      console.log("Could not load normal back section overlay:", err),
    );

  // --- Single Page App Screen Transition Trigger ---
  const isolateToothFn = function () {
    const mainView = document.getElementById("mainView");
    const singleView = document.getElementById("singleToothView");
    const container = document.getElementById("singleToothEditor");
    const title = document.getElementById("singleToothTitle");
    const sidebar = document.getElementById("conditionSidebar");
    const mainContent = document.querySelector(".main-content");

    title.textContent = "Editing Tooth " + displayLabel;

    activePlaceholder = document.createElement("div");
    activePlaceholder.className = tooth.className + " placeholder";
    tooth.parentNode.insertBefore(activePlaceholder, tooth);

    container.appendChild(tooth);
    tooth.classList.add("in-editor");

    mainView.style.display = "none";
    singleView.style.display = "flex";
    activeTooth = tooth;

    // Ensure sidebar stays/becomes visible in the detail screen
    // Always pin it to the right side in detail view for simplicity
    sidebar.classList.remove("sidebar-left", "sidebar-right");
    sidebar.classList.add("sidebar-right");
    sidebar.classList.add("show");
    // Remove main-content margin adjustments (not needed in single view)
    mainContent.classList.remove("sidebar-open-left", "sidebar-open-right");

    document.getElementById("isolateToothBtn").style.display = "none"; // Hide isolate button in single view
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open sidebar ONLY if tooth is not focused. Fixes "lacky" applying.
  tooth.addEventListener("click", (e) => {
    if (!tooth.classList.contains("focused-tooth")) {
      e.stopPropagation();
      openSidebar(displayLabel, tooth, isolateToothFn);
    }
  });

  if (isUpper) {
    views.appendChild(normalView);
    views.appendChild(topView);
    views.appendChild(normalBackView);
  } else {
    views.appendChild(normalBackView);
    views.appendChild(topView);
    views.appendChild(normalView);
  }

  tooth.appendChild(numberWrapper);
  tooth.appendChild(views);
  return tooth;
}

function generateTeeth() {
  const upperLeftContainer = document.getElementById("upperLeft");
  const ulHeader = document.createElement("div");
  ulHeader.className = "quadrant-header";
  ulHeader.textContent = "UL";
  upperLeftContainer.appendChild(ulHeader);
  const upperLeftRow = document.createElement("div");
  upperLeftRow.className = "teeth-row";
  let fdiQ1 = 18;
  for (let i = 17; i <= 24; i++) {
    upperLeftRow.appendChild(createToothElement(i, fdiQ1, true));
    fdiQ1--;
  }
  upperLeftContainer.appendChild(upperLeftRow);

  const upperRightContainer = document.getElementById("upperRight");
  const urHeader = document.createElement("div");
  urHeader.className = "quadrant-header";
  urHeader.textContent = "UR";
  upperRightContainer.appendChild(urHeader);
  const upperRightRow = document.createElement("div");
  upperRightRow.className = "teeth-row";
  let fdiQ2 = 21;
  for (let i = 25; i <= 32; i++) {
    upperRightRow.appendChild(createToothElement(i, fdiQ2, true));
    fdiQ2++;
  }
  upperRightContainer.appendChild(upperRightRow);

  const lowerRightContainer = document.getElementById("lowerRight");
  const lrHeader = document.createElement("div");
  lrHeader.className = "quadrant-header";
  lrHeader.textContent = "LR";
  lowerRightContainer.appendChild(lrHeader);
  const lowerRightRow = document.createElement("div");
  lowerRightRow.className = "teeth-row";
  let fdiQ4 = 48;
  for (let i = 1; i <= 8; i++) {
    lowerRightRow.appendChild(createToothElement(i, fdiQ4, false));
    fdiQ4--;
  }
  lowerRightContainer.appendChild(lowerRightRow);

  const lowerLeftContainer = document.getElementById("lowerLeft");
  const llHeader = document.createElement("div");
  llHeader.className = "quadrant-header";
  llHeader.textContent = "LL";
  lowerLeftContainer.appendChild(llHeader);
  const lowerLeftRow = document.createElement("div");
  lowerLeftRow.className = "teeth-row";
  let fdiQ3 = 31;
  for (let i = 9; i <= 16; i++) {
    lowerLeftRow.appendChild(createToothElement(i, fdiQ3, false));
    fdiQ3++;
  }
  lowerLeftContainer.appendChild(lowerLeftRow);
}

generateTeeth();

function closeEditorScreen() {
  if (activeTooth && activePlaceholder) {
    activeTooth.classList.remove("in-editor");
    activePlaceholder.parentNode.insertBefore(activeTooth, activePlaceholder);
    activePlaceholder.remove();
    activeTooth = null;
    activePlaceholder = null;
  }
  document.getElementById("singleToothView").style.display = "none";
  document.getElementById("mainView").style.display = "block";
  document.getElementById("isolateToothBtn").style.display = "block";
  // Close the sidebar cleanly when returning to chart
  closeSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document
  .getElementById("backToChartBtn")
  .addEventListener("click", closeEditorScreen);

const viewButtons = document.querySelectorAll(".view-btn:not(.summary-btn)");
const upperArch = document.querySelector(".arch:has(#upperLeft)");
const lowerArch = document.querySelector(".arch:has(#lowerRight)");

viewButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const view = this.dataset.view;
    viewButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    document.getElementById("mainView").setAttribute("data-view-mode", view);

    if (view === "upper") {
      upperArch.classList.remove("hidden");
      lowerArch.classList.add("hidden");
    } else if (view === "lower") {
      upperArch.classList.add("hidden");
      lowerArch.classList.remove("hidden");
    } else if (view === "all") {
      upperArch.classList.remove("hidden");
      lowerArch.classList.remove("hidden");
    }
  });
});

// --- SUMMARY MODAL LOGIC ---
const summaryModal = document.getElementById("summaryModal");
const btnSummary = document.getElementById("btnSummary");
const closeSummaryModalBtn = document.getElementById("closeSummaryModalBtn");
const summaryModalBody = document.getElementById("summaryModalBody");
const exportJsonBtn = document.getElementById("exportJsonBtn");

function renderSummary() {
  summaryModalBody.innerHTML = "";
  const table = document.createElement("table");
  table.className = "summary-table";
  table.innerHTML = `
            <thead>
                <tr>
                    <th class="summary-tooth-col">Tooth</th>
                    <th>Recorded History & Conditions</th>
                </tr>
            </thead>
            <tbody></tbody>
          `;
  const tbody = table.querySelector("tbody");
  let hasRecords = false;

  // Render in Standard Dental Sequence
  fdiStandardList.forEach((fdi) => {
    const toothData = window.dentalRecord.teeth[fdi];
    // Check probing specifically
    const hasProbing =
      toothData.probing.plaque ||
      toothData.probing.bleeding ||
      toothData.probing.pus ||
      toothData.probing.tartar;

    if (
      toothData.history.length > 0 ||
      toothData.notes.apical ||
      toothData.notes.devDisorder ||
      hasProbing
    ) {
      hasRecords = true;
      const tr = document.createElement("tr");

      let historyHtml = toothData.history
        .map((item) => {
          let detailStr = "";
          if (item.details && Object.keys(item.details).length > 0) {
            detailStr =
              " - " +
              JSON.stringify(item.details)
                .replace(/["{}]/g, "")
                .replace(/:/g, ": ");
          }
          const niceName = item.condition
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          return `<span class="summary-badge">${niceName}</span> <span style="color:#64748b;">${item.section} ${detailStr}</span>`;
        })
        .join("<br>");

      if (toothData.notes.apical)
        historyHtml += `<br><span class="summary-badge" style="background:#fae8ff; color:#a21caf;">Apical Note</span> <span style="color:#64748b;">${toothData.notes.apical}</span>`;
      if (toothData.notes.devDisorder)
        historyHtml += `<br><span class="summary-badge" style="background:#dcfce7; color:#15803d;">Dev. Disorder</span> <span style="color:#64748b;">${toothData.notes.devDisorder}</span>`;

      if (hasProbing) {
        let probeDetails = [];
        if (toothData.probing.plaque) probeDetails.push("Plaque");
        if (toothData.probing.bleeding) probeDetails.push("Bleeding");
        if (toothData.probing.pus) probeDetails.push("Pus");
        if (toothData.probing.tartar) probeDetails.push("Tartar");
        historyHtml += `<br><span class="summary-badge" style="background:#f1f5f9;">Probing Indicators</span> <span style="color:#64748b; font-weight:bold;">${probeDetails.join(", ")}</span>`;
      }

      tr.innerHTML = `<td class="summary-tooth-col">${fdi}</td><td>${historyHtml}</td>`;
      tbody.appendChild(tr);
    }
  });

  if (hasRecords) {
    summaryModalBody.appendChild(table);
  } else {
    summaryModalBody.innerHTML = `<div class="summary-empty-state">No chart history recorded yet. Please apply conditions to teeth to see the summary.</div>`;
  }
}

btnSummary.addEventListener("click", () => {
  renderSummary();
  summaryModal.style.display = "flex";
});

closeSummaryModalBtn.addEventListener("click", () => {
  summaryModal.style.display = "none";
});

exportJsonBtn.addEventListener("click", () => {
  console.log("--- EXPORTED DENTAL RECORD JSON ---");
  console.log(JSON.stringify(window.dentalRecord, null, 2));
  alert(
    "JSON Data successfully exported to the Browser Console! Press F12 to view the structured data ready for your backend.",
  );
});
