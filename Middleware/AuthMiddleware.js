import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Không tìm thấy token' });
  }

  
  token = token.split(" ")[1]
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
    // Lưu thông tin người dùng đã xác minh từ token vào request để sử dụng trong các route tiếp theo nếu cần
    req.userId = decoded.id;
    req.username = decoded.username;

    next(); // Cho phép tiếp tục xử lý các middleware hoặc route tiếp theo
  });
};

