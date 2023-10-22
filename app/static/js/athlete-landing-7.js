"use strict";
const team_nodes = document.querySelectorAll(".team-nodes");
const btnCloseModal = document.querySelector(".close-modal");
const btnshowModal = document.querySelectorAll(".show-modal"); //
const block_nodes = document.querySelectorAll(".block-nodes");
const exercise_nodes = document.querySelectorAll(".exc_nodes");
const teamTrainTree = document.querySelector(".team-train-sessions");
let trainCount = document.querySelectorAll(".team-nodes").length;
const addExerciseSkeleton = document.getElementById("addExercise");

const categorySelect = document.getElementById("category");
const exerciseTypeSelect = document.getElementById("exerciseType");
const exerciseNameSelect = document.getElementById("exerciseName");
const closeExerciseButton = document.getElementById("closeFormButton");
let jsonData = "";

const exerciseData = {
  Cardio: {
    Treadmill: ["Running"],
    Elliptical: ["Elliptical training"],
    "Stationary bike": ["Cycling"],
    "Rowing machine": ["Rowing"],
    "Stair climber": ["Stair climbing"],
  },
  "Strength training": {
    Push: ["Bench press", "Overhead press", "Push-ups", "Machine chest press"],
    Pull: [
      "Pull-ups",
      "Lat pulldown",
      "Barbell row",
      "Dumbbell row",
      "Cable row",
    ],
    "Hip hinge": [
      "Deadlift",
      "Good morning",
      "Romanian deadlift",
      "Clean",
      "Kettlebell swing",
    ],
    Squat: [
      "Squat",
      "Front squat",
      "Bulgarian split squat",
      "Goblet squat",
      "Leg press",
    ],
  },
  Core: {
    Plank: ["Plank", "Side plank", "Knee raise plank", "Hollow body hold"],
    Crunches: ["Crunches", "Leg raises", "Sit-ups"],
    "Russian twists": ["Russian twists"],
  },
  Yoga: {
    "Downward-facing dog": ["Downward-facing dog"],
    "Warrior I pose": ["Warrior I pose"],
    "Triangle pose": ["Triangle pose"],
    "Tree pose": ["Tree pose"],
    "Bridge pose": ["Bridge pose"],
  },
};

const createEl = function (element, textContent, _classList, _visibility) {
  const el = document.createElement(element);
  el.textContent = textContent;
  console.log(_classList);
  _classList = _classList.split(" ");
  el.classList.add(_classList[0]); // button type
  el.classList.add(_classList[1]); // section : block or exercise
  el.classList.add(_classList[2]); // hidden
  el.setAttribute("visibility", _visibility);
  return el;
};

const btnBlockElem = createEl(
  "button",
  "Add a Block",
  "createBlock-btn block-nodes hidden",
  0
);

const btnExerciseElem = createEl(
  "button",
  "Add an Exercise",
  "addExercise-btn exc_nodes hidden",
  0
);

categorySelect.addEventListener("change", updateExerciseTypes);
exerciseTypeSelect.addEventListener("change", updateExerciseNames);

function updateExerciseTypes() {
  console.log("Inside Update SELECTION--------------");
  const selectedCategory = categorySelect.value;
  console.log(categorySelect.value);
  exerciseTypeSelect.innerHTML = "";
  exerciseNameSelect.innerHTML = "";

  if (exerciseData[selectedCategory]) {
    const exerciseTypes = Object.keys(exerciseData[selectedCategory]);
    exerciseTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      exerciseTypeSelect.appendChild(option);
    });
  }
  updateExerciseNames();
}

function updateExerciseNames() {
  const selectedCategory = categorySelect.value;
  const selectedExerciseType = exerciseTypeSelect.value;
  exerciseNameSelect.innerHTML = "";
  if (
    exerciseData[selectedCategory] &&
    exerciseData[selectedCategory][selectedExerciseType]
  ) {
    exerciseData[selectedCategory][selectedExerciseType].forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      exerciseNameSelect.appendChild(option);
    });
  }
}

// Create user entry blocks once the exercise is created.

