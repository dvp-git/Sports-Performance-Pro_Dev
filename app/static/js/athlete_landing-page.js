// TODO: Create a Assign Exercise button if the number of rows greater than 1. ❌

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
let myAthleteId = 2; // Should be ideally fetched from the sessionStorage
let currentTeamId;

const blockTabs = document.getElementById("block-tabs");
const exerciseTabs = document.getElementById("exercise-tabs");
const exerciseDetails = document.getElementById("exercise-details");

const athleteList = document.getElementById("athlete-list");
let tbodyExercise = document.querySelector(".create-exercise-rows");
let tbodyCount = tbodyExercise.childElementCount;
const exerciseDropDown = document.getElementById("dropdown-container");

let selectedAthlete = null;
let selectedBlock = null;

const exerciseTableContainer = document.getElementById("table-container");
const formExercise = document.getElementById("create-exercise-form");

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

const load_reps_sets = {
  loads_reps: [
    { loads: 90, reps: 3 },
    { loads: 50, reps: 2 },
  ],
  sets: 2,
};

let athlete = athleteData[1];
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

// DATA TABLE INITIALIZATION FOR THE TEAM display initially
$(document).ready(function () {
  const trainingTable = $("#trainingTable").DataTable({
    columns: [{ data: "name" }],
    dom: "Blfrtip",
    searching: true, // Enable the search bar
    paging: true, //
  });
});

// Get the TEAM NAMES FROM database based on ATHLETE ID
$.ajax({
  url: `getTeamsForAthlete?athlete_id=${myAthleteId}`,
  type: "GET",
  dataType: "json",
  success: function (data) {
    console.log(data); // {teams: Array(teams)}
    const trainingTable = $("#trainingTable").DataTable();
    console.log("Data.teams", data.teams[0]);
    trainingTable.clear().rows.add(data.teams).draw(); // Passing an array to rows.add()

    trainingTable.row
      .add(
        {
          coach_id: 1,
          name: "My individual training",
          sport: "sport",
          team_id: null,
          noSort: true,
        },
        "last"
      )
      .draw(false);
  },
  error: function (error) {
    console.log("Error Fetching the data: " + error);
  },
});

// ANY TEAM CLICKED SHOULD SHOW THE TEAM SESSION DETAILS
$("#trainingTable tbody").on("click", "tr", function () {
  // Get the team ID from the clicked row
  var trainingTable = $("#trainingTable").DataTable();
  // Gives the object details for the row
  var data = trainingTable.row(this).data();
  // Displays the object for the row
  console.log(data);
  // Set the teamID if there is one:
  currentTeamId = data["team_id"];
  console.log("The current team_id is ", currentTeamId);

  // Appends the my-training details for the row - Blocks , Exercises, Exercise details
  $(this).find("td").eq(0).append($("#my-training"));
  displayBlocks({
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
  });

  // For Database retrival

  //   $.ajax({
  //     url: `getAthleteWorkout/`,
  //     type: "GET",
  //     data: { athlete_id: `${myAthleteId}`, team_id: `${currentTeamId}` },
  //     success: function (data) {},
  //     error: function (error) {},
  //   });
});

// display the blocks for the team_id selected:

// Assignment of exercises made in Workout Table

// Add the training_container inside the clicked row

// API to get the blocks from the database

// Use AJAX to fetch training sessions and blocks for the team
//     $.ajax({
//       url: "/api/teams/" + teamID + "/training", // Replace with your API endpoint
//       type: "GET",
//       dataType: "json",
//       success: function (data) {
//         // Populate the trainingInfo section with training sessions and blocks
//         // You can use JavaScript to construct the content and add it to the HTML
//         // For example: $('#trainingInfo').html('<div>Training session data here</div>');

//         // Initialize the DataTable for exercise details
//         var exerciseTable = $("#exerciseTable").DataTable({
//           data: data.exercises, // Populate with exercise data
//           columns: [
//             { data: "exercise_name" },
//             { data: "reps" },
//             { data: "sets" },
//             // Add more columns as needed
//           ],
//         });
//       },
//       error: function (error) {
//         console.log("Error fetching training data: " + error);
//       },
//     });
//   });
// });

// Add a click event handler for the DataTable rows
// $("#teamTable tbody").on("click", "tr", function () {
//   var data = table.row(this).data();
//   // Handle the click event, e.g., navigate to a team's page or perform an action.
//   alert("You clicked on " + data.name);
// });

// DISPLAY BLOCKS:
function displayBlocks(athlete) {
  selectedBlock = blockTabs.innerHTML = "";
  exerciseTabs.innerHTML = "";
  exerciseDetails.innerHTML = "Select a Block to view details.";
  exerciseDropDown.innerHTML = "";
  console.log(exerciseTabs);
  // Efficiency :
  athlete.blocks.forEach((block, index) => {
    console.log(`Running this display block`);
    const blockButton = document.createElement("button");
    blockButton.innerText = `Block ${block.id}`; // FIXME: Change to block name
    blockButton.addEventListener("click", (e) => {
      e.stopPropagation();
      // display of the exerciseView should go back to 0
      //exerciseVisited = 0;
      displayExercises(e, block);
    });
    // Adding BlockButtons to be displayed
    blockTabs.appendChild(blockButton);
  });
  // Show "Add a Block" button
  // NOT Required for display
  //   addBlockButton.classList.remove(["add-block-btn-hide"]);
  //   // console.log(addBlockButton);
  //   blockTabs.appendChild(addBlockButton);
}

