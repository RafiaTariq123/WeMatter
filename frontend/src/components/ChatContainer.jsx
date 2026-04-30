import React from "react";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetMessagesQuery } from "../redux/api/chatApi";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import VideoCallModal from "./VideoCallModal";
import WebRTCService from "../utils/webrtc";
import {
  Box,
  Avatar,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { connectSocket, disconnectSocket } from "../utils/socket";
import { 
  receiveIncomingCall, 
  acceptCall, 
  rejectCall, 
  endCall, 
  closeCallModal 
} from "../redux/features/callSlice";

const MessageBubble = React.memo(({ message, user, selectedUser, setPreviewImage }) => {
  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: message.senderId === user._id ? "row-reverse" : "row",
        alignItems: "baseline",
        marginRight: message.senderId === user._id ? 6 : 1,
      }}
    >
      <Avatar
        src={
          message.senderId === user._id
            ? user.avatar || "/avatar.png"
            : selectedUser.avatar || "/avatar.png"
        }
        alt="profile pic"
        sx={{ width: 50, height: 50 }}
      />

      <Box sx={{ maxWidth: "70%" }}>
        <Box
          sx={{
            backgroundColor:
              message.senderId === user._id
                ? "primary.chatBar"
                : "secondary.chatBar",
            borderRadius: 2,
            p: "14px",
            marginRight: message.senderId === user._id ? 2 : 0,
            marginLeft: message.senderId === user._id ? 0 : 2,
            display: "flex",
            flexDirection: "column",
            wordWrap: "break-word",
          }}
        >
          {message.image && (
            <Box
              component="img"
              src={message.image}
              alt="Attachment"
              onClick={() => setPreviewImage(message.image)}
              sx={{
                maxWidth: 200,
                borderRadius: 1,
                mb: 2,
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            />
          )}
          {message.message && (
            <Typography variant="body2">{message.message}</Typography>
          )}
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: "grey.main",
            mt: 1,
            display: "flex",
            justifyContent:
              message.senderId === user._id ? "flex-end" : "flex-start",
          }}
        >
          {formatTime(message.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
});

const ChatContainer = ({ user }) => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const callState = useSelector((state) => state.call);
  const messageEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(null);
  const [socket, setSocket] = useState(null);
  const [webrtcService, setWebrtcService] = useState(null);
  const [incomingCallOffer, setIncomingCallOffer] = useState(null);

  const {
    data: messages = [],
    isLoading: isMessagesLoading,
    refetch,
  } = useGetMessagesQuery(selectedUser?._id, {
    skip: !selectedUser,
  });

  // Memoized socket connection
  useEffect(() => {
    if (!selectedUser) return;

    const handleNewMessage = (newMessage) => {
      if (
        selectedUser &&
        (newMessage.senderId === selectedUser._id ||
          newMessage.receiverId === selectedUser._id)
      ) {
        // Save scroll position before refetch
        if (messagesContainerRef.current) {
          setScrollPosition(messagesContainerRef.current.scrollHeight - messagesContainerRef.current.scrollTop);
        }
        refetch();
      }
    };

    const handleIncomingCall = (data) => {
      console.log('Incoming call received:', data);
      dispatch(receiveIncomingCall({
        caller: data.caller,
        isVideoCall: data.video,
        offer: data.offer
      }));
      setIncomingCallOffer(data.offer);
    };

    const handleCallAccepted = (data) => {
      console.log('Call accepted:', data);
      dispatch(acceptCall());
      // Handle the answer from the other peer
      if (data.answer) {
        // This will be handled by the WebRTC service
      }
    };

    const handleCallRejected = () => {
      dispatch(rejectCall());
      // Show notification that call was rejected
      console.log('Call was rejected');
      // Close the modal after a short delay to show rejection status
      setTimeout(() => {
        dispatch(closeCallModal());
      }, 2000);
    };

    const handleCallEnded = () => {
      dispatch(endCall());
    };

    const handleWebRTCSignal = (data) => {
      // Handle WebRTC signaling (offer, answer, ice-candidate)
      // This will be processed by the WebRTC service
    };

    const socket = connectSocket(user._id, () => {}, handleNewMessage);
    
    // Set up call event listeners
    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);
    socket.on('call-rejected', handleCallRejected);
    socket.on('call-ended', handleCallEnded);
    socket.on('webrtc-signal', handleWebRTCSignal);
    
    setSocket(socket);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
      socket.off('call-rejected', handleCallRejected);
      socket.off('call-ended', handleCallEnded);
      socket.off('webrtc-signal', handleWebRTCSignal);
      disconnectSocket();
    };
  }, [user._id, selectedUser?._id, refetch, dispatch]);

  // Handle call initiation
  useEffect(() => {
    if (callState.isOutgoingCall && callState.remoteUser && socket) {
      console.log('Initiating call to:', callState.remoteUser);
      // Create WebRTC service and initiate call
      const initiateCall = async () => {
        try {
          const rtcService = new WebRTCService(socket);
          const stream = await rtcService.initializeLocalStream(callState.isVideoCall, true);
          
          rtcService.onRemoteStream = (stream) => {
            console.log('Remote stream received');
          };

          rtcService.onCallEnded = () => {
            console.log('Call ended');
          };

          rtcService.initiateCall(callState.remoteUser._id, callState.isVideoCall);
        } catch (error) {
          console.error('Error initiating call:', error);
        }
      };

      initiateCall();
    }
  }, [callState.isOutgoingCall, callState.remoteUser, callState.isVideoCall, socket]);

  // Scroll management
  useEffect(() => {
    if (!messagesContainerRef.current) return;

    if (scrollPosition) {
      // Restore scroll position after update
      messagesContainerRef.current.scrollTop = 
        messagesContainerRef.current.scrollHeight - scrollPosition;
      setScrollPosition(null);
    } else if (messageEndRef.current) {
      // Scroll to bottom for new messages
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, scrollPosition]);

  if (isMessagesLoading || !selectedUser) {
    return (
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100vh"
      }}>
        <Box sx={{ width: "80%", maxWidth: 400 }}>
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
          {[...Array(5)].map((_, i) => (
            <Box key={i} sx={{ display: "flex", mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Skeleton variant="rectangular" width="70%" height={80} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "sticky", top: 0, zIndex: 10, bgcolor: "background.paper" }}>
        <ChatHeader currentUser={user} />
      </Box>

      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 4,
          pl: 12,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            user={user}
            selectedUser={selectedUser}
            setPreviewImage={setPreviewImage}
          />
        ))}
        <div ref={messageEndRef} />
      </Box>

      <Box sx={{ 
        position: "sticky", 
        bottom: 0, 
        zIndex: 10,
        bgcolor: "background.paper",
        p: 2,
        borderTop: "1px solid",
        borderColor: "divider"
      }}>
        <MessageInput refetchMessages={refetch} />
      </Box>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <IconButton
            onClick={() => setPreviewImage(null)}
            sx={{ 
              position: "absolute", 
              top: 8, 
              right: 8, 
              zIndex: 10,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={previewImage}
            alt="Preview"
            sx={{ 
              width: "100%", 
              maxHeight: "90vh", 
              objectFit: "contain",
              display: 'block'
            }}
            loading="lazy"
          />
        </DialogContent>
      </Dialog>

      {/* Video Call Modal */}
      <VideoCallModal
        open={callState.callModalOpen}
        onClose={() => dispatch(closeCallModal())}
        remoteUser={callState.remoteUser}
        currentUser={user}
        socket={socket}
        isVideoCall={callState.isVideoCall}
        isIncomingCall={callState.isIncomingCall}
        offerData={incomingCallOffer}
      />
    </Box>
  );
};

export default React.memo(ChatContainer);