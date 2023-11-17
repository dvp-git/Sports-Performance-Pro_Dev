"use strict";
// https://stackoverflow.com/questions/56719276/using-javascript-functions-to-add-dynamic-html-content
// Have global variables for some of the things here

let newBlockName;
let myWorkouts = [];
let SampleWorkoutData = {
  name: null,
  date_added: null,
  coach_id: null,
  blocks: [],
};

let blockClicked;
let exerciseClicked;
let addSingleSetInitialized = 0;
let selectedBlockId;
let selectedExerciseId;
////////////////////////////////////////////  EXERCISE FORM RELATED:
// JavaScript to populate Exercise Type and Exercise Name based on selected Category and Exercise Type

// Function to fetch data from the server
function fetchData(endpoint, params, callback) {
  $.get(endpoint, params, callback);
}

// Function to populate dropdowns with data
function populateDropdown(element, data) {
  element.innerHTML = "";
  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    element.appendChild(option);
  });
}

// Function to update exercise types dropdown
function updateExerciseTypes() {
  const selectedCategoryId = categorySelect.value;

  fetchData(
    "/exercise-types",
    { category_id: selectedCategoryId },
    function (data) {
      populateDropdown(exerciseTypeSelect, data.exercise_types);
      updateExerciseNames(); // Update exercise names after updating exercise types
    }
  );
}

// Function to update exercise names dropdown
function updateExerciseNames() {
  const selectedCategoryId = categorySelect.value;
  const selectedExerciseTypeId = exerciseTypeSelect.value;

  fetchData(
    "/getDefinedExercises",
    { exercise_type_id: selectedExerciseTypeId },
    function (data) {
      populateDropdown(exerciseNameSelect, data.exercises);
    }
  );
}

////////////////////////////////////////////

function formatDateToYYYYMMDD(dateString) {
  //   let month = String(date.getUTCMonth() + 1).padStart(2, "0");
  //   let day = String(date.getUTCDate()).padStart(2, "0");

  let date = new Date(`${dateString}`);
  console.log(date);

  if (isNaN(date.getTime())) {
    // Invalid date, handle accordingly
    return null;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  console.log(`Month : ${month}`);
  console.log(`Day : ${day}`);
  return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", function () {
  var workoutNameInput = document.getElementById("workout-name");
  var addBlockButton = document.getElementById("add-block-button");

  workoutNameInput.addEventListener("input", function () {
    // Enable the "Block" tab button if workout name is not empty
    if (workoutNameInput.value.trim() !== "") {
      addBlockButton.classList.remove("add-block-btn-hide");
    } else {
      addBlockButton.classList.add("add-block-btn-hide");
    }
  });
});

let addBlockBtn = document.getElementById("add-block-button");
let addExerciseBtn;

const blockModal = document.getElementById("block-modal");
const closeBlockModal = document.getElementById("closeBlockModalBtn");

const blockTabs = document.getElementById("block-tabs");
const exerciseTabs = document.getElementById("exercise-tabs");

const exerciseDetails = document.getElementById("exercise-details");
let tbodyExercise = document.querySelector(".create-exercise-rows");
let tbodyCount = tbodyExercise.childElementCount;

const exerciseDropDown = document.getElementById("dropdown-container");
const exerciseTableContainer = document.getElementById("table-container");
const formExercise = document.getElementById("create-exercise-form");
let dataTableExercise;

let categorySelect;
let exerciseTypeSelect;
let exerciseNameSelect;
const addSetBtn = document.getElementById("addSet-btn");

const blockBtnCheck = document.getElementById("btn-block-Ok");

function addSingleSet() {
  // dataTableExercise.rows().invalidate().draw(false);  // RESOLVED INdexing issues of internal state
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
    // const initialSetsContainer = document.getElementById("initial-sets");
    // initialSetsContainer.style.display = "none";
  }
  const newRowData = [
    setNumber_,
    `<input type="number" name="loads-${setNumber_}">`,
    `<input type="number" name="reps-${setNumber_}">`,
    // `<button class="modify-row-button">
    //   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
    //   <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/></svg></button>`,
    `<button id="delete-${setNumber_}" class="delete-row-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
    //   <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
    //   <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg></button>`,
  ];
  console.log(newRowData);

  //TODO: UNCOMMENT IF NOT WORKINGdataTableExercise.row.add(newRowData).draw(false);
  dataTableExercise.row.add(newRowData).order([0, "asc"]).draw(false);

  // dataTableExercise.order([0, "asc"]).draw(false);
  // THIS IS ADDED NOW ///////////////////////////////
  // var addedRowIndex = dataTableExercise.row.add(newRowData).index();
  // console.log("Added Row Index", addedRowIndex);
  // // Get information about the current page
  // var pageInfo = dataTableExercise.page.info();
  // var currentPage = pageInfo.page;
  // var rowsPerPage = pageInfo.length;
  // console.log("page infor", currentPage);
  // // Calculate the new page number
  // var newPage = Math.floor(addedRowIndex / rowsPerPage);
  // console.log("New Page number", newPage);
  // // Use DataTable's page() method to navigate to the new page
  // dataTableExercise.page(newPage).draw(currentPage);

  /////////////////////////////////////////////////

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

// Attach click event for delete button
document
  .querySelector(".create-exercise-rows")
  .addEventListener("click", handleDeleteButtonClick);

