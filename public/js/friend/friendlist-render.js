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
      listItem.textContent = friend.username;
  
      friendListElement.appendChild(listItem);
    });
  }
  