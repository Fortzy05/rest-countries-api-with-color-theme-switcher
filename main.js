const darkModeBtn = document.getElementById("dark-mode-btn");
const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") {
    darkModeBtn.innerHTML = " <i class='ri-moon-fill'></i> Light Mode";
  }
}

darkModeBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.removeAttribute("data-theme");
    darkModeBtn.innerHTML = " <i class='ri-moon-line'></i> Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    darkModeBtn.innerHTML = " <i class='ri-moon-fill'></i> Light Mode";
    localStorage.setItem("theme", "dark");
  }
});

const countryListContainer = document.getElementById("country-list-container");
const searchInput = document.getElementById("searchInput");
const filterRegionDropdown = document.getElementById("filter-input");
let allCountries = [];

searchInput.addEventListener("input", updateCountryResults);

function getSearchInput() {
  return searchInput.value.toLowerCase().trim();
}

function getFilterInput() {
  return filterRegionDropdown.value;
}

function searchResults(countryData, searchQuery) {
  return countryData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery)
  );
}

function filterResults(countryData, filterOption) {
  return countryData.filter((item) =>
    item.region.toLowerCase().includes(filterOption.toLowerCase().trim())
  );
}
