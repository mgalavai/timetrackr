let selectedHoursCell;
let userRowNumber;

const loginForm = document.getElementById("login-form");
const spreadsheetId = "YOUR-ID";
const sheetName = "Hours worked";
const apiKey = "API-key";

function addLogoutButtonListener() {
  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", () => {
    document.getElementById("main-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
  });
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const passkey = document.getElementById("passkey").value;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  for (const [index, row] of data.values.entries()) {
    if (row[2] === email && row[3] === passkey) {
      document.getElementById("login-section").style.display = "none";
      document.getElementById("main-section").style.display = "block";
      document.getElementById("user-name").textContent = row[1];
      displayHoursWorked(data.values[0].slice(5), row.slice(5));
      for (let i = 0; i < data.values[0].slice(5).length; i++) {
        const dateCell = document.getElementById(`date-cell-${i}`);
        formatDateCell(dateCell);
        observer.observe(dateCell);
      }

      selectTodayCell();
      updateMonthYearSubheader();
      userRowNumber = index;
      addLogoutButtonListener();
      updateTotalHoursWorked(); // Add this line
      return false; // Prevent form submission
    }
  }
  alert("Invalid email or passkey.");
});

function displayHoursWorked(dates, hoursWorked) {
  const tbody = document.getElementById("hours-worked-body");
  const dateRow = document.createElement("tr");
  const hoursRow = document.createElement("tr");

  for (let i = 0; i < dates.length; i++) {
    const dateCell = document.createElement("td");
    const hoursCell = document.createElement("td");

    dateCell.textContent = dates[i];
    dateCell.id = `date-cell-${i}`;
    dateCell.dataset.originalDate = dates[i];
    hoursCell.textContent = hoursWorked[i];

    dateCell.onclick = () => {
      selectCell(dateCell, hoursCell);
      handleDateSelection(dateCell, hoursCell);
    };
    hoursCell.onclick = () => {
      selectCell(dateCell, hoursCell);
      handleDateSelection(dateCell, hoursCell);
    };

    dateRow.appendChild(dateCell);
    hoursRow.appendChild(hoursCell);
  }

  tbody.appendChild(dateRow);
  tbody.appendChild(hoursRow);
}

function selectCell(dateCell, hoursCell) {
  const selectedCells = document.querySelectorAll(".selected");
  selectedCells.forEach((cell) => cell.classList.remove("selected"));

  dateCell.classList.add("selected");
  hoursCell.classList.add("selected");
  selectedHoursCell = hoursCell;
}

function showMessage(message) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
}

function handleDateSelection(dateCell, hoursCell) {
  const today = new Date().toLocaleDateString();
  const selectedDate = new Date(
    dateCell.dataset.originalDate
  ).toLocaleDateString();
  if (selectedDate < today) {
    showMessage("We can't change the past... Unfortunately.");
  } else if (selectedDate > today) {
    showMessage("Who knows what the future holds");
  } else {
    const explanationText = "Enter the number of hours you've worked today:";

    const input = document.createElement("input");
    input.type = "number";
    input.value = hoursCell.textContent || "";

    const submitButton = document.createElement("button");
    submitButton.textContent = "Save";
    submitButton.onclick = () => saveHours(input.value, dateCell.cellIndex);

    const messageDiv = document.getElementById("message");
    messageDiv.innerHTML = "";
    messageDiv.appendChild(document.createTextNode(explanationText));
    messageDiv.appendChild(input);
    messageDiv.appendChild(submitButton);
  }
}

async function saveHours(hours, columnIndex) {
  const cell = `${String.fromCharCode(69 + columnIndex)}${userRowNumber + 1}`;
  const url = `https://script.google.com/macros/s/AKfycbyB8zAKKLAh5pxzcWANBIiv5DiIiBFs4R1-Mj-WMYQTYUbwXy7pKfQ9vw1CbhdIX4Ny/exec?sheetId=${spreadsheetId}&sheetName=${sheetName}&cell=${cell}&value=${hours}&apiKey=${apiKey}`;
  const response = await fetch(url);

  if (response.ok) {
    selectedHoursCell.textContent = hours;
    showMessage("Hours saved.");
    updateTotalHoursWorked(); // Add this line
  } else {
    showMessage("Error saving hours.");
  }
}

function formatDateCell(dateCell) {
  const originalDate = dateCell.textContent;
  const date = new Date(originalDate);
  const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
  const day = date.toLocaleDateString(undefined, { day: "numeric" });

  dateCell.innerHTML = `<div>${weekday}</div><div>${day}</div>`;
}

function updateMonthYearSubheader() {
  const table = document.getElementById("hours-worked");
  const monthYearSubheader = document.getElementById("month-year-subheader");
  if (!table.rows[0]) return;

  for (let i = 0; i < table.rows[0].cells.length; i++) {
    const dateCell = document.getElementById(`date-cell-${i}`);
    const cellRect = dateCell.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();

    if (cellRect.left >= tableRect.left && cellRect.right <= tableRect.right) {
      const date = new Date(dateCell.dataset.originalDate);
      monthYearSubheader.textContent = date.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
      break;
    }
  }
}

updateMonthYearSubheader();
document
  .querySelector("#main-section > div[style]")
  .addEventListener("scroll", updateMonthYearSubheader);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const dateCell = entry.target;
        const date = new Date(dateCell.dataset.originalDate);
        const monthYearSubheader = document.getElementById(
          "month-year-subheader"
        );
        monthYearSubheader.textContent = date.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        });
      }
    });
  },
  { threshold: 0.5 }
);

function selectTodayCell() {
  const today = new Date().toLocaleDateString();
  const todayCell = Array.from(document.querySelectorAll("#hours-worked td")).find(
    (cell) => new Date(cell.dataset.originalDate).toLocaleDateString() === today
  );
  if (todayCell) {
    console.log("Today's cell found:", todayCell);
    todayCell.click();
  } else {
    console.log("Today's cell not found");
  }
}

function scrollToTodayCell() {
  const today = new Date().toLocaleDateString();
  const todayCell = Array.from(document.querySelectorAll("#hours-worked td")).find(
    (cell) => new Date(cell.dataset.originalDate).toLocaleDateString() === today
  );
  if (todayCell) {
    console.log("Scrolling to today's cell:", todayCell);
    todayCell.scrollIntoView({ block: "nearest", inline: "center" });
  } else {
    console.log("Today's cell not found for scrolling");
  }
}

async function updateTotalHoursWorked() {
  const cell = `E${userRowNumber + 1}`; // Calculate the cell address
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${cell}?valueRenderOption=UNFORMATTED_VALUE&key=${apiKey}`; // Use the cell address in the API request
  const response = await fetch(url);
  const data = await response.json();

  console.log(data); // Log the response data

  const totalHours = data.values[0][0]; // Get the value from the first cell

  const totalHoursElement = document.getElementById("total-hours");
  totalHoursElement.textContent = `Total hours worked this month: ${totalHours}`;
}