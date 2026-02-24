import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token tidak ada' });
    }

    const token = authHeader.split(' ')[1];

    // ⭐ decode token dulu
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('TOKEN DECODED:', decoded);

    // ⭐ mapping fleksibel
    req.user = {
      id: decoded.id || decoded.userId || decoded.sub
    };

    if (!req.user.id) {
      return res.status(401).json({ message: 'Token tidak memiliki user id' });
    }

    next();

  } catch (err) {
    console.error('TOKEN ERROR:', err);
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};