// Function to handle delete button click (using event delegation)
function handleDeleteButtonClick(e) {
  var target = e.target;
  if (target.classList.contains("delete-row-button")) {
    var rowIdx = dataTableExercise.row($(target).parents("tr")).index();
    console.log("Deleting row", rowIdx);
    deleteRow(rowIdx);
  }
}

// Function to delete a row
function deleteRow(rowIdx) {
  // TODO: UNCOMMENT if not working dataTableExercise.row(rowIdx).remove().draw(false);
  dataTableExercise.row(rowIdx).remove();
  dataTableExercise.order([0, "asc"]).draw(false);
  dataTableExercise.rows().invalidate().draw(false);
  updateSetNumbers();

  // var rows = dataTableExercise.rows().nodes();
  // for (var i = rowIdx; i < rows.length; i++) {
  //   var deleteButton = rows[i].querySelector(".delete-row-button");
  //   var setNumber = i + 1;
  //   deleteButton.id = "delete-" + setNumber;

  //   // Update name attributes for input fields in the row
  //   var secondColumnInput = rows[i].querySelectorAll(
  //     "td:nth-child(2) input"
  //   )[0];
  //   var thirdColumnInput = rows[i].querySelectorAll("td:nth-child(3) input")[0];

  //   // Modify the name attribute with the updated row index
  //   secondColumnInput.setAttribute("name", "loads-" + setNumber);
  //   thirdColumnInput.setAttribute("name", "reps-" + setNumber);

  //   console.log("I HAVE BEEN UPDATED ONLY REPS", thirdColumnInput);
  //   var secondColumnCell = dataTableExercise.cell({ row: i, column: 1 }).node(); // Adjust column index as needed
  //   var thirdColumnCell = dataTableExercise.cell({ row: i, column: 2 }).node(); // Adjust column index as needed

  //   // Update the name attribute of input fields within the cell nodes
  //   var secondColumnInput = secondColumnCell.querySelector("input");
  //   var thirdColumnInput = thirdColumnCell.querySelector("input");

  //   secondColumnInput.setAttribute("name", "loads-" + (i + 1)); // Update name for reps
  //   $(secondColumnInput).attr("name", "loads-" + (i + 1));
  //   console.log("Second column updated");
  //   console.log(secondColumnInput);

  //   thirdColumnInput.setAttribute("name", "reps-" + (i + 1)); // Update name for loads
  //   $(thirdColumnInput).attr("title", "reps-" + (i + 1));
  //   console.log("Third column updated");
  //   console.log(thirdColumnInput);
  // }

  // TODO: ADDED JUST NOW
  // Manually update the row indexes in the DataTable
  // dataTableExercise.rows().every(function (rowIdx) {
  //   this.data()[0] = rowIdx + 1;
  //   console.log("this.data() -->", this.data());
  // });

  //   // Redraw the DataTable to reflect the changes
  //   // TODO: UNCOMMENT if not working  dataTableExercise.draw(false);
  //   dataTableExercise.order([0, "asc"]).draw("full-hold");
  //
  // dataTableExercise.order([0, "asc"]).draw("full-hold");
  dataTableExercise.rows().invalidate().draw(false); // FIXME: DO NOT REMOVE THIS FROM HERE
}

// Function to update set numbers in column 1 after delete
function updateSetNumbers() {
  dataTableExercise.rows().every(function (rowIdx) {
    this.data()[0] = rowIdx + 1;
    console.log("This data [0] ", this.data()[0]);
  });

  dataTableExercise.rows().every(function (rowIdx) {
    var rowData = this.data();

    // Update the names for the 2nd, 3rd, and 4th column cells in each row
    rowData[1] = '<input type="number" name="loads-' + (rowIdx + 1) + '">';
    rowData[2] = '<input type="number" name="reps-' + (rowIdx + 1) + '">';
    rowData[3] =
      '<button id="delete-' +
      (rowIdx + 1) +
      '" class="delete-row-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"></button>';

    // Update the data for the row in the DataTable
    this.data(rowData);
  });

  // this.data()[1].setAttribute("name", `loads-${rowIdx + 1}`);
  // console.log(this.data()[1]);
  // this.data()[2].setAttribute("name", `reps-${rowIdx + 1}`);
  // console.log(this.data()[2]);
  // this.data()[1];

  // dataTableExercise
  //   .column(0)
  //   .nodes()
  //   .each(function (cell, i) {
  //     console.log("cell before:", cell);
  //     cell.innerHTML = i;
  //     console.log("cell after", cell);
  //   });

  // dataTableExercise
  //   .column(1)
  //   .nodes()
  //   .each(function (cell, i) {
  //     console.log("Value of i", i);
  //     console.log("Load cell before:", cell);
  //     cell.querySelector("input").setAttribute("name", `loads-${i}`);
  //     console.log("Load cell after:".cell);
  //   });

  // dataTableExercise
  //   .column(2)
  //   .nodes()
  //   .each(function (cell, i) {
  //     console.log("Reps Cell before:", cell);
  //     cell.querySelector("input").setAttribute("name", `reps-${i}`);
  //     console.log("Reps Cell after", cell);
  //   });
}

addSetBtn.addEventListener("click", addSingleSet);

