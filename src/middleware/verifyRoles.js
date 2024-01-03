const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.idRole) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        //console.log("roles", rolesArray)
        const result = req.idRole.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles