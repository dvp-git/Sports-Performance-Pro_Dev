// TODO: Create a Assign Exercise button if the number of rows greater than 1.
// TODO: View Exercise on clicking a particular exercise button.
// TODO:
// - The Add an Exercise Button should have Exercise Name , Exercise Category which we can set from the database. The SETS should be input, which will generate the dynamic table rows for number of sets.

// TODO: Clicking a particular Exercise should show the details of the assigned exercise

// TODO: Modify an exercise should pre-popiulate with the entries of that exercise and then have user input to modify those entries. Modify button is required.

// TODO: Delete button, should pre-populate with entries of the exercise and request for confirmation.
// TODO: Change name of Block
// TODO: Change name of Exercise

// TODO: Need to discuss about Notes part
// TODO: Storing of data in the objects
"use strict";
const athleteData = [
  {
    name: "John Doe",
    blocks: [
      {
        id: 1,
        exercises: ["Exercise 1", "Exercise 2"],
      },
      {
        id: 2,
        exercises: ["Exercise 3"],
      },
    ],
  },
  {
    name: "Darryl",
    blocks: [
      {
        id: 1,
        exercises: ["Exercise 1", "Push Ups", "Squats"],
      },
      {
        id: 2,
        exercises: ["Jogging", "Yoga"],
      },
      {
        id: 3,
        exercises: ["Running"],
      },
    ],
  },

  // Add more athlete data as needed
];

const blockTabs = document.getElementById("block-tabs");
const exerciseTabs = document.getElementById("exercise-tabs");
const exerciseDetails = document.getElementById("exercise-details");
const athleteSearchInput = document.getElementById("athlete-search");
const addBlockButton = document.getElementById("add-block-button");
const addExerciseButton = document.getElementById("add-exercise-button");
const athleteList = document.getElementById("athlete-list");
let tbodyExercise = document.querySelector(".create-exercise-rows");
let tbodyCount = tbodyExercise.childElementCount;

let selectedAthlete = null;
let selectedBlock = null;

// Function to display blocks for the selected athlete
function displayBlocks(athlete) {
  selectedBlock = blockTabs.innerHTML = "";
  exerciseTabs.innerHTML = "";
  exerciseDetails.innerHTML = "Select a Block to view details.";

  // Efficiency :
  athlete.blocks.forEach((block, index) => {
    console.log(`Running this display block`);
    const blockButton = document.createElement("button");
    blockButton.innerText = `Block ${block.id}`;
    blockButton.addEventListener("click", (e) => displayExercises(e, block));
    blockTabs.appendChild(blockButton);
  });
  // Show "Add a Block" button

  addBlockButton.classList.remove(["add-block-btn-hide"]);
  // console.log(addBlockButton);
  blockTabs.appendChild(addBlockButton);
}

// Function to display exercises for the selected block
function displayExercises(e, block) {
  selectedBlock = e.target;
  console.log(selectedBlock);
  exerciseTabs.innerHTML = "";
  exerciseDetails.innerHTML = "Select an exercise to view details.";
  block.exercises.forEach((exercise, index) => {
    const exerciseButton = document.createElement("button");
    exerciseButton.innerText = exercise;
    exerciseButton.addEventListener("click", () =>
      displayExerciseDetails(exercise)
    );
    exerciseTabs.appendChild(exerciseButton);
  });
  console.log(addExerciseButton);
  // Show "Add an Exercise" button
  addExerciseButton.classList.remove(["add-exercise-btn-hide"]);
  // console.log(addExerciseButton);
  // console.log(exerciseTabs);
  exerciseTabs.appendChild(addExerciseButton);
}

// Function to display exercise details
function displayExerciseDetails(exercise) {
  exerciseDetails.innerHTML = `Details for: ${exercise}`;
}

// Function to display the list of athletes
function displayAthletes() {
  athleteList.innerHTML = "";

  athleteData.forEach((athlete, index) => {
    // console.log(`Number of times this is run`);
    const athleteName = document.createElement("li");
    athleteName.innerText = athlete.name;
    athleteName.addEventListener("click", () =>
      displayAthleteTraining(athlete)
    );
    athleteList.appendChild(athleteName);
  });
}

// Function to display an athlete's training sessions
function displayAthleteTraining(athlete) {
  // Clear existing content
  blockTabs.innerHTML = "";
  exerciseTabs.innerHTML = "";
  exerciseDetails.innerHTML = "";

  // Display the athlete's data
  displayBlocks(athlete);
}

// Function to search for an athlete
function searchAthlete() {
  const searchQuery = athleteSearchInput.value.trim();
  const foundAthlete = athleteData.find(
    (athlete) => athlete.name === searchQuery
  );

  if (foundAthlete) {
    selectedAthlete = foundAthlete;
    displayBlocks(selectedAthlete);
  } else {
    selectedAthlete = null;
    alert("Athlete not found");
    blockTabs.innerHTML = "";
    exerciseTabs.innerHTML = "";
    exerciseDetails.innerHTML = "Select an athlete to begin";
    // addBlockButton.style.display = "none";
    // addExerciseButton.style.display = "none";
  }
}

