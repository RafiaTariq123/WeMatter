import { useMemo, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  ThemeProvider,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useCreateJournalMutation } from "../redux/api/journalApi";
import theme from "../components/Theme";
import { useSelector } from "react-redux";

function Journal() {

  const {user} = useSelector(state => state.auth);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const [formData, setFormData] = useState({
    date: "",
    day: "",
    title: "",
    category: "Personal",
    content: {
      feelings: "",
      gratitude: "",
      affirmations: "",
      smiles: "",
      reminders: "",
    },
    user: user.user._id
  });

  const [createJournal] = useCreateJournalMutation();

  const selectedDate = useMemo(() => {
    if (!formData.date) return null;
    const parsed = dayjs(formData.date, "YYYY-MM-DD", true);
    return parsed.isValid() ? parsed : null;
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      await createJournal({ ...formData, user: user.user._id }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Journal saved successfully",
      });
      setFormData({
        date: "",
        day: "",
        title: "",
        category: "Personal",
        content: {
          feelings: "",
          gratitude: "",
          affirmations: "",
          smiles: "",
          reminders: "",
        },
        user: user.user._id,
      });
    } catch (err) {
      const serverMsg =
        err?.data?.message ||
        err?.error ||
        err?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: serverMsg || "Failed to save journal",
      });
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "&:hover fieldset": {
        borderColor: "primary.dark",
      },
      "&.Mui-focused": {
        backgroundColor: "white",
      },
    },
    "& .MuiInputBase-input": {
      padding: "12px",
      backgroundColor: "white",
      "&:focus": {
        backgroundColor: "white",
      },
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0px 1000px white inset",
        backgroundColor: "white !important",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "15px",
      color: "primary.main",
    },
    paddingBottom: "10px",
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-white rounded-lg p-6 shadow">
        <Typography
          variant="h5"
          color="primary.main"
          fontWeight="bold"
          gutterBottom
          sx={{fontSize: "1.4rem"}}
        >
          Journal
        </Typography>
        {/* Layout for Title, Date, and Day */}
        <Grid
          container
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          {/* Title Field */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              autoFocus
              fullWidth
              className="mt-2"
              sx={inputStyle}
            />
          </Grid>

          {/* Date and Day Fields */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} sx={{ justifyContent: "flex-end" }}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={selectedDate}
                    onChange={(newValue) => {
                      const dateStr = newValue && newValue.isValid()
                        ? newValue.format("YYYY-MM-DD")
                        : "";
                      const dayStr = newValue && newValue.isValid()
                        ? newValue.format("dddd")
                        : "";
                      setFormData((prev) => ({
                        ...prev,
                        date: dateStr,
                        day: dayStr,
                      }));
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        className: "mt-2",
                        sx: inputStyle,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Day"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  fullWidth
                  className="mt-2"
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Feelings Field */}
        <TextField
          label="How am I feeling today?"
          name="feelings"
          value={formData.content.feelings}
          onChange={handleContentChange}
          fullWidth
          multiline
          rows={3}
          className="mt-2"
          sx={inputStyle}
        />

        <TextField
          label="Today I am grateful for"
          name="gratitude"
          value={formData.content.gratitude}
          onChange={handleContentChange}
          fullWidth
          multiline
          rows={3}
          className="mt-2"
          sx={inputStyle}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Daily Affirmations"
              name="affirmations"
              value={formData.content.affirmations}
              onChange={handleContentChange}
              fullWidth
              multiline
              rows={3}
              className="mt-2"
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Things that make me smile"
              name="smiles"
              value={formData.content.smiles}
              onChange={handleContentChange}
              fullWidth
              multiline
              rows={3}
              className="mt-2"
              sx={inputStyle}
            />
          </Grid>
        </Grid>

        <TextField
          label="Notes/Reminders"
          name="reminders"
          value={formData.content.reminders}
          onChange={handleContentChange}
          fullWidth
          multiline
          rows={3}
          className="mt-2"
          sx={inputStyle}
        />

        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className="mt-4"
        >
          Save Journal
        </Button>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Journal;