// Create the new element from JSON data
function createJsonEl(element, jsonData) {
  console.log("INSIDE CREATE JSON ELEMENT FUNCTION");
  console.log(jsonData);
  console.log(element);
  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      const itemElement = document.createElement("div");
      itemElement.className = "json-item";

      const keyElement = document.createElement("span");
      keyElement.className = "json-key";
      keyElement.textContent = key;
      // console.log(keyElement.textContent);

      const valueElement = document.createElement("span");
      valueElement.className = "json-value";
      valueElement.textContent = jsonData[key];
      // console.log(valueElement.textContent);

      itemElement.appendChild(keyElement);
      itemElement.appendChild(valueElement);
      element.appendChild(itemElement);
    }
  }
}

// Initial population of Exercise Types
updateExerciseTypes();

// Save Exercise Button Click Event

function resetExercises() {
  const selectedCategory = categorySelect.value;
  // exerciseTypeSelect.innerHTML = "";
  // exerciseNameSelect.innerHTML = "";
  document.getElementById("loads").value = "";
  document.getElementById("reps").value = "";
  document.getElementById("sets").value = "";
}

closeExerciseButton.addEventListener("click", function (event) {
  updateExerciseTypes();
  resetExercises();
  addExerciseSkeleton.style.display = "none";
});

// console.log(btnBlockElem, typeof btnBlockElem);
// console.log(btnExerciseElem);

// console.log(team_nodes);
// Adding Add a block button at end of each Team displayed✅
team_nodes.forEach((t) => {
  const tParent = t.querySelector("ul");
  //console.log(tParent);
  // TODO: BUG USING normal append, appends the sampe element to various nodes.✅
  // FIX : Using clone of the node
  tParent.appendChild(btnBlockElem.cloneNode(true)); // Use cloneNode to create a new button each time
  //console.log(tParent);
  //console.log("-----------------");
});

// TODO: Adding add an exercise button at end of each block✅
block_nodes.forEach((b) => {
  const bParent = b.querySelector("ul");
  //console.log(bParent);
  // TODO: BUG USING normal append, appends the sampe element to various nodes.✅
  // FIX : Using clone of the node
  bParent.appendChild(btnExerciseElem.cloneNode(true)); // Use cloneNode to create a new button each time
  //console.log(bParent);
  //console.log("-----------------");
});

// Add click event listeners to tree nodes
// TODO: Refactor to use Event delegation on the main training container

// TODO: When Closing the Team click , Refactor as above to have single event handler. Used class to change functionaloty. Might need refactoring further for DRY principle.

// TODO:
// BUG: Shrking team/athlete list does not work
// BUG:
// FEATURE: Delete an exercise, block button
// FEATURE: Modify an exercise, block button.
// FEATURE: While adding the block, block name user input is required
// FEATUER: WHile adding the exercise, exercise name user input is required.
// FEATURE: Changing Block name.
// FEATUER: Changing Exercise name.
let exerciseAdd, newExercise, execTarget;
team_nodes.forEach((t) =>
  t.addEventListener("click", (e) => {
    const target = e.target;
    execTarget = e.target;
    console.log(`Outer Target:`, target);

    let vis_ = target.getAttribute("visibility");
    //console.log("Visibility of Target:", vis_);

    // EXERCISE node clicked
    if (target.classList.contains("exc_nodes")) {
      console.log("The EXERICSE NODE IS CLICKED:");
      //   let vis_ = target.getAttribute("visibility");
      //   console.log(target);

      // ADD EXERCISE button :

      if (target.classList.contains("addExercise-btn")) {
        // ADD A NEW Exercise
        console.log("Clicked ADD AN EXERCISE button");

        //console.log(exerciseAdd);
        addExerciseSkeleton.style.display = "block";

        exerciseAdd = document.createElement("div");

        exerciseAdd.classList.add("exDisplay"); // Changed to id
        console.log("The Exercise div: ", exerciseAdd);
        //============================
        // Create a new list item

        newExercise = document.createElement("li");

        // Add the visibility and class
        newExercise.classList.add("exc_nodes");

        // SET visibility of the list to 1 , since we want to see the results of the Exercises added immediately
        // BUG : visibility = 0 . The Exercise added button has to be clicked twice to reset the visibility ✅
        // FIX : set visibility during creation.
        newExercise.setAttribute("visibility", 1);

        newExercise.textContent = "New Exercise added"; // MAKE THIS NAME =

        // DISPLAYS THE BOX
        // go to add display box functionailty

        //EXERCISE NAME
        // target = New Exercise button
        // parentElement = immediate block
        // Insert this new Exercise li element before the Add Exercise Button
      } else {
        // EXPAND/SHRINK the Exercise node
        const div_ex = target.querySelector(".exDisplay");
        console.log("Clicked an EXISTING EXERCISE BUTTON");
        if (Number(vis_) === 0) {
          // Display it in a nice manner
          console.log("EXERCISE TREE IS EXPANDING NOW");
          // EXPAND THE EXDERCISE TREE
          div_ex.classList.contains(["hidden"])
            ? div_ex.classList.remove(["hidden"])
            : null;
          target.setAttribute("visibility", 1);
        } else {
          console.log("EXERCISE TREE IS SHRIKING NOW");
          // SHRINK THE EXDERCISE TREE
          const div_ex = target.querySelector(".exDisplay");
          //console.log(div_ex);
          div_ex.classList.add(["hidden"]);
          target.setAttribute("visibility", 0);
        }
      }
    }

    // BLOCK node clicked
    if (target.classList.contains("block-nodes")) {
      console.log("Entered block function");
      // console.log(`Inner Target:`, target);
      let vis_ = target.getAttribute("visibility");
      //console.log(vis_);
      //console.log(target);
      if (target.classList.contains("createBlock-btn")) {
        // ADD A NEW BLOCK
        // Keep a count of the current elements in the list : Not required, using insertBefore
        // const blockCount = target.parentElement.children;
        // console.log(blockCount);
        // console.log(target.parentElement);
        // const block = target;
        //        console.log(`createBlockButton:`, target);
        // Create a new list item
        let newBlock = document.createElement("li");
        // Add the visibility and class
        newBlock.classList.add("block-nodes");

        newBlock.setAttribute("visibility", 0);

        newBlock.textContent = "New Block added"; // Create a Block input field

        // ADDING NEW Exercise button inside newly created block
        let newExerciseButton = document
          .createElement("ul")
          .appendChild(btnExerciseElem.cloneNode(true));
        console.log(newExerciseButton);
        newBlock.appendChild(newExerciseButton);

        target.parentElement.insertBefore(newBlock, target);
      }
      if (Number(vis_) === 0) {
        console.log("Entered inner block function ");
        // Expand Block Tree
        // console.log(target)
        const exc_nodes = target.querySelectorAll(".exc_nodes");
        //console.log(exc_nodes);
        exc_nodes.forEach((ex) => ex.classList.remove(["hidden"]));
        target.setAttribute("visibility", 1);
      } else {
        // Shrink Tree
        const exc_nodes = target.querySelectorAll(".exc_nodes");
        //console.log(exc_nodes);
        exc_nodes.forEach((t) => t.classList.add(["hidden"]));
        target.setAttribute("visibility", 0);
      }
      // }
    }
    // TEAM/ATHLETE Name is clicked
    else if (target.classList.contains("team-nodes")) {
      if (Number(vis_) === 0) {
        // Expand Tree
        console.log("Entered Parent Team function ");
        // console.log(target)
        const block_nodes = target.querySelectorAll(".block-nodes");
        //console.log(block_nodes);
        block_nodes.forEach((t) => t.classList.remove(["hidden"]));
        target.setAttribute("visibility", 1);
        //console.log(target.querySelectorAll(".block-nodes"));
        //console.log(target);
        //
      } else {
        // Shrink Tree : NOTE while shrinking Tree, both the block and exc should become hidden
        // console.log(e.target);
        const block_nodes = target.querySelectorAll(".block-nodes");
        // console.log(block_nodes);
        block_nodes.forEach((b) => {
          if (b.childElementCount) {
            //   console.log("EXEC NODES TO BE PRINTED");
            //   t.classList.add(["hidden"]);
            //console.log(t.querySelectorAll(".exc_nodes"));
            b.querySelectorAll(".exc_nodes").forEach((e) => {
              // BUG: DID not check if the new exercise added block has child nodes. As a result error seen during setting "visibility" and ["hidden"] attributes of non-exitent child nodes✅
              // FIX: use hasChildNodes to check if childNodes exis

              if (e.childElementCount) {
                // console.log(e);
                // console.log(e.childElementCount);
                // console.log("=============ERROR==========");
                // Hide the node and change visibility class to 0
                e.querySelectorAll(".exDisplay").forEach((ex) => {
                  ex.setAttribute("visibility", 0);
                  ex.classList.add(["hidden"]);
                });
                e.setAttribute("visibility", 0);
                e.classList.add(["hidden"]);
              }
            });
          }
          //   block_nodes.forEach((b) => {
          //     b.classList.add(["hidden"]);
          //     b.setAttribute(vis);
          //   });
          b.classList.add(["hidden"]);
          b.setAttribute("visibility", 0);
        });
        // block_nodes.setAttribute("visibility", 0);
        // block_nodes.classList.add(["hidden"]);
        target.setAttribute("visibility", 0);
      }
    }
  })
);

