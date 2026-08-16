// ========================================
// FILE: form.js
// LOCATION: /your-github-repo/form.js
// PURPOSE: Complete frontend with security features
// ========================================

// ========================================
// PROGRAMME DATA
// ========================================

const programmes = {
	btech: [
		"B-Tech Renewable Energy",
		"B-Tech Construction Technology and Management",
		"B-Tech Mechanical Engineering",
		"B-Tech Civil Engineering",
		"B-Tech Electrical/Electronic Engineering",
		"B-Tech Automation Engineering",
		"B-Tech Hospitality and Management Studies",
		"B-Tech Agricultural Engineering",
		"B-Tech Food and Postharvest Technology",
		"B.Tech Accounting",
		"B.Tech Marketing Studies",
		"B.Tech Entrepreneurship and Business Innovation",
		"B.Tech Tourism Management",
		"B.Tech Fashion Design and Textile Technology",
		"B.Tech Statistics and Computer Studies",
		"B.Tech Secretaryship & Management Studies",
		"B.Tech Procurement & Supply Chain Management",
		"B.Tech Environment Management Technology",
		"B-Tech Agribusiness Management & Entrepreneurship",
		"B-Tech Arts and Design (Graphics & Multimedia Studies)",
		"B-Tech ICT (Virtualization and Cloud Computing Technology)"
	],
	hnd: [
		"HND Accountancy Studies (Regular/Evening/Weekend)",
		"HND Marketing Studies (Regular)",
		"HND Secretaryship & Management Studies (Regular /Evening Session)",
		"HND Purchasing and Supply (Regular /Weekend Session)",
		"HND Mechanical Engineering (Regular /Weekend Session)",
		"HND Electrical/Electronic Engineering (Regular /Weekend Session)",
		"HND Hotel, Catering and Institutional Management (Regular /Weekend Session)",
		"HND Fashion, Design & Textile Studies (Regular /Weekend Session)",
		"HND Civil Engineering (Regular)",
		"HND Building Technology (Regular)",
		"HND Tourism (Regular)",
		"HND Statistics (Regular)"
	],
	diploma: [
		"Diploma in Business Administration",
		"Diploma in Banking Technology & Accounting",
		"Diploma in Computerized Accounting",
		"Diploma in Public Relations",
		"Diploma in Electronic Marketing",
		"Diploma in Procurement Management",
		"Diploma in Hospitality and Institutional Management",
		"Diploma in Fashion Design and Textile Technology",
		"Diploma in Tourism and Hospitality Management",
		"Diploma in Mechanical Engineering",
		"Diploma in Estimation and Quantity Surveying",
		"Diploma in Food and Postharvest Technology",
		"Diploma in Civil Engineering",
		"Diploma in Renewable Energy",
		"Diploma in Statistics",
		"Diploma in Arts and Design",
		"Diploma in Library and information Studies",
		"Diploma in Computer Science",
		"Diploma in Business Innovation and Entrepreneurships"
	]
};

// ========================================
// UPDATE PROGRAMMES
// ========================================

function updateProgrammes() {
	const category = document.getElementById('programme-category').value;
	const programmeSelect = document.getElementById('program');
	
	programmeSelect.innerHTML = '<option value="">Select Programme</option>';
	
	if (category && programmes[category]) {
		programmes[category].forEach(function(program) {
			const option = document.createElement('option');
			option.value = program;
			option.textContent = program;
			programmeSelect.appendChild(option);
		});
	}
}

// ========================================
// CSRF TOKEN MANAGEMENT
// ========================================

let csrfToken = '';
let csrfExpires = 0;

function getCsrfToken() {
	return fetch(`${CONFIG.backendApi}?action=get-csrf-token`)
	.then(response => response.json())
	.then(data => {
		csrfToken = data.token;
		csrfExpires = Date.now() + (data.expires * 1000);
		// Store in hidden field
		const tokenField = document.getElementById('csrf-token');
		if (tokenField) tokenField.value = csrfToken;
		// Also store in localStorage for verification
		localStorage.setItem('csrf_token', csrfToken);
		console.log('✅ CSRF token acquired');
		return csrfToken;
	})
	.catch(error => {
		console.error('❌ CSRF token error:', error);
		return null;
	});
}

