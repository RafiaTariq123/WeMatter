import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isIncomingCall: false,
  isOutgoingCall: false,
  callModalOpen: false,
  remoteUser: null,
  isVideoCall: true,
  callStatus: 'idle', // idle, calling, ringing, connected, ended
  callerInfo: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    initiateCall: (state, action) => {
      const { remoteUser, isVideoCall = true } = action.payload;
      state.isOutgoingCall = true;
      state.isIncomingCall = false;
      state.callModalOpen = true;
      state.remoteUser = remoteUser;
      state.isVideoCall = isVideoCall;
      state.callStatus = 'calling';
      state.callerInfo = null;
    },
    receiveIncomingCall: (state, action) => {
      const { caller, isVideoCall = true } = action.payload;
      state.isIncomingCall = true;
      state.isOutgoingCall = false;
      state.callModalOpen = true;
      state.remoteUser = caller;
      state.isVideoCall = isVideoCall;
      state.callStatus = 'ringing';
      state.callerInfo = caller;
    },
    acceptCall: (state) => {
      state.callStatus = 'connected';
    },
    rejectCall: (state) => {
      state.callStatus = 'ended';
      state.callModalOpen = false;
      state.isIncomingCall = false;
      state.isOutgoingCall = false;
      state.remoteUser = null;
      state.callerInfo = null;
    },
    endCall: (state) => {
      state.callStatus = 'ended';
      state.callModalOpen = false;
      state.isIncomingCall = false;
      state.isOutgoingCall = false;
      state.remoteUser = null;
      state.callerInfo = null;
    },
    closeCallModal: (state) => {
      state.callModalOpen = false;
      state.isIncomingCall = false;
      state.isOutgoingCall = false;
      state.remoteUser = null;
      state.callerInfo = null;
      state.callStatus = 'idle';
    },
    setCallStatus: (state, action) => {
      state.callStatus = action.payload;
    },
  },
});

export const {
  initiateCall,
  receiveIncomingCall,
  acceptCall,
  rejectCall,
  endCall,
  closeCallModal,
  setCallStatus,
} = callSlice.actions;

export default callSlice.reducer;