const testingBtn = document.getElementById("testing");
// Fetch the entered loads, sets, and reps
/*
$(document).ready(function () {
  // Function to collect and submit form data
  const coachExerciseData = [];
  var table = $("#create-exercise").DataTable();
  $("#testing").on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    const sets = table.columns(0).data()[0].length;
    // var loads = [...table.columns(1).data()[0]];
    // var reps = [...table.columns(2).data()[0]];
    var loads = [];
    var reps = [];

    table.rows().every(function () {
      var data = this.data(); // Get data of the current row
      console.log("The data from table: ", data);
      // Push values from the 2nd and 3rd columns into respective arrays
      loads.push($(data[1])[0]); // 2nd column
      reps.push($(data[2])[0]); // 3rd column
    });

    console.log("Loads,", loads);

    console.log("Reps,", reps);

    const loadsReps = table.$("input");
    let check = false;
    for (let i = 0; i < sets; i++) {
      check = getLoadsReps(loadsReps);
      if (check) {
        coachExerciseData.push(Number(loadsReps[i].value));
      } else {
        console.log("Give the right input");
        console.log("Display a modal here ");
        break; // the loop, invalid entry
      }
    }
  });
});
*/

function getLoadsReps(loadInput) {
  console.log("Inside GetLoads Reps : ", loadInput);
  // const value = loadInput.value;
  // console.log("Value of input", value, typeof value);
  // console.log("Inside Validate Inpout");
  // const errorMessage = document.getElementById("error-message");
  // if (isNaN(value) || value === "") {
  //   errorMessage.innerText = "Load must be a number.";
  //   loadInput.focus();
  // } else if (value < 0) {
  //   errorMessage.innerText = "Load cannot be negative.";
  //   loadInput.focus();
  // } else if (value > maxLoad) {
  //   errorMessage.innerText = "Load cannot exceed the maximum value.";
  //   loadInput.focus();
  // } else if (value === 0) {
  //   errorMessage.innerText = "Load cannot be blank.";
  //   loadInput.focus();
  // } else {
  //   errorMessage.innerText = "";
  //   return true;
  // }
}

// $(document).ready(function () {
//   const trainingTable = $("#trainingTable").DataTable({
//     //columns: [{ data: "athlere_name" }], // Display only team name
//     dom: "Blfrtip",
//     searching: true, // Enable the search bar
//     paging: true,
//     //
//   });
// });

async function fetchWorkoutsByTeam(teamId, selectedDate, coachId) {
  const response = await fetch(
    `/getWorkoutsByTeam?teamId=${teamId}&date=${selectedDate}&coachId=${coachId}`
  );
  const data = await response.json();
  //console.log("These are the workouts : ", data);
  return data;
}

async function fetchWorkouts(
  athlete_id = null,
  team_id = null,
  coach_id = null,
  date = ""
) {
  const response = await fetch(
    `getWorkout2?athleteId=${athlete_id}&teamId=${team_id}&date=${date}&coachId=${coach_id}`
  );
  const data = await response.json();
  // console.log("These are the workouts assigned for athlete by his athleteId and for his team by teamId: ",data);
  return data;
}

function getMyBlockNames(workoutData) {
  const blockNames = [];
  workoutData.forEach((workout) => {
    if (Array.isArray(workout.blocks)) {
      workout.blocks.forEach((block) => {
        blockNames.push({ block_id: block.block_id, block_name: block.name });
      });
    }
  });
  return blockNames;
}

// Display the blocks once it is clicked : Blocks is an array
function displayBlocks2(blocks) {
  selectedBlock = blockTabs.innerHTML = "";
  exerciseTabs.innerHTML = "";
  // exerciseDetails.innerHTML = "Select a Block to view details.";
  exerciseDropDown.innerHTML = "";
  console.log(exerciseTabs);
  blocks.forEach((block, index) => {
    exerciseTabs.innerHTML = "";
    console.log(`Adding Button ${block.block_name}`);
    const blockButton = document.createElement("button");
    blockButton.innerText = `${block.block_name}`;
    blockButton.id = `${block.block_id}`; // Add the id to keep track of block_id
    blockTabs.appendChild(blockButton);
  });
}

// Close the BLOCK modal when the close button is clicked
closeBlockModal.addEventListener("click", function () {
  //   blockNameInput.value = "";
  blockModal.style.display = "none";
});

// Close the BLOCK modal if the user clicks outside of it
window.addEventListener("click", function (event) {
  if (event.target == blockModal) {
    // blockNameInput.value = "";
    blockModal.style.display = "none";
  }
});

addBlockBtn.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    // exerciseTabs.innerHTML = "";
    e.preventDefault();
    e.stopPropagation();
    // Pop-up : Give modal
    blockModal.style.display = "block";
    // blockBtnCheck = 0;
    //Get Block Value from the OK button
  }
});

blockBtnCheck.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  if (e.target.tagName == "BUTTON" && e.target.id == "btn-block-Ok") {
    // exerciseTabs.innerHTML = "";
    newBlockName = document.getElementById("block-name").value;
    var blockName = newBlockName;
    // console.log("Block name is :", blockName);
    // You can do something with the value, like displaying it or sending it to a server
    if (blockName) {
      const newBlock = document.createElement("button");
      //   const blockName = document.getElementById("block-name").value;
      // console.log(blockName);
      // console.log(response);

      newBlock.textContent = `${blockName}`; // Get from the modal Name and replace it here
      newBlock.id = `block-${blockName}`;
      newBlock.class = `block-buttons`; // ADD THE CLASS
      SampleWorkoutData.blocks.push({
        block_id: `${newBlock.id}`,
        name: `${blockName}`,
        exercises: [],
      });
      blockTabs.insertBefore(newBlock, blockTabs.firstChild);
      document.getElementById("block-name").value = "";
      //console.log(e.target);

      // Push the blocks for temporary storage in SampleWorkoutData
    }
    // Close the modal
    blockModal.style.display = "none";
  }
});

