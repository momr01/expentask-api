const User = require('../model/User');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    const { username } = req.body;

    const cookies = req.cookies;
    //if (!cookies?.jwt) return res.sendStatus(204);//No content
    if (!cookies?.jwt) return res.sendStatus(501);
    const refreshToken = cookies.jwt;

    //Is the username in db?
    const foundUser = await User.findOne({ username }).exec();
    //if (!foundUser) return res.sendStatus(204); //No content
    if (!foundUser) return res.sendStatus(502);

    // Is refreshToken in db?
    //const foundUser = await User.findOne({ refreshToken }).exec();
    console.log(foundUser.refreshToken)
    console.log(refreshToken)
    if (foundUser.refreshToken !== refreshToken) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });//delete cookie
        // return res.sendStatus(204);
        return res.sendStatus(500);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }