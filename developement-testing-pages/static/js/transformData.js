function transformData(athleteData) {
  return athleteData.map((athlete) => {
    return {
      blocks: athlete.blocks.map((block) => {
        return {
          block_name: `Block-${block.id}`,
          exercises: block.exercises.map((exerciseName) => {
            return {
              exercise_name: exerciseName,
              loads_reps: {
                coach: [
                  {
                    load: 0, // Set the initial load
                    reps: 0, // Set the initial reps
                  },
                ],
              },
              sets: 1, // Set the initial number of sets
            };
          }),
        };
      }),
      coach_name: athlete.name,
      date_added: "2022-10-30", // Set the desired date
      workout_name: athlete.name, // Set the workout name
    };
  });
}

const athleteData = [
  {
    blocks: [
      {
        block_name: "PushUp-high",
        exercises: [
          {
            exercise_name: "push-ex-1",
            loads_reps: [
              {
                load: 80,
                reps: 2,
              },
              {
                load: 100,
                reps: 1,
              },
            ],
            sets: 2,
          },
        ],
      },
      {
        block_name: "PushUp-mid",
        exercises: [
          {
            exercise_name: "push-ex-2",
            loads_reps: [
              {
                load: 90,
                reps: 2,
              },
              {
                load: 20,
                reps: 23,
              },
            ],
            sets: 2,
          },
        ],
      },
      {
        block_name: "PushUp-low",
        exercises: [],
      },
      {
        block_name: "PushUp-high",
        exercises: [
          {
            exercise_name: "PushUp-high",
            loads_reps: {
              coach: [
                {
                  load: 70,
                  reps: 2,
                },
                {
                  load: 90,
                  reps: 1,
                },
              ],
            },
            sets: 2,
          },
          {
            exercise_name: "PushUp-low",
            loads_reps: {
              coach: [
                {
                  load: 60,
                  reps: 3,
                },
                {
                  load: 80,
                  reps: 2,
                },
                {
                  load: 90,
                  reps: 2,
                },
              ],
            },
            sets: 3,
          },
        ],
      },
      {
        block_name: "PushUp-low",
        exercises: [
          {
            exercise_name: "PushUp-low",
            loads_reps: {
              coach: [
                {
                  load: 40,
                  reps: 4,
                },
                {
                  load: 60,
                  reps: 3,
                },
                {
                  load: 60,
                  reps: 3,
                },
              ],
            },
            sets: 3,
          },
        ],
      },
    ],
    coach_name: "Darryl",
    date_added: "2022-10-30",
    workout_name: "PushUp",
  },

  {
    blocks: [
      {
        block_name: "Squat-Fast",
        exercises: [
          {
            exercise_name: "squat-fl-1",
            loads_reps: {
              coach: [
                {
                  load: 25,
                  reps: 2,
                },
                {
                  load: 50,
                  reps: 1,
                },
              ],
            },
            sets: 2,
          },
          {
            exercise_name: "squat-fl-2",
            loads_reps: {
              coach: [
                {
                  load: 30,
                  reps: 2,
                },
                {
                  load: 60,
                  reps: 2,
                },
              ],
            },
            sets: 2,
          },
          {
            exercise_name: "squat-fl-3",
            loads_reps: {
              coach: [
                {
                  load: 25,
                  reps: 3,
                },
                {
                  load: 70,
                  reps: 3,
                },
              ],
            },
            sets: 2,
          },
          {
            exercise_name: "Squat-high",
            loads_reps: {
              coach: [
                {
                  load: 50,
                  reps: 3,
                },
              ],
            },
            sets: 1,
          },
        ],
      },
      {
        block_name: "Squat-Slow",
        exercises: [
          {
            exercise_name: "squat-sl-1",
            loads_reps: [
              {
                load: 90,
                reps: 2,
              },
              {
                load: 20,
                reps: 23,
              },
            ],
            sets: 2,
          },
          {
            exercise_name: "squat-sl-2",
            loads_reps: [
              {
                load: 90,
                reps: 2,
              },
              {
                load: 20,
                reps: 23,
              },
            ],
            sets: 2,
          },
          {
            exercise_name: "squat-sl-3",
            loads_reps: [
              {
                load: 90,
                reps: 2,
              },
              {
                load: 20,
                reps: 23,
              },
            ],
            sets: 2,
          },
        ],
      },
    ],
    coach_name: "Darryl",
    date_added: "2022-10-30",
    workout_name: "Squat",
  },
  {
    blocks: [
      {
        block_name: "Zumba-dance1",
        exercises: [
          {
            exercise_name: "Zumba-dance1",
            loads_reps: {
              coach: [
                {
                  load: 50,
                  reps: 2,
                },
                {
                  load: 65,
                  reps: 3,
                },
              ],
            },
            sets: 2,
          },
        ],
      },
      {
        block_name: "Zumba-dance2",
        exercises: [
          {
            exercise_name: "Zumba-dance2",
            loads_reps: {
              coach: [
                {
                  load: 40,
                  reps: 4,
                },
              ],
            },
            sets: 1,
          },
        ],
      },
      {
        block_name: "Zumba-dance3",
        exercises: [],
      },
    ],
    coach_name: "Darryl",
    date_added: "2022-10-30",
    workout_name: "Zumba",
  },
];

const transformedData = transformData(athleteData);
console.log(transformedData);
