$(document).ready(function () {
  // Create athlete data
  var athletes = [
    { name: "John", sports: "Tennis", institute: "University of Texas" },
    {
      name: "Darryl",
      sports: "Swimming",
      institute: "University at Buffalo",
    },
    {
      name: "Jason",
      sports: "Basketball",
      institute: "New York University",
    },
    {
      name: "Emily",
      sports: "Volleyball",
      institute: "University of California, Los Angeles",
    },
    {
      name: "Sophia",
      sports: "Soccer",
      institute: "Stanford University",
    },
    { name: "Ethan", sports: "Basketball", institute: "Duke University" },
    {
      name: "Olivia",
      sports: "Swimming",
      institute: "Harvard University",
    },
    {
      name: "Liam",
      sports: "Track and Field",
      institute: "University of Oregon",
    },
    {
      name: "Isabella",
      sports: "Gymnastics",
      institute: "University of Florida",
    },
    {
      name: "Noah",
      sports: "Baseball",
      institute: "Texas A&M University",
    },
    {
      name: "Ava",
      sports: "Tennis",
      institute: "University of California, Berkeley",
    },
    {
      name: "Mia",
      sports: "Softball",
      institute: "University of Oklahoma",
    },
    {
      name: "Lucas",
      sports: "Wrestling",
      institute: "University of Iowa",
    },
    {
      name: "Amelia",
      sports: "Ice Hockey",
      institute: "Boston University",
    },
    {
      name: "Oliver",
      sports: "Skiing",
      institute: "University of Colorado Boulder",
    },
    {
      name: "Emma",
      sports: "Lacrosse",
      institute: "Syracuse University",
    },
    {
      name: "William",
      sports: "Rugby",
      institute: "University of Notre Dame",
    },
    {
      name: "Aiden",
      sports: "Cross Country",
      institute: "Princeton University",
    },
  ];

  // Initialize DataTable
  var table = $("#athleteTable").DataTable({
    data: athletes,
    columns: [{ data: "name" }, { data: "sports" }, { data: "institute" }],
  });

  $("#athleteTable tbody").on("click", "tr", function () {
    var data = table.row(this).data();
    var athleteName = data.name;

    // Remove highlighting from previously selected row
    $("#athleteTable tbody tr").removeClass("selected");

    // Add the 'selected' class to the clicked row
    $(this).addClass("selected");

    // Enable the "Continue" button
    $("#continueButton").prop("disabled", false);
  });

  // Handle the "Continue" button
  $("#continueButton").click(function () {
    var selectedRow = $("#athleteTable tbody tr.selected");
    if (selectedRow.length > 0) {
      // An athlete is selected, redirect to the desired page (e.g., demo.html)
      window.location.href = "demo.html";
    } else {
      // No athlete selected, show a popup
      alert("No athlete selected. Please select an athlete before continuing.");
    }
  });

  // Handle the "Return" button
  $("#returnButton").click(function () {
    // Check if an athlete is selected
    var selectedRow = $("#athleteTable tbody tr.selected");
    if (selectedRow.length > 0) {
      // Ask for confirmation
      var confirmReturn = confirm(
        "You have selected an athlete. Do you still want to return?"
      );
      if (!confirmReturn) {
        // User clicked "Cancel," so do nothing
        return;
      }
    }

    // Redirect to the previous page (workout-selection.html)
    window.location.href = "workout-selection.html";
  });
});