function verifyCsrfToken(token) {
	return fetch(`${CONFIG.backendApi}?action=verify-csrf`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ csrf_token: token })
	})
	.then(response => response.json())
	.then(data => data.valid === true)
	.catch(() => false);
}

// ========================================
// DARK MODE TOGGLE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM fully loaded');
	
	// Initialize EmailJS if configured
	if (typeof emailjs !== 'undefined' && CONFIG.emailjsPublicKey && CONFIG.emailjsPublicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
		emailjs.init(CONFIG.emailjsPublicKey);
		console.log('✅ EmailJS initialized');
	}
	
	// Get CSRF token
	getCsrfToken();
	
	// Dark Mode Toggle
	const themeToggle = document.getElementById('theme-toggle-form');
	
	if (themeToggle) {
		const savedTheme = localStorage.getItem('form-theme');
		if (savedTheme === 'dark') {
			document.body.setAttribute('data-theme', 'dark');
			themeToggle.textContent = '☀️ Light Mode';
		} else {
			document.body.setAttribute('data-theme', 'light');
			themeToggle.textContent = '🌙 Dark Mode';
		}
		
		themeToggle.addEventListener('click', function() {
			const currentTheme = document.body.getAttribute('data-theme');
			
			if (currentTheme === 'dark') {
				document.body.setAttribute('data-theme', 'light');
				themeToggle.textContent = '🌙 Dark Mode';
				localStorage.setItem('form-theme', 'light');
			} else {
				document.body.setAttribute('data-theme', 'dark');
				themeToggle.textContent = '☀️ Light Mode';
				localStorage.setItem('form-theme', 'dark');
			}
		});
	}
	
	// ========================================
	// CHECK PAYMENT ON PAGE LOAD
	// ========================================
	
	const paymentVerified = localStorage.getItem('payment_verified') === 'true';
	const paymentName = localStorage.getItem('payment_name') || '';
	const paymentPhone = localStorage.getItem('payment_phone') || '';
	
	if (paymentVerified && paymentName && paymentPhone) {
		console.log('✅ Payment already verified, showing form...');
		const paymentSection = document.getElementById('payment-section');
		const formSection = document.getElementById('registration-form-section');
		if (paymentSection) paymentSection.style.display = 'none';
		if (formSection) {
			formSection.style.display = 'block';
			const fullNameField = document.getElementById('full-name');
			const phoneField = document.getElementById('phone');
			if (fullNameField) fullNameField.value = paymentName;
			if (phoneField) phoneField.value = paymentPhone;
		}
	}
	
	// ========================================
	// ATTACH PAYSTACK BUTTON
	// ========================================
	
	const payBtn = document.getElementById('paystack-pay');
	if (payBtn) {
		console.log('✅ Pay button found');
		payBtn.addEventListener('click', function(e) {
			console.log('🖱️ Pay button clicked!');
			payWithPaystack();
		});
	}
});

// ========================================
// 🔒 PAYSTACK PAYMENT WITH SECURITY
// ========================================

