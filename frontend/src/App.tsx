import SearchBar from "./components/search-bar/SearchBar";
import CreateNew from "./components/create-new/CreateNew";
import ToDoList from "./components/to-do-list/ToDoList";
import Login from "./components/login/Login";

import React from "react";
import axios from "axios";
import { BACKEND_URL } from "./config/config";
import { EditForm, TodoList } from "./components/interfaces/interfaces";

function App() {
  // State to maintain user logged in status
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  //State to switch Create Box (Form to create task) on/off
  const [showCreateBox, setCreateBox] = React.useState(false);
  const handleCreateBox = (newValue: boolean) => {
    setCreateBox(newValue);
  };

  // State to hold form data
  const [editForm, setEditForm] = React.useState<EditForm>({
    id: "0",
    title: "",
    description: "",
  });
  const handleEditForm = (id: string, title: string, description: string) => {
    setEditForm(() => ({ id, title, description }));
  };

  /* State to hold all the todos
    It is further classified ad 
    Ongoing: Task currently user is working on
    Todo: Tasks to do later
    Done: Completed Tasks */
  const [todoList, setTodoList] = React.useState<TodoList>({
    ongoing: [],
    todo: [],
    done: [],
  });

  // Function to fetch all the tasks with authentication
  const getAllTodos = () => {
    axios
      .get(`${BACKEND_URL}/todo/getAllTodos`, { withCredentials: true })
      .then((_res) => {
        setTodoList(() => ({
          ongoing: _res.data.ongoing,
          todo: _res.data.todo,
          done: _res.data.done,
        }));
      })
      .catch((error) => {
        console.error("API request error:", error);
      });
  };

  // When user lands check if user already logged in or not, else show login box.
  React.useEffect(() => {
    axios
      .get(`${BACKEND_URL}/user/isLoggedIn`, { withCredentials: true })
      .then((response) => {
        setUserLoggedIn(response.data.loggedIn);
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  }, []);

  return (
    <>
      {/* If user is not loggedin show the login form */}
      {!userLoggedIn && (
        <Login
          show={!userLoggedIn}
          onHide={() => {
            setUserLoggedIn(true);
          }}
        />
      )}

      <div className="container">
        <div className="searchBox">
          <SearchBar todoList={todoList} />
          <CreateNew
            showCreateBox={showCreateBox}
            handleCreateBox={handleCreateBox}
            editForm={editForm}
            handleEditForm={handleEditForm}
            getAllTodos={getAllTodos}
          />
        </div>

        <ToDoList
          handleCreateBox={handleCreateBox}
          handleEditForm={handleEditForm}
          todoList={todoList}
          getAllTodos={getAllTodos}
        />
      </div>
    </>
  );
}

export default App;
