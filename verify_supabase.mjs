const url = 'https://uokipjqgcexcvpilpwrz.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVva2lwanFnY2V4Y3ZwaWxwd3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MDk1MzcsImV4cCI6MjEwODA4NTUzN30.EV2xbVu7dEh20hpoqx23d98650fNg0SRake2yfx7s9Y';

async function check() {
  console.log('--- Checking Supabase Connection ---');
  
  // 1. Health check
  try {
    const healthRes = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: anonKey }
    });
    console.log('Auth API status:', healthRes.status, await healthRes.json());
  } catch (err) {
    console.error('Auth API error:', err.message);
  }

  // 2. Check focus_sessions table
  try {
    const tableRes = await fetch(`${url}/rest/v1/focus_sessions?select=*`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      }
    });
    console.log('focus_sessions table HTTP status:', tableRes.status);
    const data = await tableRes.json();
    console.log('focus_sessions data:', data);
  } catch (err) {
    console.error('focus_sessions error:', err.message);
  }

  // 3. Check categories table
  try {
    const catRes = await fetch(`${url}/rest/v1/categories?select=*`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      }
    });
    console.log('categories table HTTP status:', catRes.status);
    const catData = await catRes.json();
    console.log('categories data:', catData);
  } catch (err) {
    console.error('categories error:', err.message);
  }

  // 4. Check storage bucket
  try {
    const storageRes = await fetch(`${url}/storage/v1/bucket/screenshots`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      }
    });
    console.log('Storage screenshots bucket status:', storageRes.status);
    const bucketData = await storageRes.json();
    console.log('bucket data:', bucketData);
  } catch (err) {
    console.error('storage error:', err.message);
  }
}

check();
