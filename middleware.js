module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.orignalUrl;
        return req.redirect("login/login.ejs");
     }
     next();
};


module.exports.savedRedirectUrl = (req, res,next ) => {
    if (req.session.redirectUrl) {
        res.local.redirectUrl = req.session.redirectUrl;
    }
    next();
};