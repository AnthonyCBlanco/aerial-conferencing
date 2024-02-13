document.querySelector('.friend-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username-input').value.trim();
  console.log(username);

  if (username) {
    try {
      let endpoint = '/api/friends';

      const clickedButton = event.submitter;

      if (clickedButton.classList.contains('remove-friend')) {
        endpoint += '/remove';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ username }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/');
        const action = clickedButton.classList.contains('remove-friend') ? 'removed' : 'added';
        alert(`Friend ${action} successfully!`);
      } else {
        const data = await response.json();
        const action = clickedButton.classList.contains('remove-friend') ? 'removing' : 'adding';
        alert(`Failed to ${action} friend: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding/removing friend:', error);
      const action = clickedButton.classList.contains('remove-friend') ? 'remove' : 'add';
      alert(`Failed to ${action} friend. Please try again.`);
    }
  }
});
