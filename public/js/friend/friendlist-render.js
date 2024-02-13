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

    if (friend.meeting_id !== 'null') {
      content += ` Meeting ID: ${friend.meeting_id}`;
    }

    listItem.textContent = content;

    friendListElement.appendChild(listItem);
  });
  }
  