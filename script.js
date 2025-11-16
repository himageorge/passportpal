

// 1. Citizenship value -> passport ISO code
const PASSPORT_CODES = {
    nigeria: "NG",
    canada: "CA",
    uk: "GB",
    india: "IN"
};


// 4. Color -> human label
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
    const resultsList = document.querySelector(".results-list");



    // hide results initially
    resultsSection.style.display = "none";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const citizenship = citizenshipSelect.value;
        const passportCode = PASSPORT_CODES[citizenship];
        const departureDate = dateInput.value;  // not used yet, but we’ll need it later

        if (!passportCode) {
            alert("Please select your citizenship.");
            return;
        }

        if (!departureDate) {
            alert("Please choose your departure date.");
            return;
        }

        // show loading state
        resultsSection.style.display = "block";
        resultsList.innerHTML = `
            <div class="result-row">
                <span class="country-name">Loading...</span>
                <span class="visa-status">Fetching visa info</span>
            </div>
        `; 
    
        document.querySelector('button').addEventListener('click', () => {
        // URL where the GET request will be sent
        fetch ('http://localhost:3001/api/visa/map')
        // Obtains the text of the response in the form of a promise
        .then(res => res.text())
        // Changes the text of the paragraph to the response text
        .then(msg => {document.querySelector('p').innerText = msg;
        return msg;
        })
        .then(msg => {
            const json = JSON.parse(msg);  
            const colorsObj = json?.data?.colors || {};

            // turn { green: "FR,DE", red: "CN", ... } into [{code, color}, ...]
            const destinations = buildDestinationListFromMap(colorsObj);

            // just show first 20 to keep it light
            const limited = destinations.slice(0, 20);

            resultsList.innerHTML = "";

            if (limited.length === 0) {
                resultsList.innerHTML = `
                    <div class="result-row">
                        <span class="country-name">No destinations found</span>
                        <span class="visa-status">Try a different passport</span>
                    </div>
                `;
                return;
            }

            limited.forEach(dest => {
                const row = document.createElement("div");
                row.classList.add("result-row");

                row.innerHTML = `
                    <span class="country-name">${dest.code}</span>
                    <span class="visa-status">
                        ${COLOR_LABELS[dest.color] || "Visa status unavailable"}
                    </span>
                `;

                resultsList.appendChild(row);
            });
        });

    //     } catch (error) {
    //         console.error(error);
    //         resultsList.innerHTML = `
    //             <div class="result-row">
    //                 <span class="country-name">Error</span>
    //                 <span class="visa-status">Could not load visa data</span>
    //             </div>
    //         `;
    //     }
    // });
    });

// helper: convert colors object -> flat array
function buildDestinationListFromMap(colorsObj) {
    const result = [];
    const seen = new Set();

    Object.entries(colorsObj).forEach(([color, codesString]) => {
        if (!codesString) return;

        codesString
            .split(",")
            .map(c => c.trim())
            .filter(Boolean)
            .forEach(code => {
                if (!seen.has(code)) {
                    seen.add(code);
                    result.push({ code, color });
                }
            });
    });

    return result;
}
});
});

