const TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlZDQ4YTM1MC1lZTBhLTRlNmItYmU2YS03MmJhOTMyMzQ5ZWMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwNzM2NTg2NywiZXhwIjoxODY1MTUzODY3fQ.H3cyhdgjgHIIRzw_u2Hoj823kJB3FeOSu2Uwzkndwro'
const joinBtnEl = document.getElementById("joinBtn");
const leaveBtnEl = document.getElementById("leaveBtn");
const toggleMicBtnEl = document.getElementById("toggleMicBtn");
const toggleWebCamBtnEl = document.getElementById("toggleWebCamBtn");
const createBtnEl = document.getElementById("createMeetingBtn");
const videoContainerEl = document.getElementById("videoContainer");
const textDivEl = document.getElementById("textDiv");



let meeting = null;
let meetingId = "";
let isMicOn = false;
let isWebCamOn = false;

const initializeMeeting = () => {
  VideoSDK.config(TOKEN);

  meeting = VideoSDK.initMeeting({
    meetingId: meetingId,
    name: "test",
    micEnabled: true,
    webcamEnabled: true,
  })

  meeting.join();

  createLocalParticipant();

  meeting.localParticipant.on('stream-enabled', (stream) => {
    setTrack(stream, null, meeting.localParticipant, true);
  })

  meeting.on("meeting-joined", () => {
    textDivEl.style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
    document.getElementById(
      "meetingIdHeading"
    ).textContent = `Meeting Id: ${meetingId}`;
  });

  meeting.on('meeting-left', () => {
    videoContainerEl.innerHTML= ""
    notifyBackendOnLeave();
  });

  meeting.on("participant-joined", (participant) => {
    let videoElement = createVideoElement(
      participant.id,
      participant.displayName
    );
    let audioElement = createAudioElement(participant.id);
    // stream-enabled
    participant.on("stream-enabled", (stream) => {
      setTrack(stream, audioElement, participant, false);
    });
    videoContainerEl.appendChild(videoElement);
    videoContainerEl.appendChild(audioElement);
  });

  meeting.on('participant-left', (participant) => {
    let vElement = document.getElementById(`f-${participant.id}`);
    vElement.remove(vElement);

    let aElement = document.getElementById(`a-${participant.id}`);
    aElement.remove(aElement);
  })
}

const createLocalParticipant = () => {
  let localParticipant = createVideoElement(
    meeting.localParticipant.id,
    meeting.localParticipant.displayName
  );
  videoContainerEl.appendChild(localParticipant);
}

const createVideoElement = (pId, name) => {
  let videoFrameEl = document.createElement('div')
  videoFrameEl.setAttribute('id', `f-${pId}`)

  let videoElement = document.createElement('video')
  videoElement.classList.add("video-frame");
  videoElement.setAttribute("id", `v-${pId}`);
  videoElement.setAttribute("playsinline", true);
  videoElement.setAttribute("width", "300");
  videoFrameEl.appendChild(videoElement);

  let displayNameEl = document.createElement('div')
  displayNameEl.innerHTML= `Name: ${name}`

  videoFrameEl.appendChild(displayNameEl)
  return videoFrameEl
}

const createAudioElement = (pId) => {
  let audioElement = document.createElement("audio");
  audioElement.setAttribute("autoPlay", "false");
  audioElement.setAttribute("playsInline", "true");
  audioElement.setAttribute("controls", "false");
  audioElement.setAttribute("id", `a-${pId}`);
  audioElement.style.display = "none";
  return audioElement;
}

const setTrack = (stream, audioElement, participant, isLocal) => {
  if (stream.kind == "video") {
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
}

const joinMeeting = async () => {
  document.getElementById("join-screen").style.display = "none";
  textDivEl.textContent = "Joining the meeting...";

  roomId = document.getElementById("meetingIdTxt").value;
  meetingId = roomId;

  if(meetingId == 'johns-apples'){
    fetch
  }

  initializeMeeting();
};

const createMeeting = async () => {
  document.querySelector('#join-screen').setAttribute("style", "display: none")
  textDivEl.textContent = "Joining Meeting..."

  const url = `https://api.videosdk.live/v2/rooms`;
  const { roomId } = await fetch(url, {
    method: 'POST',
    headers: { Authorization: TOKEN, "Content-Type": "application/json" }
  })
    .then((res) => res.json())
    .catch((err) => alert("error", err))

  meetingId = roomId;

  initializeMeeting()

    // Send meeting ID to the backend for storage
    sendMeetingIdToBackend(roomId);

}

const sendMeetingIdToBackend = async (roomId) => {
  // You can replace the URL and method with your backend endpoint for storing the meeting ID
  const backendUrl = '/api/users/add-meeting-id';
  
  await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meetingId: roomId }),
  })
  .then((res) => res.json())
  .then((data) => console.log('Meeting ID sent to backend:', data))
  .catch((err) => console.error('Error sending meeting ID to backend:', err));
};



const leaveMeeting = async () => {
  meeting?.leave();
  document.getElementById("grid-screen").style.display = "none";
  document.getElementById("join-screen").style.display = "block";
}

const notifyBackendOnLeave = async () => {
  // Send meeting ID to the backend for removal
  sendMeetingIdToBackendForRemoval('null');
};

const sendMeetingIdToBackendForRemoval = async (roomId) => {
  // You can replace the URL and method with your backend endpoint for removing the meeting ID
  const backendUrl = '/api/users/add-meeting-id';
  
  await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meetingId: roomId }),
  })
  .then((res) => res.json())
  .then((data) => console.log('Meeting ID removed from backend:', data))
  .catch((err) => console.error('Error removing meeting ID from backend:', err));
};



const toggleMic = async () => {
  if (isMicOn) {
    // Disable Mic in Meeting
    meeting?.muteMic();
  } else {
    // Enable Mic in Meeting
    meeting?.unmuteMic();
  }
  isMicOn = !isMicOn;
}

const toggleCam = async () => {
  if (isWebCamOn) {
    // Disable Webcam in Meeting
    meeting?.disableWebcam();

    let vElement = document.getElementById(`f-${meeting.localParticipant.id}`);
    vElement.style.display = "none";
  } else {
    // Enable Webcam in Meeting
    meeting?.enableWebcam();

    let vElement = document.getElementById(`f-${meeting.localParticipant.id}`);
    vElement.style.display = "inline";
  }
  isWebCamOn = !isWebCamOn;
}

toggleWebCamBtnEl.addEventListener('click', toggleCam)
toggleMicBtnEl.addEventListener('click', toggleMic)
leaveBtnEl.addEventListener('click', leaveMeeting)
joinBtnEl.addEventListener('click', joinMeeting)
createBtnEl.addEventListener('click', createMeeting)