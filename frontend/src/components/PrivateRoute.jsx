import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // cek token login (sesuaikan dengan sistem login kamu)
  const token = localStorage.getItem("token");

  // jika belum login → redirect ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // jika sudah login → tampilkan halaman
  return children;
};

export default PrivateRoute;