// Function to display exercises for the selected block
function displayExercises(e, block) {
  console.log("Block Tab clicked ; displaying exercises", block);
  selectedBlock = e.target;
  console.log(selectedBlock);
  exerciseTabs.innerHTML = "";
  exerciseDropDown.innerHTML = "";
  exerciseDetails.innerHTML = "Select an exercise to view details.";
  block.exercises.forEach((exercise, index) => {
    console.log("Creating the exercise buttons");
    console.log(exerciseTabs);
    const exerciseButton = document.createElement("button");
    exerciseButton.innerText = exercise;
    console.log(`Exercise button`);
    console.log(exerciseButton);
    exerciseTabs.appendChild(exerciseButton);
    // exerciseButton.addEventListener("click", (e) => {
    //   e.stopPropagation();
    //   console.log(e.target);
    //   displayExerciseDetails(e.target);
    // });
  });

  exerciseTabs.addEventListener("click", (e) => {
    e.stopPropagation();
    exerciseDetails.innerHTML = "Select an exercise to view details.";

    console.log(`Clicked button`, e.target);
    if (e.target.classList.contains("visited")) {
      e.target.classList.add("visited");
      // viewed = !viewed;
      // Toggle the state
      // hideAssignedExercise(selectedAthlete, selectedBlock, e);
      console.log(`Hiding the exercise`);
    } else {
      e.target.classList.remove("visited");
      // console.log(`Viewed : ${viewed}`);
      // if (!viewed) {
      //   viewed = !viewed;
      viewAssignedExercise(selectedAthlete, selectedBlock, e);
      console.log(`Viewing the exercise`);
    }
  });

  // View assigned exercise
  function viewAssignedExercise(athlete, block, e) {
    const clickedExerciseButton = e.target;
    console.log(`Exercise Button `, e.target);
    const exerciseDetails = document.getElementById("exercise-details");

    addExercise(athlete, block);
  }

  function addExercise(athlete, block) {
    // exerciseTabs.innerHTML = "";
    const exerciseDetails = document.getElementById("exercise-details");

    exerciseDetails.innerHTML = "Select an exercise to view details.";
    console.log(`Inside Viewing exercise`);
    console.log(exerciseDetails);
    // console.log(athlete); // Pass in the athlete object
    console.log(block);

    const block_index = getBlockNumber(block);
    console.log(`block_index : ${block_index}`);
    // console.log(athlete);

    // console.log(athlete.blocks[block_index - 1]);

    loadTable();
    // athlete.blocks[block_index - 1].exercises.push("New Exercise");
  }

  //   console.log(addExerciseButton);
  // Show "Add an Exercise" button
  //   addExerciseButton.classList.remove(["add-exercise-btn-hide"]);
  //   exerciseDropDown.classList.remove(["exercise-category-indicator"]);
  // console.log(addExerciseButton);
  // console.log(exerciseTabs);
  //   exerciseTabs.appendChild(addExerciseButton);
}

// Function to display exercise details
function displayExerciseDetails(exercise) {
  const clickedExerciseButton = exercise;
  console.log(`Exercise Button `, clickedExerciseButton);
  const exerciseDetails = document.getElementById("exercise-details");
}

// let exTypeArray;
// let exNameArray;
// let exCatArray;
function loadTable() {
  //   exerciseTabs.innerHTML = "";
  exerciseDropDown.innerHTML = "";
  exerciseDetails.innerHTML = "Select an exercise to view details.";
  exerciseDetails.appendChild(exerciseTableContainer);
  exerciseTableContainer.classList.remove("create-exercise-table-hide"); // Making visible the table

  // Inside the load Table I have to add the pre-defined sets, loads and reps for that athlete

  const dataTable = $("#create-exercise").DataTable();
  dataTable.clear();
  const sets = load_reps_sets.sets;
  const loadsReps = load_reps_sets.loads_reps;

  for (let i = 0; i < loadsReps.length; i++) {
    const rowData = [];

    // Set column (1-based index for human-readable numbering)
    rowData.push(i + 1);

    // LOADS and REPS columns
    rowData.push(loadsReps[i].loads);
    rowData.push(loadsReps[i].reps);

    // Input_load column
    const inputCell = '<input type="text" name="load_entry">';
    rowData.push(inputCell);

    // Add the row data to the DataTable
    dataTable.row.add(rowData);
  }

  // Draw the table to display the added rows
  dataTable.draw();
}

function getBlockNumber(block) {
  const number = block.textContent.match(/\d+/g);
  // Check if numbers were found and join them into a string
  const numbersString = number ? number.join("") : "";
  return Number(numbersString);
}

// FUNCTION ADDS EXERCISE : Opens a display for SETS , LOADS , REPS,

// FIXME: exerciseVisited

function addExercise(athlete, block) {
  // if (!exerciseVisited) {
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
  athlete.blocks[block_index - 1].exercises.push("New Exercise");

  // TODO: Push the Exercise Name here
  // athlete.blocks[block_index - 1].exercises.push("Exercise Name");
  // displayExercises(athlete, block); //
  // }
}

// Add an Exercise : Select Exercise Name, Exercise Category, Exercise Type
// Creates a button

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
