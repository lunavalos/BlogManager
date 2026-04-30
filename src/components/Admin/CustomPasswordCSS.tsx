import React from 'react'

const CustomPasswordCSS: React.FC = () => {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      /* Hide Payload's default Change Password button and field */
      .field-type.password .change-password {
        display: none !important;
      }
      .field-type.password {
        display: none !important;
      }
      /* Aggressive hide for auth section if it persists */
      .auth-section, .change-password-button, [class*="change-password"], [id*="password"] {
        display: none !important;
      }
      /* Hide the confirmation fields if they were triggered */
      .field-type.password-confirm, .field-type.confirm-password {
         display: none !important;
      }
      /* Hide buttons in the password field section */
      .field-type.password button {
         display: none !important;
      }
    `}} />
  )
}

export default CustomPasswordCSS
