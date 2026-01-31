import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please log in again.",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Change this line to set req.user instead of req.body.userId
    req.user = { id: decoded.id }
    next()
  } catch (error) {
    console.error("Authentication error:", error.message)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      })
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

export default authUser