let isEventAdded = false;

blockTabs.addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON" && e.target.id !== "btn-block-Ok") {
    e.preventDefault();
    e.stopPropagation();
    $(e.target).siblings("button").css("background-color", "");

    // Add the "highlight" class to the clicked element
    $(e.target).css("background-color", "green");
    // exerciseTabs.innerHTML = "";
    // exerciseTabs.innerHTML = "";
    // console.log(addExerciseBtn);
    exerciseTabs.style.display = "block";

    /* <div class="vertical-tabs" id="exercise-tabs" style="display: block; background-color: green;"> */

    // VERY BAD DESIGN: Consider this as workaround, need to change the method here
    const elementsToRemove = exerciseTabs.querySelectorAll(".exercise-buttons");
    if (elementsToRemove) {
      console.log("Removing the displayed exercise of previous Block");
      // Remove each element from the container
      elementsToRemove.forEach((element) => {
        exerciseTabs.removeChild(element);
      });
    }

    blockClicked = e.target;

    console.log(`Clicked Block button`, blockClicked);
    if (blockClicked && blockClicked.tagName == "BUTTON") {
      console.log("I Clicked", blockClicked);

      displayExercises(e, e.target);
    }
  }
});

// Listen for Events here
exerciseTabs.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  // Two conditions, Either Add exercise is clicked or Existing exercise is clicked
  if (e.target.tagName == "BUTTON" && e.target.id == "add-exercise-button") {
    console.log("Add a new Exercise buttn simulate here");

    // Code to append a new Exercise to exerciseTabs
    const blocks = SampleWorkoutData.blocks;

    // Check block length to see if greater than 1, then display if it is
    if (blocks.length >= 1) {
      let clickedBlockId = blockClicked.id;
      //console.log("Type of clickedBlockId", typeof clickedBlockId);
      console.log(`CLicked Block Id ${clickedBlockId}`);

      // Get all the block Ids
      const blockIds = blocks.map((block) => block.block_id);
      console.log("Block Ids: ", blockIds);

      // Use indexOf to find the index of the clicked Block
      const blockIndex = blockIds.indexOf(clickedBlockId);
      console.log("Clicked Block Index", blockIndex);

      // Check Exercise length of that block
      const exerciseLength = blocks[blockIndex].exercises.length;

      // Get the previous exercises of this block and display
      console.log("Exercise length ", exerciseLength);
      console.log("Exercise Tab", exerciseTabs);

      // If exercise length is greater than 1, display the exercises stored in that block
      if (exerciseLength > 1 && !blockIds.includes(`${clickedBlockId}`))
        blocks[blockIndex].exercises.forEach((exercise) => {
          const exerciseButton = document.createElement("button");
          exerciseButton.textContent = exercise.name;
          exerciseButton.id = exercise.exercise_id;

          // Append the new button to the DOM
          exerciseTabs.insertBefore(exerciseButton, exerciseTabs.firstChild);
          //   exerciseTabs.appendChild(exerciseButton);
        });

      // CREATE A NEW EXERCISE ELEMENT
      const newExercise = document.createElement("button");
      //   const blockName = document.getElementById("block-name").value;
      // console.log(blockName);
      // console.log(response);
      newExercise.textContent = `${blockClicked.textContent}-ex-${
        exerciseLength + 1
      }`; // Get from the modal Name and replace it here
      newExercise.id = `${blockClicked.textContent}-exercise-${
        exerciseLength + 1
      }`;
      newExercise.classList.add(["exercise-buttons"]);

      console.log(`New Exercise ID:${newExercise.id}`);
      console.log(`New Exercise Added :${newExercise}`);
      console.log(`New Exercise class:${newExercise.className}`);
      //  SampleWorkoutData = {
      //     name: null,
      //     date_added: null,
      //     coach_id: null,
      //     blocks: [],
      //   };
      SampleWorkoutData.blocks[blockIndex].exercises.push({
        exercise_id: newExercise.id,
        name: newExercise.textContent,
        exercise_class: newExercise.className,
        sets: null,
        loads_reps: { coach: [] },
      });

      exerciseTabs.insertBefore(newExercise, exerciseTabs.firstChild);
    }
  } else {
    // Exercise button selected
    // Create the details of the exercise
    console.log("Highlighting exisitng exercise");
    $(e.target).siblings("button").css("background-color", "");

    // Add the "highlight" class to the clicked element
    $(e.target).css("background-color", "green");

    const currentExerciseId = Number(e.target.id); // Setting id for retrival
    // TODO: REVERT IF NOT WORKING :exerciseDetails.innerHTML = "Select an Exercise to view details.";
    // successMessage.innerText = "";
    // errorMessage.innerText = "";
    console.log(`Clicked Exercise button`, e.target);
    if (e.target && e.target.tagName == "BUTTON") {
      console.log(`Viewing the exercise`);
      createExercise(e);
    }
  }
});

