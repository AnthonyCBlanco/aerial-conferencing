// Token for VideoSDK authentication
const TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlZDQ4YTM1MC1lZTBhLTRlNmItYmU2YS03MmJhOTMyMzQ5ZWMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwNzM2NTg2NywiZXhwIjoxODY1MTUzODY3fQ.H3cyhdgjgHIIRzw_u2Hoj823kJB3FeOSu2Uwzkndwro'

// DOM elements for various buttons and containers
const joinBtnEl = document.getElementById("joinBtn");
const leaveBtnEl = document.getElementById("leaveBtn");
const toggleMicBtnEl = document.getElementById("toggleMicBtn");
const toggleWebCamBtnEl = document.getElementById("toggleWebCamBtn");
const createBtnEl = document.getElementById("createMeetingBtn");
const videoContainerEl = document.getElementById("videoContainer");
const textDivEl = document.getElementById("textDiv");

// Variables to store meeting information
let meeting = null;
let meetingId = "";
let isMicOn = false;
let isWebCamOn = false;

// Function to initialize the meeting using VideoSDK
const initializeMeeting = () => {
  // Configure VideoSDK with the provided token
  VideoSDK.config(TOKEN);

  // Initialize the meeting with specified parameters
  meeting = VideoSDK.initMeeting({
    meetingId: meetingId,
    name: "test",
    micEnabled: true,
    webcamEnabled: true,
  });

  // Join the meeting
  meeting.join();

  // Create and display the local participant
  createLocalParticipant();

  // Handle events when local participant's stream is enabled
  meeting.localParticipant.on('stream-enabled', (stream) => {
    setTrack(stream, null, meeting.localParticipant, true);
  });

  // Handle the event when the user successfully joins the meeting
  meeting.on("meeting-joined", () => {
    textDivEl.style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
    document.getElementById(
      "meetingIdHeading"
    ).textContent = `Meeting Id: ${meetingId}`;
  });

  // Handle the event when a participant leaves the meeting
  meeting.on('meeting-left', () => {
    videoContainerEl.innerHTML = "";
    notifyBackendOnLeave();
  });

  // Handle the event when a participant joins the meeting
  meeting.on("participant-joined", (participant) => {
    let videoElement = createVideoElement(
      participant.id,
      participant.displayName
    );
    let audioElement = createAudioElement(participant.id);
    
    // Handle the event when a participant's stream is enabled
    participant.on("stream-enabled", (stream) => {
      setTrack(stream, audioElement, participant, false);
    });

    // Append video and audio elements to the video container
    videoContainerEl.appendChild(videoElement);
    videoContainerEl.appendChild(audioElement);
  });

  // Handle the event when a participant leaves the meeting
  meeting.on('participant-left', (participant) => {
    let vElement = document.getElementById(`f-${participant.id}`);
    vElement.remove(vElement);

    let aElement = document.getElementById(`a-${participant.id}`);
    aElement.remove(aElement);
  });
};

// Function to create a video element for the local participant
const createLocalParticipant = () => {
  let localParticipant = createVideoElement(
    meeting.localParticipant.id,
    meeting.localParticipant.displayName
  );
  videoContainerEl.appendChild(localParticipant);
};

// Function to create a video element for a participant
const createVideoElement = (pId, name) => {
  let videoFrameEl = document.createElement('div');
  videoFrameEl.setAttribute('id', `f-${pId}`);

  let videoElement = document.createElement('video');
  videoElement.classList.add("video-frame");
  videoElement.setAttribute("id", `v-${pId}`);
  videoElement.setAttribute("playsinline", true);
  videoElement.setAttribute("width", "300");
  videoFrameEl.appendChild(videoElement);

  let displayNameEl = document.createElement('div');
  displayNameEl.innerHTML = `Name: ${name}`;

  videoFrameEl.appendChild(displayNameEl);
  return videoFrameEl;
};

// Function to create an audio element for a participant
const createAudioElement = (pId) => {
  let audioElement = document.createElement("audio");
  audioElement.setAttribute("autoPlay", "false");
  audioElement.setAttribute("playsInline", "true");
  audioElement.setAttribute("controls", "false");
  audioElement.setAttribute("id", `a-${pId}`);
  audioElement.style.display = "none";
  return audioElement;
};

