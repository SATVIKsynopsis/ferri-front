'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Page() {
  useEffect(() => {
    // Dynamic import for Lenis on client side only
    const initLenis = async () => {
      const Lenis = (await import('lenis')).default;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    };

    initLenis().catch(() => {
      // Lenis not available, smooth scrolling disabled
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; overflow-y: auto; height: 100%; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #07070e; color: #e8e8f0; min-height: 100vh; height: auto; }

        /* PREMIUM ANIMATIONS */
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.05); }
        }

        @keyframes heroFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes shimmer {
          0%, 100% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4), inset 0 0 20px rgba(99,102,241,0.1); }
          50% { box-shadow: 0 0 40px rgba(99,102,241,0.6), inset 0 0 30px rgba(99,102,241,0.2); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes border-glow {
          0%, 100% { border-color: rgba(99,102,241,0.3); box-shadow: 0 0 10px rgba(99,102,241,0.2); }
          50% { border-color: rgba(99,102,241,0.8); box-shadow: 0 0 30px rgba(99,102,241,0.4); }
        }

        @keyframes stagger {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* MODERN PREMIUM ANIMATIONS */
        @keyframes blob-rotate {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.05); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes text-shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes magnetic-button {
          0% { transform: translate(0, 0); }
          50% { transform: translate(2px, -2px); }
          100% { transform: translate(0, 0); }
        }

        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(99,102,241,0.3)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 20px rgba(99,102,241,0.8)); transform: scale(1.02); }
        }

        @keyframes reveal-text {
          0% { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }

        @keyframes glass-shine {
          0% { background-position: -1000px center; }
          100% { background-position: 1000px center; }
        }

        @keyframes float-vertical {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }

        @keyframes accordion-open {
          from { max-height: 0; opacity: 0; }
          to { max-height: 500px; opacity: 1; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.5) translateY(30px); }
          50% { opacity: 1; }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes slide-from-left {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slide-from-right {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes color-shift {
          0% { color: #e8e8f0; }
          50% { color: #6366f1; }
          100% { color: #e8e8f0; }
        }

        @keyframes flame-flicker {
          0% { transform: translateY(0) scaleY(1) scaleX(1.1); opacity: 0.8; }
          25% { transform: translateY(-20px) scaleY(1.2) scaleX(0.9); opacity: 0.6; }
          50% { transform: translateY(-40px) scaleY(1.1) scaleX(1.05); opacity: 0.7; }
          75% { transform: translateY(-20px) scaleY(1.3) scaleX(0.85); opacity: 0.5; }
          100% { transform: translateY(0) scaleY(1) scaleX(1.1); opacity: 0.8; }
        }

        @keyframes flame-bg {
          0% { background-position: 0% 100%; }
          50% { background-position: 100% 0%; }
          100% { background-position: 0% 100%; }
        }

        @keyframes energy-pulse {
          0% { transform: scale(1) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.6; }
          100% { transform: scale(1) rotate(360deg); opacity: 0.3; }
        }

        @keyframes plasma-move {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }

        /* AMBIENT ORBS */
        .landing-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .landing-orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.12; animation: orbFloat 20s ease-in-out infinite; }
        .orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, #6366f1, transparent 70%); top: -200px; right: -100px; animation-delay: 0s; }
        .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, #7c3aed, transparent 70%); bottom: 100px; left: -150px; animation-delay: -6s; }
        .orb-3 { width: 400px; height: 400px; background: radial-gradient(circle, #06b6d4, transparent 70%); top: 50%; left: 40%; animation-delay: -12s; }
        .orb-4 { width: 350px; height: 350px; background: radial-gradient(circle, #ec4899, transparent 70%); bottom: 200px; right: 100px; animation-delay: -3s; }

        /* FIRE/FLAME EFFECT */
        .landing-flames {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
          mix-blend-mode: screen;
        }

        .flame {
          position: absolute; bottom: -100px; width: 200px; height: 300px;
          background: linear-gradient(to top, rgba(239,68,68,0.8), rgba(234,179,8,0.4), transparent);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          filter: blur(40px);
          animation: flame-flicker 4s ease-in-out infinite;
          opacity: 0;
        }

        .flame-1 {
          left: 20%; width: 180px; height: 280px;
          background: linear-gradient(to top, rgba(239,68,68,0.7), rgba(249,115,22,0.3), transparent);
          animation-delay: 0s;
        }

        .flame-2 {
          left: 45%; transform: scaleX(-1); width: 200px; height: 320px;
          background: linear-gradient(to top, rgba(249,115,22,0.8), rgba(234,179,8,0.5), transparent);
          animation-delay: 0.5s;
        }

        .flame-3 {
          left: 65%; width: 160px; height: 260px;
          background: linear-gradient(to top, rgba(234,179,8,0.9), rgba(132,204,22,0.2), transparent);
          animation-delay: 1s;
          bottom: -80px;
        }

        .flame-glow {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 400px;
          background: radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.3), rgba(249,115,22,0.1), transparent 70%);
          filter: blur(60px);
          animation: energy-pulse 5s ease-in-out infinite;
          mix-blend-mode: screen;
        }

        /* MAIN CONTAINER */
        .landing-main {
          position: relative; z-index: 1;
          width: 100%;
          height: auto;
        }

        /* NAVIGATION */
        .landing-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 32px;
          background: rgba(7,7,14,0.6);
          backdrop-filter: blur(30px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          animation: slideInDown 0.6s ease-out;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .landing-nav:hover {
          background: rgba(7,7,14,0.75);
          border-bottom-color: rgba(99,102,241,0.2);
        }

        .landing-logo {
          font-size: 18px; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .landing-logo::after {
          content: '';
          position: absolute; inset: -8px;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), transparent);
          opacity: 0;
          transition: opacity 0.4s;
          border-radius: 10px;
          z-index: -1;
        }

        .landing-logo:hover {
          transform: scale(1.08);
          filter: drop-shadow(0 0 12px rgba(99,102,241,0.6));
        }

        .landing-logo:hover::after { opacity: 1; }

        .landing-nav-links { display: flex; align-items: center; gap: 24px; }
        .landing-nav-link {
          font-size: 13px; font-weight: 500; color: rgba(232,232,240,0.6);
          text-decoration: none; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .landing-nav-link::after {
          content: '';
          position: absolute; bottom: -4px; left: 0;
          width: 0; height: 2.5px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 8px rgba(99,102,241,0.4);
        }

        .landing-nav-link:hover {
          color: #e8e8f0;
        }

        .landing-nav-link:hover::after {
          width: 100%;
        }

        .landing-nav-buttons { display: flex; align-items: center; gap: 12px; }

        .landing-btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; border: none; border-radius: 10px; padding: 9px 20px;
          font-size: 12.5px; font-weight: 700; cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-decoration: none; display: inline-block;
          box-shadow: 0 8px 24px rgba(99,102,241,0.3);
          position: relative; overflow: hidden;
        }

        .landing-btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .landing-btn-primary:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 40px rgba(99,102,241,0.5), 0 0 30px rgba(99,102,241,0.3);
          animation: magnetic-button 0.5s ease-out;
        }

        .landing-btn-primary:hover::before { transform: translateX(100%); }

        .landing-btn-primary:active {
          transform: translateY(-2px) scale(0.98);
        }

        .landing-btn-secondary {
          background: rgba(99,102,241,0.08);
          color: #a5b4fc; border: 1.5px solid rgba(99,102,241,0.4);
          border-radius: 10px; padding: 8px 18px;
          font-size: 12.5px; font-weight: 700; cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-decoration: none; display: inline-block;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .landing-btn-secondary::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 10px;
        }

        .landing-btn-secondary:hover {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.8);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .landing-btn-secondary:hover::after { opacity: 1; }

        /* HERO SECTION */
        .landing-hero {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 80px 32px 120px;
          text-align: center;
          margin-top: 64px;
          background: linear-gradient(135deg, transparent, rgba(99,102,241,0.03), transparent);
          position: relative;
          overflow: hidden;
        }

        .landing-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at center, rgba(99,102,241,0.05), transparent 70%);
          animation: float-vertical 8s ease-in-out infinite;
          pointer-events: none;
        }

        .landing-hero-content {
          max-width: 900px; animation: heroFade 0.8s cubic-bezier(0.34,1.56,0.64,1) both;
          position: relative; z-index: 1;
        }

        .landing-hero-badge {
          display: inline-block;
          background: rgba(99,102,241,0.1);
          border: 1.5px solid rgba(99,102,241,0.3);
          border-radius: 20px;
          padding: 10px 18px;
          font-size: 11.5px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: #a5b4fc;
          margin-bottom: 20px;
          animation: scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .landing-hero-badge::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .landing-hero-badge:hover {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.8);
          box-shadow: 0 0 20px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
          transform: translateY(-4px);
        }

        .landing-hero-badge:hover::before { transform: translateX(100%); }

        .landing-hero-title {
          font-size: clamp(48px, 8vw, 72px);
          font-weight: 800; letter-spacing: -0.02em; line-height: 1.1;
          margin-bottom: 20px;
          background: linear-gradient(90deg, #e8e8f0 0%, #a5b4fc 25%, #6366f1 50%, #a5b4fc 75%, #e8e8f0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: slideInUp 0.8s ease-out 0.3s both, gradient-shift 6s ease infinite 2s;
          position: relative;
        }

        .landing-hero-subtitle {
          font-size: 18px; color: rgba(232,232,240,0.6); line-height: 1.6;
          margin-bottom: 40px;
          max-width: 600px; margin-left: auto; margin-right: auto;
          animation: slideInUp 0.8s ease-out 0.4s both;
        }

        .landing-hero-btns {
          display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap;
          animation: slideInUp 0.8s ease-out 0.5s both;
        }

        /* FEATURES GRID */
        .landing-features {
          padding: 120px 32px;
          max-width: 1400px; margin: 0 auto;
        }

        .landing-section-title {
          font-size: 42px; font-weight: 800; letter-spacing: -0.02em;
          text-align: center; margin-bottom: 60px;
          color: #e8e8f0;
          animation: slideInUp 0.8s ease-out;
          background: linear-gradient(90deg, #e8e8f0 0%, #6366f1 25%, #8b5cf6 50%, #6366f1 75%, #e8e8f0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.4s;
          position: relative;
        }

        .landing-section-title::after {
          content: '';
          position: absolute; bottom: -10px; left: 50%;
          transform: translateX(-50%);
          width: 60px; height: 3px;
          background: linear-gradient(90deg, transparent, #6366f1, transparent);
          animation: slideInUp 0.8s ease-out;
        }

        .landing-features:hover .landing-section-title {
          animation: gradient-shift 3s ease infinite;
        }

        .landing-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .landing-feature-card {
          background: rgba(20,20,32,0.3);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          animation: slideInUp 0.8s ease-out both;
          backdrop-filter: blur(20px);
        }

        .landing-feature-card:nth-child(1) { animation-delay: 0.05s; }
        .landing-feature-card:nth-child(2) { animation-delay: 0.15s; }
        .landing-feature-card:nth-child(3) { animation-delay: 0.25s; }
        .landing-feature-card:nth-child(4) { animation-delay: 0.35s; }
        .landing-feature-card:nth-child(5) { animation-delay: 0.45s; }
        .landing-feature-card:nth-child(6) { animation-delay: 0.55s; }

        .landing-feature-card::after {
          content: '';
          position: absolute; inset: -1px;
          background: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2), transparent);
          opacity: 0;
          transition: opacity 0.5s;
          border-radius: 20px;
          pointer-events: none;
        }

        .landing-feature-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at center, rgba(99,102,241,0.05), transparent 70%);
          opacity: 0; transition: opacity 0.4s;
          border-radius: 20px;
        }

        .landing-feature-card:hover::before { opacity: 1; }
        .landing-feature-card:hover::after { opacity: 1; z-index: -1; }

        .landing-feature-card:hover {
          background: rgba(30,30,50,0.6);
          border-color: rgba(99,102,241,0.5);
          transform: translateY(-16px) perspective(1000px) rotateX(2deg);
          box-shadow: 0 40px 80px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .landing-feature-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4));
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          margin-bottom: 16px;
          position: relative; z-index: 2;
          transition: all 0.4s;
          box-shadow: 0 8px 20px rgba(99,102,241,0.15);
          animation: float 3s ease-in-out infinite;
        }

        .landing-feature-card:hover .landing-feature-icon {
          transform: scale(1.3) rotateY(360deg);
          animation: none;
          box-shadow: 0 12px 30px rgba(99,102,241,0.4);
        }

        .landing-feature-title {
          font-size: 18px; font-weight: 700; color: #e8e8f0;
          margin-bottom: 10px;
          position: relative; z-index: 2;
          transition: all 0.3s;
        }

        .landing-feature-card:hover .landing-feature-title {
          color: #c7d2fe;
          transform: translateX(4px);
        }

        .landing-feature-text {
          font-size: 13.5px; color: rgba(232,232,240,0.5); line-height: 1.6;
          position: relative; z-index: 2;
          transition: all 0.3s;
        }

        .landing-feature-card:hover .landing-feature-text {
          color: rgba(232,232,240,0.8);
        }

        /* STATS SECTION */
        .landing-stats {
          padding: 120px 32px;
          background: linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05));
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .landing-stats-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          max-width: 1200px; margin: 0 auto;
          text-align: center;
        }

        .landing-stat-box {
          animation: slideInUp 0.8s ease-out both;
          padding: 40px 20px;
          border-radius: 16px;
          background: rgba(20,20,32,0.2);
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .landing-stat-box::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.1), transparent);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }

        .landing-stat-box:nth-child(1) { animation-delay: 0.1s; }
        .landing-stat-box:nth-child(2) { animation-delay: 0.2s; }
        .landing-stat-box:nth-child(3) { animation-delay: 0.3s; }

        .landing-stat-box:hover {
          transform: translateY(-12px) scale(1.05);
          background: rgba(30,30,50,0.4);
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 20px 60px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .landing-stat-box:hover::before { opacity: 1; }

        .landing-stat-box h3 {
          font-size: 36px; font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          transition: all 0.4s;
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .landing-stat-box:hover h3 {
          transform: scale(1.15);
          animation: glow-pulse 0.8s ease-in-out;
        }

        .landing-stat-box p {
          font-size: 13.5px; color: rgba(232,232,240,0.6);
          transition: all 0.3s;
          letter-spacing: 0.5px;
        }

        .landing-stat-box:hover p {
          color: rgba(232,232,240,0.9);
        }

        /* CTA SECTION */
        .landing-cta {
          padding: 120px 32px;
          text-align: center;
          animation: fadeIn 0.8s ease-out;
          background: linear-gradient(135deg, rgba(99,102,241,0.03), rgba(139,92,246,0.03));
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }

        .landing-cta::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at center, rgba(99,102,241,0.05), transparent 80%);
          animation: spin-slow 20s linear infinite;
          pointer-events: none;
        }

        .landing-cta-title {
          font-size: 48px; font-weight: 800; letter-spacing: -0.02em;
          margin-bottom: 20px;
          color: #e8e8f0;
          animation: slideInUp 0.8s ease-out;
          background: linear-gradient(90deg, #e8e8f0 0%, #6366f1 50%, #e8e8f0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative; z-index: 1;
        }

        .landing-cta-subtitle {
          font-size: 18px; color: rgba(232,232,240,0.6);
          margin-bottom: 40px;
          max-width: 600px; margin-left: auto; margin-right: auto;
          animation: slideInUp 0.8s ease-out 0.1s both;
          position: relative; z-index: 1;
        }

        .landing-cta .landing-btn-primary {
          animation: slideInUp 0.8s ease-out 0.2s both;
          position: relative; z-index: 1;
        }

        /* FOOTER */
        .landing-footer {
          padding: 60px 32px;
          border-top: 1px solid rgba(255,255,255,0.05);
          background: rgba(7,7,14,0.8);
          text-align: center;
          font-size: 12.5px; color: rgba(232,232,240,0.4);
          animation: fadeIn 1s ease-out 0.5s both;
          position: relative;
          backdrop-filter: blur(20px);
        }

        .landing-footer::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent);
        }

        @media (max-width: 768px) {
          .landing-hero { padding: 60px 20px 100px; margin-top: 60px; }
          .landing-hero-title { font-size: 32px; }
          .landing-section-title { font-size: 28px; }
          .landing-nav { padding: 12px 20px; }
          .landing-nav-links { display: none; }
          .landing-features, .landing-stats, .landing-cta { padding: 80px 20px; }
        }
      `}</style>

      <div className="landing-orbs" aria-hidden>
        <div className="landing-orb orb-1" />
        <div className="landing-orb orb-2" />
        <div className="landing-orb orb-3" />
        <div className="landing-orb orb-4" />
      </div>

      {/* FIRE/FLAME EFFECT */}
      <div className="landing-flames" aria-hidden>
        <div className="flame flame-1" />
        <div className="flame flame-2" />
        <div className="flame flame-3" />
        <div className="flame-glow" />
      </div>

      <div className="landing-main">
        {/* Navigation */}
        <nav className="landing-nav">
          <div className="landing-logo">FerriChat</div>
          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#stats" className="landing-nav-link">Performance</a>
            <a href="#cta" className="landing-nav-link">Get Started</a>
          </div>
          <div className="landing-nav-buttons">
            <Link href="/login" className="landing-btn-secondary">Sign In</Link>
            <Link href="/register" className="landing-btn-primary">Start Free</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-hero-content">
            <div className="landing-hero-badge">⚡ Built for Speed</div>
            <h1 className="landing-hero-title">Real-Time Chat. Lightning Fast.</h1>
            <p className="landing-hero-subtitle">
              Experience the future of messaging with sub-millisecond delivery, beautiful UI, and enterprise-grade security. No servers. Just pure performance.
            </p>
            <div className="landing-hero-btns">
              <Link href="/register" className="landing-btn-primary">Get Started Free</Link>
              <button className="landing-btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="landing-features">
          <h2 className="landing-section-title">Why Choose FerriChat?</h2>
          <div className="landing-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon">⚡</div>
              <h3 className="landing-feature-title">Ultra-Fast</h3>
              <p className="landing-feature-text">
                Sub-millisecond message delivery with optimized infrastructure for global scale.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">🔐</div>
              <h3 className="landing-feature-title">Secure</h3>
              <p className="landing-feature-text">
                End-to-end encrypted conversations with enterprise-grade security protocols.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">🎨</div>
              <h3 className="landing-feature-title">Beautiful UI</h3>
              <p className="landing-feature-text">
                Modern, intuitive interface designed for seamless user experience.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">📱</div>
              <h3 className="landing-feature-title">Cross-Platform</h3>
              <p className="landing-feature-text">
                Works perfectly on desktop, tablet, and mobile devices.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">♾️</div>
              <h3 className="landing-feature-title">Scalable</h3>
              <p className="landing-feature-text">
                Built to handle millions of concurrent conversations without slowdown.
              </p>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-icon">🚀</div>
              <h3 className="landing-feature-title">Always On</h3>
              <p className="landing-feature-text">
                99.9% uptime guarantee with redundant infrastructure across regions.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="landing-stats">
          <div className="landing-stats-grid">
            <div className="landing-stat-box">
              <h3>&lt;1ms</h3>
              <p>Message Latency</p>
            </div>
            <div className="landing-stat-box">
              <h3>99.9%</h3>
              <p>Uptime SLA</p>
            </div>
            <div className="landing-stat-box">
              <h3>100M+</h3>
              <p>Messages Daily</p>
            </div>
            <div className="landing-stat-box">
              <h3>180+</h3>
              <p>Countries Supported</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="landing-cta">
          <h2 className="landing-cta-title">Ready to Chat Faster?</h2>
          <p className="landing-cta-subtitle">
            Join thousands of teams and individuals already using FerriChat for real-time communication.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/register" className="landing-btn-primary">Start Free Today</Link>
            <a href="mailto:support@ferrichat.com" className="landing-btn-secondary">Contact Sales</a>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>&copy; 2026 FerriChat. All rights reserved. Built with ❤️ for speed.</p>
        </footer>
      </div>
    </>
  );
}
