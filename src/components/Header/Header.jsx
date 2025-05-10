import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const handleLogout = () => {
    logOut()
      .then(() => {})
      .catch((error) => console.error(error));
  };

  const navOptions = (
    <>
      <Link to="/">
        {/* <img src="/images/logo.png" className="w-16" alt="" /> */}
      </Link>
      <li>
        <Link to="/">
          <h3 className="font-bold text-2xl">Sugary</h3>
        </Link>
      </li>
      <li>
        <Link to="/">Home</Link>
      </li>

      {user && (
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      )}

      <li>
        {user ? (
          <div>
            <span className="mr-2">Hi, {user.email}</span>
            <button onClick={handleLogout} className="btn">
              Sign out
            </button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </li>
    </>
  );
  return (
    <div className="navbar md:justify-center max-w-7xl mx-auto">
      {/* mobile */}
      <div className="navbar-start sm:hidden">
        <div className="dropdown z-10">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {navOptions}
          </ul>
        </div>
      </div>
      {/* desktop */}
      <div className="navbar-center hidden lg:flex ">
        <ul className="menu menu-horizontal px-1 items-center">{navOptions}</ul>
      </div>
    </div>
  );
};

export default Header;
