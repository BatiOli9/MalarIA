import jwt from 'jsonwebtoken';
import "dotenv/config";
import { client } from "../dbconfig.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const secret = "HolaMundo";

    if (!authHeader) {
      return res.status(401).json({ message: 'Falta proveer el Token' });
    }

    if (!authHeader.startsWith('Bearer ')){
      return res.status(401).json({ message: 'Formato Invalido' });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: 'Formato de Token Invalido' });
    }

    const decoded = jwt.verify(token, secret);

    console.log(decoded.userId);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Token Invalido' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
}

export const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const query = "SELECT * FROM public.users WHERE id = $1"
    const user = await client.query(query, [userId]);

    if (!user) {
      console.log("No se han encontrado usuarios con ese ID");
    }

    if (!user.admin) {
      console.log("El usuario no esta autorizado a realizar eso");
    }

    next();
  }
  catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}