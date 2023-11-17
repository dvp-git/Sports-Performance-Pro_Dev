var deleteButton = dataTableExercise
  .cell(rowIdx, 3)
  .nodes()
  .to$()
  .find("input[class=delete-row-button]")
  .attr("id");
$("#" + deleteButton).attr("id", "delete-" + (rowIdx + 1));
deleteButton.attr("id", "delete-" + this.data()[0]);

// Update the input names for loads and reps
var inputs = $(this.node()).find("input");
inputs.eq(0).attr("name", "loads-" + this.data()[0]);
inputs.eq(1).attr("name", "reps-" + this.data()[0]);

/////////////////

// Function to collect and submit form data
$(document).ready(function () {
  const coachExerciseData = [];
  var table = $("#create-exercise").DataTable();
  $("#testing").on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    const sets = table.columns(0).data()[0].length;
    // var loads = [...table.columns(1).data()[0]];
    // var reps = [...table.columns(2).data()[0]];
    // var loads = [];
    // var reps = [];

    ///////////////////////////////////
    const loadsColumn = table.column(1).nodes(); // Get input elements from column 1
    const repsColumn = table.column(2).nodes(); // Get input elements from column 2

    const loads = [];
    const reps = [];

    // Fetch values from loadsColumn
    $(loadsColumn)
      .find('input[type="number"]')
      .each(function () {
        loads.push($(this).val());
      });

    // Fetch values from repsColumn
    $(repsColumn)
      .find('input[type="number"]')
      .each(function () {
        reps.push($(this).val());
      });

    console.log("Values from column 1:", loads);
    console.log("Values from column 2:", reps);

    const loadsRepsArray = loadsRepsFormatter(loads, reps);

    console.log(`loadsRepsArray`, loadsRepsArray);
    ///////////////////////////////
    // table.rows().every(function () {
    //   var data = this.data(); // Get data of the current row
    //   console.log("The data from table: ", data);
    //   // Push values from the 2nd and 3rd columns into respective arrays
    //   loads.push($(data[1])[0]); // 2nd column
    //   reps.push($(data[2])[0]); // 3rd column
    // });

    // console.log("Loads,", loads);
    // console.log("loads[1]");
    // console.log($(loads[1]).val());

    // console.log("Reps,", reps);

    // const loadsReps = table.$("input");
    // let check = false;
    // for (let i = 0; i < sets; i++) {
    //   check = getLoadsReps(loadsReps);
    //   if (check) {
    //     coachExerciseData.push(Number(loadsReps[i].value));
    //   } else {
    //     console.log("Give the right input");
    //     console.log("Display a modal here ");
    //     break; // the loop, invalid entry
    //   }
    // }
  });
});
