"use strict";
const team_nodes = document.querySelectorAll(".team-nodes");
const btnCloseModal = document.querySelector(".close-modal");
const btnshowModal = document.querySelectorAll(".show-modal"); //
const block_nodes = document.querySelectorAll(".block-nodes");
const exercise_nodes = document.querySelectorAll(".exc_nodes");
const teamTrainTree = document.querySelector(".team-train-sessions");
let trainCount = document.querySelectorAll(".team-nodes").length;
const addExerciseSkeleton = document.getElementById("addExerciseForm");

console.log(addExerciseSkeleton);
// BUG : Can't define by Id, since this block is common accross all sections. Use class insted
// Fixed: used class
/*
const createBlockButton = document.getElementById("createBlock-btn"); // Change to class --> By ID does'nt work since everywhere a block is required
const addExerciseButton = document.getElementById("addExercise-btn"); // Change to class --> By ID does'nt work since everywhere a block is required
//console.log(block_nodes);
*/

//=============================================
const categorySelect = document.getElementById("category");
const exerciseTypeSelect = document.getElementById("exerciseType");
const exerciseNameSelect = document.getElementById("exerciseName");

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

categorySelect.addEventListener("change", updateExerciseTypes);
exerciseTypeSelect.addEventListener("change", updateExerciseNames);