// FIXME: ADD EXERCISE BUTTON IN DIALOGUE BOX  // THIS CODE IS INCREASING CUMULATIVELY WITH EACH CLICK✅
// FIXED: Moved the ExerciseEvent hanlder outside the previous event handler. Created global variables for exerciseTarget, newExercise and exerciseAdd. Re-assigned them inside the specific loops

addExerciseButton.addEventListener("click", (event) => {
  //console.log("Clicked 'ADD EXERCISE'");
  const countNodes = document.querySelectorAll(".exc_nodes");
  //console.log("CountNodes of ExDisplay", countNodes);
  event.preventDefault(); // Prevent form submission

  //============================

  //console.log("I am getting the value now");

  const loadsValue = document.getElementById("loads").value;
  const repsValue = document.getElementById("reps").value;
  const setsValue = document.getElementById("sets").value;
  const category = document.getElementById("category").value;
  const exerciseName = document.getElementById("exerciseName").value;
  const exerciseType = document.getElementById("exerciseType").value;
  //console.log(`LOADs ${loadsValue}`);
  //console.log(`REPS ${repsValue}`);
  // console.log(`SETS ${setsValue}`);

  if (!loadsValue || !repsValue || !setsValue) {
    //console.log(`I'm here the bug`);
    alert("Please fill in all the required fields (Loads, Reps, and Sets).");
    return;
  } else {
    //console.log("THIS IS THE FORM DATA JSON");
    // Form submission:
    // Create a JSON object

    const formData = {
      loadsValue: loadsValue,
      repsValue: repsValue,
      setsValue: setsValue,
      category: category,
      exerciseName: exerciseName,
      exerciseType: exerciseType,
    };

    // Send back to DATABASE
    updateExerciseTypes();
    resetExercises();
    if (formData) {
      // Call the function
      //console.log("CONVERTING TO JSON FUNCTION");
      // console.log(jsonData);
      // console.log(exerciseAdd);
      createJsonEl(exerciseAdd, formData);
      //console.log("The New EXERCISE element", newExercise);
      //console.log("The New Exercise div element", exerciseAdd);
      //console.log(exerciseAdd);
      // newExercise.parentElement.insertBefore(exerciseAdd, newExercise);
      //console.log("CHECK THESE PARAMETERS AGAINS!!!!!!!!!!!|");
      // console.log(execTarget);
      // console.log(execTarget.parentElement);
      // console.log(exerciseAdd);
      // console.log(newExercise);

      // Entries are added now and are in the exerciseAdd element. Append this to the target
      addExerciseSkeleton.style.display = "none";
    }
  }
  newExercise.appendChild(exerciseAdd); // ---> This one is right , no issues
  execTarget.parentElement.insertBefore(newExercise, execTarget); //

  const div_ex = newExercise.querySelector(".exDisplay");
  const exContainer = div_ex.childNodes;
  let setsVal;
  let newSetsVal;

  const getSetsValue = function (exContainer, setsVal) {
    exContainer.forEach((item) => {
      const keyEl = item.querySelector(".json-key");
      console.log(keyEl);
      if (keyEl.textContent.trim() === "setsValue") {
        setsVal = item;
        console.log(setsVal);
      }
    });
    console.log(setsVal);
    return setsVal.querySelector(".json-value").textContent;
  };

  //   console.log(`BEFORE setsVal ${setsVal}`);
  newSetsVal = Number(getSetsValue(exContainer, setsVal));
  console.log(newSetsVal);

  // Create input blocks in container based on the above sets received
  const createBlocks = function (div_ex, setsValue) {
    for (let i = 0; i < setsValue; i++) {
      // Create a new input block element (e.g., an input field)
      //   <div>
      //   <input id="input1" type="number" placeholder="Input 1">
      //   <button id="modifyButton1" style="display: none">Modify</button>
      //   <button id="deleteButton1" style="display: none">Delete</button>
      //   <span id="displayValue1"></span>
      // </div>

      //   const inputContainer = document.createElement("div");
      const inputBlock = document.createElement("input");
      inputBlock.setAttribute("type", "number");
      inputBlock.setAttribute("placeholder", "Enter your load");
      inputBlock.setAttribute("setsLoadNumber", i + 1); // stored as inputBlock.dataset.
      inputBlock.classList.add([`input-${i + 1}`]);
      const modButton = document.createElement("button");

      modButton.classList.add(["modify-btn", "input-added"]);
      //   modButton.textContent = "Modify";
      const delButton = document.createElement("button");

      delButton.classList.add(["delete-btn", "input-added"]);
      delButton.textContent = "Delete";

      modButton.textContent = "Modify";
      delButton.textContent = "Delete";

      console.log(inputBlock);
      div_ex.appendChild(inputBlock);
      div_ex.appendChild(modButton);
      div_ex.appendChild(delButton);

      // Add the input block to the container

      // Once user inputs the blocks, validate the entries
    }
  };
  createBlocks(div_ex, newSetsVal);
  const submitButton = document.createElement("button");
  submitButton.textContent = "Mark as completed";
  div_ex.appendChild(submitButton);
});

