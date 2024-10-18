"use client";
import * as React from "react";
import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [formattedColor, setFormattedColor] = useState("");
  const [hexColor, setHexColor] = useState('');
  const [rgbColor, setRgbColor] = useState('');
  const [hslColor, setHslColor] = useState('');
  const [hslRaw, setHslRaw] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setInputValue(value);
    const formatted = formatColor(value);
    setFormattedColor(formatted);
    convertColor(formatted);
  };

  const formatColor = (color: string) => {
    color = color.trim().toLowerCase();

    // Hexadecimal
    if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) {
      return color.startsWith("#") ? color : `#${color}`;
    }

    // RGB com ou sem parênteses
    const rgbRegex = /^rgb\s*\(?\s*((\d+(\.\d+)?),\s*(\d+(\.\d+)?),\s*(\d+(\.\d+)?))\s*\)?$/i;
    const rgbMatch = color.match(rgbRegex);
    if (rgbMatch) {
      return `rgb(${rgbMatch[1]})`;
    }

    // HSL com ou sem parênteses e vírgulas
    const hslRegex = /^hsl\s*\(?\s*((\d+(\.\d+)?)(?:deg)?\s*,?\s*(\d+(\.\d+)?%?)\s*,?\s*(\d+(\.\d+)?%?))\s*\)?$/i;
    const hslMatch = color.match(hslRegex);
    if (hslMatch) {
      return `hsl(${hslMatch[1]})`;
    }

    // HSL sem prefixo 'hsl' (estilo ShadCN)
    const hslValuesRegex = /^(\d+(\.\d+)?)(?:deg)?\s*,\s*(\d+(\.\d+)?%?)\s*,\s*(\d+(\.\d+)?%?)$/i;
    const hslValuesMatch = color.match(hslValuesRegex);
    if (hslValuesMatch) {
      return `hsl(${hslValuesMatch[1]}, ${hslValuesMatch[3]}, ${hslValuesMatch[5]})`;
    }

    return "Invalid Color";
  };

  const convertColor = (formattedColor: string) => {
    if (formattedColor.startsWith('#')) {
      const rgb = hexToRgb(formattedColor);
      const hsl = rgbToHsl(rgb);
      setHexColor(formattedColor);
      setRgbColor(rgb);
      setHslColor(hsl.hslString);
      setHslRaw(hsl.hslRaw);
    } else if (formattedColor.startsWith('rgb')) {
      const hex = rgbToHex(formattedColor);
      const hsl = rgbToHsl(formattedColor);
      setRgbColor(formattedColor);
      setHexColor(hex);
      setHslColor(hsl.hslString);
      setHslRaw(hsl.hslRaw);
    } else if (formattedColor.startsWith('hsl')) {
      const rgb = hslToRgb(formattedColor);
      const hex = rgbToHex(rgb);
      setHslColor(formattedColor);
      setRgbColor(rgb);
      setHexColor(hex);
      // Extrair os valores brutos do HSL
      const hslRawMatch = formattedColor.match(/hsl\(\s*(.+)\s*\)/i);
      if (hslRawMatch && hslRawMatch[1]) {
        setHslRaw(hslRawMatch[1]);
      } else {
        setHslRaw('');
      }
    } else {
      setHexColor('');
      setRgbColor('');
      setHslColor('');
      setHslRaw('');
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
    const match = rgb.match(/\d+(\.\d+)?/g);
    if (!match) {
      return '';
    }
    const [r, g, b] = match.map(num => Math.round(parseFloat(num)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const rgbToHsl = (rgb: string) => {
    const match = rgb.match(/\d+(\.\d+)?/g);
    if (!match) {
      // Retorna valores padrão em caso de erro
      return {
        hslString: '',
        hslRaw: ''
      };
    }
    let [r, g, b] = match.map(num => parseFloat(num));
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromático
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0));
          break;
        case g:
          h = ((b - r) / d + 2);
          break;
        case b:
          h = ((r - g) / d + 4);
          break;
      }
      h /= 6;
    }

    const hDeg = Math.round(h * 360);
    const sPerc = Math.round(s * 100);
    const lPerc = Math.round(l * 100);

    return {
      hslString: `hsl(${hDeg}, ${sPerc}%, ${lPerc}%)`,
      hslRaw: `${hDeg}, ${sPerc}%, ${lPerc}%`
    };
  };

  const hslToRgb = (hsl: string) => {
    const match = hsl.match(/\d+(\.\d+)?/g);
    if (!match || match.length < 3) {
      return '';
    }
    let [h, s, l] = match.map(Number);

    h = h % 360;
    s /= 100;
    l /= 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromático
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      h /= 360;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  };

  // Aplicação
  return (
    <NextUIProvider className="w-full h-full">
      <main className="w-full h-full flex flex-col justify-center items-center gap-12">
        <section className='flex flex-col flex-1 justify-center items-center'>
          <div className='text-center mb-5'>
            <h1 className='text-3xl'>Conversor de Cores Simples</h1>
            <p className='opacity-50'>v 1.2</p>
          </div>
          <form className="w-full max-w-xs flex flex-col gap-2">
            <Input
              onChange={handleChange}
              label="Digite uma cor (Hex, HSL, RGB)"
              className="flex"
            />
          </form>
          <span className='w-fit max-w-xs flex flex-col mx-auto my-5 gap-4'>
            {formattedColor === "Invalid Color" && (
              <p className="text-red-500">Por favor, insira uma cor válida nos formatos HEX, RGB ou HSL.</p>
            )}
            {hexColor && <p>{hexColor}</p>}
            {rgbColor && <p>{rgbColor}</p>}
            {hslColor && <p>{hslColor}</p>}
            {hslRaw && <p>{hslRaw}</p>}
          </span>
          <span
            style={{ backgroundColor: formattedColor !== "Invalid Color" ? formattedColor : 'transparent' }}
            className="w-full max-w-xs h-40 border-black rounded-xl flex justify-center items-center text-xl font-semibold">
            {formattedColor === "Invalid Color" && <p>Cor Inválida</p>}
          </span>
        </section>
        <footer className='mb-5'>
          <p>Feito por <a href='https://maxbuzin.com' target='_blank' className='underline'>Max Buzin</a> & <a href='https://chat.openai.com/' target='_blank' className='underline'>GPT-4</a></p>
        </footer>
      </main>
    </NextUIProvider>
  );
}