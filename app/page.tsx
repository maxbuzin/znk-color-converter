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
      setHexColor(formattedColor);
      setRgbColor(hexToRgb(formattedColor));
      setHslColor(rgbToHsl(hexToRgb(formattedColor)));
    } else if (formattedColor.startsWith('rgb')) {
      setRgbColor(formattedColor);
      setHexColor(rgbToHex(formattedColor));
      setHslColor(rgbToHsl(formattedColor));
    } else if (formattedColor.startsWith('hsl')) {
      setHslColor(formattedColor);
      const rgb = hslToRgb(formattedColor);
      setRgbColor(rgb);
      setHexColor(rgbToHex(rgb));
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
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  const rgbToHsl = (rgb: string) => {
    let [r, g, b] = rgb.match(/\d+/g).map(Number);
    r /= 255, g /= 255, b /= 255;
  
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };
  
  const hslToRgb = (hsl: string) => {
    const [h, s, l] = hsl.match(/\d+/g).map(Number);
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };
    return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
  };

  // Application
  return (
    <NextUIProvider className="w-full h-full">
      <main className="w-full h-full flex flex-col justify-center items-center gap-12">
        <div className='text-center'>
        <h1 className='text-3xl'>Simple Color Converter</h1>
        <p className='opacity-50'>v1.0</p>
        </div>
        <form className="w-full max-w-xs flex flex-col gap-2">
          <Input
            onChange={handleChange}
            label="Enter a color (Hex, HSL, RGB)"
            className="flex"
          />
        </form>
        {/* <span className='text-xl'>{formattedColor}</span> */}
        <span className='w-full max-w-xs flex flex-col items-center gap-4'>
        <p>{hexColor}</p>
        <p>{rgbColor}</p>
        <p>{hslColor}</p>
        </span>
        <span
          style={{ backgroundColor: formattedColor }}
          className="w-full max-w-xs h-40 border-black rounded-xl flex justify-center items-center text-xl font-semibold">
        </span>
        <p>Made by <a href='https://maxbuzin.com' target='_blank' className='underline'>Max Buzin</a> & <a href='https://chat.openai.com/' target='_blank' className='underline'>GPT-4</a></p>
      </main>
    </NextUIProvider>
  );
}
