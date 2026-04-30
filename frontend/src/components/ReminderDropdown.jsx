import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Badge,
  IconButton as MuiIconButton,
  Collapse,
  Tooltip
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Check if notifications are supported and request permission
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') {
    console.log('Notifications are blocked by the user');
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Format date to display in the list
const formatDateTime = (dateString, timeString) => {
  const date = new Date(`${dateString}T${timeString}`);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function ReminderDropdown() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNewReminder, setShowNewReminder] = useState(false);
  const [reminderType, setReminderType] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');
  const [reminders, setReminders] = useState(() => {
    // Load reminders from localStorage if available
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [expanded, setExpanded] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const notificationCheckInterval = useRef(null);

  // Request notification permission on component mount
  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await requestNotificationPermission();
      setHasNotificationPermission(hasPermission);
    };
    checkPermission();

    // Set up interval to check for upcoming reminders
    notificationCheckInterval.current = setInterval(checkUpcomingReminders, 60000); // Check every minute
    
    // Initial check
    checkUpcomingReminders();

    // Clean up interval on unmount
    return () => {
      if (notificationCheckInterval.current) {
        clearInterval(notificationCheckInterval.current);
      }
    };
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Check for upcoming reminders and show notifications
  const checkUpcomingReminders = () => {
    if (!hasNotificationPermission) return;

    const now = new Date();
    const in15Minutes = new Date(now.getTime() + 15 * 60000);

    reminders.forEach(reminder => {
      const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
      
      // Check if reminder is within the next 15 minutes and not yet notified
      if (
        reminderDateTime > now && 
        reminderDateTime <= in15Minutes && 
        !reminder.notified
      ) {
        // Show notification
        if (Notification.permission === 'granted') {
          new Notification(`Reminder: ${reminder.title}`, {
            body: reminder.description || 'Time for your scheduled activity!',
            icon: reminder.type === 'exercise' ? '/exercise-icon.png' : '/appointment-icon.png',
          });
        }

        // Mark as notified
        setReminders(prevReminders => 
          prevReminders.map(r => 
            r.id === reminder.id 
              ? { ...r, notified: true } 
              : r
          )
        );
      }
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowNewReminder(false);
    setReminderType('');
  };

  const handleNewReminder = (type) => {
    setReminderType(type);
    setShowNewReminder(true);
  };

  const handleSaveReminder = () => {
    if (!reminderTitle || !reminderDate || !reminderTime) return;

    const newReminder = {
      id: Date.now().toString(),
      type: reminderType,
      title: reminderTitle,
      description: reminderDescription,
      date: reminderDate,
      time: reminderTime,
      createdAt: new Date().toISOString(),
      notified: false
    };

    setReminders(prevReminders => [...prevReminders, newReminder]);
    
    // Reset form
    setReminderTitle('');
    setReminderDescription('');
    setReminderDate('');
    setReminderTime('');
    setShowNewReminder(false);
    setReminderType('');
    
    // Show success message
    if (hasNotificationPermission) {
      new Notification('Reminder Set', {
        body: `Your ${reminderType} reminder has been set for ${formatDateTime(reminderDate, reminderTime)}`,
      });
    }
  };

  const handleDeleteReminder = (id, e) => {
    e.stopPropagation();
    setReminders(prevReminders => prevReminders.filter(r => r.id !== id));
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Tooltip title="Reminders">
        <IconButton 
          onClick={handleClick}
          sx={{
            '&:hover': { 
              backgroundColor: 'primary.light',
              '& .MuiSvgIcon-root': {
                color: 'primary.main',
              },
            },
            position: 'relative'
          }}
        >
          <Badge 
            badgeContent={reminders.filter(r => !r.notified).length} 
            color="error"
            overlap="circular"
            invisible={reminders.filter(r => !r.notified).length === 0}
          >
            <NotificationsNoneIcon color="grey.main" />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            minWidth: 300,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box>
          {!showNewReminder ? (
            <Box>
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Reminders
                </Typography>
              </Box>
              
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => handleNewReminder('exercise')}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                >
                  New Exercise Reminder
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => handleNewReminder('appointment')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  New Appointment Reminder
                </Button>
              </Box>
              
              <Divider />
              
              {reminders.length === 0 ? (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No upcoming reminders
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <List dense>
                    {reminders
                      .sort((a, b) => {
                        const dateA = new Date(`${a.date}T${a.time}`);
                        const dateB = new Date(`${b.date}T${b.time}`);
                        return dateA - dateB;
                      })
                      .map((reminder) => (
                        <React.Fragment key={reminder.id}>
                          <ListItem 
                            sx={{
                              borderLeft: `3px solid ${reminder.type === 'exercise' ? theme.palette.primary.main : theme.palette.secondary.main}`,
                              mb: 0.5,
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                              },
                              paddingRight: theme.spacing(6), // Make room for the delete button
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {reminder.type === 'exercise' ? (
                                <FitnessCenterIcon color="primary" />
                              ) : (
                                <EventAvailableIcon color="secondary" />
                              )}
                            </ListItemIcon>
                            <ListItemText 
                              primary={reminder.title} 
                              secondary={formatDateTime(reminder.date, reminder.time)}
                              primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: 'medium',
                              }}
                              secondaryTypographyProps={{
                                variant: 'caption',
                                color: 'text.secondary'
                              }}
                            />
                            <ListItemSecondaryAction>
                              <MuiIconButton 
                                edge="end" 
                                size="small"
                                onClick={(e) => handleDeleteReminder(reminder.id, e)}
                                sx={{ color: 'error.light' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </MuiIconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {reminder.description && (
                            <Box sx={{ pl: 6, pr: 2, pb: 1, pt: 0 }}>
                              <Typography variant="caption" color="text.secondary">
                                {reminder.description}
                              </Typography>
                            </Box>
                          )}
                        </React.Fragment>
                      ))}
                  </List>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 2, width: 350 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                New {reminderType === 'exercise' ? 'Exercise' : 'Appointment'} Reminder
              </Typography>
              
              <TextField
                fullWidth
                label="Title"
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                margin="normal"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {reminderType === 'exercise' ? (
                        <FitnessCenterIcon color="primary" />
                      ) : (
                        <LocalHospitalIcon color="primary" />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
                <TextField
                  label="Date"
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  label="Time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Description (Optional)"
                value={reminderDescription}
                onChange={(e) => setReminderDescription(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                size="small"
              />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                  onClick={() => setShowNewReminder(false)}
                  color="inherit"
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSaveReminder}
                  disabled={!reminderTitle || !reminderDate || !reminderTime}
                  color="primary"
                >
                  Save Reminder
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Menu>
    </div>
  );
}
