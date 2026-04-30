import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Grid,
  ThemeProvider,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  useGetJournalByIdQuery,
  useUpdateJournalMutation,
} from "../redux/api/journalApi";
import theme from "../components/Theme";

function JournalDetails() {
  const { id } = useParams();

  const { data } = useGetJournalByIdQuery(id);
  console.log("sss", data);

  const [updateJournal] = useUpdateJournalMutation();
  const [formData, setFormData] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    if (data) {
      setFormData(data.journal);
    }
  }, [data]);

  const selectedDate = useMemo(() => {
    if (!formData?.date) return null;
    const parsed = dayjs(formData.date, "YYYY-MM-DD", true);
    return parsed.isValid() ? parsed : null;
  }, [formData?.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateJournal({ id, ...formData }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Journal updated successfully",
      });
    } catch (err) {
      const serverMsg =
        err?.data?.message ||
        err?.error ||
        err?.message;
      setSnackbar({
        open: true,
        severity: "error",
        message: serverMsg || "Failed to update journal",
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
        >
          Edit Journal
        </Typography>

        {formData && (
          <>
            <Grid container spacing={2}>
              {/* Left Side: Title */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={inputStyle}
                />
              </Grid>
              {/* Right Side: Day and Date */}
              <Grid item xs={12} md={6} justifyContent="flex-end">
                <Grid container spacing={2}>
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
                            margin: "normal",
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
                      margin="normal"
                      sx={inputStyle}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <TextField
              label="How am I feeling today?"
              name="feelings"
              value={formData.content.feelings}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  content: { ...prev.content, feelings: e.target.value },
                }))
              }
              fullWidth
              margin="normal"
              multiline
              rows={3}
              sx={inputStyle}
            />
            <TextField
              label="Tody I am grateful for"
              name="gratitude"
              value={formData.content.gratitude}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  content: { ...prev.content, gratitude: e.target.value },
                }))
              }
              fullWidth
              margin="normal"
              multiline
              rows={3}
              sx={inputStyle}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Daily Affirmations"
                  name="affirmations"
                  value={formData.content.affirmations}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: {
                        ...prev.content,
                        affirmations: e.target.value,
                      },
                    }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: { ...prev.content, smiles: e.target.value },
                    }))
                  }
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
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  content: { ...prev.content, reminders: e.target.value },
                }))
              }
              fullWidth
              multiline
              rows={3}
              className="mt-2"
              sx={inputStyle}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{ marginTop: "16px" }}
            >
              Save Changes
            </Button>
          </>
        )}
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

export default JournalDetails;
