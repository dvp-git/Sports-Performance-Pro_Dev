"use strict";
// let myAthleteId = 2; // Should be ideally fetched from the sessionStorage
let currentTeamId;
let currentCoachId;
let currentWorkout;
let currentBlocks;
let currentExercises;
let currentDate;
let personalCoaches;
let peronalCoachIds;

const getDate = function () {
  const today = new Date();
  const day = today.getDate(); // 1-31
  const month = today.getMonth() + 1; // 0-11 (January is 0)
  const year = today.getFullYear();

  // Display the current date in a specific format (e.g., YYYY-MM-DD)
  const formattedDate =
    year +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    (day < 10 ? "0" : "") +
    day;
  console.log("Current Date:", formattedDate);
  return formattedDate;
};

// FIXME: Uncomment this : For test purpose set date to 2022-10-30
// currentDate = getDate();
currentDate = "2022-10-30";
console.log(currentDate);
// Get the athlete Username
var athleteUsernameElement = document.getElementById("athlete-username");
var athleteUsername = athleteUsernameElement.getAttribute("data-username");

// console.log(" Athlete Username ", athleteUsername);

// const testingElement = document.getElementById("testValue");
// const testVal = testingElement.getAttribute("data-testing");
// console.log("The test val :", testVal);

const athleteUserElement = document.getElementById("user_id");
const userEmail = athleteUserElement.dataset.userEmail;

// Remove the trailing.com
athleteUserElement.textContent = `Welcome :  ${userEmail.replace(
  /@[^ ]+/g,
  ""
)}, We're rooting for you !`;
console.log(`UserEmail : ${userEmail}`);

// fetch("/getMyCoach?athleteId=").then((response) =>
// response = response.json()).then((data) =>
// {

// })
// }
// Fetch the user_id from the route using an API
let athleteId;
let coachId;
let teams;
let myTrainingData;
let myTeamsTrainingData;
let athleteTeams;
let clickedTeam;
let teamIds = [];
let coachIds = [];
let myWorkouts;
const blockTabs = document.getElementById("block-tabs");
const exerciseTabs = document.getElementById("exercise-tabs");
const exerciseDetails = document.getElementById("exercise-details");

// const athleteList = document.getElementById("athlete-list");
let tbodyExercise = document.querySelector(".create-exercise-rows");
let tbodyCount = tbodyExercise.childElementCount;
const exerciseDropDown = document.getElementById("dropdown-container");

let selectedAthlete = null;
let selectedBlock = null;

const exerciseTableContainer = document.getElementById("table-container");
const formExercise = document.getElementById("create-exercise-form");

let dataTableExercise;
// let delRowButton;
// let modRowButton;

$(document).ready(function () {
  const trainingTable = $("#trainingTable").DataTable({
    columns: [{ data: "name" }], // Display only team name
    dom: "Blfrtip",
    searching: true, // Enable the search bar
    paging: true,
    //
  });
});

// Get the athleteID
async function fetchAthleteID(userEmail) {
  // Make an asynchronous call to fetch the athlete's ID
  const response = await fetch(`/getAthleteId?athleteUsername=${userEmail}`);
  const data = await response.json();
  return data.athlete_id;
}

// Get the Teams for the athlete
async function fetchAthleteTeams(athleteId) {
  // Make an asynchronous call to fetch the athlete's teams using the athleteID
  const response = await fetch(`/getTeamsForAthlete?athleteId=${athleteId}`);
  const data = await response.json();
  //console.log("This is teams data : ", data);
  return data.teams;
}

async function fetchCoaches(athleteId) {
  const response = await fetch(`/getMyCoaches?athleteId=${athleteId}`);
  const data = await response.json();
  //console.log("These are my personal and team Coaches IDs : ", data);
  return data;
}

async function fetchPersonalCoaches(athleteId) {
  const response = await fetch(`/getMyPersonalCoaches?athleteId=${athleteId}`);
  const data = await response.json();
  console.log("These are my Personal Coaches IDs : ", data);
  return data;
}

