const ValidationHelper = {
    validateName(name) {
      if (!name || name.length < 4 || name.length > 60) {
        return "Имя должно содержать от 4 до 60 символов.";
      }
      return null;
    },
    
    validatePhone(phone) {
      const phoneRegex = /^[+\d]?\d{6,20}$/;
      if (!phoneRegex.test(phone)) {
        return "Введите корректный номер телефона (6-20 символов).";
      }
      return null;
    },
    
    validateEmail(username) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!username || username.length < 5 || username.length > 100 || !emailRegex.test(username)) {
        return "Введите корректный email (5-100 символов).";
      }
      return null;
    },
    
    validateAddress(address) {
      if (address.length > 255) {
        return "Адрес не должен превышать 255 символов.";
      }
      return null;
    },
  };
  
  export default ValidationHelper;
  