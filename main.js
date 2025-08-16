const darkModeBtn = document.getElementById("dark-mode-btn");
const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") {
    darkModeBtn.innerHTML = "<i class='ri-moon-fill'></i> Light Mode";
  }
}

darkModeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  if (current === "dark") {
    document.documentElement.removeAttribute("data-theme");
    darkModeBtn.innerHTML = "<i class='ri-moon-line'></i> Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    darkModeBtn.innerHTML = "<i class='ri-moon-fill'></i> Light Mode";
    localStorage.setItem("theme", "dark");
  }
});

const countryListContainer = document.getElementById("country-list-container");
const searchInput = document.getElementById("searchInput");
const filterRegionDropdown = document.getElementById("filter-input");
const countryDetailContainer = document.getElementById(
  "country-detail-container"
);

let allCountries = [];

// 🔤 ADDED: consistent, locale-aware alphabetical sorting
function sortCountries(list) {
  return [...list].sort((a, b) =>
    a.name.common.localeCompare(b.name.common, undefined, {
      sensitivity: "base",
    })
  );
}

searchInput.addEventListener("input", updateCountryResults);
filterRegionDropdown.addEventListener("change", updateCountryResults);

function getSearchInput() {
  return searchInput.value.toLowerCase().trim();
}

function getFilterInput() {
  return filterRegionDropdown.value;
}

function searchResults(data, query) {
  return data.filter((item) => item.name.common.toLowerCase().includes(query));
}

function filterResults(data, region) {
  return data.filter((item) => item.region === region);
}

function updateCountryResults() {
  const searchTerm = getSearchInput();
  const selectedRegion = getFilterInput();

  let results = allCountries;

  if (selectedRegion !== "default") {
    results = filterResults(results, selectedRegion);
  }

  results = searchResults(results, searchTerm);

  // 🔤 ADDED: sort results before displaying
  displayCountry(sortCountries(results));
}

async function fetchCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,subregion,tld,currencies,languages,borders"
    );
    if (!response.ok) throw new Error("Network response was not ok");

    allCountries = await response.json();

    // 🔤 ADDED: sort once for initial render
    allCountries = sortCountries(allCountries);

    displayCountry(allCountries);
  } catch (err) {
    console.error("Error fetching countries:", err);
  }
}

function displayCountry(countries) {
  countryListContainer.innerHTML = "";
  countries.forEach((country) => {
    const countryItem = document.createElement("button");
    countryItem.className = "country-item";
    countryItem.innerHTML = `
      <img src="${country.flags.svg}" alt="${
      country.name.common
    }" class="country-flag">
      <div class="country-quick-info">
        <h2>${country.name.common}</h2>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
      </div>
    `;

    countryItem.addEventListener("click", () => {
      countryListContainer.style.display = "none";
      document.getElementById("country-detail-container").classList.add("show");
      displayCountryDetail(country);
    });

    countryListContainer.appendChild(countryItem);
  });
}

function displayCountryDetail(country) {
  const countryDetailContainer = document.getElementById(
    "country-detail-container"
  );

  countryDetailContainer.innerHTML = `
    <button id="back-btn" class="back-btn"><i class="ri-arrow-left-line"></i> Back</button>

    <div class="country-information">
      <div class="country-flag">
        <img src="${country.flags.svg}" alt="${country.name.common}">
      </div>
      <div class="country-details ">
        <h1>${country.name.common}</h1>
        <ul>
          <li><strong>Native Name:</strong> ${
            country.name.nativeName
              ? Object.values(country.name.nativeName)[0].common
              : "N/A"
          }</li>
          <li><strong>Population:</strong> ${country.population.toLocaleString()}</li>
          <li><strong>Region:</strong> ${country.region}</li>
          <li><strong>Subregion:</strong> ${country.subregion || "N/A"}</li>
          <li><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</li>
          <li><strong>Top Level Domain:</strong> ${
            country.tld?.[0] || "N/A"
          }</li>
          <li><strong>Currencies:</strong> ${
            country.currencies
              ? Object.values(country.currencies)
                  .map((c) => c.name)
                  .join(", ")
              : "N/A"
          }</li>
          <li><strong>Languages:</strong> ${
            country.languages
              ? Object.values(country.languages).join(", ")
              : "N/A"
          }</li>
        </ul>
        ${
          country.borders?.length
            ? `<div class="country-borders">
                <strong>Border Countries: </strong>
                <div class="border-list">
                  ${country.borders
                    .map(
                      (border) =>
                        `<span class="border-country">${border}</span>`
                    )
                    .join("")}
                </div>
              </div>`
            : `<p><strong>Border Countries:</strong> None</p>`
        }
      </div>
    </div>
  `;

  const backBtn = countryDetailContainer.querySelector("#back-btn");
  backBtn.addEventListener("click", () => {
    countryDetailContainer.innerHTML = "";
    countryDetailContainer.classList.remove("show");
    countryListContainer.style.display = "grid";
  });
}

fetchCountries();
