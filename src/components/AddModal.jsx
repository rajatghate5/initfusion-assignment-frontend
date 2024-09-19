import React from "react";
import {
  Modal,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { subjectsList, daysOfWeek, timeSlots } from "../constants";

const AddModal = ({ open, handleClose, handleAdd }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      schoolName: "",
      principalName: "",
      vicePrincipalName: "",
      standard: "",
      division: "",
      subjects: [],
    },
  });

  const {
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control,
    name: "subjects",
  });

  const handleAddSubject = () => {
    appendSubject({
      name: "",
      lectures: daysOfWeek.map(() => ""),
    });
  };

  const onSubmit = (data) => {
    const transformedData = {
      schoolName: data.schoolName,
      principalName: data.principalName,
      vicePrincipalName: data.vicePrincipalName,
      standard: data.standard,
      division: data.division,
      subjects: data.subjects.map((subject) => ({
        name: subject.name,
        lectures: daysOfWeek.map((day) => subject.lectures[day] || ""),
      })),
    };

    handleAdd(transformedData); // Dispatch add with transformed data
    handleClose(); // Close the modal
    reset(); // Reset the form
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="flex items-center justify-center h-full">
        <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-md w-full border overflow-y-auto max-h-[80vh]">
          <IconButton
            onClick={handleClose}
            edge="end"
            color="inherit"
            aria-label="close"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" className="mb-4 uppercase">
            Add Schedule
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="schoolName"
              control={control}
              render={({ field }) => (
                <TextField
                  label="School Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...field}
                />
              )}
            />
            <Controller
              name="principalName"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Principal Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...field}
                />
              )}
            />
            <Controller
              name="vicePrincipalName"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Vice Principal Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...field}
                />
              )}
            />
            <Controller
              name="standard"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Standard"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...field}
                />
              )}
            />
            <Controller
              name="division"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Division"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...field}
                />
              )}
            />

            {/* Subjects Section */}
            <Typography variant="h6" className="mt-4 mb-2">
              Subjects
            </Typography>
            {subjectFields.map((subject, index) => (
              <Box key={subject.id} mb={2}>
                <Typography variant="subtitle1">Subject {index + 1}</Typography>
                <Controller
                  name={`subjects[${index}].name`}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Subject Name</InputLabel>
                      <Select {...field}>
                        <MenuItem value="">Select Subject</MenuItem>
                        {subjectsList.map((subj) => (
                          <MenuItem key={subj} value={subj}>
                            {subj}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {daysOfWeek.map((day) => (
                  <Box key={day} mb={1}>
                    <Typography variant="subtitle2">{day}</Typography>
                    <Controller
                      name={`subjects[${index}].lectures.${day}`}
                      control={control}
                      defaultValue={subject.lectures[day] || ""}
                      render={({ field }) => (
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Time Slot</InputLabel>
                          <Select {...field}>
                            <MenuItem value="">Select Time Slot</MenuItem>
                            {timeSlots.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>
                ))}
                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  onClick={() => removeSubject(index)}
                >
                  Remove Subject
                </Button>
              </Box>
            ))}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={handleAddSubject}
              sx={{ marginBottom: 5 }}
            >
              Add Subject
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mt-4"
            >
              Add
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddModal;
