// handles all fetch calls to backend
//const BASE_URL = 'http://localhost:5000/api';

const BASE_URL = '/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Auth API
const authAPI = {
  register: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

// Internship API
const internshipAPI = {
  search: async (filters) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/internships?${query}`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/internships/${id}`);
    return res.json();
  },

  post: async (data) => {
    const res = await fetch(`${BASE_URL}/internships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  //for delete 
  delete: async (id) => {
  const res = await fetch(`${BASE_URL}/internships/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
},

edit: async (id, data) => {
  const res = await fetch(`${BASE_URL}/internships/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}



};

// Application API
const applicationAPI = {
  apply: async (internshipId, coverLetter) => {
    const res = await fetch(`${BASE_URL}/applications/${internshipId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ coverLetter })
    });
    return res.json();
  },

  getMyApplications: async () => {
    const res = await fetch(`${BASE_URL}/applications/my`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  }
};

// Profile API
const profileAPI = {
  save: async (data) => {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/profile/me`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  getSkillGap: async (internshipId) => {
    const res = await fetch(`${BASE_URL}/profile/skillgap/${internshipId}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  }
};

// Report API
const reportAPI = {
  report: async (internshipId, reason) => {
    const res = await fetch(`${BASE_URL}/internships/${internshipId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ reason })
    });
    return res.json();
  }
};

// Admin API
const adminAPI = {
  getCompanies: async () => {
    const res = await fetch(`${BASE_URL}/admin/companies`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  verifyCompany: async (companyId) => {
    const res = await fetch(`${BASE_URL}/admin/verify/${companyId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  unverifyCompany: async (companyId) => {
    const res = await fetch(`${BASE_URL}/admin/unverify/${companyId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  getReports: async () => {
    const res = await fetch(`${BASE_URL}/admin/reports`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  deleteInternship: async (id) => {
    const res = await fetch(`${BASE_URL}/admin/internship/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },
  
  dismissReport: async (id) => {
  const res = await fetch(`${BASE_URL}/internships/${id}/dismiss`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}


};

