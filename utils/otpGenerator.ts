const generateOTP = () => {
  const digits = "123456789";
  let OTP = 0;

  for (let i = 0; i < 4; i++) {
    OTP = OTP * 10 + parseInt(digits[Math.floor(Math.random() * 10)]);
  }

  return OTP;
};

export { generateOTP };
