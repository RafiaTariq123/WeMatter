import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, IconButton, TextField, Skeleton, ThemeProvider, ClickAwayListener, Popover } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiPicker from 'emoji-picker-react';
import theme from "../../components/Theme";
import { connectSocket, disconnectSocket } from "../../utils/socket";
import { useGetGroupMessagesQuery, useSendGroupMessageMutation } from "../../redux/api/groupChatApi";

const ROOM_ID = "group-therapy"; // single public room for now

export default function GroupTherapy() {
  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.user || user; // normalize

  const { data: messages = [], isLoading, refetch } = useGetGroupMessagesQuery(ROOM_ID);
  const [sendGroupMessage] = useSendGroupMessageMutation();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);
  const emojiButtonRef = useRef(null);
  
  const handleEmojiClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };
  
  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };
  
  const onEmojiSelect = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
  };

  useEffect(() => {
    if (!currentUser?._id) return;
    const socket = connectSocket(currentUser._id);
    socket.emit("join-room", ROOM_ID);

    const onNewGroupMessage = (msg) => {
      if (msg?.roomId === ROOM_ID) refetch();
    };
    socket.on("newGroupMessage", onNewGroupMessage);

    return () => {
      try { socket.emit("leave-room", ROOM_ID); } catch (e) {}
      try { socket.off("newGroupMessage", onNewGroupMessage); } catch (e) {}
      // do not disconnect global socket as it may be used elsewhere
    };
  }, [currentUser?._id, refetch]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };



  const onSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendGroupMessage({ roomId: ROOM_ID, messageData: { message: text.trim(), image: imagePreview } }).unwrap();
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetch();
    } catch (err) {
      console.error("Failed to send group message", err);
    }
  };

  const MessageBubble = ({ msg }) => {
    const mine = msg.senderId === currentUser?._id;
    return (
      <Box sx={{ display: "flex", flexDirection: mine ? "row-reverse" : "row", alignItems: "flex-start" }}>
        <Avatar src={mine ? currentUser?.avatar : undefined} sx={{ width: 40, height: 40 }} />
        <Box sx={{ maxWidth: "70%", mx: 1 }}>
          <Box sx={{ bgcolor: mine ? "primary.chatBar" : "secondary.chatBar", borderRadius: 2, p: 1.5 }}>
            {msg.image && (
              <Box component="img" src={msg.image} alt="attachment" sx={{ maxWidth: 220, borderRadius: 1, mb: 1 }} />
            )}
            {msg.message && <Typography variant="body2">{msg.message}</Typography>}
          </Box>
          <Typography variant="caption" sx={{ color: "grey.main", mt: 0.5, display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Typography>
        </Box>
      </Box>
    );
  };

  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider", position: "sticky", top: 0, bgcolor: "background.paper", zIndex: 10, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'primary.main' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" color="primary.main" fontWeight={700}>Group Therapy</Typography>
            <Typography variant="body2" color="text.secondary">Chat with other registered users</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          {isLoading ? (
            <Box sx={{ width: "80%", maxWidth: 480, mx: "auto" }}>
              <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
              {[...Array(5)].map((_, i) => (
                <Box key={i} sx={{ display: "flex", mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                  <Skeleton variant="rectangular" width="70%" height={80} />
                </Box>
              ))}
            </Box>
          ) : (
            messages.map((m) => <MessageBubble key={m._id} msg={m} />)
          )}
          <div ref={messageEndRef} />
        </Box>

        <Box component="form" onSubmit={onSend} sx={{ px: 2, py: 1.5, borderTop: "1px solid #e9edef", bgcolor: 'white', position: 'relative' }}>
          <Box sx={{ position: 'relative', width: '100%', mb: 1 }}>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              size="small"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": { 
                  borderRadius: "8px", 
                  border: "1px solid #00a884",
                  backgroundColor: "transparent",
                  paddingRight: '40px',
                  '&:hover': {
                    borderColor: '#00a884',
                  },
                  '&.Mui-focused': {
                    borderColor: '#00a884',
                    boxShadow: '0 0 0 1px #00a884',
                  },
                },
                "& .MuiOutlinedInput-input": { 
                  padding: "10px 16px",
                  '&::placeholder': {
                    color: '#667781',
                    opacity: 1,
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'none',
                },
              }}
              InputProps={{
                style: {
                  paddingRight: '8px',
                },
              }}
            />
            
            <Popover
              open={Boolean(emojiAnchorEl)}
              anchorEl={emojiAnchorEl}
              onClose={handleEmojiClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              sx={{
                '& .emoji-picker-react': {
                  border: 'none',
                  boxShadow: 'none',
                  width: '300px !important',
                },
                '& .emoji-scroll-wrapper': {
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#e1e1e1',
                    borderRadius: '3px',
                  },
                },
              }}
            >
              <Box sx={{ width: 300, height: 350, overflow: 'hidden' }}>
                <EmojiPicker
                  onEmojiClick={onEmojiSelect}
                  autoFocusSearch={false}
                  skinTonesDisabled
                  searchDisabled
                  previewConfig={{
                    showPreview: false
                  }}
                  width={300}
                  height={350}
                />
              </Box>
            </Popover>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
            <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageChange} />
            <IconButton 
              onClick={() => fileInputRef.current?.click()} 
              sx={{ 
                color: "#00a884",
                padding: '6px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 168, 132, 0.08)',
                },
              }}
            >
              <ImageIcon fontSize="small" />
            </IconButton>

            <IconButton 
              onClick={handleEmojiClick}
              sx={{ 
                color: "#00a884",
                padding: '6px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 168, 132, 0.08)',
                },
              }}
            >
              <EmojiEmotionsIcon fontSize="small" />
            </IconButton>

            <Box sx={{ flex: 1 }} />

            <IconButton 
              type="submit" 
              disabled={!text.trim() && !imagePreview} 
              sx={{ 
                color: "#00a884",
                padding: '6px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 168, 132, 0.08)',
                },
                '&:disabled': {
                  color: '#aebac1',
                },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>

        </Box>

        {imagePreview && (
          <Box sx={{ position: "fixed", bottom: 80, left: 20, p: 1, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Box component="img" src={imagePreview} alt="preview" sx={{ width: 90, height: 90, objectFit: "cover", borderRadius: 1 }} />
            <IconButton onClick={removeImage} sx={{ position: "absolute", top: -10, right: -10, color: "primary.main", bgcolor: "white.main" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}