function displayExercises(blockEvent, selectedBlock) {
  // Everytime I click a block, a fetch request is sent to back-end to get the exercise of that block

  //   fetch(`getExercisesByBlock?blockId=${block.id}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       const exercises = data.exercises;
  //       console.log(
  //         `Block Tab ${block.id} clicked : displaying Exercises`,
  //         block
  //       );
  addExerciseBtn = document.getElementById("add-exercise-button");
  addExerciseBtn.classList.remove("add-exercise-btn-hide");

  console.log("Clicked Block", selectedBlock);
  //   exerciseTabs.innerHTML = "";

  // Getting the exercise from SampleData:
  const blocks = SampleWorkoutData.blocks;

  // Check block length to see if greater than 1, then display if it is
  if (blocks.length >= 1) {
    selectedBlockId = selectedBlock.id;
    //console.log("Type of clickedBlockId", typeof clickedBlockId); // FIXME: Always selecting first index
    console.log(`Selected Block Id ${selectedBlockId}`);

    // Get all the block Ids
    const blockIds = blocks.map((block) => block.block_id);
    console.log(" All Block Ids: ", blockIds);

    // Use indexOf to find the index of the clicked Block
    const selectedBlockIndex = blockIds.indexOf(selectedBlockId);
    console.log("Selected Block Index", selectedBlockIndex);

    // Check Exercise length of that block
    const exerciseLength = blocks[selectedBlockIndex].exercises.length;

    // Get the previous exercises of this block and display
    console.log("Exercise length of that block", exerciseLength);

    // If exercise length is greater than 1, display the exercises stored in that block
    if (exerciseLength >= 1 && !blockIds.includes(`${selectedBlockIndex}`)) {
      console.log("Came inside here");
      blocks[selectedBlockIndex].exercises.forEach((exercise) => {
        const exerciseButton = document.createElement("button");
        exerciseButton.innerText = `${exercise.name}`;
        exerciseButton.id = `${exercise.exercise_id}`;
        exerciseButton.classList.add(`${exercise.exercise_class}`);

        // Append the new button to the DOM
        // exerciseTabs.appendChild(exerciseButton);
        exerciseTabs.insertBefore(exerciseButton, exerciseTabs.firstChild);
      });
    }
    // exerciseDropDown.innerHTML = "";
    // exerciseDetails.innerHTML = "Select an exercise to view details.";
    //   exercises.forEach((exercise, index) => {
    //     exerciseDetails.innerHTML = "Select a Exercise to view details.";
    //     console.log("Creating the exercise buttons");
    //     // console.log(exerciseTabs);
    //     const exerciseButton = document.createElement("button");

    //     exerciseButton.innerText = `${exercise.name}`;
    //     exerciseButton.id = `${exercise.exercise_id}`; // Add the id to keep track of block_id
    //     console.log(`Exercise button`);
    //     console.log(exerciseButton);
    //     exerciseTabs.appendChild(exerciseButton);
    console.log("No exercises yet? Add one!");
  }
}

/* #TODO: CHECK LATER

exerciseTabs.addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON") {
    $(e.target).siblings("button").css("background-color", "");

    // Add the "highlight" class to the clicked element
    $(e.target).css("background-color", "green");
    // Open the dialog box

    // Select Exercise Category , Exercise Type , then get Exercise Name

    // Assign the exercise name to the Exercise Button textContent . Set an ID as well

    //

    e.preventDefault();
    e.stopPropagation();
    currentExerciseId = Number(e.target.id); // Setting id for retrival
    exerciseDetails.innerHTML = "Select an Exercise to view details.";
    // successMessage.innerText = "";
    // errorMessage.innerText = "";
    console.log(`Clicked Exercise button`, e.target);
    if (e.target && e.target.tagName == "BUTTON") {
      console.log("I Clicked", e.target);
      viewAssignedExercise(e);
      console.log(`Viewing the exercise`);
    }
  }
});
*/

function createExercise(e) {
  // Everytime I click an exercise block, a fetch request is sent to back-end to get the latest exercise details of that exercise
  const clickedExerciseButton = e.target;
  console.log(`Exercise Button `, e.target, e.target.id);
  console.log(`Selected Block`, blockClicked);
  document
    .getElementById("table-container")
    .classList.remove("create-exercise-table-hide");
  // Create the exercise.

  // Get the exercise // Needs to have date_added and loads_reps, sets // xerciseDetails to be set
  //    Sample  :{
  //     "exercise_id": "BBSDF-exercise-2",
  //     "name": "BBSDF-ex-2",
  //     "exercise_class": "exercise-buttons"
  // }
  // Event listener for category dropdown change
  // Initial population of categories

  categorySelect = document.getElementById("category");
  exerciseTypeSelect = document.getElementById("exerciseType");
  exerciseNameSelect = document.getElementById("exerciseName");

  // Get the selected option
  fetchData("/categories", {}, function (data) {
    populateDropdown(categorySelect, data.categories);
    updateExerciseTypes(); // Update exercise types after populating categories
  });

  categorySelect.addEventListener("change", updateExerciseTypes);

  // Event listener for exercise type dropdown change

  exerciseTypeSelect.addEventListener("change", updateExerciseNames);
  const exerciseData = {};

  const selectedOption =
    exerciseNameSelect.options[exerciseNameSelect.selectedIndex];

  // Set the dataTable rows and columns
  //   exercises.forEach((exercise, index) => {
  //     console.log("Exercise is : ", exercise);
  //     exerciseDetails.innerHTML = "Select a Exercise to view details.";
  //     exerciseDropDown.innerHTML = "";
  //     exerciseDetails.appendChild(exerciseTableContainer);
  //     exerciseTableContainer.classList.remove("create-exercise-table-hide"); // Making visible the table

  // Inside the load Table I have to add the pre-defined sets, loads and reps for that athlete

  const dataTable = $("#create-exercise").DataTable();
  dataTable.clear();

  // Check if an exercise exists already in the SampleWorkoutObject
  if (checkExerciseExists(e.target.id, selectedBlockId)) {
    // If yes, store the exercise details in a variable
    console.log("Printing the exercise details of", e.target.id);
    console.log("Put the existing data here");

    // Existing data of the exercise  ( loads reps ) from SampleWorkoutData goes here
  } else {
    // Create the dataTable initialization and store it in SampleWorkoutData
    const exercisesData = SampleWorkoutData.blocks.find(
      (block) => block.block_id === selectedBlockId
    ).exercises;

    const clickedExercise = exercisesData.find(
      (exercise) => exercise.exercise_id === e.target.id
    );

    console.log("All exercises in this block", exerciseData);
    console.log("Loads and reps of clicked exercise:", clickedExercise);

    // Create the exercise here
    // Initialize the DataTable

    //
  }
}

