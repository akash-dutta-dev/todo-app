const {Todo} = require("../models");

async function createSampleTask (userId) {
    console.log("Here")
    const tasks = [
        {
          title: "Research New Workout Routine",
          description: "Add recent projects, update resume, and enhance the overall design of your personal website.",
          status: "ONGOING"
        },
        {
          title: "Read \"The Great Gatsby\"",
          description: "Explore different workout programs, focusing on a combination of strength training and cardio for a well-rounded fitness routine.",
          status: "ONGOING"
        },
        {
          title: "Learn React Hooks",
          description: "Set aside time each day to read F. Scott Fitzgerald's classic novel, \"The Great Gatsby.\"",
          status: "DONE"
        },
        {
          title: "Organize Digital Files",
          description: "Dive into React documentation and tutorials to grasp the concept and usage of React Hooks for state management.",
          status: "TODO"
        },
        {
          title: "Meal Prep for the Week",
          description: "Clean up and organize files on your computer, ensuring a more efficient and clutter-free digital workspace.",
          status: "TODO"
        },
      ];

      for (const task of tasks) {
        console.log("Here2")
        newTodo = await Todo.create({ title: task.title, description: task.description, userId: userId, status: task.status });
      }
}

module.exports = {
    createSampleTask
};