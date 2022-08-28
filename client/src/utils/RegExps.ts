export const onlyLettersPattern = new RegExp("^[a-z A-Z ,.'-]+$");
export const emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$");
export const passwordPattern = new RegExp("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$");