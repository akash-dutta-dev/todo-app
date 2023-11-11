import React, { FC } from "react";
import "./ToDoList.scss";
import axios from "axios";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { BACKEND_URL } from "../../config/config";
import { TodoItem, TodoList } from "../interfaces/interfaces";

interface TodoListProps {
  handleCreateBox: (x: boolean) => void;
  handleEditForm: (id: string, title: string, description: string) => void;
  todoList: TodoList;
  getAllTodos: () => void;
}

const ToDoList: FC<TodoListProps> = ({
  handleCreateBox,
  handleEditForm,
  todoList,
  getAllTodos,
}) => {
  // State to hold user category selection in radio button
  const [radioValue, setRadioValue] = React.useState("showAll");
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };

  // Function to handle status change
  const handleStatusChange = (id: string, status: string) => {
    axios
      .post(
        `${BACKEND_URL}/todo/updateStatus`,
        { id, status },
        { withCredentials: true }
      )
      .then(() => {
        getAllTodos();
      })
      .catch((error) => {
        console.error("API request error:", error);
      });
  };

  // Function to delete task
  const handleTaskDelete = (id: string) => {
    axios
      .post(`${BACKEND_URL}/todo/delete`, { id }, { withCredentials: true })
      .then(() => {
        getAllTodos();
      })
      .catch((error) => {
        console.error("API request error:", error);
      });
  };

  // Function to edit a task
  const handleTaskEdit = (item: TodoItem) => {
    handleEditForm(item.id, item.title, item.description);
    handleCreateBox(true);
  };

  // Get all todos when user land the first time.
  React.useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <>
      <div className="todoList">
        <div className="todoRadio">
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            defaultValue="showAll"
            name="row-radio-buttons-group"
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="showAll"
              control={<Radio />}
              label="Show All"
            />
            <FormControlLabel
              value="ongoing"
              control={<Radio />}
              label="Ongoing"
            />
            <FormControlLabel value="todo" control={<Radio />} label="Todo" />
            <FormControlLabel value="done" control={<Radio />} label="Done" />
          </RadioGroup>
        </div>
        {(radioValue === "showAll" || radioValue === "ongoing") &&
          todoList.ongoing.length > 0 && (
            <>
              <span className="todoListHeader">ONGOING</span>
              {todoList.ongoing.map((item: TodoItem, index: number) => (
                <div className="todoListItems ongoingItems" key={index}>
                  <div className="titleBar">
                    <div className="title">{item.title}</div>
                    <div className="icons">
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleTaskEdit(item)}
                      >
                        <EditNoteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleTaskDelete(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                  <div className="description">{item.description}</div>
                  <div className="status">
                    <span>Status: Ongoing</span>
                    <Box sx={{ "& button": { height: 25, borderRadius: 25 } }}>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={() => handleStatusChange(item.id, "DONE")}
                      >
                        Done
                      </Button>
                      &nbsp;&nbsp;
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleStatusChange(item.id, "TODO")}
                      >
                        Do Later
                      </Button>
                    </Box>
                  </div>
                </div>
              ))}
            </>
          )}
        {(radioValue === "showAll" || radioValue === "todo") &&
          todoList.todo.length > 0 && (
            <>
              <span className="todoListHeader">TODO</span>
              {todoList.todo.map((item: TodoItem, index: number) => (
                <div className="todoListItems ongoingItems" key={index}>
                  <div className="titleBar">
                    <div className="title">{item.title}</div>
                    <div className="icons">
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleTaskEdit(item)}
                      >
                        <EditNoteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleTaskDelete(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                  <div className="description">{item.description}</div>
                  <div className="status">
                    <span>Status: Not started</span>
                    <Box sx={{ "& button": { height: 25, borderRadius: 25 } }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleStatusChange(item.id, "ONGOING")}
                      >
                        Start
                      </Button>
                    </Box>
                  </div>
                </div>
              ))}
            </>
          )}
        {(radioValue === "showAll" || radioValue === "done") &&
          todoList.done.length > 0 && (
            <>
              <span className="todoListHeader">DONE</span>
              {todoList.done.map((item: TodoItem, index: number) => (
                <div className="todoListItems ongoingItems" key={index}>
                  <div className="titleBar">
                    <div className="title">{item.title}</div>
                    <div className="icons">
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleTaskEdit(item)}
                      >
                        <EditNoteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleTaskDelete(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                  <div className="description">{item.description}</div>
                  <div className="status">
                    <span>Status: Completed</span>
                    <Box sx={{ "& button": { height: 25, borderRadius: 25 } }}>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleStatusChange(item.id, "ONGOING")}
                      >
                        Start Again
                      </Button>
                    </Box>
                  </div>
                </div>
              ))}
            </>
          )}
      </div>
    </>
  );
};

export default ToDoList;