// Function to add a block for the selected athlete
function addBlock(athlete) {
  const newBlockId = athlete.blocks.length + 1;
  athlete.blocks.push({ id: newBlockId, exercises: [] });
  displayBlocks(athlete);
}

function getBlockNumber(block) {
  const number = block.textContent.match(/\d+/g);
  // Check if numbers were found and join them into a string
  const numbersString = number ? number.join("") : "";
  return Number(numbersString);
}

function addExercise(athlete, block) {
  // Selected block
  console.log(exerciseDetails);
  console.log(athlete);
  console.log(block);
  // Extracting block number for reference into object
  const block_index = getBlockNumber(block);
  console.log(`block_index : ${block_index}`);
  console.log(athlete.blocks);
  console.log(athlete.blocks[1].exercises.length);
  // [block_index].exercises.length + 1;
  console.log(athlete.blocks[1].exercises.length);
  console.log(athlete.blocks[block_index - 1]);
  // newExerciseId = newExerciseId + 1;
  // console.log(`NewExerciseID: ${newExerciseId}`);
  athlete.blocks[block_index - 1].exercises.push(
    "Exercise Name : This is a test"
  );
  // athlete.blocks[block_index - 1].exercises.push(object);
  // displayExercises(athlete, block); //
  loadTable();
}

function addExerciseDetails() {
  // SETS
  // Have an input element created for SET : id="set-number"
  // Extract the textContent of the input set element
  // Have a table element
  // Create input cell entries for LOADS and REPS for each row: For example if the SET = 3
  // then  it should create 3 <tr> elements and for each we have  <tr> SET number</tr> , <td> LOADS </td> and <td> REPS </td>
  // Loads_Reps = f(Set)  => is json
}

const addSetsBtn = document.getElementById("addSets-btn");
const addSetBtn = document.getElementById("addSet-btn");
const delSet = document.getElementById("delSet-btn");
const delAllSetsBtn = document.getElementById("delSets-btn");
const exerciseTable = document.querySelector("#create-exercise");
const exerciseTableContainer = document.getElementById("table-container");

// function delAllSetsBtn() {
//   // Display t
// }

// FIXME:
function addSingleSet() {
  tbodyExercise = document.querySelector(".create-exercise-rows");
  tbodyCount = tbodyExercise.childElementCount;
  const row = document.createElement("tr");
  const setCell = document.createElement("td");
  setCell.textContent = `${tbodyCount + 1}`;

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
  // Append the new table to the container
  exerciseTableContainer.appendChild(exerciseTable);
}

function loadTable() {
  // View the Sets
  console.log("Before class removal:", exerciseTableContainer);

  // const console.log(document.getElementById("table-container")); // IS NULL
  exerciseDetails.appendChild(exerciseTableContainer);
  exerciseTableContainer.classList.remove("create-exercise-table-hide");
}

// CREATE TABLE FUNCTION
function createExerciseTable() {
  console.log("Im inside createExercise table");
  const setNumber = parseInt(document.getElementById("set-number").value, 10);

  console.log(document.querySelector(".create-exercise-rows"));

  tbodyExercise = document.querySelector(".create-exercise-rows");
  tbodyCount = tbodyExercise.childElementCount;
  console.log(tbodyCount);

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
  console.log(tbodyCount);
  const assignExercises =
    tbodyCount > 1 ? addAssignExerciseBtn(exerciseTableContainer) : null;
}

// FIXME:
function addAssignExerciseBtn(exerciseTableContainer) {
  console.log("Inside assign Exercise Button");
  console.log(exerciseTableContainer);
}

addSetsBtn.addEventListener("click", createExerciseTable);

addSetBtn.addEventListener("click", addSingleSet);

// Add event listener for the "Search" button
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", searchAthlete);

// Add event listeners for the "Add a Block" and "Add an Exercise" buttons
addBlockButton.addEventListener("click", () => addBlock(selectedAthlete));
addExerciseButton.addEventListener("click", () =>
  addExercise(selectedAthlete, selectedBlock)
);

// OLD CREATE TABLE
/*
function createTable() {
  const setNumber = parseInt(document.getElementById("set-number").value, 10);
  const tableContainer = document.getElementById("table-container");

  if (isNaN(setNumber) || setNumber <= 0) {
    alert("Please enter a valid positive number for the set.");
    return;
  }
  const table = document.createElement("table");

  for (let i = 1; i <= setNumber; i++) {
    const row = document.createElement("tr");
    const setCell = document.createElement("td");
    setCell.textContent = `SET ${i}`;
    const loadsCell = document.createElement("td");
    loadsCell.textContent = "LOADS";
    const repsCell = document.createElement("td");
    repsCell.textContent = "REPS";

    row.appendChild(setCell);
    row.appendChild(loadsCell);
    row.appendChild(repsCell);

    table.appendChild(row);
  }

  // Clear any previous tables
  while (tableContainer.firstChild) {
    tableContainer.removeChild(tableContainer.firstChild);
  }

  // Append the new table to the container
  tableContainer.appendChild(table);
}
*/
