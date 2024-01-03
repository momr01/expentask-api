const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    //console.log(cookies)
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    //console.log(refreshToken)

    const foundUser = await User.findOne({ refreshToken }).exec();
   // console.log(foundUser)
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const idRole = Object.values(foundUser.idRole);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "idRole": idRole
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }//the new acces token will last 
            );
            res.json({ accessToken })
            //do not return de password
        }
    );
}

module.exports = { handleRefreshToken }