// TODO: Create a Assign Exercise button if the number of rows greater than 1.

// TODO:
// - The Add an Exercise Button should have Exercise Name , Exercise Category which we can set from the database. The SETS should be input, which will generate the dynamic table rows for number of sets.✅

// TODO: Clicking a particular Exercise should show the details of the assigned exercise

// TODO: Modify an exercise should pre-popiulate with the entries of that exercise and then have user input to modify those entries. Modify button is required.

// TODO: Delete button, should pre-populate with entries of the exercise and request for confirmation.
// TODO: Change name of Block
// TODO: Change name of Exercise

// TODO: Need to discuss about Notes part
// TODO: Storing of data in the objects

// TODO: Scrollable blocks and exercises
// TODO: Listing of athletes ( 1 page )  listing of Teams( 2 page )

"use strict";

const blockTabs = document.getElementById("block-tabs");
const exerciseTabs = document.getElementById("exercise-tabs");
const exerciseDetails = document.getElementById("exercise-details");
const athleteSearchInput = document.getElementById("athlete-search");
const addBlockButton = document.getElementById("add-block-button");
const addExerciseButton = document.getElementById("add-exercise-button");
const athleteList = document.getElementById("athlete-list");
let tbodyExercise = document.querySelector(".create-exercise-rows");
let tbodyCount = tbodyExercise.childElementCount;
const exerciseDropDown = document.getElementById("dropdown-container");

let selectedAthlete = null;
let selectedBlock = null;

// TABLE BUTTONS
const addSetsBtn = document.getElementById("addSets-btn");
const addSetBtn = document.getElementById("addSet-btn");
const delSet = document.getElementById("delSet-btn");
const delAllSetsBtn = document.getElementById("delSets-btn");
const exerciseTable = document.querySelector("#create-exercise");
const exerciseTableContainer = document.getElementById("table-container");
let assignExercisebtn = document.getElementById("assign-btn");
const formExercise = document.getElementById("create-exercise-form");
const addSetButtons = document.querySelectorAll(".add-Set--btns");
let dataTableExercise;

let delRowButton;
let modRowButton;

const dropdownData = [
  { id: 1, text: "Option 1" },
  { id: 2, text: "Option 2" },
  { id: 3, text: "Option 3" },
];

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

const definedExercise = [
  {
    Exercise: "Running",
    Category: "Cardio",
    Type: "Endurance",
    Note: "Slow pace for beginners",
  },
  {
    Exercise: "Bench Press",
    Category: "Strength Training",
    Type: "Weightlifting",
    Note: "3 sets of 10 reps",
  },
  {
    Exercise: "Swimming",
    Category: "Cardio",
    Type: "Endurance",
    Note: "Freestyle and butterfly",
  },
];

// DATA TABLE INITIALIZATION
$(document).ready(function () {
  dataTableExercise = $("#create-exercise").DataTable({
    pageLength: 5,
    lengthMenu: [0, 5, 10, 20, 50, 100, 200, 500],
  });

  dataTableExercise.on("mouseenter", "td", function () {
    let colIdx = dataTableExercise.cell(this).index().column;

    dataTableExercise
      .cells()
      .nodes()
      .each((el) => el.classList.remove("highlight"));

    dataTableExercise
      .column(colIdx)
      .nodes()
      .each((el) => el.classList.add("highlight"));
  });
});

// Function
function displayAthletes() {
  // Get details from database
  // Dynamically make
}

// FIXME: After 1st time, only Add set henceforth

// Function to display blocks for the selected athlete
function displayBlocks(athlete) {
  selectedBlock = blockTabs.innerHTML = "";
  exerciseTabs.innerHTML = "";
  exerciseDetails.innerHTML = "Select a Block to view details.";
  exerciseDropDown.innerHTML = "";
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
  exerciseDropDown.innerHTML = "";
  exerciseDetails.innerHTML = "Select an exercise to view details.";
  block.exercises.forEach((exercise, index) => {
    const exerciseButton = document.createElement("button");
    exerciseButton.innerText = exercise;
    exerciseButton.addEventListener("click", () =>
      displayExerciseDetails(exercise)
    );
    exerciseTabs.appendChild(exerciseButton); // exerciseButton =  normal-exercise
  });
  console.log(addExerciseButton);
  // Show "Add an Exercise" button
  addExerciseButton.classList.remove(["add-exercise-btn-hide"]);
  exerciseDropDown.classList.remove(["exercise-category-indicator"]);
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
  exerciseDropDown.classList.remove();
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

// FUNCTION ADDS EXERCISE : Opens a display for SETS , LOADS , REPS,

// TODO: Add an Exercise Name button
// TODO: Add an Exercise Category button
// TODO: Add an Exercise Type
let exerciseVisited = 0;
function addExercise(athlete, block) {
  if (!exerciseVisited) {
    // if (exerciseDropDown.classList.contains("exercise-category-indicator")) {
    //   console.log("Already displayed ");
    //   return;
    // } else {
    // exerciseViewed = 1;
    console.log(`Inside exercise add`);
    //exerciseDropDown.classList.add("exercise-category-indicator"); // When switching
    // Selected block
    console.log(exerciseDetails);
    console.log(athlete);
    console.log(block);
    // Extracting block number for reference into object
    const block_index = getBlockNumber(block);
    console.log(`block_index : ${block_index}`);
    console.log(athlete.blocks);
    // [block_index].exercises.length + 1;
    // console.log(athlete.blocks[1].exercises.length);
    console.log(athlete.blocks[block_index - 1]);
    // newExerciseId = newExerciseId + 1;
    // console.log(`NewExerciseID: ${newExerciseId}`);

    loadTable();
    // athlete.blocks[block_index - 1].exercises.push(object);

    // Open the Exercise DataTable
    // athlete.blocks[block_index - 1].exercises.push(
    //   "Exercise Name : Exercise name should appear here"
    // );
    // displayExercises(athlete, block); //
  }
}

// View assigned exercise
function viewAssignedExercise(athlete, block, e) {
  // Get the exercise button clicked
  // Reset the exercise details
  const clickedExerciseButton = e.target;
  console.log(`Exercise Button `, e.target);
  const exerciseDetails = document.getElementById("exercise-details");
  // if (exerciseDetails.childElementCount > 1) {
  //   console.log(`Exercise Details available`)
  //   exerciseTableContainer.classList.remove("create-exercise-table-hide");
  // } else {
  //   console.log(`No Exercise Details available`)
  //   // Create the exercise
  //   addExercise(athlete, block);
  //   console.log("Display the new Exercise create page");
  // }
  addExercise(athlete, block);

  // const preExistingdetails = document.getElementById("exercise-details");
  // preExistingdetails.innerHTML = "";
  // addExercise(athlete, block);

  // Add an exercise functionality replicated here.

  // If the exercise Details has children, then view

  // If Exercise details is empty , display "No exercises assigned"
  // Edge case : User added exercises and and deleted all
  // exerciseDropDown.classList.add("exercise-category-indicator"); // When switching
  // Selected block
  // console.log(exerciseDetails);
  // console.log(athlete);
  // console.log(block);
  // // Extracting block number for reference into object
  // const block_index = getBlockNumber(block);
  // console.log(`block_index : ${block_index}`);
  // console.log(athlete.blocks);
  // console.log(athlete.blocks[1].exercises.length);
  // // [block_index].exercises.length + 1;
  // console.log(athlete.blocks[1].exercises.length);
  // console.log(athlete.blocks[block_index - 1]);
  // // newExerciseId = newExerciseId + 1;
  // // console.log(`NewExerciseID: ${newExerciseId}`);

  // athlete.blocks[block_index - 1].exercises.push(
  //   "Exercise Name : This is a test"
  // );
  // loadTable();
  // athlete.blocks[block_index - 1].exercises.push(object);
  // displayExercises(athlete, block); //
}

// EXERCISE DROP DOWN CREATION
function createDropdown(id, labelText, data) {
  const label = $(`<label>${labelText}:</label>`);
  const select = $("<select></select>");

  $("#dropdown-container").append(label);
  $("#dropdown-container").append(select);

  select.select2({
    data: data,
    placeholder: `Select a ${labelText.toLowerCase()}`,
    allowClear: true,
  });
}

// Coversion of Data to respective options
let exTypeArray;
let exNameArray;
let exCatArray;
function loadTable() {
  $(document).ready(function () {
    // REPLACE WITH ACTUAL DATA
    const exCat = [];
    const exType = [];
    const exName = [];

    definedExercise.forEach((item) => {
      exType.push(item["Type"]);
      exName.push(item["Exercise"]);
      exCat.push(item["Category"]);
    });

    exTypeArray = exType.map((text, index) => ({
      id: index + 1,
      text: text,
    }));

    exNameArray = exName.map((text, index) => ({
      id: index + 1,
      text: text,
    }));
    exCatArray = exCat.map((text, index) => ({
      id: index + 1,
      text: text,
    }));
  });

  console.log(`ExTypeArray : `, exTypeArray);
  // FETCH THE EXERCISE NAMES FROM THE DATABASE/JSON

  // If table already exists display it

  // Fetch from DB everytime

  console.log(`INSDIDE ADD SET BUTTONS ${addSetButtons}`);
  console.log(addSetButtons);
  addSetButtons.forEach((item) => {
    console.log(item);
    item.classList.remove(["add-Set--btns"]);
  });
  // const console.log(document.getElementById("table-container")); // IS NULL
  exerciseDetails.appendChild(exerciseTableContainer);
  exerciseTableContainer.classList.remove("create-exercise-table-hide"); // Making visible the table
  console.log(document.getElementById("dropdown-container"));
  // If the dropDown isn't created, then create.
  if (document.getElementById("dropdown-container").childElementCount < 1) {
    // Function to create a searchable dropdown
    createDropdown("exerciseName", "Exercise Name", exNameArray);
    createDropdown("exerciseCategory", "Exercise Category", exCatArray);
    createDropdown("exerciseType", "Exercise Type", exTypeArray);
  }
  //   $(document).ready(function () {
  //     dataTableExercise = $("#create-exercise").DataTable();
  //   });

  addSetButtons.forEach((item) => {
    exerciseTableContainer.append(item);
  });

  // Adding an Assign button
  assignExercisebtn.style.display = "block";
}

// DataTables : ADD SINGLE ROWS
let addSingleSetInitialized = 0;
function addSingleSet() {
  // Re-initializing , due to multiple paging issues
  // if (dataTableExercise && !addSingleSetInitialized) {
  //   console.log("Destroying the Tables");
  //   dataTableExercise.destroy();

  //   dataTableExercise = $("#create-exercise").DataTable({
  //     // Your DataTable initialization options here
  //     pageLength: 5,
  //     lengthMenu: [0, 5, 10, 20, 50, 100, 200, 500],
  //   });
  // }

  // Create a new DataTable
  addSingleSetInitialized = 1;
  var setNumber_ = dataTableExercise.rows().count() + 1;
  console.log("Set number: ", setNumber_);

  tbodyExercise = document.querySelector(".create-exercise-rows");
  tbodyCount = tbodyExercise.childElementCount;
  if (tbodyExercise.childElementCount >= 1) {
    console.log(`Tbody count : ${tbodyExercise.childElementCount}`);
    const initialSetsContainer = document.getElementById("initial-sets");
    initialSetsContainer.style.display = "none";
  }
  // tbodyExercise = document.querySelector(".create-exercise-rows");
  // tbodyCount = tbodyExercise.childElementCount;
  //   dataTableExercise = $("#create-exercise");

  const newRowData = [
    setNumber_,
    `<input type="number" name="loads-${setNumber_}">`,
    `<input type="number" name="reps-${setNumber_}">`,
    `<button class="modify-row-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/></svg></button>`,
    `<button class="delete-row-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg></button>`,
  ];
  console.log(newRowData);
  dataTableExercise.row.add(newRowData).draw();

  // If the number of rows in DataTable exceeds the page length, adjust the pagination
  //   row.appendChild(setCell);
  //   row.appendChild(loadsCell);
  //   row.appendChild(repsCell);
  //   row.appendChild(editCell);
  //   row.appendChild(deleteCell);

  //   tbodyExercise.appendChild(row);
  // Append the new table to the container
  //   exerciseTableContainer.appendChild(dataTableExercise);
}

// DataTables : ADD MUTIPLE ROWS # NOT USING THIS
/*
function createExerciseTable() {
  if ($.fn.DataTable.isDataTable("#create-exercise")) {
    // The table with ID 'myTable' is a DataTable
    console.log("This table is a DataTable.");
  } else {
    // The table is not a DataTable
    console.log("This table is not a DataTable.");
  }

  console.log("Im inside createExercise table");
  const setNumber = parseInt(document.getElementById("set-number").value, 10);

  console.log(document.querySelector(".create-exercise-rows"));

  tbodyExercise = document.querySelector(".create-exercise-rows");
  console.log(tbodyExercise.childNodes);
  tbodyCount = tbodyExercise.childElementCount;
  console.log(`Logging details of the DataTable : `);
  console.log(tbodyCount);
  console.log(document.querySelector("#create-exercise"));
  //   dataTableExercise = $("#create-exercise").DataTable({ pageLength: 10 });
  console.log(dataTableExercise.childElementCount);
  //   if dataTableExercise.childElementCount === 1
  var rowDataArray = [];
  for (let i = 0; i < setNumber; i++) {
    console.log(setNumber);
    var newRowData = [
      `<div>${i + 1}</div>`,
      `<input type="number" name="loads-${i + 1}">`,
      `<input type="number" name="reps-${i + 1}">`,
      `<button class="modify-row-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/></svg></button>`,
      `<button class="modify-row-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg></button>`,
    ];
    // rowDataArray.push(newRowData);
    console.log(rowDataArray);
    dataTableExercise.row.add(newRowData);
    // tbodyExercise.appendChild(newRowData);
  }
  dataTableExercise.draw();

  // // Append the new table to the container
  exerciseTableContainer.appendChild(
    document.querySelector("#create-exercise")
  );
  //console.log(tbodyCount);

  // Append the table to form
  console.log(exerciseTableContainer);
  formExercise.appendChild(document.querySelector("#create-exercise"));

  // Append the form to table container
  exerciseTableContainer.appendChild(formExercise);

  // exerciseTableContainer;
  const assignExercises =
    tbodyCount > 2 ? addAssignExerciseBtn(exerciseTableContainer) : null;
  enterDetails(formExercise);
  assignExercisebtn.style.display = "block";

  if (tbodyExercise.childElementCount >= 1) {
    console.log(`Tbody count : ${tbodyExercise.childElementCount}`);
    const initialSetsContainer = document.getElementById("initial-sets");
    initialSetsContainer.style.display = "none";
  }
}
*/

// FIXME:
function addAssignExerciseBtn(exerciseTableContainer) {
  console.log("Inside assign Exercise Button");
  console.log(exerciseTableContainer);
  enterDetails(formExercise);
}

// Enterting the details
// const enterDetails = function (formElement) {
const formElement = document.querySelector("div");
const inputContainer = formElement.querySelector(".create-exercise-rows");

inputContainer.addEventListener("input", (e) => {
  if ((e.target.readOnly = true)) e.target.readOnly = false;
  else e.target.readOnly = true;
  e.target.style.backgroundColor = "lightblue";
});

// Once the table is created, append the table to form

// addSetsBtn.addEventListener("click", createExerciseTable);

// addSetBtn.addEventListener("click", function () {
//   i = i + 1;
//   createRow(i);
// });
addSetBtn.addEventListener("click", addSingleSet); // REMEMEBER TO CHANGE THIS addSingleSet

// Add event listener for the "Search" button
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", searchAthlete);

// Add event listeners for the "Add a Block" and "Add an Exercise" buttons
addBlockButton.addEventListener("click", () => addBlock(selectedAthlete));
// addExerciseButton.addEventListener("click", () =>
//   addExercise(selectedAthlete, selectedBlock)
// );

let viewed = 0;
exerciseTabs.addEventListener("click", (e) => {
  if (!viewed) {
    viewAssignedExercise(selectedAthlete, selectedBlock, e);
    console.log(`Viewing the exercise`);
  } else {
    // Toggle the state
    // hideAssignedExercise(selectedAthlete, selectedBlock, e);
    console.log(`Hiding the exercise`);
  }
  viewed = !viewed;
});

//  function to view clicked Exercise Tab. If nothing to display -> Add an Exercise
// View Exercise

// function () {
//   deleteButton
// deleteButton.addEventListener('click', () => {
//   container.removeChild(row);
//   updateSetNumbers(container);
// });

document.querySelector(".modify-row-button");

// Function to get nodes in DataTables:

// Iterate through each node and find the element with the class 'modify-row-button'
// dataTableExercise
//   .rows()
//   .nodes()
//   .each(function (rowNode) {
//     const modifyButton = rowNode.querySelector(".modify-row-button");
//     // Now you can work with 'modifyButton' within each rowNode
//     console.log(modifyButton);
//   });