function payWithPaystack() {
	console.log('🟢 payWithPaystack() called');
	
	const paymentName = document.getElementById('payment-name').value.trim();
	const paymentEmail = document.getElementById('payment-email').value.trim();
	const paymentPhone = document.getElementById('payment-phone').value.trim();
	const statusDiv = document.getElementById('payment-status');
	const payBtn = document.getElementById('paystack-pay');
	
	// ========================================
	// VALIDATION
	// ========================================
	
	if (!paymentName) {
		showPaymentStatus('error', 'Please enter your full name', statusDiv);
		return;
	}
	
	if (!paymentEmail) {
		showPaymentStatus('error', 'Please enter your email address', statusDiv);
		return;
	}
	
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(paymentEmail)) {
		showPaymentStatus('error', 'Please enter a valid email address', statusDiv);
		return;
	}
	
	if (!paymentPhone || paymentPhone.length < 10) {
		showPaymentStatus('error', 'Please enter a valid 10-digit phone number', statusDiv);
		return;
	}
	
	if (typeof PaystackPop === 'undefined') {
		showPaymentStatus('error', 'Payment system not ready. Please refresh the page.', statusDiv);
		return;
	}
	
	// ========================================
	// 🔒 SECURE: Use fixed amount from CONFIG
	// ========================================
	
	const reference = 'CCTU-' + Date.now().toString().slice(-8) + '-' + 
	Math.random().toString(36).substring(2, 6).toUpperCase();
	
	// Show loading
	showPaymentStatus('info', 'Opening payment window...', statusDiv);
	payBtn.disabled = true;
	payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
	
	// ========================================
	// 🔒 SECURE: Get CSRF token before payment
	// ========================================
	
	getCsrfToken().then(token => {
		if (!token) {
			showPaymentStatus('error', 'Security verification failed. Please refresh.', statusDiv);
			payBtn.disabled = false;
			payBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pay GH₵ 20.00 Now';
			return;
		}
		
		try {
			const handler = PaystackPop.setup({
				key: CONFIG.paystackPublicKey,
				email: paymentEmail,
				amount: CONFIG.amount, // 🔒 Fixed amount from config
				currency: CONFIG.currency,
				ref: reference,
				metadata: {
					custom_fields: [
						{ display_name: "Full Name", variable_name: "full_name", value: paymentName },
						{ display_name: "Phone Number", variable_name: "phone_number", value: paymentPhone },
						{ display_name: "CSRF Token", variable_name: "csrf_token", value: token }
					]
				},
				// ========================================
				// 🔒 CALLBACK: Verify payment with server
				// ========================================
				callback: function(response) {
					console.log('✅ Payment successful! Reference:', response.reference);
					// 🔒 SERVER-SIDE VERIFICATION
					verifyPaymentWithServer(response.reference, paymentName, paymentPhone, paymentEmail);
				},
				onClose: function() {
					showPaymentStatus('error', 'Payment cancelled. Please try again.', statusDiv);
					payBtn.disabled = false;
					payBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pay GH₵ 20.00 Now';
				}
			});
			
			handler.openIframe();
			
		} catch (error) {
			console.error('❌ Paystack Error:', error);
			showPaymentStatus('error', 'Error: ' + error.message, statusDiv);
			payBtn.disabled = false;
			payBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pay GH₵ 20.00 Now';
		}
	});
}

// ========================================
// 🔒 SERVER-SIDE PAYMENT VERIFICATION
// ========================================

function verifyPaymentWithServer(reference, name, phone, email) {
	console.log('🔍 Verifying payment with server...');
	
	const statusDiv = document.getElementById('payment-status');
	const payBtn = document.getElementById('paystack-pay');
	
	showPaymentStatus('info', '🔍 Verifying payment with server...', statusDiv);
	
	// ========================================
	// 🔒 SECURE: Send reference to backend for verification
	// ========================================
	
	fetch(`${CONFIG.backendApi}?action=verify-payment`, {
		method: 'POST',
	   headers: { 'Content-Type': 'application/json' },
	   body: JSON.stringify({ 
		   reference: reference,
		   csrf_token: csrfToken 
	   })
	})
	.then(response => response.json())
	.then(data => {
		console.log('Verification response:', data);
		
		if (data.verified) {
			// ========================================
			// ✅ CORRECT AMOUNT - Unlock form
			// ========================================
			
			showPaymentStatus('success', `
			<i class="fas fa-check-circle"></i> 
			✅ Payment Verified Successfully!<br>
			Amount: GH₵ ${data.amount}<br>
			Reference: ${reference}
			<br><br>
			<strong>Accessing registration form...</strong>
			`, statusDiv);
			
			// Store payment info
			localStorage.setItem('payment_verified', 'true');
			localStorage.setItem('payment_name', name);
			localStorage.setItem('payment_phone', phone);
			localStorage.setItem('payment_email', email);
			localStorage.setItem('payment_reference', reference);
			
			// Unlock the form
			setTimeout(() => {
				document.getElementById('payment-section').style.display = 'none';
				document.getElementById('registration-form-section').style.display = 'block';
				document.getElementById('full-name').value = name;
				document.getElementById('phone').value = phone;
				
				// Send confirmation email
				sendVerificationEmail(name, phone, email, reference);
				
				document.getElementById('registration-form-section').scrollIntoView({ 
					behavior: 'smooth', 
					block: 'start' 
				});
			}, 1500);
			
		} else {
			// ========================================
			// ❌ WRONG AMOUNT - TAMPERING DETECTED
			// ========================================
			
			console.warn('⚠️ FRAUD ATTEMPT DETECTED:', data);
			
			showPaymentStatus('error', `
			<i class="fas fa-exclamation-triangle"></i>
			🔒 Security Alert: Payment verification failed.<br>
			${data.error || 'Unknown error'}<br>
			<small>Expected: GH₵ 20.00 | Actual: GH₵ ${data.actual || 'unknown'}</small>
			<br><br>
			<small>Please contact support if you believe this is an error.</small>
			`, statusDiv);
			
			payBtn.disabled = false;
			payBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pay GH₵ 20.00 Now';
		}
	})
	.catch(error => {
		console.error('❌ Verification error:', error);
		showPaymentStatus('error', 'Payment verification failed. Please contact support.', statusDiv);
		payBtn.disabled = false;
		payBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pay GH₵ 20.00 Now';
	});
}

