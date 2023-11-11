import "./SearchBar.scss";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { FC } from "react";
import { TodoItem, TodoList } from "../interfaces/interfaces";

interface SearchBarProps {
  todoList: TodoList;
}

const SearchBar: FC<SearchBarProps> = ({ todoList }) => {
  const todoListCombined = [].concat(...Object.values(todoList));

  return (
    <>
      <Stack spacing={2} sx={{ width: 300 }}>
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={todoListCombined.map((option: TodoItem) => option.title)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search task"
              InputProps={{
                ...params.InputProps,
                type: "search",
              }}
            />
          )}
        />
      </Stack>
    </>
  );
};

export default SearchBar;
