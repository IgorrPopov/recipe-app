const validator = require('validator');

const isReqValid = (userData, checkProperties) => {
  const result = { isValid: false, error: '' };
  const allowedData = Object.keys(checkProperties);

  if (JSON.stringify(userData) === '{}') {
    result.error = { general: 'Request is empty!' };
    return result;
  }

  Object.keys(userData).every((data, index , arr) => {
    
    if (arr.length !== allowedData.length || !allowedData.includes(data)) {
      result.error = { general: 'Request is invalid!' };
      return false;
    }

    if (!userData[data].length) {
      result.error = { [data]: `${data[0].toUpperCase()}${data.slice(1)} is empty!` };
      return false;  
    }

    return true;
  });

  if (result.error !== '') { 
    return result; 
  }

  result.isValid = true;

  return result;
};

const isNameValid = name => {
  if (name.length < 2) {
    return { isValid: false, error: { name: 'Name is to short!' } };
  }

  if (name.length > 25) {
    return { isValid: false, error: { name: 'Name is to long!' } };
  }

  if (!name.match(/^[\w -]{2,25}$/)) {
    return { isValid: false, error: { name: 'Only letters, numbers, hyphens, spaces and underscores!' } };
  }

  return { isValid: true };
};

const isEmailValid = email => {
  if (!validator.isEmail(email)) {
    return { isValid: false, error: { email: 'Email is not valid!' } };
  }

  return { isValid: true };
};

const isPasswordValid = password => {
  if (password.length < 7) {
    return { isValid: false, error: { password: 'Password is to short!' } };
  }

  if (password.length > 100) {
    return { isValid: false, error: { password: 'Password is to long!' } };
  }

  if (password.toLowerCase().includes('password')) {
    return { isValid: false, error: { password: 'Password cannot contain "password"!' } };
  }

  return { isValid: true };
};

const isUserDataValid = (userData, checkProperties = {}) => {
  
  const validReq = isReqValid(userData, checkProperties);

  if (!validReq.isValid) {
    return validReq;
  }


  if (checkProperties.name) {
    const validName = isNameValid(userData.name);

    if (!validName.isValid) {
      return validName;
    }
  }


  if (checkProperties.email) {
    const validEmail = isEmailValid(userData.email);

    if (!validEmail.isValid) {
      return validEmail;
    }
  }

  if (checkProperties.password) {
    const validPassword = isPasswordValid(userData.password);

    if (!validPassword.isValid) {
      return validPassword;
    }
  }

  return { isValid: true };
}

module.exports = isUserDataValid;