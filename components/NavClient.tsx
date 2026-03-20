"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Recipes", href: "/recipes" },
];

export default function NavClient() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap');

        .nav {
          font-family: 'DM Sans', sans-serif;
          background: rgba(58, 56, 48, 0.7);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-family: 'DM Mono', monospace;
          font-size: 1rem;
          font-weight: 500;
          color: #fff;
          letter-spacing: -0.02em;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-logo span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #6ee7b7;
          border-radius: 50%;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
        }

        .nav-links a {
          font-size: 0.875rem;
          font-weight: 500;
          color: #888;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          letter-spacing: 0.01em;
        }

        .nav-links a:hover {
          color: #fff;
          background: #4bffff9f;
        }

        .nav-links a.active {
          color: #fff;
          background: #224f55;
        }

        .nav-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0d0d0d;
          background: #6ee7b7;
          border: none;
          padding: 7px 16px;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          transition: background 0.15s, transform 0.1s;
        }

        .nav-cta:hover { background: #a7f3d0; }
        .nav-cta:active { transform: scale(0.97); }
        .nav-cta:disabled {
          background: #6ee7b7;
          opacity: 0.6;
          cursor: not-allowed;
        }

        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .nav-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #7dd9e9;
          border-radius: 2px;
          transition: transform 0.2s, opacity 0.2s;
        }

        .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .nav-mobile {
          display: none;
          flex-direction: column;
          padding: 12px 24px 20px;
          border-top: 1px solid #1a1a1a;
          gap: 4px;
        }

        .nav-mobile a {
          font-size: 0.9rem;
          font-weight: 500;
          color: #cccccc;
          text-decoration: none;
          padding: 9px 12px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }

        .nav-mobile a:hover, .nav-mobile a.active {
          color: #fff;
          background: #224f55;
        }

        .nav-mobile-cta {
          margin-top: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0d0d0d;
          background: #6ee7b7;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          text-align: center;
          transition: background 0.15s;
        }

        .nav-mobile-cta:hover { background: #a7f3d0; }
        .nav-mobile-cta:disabled {
            background: #6ee7b7;
            opacity: 0.6;
            cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .nav-links, .nav-cta { display: none; }
          .nav-hamburger { display: flex; }
          .nav-mobile { display: flex; }
        }
      `}</style>

            <nav className="nav">
                <div className="nav-inner">
                    <Link href="/" className="nav-logo">
                        <span />
                        Awesome Sauce
                    </Link>

                    <ul className="nav-links">
                        {NAV_LINKS.map(({ label, href }) => (
                            <li key={label}>
                                <Link
                                    href={href}
                                    className={pathname === href ? "active" : ""}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <button className="nav-cta" disabled>
                        Search
                    </button>

                    <button
                        className={`nav-hamburger ${menuOpen ? "open" : ""}`}
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>

                {menuOpen && (
                    <div className="nav-mobile">
                        {NAV_LINKS.map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className={pathname === href ? "active" : ""}
                                onClick={() => setMenuOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}
                        <button className="nav-mobile-cta" disabled>
                            Search
                        </button>
                    </div>
                )}
            </nav>
        </>
    );
}