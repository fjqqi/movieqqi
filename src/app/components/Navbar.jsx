"use client";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useState } from "react";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearchQuery(e) {
    setSearchQuery(e.target.value);
  }

  function handleSearchOnClick() {
    const params = new URLSearchParams(searchParams);


    if (searchQuery) {
      params.set('query', searchQuery);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);

  }

  return (
    <div className="navbar bg-base-100 shadow-xs lg:px-32">
      <div className="flex-1">
        <Link href={`/`} className="btn btn-ghost text-xl">
          Movieqqi
        </Link>
      </div>
      <div className="flex gap-2">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
          onChange={handleSearchQuery}
          value={searchQuery} 

        />

        {/* Search Button */}
        <button className="btn btn-primary" onClick={handleSearchOnClick}>
          Search
        </button>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Profile"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};