// Display it using Datatables

//

//   const sets = exerciseData.sets;
//   const loadsReps = exerciseData.loads_reps;
//   console.log(loadsReps["coach"]);

// If the AthleteInputExercise already exists display that Table

// get the clicked Athletes-input;
//console.log(`Clicked athlete Id: ${athleteId}`); // FIXME: This should be the clicked ahleteId // GET FROM the initially clicked athleteId
//   fetch(
//     `/showAthleteExerciseInputLoads?exerciseId=${exercise.exercise_id}&athleteId=${athleteId}`
//   )
//     .then((response) => {
//       // Return the response.json() promise here
//       return response.json();
//     })

//     .then((data) => {
//       console.log("Data:", data);
//       if (data.info) {
//         exerciseAvailable = 0;
//         console.log(data["info"]); // Data does not exist : input_load
//       } else {
//         exerciseAvailable = 1;
//         console.log("Data alreay exists"); // Fetch the input_load
//       }

// for (let i = 0; i < 3; i++) {
//   const rowData = [];

//   // Set column (1-based index for human-readable numbering)
//   rowData.push(i + 1);

//   // LOADS and REPS columns
//   rowData.push(loadsReps["coach"][i].load);
//   rowData.push(loadsReps["coach"][i].reps);

//   // Athlete loads not available
//   if (exerciseAvailable === 0) {
//     var inputCell = `<p type="number" data-input=${i + 1} name="load_input-${
//       i + 1
//     }">`;
//   } else {
//     // Fetc the load input from database
//     // var inputCell = document.createElement("td");
//     // inputCell.textContent = data["input_load"][i]["load"];
//     // inputCell.dataset.loadId = data["load_id"];
//     var inputCell = data["input_load"][i]["load"];
//     console.log(inputCell);
//   }
//   rowData.push(inputCell);

//   // Add the row data to the DataTable
//   dataTable.row.add(rowData);
// }
// $("#create-exercise tbody td:first-child input").addClass("my-input");
// // Draw the table to display the added rows
// dataTable.draw();
// }

//   fetch(`getExerciseDetails?exerciseId=${clickedExerciseButton.id}`)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(" I am here : the exercise details ", data);
//       const exercises = data;
//       // exerciseTabs.innerHTML = "Select an exercise to view details.";
//       // exerciseDropDown.innerHTML = "";
//       // exerciseDetails.innerHTML = "Select an exercise to view details.";

//       const exerciseDetails = document.getElementById("exercise-details");
//       exerciseDetails.innerHTML = "Click an exercise to create/view details.";
//       console.log(`Inside Creating exercise`);

//       exercises.forEach((exercise, index) => {
//         console.log("Exercise is : ", exercise);
//         exerciseDetails.innerHTML = "Select a Exercise to view details.";
//         exerciseDropDown.innerHTML = "";
//         exerciseDetails.appendChild(exerciseTableContainer);
//         exerciseTableContainer.classList.remove("create-exercise-table-hide"); // Making visible the table

//         // Inside the load Table I have to add the pre-defined sets, loads and reps for that athlete

//         const dataTable = $("#create-exercise").DataTable();
//         dataTable.clear();
//         const sets = exercise.sets;
//         const loadsReps = exercise.loads_reps;
//         console.log(loadsReps["coach"]);

//         // If the AthleteInputExercise already exists display that Table

//         // get the clicked Athletes-input;
//         console.log(`Clicked athlete Id: ${athleteId}`); // FIXME: This should be the clicked ahleteId // GET FROM the initially clicked athleteId
//         fetch(
//           `/showAthleteExerciseInputLoads?exerciseId=${exercise.exercise_id}&athleteId=${athleteId}`
//         )
//           .then((response) => {
//             // Return the response.json() promise here
//             return response.json();
//           })

//           .then((data) => {
//             console.log("Data:", data);
//             if (data.info) {
//               exerciseAvailable = 0;
//               console.log(data["info"]); // Data does not exist : input_load
//             } else {
//               exerciseAvailable = 1;
//               console.log("Data alreay exists"); // Fetch the input_load
//             }
//             for (let i = 0; i < loadsReps["coach"].length; i++) {
//               const rowData = [];

//               // Set column (1-based index for human-readable numbering)
//               rowData.push(i + 1);

