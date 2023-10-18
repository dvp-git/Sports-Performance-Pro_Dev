const TrainingSessionResp = `{
  "Block-1": [
    {
      "Exercise-1": {
        "exercise_name": "asdasd",
        "loads": "asdasd",
        "reps": "asdasd",
        "sets": "asdasd",
        "attr": "asdasd"
      }
    },
    {
      "Exercise-2": {
        "exercise_name": "asdasd",
        "loads": "asdasd",
        "reps": "asdasd",
        "sets": "asdasd",
        "attr": "asdasd"
      }
    }
  ],
  "Block-2": [
    {
      "Exercise-3": {
        "exercise_name": "asdasd",
        "loads": "asdasd",
        "reps": "asdasd",
        "sets": "asdasd",
        "attr": "asdasd"
      }
    },
    {
      "Exercise-4": {
        "exercise_name": "asdasd",
        "loads": "asdasd",
        "reps": "asdasd",
        "sets": "asdasd",
        "attr": "asdasd"
      }
    }
  ]
}`;

// Get blocks of training session
const getBlocks = function (jsonResp) {
  const trainingObj = JSON.parse(jsonResp);
  //   console.log(trainingObj);
  return trainingObj;
};
const blocks = getBlocks(TrainingSessionResp);
console.log(blocks); // Object of arrays

// Get exercises of a particular block
const getExercises = function (blocks, blockName) {
  // object, object name
  const exercises = Object.values(blocks[blockName]);
  //   console.log(exercises);
  return exercises;
};

const e1 = getExercises(blocks, "Block-1");
console.log(e1[0]);
