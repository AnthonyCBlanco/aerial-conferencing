const addFriendFormHandler = async (event) => {
  event.preventDefault();
  
  const username = document.querySelector('#username-input').value.trim();
  console.log(username);

  if (username) {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        body: JSON.stringify({ username }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/api/users');
        alert('Friend added successfully!');
      } else {
        const data = await response.json();
        alert(`Failed to add friend: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('Failed to add friend. Please try again.');
    }
  }
};

document
  .querySelector('.friend-form')
  .addEventListener('submit', addFriendFormHandler);
