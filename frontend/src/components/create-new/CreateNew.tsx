import React, { ChangeEvent, FC } from "react";
import "./CreateNew.scss";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { BACKEND_URL } from "../../config/config";
import { EditForm } from "../interfaces/interfaces";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface CreateNewProps {
  showCreateBox: boolean;
  handleCreateBox: (x: boolean) => void;
  editForm: EditForm;
  handleEditForm: (id: string, title: string, description: string) => void;
  getAllTodos: () => void;
}

const CreateNew: FC<CreateNewProps> = ({
  showCreateBox,
  handleCreateBox,
  editForm,
  handleEditForm,
  getAllTodos,
}) => {
  // State to show success popup
  const [successModal, setSuccessModal] = React.useState(false);

  // State to hold form error
  const [todoErrors, setTodoErrors] = React.useState({
    title: "",
    description: "",
  });

  // Function to handle Edit Form while opening and closing
  const handleOpen = () => handleCreateBox(true);
  const handleClose = () => {
    handleEditForm("0", "", "");
    handleCreateBox(false);
  };

  // Form validation done here
  const validateForm = () => {
    let valid = true;
    const newErrors = { title: "", description: "" };

    if (editForm.title.length < 5 || editForm.title.length > 50) {
      newErrors.title = "Title must be between 5 and 50 characters";
      valid = false;
    }

    setTodoErrors(newErrors);
    return valid;
  };

  const handleInputFocus = () => setSuccessModal(false);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleEditForm(editForm.id, value, editForm.description);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleEditForm(editForm.id, editForm.title, value);
  };

  //Api to hit to create task.
  const handleCreateTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (validateForm()) {
      axios
        .post(
          `${BACKEND_URL}/todo/post`,
          {
            id: editForm.id,
            title: editForm.title,
            description: editForm.description,
          },
          { withCredentials: true }
        )
        .then(() => {
          getAllTodos();
          setSuccessModal(true);
        })
        .catch((error) => {
          console.error("Error while creating task:", error);
        });
    }
  };

  return (
    <div>
      <Box sx={{ "& button": { height: 53 } }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          size="large"
          startIcon={<AddIcon />}
        >
          Add Todo
        </Button>
      </Box>
      <Modal
        open={showCreateBox}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="inputForm">
            <Typography variant="h6" component="h2">
              Create a new task.
            </Typography>
            <TextField
              fullWidth
              label="Title*"
              id="fullWidth"
              defaultValue={editForm.title}
              onChange={handleTitleChange}
              error={!!todoErrors.title}
              helperText={todoErrors.title}
              onFocus={handleInputFocus}
            />
            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              fullWidth
              rows={4}
              defaultValue={editForm.description}
              onChange={handleDescriptionChange}
              error={!!todoErrors.description}
              helperText={todoErrors.description}
              onFocus={handleInputFocus}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateTask}
              startIcon={<AddIcon />}
            >
              {editForm.id != "0" ? "Modify" : "Create"}
            </Button>
            <Box sx={{ width: "100%" }}>
              <Collapse in={successModal}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        handleCreateBox(false);
                        setSuccessModal(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  Successfully Done. Close this window
                </Alert>
              </Collapse>
            </Box>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateNew;