// ========================================
// SHOW PAYMENT STATUS
// ========================================

function showPaymentStatus(type, message, statusDiv) {
	if (!statusDiv) return;
	
	statusDiv.style.display = 'block';
	statusDiv.className = 'payment-status-message';
	
	if (type === 'success') {
		statusDiv.className = 'payment-status-message success';
		statusDiv.style.border = '2px solid #2ecc71';
		statusDiv.style.color = '#2ecc71';
		statusDiv.style.background = 'rgba(46, 204, 113, 0.1)';
	} else if (type === 'error') {
		statusDiv.className = 'payment-status-message error';
		statusDiv.style.border = '2px solid #e74c3c';
		statusDiv.style.color = '#e74c3c';
		statusDiv.style.background = 'rgba(231, 76, 60, 0.1)';
	} else if (type === 'info') {
		statusDiv.className = 'payment-status-message info';
		statusDiv.style.border = '2px solid #3498db';
		statusDiv.style.color = '#3498db';
		statusDiv.style.background = 'rgba(52, 152, 219, 0.1)';
	}
	
	statusDiv.innerHTML = message;
}

// ========================================
// SEND CONFIRMATION EMAIL (Optional)
// ========================================

function sendVerificationEmail(name, phone, email, reference) {
	console.log('📧 Sending confirmation email to:', email);
	
	// EmailJS is optional - skip if not configured
	if (typeof emailjs === 'undefined' || !CONFIG.emailjsServiceId) {
		console.warn('⚠️ EmailJS not configured. Skipping confirmation email.');
		return Promise.resolve();
	}
	
	const templateParams = {
		to_email: email,
		to_name: name,
		application_id: reference,
		submission_date: new Date().toLocaleString('en-GB', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		}),
		phone: phone
	};
	
	return emailjs.send(
		CONFIG.emailjsServiceId,
		CONFIG.emailjsTemplateId,
		templateParams
	)
	.then(response => {
		console.log('✅ Confirmation email sent successfully!', response);
		return response;
	})
	.catch(error => {
		console.error('❌ EmailJS error:', error);
		return null;
	});
}

// ========================================
// FORM SUBMISSION - WITH CSRF PROTECTION
// ========================================

window.submitForm = function(event) {
	event.preventDefault();
	console.log('🟢 Form submission triggered!');
	
	const form = document.getElementById('enlistment-form');
	const statusDiv = document.getElementById('form-status');
	const formData = new FormData(form);
	const data = Object.fromEntries(formData.entries());
	
	console.log('Form data:', data);
	
	// ========================================
	// 🔒 CSRF VERIFICATION
	// ========================================
	
	const submittedToken = document.getElementById('csrf-token').value;
	const storedToken = localStorage.getItem('csrf_token');
	
	// Check if token exists
	if (!submittedToken || submittedToken !== storedToken) {
		statusDiv.style.display = 'block';
		statusDiv.className = 'form-status-message error';
		statusDiv.style.border = '2px solid #e74c3c';
		statusDiv.style.color = '#e74c3c';
		statusDiv.style.background = 'rgba(231, 76, 60, 0.1)';
		statusDiv.innerHTML = `
		<i class="fas fa-exclamation-triangle"></i> 
		🔒 Security verification failed. Please refresh the page and try again.
		`;
		return false;
	}
	
	// ========================================
	// 🔒 VERIFY WITH SERVER
	// ========================================
	
	statusDiv.style.display = 'block';
	statusDiv.className = 'form-status-message';
	statusDiv.style.border = '2px solid #ffcc00';
	statusDiv.style.color = '#ffcc00';
	statusDiv.style.background = 'rgba(255, 204, 0, 0.1)';
	statusDiv.innerHTML = `
	<i class="fas fa-spinner fa-spin" style="font-size: 2rem; display: block; margin-bottom: 10px;"></i>
	<strong>Verifying security...</strong>
	`;
	
	verifyCsrfToken(submittedToken).then(isValid => {
		if (!isValid) {
			statusDiv.className = 'form-status-message error';
			statusDiv.style.border = '2px solid #e74c3c';
			statusDiv.style.color = '#e74c3c';
			statusDiv.style.background = 'rgba(231, 76, 60, 0.1)';
			statusDiv.innerHTML = `
			<i class="fas fa-exclamation-triangle"></i> 
			🔒 Security verification failed. Please refresh the page.
			`;
			return;
		}
		
		// ✅ CSRF verified - proceed with submission
		submitFormData();
	});
	
	return false;
};

