//handles login/register/logout
// Save user data after login/register
const saveAuth = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
};

// Get current logged in user
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Logout
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
};

// Redirect if not logged in
const requireAuth = () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
  }
};

// Redirect if already logged in (validates token first)
const redirectIfLoggedIn = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
        window.location.href = 'index.html';
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};