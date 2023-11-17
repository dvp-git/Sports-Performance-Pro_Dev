// JavaScript to populate Exercise Type and Exercise Name based on selected Category and Exercise Type
const categorySelect = document.getElementById("category");
const exerciseTypeSelect = document.getElementById("exerciseType");
const exerciseNameSelect = document.getElementById("exerciseName");

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

// Event listener for category dropdown change
categorySelect.addEventListener("change", updateExerciseTypes);

// Event listener for exercise type dropdown change
exerciseTypeSelect.addEventListener("change", updateExerciseNames);

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

// Initial population of categories
fetchData("/categories", {}, function (data) {
  populateDropdown(categorySelect, data.categories);
  updateExerciseTypes(); // Update exercise types after populating categories
});

// Save Exercise Button Click Event
const addExerciseButton = document.getElementById("addExerciseButton");
addExerciseButton.addEventListener("click", function (event) {
  const exerciseNameSelect = document.getElementById("exerciseName");

  // Get the selected option
  const selectedOption =
    exerciseNameSelect.options[exerciseNameSelect.selectedIndex];

  if (!selectedOption) {
    event.preventDefault(); // Prevent form submission
    alert(
      "Please fill in all the required fields (Loads, Reps, Sets, and select an Exercise)."
    );
  } else {
    const selectedExerciseName = selectedOption.text; // Get the text of the selected option

    // Continue with form submission or data handling

    // Redirect to the new page with the selected exercise name
    const redirectUrl = `/coachTeamWorkout?exerciseName=${encodeURIComponent(
      selectedExerciseName
    )}`;
    window.location.href = redirectUrl;
  }
});

cancelButton.addEventListener("click", function (event) {
  // Cancel button click event
});
