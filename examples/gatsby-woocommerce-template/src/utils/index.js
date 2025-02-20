/**
 * Check if a value is numeric
 * 
 * @param {string|number} str The value to check
 * @returns {boolean} Returns true if the value can be converted to a valid number
 */
export function isNumeric(str) {
  if (['string', 'number'].indexOf(typeof str) === -1) return false;
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

/**
 * Validate if the email address is in correct format
 * 
 * @param {string} email The email address to validate
 * @returns {boolean} Returns true if the email format is valid
 */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate if the password is strong
 * 
 * @param {string} password The password to validate
 * @returns {boolean} Returns true if the password is at least 8 characters long and contains at least one lowercase letter, one uppercase letter, and one number
 */
export function validateStrongPassword(password) {
  return /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password);
}

/**
 * Check if input value is empty
 * 
 * @param {*} input The value to check
 * @returns {boolean} Returns true if input is empty string, null or undefined
 */
export function isEmpty(input) {
  if (input === '' || input === null || input === undefined) return true;
}

/**
 * Check if user is logged in
 * 
 * @returns {boolean} Returns true if auth-token exists in browser environment,
 *                    Returns true in non-browser environment,
 *                    Returns false otherwise
 */
export function isLoggedIn() {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    const token = window.localStorage.getItem('auth-token');
    if (token) return true;
    else return false;
  } else {
    return true;
  }
}

/**
 * Capitalizes the first letter of each word in a string
 * 
 * @param {string} str The string to be transformed
 * @returns {string} The transformed string with first letter of each word capitalized
 */
export function capitalizeFirstLetter(str) {
  if (!str || typeof str !== 'string') return str;

  return str.split(' ').map(word => {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

