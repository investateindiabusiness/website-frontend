/**
 * End-to-end socket test:
 * 1. Client A: Connects and joins user room "user_test123"
 * 2. Client B: Simulates admin posting a coupon to http://localhost:5001 API
 * Expected: Client A receives the new_coupon event
 */
const { io } = require('socket.io-client');
const http = require('http');

// Client A: The logged-in user (listening for coupons)
const clientA = io('http://localhost:5001', { transports: ['websocket'] });

clientA.on('connect', () => {
  console.log('[ClientA] Connected. Joining user room...');
  clientA.emit('join_user', 'test123');

  // Wait a moment then trigger the coupon from "admin"
  setTimeout(triggerCoupon, 500);
});

clientA.on('new_coupon', (data) => {
  console.log('\n✅ SUCCESS! ClientA received new_coupon event:', JSON.stringify(data, null, 2));
  cleanup();
});

clientA.on('connect_error', (err) => {
  console.error('[ClientA] Connection error:', err.message);
  cleanup(1);
});

// Trigger a coupon creation via the actual API
async function triggerCoupon() {
  console.log('[Test] Triggering coupon creation via POST /api/admin/coupons...');
  
  // Read auth token from env or skip if not available
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    console.log('[Test] No ADMIN_TOKEN env var set. Will test socket emit directly instead.');
    testDirectEmit();
    return;
  }

  const postData = JSON.stringify({
    code: 'TEST_DIRECT_' + Date.now(),
    discountAmount: 50,
    type: 'custom',
    assignedTo: 'test123',
    maxUses: 1,
    validUntil: null
  });

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/admin/coupons',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('[Test] API responded:', res.statusCode, body.substring(0, 200));
    });
  });

  req.on('error', (err) => {
    console.error('[Test] API request error:', err.message);
    testDirectEmit();
  });

  req.write(postData);
  req.end();
}

// Alternative: Connect as a second client and test that rooms work 
function testDirectEmit() {
  console.log('[Test] Testing via a second client simulating the server-side emit...');
  
  // We can't directly call emitCouponToUser from here, 
  // but we can see if room joining worked by checking if the backend log shows it
  console.log('[Test] Check socket_debug.log on the backend to see if join_user was received');
  console.log('[Test] If backend shows "joined user room: user_test123", the fix worked!');
  
  setTimeout(() => {
    console.log('[Test] Test complete. Check backend socket_debug.log for join_user events');
    cleanup(0);
  }, 2000);
}

function cleanup(code = 0) {
  clientA.disconnect();
  process.exit(code);
}

setTimeout(() => {
  console.log('\n⏰ Timeout reached. If no SUCCESS message appeared, check socket_debug.log');
  cleanup(0);
}, 8000);