function updateExerciseTypes() {
  const selectedCategory = categorySelect.value;
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

// Initial population of Exercise Types
updateExerciseTypes();

// Save Exercise Button Click Event
const addExerciseButton = document.getElementById("addExerciseButton");
addExerciseButton.addEventListener("click", function (event) {
  const loadsValue = document.getElementById("loads").value;
  const repsValue = document.getElementById("reps").value;
  const setsValue = document.getElementById("sets").value;
  const category = document.getElementById("category").value;
  const exerciseName = document.getElementById("exerciseName").value;
  const exerciseType = document.getElementById("exerciseType").value;

  if (!loadsValue || !repsValue || !setsValue) {
    event.preventDefault(); // Prevent form submission
    alert("Please fill in all the required fields (Loads, Reps, and Sets).");
  } else {
    console.log(repsValue);
    console.log(category);
    console.log(setsValue);
    console.log(exerciseType);
    console.log(loadsValue);
    console.log(exerciseName);
    // Continue with form submission or data handling
  }
});

//==========================================

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

console.log(btnBlockElem, typeof btnBlockElem);
console.log(btnExerciseElem);

console.log(team_nodes);
// Adding Add a block button at end of each Team displayed
team_nodes.forEach((t) => {
  const tParent = t.querySelector("ul");
  console.log(tParent);
  // TODO: BUG USING normal append, appends the sampe element to various nodes.✅
  // FIX : Using clone of the node
  tParent.appendChild(btnBlockElem.cloneNode(true)); // Use cloneNode to create a new button each time
  console.log(tParent);
  console.log("-----------------");
});

// TODO: Adding add an exercise button at end of each block
block_nodes.forEach((b) => {
  const bParent = b.querySelector("ul");
  console.log(bParent);
  // TODO: BUG USING normal append, appends the sampe element to various nodes.✅
  // FIX : Using clone of the node
  bParent.appendChild(btnExerciseElem.cloneNode(true)); // Use cloneNode to create a new button each time
  console.log(bParent);
  console.log("-----------------");
});

// Add click event listeners to tree nodes
// TODO: Refactor to use Event delegation on the main training container

// IMMEDIATE UPDATES to be made
// TODO: Change visibility attribute on the nodes once expanded or shrinked -- DONE
// TODO: DELETE an exercise button, block
// TODO: DELETE a block button
// TODO: Adding a block should also include Add an exercise button inside of it.
// TODO:

team_nodes.forEach((t) =>
  t.addEventListener("click", (e) => {
    const target = e.target;
    console.log(`Outer Target:`, target);

    let vis_ = target.getAttribute("visibility");
    console.log(vis_);

    // EXERCISE node clicked
    if (target.classList.contains("exc_nodes")) {
      console.log("Entered Exercise function");
      //   let vis_ = target.getAttribute("visibility");
      //   console.log(target);

      // Add exercise if the node is a add an exercise button
      if (target.classList.contains("addExercise-btn")) {
        // ADD A NEW Exercise
        // Open a Dialogue Box
        // Create new element to enter exercise and add classList
        // const targetExercise = document.createElement("div");
        let targetExercise;
        // targetExercise.classList.add("ex");
        // console.log(targetExercise);

        // Get a cloned Form
        targetExercise = addExerciseSkeleton.cloneNode(true);
        targetExercise.classList.add("overlay");
        console.log("THIS IS THE FORM CREATED FROM CLONE");

        // Fill the entries
        const displayForm = function (element) {
          element.overlay.style.display = "block";
        };
        displayForm(targetExercise);

        // Click submit

        // Fetching values

        // const loadsValue = document.getElementById("loads").value;
        // const repsValue = document.getElementById("reps").value;
        // const setsValue = document.getElementById("sets").value;
        // const category = document.getElementById("category").value;
        // const exerciseName = document.getElementById("exerciseName").value;
        // const exerciseType = document.getElementById("exerciseType").value;

        // clone it and add it to the child
        // target.cloneNode
        // Add all the details to this container

        // append it to the Exercise tab

        // Change the Exercise block name to exerciseName

        console.log(`addExerciseButton:`, target);
        // Create a new list item
        let newExercise = document.createElement("li");
        // Add the visibility and class
        newExercise.classList.add("exc_nodes");
        newExercise.setAttribute("visibility", 0);

        newExercise.textContent = "New Exercise added";
        newExercise.appendChild(targetExercise);

        //   createBlockButton.parentElement.removeChild(createBlockButton);
        // Create a new "Create Block" button
        //   const newCreateButton = document.createElement("button");
        //   newCreateButton.setAttribute("id", "createBlock-btn");
        //   newCreateButton.textContent = "Create Block";
        target.parentElement.insertBefore(newExercise, target);
      }

      // Expanding the Exercise node
      if (Number(vis_) === 0) {
        console.log("Entered inner exercise function ");
        // Expand Exercise Tree
        // console.log(target)
        const div_ex = target.querySelector("div");
        // console.log(div_ex);
        // div_ex.forEach((div_el) => div_el.classList.remove(["hidden"]));
        div_ex.classList.remove(["hidden"]);
        target.setAttribute("visibility", 1);
      } else {
        // Shrink Tree
        const div_ex = target.querySelector("div");
        console.log(div_ex);
        div_ex.classList.add(["hidden"]);
        target.setAttribute("visibility", 0);
      }
    }

    // BLOCK node clicked
    if (target.classList.contains("block-nodes")) {
      console.log("Entered block function");
      console.log(`Inner Target:`, target);
      let vis_ = target.getAttribute("visibility");
      console.log(vis_);
      console.log(target);
      if (target.classList.contains("createBlock-btn")) {
        // ADD A NEW BLOCK
        // Keep a count of the current elements in the list : Not required, using insertBefore
        // const blockCount = target.parentElement.children;
        // console.log(blockCount);
        // console.log(target.parentElement);
        // const block = target;
        console.log(`createBlockButton:`, target);
        // Create a new list item
        let newBlock = document.createElement("li");
        // Add the visibility and class
        newBlock.classList.add("block-nodes");

        newBlock.setAttribute("visibility", 0);

        newBlock.textContent = "New Block added";
        //   createBlockButton.parentElement.removeChild(createBlockButton);
        // Create a new "Create Block" button
        //   const newCreateButton = document.createElement("button");
        //   newCreateButton.setAttribute("id", "createBlock-btn");
        //   newCreateButton.textContent = "Create Block";

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
        console.log(exc_nodes);
        exc_nodes.forEach((ex) => ex.classList.remove(["hidden"]));
        target.setAttribute("visibility", 1);
      } else {
        // Shrink Tree
        const exc_nodes = target.querySelectorAll(".exc_nodes");
        console.log(exc_nodes);
        exc_nodes.forEach((t) => t.classList.add(["hidden"]));
        target.setAttribute("visibility", 0);
      }
      // }
    }
    // TEAM/ATHLETE Name is clicked
    else {
      if (Number(vis_) === 0) {
        // Expand Tree
        console.log("Entered Parent Team function ");
        // console.log(target)
        const block_nodes = target.querySelectorAll(".block-nodes");
        console.log(block_nodes);
        block_nodes.forEach((t) => t.classList.remove(["hidden"]));
        target.setAttribute("visibility", 1);
        console.log(target.querySelectorAll(".block-nodes"));
        console.log(target);
        //
      } else {
        // Shrink Tree : NOTE while shrinking Tree, both the block and exec should become hidden
        console.log(e.target);
        const block_nodes = target.querySelectorAll(".block-nodes");
        console.log(block_nodes);
        block_nodes.forEach((b) => {
          if (b.childElementCount) {
            //   console.log("EXEC NODES TO BE PRINTED");
            //   t.classList.add(["hidden"]);
            //console.log(t.querySelectorAll(".exc_nodes"));
            b.querySelectorAll(".exc_nodes").forEach((e) => {
              // BUG: DID not check if the new exercise added block has child nodes. As a result error seen during setting "visibility" and ["hidden"] attributes of non-exitent child nodes
              // FIX: use hasChildNodes to check if childNodes exis

              if (e.childElementCount) {
                console.log(e);
                console.log(e.childElementCount);
                console.log("=============ERROR==========");
                // Hide the node and change visibility class to 0
                e.querySelector(".ex").setAttribute("visibility", 0);
                e.querySelector(".ex").classList.add(["hidden"]);
              }
              e.setAttribute("visibility", 0);
              e.classList.add(["hidden"]);
            });
          }
          //   block_nodes.forEach((b) => {
          //     b.classList.add(["hidden"])
          //     b.setAttribute(vis)
          // });
          b.classList.add(["hidden"]);
          b.setAttribute("visibility", 0);
        });
        target.setAttribute("visibility", 0);
      }
    }
  })
);

// When Closing the Team click , Refactor as above to have single event handler. Used class to change functionaloty. Might need refactoring further for DRY principle.

// Blocks visibility should become 0
// Execs visibility should become 0

// Testing SEPEARATE block : USE delegation above instead Bubbling up
// block_nodes.forEach(block => block.addEventListener("click", (e) => {
//     const target = e.target;
//     // console.log(`Target:`,target)
//     if (e.target.classList.contains('.block-nodes'))
//     {
//         console.log("This is the block function")
//     let vis_ =  target.getAttribute('visibility');
//     console.log(vis_);
//      if (Number(vis_) === 0)
//      {
//     console.log("Entered function ")
//     // console.log(target)
//     const exc_nodes = target.querySelectorAll('.exc_nodes');
//     console.log(exc_nodes)
//     exc_nodes.forEach(t => t.classList.remove(['hidden']));
//     target.setAttribute('visibility', 1);

//      }
//      else {
//         const exc_nodes = target.querySelectorAll('.exc_nodes');
//     console.log(exc_nodes)
//     exc_nodes.forEach(t => t.classList.add(['hidden']));
//     target.setAttribute('visibility', 0);
//      }
// }}));

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

// JavaScript

// Opening a dialogue form for Exercise:

// Dynamically adding blocks and exercises
// addEventListener for a new block , create block under block tree, add a new block which has same functionilty as previous
// addEvenetListener for new exercise, create exercise under new exercise tree
//   <li class="block-nodes hidden" visibility=0>
//         Block 1
//         <ul>
//           <li class="exc_nodes hidden" visibility=0>Exercise 1<div class="ex hidden"visibility=0> This is a test for exercise</div></li>
//           <li class="exc_nodes hidden" visibility=0>Exercise 2<div class="ex hidden"visibility=0> This is a test for exercise</div></li>
//         </ul>
//       </li>
//   </li>

// Replace the existing "Create Block" button with the new one
// createBlockButton.parentNode.replaceChild(newCreateButton, createBlockButton);

// Set the new button as the current "Create Block" button
// createBlockButton = newCreateButton;

// In this example, we have an HTML list with some initial items and a "Create Block" button. When you click the button, it will add a new list item with a "Block" label, and replace the "Create Block" button with a new one. The new button will be used for creating additional blocks. This process will continue each time you click the "Create Block" button.

// Make sure to include the JavaScript code in a separate script file, as shown in the HTML, or you can place it directly within a <script> tag in your HTML file.
