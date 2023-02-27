import jwt from 'jsonwebtoken'
export default function generateToken(userId) {
    return jwt.sign({userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d'
    })
}