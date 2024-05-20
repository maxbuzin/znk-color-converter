"use client";
import * as React from "react";
import { useState } from "react";
import { Button, NextUIProvider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [formattedColor, setFormattedColor] = useState("");
  const [hexColor, setHexColor] = useState('');
  const [rgbColor, setRgbColor] = useState('');
  const [hslColor, setHslColor] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setInputValue(value);
    setFormattedColor(formatColor(value));
    const formattedColor = formatColor(value);
    convertColor(formattedColor);
  };

  const formatColor = (color: string) => {
    if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) {
      return color.startsWith("#") ? color : `#${color}`;
    } else if (/^(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})$/i.test(color)) {
      return `rgb(${color})`;
    } else if (/^(\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%$/i.test(color)) {
      return `hsl(${color})`;
    }
    return "Invalid Color";
  };

  const convertColor = (formattedColor: string) => {
    if (formattedColor.startsWith('#')) {
      const rgb = hexToRgb(formattedColor) || '';
      setHexColor(formattedColor);
      setRgbColor(rgb);
      setHslColor(rgbToHsl(rgb) || '');
    } else if (formattedColor.startsWith('rgb')) {
      const hex = rgbToHex(formattedColor) || '';
      const hsl = rgbToHsl(formattedColor) || '';
      setRgbColor(formattedColor);
      setHexColor(hex);
      setHslColor(hsl);
    } else if (formattedColor.startsWith('hsl')) {
      const rgb = hslToRgb(formattedColor) || '';
      setHslColor(formattedColor);
      setRgbColor(rgb);
      setHexColor(rgbToHex(rgb) || '');
    }
  };
  

  const hexToRgb = (hex: string) => {
    let r = 0, g = 0, b = 0;
  
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
  
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  const rgbToHex = (rgb: string) => {
    const match = rgb.match(/\d+/g);
    if (!match) {
      return ''; // Handle the case where match might be null
    }
    const [r, g, b] = match.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  const rgbToHsl = (rgb: string) => {
    const match = rgb.match(/\d+/g);
    if (!match) {
      return ''; // Handle the case where match might be null
    }
    let [r, g, b] = match.map(Number);
    r /= 255, g /= 255, b /= 255;
  
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0; // Initialize h to 0
    let s, l = (max + min) / 2;
  
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    } else {
      s = 0; // achromatic
    }
  
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };
  
  const hslToRgb = (hsl: string) => {
    const match = hsl.match(/\d+/g);
    if (!match) {
      return ''; // Handle the case where match might be null
    }
    const [h, s, l] = match.map(Number);
  };

  // Application
  return (
    <NextUIProvider className="w-full h-full">
      <main className="w-full h-full flex flex-col justify-center items-center gap-12">
        <section className='flex flex-col flex-1 justify-center items-center'>
        <div className='text-center'>
        <h1 className='text-3xl'>Simple Color Converter</h1>
        <p className='opacity-50'>v 1.0</p>
        </div>
        <form className="w-full max-w-xs flex flex-col gap-2">
          <Input
            onChange={handleChange}
            label="Enter a color (Hex, HSL, RGB)"
            className="flex"
          />
        </form>
        <span className='w-full max-w-xs flex flex-col items-center gap-4'>
        <p>{hexColor}</p>
        <p>{rgbColor}</p>
        <p>{hslColor}</p>
        </span>
        <span
          style={{ backgroundColor: formattedColor }}
          className="w-full max-w-xs h-40 border-black rounded-xl flex justify-center items-center text-xl font-semibold">
        </span>
        </section>
      <footer className='mb-5'>
      <p>Made by <a href='https://maxbuzin.com' target='_blank' className='underline'>Max Buzin</a> & <a href='https://chat.openai.com/' target='_blank' className='underline'>GPT-4</a></p>
      </footer>
      </main>
    </NextUIProvider>
  );
}
