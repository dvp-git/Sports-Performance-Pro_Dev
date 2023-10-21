today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = parseInt(selectMonth.value);
  showCalendar(currentMonth, currentYear);
}

function highlightCurrentDate() {
  // Get the current date
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Find the table cells that represent the current date
  const cells = document.querySelectorAll("td");

  cells.forEach((cell) => {
    if (
      cell.innerHTML === currentDay.toString() &&
      cell.classList.contains("bg-info")
    ) {
      // Highlight the current date
      cell.classList.add("today-date");
    }
  });
}

function showCalendar(month, year) {
  let firstDay = new Date(year, month).getDay();

  tbl = document.getElementById("calendar-body"); // body of the calendar

  // clearing all previous cells
  tbl.innerHTML = "";

  // filing data about month and in the page via DOM.
  monthAndYear.innerHTML = months[month] + " " + year;
  selectYear.value = year;
  selectMonth.value = month;

  // creating all cells
  let date = 1;
  for (let i = 0; i < 6; i++) {
    // creates a table row
    let row = document.createElement("tr");

    // creating individual cells, filling them up with data
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = document.createElement("td");
        cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth(month, year)) {
        break;
      } else {
        cell = document.createElement("td");
        cellText = document.createTextNode(date);

        cell.appendChild(cellText);
        row.appendChild(cell);
        date++;
      }
    }
    tbl.appendChild(row); // appending each row into the calendar body
  }

  // Highlight today's date with the "today-date" class
  tbl.querySelectorAll("td").forEach((cell) => {
    if (
      cell.innerHTML === today.getDate().toString() &&
      year === today.getFullYear() &&
      month === today.getMonth()
    ) {
      cell.classList.add("today-date");
    }

    // Add a click event listener to the date cell
    cell.addEventListener("click", function () {
      // Remove the "clicked-date" class from all cells
      tbl
        .querySelectorAll("td.clicked-date")
        .forEach((c) => c.classList.remove("clicked-date"));
      // Apply the "clicked-date" class to the clicked cell
      cell.classList.add("clicked-date");
    });
  });

  // Call the function to highlight the current date
  highlightCurrentDate();
}

// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}
