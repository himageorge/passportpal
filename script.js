const COLOR_LABELS = {
    green: "Visa free / freedom of movement",
    blue: "Visa on arrival / eVisa",
    yellow: "eTA / visa waiver / registration",
    red: "Visa required / full visa likely needed"
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".search-form");
    const citizenshipSelect = document.getElementById("citizenship");
    const dateInput = document.getElementById("departure-date");
    const resultsSection = document.querySelector(".results");
    const COLOR_LABELS = {
        green: "Visa free",
        blue: "Visa on arrival / eVisa",
        yellow: "eTA / visa waiver / registration",
        red: "Visa required "
    };

    const modal = document.getElementById("visaModal");
    const closeBtn = modal.querySelector(".close-modal");
    const modalTitle = modal.querySelector(".modal-country-name");
    const modalBody = modal.querySelector(".modal-body");

    document.querySelectorAll(".visa-header").forEach(header => {
    header.addEventListener("click", () => {
        const targetId = header.dataset.target;
        const list = document.getElementById(targetId);
        const arrow = header.querySelector(".toggle-arrow");

        if (list.classList.contains("expanded")) {
            list.style.maxHeight = "0px";
            list.classList.remove("expanded");
            arrow.style.transform = "rotate(180deg)";
        } else {
            list.classList.add("expanded");
            list.style.maxHeight = list.scrollHeight + "px";
            arrow.style.transform = "rotate(0deg)";
        }
    });
});
    let countriesData = [];

    // Hide results initially
    resultsSection.style.display = "none";

    // Close modal handlers
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // ---------- LOAD COUNTRIES ----------
    async function loadCountries() {
        try {
            const response = await fetch("http://localhost:3001/api/passports");
            const json = await response.json();

            countriesData = json.data;

            citizenshipSelect.innerHTML =
                '<option value="">Select your citizenship</option>';

            countriesData.forEach((country) => {
                const option = document.createElement("option");
                option.value = country.iso_alpha2; // ISO code
                option.textContent = country.name; // name
                citizenshipSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading countries:", error);
            citizenshipSelect.innerHTML =
                '<option value="">Error loading countries</option>';
        }
    }

    // ---------- FETCH VISA DETAILS FOR ONE DEST ----------
    async function fetchVisaDetails(passportCode, destinationCode) {
        try {
            const response = await fetch(
                "http://localhost:3001/api/visa/check",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        passport: passportCode,
                        destination: destinationCode
                    })
                }
            );
            const json = await response.json();
            return json.data;
        } catch (error) {
            console.error("Error fetching visa details:", error);
            throw error;
        }
    }

    // ---------- SHOW MODAL ----------
    function showVisaDetails(countryName, details, clickedRow) {
        modalTitle.textContent = `Visa Requirements for ${countryName}`;

        let requirementsHTML = '<div class="requirements-list">';

        // Primary Rule
        if (details.visa_rules?.primary_rule) {
            const primaryRule = details.visa_rules.primary_rule;

            requirementsHTML += `
                <div class="requirement-item primary-rule">
                    <strong>Primary Rule:</strong>
                    <div class="rule-details">
                        <span class="rule-badge" style="background-color: ${primaryRule.color}">
                            ${primaryRule.name || "N/A"}
                        </span>
                        ${
                            primaryRule.duration
                                ? `<span class="duration">Duration: ${primaryRule.duration}</span>`
                                : ""
                        }
                    </div>
                </div>
            `;
        }

        // Secondary Rule
        if (
            details.visa_rules?.secondary_rule &&
            details.visa_rules.secondary_rule.name !== "N/A"
        ) {
            const secondaryRule = details.visa_rules.secondary_rule;

            requirementsHTML += `
                <div class="requirement-item secondary-rule">
                    <strong>Secondary Rule:</strong>
                    <div class="rule-details">
                            ${secondaryRule.name}
                        </span>
                        ${
                            secondaryRule.duration !== "N/A"
                                ? `<span class="duration">Duration: ${secondaryRule.duration}</span>`
                                : ""
                        }
                    </div>
                </div>
            `;
        }

        // Passport Validity
        if (details.passport_validity && details.passport_validity !== "N/A") {
            requirementsHTML += `
                <div class="requirement-item">
                    <strong>Passport Validity Required:</strong>
                    <span class="requirement-value">${details.passport_validity}</span>
                </div>
            `;
        }

        // Mandatory Registration
        if (details.mandatory_registration) {
            requirementsHTML += `
                <div class="requirement-item warning">
                    <strong>⚠️ Mandatory Registration:</strong>
                    <p class="requirement-value">${details.mandatory_registration}</p>
                </div>
            `;
        }

        requirementsHTML += "</div>";

        modalBody.innerHTML = requirementsHTML;
        modal.classList.add("show-beside-row");

        // Position next to row
        if (clickedRow) {
            const rowRect = clickedRow.getBoundingClientRect();
            const modalWidth = 400;

            if (rowRect.right + modalWidth + 10 > window.innerWidth) {
                modal.classList.add("flip-left");
            } else {
                modal.classList.remove("flip-left");
            }

            modal.style.setProperty("--row-top", `${rowRect.top}px`);
            modal.style.setProperty("--row-right", `${rowRect.right}px`);
            modal.style.setProperty("--row-left", `${rowRect.left}px`);
        }

        modal.style.display = "block";
    }

    // ---------- DISPLAY RESULTS FOR ONE CATEGORY ----------
    function displayResults(targetId, passportCode, destinations) {
        const container = document.getElementById(targetId);
        if (!container) return;

        container.innerHTML = "";

        if (destinations.length === 0) {
            container.innerHTML = `
                <div class="result-row">
                    <span class="country-name">No destinations found</span>
                    <span class="visa-status">—</span>
                </div>
            `;
            return;
        }

        destinations.forEach((dest) => {
            const row = document.createElement("div");
            row.classList.add("result-row");
            row.style.cursor = "pointer";

            const destCountry = countriesData.find(
                (c) => c.iso_alpha2 === dest.code
            );
            const countryName = destCountry ? destCountry.name : dest.code;

            row.innerHTML = `
                <span class="country-name">${countryName}</span>
                <span class="visa-status ${dest.color}">
                    ${COLOR_LABELS[dest.color] || "Visa status unavailable"}
                </span>
                <span class="details-icon">ℹ️</span>
            `;

            // Click for detailed modal
            row.addEventListener("click", async () => {
                const originalHTML = row.innerHTML;
                try {
                    row.innerHTML = `
                        <span class="country-name">${countryName}</span>
                        <span class="visa-status">Loading details...</span>
                    `;
                    const details = await fetchVisaDetails(
                        passportCode,
                        dest.code
                    );
                    row.innerHTML = originalHTML;

                    if (details) {
                        showVisaDetails(countryName, details, row);
                    } else {
                        alert(
                            "No detailed information available for this destination."
                        );
                    }
                } catch (err) {
                    console.error("Error fetching details:", err);
                    alert("Failed to fetch visa details. Please try again.");
                    row.innerHTML = originalHTML;
                }
            });

            row.addEventListener("mouseenter", () => {
                row.style.backgroundColor = "#f0f0f0";
            });

            row.addEventListener("mouseleave", () => {
                row.style.backgroundColor = "";
            });

            container.appendChild(row);
        });
    }

    // ---------- INITIALISE ----------
    loadCountries();

    // ---------- FORM SUBMIT ----------
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const passportCode = citizenshipSelect.value;
        const departureDate = dateInput.value; // unused for now

        if (!passportCode) {
            alert("Please select your citizenship.");
            return;
        }

        // Show results & loading state
        resultsSection.style.display = "block";

        document.getElementById("visa-free").innerHTML = `
            <div class="result-row">
                <span class="country-name">Loading...</span>
                <span class="visa-status">Fetching visa info</span>
            </div>
        `;
        document.getElementById("visa-arrival").innerHTML = `
            <div class="result-row">
                <span class="country-name">Loading...</span>
            </div>
        `;
        document.getElementById("visa-required").innerHTML = `
            <div class="result-row">
                <span class="country-name">Loading...</span>
            </div>
        `;

        try {
            const response = await fetch("http://localhost:3001/api/visa/map", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    passport: passportCode
                })
            });

            const json = await response.json();
            const colorsObj = json?.data?.colors || {};

            const destinations = buildDestinationListFromMap(colorsObj);
            const filteredDestinations = destinations.filter(
                (dest) => dest.code !== passportCode
            );

            const grouped = splitByVisaType(filteredDestinations);

            displayResults("visa-free", passportCode, grouped.free);
            displayResults("visa-arrival", passportCode, grouped.arrival);
            displayResults("visa-required", passportCode, grouped.required);
        } catch (error) {
            console.error("Error fetching visa map:", error);

            ["visa-free", "visa-arrival", "visa-required"].forEach((id) => {
                const container = document.getElementById(id);
                container.innerHTML = `
                    <div class="result-row">
                        <span class="country-name">Error loading data</span>
                        <span class="visa-status">Please try again</span>
                    </div>
                `;
            });
        }
    });
});

// ---------- HELPERS OUTSIDE DOMCONTENTLOADED ----------
function splitByVisaType(destinations) {
    return {
        free: destinations.filter((d) => d.color === "green"),
        arrival: destinations.filter(
            (d) => d.color === "blue" || d.color === "yellow"
        ),
        required: destinations.filter((d) => d.color === "red")
    };
}

function buildDestinationListFromMap(colorsObj) {
    const result = [];
    const seen = new Set();

    Object.entries(colorsObj).forEach(([color, codesString]) => {
        if (!codesString) return;

        codesString
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
            .forEach((code) => {
                if (!seen.has(code)) {
                    seen.add(code);
                    result.push({ code, color });
                }
            });
    });

    return result;
}