//               // LOADS and REPS columns
//               rowData.push(loadsReps["coach"][i].load);
//               rowData.push(loadsReps["coach"][i].reps);

//               // Athlete loads not available
//               if (exerciseAvailable === 0) {
//                 var inputCell = `<p type="number" data-input=${
//                   i + 1
//                 } name="load_input-${i + 1}">`;
//               } else {
//                 // Fetc the load input from database
//                 // var inputCell = document.createElement("td");
//                 // inputCell.textContent = data["input_load"][i]["load"];
//                 // inputCell.dataset.loadId = data["load_id"];
//                 var inputCell = data["input_load"][i]["load"];
//                 console.log(inputCell);
//               }
//               rowData.push(inputCell);

//               // Add the row data to the DataTable
//               dataTable.row.add(rowData);
//             }
//             $("#create-exercise tbody td:first-child input").addClass(
//               "my-input"
//             );
//             // Draw the table to display the added rows
//             dataTable.draw();
//           });
//       });
//     });
// }

function findBlockIndex(blocks, blockId) {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].block_id === blockId) {
      return i;
    }
  }
  return -1; // Return -1 if not found
}

function findExerciseIndex(exercises, exerciseId) {
  for (let i = 0; i < exercises.length; i++) {
    if (exercises[i].exercise_id === exerciseId) {
      return i;
    }
  }
  return -1; // Return -1 if not found
}

function checkExerciseExists(exercise_id, block_id) {
  console.log("Inside Check Exiercise");
  console.log("Block ID here ", block_id);
  console.log("Exercise ID here ,", exercise_id);
  const blockIndex = findBlockIndex(SampleWorkoutData.blocks, block_id);
  console.log(blockIndex);
  const exerciseIndex = findExerciseIndex(
    SampleWorkoutData.blocks[blockIndex].exercises,
    exercise_id
  );

  if (
    SampleWorkoutData.blocks[blockIndex].exercises[exerciseIndex].loads_reps
      .coach.length >= 1
  ) {
    console.log("Exercise Exists");
    return true;
  } else {
    console.log("No loads reps found");
    return false;
  }
}

async function initialData() {
  try {
    // var teamId = 89;
    //
    console.log("This is the teamId", teamId);
    console.log("This is my coachId :", coachId);
    console.log("This is my TeamName :", teamName);

    console.log("Im inside Initial Data");

    // athleteId = await fetchAthleteID(userEmail); // Fetch athlete UserEmail
    // athleteTeams = await fetchAthleteTeams(athleteId); // Fetch Athlete Teams
    const teamsAthletes = await fetchAthletesForTeam(coachId, teamId); // Fetch Teams for the coach
    let myAthletes = teamsAthletes;
    // Remove the team by teamId
    myAthleteIds = teamsAthletes.athletes.map((athlete) => athlete.athlete_id);
    console.log("My Team athletes Id's : ", myAthleteIds);

    // myAthletes = teamsAthletes.athletes.map((team) => team.name);
    console.log("My Team athletes are : ", myAthletes);

    myWorkouts = await fetchWorkoutsByTeam(teamId, currentDate, coachId);
    console.log("These are my teams Workouts: initial Data ", myWorkouts);

    const dataCreation = (function () {
      // You can now work with athleteID and athleteTeams here
      console.log("Team ID:", teamId);
      console.log("Athletes :", myAthletes); // [ {} {}]
      console.log("Teams Workouts:", myWorkouts);
      // teams = athleteTeams.map((team) => team.name);
      // const myAthletes = myAthletes.map((athlete) => [athlete]);
      // INITIALIZING THE ATHLETES OF THE TRAINING TABLE
      const trainingTable = $("#trainingTable").DataTable();

      trainingTable.clear().rows;
      myAthletes.athletes.forEach((athlete) => {
        // trainingTable.row.add([athlete.name]).draw()
        trainingTable.row
          .add([athlete.name])
          .node().id = `${athlete.athlete_id}`;
        trainingTable.draw();
      });
    })();
    return myAthletes, myAthleteIds;
  } catch (error) {
    console.log("Could not fetch the details " + error);
  }
}

// Main Function which has all details:
async function main() {
  try {
    const data = await initialData(); // Gets all the initial Data
  } catch (error) {
    console.error("An error occured", error);
  }
}

main();

$(document).ready(function () {
  dataTableExercise = $("#create-exercise").DataTable({
    pageLength: 5,
    lengthMenu: [0, 5, 10, 20, 50, 100, 200, 500],
    stateSave: true,
  });
});
var params = new URLSearchParams(window.location.search);
var teamId = params.get("teamId");
var coachId = params.get("coachId");
var teamName = params.get("teamName");
var currentDate = params.get("date");

const inputWorkout = document.getElementById("workout-name");
const datePicker = document.getElementById("datepicker");

// Set the default value to the date picked from previous page
console.log(`Date fetched : ${currentDate}`);
datePicker.value = formatDateToYYYYMMDD(currentDate);
console.log(`Date formatted : ${currentDate}`);

// Set the Team name :
document.querySelector("#team-name").textContent = teamName;

// Additional feature : If required

console.log("This is the teamId", teamId);
console.log("This is my coachId :", coachId);
console.log("This is my TeamName :", teamName);

// Once the workout is filled

