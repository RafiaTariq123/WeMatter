export class WebRTCService {
  constructor(socket) {
    this.socket = socket;
    this.localConnection = null;
    this.remoteStream = null;
    this.localStream = null;
    this.onRemoteStream = null;
    this.onCallEnded = null;
    this.onCallAccepted = null;
    this.onCallRejected = null;
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
  }

  async initializeLocalStream(video = true, audio = true) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio
      });
      this.localStream = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  createPeerConnection(isInitiator) {
    this.localConnection = new RTCPeerConnection(this.configuration);

    this.localConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('webrtc-signal', {
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    this.localConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      if (this.onRemoteStream) {
        this.onRemoteStream(this.remoteStream);
      }
    };

    this.localConnection.onconnectionstatechange = () => {
      if (this.localConnection.connectionState === 'disconnected' || 
          this.localConnection.connectionState === 'failed') {
        this.endCall();
      }
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.localConnection.addTrack(track, this.localStream);
      });
    }
  }

  async initiateCall(remoteUserId, video = true) {
    if (!this.localStream) {
      throw new Error('Local stream not initialized');
    }

    this.createPeerConnection(true);
    
    try {
      const offer = await this.localConnection.createOffer();
      await this.localConnection.setLocalDescription(offer);
      
      this.socket.emit('call-user', {
        to: remoteUserId,
        from: this.socket.id,
        video: video,
        offer: offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  async acceptCall(remoteUserId, offer) {
    if (!this.localStream) {
      throw new Error('Local stream not initialized');
    }

    // Create peer connection first
    this.createPeerConnection(false);
    
    try {
      if (offer) {
        // Parse the offer if it's a string
        const offerDesc = typeof offer === 'string' ? JSON.parse(offer) : offer;
        
        // Set remote description first
        await this.localConnection.setRemoteDescription(offerDesc);
        
        // Create and set the answer
        const answer = await this.localConnection.createAnswer();
        await this.localConnection.setLocalDescription(answer);
        
        this.socket.emit('call-accepted', {
          to: remoteUserId,
          from: this.socket.id,
          answer: answer
        });
      } else {
        // If no offer, we can't accept the call
        throw new Error('No offer provided to accept call');
      }
    } catch (error) {
      console.error('Error accepting call:', error);
      throw error;
    }
  }

  async handleAnswer(answer) {
    if (!this.localConnection) return;
    
    try {
      await this.localConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  async handleIceCandidate(candidate) {
    if (!this.localConnection) return;
    
    try {
      await this.localConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  rejectCall(remoteUserId) {
    this.socket.emit('call-rejected', {
      to: remoteUserId,
      from: this.socket.id
    });
  }

  endCall() {
    if (this.localConnection) {
      this.localConnection.close();
      this.localConnection = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    this.remoteStream = null;

    if (this.onCallEnded) {
      this.onCallEnded();
    }
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  cleanup() {
    this.endCall();
  }
}

export default WebRTCService;
