import React, { useMemo } from "react";
import { Card, CardContent, Typography, Box, Chip, Skeleton } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { useGetMoodHistoryQuery } from "../redux/api/journalApi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const moodChipColor = (label) => {
  if (label === "Very Positive") return "success";
  if (label === "Positive") return "success";
  if (label === "Negative") return "warning";
  if (label === "Very Negative") return "error";
  return "info";
};

const moodTip = (label) => {
  if (label === "Very Positive") return "Keep the momentum. Try journaling one win you want to repeat tomorrow.";
  if (label === "Positive") return "You are trending well. Consider a short gratitude reflection tonight.";
  if (label === "Negative") return "Try a 5 minute grounding exercise and one small self-care action today.";
  if (label === "Very Negative") return "Slow down and prioritize rest. Reach out to a trusted person if needed.";
  return "Aim for one simple activity that helps you feel steady today.";
};

const formatLabel = (entry) => {
  if (entry?.date) return entry.date;
  if (entry?.createdAt) return new Date(entry.createdAt).toLocaleDateString();
  return "";
};

const MoodTracker = ({ userId }) => {
  const { data, isLoading, error } = useGetMoodHistoryQuery(userId, {
    skip: !userId
  });

  const entries = data?.entries || [];
  const latest = entries[entries.length - 1];

  const chartData = useMemo(() => {
    return {
      labels: entries.map(formatLabel),
      datasets: [
        {
          label: "Mood Score",
          data: entries.map((entry) => entry?.moodAnalysis?.score ?? 0),
          borderColor: "#005c65",
          backgroundColor: "rgba(0, 92, 101, 0.2)",
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: "#005c65"
        }
      ]
    };
  }, [entries]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `Mood score: ${context.parsed.y}`
          }
        }
      },
      scales: {
        y: {
          min: -5,
          max: 5,
          ticks: {
            stepSize: 1
          }
        }
      }
    };
  }, []);

  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
        mb: 3
      }}
    >
      <CardContent>
        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 600, mb: 2 }}>
          Mood Tracker
        </Typography>

        {isLoading && (
          <Box>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        )}

        {!isLoading && error && (
          <Typography color="error">Unable to load mood insights.</Typography>
        )}

        {!isLoading && !error && entries.length === 0 && (
          <Typography color="text.secondary">
            Write a journal entry to unlock your mood insights.
          </Typography>
        )}

        {!isLoading && !error && entries.length > 0 && (
          <Box>
            <Box sx={{ height: 220, mb: 2 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center", mb: 2 }}>
              <Chip
                label={latest?.moodAnalysis?.label || "Neutral"}
                color={moodChipColor(latest?.moodAnalysis?.label || "Neutral")}
              />
              <Typography variant="body2" color="text.secondary">
                Dominant emotion: {latest?.moodAnalysis?.dominantEmotion || "neutral"}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Tip
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {moodTip(latest?.moodAnalysis?.label || "Neutral")}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {(latest?.moodAnalysis?.keywords || []).length > 0 ? (
                latest.moodAnalysis.keywords.map((keyword) => (
                  <Chip key={keyword} label={keyword} variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No strong mood keywords detected yet.
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