async function fetchWorkoutsByTeam(teamId, selectedDate, coachId) {
  const response = await fetch(
    `getWorkoutsByTeam?teamId=${teamId}}&date=${selectedDate}&coachId=${coachId}`
  );
  const data = await response.json();
  //console.log("These are the workouts : ", data);
  return data;
}

async function fetchWorkoutsByAthleteDirect(athlete_id, coachId, selectedDate) {
  const response = await fetch(
    `getWorkoutsByAthleteDirect?athleteId=${athlete_id}}&date=${selectedDate}&coachId=${coachId}`
  );
  const data = await response.json();
  //console.log("These are the workouts assigned for athlete by his teamId: ",data);
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

async function fetchWorkoutsForAthleteAndTeams(athleteId, teamIds) {
  try {
    // Once you have athleteIds and teamIds, fetch workouts
    const workoutsForAthlete = await fetchWorkouts(athleteId);
    console.log("Workouts By Athlete:", workoutsForAthlete);

    const workoutsForTeams = [];
    for (const teamId of teamIds) {
      //console.log("Team ID ", teamId);
      const teamWorkouts = await fetchWorkouts(null, teamId);
      workoutsForTeams.push(teamWorkouts);
    }
    console.log("Workouts By Teams:", workoutsForTeams);
    const workout = workoutsForTeams.concat(workoutsForAthlete);
    //console.log("Together : ", workout);
    return workout;
    // Now you have the workouts based on athleteIds and teamIds
  } catch (error) {
    console.log("Error fetching data: " + error);
  }
}

// Get All Blocks
function getAllBlockNames(workoutData) {
  // workoutData is workout_name arrays
  // Each workout_name array has blocks which are again arrays
  const blockNames = [];
  workoutData.forEach((workout) => {
    if (Array.isArray(workout)) {
      workout.forEach((w) => {
        w.blocks.forEach((block) => {
          blockNames.push(block.block_name);
        });
      });
    }
    if (Array.isArray(workout.blocks)) {
      workout.blocks.forEach((block) => {
        blockNames.push(block.block_name);
      });
    }
  });
  return blockNames;
}

// Get All Exercises by block
// function getExercisesByBlockName(workoutData, targetBlockName) {
//   const exercises = [];
//   workoutData.forEach((workout) => {
//     if (Array.isArray(workout)) {
//       workout.forEach((w) => {
//         w.blocks.forEach((block) => {
//           if (block.block_name === targetBlockName) {
//             exercises.push(...block.exercises);
//           }
//         });
//       });
//     }

//     if (Array.isArray(workout.blocks)) {
//       workout.blocks.forEach((block) => {
//         if (block.block_name === targetBlockName) {
//           exercises.push(...block.exercises);
//         }
//       });
//     }
//   });
//   return exercises;
// }

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

// function getMyExercisesByBlockName(workoutData, targetBlockName) {
//   const exercises = [];
//   workoutData.forEach((workout) => {
//     if (Array.isArray(workout.blocks)) {
//       workout.blocks.forEach((block) => {
//         if (block.block_name === targetBlockName) {
//           exercises.push(...block.exercises);
//         }
//       });
//     }
//   });
//   return exercises;
// }

// Display the blocks once it is clicked : Blocks is an array
function displayBlocks2(blocks) {
  selectedBlock = blockTabs.innerHTML = "";
  exerciseTabs.innerHTML = "";
  exerciseDetails.innerHTML = "Select a Block to view details.";
  exerciseDropDown.innerHTML = "";
  console.log(exerciseTabs);
  // Extract the block names

  // const block_names = blocks.map(
  //   (block) => `${block.block_id} ${block.block_name}`
  // );

  blocks.forEach((block, index) => {
    exerciseTabs.innerHTML = "";
    console.log(`Adding Button ${block.block_name}`);
    const blockButton = document.createElement("button");
    blockButton.innerText = `${block.block_name}`;
    blockButton.id = `${block.block_id}`; // Add the id to keep track of block_id
    blockTabs.appendChild(blockButton);
  });
}

blockTabs.addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON") {
    e.preventDefault();
    e.stopPropagation();
    exerciseTabs.innerHTML = "";
    exerciseDetails.innerHTML = "Select an Exercise to view details.";
    console.log(`Clicked Block button`, e.target);
    if (e.target && e.target.tagName == "BUTTON") {
      console.log("I Clicked", e.target);
      displayExercises2(e, e.target);
    }
  }
});

