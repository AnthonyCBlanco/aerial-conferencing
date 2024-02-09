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
    textDiv.style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
    document.getElementById(
      "meetingIdHeading"
    ).textContent = `Meeting Id: ${meetingId}`;
  });

  meeting.on('meeting-left', () => {
    videoContainerEl.innerHTML= ""
  });

  // meeting.on('participant-join', (participant) => {

  // })

  // meeting.on('participant-left', (participant) => {
    
  // })
}

const createLocalParticipant = () => {
  
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

function setTrack() {}

const joinMeeting = async () => {
  document.querySelector('#join-screen', async () => {
    textDivEl.textContent = 'Joining Meeting'

    roomId = document.getElementById('meetingIdtxt').value
    meetingId = roomId

    initializeMeeting()
  })
}

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
}

joinBtnEl.addEventListener('click', joinMeeting)
createBtnEl.addEventListener('click', createMeeting)