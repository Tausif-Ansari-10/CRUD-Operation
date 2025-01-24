const apiUrl = 'https://6791e6e7cf994cc68047dc6a.mockapi.io/Users';

document.getElementById('userForm').addEventListener('submit', handleFormSubmit);

// Fetch and display users
function fetchUsers() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('#userTable tbody');
      tableBody.innerHTML = '';  
      data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>
            <button onclick="editUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.log('Error fetching users:', error));
}

// Handle form submission for add/edit
function handleFormSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;

  // Check if we're editing or adding
  const userId = document.getElementById('userId') ? document.getElementById('userId').value : null;
  
  if (userId) {
    // Update existing user
    updateUser(userId, name, email);
  } else {
    // Create new user
    createUser(name, email);
  }

  name.value = "";
  email.value ="";
}

// Create new user
function createUser(name, email) {
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  })
    .then(response => response.json())
    .then(() => {
      fetchUsers();  // Refresh the user list
    })
    .catch(error => console.log('Error creating user:', error));
}

// Edit user
function editUser(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(user => {
      document.getElementById('userName').value = user.name;
      document.getElementById('userEmail').value = user.email;
      // Add user ID for editing
      const userIdField = document.createElement('input');
      userIdField.type = 'hidden';
      userIdField.id = 'userId';
      userIdField.value = user.id;
      document.getElementById('userForm').appendChild(userIdField);
    })
    .catch(error => console.log('Error fetching user for editing:', error));
}

// Update user
function updateUser(id, name, email) {
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  })
    .then(response => response.json())
    .then(() => {
      fetchUsers();  // Refresh the user list
      document.getElementById('userForm').reset();
      const userIdField = document.getElementById('userId');
      if (userIdField) {
        userIdField.remove();
      }
    })
    .catch(error => console.log('Error updating user:', error));
}

// Delete user
function deleteUser(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      fetchUsers();  // Refresh the user list
    })
    .catch(error => console.log('Error deleting user:', error));
}

fetchUsers();