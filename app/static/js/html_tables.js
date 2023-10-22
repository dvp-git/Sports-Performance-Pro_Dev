"use strict";

function createTable() {
  const setNumber = parseInt(document.getElementById("set-number").value, 10);
  const tableContainer = document.getElementById("table-container");
  console.log(tableContainer);

  if (isNaN(setNumber) || setNumber <= 0) {
    alert("Please enter a valid positive number for the set.");
    return;
  }

  console.log(document.querySelector("tbody"));

  //   const table = document.createElement("table");
  //   const thead = document.createElement("thead");
  //   const tbody = document.createElement("tbody");
  //   const trow = document.createElement("tr");

  // //   const td1 = document.createElement("td");
  // //   td1.textContent = "SET";

  // //   const td2 = document.createElement("td");
  // //   td2.textContent = "REP";

  // //   const td3 = document.createElement("td");
  // //   td3.textContent = "LOAD";

  //   const td4 = document.createElement("td");
  //   td4.textContent = "";

  //   const td5 = document.createElement("td");
  //   td5.textContent = "";
  const tbody = document.querySelector("tbody");
  const tbodyCount = tbody.childElementCount;
  console.log(tbodyCount);
  //   trow.append(td1);
  //   trow.append(td2);
  //   trow.append(td3);
  //   trow.append(td4);
  //   trow.append(td5);
  //   thead.appendChild(trow);

  //   table.appendChild(thead);
  //   table.appendChild(tbody);

  for (let i = tbodyCount + 1; i <= tbodyCount + setNumber; i++) {
    const row = document.createElement("tr");
    const setCell = document.createElement("td");
    setCell.textContent = `${i}`;

    const loadsCell = document.createElement("td");
    const loads_input = document.createElement("input");
    loads_input.type = "number";
    loadsCell.appendChild(loads_input);

    const repsCell = document.createElement("td");
    const reps_input = document.createElement("input");
    reps_input.type = "number";
    repsCell.appendChild(reps_input);

    const editCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.textContent = "📝";
    editCell.appendChild(editButton);

    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteCell.appendChild(deleteButton);

    row.appendChild(setCell);
    row.appendChild(loadsCell);
    row.appendChild(repsCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);

    tbody.appendChild(row);
  }

  // Append the new table to the container
  tableContainer.appendChild(table);
}

// Add event listener to create the table when the input field loses focus

addSetsBtn.addEventListener("click", createTable);

/*
// CREATE TABLE FUNCTION
function createExerciseTable() {
  console.log("Im inside createExercise table");
  // console.log(exerciseTableContainer);
  const setNumber = parseInt(document.getElementById("set-number").value, 10);
  // const tableContainer = document.getElementById("table-container");

  // if (isNaN(setNumber) || setNumber <= 0) {
  //   alert("Please enter a valid positive number for the set.");
  //   return;
  // }

  console.log(document.querySelector(".create-exercise-row"));

  //   const table = document.createElement("table");
  //   const thead = document.createElement("thead");
  //   const tbody = document.createElement("tbody");
  //   const trow = document.createElement("tr");

  // //   const td1 = document.createElement("td");
  // //   td1.textContent = "SET";

  // //   const td2 = document.createElement("td");
  // //   td2.textContent = "REP";

  // //   const td3 = document.createElement("td");
  // //   td3.textContent = "LOAD";

  //   const td4 = document.createElement("td");
  //   td4.textContent = "";

  //   const td5 = document.createElement("td");
  //   td5.textContent = "";
  const tbodyExercise = document.querySelector(".create-exercise-row");
  const tbodyCount = tbodyExercise.childElementCount;
  console.log(tbodyCount);
  //   trow.append(td1);
  //   trow.append(td2);
  //   trow.append(td3);
  //   trow.append(td4);
  //   trow.append(td5);
  //   thead.appendChild(trow);

  //   table.appendChild(thead);
  //   table.appendChild(tbody);
  for (let i = tbodyCount + 1; i <= tbodyCount + setNumber; i++) {
    const row = document.createElement("tr");
    const setCell = document.createElement("td");
    setCell.textContent = `${i}`;

    const loadsCell = document.createElement("td");
    const loads_input = document.createElement("input");
    loads_input.type = "number";
    loadsCell.appendChild(loads_input);

    const repsCell = document.createElement("td");
    const reps_input = document.createElement("input");
    reps_input.type = "number";
    repsCell.appendChild(reps_input);

    const editCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.textContent = "📝";
    editCell.appendChild(editButton);

    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteCell.appendChild(deleteButton);

    row.appendChild(setCell);
    row.appendChild(loadsCell);
    row.appendChild(repsCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);

    tbodyExercise.appendChild(row);
  }
  // Append the new table to the container
  exerciseTableContainer.appendChild(exerciseTable);
}
*/
