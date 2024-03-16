module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        return req.redirect("login/login.ejs");
     }
     next();
}