// JavaScript for team/Athlete search
document.getElementById("team-search").addEventListener("keyup", function () {
  const searchText = this.value.toLowerCase();
  //console.log(searchText);
  const teamList = document.querySelectorAll(".team-nodes");
  //console.log(teamList);
  teamList.forEach(function (team) {
    //console.log(team);
    const teamName = team.outerText.toLowerCase();
    //console.log(teamName);
    if (teamName.includes(searchText)) {
      team.style.display = "";
    } else {
      team.style.display = "none";
    }
  });
});

// View exercise

// Validations for exercise
function isValidExercise() {
  // valid Loads
  // valid REPS
  // Valid SETS
}

// User Entry :
// Once you open the exercise , have user entries:
// Validations for exercise
function isValidExercise() {
  // valid Loads
  // valid REPS
  // Valid SETS
}

// User Entry :
// Once you open the exercise , have user entries:
var hidWidth;
var scrollBarWidths = 40;

var widthOfList = function () {
  var itemsWidth = 0;
  $(".list li").each(function () {
    var itemWidth = $(this).outerWidth();
    itemsWidth += itemWidth;
  });
  //alert(itemsWidth);

  return itemsWidth;
};

var widthOfHidden = function () {
  return (
    $(".wrapper").outerWidth() - widthOfList() - getLeftPosi() - scrollBarWidths
  );
};

var getLeftPosi = function () {
  return $(".list").position().left;
};

var reAdjust = function () {
  if ($(".wrapper").outerWidth() < widthOfList()) {
    $(".scroller-right").show();
  } else {
    $(".scroller-right").hide();
  }

  if (getLeftPosi() < 0) {
    $(".scroller-left").show();
  } else {
    $(".item").animate({ left: "-=" + getLeftPosi() + "px" }, "slow");
    $(".scroller-left").hide();
  }
};

reAdjust();

$(window).on("resize", function (e) {
  reAdjust();
});

$(".scroller-right").click(function () {
  $(".scroller-left").fadeIn("slow");
  $(".scroller-right").fadeOut("slow");

  $(".list").animate(
    { left: "+=" + widthOfHidden() + "px" },
    "slow",
    function () {}
  );
});

$(".scroller-left").click(function () {
  $(".scroller-right").fadeIn("slow");
  $(".scroller-left").fadeOut("slow");

  $(".list").animate(
    { left: "-=" + getLeftPosi() + "px" },
    "slow",
    function () {}
  );
});

//////////////////////////////////////////////////////////////////////////////////////
// TODO: Create a Assign Exercise button if the number of rows greater than 1.
// TODO: View Exercise on clicking a particular exercise button.
// - The Add an Exercise Button should have exercise name and exercise Category which we can set from the database. The SETS should be input, which will generate the dynamic table rows for number of sets.

// TODO: Clicking a particular Exercise should show the details of the assigned exercise

// TODO: Modify an exercise should pre-popiulate with the entries of that exercise and then have user input to modify those entries. Modify button is required.

// TODO: Delete button, should pre-populate with entries of the exercise and request for confirmation.
// TODO: Change name of Block
// TODO: Change name of Exercise

("use strict");
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