// ========================================
// SUBMIT FORM DATA (After Security Check)
// ========================================

function submitFormData() {
	const form = document.getElementById('enlistment-form');
	const statusDiv = document.getElementById('form-status');
	const formData = new FormData(form);
	const data = Object.fromEntries(formData.entries());
	
	console.log('✅ Proceeding with form submission');
	
	// ========================================
	// VALIDATION
	// ========================================
	
	const requiredFields = ['Full Name', 'Age', 'Telephone', 'Height', 'Blood Group', 'Index Number', 'Programme Category', 'Programme', 'Level', 'Hall of Affiliation', 'Reason for Joining', 'Date', 'Signature'];
	
	for (let field of requiredFields) {
		if (!data[field] || data[field].trim() === '') {
			statusDiv.style.display = 'block';
			statusDiv.className = 'form-status-message error';
			statusDiv.style.border = '2px solid #e74c3c';
			statusDiv.style.color = '#e74c3c';
			statusDiv.style.background = 'rgba(231, 76, 60, 0.1)';
			statusDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.<br><small>Missing: ${field}</small>`;
			return;
		}
	}
	
	if (data['Telephone'] && !/^[0-9]{10}$/.test(data['Telephone'].replace(/\s/g, ''))) {
		statusDiv.style.display = 'block';
		statusDiv.className = 'form-status-message error';
		statusDiv.style.border = '2px solid #e74c3c';
		statusDiv.style.color = '#e74c3c';
		statusDiv.style.background = 'rgba(231, 76, 60, 0.1)';
		statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a valid 10-digit phone number';
		return;
	}
	
	if (!data['Declaration'] || !data['Oath Accepted']) {
		statusDiv.style.display = 'block';
		statusDiv.className = 'form-status-message error';
		statusDiv.style.border = '2px solid #e74c3c';
		statusDiv.style.color = '#e74c3c';
		statusDiv.style.background = 'rgba(231, 76, 60, 0.1)';
		statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please accept the declaration and oath to proceed';
		return;
	}
	
	// ========================================
	// GENERATE APPLICATION ID
	// ========================================
	
	const appId = 'CCTU-' + Date.now().toString().slice(-8);
	const submissionDate = new Date().toLocaleString('en-GB', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});
	
	// ========================================
	// SHOW LOADING STATE
	// ========================================
	
	statusDiv.style.display = 'block';
	statusDiv.className = 'form-status-message';
	statusDiv.style.border = '2px solid #ffcc00';
	statusDiv.style.color = '#ffcc00';
	statusDiv.style.background = 'rgba(255, 204, 0, 0.1)';
	statusDiv.innerHTML = `
	<i class="fas fa-spinner fa-spin" style="font-size: 2rem; display: block; margin-bottom: 10px;"></i>
	<strong>Submitting your application...</strong>
	<br><span style="font-size: 0.9rem; font-weight: 400;">Please wait, this may take a few moments.</span>
	`;
	
	const submitBtn = form.querySelector('.btn-submit');
	submitBtn.disabled = true;
	submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
	
	// Add metadata to data
	data['Application ID'] = appId;
	data['Submission Date'] = submissionDate;
	data['Payment Status'] = 'Verified';
	data['Payment Reference'] = localStorage.getItem('payment_reference') || 'N/A';
	data['CSRF Token'] = document.getElementById('csrf-token').value;
	
	// ========================================
	// SEND TO ADMIN (FormSubmit)
	// ========================================
	
	fetch('https://formsubmit.co/ajax/hackermed.hack@proton.me', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then(response => response.json())
	.then(result => {
		console.log('✅ Admin email sent:', result);
		
		// ========================================
		// SEND CONFIRMATION TO APPLICANT
		// ========================================
		
		const applicantEmail = data['Email'] || '';
		const applicantName = data['Full Name'] || 'Applicant';
		const applicantPhone = data['Telephone'] || '';
		
		if (applicantEmail && CONFIG.emailjsServiceId) {
			return sendVerificationEmail(applicantName, applicantPhone, applicantEmail, appId);
		}
		return Promise.resolve();
	})
	.then(() => {
		showSuccess(data['Full Name'], appId, statusDiv, submitBtn, form);
	})
	.catch(error => {
		console.error('❌ Error:', error);
		showError(error, statusDiv, submitBtn);
	});
}

// ========================================
// SUCCESS & ERROR FUNCTIONS
// ========================================

function showSuccess(name, appId, statusDiv, submitBtn, form) {
	statusDiv.className = 'form-status-message success';
	statusDiv.style.border = '2px solid #2ecc71';
	statusDiv.style.color = '#2ecc71';
	statusDiv.style.background = 'rgba(46, 204, 113, 0.1)';
	statusDiv.innerHTML = `
	<i class="fas fa-check-circle" style="font-size: 2.5rem; display: block; margin-bottom: 10px;"></i>
	<strong style="font-size: 1.3rem;">Registration Submitted Successfully!</strong><br><br>
	<span style="font-size: 1rem; font-weight: 400; color: var(--text-color);">
	Thank you <strong>${name}</strong> for registering for the CCTU Army Cadet Corps.<br><br>
	<div style="background: rgba(255, 204, 0, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #ffcc00; max-width: 400px; margin: 10px auto;">
	<strong style="color: #ffcc00;">📋 Application ID:</strong><br>
	<span style="font-size: 1.2rem; font-weight: 700; color: #ffcc00;">${appId}</span>
	</div>
	<br>
	<span style="color: #aaaaaa; font-size: 0.9rem;">
	You will be contacted within 5-7 business days.<br>
	Keep your Application ID for future reference.
	</span>
	</span>
	<br><br>
	<div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 15px;">
	<button onclick="window.location.href='index.html'" class="btn-submit" style="padding: 12px 30px; font-size: 1rem; background: linear-gradient(135deg, #3498db, #2980b9); border: none; cursor: pointer; border-radius: 8px; color: white; font-weight: 700;">
	<i class="fas fa-home"></i> Return Home
	</button>
	<button onclick="window.location.reload()" class="btn-submit" style="padding: 12px 30px; font-size: 1rem; background: linear-gradient(135deg, #ffcc00, #f5a623); border: none; cursor: pointer; border-radius: 8px; color: #111; font-weight: 700;">
	<i class="fas fa-plus"></i> Submit Another
	</button>
	</div>
	`;
	
	submitBtn.disabled = false;
	submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
	
	const inputs = form.querySelectorAll('input, select, textarea');
	inputs.forEach(input => {
		input.disabled = true;
	});
	
	statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(error, statusDiv, submitBtn) {
	statusDiv.className = 'form-status-message error';
	statusDiv.style.border = '2px solid #e74c3c';
	statusDiv.style.color = '#e74c3c';
	statusDiv.style.background = 'rgba(231, 76, 60, 0.1)';
	statusDiv.innerHTML = `
	<i class="fas fa-exclamation-circle" style="font-size: 2rem; display: block; margin-bottom: 10px;"></i>
	<strong style="font-size: 1.2rem;">Submission Failed</strong><br><br>
	<span style="font-size: 1rem; font-weight: 400;">
	There was an error submitting your application. Please try again.<br><br>
	<span style="color: #aaaaaa; font-size: 0.9rem;">
	Error: ${error.message || 'Unknown error'}
	</span>
	</span>
	<br><br>
	<button onclick="window.location.reload()" class="btn-submit" style="padding: 10px 25px; font-size: 0.9rem; background: linear-gradient(135deg, #e74c3c, #c0392b); border: none; cursor: pointer; border-radius: 8px; color: white; font-weight: 700;">
	<i class="fas fa-redo"></i> Try Again
	</button>
	`;
	
	submitBtn.disabled = false;
	submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
}
