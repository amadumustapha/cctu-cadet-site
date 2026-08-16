// ========================================
// FILE: config.js
// PURPOSE: Configuration - Public keys only!
// ========================================

// ⚠️ IMPORTANT: Only public keys go here
// NEVER put secret keys in frontend code!

const CONFIG = {
	// Paystack Public Key (safe to expose)
	paystackPublicKey: 'pk_live_1442b89e0480f57bf707f1d5289eff66d2a589fb',
	
	// Backend API URL (your PHP hosting)
	backendApi: 'https://cctu-backend.site.je/index.php',
	
	// Payment amount (in pesewas)
	amount: 2000,
	currency: 'GHS'
};

// Make config globally available
window.CONFIG = CONFIG;