function displayExercises2(blockEvent, block) {
  // Everytime I click a block, a fetch request is sent to back-end to get the exercise of that block

  fetch(`getExercisesByBlock?blockId=${block.id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const exercises = data.exercises;
      console.log(
        `Block Tab ${block.id} clicked : displaying Exercises`,
        block
      );
      exerciseTabs.innerHTML = "";
      // exerciseDropDown.innerHTML = "";
      // exerciseDetails.innerHTML = "Select an exercise to view details.";
      exercises.forEach((exercise, index) => {
        exerciseDetails.innerHTML = "Select a Exercise to view details.";
        console.log("Creating the exercise buttons");
        // console.log(exerciseTabs);
        const exerciseButton = document.createElement("button");

        exerciseButton.innerText = `${exercise.name}`;
        exerciseButton.id = `${exercise.exercise_id}`; // Add the id to keep track of block_id
        console.log(`Exercise button`);
        console.log(exerciseButton);
        exerciseTabs.appendChild(exerciseButton);
      });
    });
}

exerciseTabs.addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON") {
    e.preventDefault();
    e.stopPropagation();
    exerciseDetails.innerHTML = "Select an Exercise to view details.";
    console.log(`Clicked Exercise button`, e.target);
    if (e.target && e.target.tagName == "BUTTON") {
      console.log("I Clicked", e.target);
      viewAssignedExercise(e);
      console.log(`Viewing the exercise`);
    }
  }
});

function viewAssignedExercise(e) {
  // Everytime I click an exercise block, a fetch request is sent to back-end to get the latest exercise details of that exercise
  const clickedExerciseButton = e.target;
  console.log(`Exercise Button `, e.target);
  fetch(`getExerciseDetails?exerciseId=${e.target.id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(" I am here : the exercise details ", data);
      const exercises = data;
      // exerciseTabs.innerHTML = "Select an exercise to view details.";
      // exerciseDropDown.innerHTML = "";
      // exerciseDetails.innerHTML = "Select an exercise to view details.";

      const exerciseDetails = document.getElementById("exercise-details");
      exerciseDetails.innerHTML = "Select an exercise to view details.";
      console.log(`Inside Viewing exercise`);

      exercises.forEach((exercise, index) => {
        console.log("Exercise is : ", exercise);
        exerciseDetails.innerHTML = "Select a Exercise to view details.";
        exerciseDropDown.innerHTML = "";
        exerciseDetails.appendChild(exerciseTableContainer);
        exerciseTableContainer.classList.remove("create-exercise-table-hide"); // Making visible the table

        // Inside the load Table I have to add the pre-defined sets, loads and reps for that athlete

        const dataTable = $("#create-exercise").DataTable();
        dataTable.clear();
        const sets = exercise.sets;
        const loadsReps = exercise.loads_reps;
        console.log(loadsReps["coach"]);

        for (let i = 0; i < loadsReps["coach"].length; i++) {
          const rowData = [];

          // Set column (1-based index for human-readable numbering)
          rowData.push(i + 1);

          // LOADS and REPS columns
          rowData.push(loadsReps["coach"][i].load);
          rowData.push(loadsReps["coach"][i].reps);

          // Input_load column
          const inputCell = `<input type="number" data-input=${
            i + 1
          } name="load_entry-${i + 1}">`;
          rowData.push(inputCell);

          // Add the row data to the DataTable
          dataTable.row.add(rowData);
        }
        $("#create-exercise tbody td:first-child input").addClass("my-input");
        // Draw the table to display the added rows
        dataTable.draw();
      });
    });
}

// TODO: Realization that querying by ids is the best since it is indexing , DO NOT QUERY BY NAMES IF POSSIBLE

// On LOADING : INITIAL DATA PRESENTED OR STORED:

