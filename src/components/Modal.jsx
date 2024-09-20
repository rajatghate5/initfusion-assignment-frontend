import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleById, updateSchedule } from "../redux/scheduleSlice";

const ScheduleModal = ({ open, handleClose, Id }) => {
  const dispatch = useDispatch();
  const scheduleData = useSelector((state) => state.schedules.schedule) || {};

  const { control, reset, handleSubmit } = useForm({
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

  useEffect(() => {
    if (Id) {
      dispatch(fetchScheduleById(Id));
    }
  }, [Id, dispatch]);

  useEffect(() => {
    if (scheduleData) {
      reset({
        schoolName: scheduleData.schoolName || "",
        principalName: scheduleData.principalName || "",
        vicePrincipalName: scheduleData.vicePrincipalName || "",
        standard: scheduleData.standard || "",
        division: scheduleData.division || "",
        subjects: scheduleData.subjects || [],
      });
    }
  }, [scheduleData, reset]);

  console.log("scheduleData ===", scheduleData.subjects);
  const onSubmit = (data) => {
    // Transform subjects to the desired format
    const formattedSubjects = data.subjects.map((subject) => ({
      name: subject.name,
      lectures: daysOfWeek.map((day) => subject.lectures[day] || ""), 
    }));

    // Check if any subjects have empty lectures
    const hasEmptyLectures = formattedSubjects.some((subject) =>
      subject.lectures.some((lecture) => lecture === "")
    );

    // Use scheduleData.subjects if there are empty lectures
    const finalSubjects = hasEmptyLectures
      ? scheduleData.subjects
      : formattedSubjects;

    // Create the final data object
    const finalData = {
      id: Id, // Assuming Id is the correct ID for your data
      schoolName: data.schoolName,
      principalName: data.principalName,
      vicePrincipalName: data.vicePrincipalName,
      standard: data.standard,
      division: data.division,
      subjects: finalSubjects, // Use the final subjects based on the condition
      // You can add createdAt and updatedAt here if needed
    };

    dispatch(updateSchedule(finalData)); // Dispatch the formatted data
    handleClose();
    reset();
  };

  const handleAddSubject = () => {
    appendSubject({
      name: "",
      lectures: daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: "" }), {}),
    });
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
            Schedule Details
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {[
              "schoolName",
              "principalName",
              "vicePrincipalName",
              "standard",
              "division",
            ].map((field) => (
              <Controller
                key={field}
                name={field}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    label={
                      controllerField.name.charAt(0).toUpperCase() +
                      controllerField.name.slice(1).replace(/([A-Z])/g, " ")
                    }
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    {...controllerField} // Spread the properties correctly
                  />
                )}
              />
            ))}

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
                {scheduleData?.subjects?.map((subject, subjectIndex) => (
                  <Box key={subject.name} mb={2}>
                    <Typography variant="h6">{subject.name}</Typography>
                    {daysOfWeek.map((day, dayIndex) => (
                      <Box key={day} mb={1}>
                        <Typography variant="subtitle2">{day}</Typography>
                        <Controller
                          name={`subjects[${subjectIndex}].lectures.${day}`}
                          control={control}
                          defaultValue={subject.lectures[dayIndex] || ""} // Set default value
                          render={({ field }) => {
                            return (
                              <FormControl fullWidth margin="normal">
                                <InputLabel>Lecture Time</InputLabel>
                                <Select {...field}>
                                  <MenuItem value="">Select Time</MenuItem>
                                  {timeSlots.map((time) => (
                                    <MenuItem key={time} value={time}>
                                      {time}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            );
                          }}
                        />
                      </Box>
                    ))}
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
              className="mt-2"
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
              Update Schedule
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleModal;