// Function to set tracks for video and audio elements
const setTrack = (stream, audioElement, participant, isLocal) => {
  if (stream.kind == "video") {
    // Handle video track
    isWebCamOn = true;
    const mediaStream = new MediaStream();
    mediaStream.addTrack(stream.track);
    let videoElm = document.getElementById(`v-${participant.id}`);
    videoElm.srcObject = mediaStream;
    videoElm
      .play()
      .catch((error) =>
        console.error("videoElem.current.play() failed", error)
      );
  }
  if (stream.kind == "audio") {
    // Handle audio track
    if (isLocal) {
      isMicOn = true;
    } else {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(stream.track);
      audioElement.srcObject = mediaStream;
      audioElement
        .play()
        .catch((error) => console.error("audioElem.play() failed", error));
    }
  }
};

// Function to join the meeting
const joinMeeting = async () => {
  // Hide join screen and display joining message
  document.getElementById("join-screen").style.display = "none";
  textDivEl.textContent = "Joining the meeting...";

  // Get meeting ID from input
  roomId = document.getElementById("meetingIdTxt").value;
  meetingId = roomId;

  // Perform additional actions based on meeting ID
  if (meetingId == 'johns-apples') {
    window.location.replace('/johnathan')
  }

  // Initialize and join the meeting
  initializeMeeting();
};

// Function to create a new meeting
const createMeeting = async () => {
  // Hide join screen and display joining message
  document.querySelector('#join-screen').setAttribute("style", "display: none");
  textDivEl.textContent = "Joining Meeting...";

  // API endpoint for creating a new meeting
  const url = `https://api.videosdk.live/v2/rooms`;

  // Fetch a new meeting ID from the backend
  const { roomId } = await fetch(url, {
    method: 'POST',
    headers: { Authorization: TOKEN, "Content-Type": "application/json" }
  })
    .then((res) => res.json())
    .catch((err) => alert("error", err));

  // Set the meeting ID and initialize the meeting
  meetingId = roomId;
  initializeMeeting();

  // Send meeting ID to the backend for storage
  sendMeetingIdToBackend(roomId);
};

// Function to send the meeting ID to the backend for storage
const sendMeetingIdToBackend = async (roomId) => {
  // Backend endpoint for storing the meeting ID
  const backendUrl = '/api/users/add-meeting-id';
  
  // Send a POST request with the meeting ID to the backend
  await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meetingId: roomId }),
  })
  .then((res) => res.json())
  .then((data) => console.log('Meeting ID sent to backend:', data))
  .catch((err) => console.error('Error sending meeting ID to backend:', err));
};

// Function to leave the meeting
const leaveMeeting = async () => {
  // Leave the meeting using VideoSDK
  meeting?.leave();

  // Hide grid screen and display join screen
  document.getElementById("grid-screen").style.display = "none";
  document.getElementById("join-screen").style.display = "block";
};

// Function to notify the backend when a user leaves the meeting
const notifyBackendOnLeave = async () => {
  // Send meeting ID to the backend for removal
  sendMeetingIdToBackendForRemoval('null');
};

// Function to send the meeting ID to the backend for removal
const sendMeetingIdToBackendForRemoval = async (roomId) => {
  // Backend endpoint for removing the meeting ID
  const backendUrl = '/api/users/add-meeting-id';
  
  // Send a POST request with the meeting ID to the backend
  await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meetingId: roomId }),
  })
  .then((res) => res.json())
  .then((data) => console.log('Meeting ID removed from backend:', data))
  .catch((err) => console.error('Error removing meeting ID from backend:', err));
};

// Function to toggle the microphone state in the meeting
const toggleMic = async () => {
  // Toggle the microphone state in the meeting
  if (isMicOn) {
    meeting?.muteMic(); // Disable Mic in Meeting
  } else {
    meeting?.unmuteMic(); // Enable Mic in Meeting
  }
  isMicOn = !isMicOn;
};

// Function to toggle the webcam state in the meeting
const toggleCam = async () => {
  // Toggle the webcam state in the meeting
  if (isWebCamOn) {
    meeting?.disableWebcam(); // Disable Webcam in Meeting

    // Hide local participant's video element
    let vElement = document.getElementById(`f-${meeting.localParticipant.id}`);
    vElement.style.display = "none";
  } else {
    meeting?.enableWebcam(); // Enable Webcam in Meeting

    // Show local participant's video element
    let vElement = document.getElementById(`f-${meeting.localParticipant.id}`);
    vElement.style.display = "inline";
  }
  isWebCamOn = !isWebCamOn;
};

// Add event listeners to buttons for toggling webcam/microphone, leaving the meeting, joining the meeting, and creating a new meeting
toggleWebCamBtnEl.addEventListener('click', toggleCam);
toggleMicBtnEl.addEventListener('click', toggleMic);
leaveBtnEl.addEventListener('click', leaveMeeting);
joinBtnEl.addEventListener('click', joinMeeting);
createBtnEl.addEventListener('click', createMeeting);
