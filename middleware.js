module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if(!req.isAuthenticated()) {
        return req.redirect("login/login.ejs");
     }
     next();
};