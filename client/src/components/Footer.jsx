import React from "react";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="bg-gradient-to-b from-gray-900 to-blue-900 border-t border-cyan-400/20 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left Section */}
          <div className="group flex items-center space-x-2">
            <span className="text-cyan-400/80 font-mono text-sm">
              Developed & Crafted by
            </span>
            <div className="h-1 w-1 bg-cyan-400 rounded-full animate-pulse" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold">
              Ankit Prasad
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />

          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400/80 hover:text-cyan-300 transition-all hover:scale-110"
            >
              <AiFillGithub size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400/80 hover:text-cyan-300 transition-all hover:scale-110"
            >
              <FaLinkedinIn size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400/80 hover:text-cyan-300 transition-all hover:scale-110"
            >
              <AiOutlineTwitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400/80 hover:text-cyan-300 transition-all hover:scale-110"
            >
              <AiFillInstagram size={24} />
            </a>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />

          {/* Copyright */}
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400/80 font-mono text-sm">
              © {year} AP
            </span>
            <div className="h-1 w-1 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400/80 font-mono text-sm">v1.0.0</span>
          </div>
        </div>

        {/* Glowing Bottom Border */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>
    </div>
  );
}

export default Footer;