async function initialData() {
  try {
    athleteId = await fetchAthleteID(userEmail); // Fetch athlete UserEmail
    athleteTeams = await fetchAthleteTeams(athleteId); // Fetch Athlete Teams

    console.log("This is the athletes Team names :", athleteTeams);
    coachIds = await fetchCoaches(athleteId);

    teamIds = athleteTeams.map((team) => team.team_id);
    console.log("My coach Ids :", coachIds); // is an array of coach_ids json

    personalCoaches = await fetchPersonalCoaches(athleteId);
    peronalCoachIds = personalCoaches.map(
      (personcalCoach) => personcalCoach.coach_id
    );

    console.log("My personal coach Ids :", peronalCoachIds);

    myWorkouts = await fetchWorkoutsForAthleteAndTeams(athleteId, teamIds);
    console.log("These are my Workouts: initial Data ", myWorkouts);

    // TODO: Use only if required
    // const allBlockNames = getAllBlockNames(myWorkouts);
    // console.log("All Block Names:", allBlockNames);

    // const targetBlockName = "Zumba-dance2";
    // const exercisesForBlock = getExercisesByBlockName(
    //   myWorkouts,
    //   targetBlockName
    // );
    // console.log(`Exercises for "${targetBlockName}":`, exercisesForBlock);

    const dataCreation = (function () {
      // You can now work with athleteID and athleteTeams here
      console.log("Athlete ID:", athleteId);
      console.log("Athlete Teams:", athleteTeams); // [ {} {}]

      // console.log(teamIds);
      // console.log(athleteTeams);
      teams = athleteTeams.map((team) => team.name);

      // INITIALIZING THE TEAMS OF THE TRAINING TABLE
      const trainingTable = $("#trainingTable").DataTable();
      // console.log("Data.teams 0", teams[0]);
      trainingTable.clear().rows.add(athleteTeams).draw(); // Passing an array to rows.add()
      personalCoaches.forEach((coach) => {
        trainingTable.row
          .add({
            coach_id: coach.coach_id,
            name: `My individual trainings-${coach.name}`,
            sport: "sport",
            team_id: null,
          })
          .draw(false);
      });

      // .orderFixed({ pre: [0, "asc"] })
      // .columnDefs([
      //   { orderData: [0, "data-sort"] },
      //   { targets: "noSort", orderable: false },
      // ])
    })();
    return athleteId, athleteTeams, coachIds, teams;
  } catch (error) {
    console.log("Could not fetch the details " + error);
  }
}

// Main Function which has all details:
async function main() {
  try {
    const data = await initialData(); // Gets all the initial Data

    console.log("Athlete ID is :", athleteId);
    console.log("Athlete Teams :", teams);
    console.log("My Personal CoachIDs", peronalCoachIds);
  } catch (error) {
    console.error("An error occured", error);
  }
}

main();

