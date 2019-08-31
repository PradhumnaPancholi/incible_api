// this function for checking if password contains specific special characters //
const specialCharacters = ["*", "#", "$", "!", "@", "%", "^", "&"];

const checkSpecialCharacter = (password) => {
  const result = specialCharacters.some((el) => password.includes(el));
  if (result === true) {
    return true;
  // eslint-disable-next-line no-else-return
  } else {
    return false;
  }
};

module.exports = checkSpecialCharacter;
