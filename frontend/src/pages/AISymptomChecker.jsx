import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Fade,
  Slide
} from '@mui/material';
import {
  Send as SendIcon,
  HealthAndSafety as HealthIcon,
  ExpandMore as ExpandMoreIcon,
  LocalHospital as HospitalIcon,
  Psychology as PsychologyIcon,
  Medication as MedicationIcon,
  Healing as HealingIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Emergency as EmergencyIcon,
  Refresh as RefreshIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { getSymptomCheckerResponse } from '../services/symptomChecker.service';

const AISymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      setError('Please describe your symptoms');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);
    setActiveStep(1);

    try {
      const response = await getSymptomCheckerResponse({
        symptoms,
        duration,
        severity,
        additionalInfo
      });

      setAnalysis(response.data);
      setActiveStep(2);
    } catch (err) {
      setError('Unable to analyze symptoms. Please try again.');
      console.error('Symptom checker error:', err);
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms('');
    setDuration('');
    setSeverity('');
    setAdditionalInfo('');
    setAnalysis(null);
    setError('');
    setActiveStep(0);
  };

  const commonSymptoms = [
    { name: 'Headache', description: 'Persistent or sudden head pain' },
    { name: 'Fever', description: 'Elevated body temperature' },
    { name: 'Cough', description: 'Persistent coughing' },
    { name: 'Fatigue', description: 'Unusual tiredness or exhaustion' },
    { name: 'Nausea', description: 'Feeling sick to your stomach' },
    { name: 'Dizziness', description: 'Feeling lightheaded or unsteady' },
    { name: 'Chest Pain', description: 'Discomfort or pain in chest area' },
    { name: 'Shortness of Breath', description: 'Difficulty breathing' },
    { name: 'Stomach Pain', description: 'Abdominal discomfort or pain' }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={6}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: '#0369a1',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 4px 20px rgba(3, 105, 161, 0.15)'
              }}
            >
              <HealthIcon sx={{ fontSize: 32, color: '#ffffff' }} />
            </Avatar>
            
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 300,
                color: '#000000',
                mb: 2,
                letterSpacing: '-0.5px'
              }}
            >
              AI Symptom Checker
            </Typography>
            
            <Typography 
              variant="h6" 
              color="#0369a1" 
              paragraph
              sx={{ 
                maxWidth: 600, 
                mx: 'auto', 
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Intelligent symptom analysis powered by advanced AI to help you understand your health better
            </Typography>
          </Box>
        </Fade>
        <Slide in timeout={600} direction="down">
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              bgcolor: '#fef3c7',
              color: '#92400e',
              border: '1px solid #f59e0b',
              '& .MuiAlert-icon': { color: '#d97706' }
            }}
            icon={<EmergencyIcon />}
          >
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5 }}>
              Important Medical Disclaimer
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              This AI symptom checker is for informational purposes only and is not a substitute for professional medical advice. Always consult with a healthcare provider for medical concerns.
            </Typography>
          </Alert>
        </Slide>

        <Grid container spacing={4}>
          {/* Input Form */}
          <Grid item xs={12} lg={6}>
            <Slide in timeout={800} direction="right">
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  borderRadius: 3,
                  bgcolor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar sx={{ bgcolor: '#f0f9ff', mr: 3 }}>
                    <HealingIcon sx={{ color: '#0369a1' }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight="400" color="#000000">
                    Tell Us About Your Symptoms
                  </Typography>
                </Box>
                
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="What symptoms are you experiencing?"
                    multiline
                    rows={4}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe your symptoms in detail..."
                    required
                    sx={{ 
                      mb: 3,
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                          border: '1px solid #cbd5e1'
                        },
                        '&.Mui-focused': {
                          border: '1px solid #14b8a6',
                          bgcolor: '#ffffff'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#374151',
                        bgcolor: 'transparent',
                        '&.Mui-focused': {
                          color: '#14b8a6',
                          bgcolor: '#ffffff',
                          padding: '0 4px'
                        }
                      }
                    }}
                  />

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g., 2 days, 1 week..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            '&:hover': {
                              border: '1px solid #cbd5e1'
                            },
                            '&.Mui-focused': {
                              border: '1px solid #1e293b',
                              bgcolor: '#ffffff'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#64748b',
                            bgcolor: 'transparent',
                            '&.Mui-focused': {
                              color: '#1e293b',
                              bgcolor: '#ffffff',
                              padding: '0 4px'
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Severity (1-10)"
                        type="number"
                        inputProps={{ min: 1, max: 10 }}
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        placeholder="Rate from 1 to 10"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            '&:hover': {
                              border: '1px solid #cbd5e1'
                            },
                            '&.Mui-focused': {
                              border: '1px solid #1e293b',
                              bgcolor: '#ffffff'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#64748b',
                            bgcolor: 'transparent',
                            '&.Mui-focused': {
                              color: '#1e293b',
                              bgcolor: '#ffffff',
                              padding: '0 4px'
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Severity Visual Indicator */}
                  {severity && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
                        Severity Level: {severity}/10
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(severity / 10) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#f1f5f9',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: `linear-gradient(90deg, ${severity <= 3 ? '#10b981' : severity <= 6 ? '#f59e0b' : severity <= 8 ? '#f97316' : '#ef4444'}, ${severity <= 3 ? '#34d399' : severity <= 6 ? '#fbbf24' : severity <= 8 ? '#fb923c' : '#f87171'})`
                          }
                        }}
                      />
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    label="Additional Information"
                    multiline
                    rows={3}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Any other relevant information..."
                    sx={{ 
                      mb: 4,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                          border: '1px solid #cbd5e1'
                        },
                        '&.Mui-focused': {
                          border: '1px solid #14b8a6',
                          bgcolor: '#ffffff'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#374151',
                        bgcolor: 'transparent',
                        '&.Mui-focused': {
                          color: '#14b8a6',
                          bgcolor: '#ffffff',
                          padding: '0 4px'
                        }
                      }
                    }}
                  />

                  {/* Quick Symptom Chips */}
                  <Typography variant="subtitle2" sx={{ color: '#0369a1', mb: 2, fontWeight: 500 }}>
                    Common Symptoms
                  </Typography>
                  <Box sx={{ mb: 4, flexWrap: 'wrap', gap: 1, display: 'flex' }}>
                    {commonSymptoms.map((symptom) => (
                      <Chip
                        key={symptom.name}
                        label={symptom.name}
                        title={symptom.description}
                        variant="outlined"
                        size="small"
                        clickable
                        onClick={() => setSymptoms(prev => 
                          prev ? `${prev}, ${symptom.name}` : symptom.name
                        )}
                        sx={{
                          borderColor: '#14b8a6',
                          color: '#374151',
                          bgcolor: '#ffffff',
                          fontSize: '0.875rem',
                          '&:hover': {
                            bgcolor: '#f0f9ff',
                            borderColor: '#0369a1',
                            transform: 'translateY(-1px)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                      sx={{ 
                        py: 2,
                        borderRadius: 2,
                        fontSize: 16,
                        fontWeight: 500,
                        bgcolor: '#0369a1',
                        color: '#ffffff',
                        '&:hover': {
                          bgcolor: '#0284c7',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(30, 41, 59, 0.15)'
                        },
                        '&:disabled': {
                          bgcolor: '#94a3b8',
                          color: '#ffffff'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                    </Button>
                    <Tooltip title="Reset Form">
                      <IconButton
                        onClick={handleReset}
                        disabled={loading}
                        sx={{
                          bgcolor: '#f0f9ff',
                          color: '#0369a1',
                          '&:hover': {
                            bgcolor: '#e0f2fe',
                            color: '#0284c7',
                            transform: 'rotate(180deg)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </form>
              </Paper>
            </Slide>
          </Grid>

          {/* Results Section */}
          <Grid item xs={12} lg={6}>
            {error && (
              <Fade in timeout={300}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {loading && (
              <Fade in timeout={300}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4,
                    borderRadius: 3,
                    bgcolor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center'
                  }}
                >
                  <CircularProgress size={48} thickness={4} sx={{ color: '#14b8a6', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#000000', fontWeight: 400, mb: 1 }}>
                    Analyzing Your Symptoms
                  </Typography>
                  <Typography variant="body2" color="#14b8a6">
                    Our AI is processing your information...
                  </Typography>
                </Paper>
              </Fade>
            )}

            {analysis && (
              <Slide in timeout={600} direction="left">
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4,
                    borderRadius: 3,
                    bgcolor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ bgcolor: '#f0f9ff', mr: 3 }}>
                      <CheckIcon sx={{ color: '#0369a1' }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight="400" color="#000000">
                      Analysis Complete
                    </Typography>
                  </Box>

                  {/* Possible Conditions */}
                  {analysis.possibleConditions && (
                    <Accordion 
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                          bgcolor: '#f1f5f9'
                        }
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon sx={{ color: '#14b8a6' }} />}
                        sx={{ 
                          borderRadius: 2,
                          '&:hover': { bgcolor: 'transparent' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#f0f9ff', width: 36, height: 36 }}>
                            <HospitalIcon sx={{ fontSize: 20, color: '#0369a1' }} />
                          </Avatar>
                          <Typography variant="h6" fontWeight="400" color="#000000">
                            Possible Conditions
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0 }}>
                        <Typography 
                          component="div" 
                          sx={{ 
                            lineHeight: 1.6,
                            color: '#374151',
                            '& p': { mb: 2 },
                            '& ul': { pl: 2 },
                            '& li': { mb: 1 }
                          }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: analysis.possibleConditions }} />
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* Severity Assessment */}
                  {analysis.severityAssessment && (
                    <Accordion 
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                          bgcolor: '#f1f5f9'
                        }
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon sx={{ color: '#14b8a6' }} />}
                        sx={{ 
                          borderRadius: 2,
                          '&:hover': { bgcolor: 'transparent' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#fef3c7', width: 36, height: 36 }}>
                            <PsychologyIcon sx={{ fontSize: 20, color: '#d97706' }} />
                          </Avatar>
                          <Typography variant="h6" fontWeight="400" color="#000000">
                            Severity Assessment
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0 }}>
                        <Typography 
                          component="div"
                          sx={{ 
                            lineHeight: 1.6,
                            color: '#374151',
                            '& p': { mb: 2 },
                            '& ul': { pl: 2 },
                            '& li': { mb: 1 }
                          }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: analysis.severityAssessment }} />
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* Recommendations */}
                  {analysis.recommendations && (
                    <Accordion 
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                          bgcolor: '#f1f5f9'
                        }
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon sx={{ color: '#14b8a6' }} />}
                        sx={{ 
                          borderRadius: 2,
                          '&:hover': { bgcolor: 'transparent' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#f0f9ff', width: 36, height: 36 }}>
                            <MedicationIcon sx={{ fontSize: 20, color: '#0369a1' }} />
                          </Avatar>
                          <Typography variant="h6" fontWeight="400" color="#000000">
                            Recommendations
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0 }}>
                        <Typography 
                          component="div"
                          sx={{ 
                            lineHeight: 1.6,
                            color: '#374151',
                            '& p': { mb: 2 },
                            '& ul': { pl: 2 },
                            '& li': { mb: 1 }
                          }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: analysis.recommendations }} />
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* When to Seek Care */}
                  {analysis.whenToSeekCare && (
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: '#f0f9ff',
                        color: '#0c4a6e',
                        border: '1px solid #7dd3fc',
                        '& .MuiAlert-icon': { color: '#0284c7' }
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        When to Seek Medical Care
                      </Typography>
                      <Typography 
                        component="div" 
                        variant="body2"
                        sx={{ 
                          lineHeight: 1.6,
                          '& p': { mb: 2 },
                          '& ul': { pl: 2 },
                          '& li': { mb: 1 }
                        }}
                      >
                        <div dangerouslySetInnerHTML={{ __html: analysis.whenToSeekCare }} />
                      </Typography>
                    </Alert>
                  )}

                  <Divider sx={{ my: 3, borderColor: '#e2e8f0' }} />
                  
                  <Alert 
                    severity="warning" 
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: '#fef3c7',
                      color: '#92400e',
                      border: '1px solid #f59e0b',
                      '& .MuiAlert-icon': { color: '#d97706' }
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5 }}>
                      Medical Disclaimer
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                      This analysis is for informational purposes only and does not replace professional medical advice. Always consult a healthcare provider for medical concerns.
                    </Typography>
                  </Alert>
                </Paper>
              </Slide>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AISymptomChecker;
