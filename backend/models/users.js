class User {
    // constructor
    constructor(userObj) {
        this.userId = userObj.userId;
        this.userEmail = userObj.userEmail;
        // add info about the user's role --> role object
        if (userObj.role) {
            this.role = {}
            this.role.roleId = userObj.role.roleId;
            this.role.roleName = userObj.role.roleName;
            this.role.roleDescription = userObj.role.roleDescription;
        }
    }

}

module.exports = User;