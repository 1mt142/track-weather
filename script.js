const weekSelect = document.getElementById("weekSelect");
const startTrackingBtn = document.getElementById("startTracking");
const tableContainer = document.getElementById("tableContainer");
let allWeek;

// Function to format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Function to get the weeks of the current month
function getWeeksOfMonth() {
  const weeks = [];
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  let currentDay = firstDayOfMonth;
  while (currentDay.getMonth() === currentDate.getMonth()) {
    const startOfWeek = new Date(currentDay);
    const endOfWeek = new Date(currentDay);
    endOfWeek.setDate(currentDay.getDate() + 6);

    weeks.push({
      startDate: formatDate(startOfWeek),
      endDate: formatDate(endOfWeek),
    });

    currentDay.setDate(currentDay.getDate() + 7);
  }

  return weeks;
}

// Function to populate the dropdown with week options
function populateWeeks() {
  const weeks = getWeeksOfMonth();
  const weekSelect = document.getElementById("weekSelect");
  allWeek = weeks;
  weeks.forEach((week, index) => {
    const option = document.createElement("option");
    (option.value = index),
      (option.textContent = `Week ${index + 1}: ${week.startDate} - ${
        week.endDate
      }`);
    weekSelect.appendChild(option);
  });
}
// Function to fetch weather data and display the table
async function fetchWeatherData(start_date, end_date) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&timezone=America/New_York&daily=temperature_2m_max,temperature_2m_min&start_date=${start_date}&end_date=${end_date}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("API Error");
    }
    const data = await response.json();
    console.log("API Data", data);
  } catch (error) {
    displayErrorMessage();
  }
}

// Function to display error message
function displayErrorMessage() {
  tableContainer.innerHTML = "An error occurred.";
}

// Event listener for Start Tracking button
startTrackingBtn.addEventListener("click", () => {
  const { startDate, endDate } = allWeek[weekSelect.value];
  fetchWeatherData(startDate, endDate);
});

// Populate dropdown options on page load
populateWeeks();
