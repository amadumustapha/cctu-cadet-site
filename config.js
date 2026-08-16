// ========================================
// FILE: config.js
// LOCATION: / (root of your GitHub repo)
// PURPOSE: Configuration for frontend
// ========================================

const CONFIG = {
    // 🔥 UPDATED: Use proxy.php to bypass CORS
    backendApi: 'https://cctu-backend.site.je/proxy.php',
    
    // 🔑 YOUR PAYSTACK PUBLIC KEY
    paystackPublicKey: 'pk_live_1442b89e0480f57bf707f1d5289eff66d2a589fb',
    
    // Payment amount (DO NOT CHANGE)
    amount: 2000, // GH₵ 20.00 in pesewas
    currency: 'GHS',
    
    // EmailJS (Optional - only if you use it)
    emailjsPublicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
    emailjsServiceId: 'YOUR_EMAILJS_SERVICE_ID',
    emailjsTemplateId: 'YOUR_EMAILJS_TEMPLATE_ID'
};

// Make config available globally
window.CONFIG = CONFIG;