// DATA TABLE INITIALIZATION
$(document).ready(function () {
  // Viewing the details:

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

// RESPONSIVE ANY TEAM CLICKED SHOULD SHOW THE TEAM SESSION DETAILS
$("#trainingTable tbody").on("click", "tr", function () {
  // Get the team ID from the clicked row
  var trainingTable = $("#trainingTable").DataTable();
  // Gives the object details for the row
  var data = trainingTable.row(this).data(); // Object { coach_id, , ....}
  // Displays the object for the row

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
  if (data["team_id"] !== null) {
    currentTeamId = data["team_id"];
    console.log("The current team_id is ", currentTeamId);
    currentCoachId = data["coach_id"];
    console.log("The current coach_id is ", currentCoachId);
  } else if (data["team_id"] === null) {
    currentTeamId = null;
    currentCoachId = data["coach_id"];
  }
  // var redirectUrl = `/athleteSelectedTeamTraining?teamId=${currentTeamId}&athleteId=${athleteId}`;

  // window.location.href = redirectUrl;

  // Redirect to the new page : athlete-view-training.html and pass the query parameters: teamId and athleteId

  // Append the my-training to the first td cell of the row that is clicked
  // $(this).find("td").eq(0).append($("#my-training"));

  // Get the details of the workouts for this clicked team for this athlete

  // Appends the my-training details for the row - Blocks , Exercises , Exercise details

  // Get current Workout
  // Everytime I clikc on a Team, a fetch request is sent to get workout and display the blocks of the team
  currentWorkout =
    currentTeamId === null
      ? // FIXME: Change the date to currentDate later
        fetch(
          `getWorkoutsByAthleteDirect?athleteId=${athleteId}&coachId=${currentCoachId}&date=2022-11-06`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("This is my data:", data);
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
          })
      : fetch(
          `getWorkoutsByTeam?teamId=${currentTeamId}&coachId=${currentCoachId}&date=${currentDate}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("This is my data:", data);
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

// DISPLAY BLOCKS:
function displayBlocks(athlete) {
  selectedBlock = blockTabs.innerHTML = "";
  exerciseTabs.innerHTML = "";
  exerciseDetails.innerHTML = "Select a Block to view details.";
  exerciseDropDown.innerHTML = "";
  console.log(exerciseTabs);
  // Efficiency :

  athlete.blocks.forEach((block, index) => {
    exerciseTabs.innerHTML = "";
    console.log(`Running this display block`);
    const blockButton = document.createElement("button");
    blockButton.innerText = `Block ${block.id}`; // FIXME: Change to block name
    // Event listener added here:
    blockButton.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      // if (currentTeamId !== null) {
      //   // Get the team id of the team clicked
      //   $.get(
      //     `/getWorkoutsByTeam?team_id=${currentTeamId}&coach_id=1`,
      //     function (data) {
      // Remove the blocks
      exerciseTabs.innerHTML = "";
      console.log(exerciseTabs);
      exerciseDetails.innerHTML = "Select an Exercise to view details.";
      e.stopPropagation();
      // display of the exerciseView should go back to 0
      //exerciseVisited = 0;
      displayExercises(e, block);
    });
    blockTabs.appendChild(blockButton);
  });
}

// BLOCK TAB CLICKED: Display exercises for the CLICKED block
function displayExercises(e, block) {
  console.log("Block Tab clicked ; displaying exercises", block);
  selectedBlock = e.target;
  console.log(selectedBlock); // Block button
  exerciseTabs.innerHTML = "";
  exerciseDropDown.innerHTML = "";
  exerciseDetails.innerHTML = "Select an exercise to view details.";
  block.exercises.forEach((exercise, index) => {
    exerciseDetails.innerHTML = "Select a Exercise to view details.";
    console.log("Creating the exercise buttons");
    console.log(exerciseTabs);
    const exerciseButton = document.createElement("button");
    exerciseButton.innerText = exercise;
    console.log(`Exercise button`);
    console.log(exerciseButton);
    exerciseTabs.appendChild(exerciseButton);
  });
}

$(document).ready(function () {
  // Function to collect and submit form data
  $("#create-exercise-form").on("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("INside the exercise form input");
    // event.preventDefault(); // Prevent the default form submission
    // Collect the values from the dynamically generated rows
    var exerciseData = [];

    // $(".create-exercise-rows tr").each(function () {
    //   var set = $(this).find(".set-input").val();
    //   var load = $(this).find(".load-input").val();
    //   var reps = $(this).find(".reps-input").val();
    //   var inputLoad = $(this).find(".input-load-input").val();

    var allData = table.columns().data();
    // Create an object with the collected data and push it to the array
    exerciseData.push({
      set: set,
      load: load,
      reps: reps,
      inputLoad: inputLoad,
    });
    // });
    console.log(exerciseData);
    console.log(allData);

    // You can now do something with the exerciseData array, like sending it to the server

    // Clear the form or perform any other actions as needed
    // For example, you can reset the form:
    // $("#create-exercise-form")[0].reset();
  });

  // Add a new row to the table when the "Modify" button is clicked
  $("#modifyButton").on("click", function () {
    // Create a new row with input elements and add it to the table
    // var newRow = $("<tr class='exercise-row'>").append(
    //   $("<td><input class='set-input' type='text'></td>"),
    //   $("<td><input class='load-input' type='text'></td>"),
    //   $("<td><input class='reps-input' type='text'></td>"),
    //   $("<td><input class='input-load-input' type='text'></td>")
    // );
    // $(".create-exercise-rows").append(newRow);
  });

  // You can add more functionality, like removing rows or validating inputs, as needed.
});
