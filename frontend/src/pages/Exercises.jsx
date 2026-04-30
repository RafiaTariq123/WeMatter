import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../components/Theme";
import { useSelector } from "react-redux";
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Stack, 
  Tabs, 
  Tab, 
  Paper
} from "@mui/material";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const recommendationConfig = {
  Normal: ["Mindfulness", "Self-Care"],
  Mild: ["Mindfulness", "Depression"],
  Moderate: ["Depression", "Mindfulness"],
  Severe: ["Depression", "Anxiety"],
  "Extremely Severe": ["Depression", "Anxiety", "Self-Care"]
};

const getSeverityFromScore = (score, fallback) => {
  const numericScore = Number.isFinite(score) ? score : Number(score);
  if (!Number.isFinite(numericScore)) return fallback || null;
  if (numericScore <= 9) return "Normal";
  if (numericScore <= 13) return "Mild";
  if (numericScore <= 20) return "Moderate";
  if (numericScore <= 27) return "Severe";
  return "Extremely Severe";
};

const buildRecommendedExercises = (exerciseCategories, severity) => {
  if (!severity) return [];
  const categoryNames = recommendationConfig[severity] || [];
  if (categoryNames.length === 0) return [];
  const selected = [];

  categoryNames.forEach((categoryName) => {
    const category = exerciseCategories.find((item) => item.name === categoryName);
    if (!category) return;
    category.exercises.forEach((exercise) => {
      if (!selected.some((item) => item.title === exercise.title)) {
        selected.push({ ...exercise, category: category.name });
      }
    });
  });

  return selected;
};

