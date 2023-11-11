const express = require('express');
const router = express.Router();
const {Todo} = require("../models");
const { TODO_STATUS } = require('../config/constant');

// API to create a new todo
router.post("/post", async (req, res) => {
    const { id, title, description } = req.body;
    const userId = req.session.user.id;

    try {
        // If title is not provided then it will be an invalid requests.
        if (!title){
            return res.status(400).json({message:"Need to provide title"})
        }
        let newTodo;

        // If id already exist then update the existing one else create a new one.
        if(id){
            newTodo = await Todo.update({title: title, description: description}, { where: { id } })
        }
        else{
            newTodo = await Todo.create({ title: title, description: description, userId: userId, status: TODO_STATUS.TODO });
        }
        res.status(200).json({ message: "Post Submitted Succesfully", todoDetails: newTodo });
    } catch (error) {
        // Handled errors incase of any failure and return 500
        console.log(error)
        res.status(500).send(error)
    }
});

// Get API to return all the tasks for a given user.
router.get("/getAllTodos", async (req, res) => {
    try {
        const userId = req.session.user.id;

        const todoRow = await Todo.findAll({ where: { userId: userId } , order: [['updatedAt', 'DESC']]});
        const resp = {
            ongoing: [],
            todo: [],
            done: []
        };
        for (const todo of todoRow) {
            if (todo.status === TODO_STATUS.ONGOING) resp.ongoing.push(todo);
            else if (todo.status === TODO_STATUS.TODO) resp.todo.push(todo);
            else resp.done.push(todo);
        }
        res.status(200).json(resp);
    } catch (error) {
        // Handled errors incase of any failure and return 500
        console.log(error)
        res.status(500).send(error)
    }
});

// Get API to update task status
router.post("/updateStatus", async (req, res) => {
    const { id, status } = req.body;
    try {
        const todoRow = await Todo.update(
            { status },
            { where: { id } }
        )
        res.status(200).json(todoRow);
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
});

// Get API to delete task.
router.post("/delete", async (req, res) => {
    const { id } = req.body;
    try {
        const numberOfRowsDeleted = await Todo.destroy({
            where: { id }
        });
        if (numberOfRowsDeleted > 0) {
            res.status(200).json({ message: 'Successfully deleted.' });
        } else {
            res.status(404).json({ message: 'No rows were deleted.' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
});

module.exports = router;