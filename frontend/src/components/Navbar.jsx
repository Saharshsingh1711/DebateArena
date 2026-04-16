import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "About",     path: "/about" },
  { label: "Join Beta", path: "/join-beta" },
  { label: "Contact",   path: "/contact" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists on component mount or location change
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    toast.success("Successfully logged out!");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg/90 backdrop-blur-xl border-b border-white/[0.07]">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-6 md:px-10 h-[58px]">

        {/* Logo */}
        <div className="font-display text-xl md:text-2xl tracking-[3px] text-t1">
          AI <span className="text-acc">DEBATE</span> ARENA
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex gap-[2px]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-[18px] py-[6px] rounded-md text-[0.82rem] tracking-[0.5px]
                            transition-all duration-150 no-underline
                            ${isActive
                              ? "text-acc bg-acc/10"
                              : "text-t2 hover:text-t1 hover:bg-white/5"
                            }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Login & Register or Dashboard & Logout */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="px-[18px] py-[6px] rounded-md text-[0.82rem] tracking-[0.5px]
                           transition-all duration-150 no-underline
                           text-t2 hover:text-t1 hover:bg-white/5"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-[18px] py-[6px] rounded-md text-[0.82rem] tracking-[0.5px]
                           transition-all duration-150 no-underline
                           bg-red-600/80 text-white hover:bg-red-500 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-[18px] py-[6px] rounded-md text-[0.82rem] tracking-[0.5px]
                           transition-all duration-150 no-underline
                           text-t2 hover:text-t1 hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-[18px] py-[6px] rounded-md text-[0.82rem] tracking-[0.5px]
                           transition-all duration-150 no-underline
                           bg-acc text-black hover:bg-acc/80"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-[22px] h-[2px] bg-t1 transition-all duration-200
                            ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-[22px] h-[2px] bg-t1 transition-all duration-200
                            ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-[22px] h-[2px] bg-t1 transition-all duration-200
                            ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>

      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-6 pb-4 gap-1
                        border-t border-white/[0.07]">

          {/* Nav links */}
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-[10px] rounded-md text-[0.85rem] tracking-[0.5px]
                            transition-all duration-150 no-underline
                            ${isActive
                              ? "text-acc bg-acc/10"
                              : "text-t2 hover:text-t1 hover:bg-white/5"
                            }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="border-t border-white/[0.07] my-2" />

          {/* Login & Register or Dashboard & Logout */}
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-[10px] rounded-md text-[0.85rem] tracking-[0.5px]
                           no-underline text-t2 hover:text-t1 hover:bg-white/5"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="px-4 py-[10px] rounded-md text-[0.85rem] tracking-[0.5px]
                           no-underline text-center bg-red-600/80 text-white hover:bg-red-500 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-[10px] rounded-md text-[0.85rem] tracking-[0.5px]
                           no-underline text-t2 hover:text-t1 hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-[10px] rounded-md text-[0.85rem] tracking-[0.5px]
                           no-underline text-center bg-acc text-black hover:bg-acc/80"
              >
                Register
              </Link>
            </>
          )}

        </div>
      )}

    </nav>
  );
}

export default Navbar;