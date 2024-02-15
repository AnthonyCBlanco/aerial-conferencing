document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/api/users/friends');
      if (response.ok) {
        const userData = await response.json();
        renderFriendList(userData.friends); 
      } else {
        console.error('Failed to fetch friend data');
      }
    } catch (error) {
      console.error('Error fetching friend data:', error);
    }
  });

  function renderFriendList(friends) {
    const friendListElement = document.getElementById('friend-list');

  friendListElement.innerHTML = '';

  friends.forEach((friend) => {
    const listItem = document.createElement('li');

    let content = `${friend.username}`;
    console.log(friend.meetingId);
    console.log(friend.meeting_id);

    const joinButton = document.createElement('button');
    joinButton.textContent = 'Join Meeting';
    joinButton.classList.add('btn', 'btn-primary', 'join-meeting-btn');
    const joinButtonId = `joinButton_${friend.id}`;
    joinButton.id = joinButtonId;

    content += ` ${joinButton.outerHTML}`;
    listItem.innerHTML = content;
    friendListElement.appendChild(listItem);
    const joinBtnEl1 = document.getElementById(joinButtonId);
  
    joinBtnEl1.addEventListener('click', () => {
    console.log('Join button click event triggered!');
    console.log(`Joining meeting with ID: ${friend.meeting_id}`);
     
      if (window.location.pathname === '/room') {
        joinMeetingByFriendList(friend.meeting_id);
      } else {
        window.location.replace('/room');
        joinMeetingByFriendList(friend.meeting_id);
      }
    });
  
  });  
  };
  
  const joinMeetingByFriendList = async (roomId) => {
    document.getElementById("join-screen").style.display = "none";
    textDivEl.textContent = "Joining the meeting...";
    
    meetingId = roomId;
  
    // Perform additional actions based on meeting ID
    if (meetingId == 'johns-apples') {
      window.location.replace('/johnathan')
    }
  
    // Initialize and join the meeting
    initializeMeeting();
  };  

 