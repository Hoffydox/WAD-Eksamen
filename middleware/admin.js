module.exports = (req, res, next) => {
    if (req.user.role.roleName == 'admin') {
        next();
    } else {
        errorMessage= {
            statusCode: 401,
            message: 'Access denied: unauthorised.'
        }
        res.status(401).send(JSON.stringify(errorMessage));
    }
}