// Initialize DataTable
$("#athleteTable tbody").on("click", "button.delete-button", function (e) {
  e.preventDefault(); // Prevent the default behavior of the anchor element

  // Get the athlete's name from the table row
  var data = table.row($(this).parents("tr")).data();
  var athleteName = data.name;

  console.log(teamId);
  // Confirm the deletion action
  var confirmDelete = window.confirm(
    "Are you sure you want to delete " + athleteName + " from the team?"
  );

  if (confirmDelete) {
    // Get the athlete's ID and team's ID from the table row
    var athleteId = data.athlete_id;
    // var teamId = teamId; // Get the team ID from your page, possibly from a query parameter

    console.log(athleteId);
    console.log(teamId);

    // Send a DELETE request to your server to remove the athlete from the team
    $.ajax({
      type: "DELETE",
      url: "/removeAthleteFromTeam",
      data: {
        athleteId: athleteId,
        teamId: teamId,
      },
      success: function (response) {
        // Show a success message
        alert(
          "Athlete " +
            athleteName +
            " has been successfully deleted from the team."
        );

        // Remove the athlete from the table
        table.row($(this).parents("tr")).remove().draw();
        location.reload();
      },
      error: function (xhr, status, error) {
        console.error("API request failed with status: " + status);
        console.error("Error details: " + error);
      },
    });
  }
});

// Handle the "Save Changes" button
$("#saveChangesButton").click(function (e) {
  e.preventDefault();

  // Get the new team name from the input field
  var newTeamName = $("#name").val();

  // Send a PUT request to update the team name
  $.ajax({
    type: "PUT",
    url: "/updateTeamName?teamId=" + teamId,
    contentType: "application/json",
    data: JSON.stringify({ newTeamName: newTeamName }),
    success: function (response) {
      // Show a success message (you can customize this part)
      alert(response.message);

      // Redirect to the previous page (coachLanding) or any other desired page
      window.location.href = "/coachLanding";
    },
    error: function (xhr, status, error) {
      console.error("API request failed with status: " + status);
      console.error("Error details: " + error);
    },
  });
});

// Handle the "Return" button
$("#returnButton").click(function (e) {
  // Prevent the default behavior of the anchor element
  e.preventDefault();

  // Display a confirmation dialog
  var confirmReturn = window.confirm(
    "Are you sure you want to return? Any unsaved changes will be lost."
  );

  // Check if the user confirmed
  if (confirmReturn) {
    // Redirect to the previous page (coachLanding)
    window.location.href = "/coachLanding";
  } else {
    // If the user cancels, close the confirmation dialog
    // This ensures that the dialog is closed even on the first click
    return;
  }
});

$("#deleteTeamButton").click(function (e) {
  e.preventDefault();

  var confirmDelete = window.confirm(
    "Are you sure you want to delete this team and all its members?"
  );

  if (confirmDelete) {
    // Send a DELETE request to your server to delete the team
    $.ajax({
      type: "DELETE",
      url: "/deleteTeam",
      data: {
        teamId: teamId,
      },
      success: function (response) {
        alert("Team and its memberships deleted successfully.");
        // Redirect to the previous page (coachLanding) or any other desired page
        window.location.href = "/coachLanding";
      },
      error: function (xhr, status, error) {
        console.error("API request failed with status: " + status);
        console.error("Error details: " + error);
      },
    });
  }
});
// });

// RESPONSIVE ANY TEAM CLICKED SHOULD SHOW THE TEAM SESSION DETAILS
$("#trainingTable tbody").on("click", "tr", function (event) {
  // Get the team ID from the clicked row
  const clickedRow = event.currentTarget;

  // Get the team ID from the clicked row
  athleteId = $(clickedRow).attr("id"); // Assuming you've set the ID of the row
  console.log("Athlete ID:", athleteId);

  console.log("My teams workouts, clicked an athlete", myWorkouts);
  var trainingTable = $("#trainingTable").DataTable();
  // Gives the object details for the row
  // var data = trainingTable.row(this).data(); // Object { coach_id, , ....}
  // Displays the object for the row
  var data = myWorkouts;
  // console.log(data);
  $("#trainingTable tbody tr")
    .removeClass("highlighted-row")
    .find("td")
    .css("background-color", "");

  var row = $(this).closest("tr");
  // Add the highlight class to the clicked row
  row.addClass("highlighted-row");

  // Apply the highlight using inline CSS
  row.find("td").css("background-color", "green"); // Customize the color as needed
  // Set the teamID if there is one:

  console.log("View the data of clicked Item : ", data);

  // Everytime I clikc on a Team, a fetch request is sent to get workout and display the blocks of the team

  currentWorkout = fetch(
    `/getWorkoutsByTeam?teamId=${currentTeamId}&date=${currentDate}&coachId=${coachId}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("This is my data fetched inside clicking an athlete:", data);
      return data;
    })
    .then((workout_data) => {
      console.log(workout_data);
      currentBlocks = getMyBlockNames(workout_data);
      console.log("Current Blocks:", currentBlocks);
      displayBlocks2(currentBlocks);
    })
    .catch((error) => {
      console.error("There was an error fetching", error);
    });
});

function formatAthleteEntries(inputLoads) {
  let transformedLoads = inputLoads.map((load) => ({ load: load }));
  transformedLoads = JSON.stringify({
    athlete_id: athleteId,
    input_load: transformedLoads,
    exercise_id: currentExerciseId,
    date: currentDate,
  });
  console.log(transformedLoads);
  return transformedLoads;
}
