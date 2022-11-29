function isValidEmail(email){
    //var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail); 
    //return re.test(String(email).toLowerCase())
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email); 
}

module.exports = isValidEmail;