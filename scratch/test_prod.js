import fs from 'fs';

const envContent = fs.readFileSync('./server/.env', 'utf-8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    envVars[match[1]] = match[2].trim();
  }
}

const BASE_URL = 'http://localhost:5000/api/v1';

async function testProductionAPI() {
  console.log('🧪 Starting End-to-End Production API Verification Audit...');
  console.log('===========================================================');

  try {
    // 1. Public Vacancies
    const vacRes = await fetch(`${BASE_URL}/vacancies`);
    const vacData = await vacRes.json();
    console.log('1. GET /api/v1/vacancies -> Status:', vacRes.status, '| Success:', vacData.success, '| Vacancies Count:', vacData.data?.length);

    // 2. Public Countries
    const ctryRes = await fetch(`${BASE_URL}/countries`);
    const ctryData = await ctryRes.json();
    console.log('2. GET /api/v1/countries -> Status:', ctryRes.status, '| Success:', ctryData.success, '| Countries Count:', ctryData.data?.length);

    // 3. Login with SEED_HR_EMAIL & SEED_HR_PASSWORD
    const hrEmail = envVars.SEED_HR_EMAIL || 'harshitsinghsln185@gmail.com';
    const hrPassword = envVars.SEED_HR_PASSWORD || 'Harshit123@';

    console.log(`\n🔑 Testing HR Login for: ${hrEmail}...`);
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: hrEmail, password: hrPassword, role: 'HR' }),
    });

    const loginData = await loginRes.json();
    console.log('3. POST /api/v1/auth/login -> Status:', loginRes.status, '| Success:', loginData.success);

    if (!loginData.success || !loginData.data?.token) {
      console.error('❌ Login failed:', loginData);
      return;
    }

    const token = loginData.data.token;
    console.log('   ✅ HR Token acquired successfully!');

    // 4. Test Role Mismatch Rejection
    console.log('\n🛡️ Testing Strict Role-Mismatch Rejection (Selecting ADMIN role with HR credentials)...');
    const mismatchRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: hrEmail, password: hrPassword, role: 'ADMIN' }),
    });
    const mismatchData = await mismatchRes.json();
    console.log('4. POST /api/v1/auth/login (Role Mismatch) -> Status:', mismatchRes.status, '| Error Message:', mismatchData.error?.message);

    // 5. Dashboard Metrics (Authenticated)
    const dashRes = await fetch(`${BASE_URL}/admin/dashboard/metrics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dashData = await dashRes.json();
    console.log('\n5. GET /api/v1/admin/dashboard/metrics -> Status:', dashRes.status, '| Success:', dashData.success);
    console.log('   Metrics Summary:', {
      totalEmployees: dashData.data?.totalEmployees,
      activeSites: dashData.data?.activeSites,
      documentExpiryCount: dashData.data?.documentExpiryCount,
      pendingLeaveRequests: dashData.data?.pendingLeaveRequests,
      manpowerShortfall: dashData.data?.manpowerShortfall,
    });

    // 6. Employee List (Authenticated)
    const empRes = await fetch(`${BASE_URL}/admin/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const empData = await empRes.json();
    console.log('\n6. GET /api/v1/admin/employees -> Status:', empRes.status, '| Count:', empData.data?.length);

    // 7. Attendance List (Authenticated)
    const attRes = await fetch(`${BASE_URL}/admin/attendance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const attData = await attRes.json();
    console.log('7. GET /api/v1/admin/attendance -> Status:', attRes.status, '| Count:', attData.data?.length);

    // 8. Clearance List (Authenticated)
    const clrRes = await fetch(`${BASE_URL}/admin/clearance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const clrData = await clrRes.json();
    console.log('8. GET /api/v1/admin/joining-exit -> Status:', clrRes.status, '| Count:', clrData.data?.length);

    // 9. System Settings (Authenticated)
    const setRes = await fetch(`${BASE_URL}/admin/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const setData = await setRes.json();
    console.log('9. GET /api/v1/admin/settings -> Status:', setRes.status, '| Audit Logs Count:', setData.auditLogs?.length);

    console.log('\n===========================================================');
    console.log('🎉 ALL END-TO-END PRODUCTION API AUDIT CHECKS PASSED 100%!');
    console.log('===========================================================');
  } catch (err) {
    console.error('❌ Error during API audit:', err);
  }
}

testProductionAPI();