function ExerciseCard({ title, description, defaultSeconds = 300 }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);

  const handleStart = () => {
    if (seconds === 0) setSeconds(defaultSeconds);
    setRunning(true);
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setRunning(false);
    setSeconds(defaultSeconds);
  };

  return (
    <Card 
      elevation={1} 
      sx={{ 
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        pb: '16px !important'
      }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            color="primary.main" 
            fontWeight={600} 
            sx={{ 
              fontSize: "1.1rem",
              mb: 1,
              minHeight: '3em',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              minHeight: '4.5em',
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}
          >
            {description}
          </Typography>
        </Box>
        <Box sx={{ 
          mt: 'auto',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h5" color="primary.main" fontWeight={700}>
            {formatTime(seconds)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!running ? (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleStart}
                size="small"
              >
                Start
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handlePause}
                size="small"
              >
                Pause
              </Button>
            )}
            <Button 
              variant="text" 
              onClick={handleReset}
              size="small"
            >
              Reset
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function Exercises() {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user?._id;
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState("");

  const exerciseCategories = [
    {
      name: "All Exercises",
      description: "A collection of all available exercises to help you manage stress and improve mental well-being.",
      exercises: [
        {
          title: "Deep Breathing",
          description:
            "Breathe in slowly for 4 seconds, hold for 4, and exhale for 6–8 seconds. Repeat to calm the nervous system.",
          defaultSeconds: 180,
          category: "Relaxation"
        },
        {
          title: "Progressive Muscle Relaxation",
          description:
            "Tense each muscle group for 5 seconds and then release for 10 seconds, moving from toes to head.",
          defaultSeconds: 240,
          category: "Relaxation"
        },
        {
          title: "Mindful Pause",
          description:
            "Sit comfortably, focus on your breath, and gently bring attention back whenever the mind wanders.",
          defaultSeconds: 120,
          category: "Mindfulness"
        },
        {
          title: "Gratitude Reflection",
          description:
            "Think of three things you are grateful for today and why. Write a line for each if you like.",
          defaultSeconds: 150,
          category: "Mindfulness"
        },
        {
          title: "Behavioral Activation",
          description:
            "Choose one small, meaningful or enjoyable action (e.g., shower, brew tea, water a plant) and do it now.",
          defaultSeconds: 600,
          category: "Depression"
        },
        {
          title: "Self‑Compassion Break",
          description:
            "Place a hand on your chest, acknowledge 'this is hard,' and offer yourself kind words as you would to a friend.",
          defaultSeconds: 180,
          category: "Depression"
        },
        {
          title: "Thought Reframe (CBT)",
          description:
            "Write an unhelpful thought, list evidence for/against, and create a more balanced alternative.",
          defaultSeconds: 300,
          category: "Depression"
        },
        {
          title: "Reach Out",
          description:
            "Send a short message to someone supportive or schedule a 5‑minute call. Connection counters isolation.",
          defaultSeconds: 180,
          category: "Depression"
        },
        {
          title: "5-4-3-2-1 Grounding",
          description:
            "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
          defaultSeconds: 180,
          category: "Anxiety"
        },
        {
          title: "Positive Affirmations",
          description:
            "Repeat positive statements about yourself. Example: 'I am capable,' 'I am worthy of love and happiness.'",
          defaultSeconds: 120,
          category: "Self-Esteem"
        },
        {
          title: "Body Scan Meditation",
          description:
            "Slowly bring attention to each part of your body, noticing any sensations without judgment.",
          defaultSeconds: 300,
          category: "Mindfulness"
        },
      ]
    },
    {
      name: "Depression",
      description: "Exercises specifically designed to help manage symptoms of depression and improve mood.",
      exercises: [
        {
          title: "Behavioral Activation",
          description:
            "Choose one small, meaningful or enjoyable action (e.g., shower, brew tea, water a plant) and do it now.",
          defaultSeconds: 600,
        },
        {
          title: "Self‑Compassion Break",
          description:
            "Place a hand on your chest, acknowledge 'this is hard,' and offer yourself kind words as you would to a friend.",
          defaultSeconds: 180,
        },
        {
          title: "Thought Reframe (CBT)",
          description:
            "Write an unhelpful thought, list evidence for/against, and create a more balanced alternative.",
          defaultSeconds: 300,
        },
        {
          title: "Reach Out",
          description:
            "Send a short message to someone supportive or schedule a 5‑minute call. Connection counters isolation.",
          defaultSeconds: 180,
        },
        {
          title: "Pleasant Activity Scheduling",
          description:
            "Plan and schedule one enjoyable activity for today, no matter how small.",
          defaultSeconds: 180,
        },
        {
          title: "Accomplishment Log",
          description:
            "List 3 things you've accomplished today, no matter how small they may seem.",
          defaultSeconds: 120,
        },
      ]
    },
    {
      name: "Anxiety",
      description: "Techniques to help calm the mind and reduce feelings of anxiety and worry.",
      exercises: [
        {
          title: "5-4-3-2-1 Grounding",
          description:
            "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
          defaultSeconds: 180,
        },
        {
          title: "Box Breathing",
          description:
            "Breathe in for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat.",
          defaultSeconds: 240,
        },
        {
          title: "Progressive Muscle Relaxation",
          description:
            "Tense and relax each muscle group, moving from your toes to your head.",
          defaultSeconds: 300,
        }
      ]
    },
    {
      name: "Mindfulness",
      description: "Practices to help you stay present and focused on the current moment.",
      exercises: [
        {
          title: "Mindful Breathing",
          description:
            "Focus on your breath, noticing the sensation of air entering and leaving your body.",
          defaultSeconds: 180,
        },
        {
          title: "Body Scan",
          description:
            "Bring attention to each part of your body, noticing any sensations without judgment.",
          defaultSeconds: 300,
        },
        {
          title: "Mindful Eating",
          description:
            "Eat a small snack slowly, noticing the taste, texture, and sensations.",
          defaultSeconds: 180,
        }
      ]
    },
    {
      name: "Self-Care",
      description: "Activities to nurture your physical, emotional, and mental well-being.",
      exercises: [
        {
          title: "Digital Detox",
          description:
            "Take a 10-minute break from all screens and electronic devices.",
          defaultSeconds: 600,
        },
        {
          title: "Nature Break",
          description:
            "Spend a few minutes outside or by a window, observing nature.",
          defaultSeconds: 300,
        },
        {
          title: "Stretch Break",
          description:
            "Gently stretch your body, focusing on areas that feel tense or tight.",
          defaultSeconds: 180,
        }
      ]
    }
  ];

  useEffect(() => {
    if (!userId) {
      setLatestAssessment(null);
      setAssessmentError("");
      setAssessmentLoading(false);
      return;
    }

    let isMounted = true;
    const loadAssessment = async () => {
      setAssessmentLoading(true);
      setAssessmentError("");
      try {
        const res = await fetch(`http://localhost:8000/api/scores/user/${userId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || "Failed to load assessment history");
        }
        const latest = Array.isArray(data.data) && data.data.length > 0 ? data.data[0] : null;
        if (isMounted) setLatestAssessment(latest);
      } catch (err) {
        if (isMounted) setAssessmentError(err.message || "Failed to load assessment");
      } finally {
        if (isMounted) setAssessmentLoading(false);
      }
    };

    loadAssessment();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const currentCategory = exerciseCategories[activeTab];
  const resolvedSeverity = getSeverityFromScore(
    latestAssessment?.depressionScore,
    latestAssessment?.severity
  );
  const recommendedExercises = buildRecommendedExercises(
    exerciseCategories,
    resolvedSeverity
  ).slice(0, 6);
  const recommendedFocus = recommendationConfig[resolvedSeverity]?.join(", ") || "";

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" color="primary.main" fontWeight="bold" gutterBottom sx={{ fontSize: "1.8rem", mb: 1 }}>
          Mental Well-being Exercises
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '800px' }}>
          Choose from a variety of guided activities designed to support your mental health. 
          Use the timers to keep track of your practice.
        </Typography>

        <Box
          sx={{
            mb: 4,
            p: 2.5,
            borderRadius: 2,
            bgcolor: "rgba(0, 92, 101, 0.06)",
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <Typography variant="h6" color="primary.main" fontWeight={600} sx={{ mb: 0.5 }}>
            Recommended for you
          </Typography>
          {assessmentLoading && (
            <Typography variant="body2" color="text.secondary">
              Loading personalized recommendations...
            </Typography>
          )}
          {!assessmentLoading && assessmentError && (
            <Typography variant="body2" color="error">
              {assessmentError}
            </Typography>
          )}
          {!assessmentLoading && !assessmentError && !latestAssessment && (
            <Typography variant="body2" color="text.secondary">
              Complete the self-assessment to unlock personalized exercise recommendations.
            </Typography>
          )}
          {!assessmentLoading && !assessmentError && latestAssessment && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Based on your latest assessment (Score: {latestAssessment.depressionScore}, Severity: {resolvedSeverity}
                {recommendedFocus ? `, Focus: ${recommendedFocus}` : ""}).
              </Typography>
              {recommendedExercises.length > 0 ? (
                <Grid container spacing={3} sx={{ display: "flex" }}>
                  {recommendedExercises.map((exercise, idx) => (
                    <Grid item xs={12} md={6} lg={4} key={`${exercise.title}-${idx}`} sx={{ display: "flex" }}>
                      <ExerciseCard
                        title={exercise.title}
                        description={exercise.description}
                        defaultSeconds={exercise.defaultSeconds}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  We could not match your assessment to recommendations yet. Explore the exercises below.
                </Typography>
              )}
            </>
          )}
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {exerciseCategories.map((category, index) => (
              <Tab 
                key={index} 
                label={category.name} 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: activeTab === index ? 600 : 400,
                  minWidth: 'auto',
                  px: 2,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  },
                }} 
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" color="text.primary" sx={{ mb: 1, fontWeight: 500 }}>
            {currentCategory.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {currentCategory.description}
          </Typography>
          
          <Grid container spacing={3} sx={{ display: 'flex' }}>
            {currentCategory.exercises.map((ex, idx) => (
              <Grid item xs={12} md={6} lg={4} key={idx} sx={{ display: 'flex' }}>
                <ExerciseCard 
                  title={ex.title} 
                  description={ex.description} 
                  defaultSeconds={ex.defaultSeconds} 
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

export default Exercises;
