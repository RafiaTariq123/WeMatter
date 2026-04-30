import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Phone as PhoneIcon,
  PhoneDisabled as PhoneDisabledIcon
} from '@mui/icons-material';
import WebRTCService from '../utils/webrtc';

const VideoCallModal = ({ 
  open, 
  onClose, 
  remoteUser, 
  currentUser, 
  socket, 
  isVideoCall = true,
  isIncomingCall = false,
  offerData = null
}) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [isCallRejected, setIsCallRejected] = useState(false);
  const [webrtcService, setWebrtcService] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (open && socket && remoteUser && currentUser) {
      initializeCall();
    }
    
    return () => {
      if (webrtcService) {
        webrtcService.cleanup();
      }
    };
  }, [open, socket, remoteUser, currentUser]);

  const initializeCall = async () => {
    try {
      const rtcService = new WebRTCService(socket);
      
      rtcService.onRemoteStream = (stream) => {
        setRemoteStream(stream);
        setIsCallConnected(true);
      };

      rtcService.onCallEnded = () => {
        setIsCallEnded(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      };

      const stream = await rtcService.initializeLocalStream(isVideoCall, true);
      setLocalStream(stream);
      setWebrtcService(rtcService);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (isIncomingCall) {
        // For incoming calls, wait for user to accept
        // Don't automatically accept, wait for user interaction
      } else {
        rtcService.initiateCall(remoteUser._id, isVideoCall);
      }
    } catch (error) {
      console.error('Error initializing call:', error);
      handleClose();
    }
  };

  // Handle WebRTC signaling
  useEffect(() => {
    if (!socket || !webrtcService) return;

    const handleWebRTCSignal = (data) => {
      if (data.type === 'ice-candidate' && data.candidate) {
        webrtcService.handleIceCandidate(data.candidate);
      } else if (data.answer) {
        webrtcService.handleAnswer(data.answer);
      }
    };

    const handleCallAccepted = (data) => {
      if (data.answer) {
        webrtcService.handleAnswer(data.answer);
      }
    };

    socket.on('webrtc-signal', handleWebRTCSignal);
    socket.on('call-accepted', handleCallAccepted);

    return () => {
      socket.off('webrtc-signal', handleWebRTCSignal);
      socket.off('call-accepted', handleCallAccepted);
    };
  }, [socket, webrtcService]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    if (webrtcService) {
      webrtcService.toggleAudio(newState);
    }
  };

  const toggleVideo = () => {
    const newState = !isVideoEnabled;
    setIsVideoEnabled(newState);
    if (webrtcService) {
      webrtcService.toggleVideo(newState);
    }
  };

  const endCall = () => {
    if (webrtcService) {
      webrtcService.endCall(remoteUser._id);
    }
    setIsCallEnded(true);
    setTimeout(() => {
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    if (webrtcService) {
      webrtcService.cleanup();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallConnected(false);
    setIsCallEnded(false);
    setIsCallRejected(false);
    setIsAudioEnabled(true);
    setIsVideoEnabled(true);
    setWebrtcService(null);
    onClose();
  };

  if (!remoteUser) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#000',
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', height: '600px' }}>
        {/* Remote Video */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <Avatar
                src={remoteUser.avatar}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h6">
                {remoteUser.firstName} {remoteUser.lastName}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {isCallEnded ? 'Call Ended' : 
                 isCallRejected ? 'Call Rejected' :
                 !isCallConnected ? (isIncomingCall ? 'Incoming Call...' : 'Calling...') :
                 'Connected'}
              </Typography>
            </Box>
          )}

          {/* Local Video */}
          {localStream && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                width: 200,
                height: 150,
                backgroundColor: '#000',
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid #fff'
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          )}

          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Call Controls */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 2
            }}
          >
            {!isCallConnected && isIncomingCall ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PhoneIcon />}
                  onClick={() => webrtcService?.acceptCall(remoteUser._id, offerData)}
                  sx={{ minWidth: 120 }}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<PhoneDisabledIcon />}
                  onClick={() => webrtcService?.rejectCall(remoteUser._id)}
                  sx={{ minWidth: 120 }}
                >
                  Reject
                </Button>
              </>
            ) : !isCallConnected && !isIncomingCall ? (
              <Button
                variant="contained"
                color="error"
                startIcon={<PhoneDisabledIcon />}
                onClick={() => webrtcService?.endCall(remoteUser._id)}
                sx={{ minWidth: 120 }}
              >
                Cancel Call
              </Button>
            ) : (
              <>
                <IconButton
                  onClick={toggleAudio}
                  sx={{
                    backgroundColor: isAudioEnabled ? 'primary.main' : 'error.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                    '&:hover': {
                      backgroundColor: isAudioEnabled ? 'primary.dark' : 'error.dark'
                    }
                  }}
                >
                  {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
                </IconButton>

                {isVideoCall && (
                  <IconButton
                    onClick={toggleVideo}
                    sx={{
                      backgroundColor: isVideoEnabled ? 'primary.main' : 'error.main',
                      color: 'white',
                      width: 56,
                      height: 56,
                      '&:hover': {
                        backgroundColor: isVideoEnabled ? 'primary.dark' : 'error.dark'
                      }
                    }}
                  >
                    {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                  </IconButton>
                )}

                <IconButton
                  onClick={endCall}
                  sx={{
                    backgroundColor: 'error.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                    '&:hover': {
                      backgroundColor: 'error.dark'
                    }
                  }}
                >
                  <PhoneDisabledIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;
