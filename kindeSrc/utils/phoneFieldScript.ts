/**
 * Returns an inline script for transforming the Kinde username field into a phone field.
 * 
 * This script:
 * - Transforms the standard text input into a phone number input with country code selector
 * - Handles back-navigation by parsing existing phone values (e.g., +14318445546)
 * - Combines country code + phone digits on form submission for E.164 format
 * 
 * NOTE: Returned as a string to support CSP nonce injection for security
 * 
 * @returns {string} Inline JavaScript to be injected with a nonce
 */
export function getPhoneFieldScript(): string {
  return `
    console.log('Phone field script loaded successfully');
    
    /**
     * Main transformation function that converts username field to phone input
     * Handles both initial creation and updates when values change
     * 
     * NOTE: This runs multiple times via MutationObserver to handle:
     * - Initial page load (when input exists but is empty)
     * - Late value population (Kinde populates field after initial render)
     * - Back navigation (field repopulated with previous value)
     */
    function transformUsernameToPhone() {
      const usernameInput = document.querySelector('input[name="p_username"]');
      if (!usernameInput) {
        return;
      }
      
      // Check if the phone UI we created still exists
      const phoneContainer = document.querySelector('[data-phone-input-container="true"]');
      
      // If phone container doesn't exist but input is marked as transformed,
      // it means Kinde reset the field (likely due to validation error)
      // Clear the flag to allow re-transformation
      const alreadyTransformed = usernameInput.getAttribute('data-phone-transformed');
      if (alreadyTransformed && !phoneContainer) {
        console.log('Phone field was reset by Kinde (validation error), clearing transformation flag');
        usernameInput.removeAttribute('data-phone-transformed');
        usernameInput.removeAttribute('data-last-processed-value');
      }
      
      // Prevent duplicate transformations by checking if already processed with this exact value
      const lastProcessedValue = usernameInput.getAttribute('data-last-processed-value');
      const currentValue = usernameInput.value || '';
      
      // Skip processing if UI is already built AND value hasn't changed since last processing
      if (alreadyTransformed && lastProcessedValue === currentValue && phoneContainer) {
        return;
      }
      
      console.log('Processing username input. Current value:', currentValue);
      usernameInput.setAttribute('data-phone-transformed', 'true');
      usernameInput.setAttribute('data-last-processed-value', currentValue);
      
      // Find parent form field container for styling consistency
      const formField = usernameInput.closest('[data-kinde-form-field]');
      if (!formField) {
        console.log('Could not find form field container');
        return;
      }
      
      // Update label to indicate this is a phone field (not username)
      const label = formField.querySelector('[data-kinde-control-label]');
      if (label) {
        label.textContent = 'Phone Number';
        console.log('Label updated to Phone Number');
      }
      
      // Create country code dropdown element with Kinde-compatible attributes
      const countrySelect = document.createElement('select');
      countrySelect.className = 'kinde-control-select-text';
      countrySelect.id = 'phone_country_code';
      countrySelect.name = 'phone_country_code';
      countrySelect.setAttribute('data-kinde-control-select-text', 'true');
      countrySelect.setAttribute('data-phone-country-code', 'true');
      
      // List of supported countries with their dialing codes
      // NOTE: Keep this list in sync with backend validation if needed
      const countries = [
        {code: '+1', flag: '🇺🇸'},
        {code: '+44', flag: '🇬🇧'},
        {code: '+91', flag: '🇮🇳'},
        {code: '+61', flag: '🇦🇺'},
        {code: '+81', flag: '🇯🇵'},
        {code: '+86', flag: '🇨🇳'},
        {code: '+49', flag: '🇩🇪'},
        {code: '+33', flag: '🇫🇷'},
        {code: '+39', flag: '🇮🇹'},
        {code: '+34', flag: '🇪🇸'},
        {code: '+52', flag: '🇲🇽'},
        {code: '+55', flag: '🇧🇷'},
        {code: '+7', flag: '🇷🇺'},
        {code: '+82', flag: '🇰🇷'},
        {code: '+65', flag: '🇸🇬'},
        {code: '+27', flag: '🇿🇦'},
        {code: '+64', flag: '🇳🇿'},
        {code: '+977', flag: '🇳🇵'}
      ];
      
      // Parse existing phone value if it contains country code (e.g., from back navigation)
      let detectedCountryCode = null;
      const initialValue = currentValue;

      console.log("Processing username value:", initialValue);
      
      if (initialValue && initialValue.startsWith('+')) {
        // Sort country codes by length (longest first) to match correctly
        // Example: '+977' must be checked before '+1' to avoid false matches
        const sortedCodes = countries.map(c => c.code).sort((a, b) => b.length - a.length);
        
        for (let i = 0; i < sortedCodes.length; i++) {
          const code = sortedCodes[i];
          if (initialValue.startsWith(code)) {
            const phoneDigits = initialValue.substring(code.length);
            // Ensure remaining value is only digits (validation check)
            if (phoneDigits && /^\\d+$/.test(phoneDigits)) {
              detectedCountryCode = code;
              console.log('Detected existing country code:', detectedCountryCode, 'digits:', phoneDigits);
              usernameInput.value = phoneDigits; // Store only digits in input, code goes in dropdown
              usernameInput.setAttribute('data-last-processed-value', phoneDigits);
              break;
            }
          }
        }
        
        if (!detectedCountryCode) {
          console.log('Could not match country code from known list');
        }
      }
      
      // Build dropdown options
      countries.forEach(function(country) {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.flag + ' ' + country.code;
        if (detectedCountryCode && country.code === detectedCountryCode) {
          option.selected = true; // Pre-select if we parsed this code from existing value
        }
        countrySelect.appendChild(option);
      });
      
      // Check if country selector UI already exists (handles re-runs on value changes)
      const existingCountrySelect = document.querySelector('[data-phone-country-code="true"]');
      if (existingCountrySelect && detectedCountryCode) {
        // Just update the selection without rebuilding UI
        existingCountrySelect.value = detectedCountryCode;
        console.log('Updated existing dropdown to:', detectedCountryCode);
        return;
      }
      
      // Skip UI creation if selector already exists but no new code detected
      if (existingCountrySelect) {
        console.log('Phone field UI already exists, skipping creation');
        return;
      }
      
      // Create flexbox container for side-by-side country code + phone number layout
      const newPhoneContainer = document.createElement('div');
      newPhoneContainer.setAttribute('data-phone-input-container', 'true');
      newPhoneContainer.style.display = 'flex';
      newPhoneContainer.style.gap = '0.5rem';
      newPhoneContainer.style.alignItems = 'stretch'; // Ensures both fields same height
      newPhoneContainer.style.width = '100%';
      
      // Configure phone input field for tel input
      usernameInput.type = 'tel';
      usernameInput.placeholder = 'Enter phone number';
      usernameInput.autocomplete = 'tel';
      usernameInput.setAttribute('data-phone-number-input', 'true');
      
      // Insert container before input, then move input and dropdown into it
      usernameInput.parentNode.insertBefore(newPhoneContainer, usernameInput);
      newPhoneContainer.appendChild(countrySelect);
      newPhoneContainer.appendChild(usernameInput);
      
      // Style country dropdown to match form aesthetic (border-bottom only, transparent bg)
      countrySelect.style.flex = '0 0 auto'; // Fixed width, don't grow
      countrySelect.style.width = '120px';
      countrySelect.style.padding = '0.75rem 0.5rem';
      countrySelect.style.border = 'none';
      countrySelect.style.borderBottom = '1px solid #184027';
      countrySelect.style.backgroundColor = 'transparent';
      countrySelect.style.fontSize = '1rem';
      countrySelect.style.cursor = 'pointer';
      countrySelect.style.outline = 'none';
      countrySelect.style.fontFamily = 'inherit';
      countrySelect.style.lineHeight = 'inherit';
      
      // Style phone input to fill remaining space
      usernameInput.style.flex = '1'; // Take all available space
      usernameInput.style.minWidth = '0'; // Allow flex shrinking
      
      // Attach form submission handler to combine country code + phone digits
      const allForms = document.querySelectorAll('form');
      console.log('Total forms found:', allForms.length);
      
      // NOTE: Form index 1 is the actual registration form (index 0 is internal)
      // This is specific to Kinde's widget structure
      const form = allForms[1];
      if (form) {
        console.log('Using Form 1 for submission:', form);

        const submitButton = form.querySelector('button[type="submit"]');
        console.log('Submit button found:', submitButton);
        
        if (submitButton) {
          submitButton.addEventListener('click', function(e) {
            console.log('Submit button clicked');
            
            // Check if terms acceptance checkbox exists and is required
            const termsCheckbox = form.querySelector('input[name="p_has_clickwrap_accepted"][type="checkbox"]');
            if (termsCheckbox && !termsCheckbox.checked) {
              console.log('Terms not accepted, skipping phone transformation');
              return; // Let form validation handle the error
            }
            
            console.log('Transforming phone number');
            // Retrieve selected country code from dropdown
            const countryCode = countrySelect.value || '+1';
            // Get phone digits from input
            const phoneNumber = usernameInput.value || '';
            
            // Combine into E.164 format before sending to backend
            if (phoneNumber) {
              usernameInput.value = countryCode + phoneNumber;
              console.log('Phone field transformed to: ' + usernameInput.value);
            }
          });
        }
      } else {
        console.log('Form 1 not found');
      }
      
      console.log('Phone field transformation complete');
    }
    
    // Execute transformation when DOM is ready (handles both early and late-loading pages)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', transformUsernameToPhone);
    } else {
      transformUsernameToPhone();
    }
    
    // Watch for dynamic DOM changes to catch late value population by Kinde
    // This handles the case where the username field value is populated after initial render
    const observer = new MutationObserver(function(mutations) {
      transformUsernameToPhone();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Stop observing after 5 seconds to avoid memory leaks
    // By this time, all value population should be complete
    setTimeout(function() { observer.disconnect(); }, 5000);
  `;
}
