const authService = require('./auth.service')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    const { username, password } = req.body
    // console.log('username:', username);
    // console.log('password:', password);
    try {
        const user = await authService.login(username, password)
        req.session.user = user
        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const { username, password, fullname, isAdmin } = req.body
        // Never log passwords
        // logger.debug(fullname + ', ' + username + ', ' + password)
        const newUser = await authService.signup(username, password, fullname, isAdmin)
        logger.debug(`auth.route - new newUser created: ` + JSON.stringify(newUser))
        req.session.user = newUser
        res.json(newUser)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout
}