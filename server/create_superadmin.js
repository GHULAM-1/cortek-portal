// Create SuperAdmin User Script
// Run this with: node create_superadmin.js


const createSuperAdmin = async () => {
  const userData = {
    name: "Ibrahim Chaudhary",
    email: "ibrahimchaudhary421@gmail.com",
    password: "123123",
    role: "superAdmin"
  };

  try {
    console.log('🚀 Creating SuperAdmin user...');
    console.log('📧 Email:', userData.email);
    console.log('👤 Name:', userData.name);
    console.log('🔑 Role:', userData.role);

    const response = await fetch('http://localhost:5000/api/v1/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ SuperAdmin created successfully!');
    console.log('📋 Response:', response.data);

  } catch (error) {
    console.error('❌ Error creating SuperAdmin:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

// Run the script
createSuperAdmin();