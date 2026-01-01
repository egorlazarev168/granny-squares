"use client";

import { useState } from "react";

export default function GrannySquaresApp() {
  const [total, setTotal] = useState(0);
  const [egor, setEgor] = useState([]);
  const [masha, setMasha] = useState([]);
  const [colors, setColors] = useState("");
  const [author, setAuthor] = useState("Егор");

  const addSquare = () => {
    if (!colors.trim()) return;
    const square = { id: Date.now(), colors };
    if (author === "Егор") setEgor([...egor, square]);
    else setMasha([...masha, square]);
    setTotal(total + 1);
    setColors("");
  };

  const progress = Math.min((total / 100) * 100, 100);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Наш плед из бабушкиных квадратов</h1>

      {/* Progress bar */}
      <div className="w-full max-w-xl">
        <div className="h-6 bg-neutral-300 rounded-full overflow-hidden">
          <div
            className="h-6 bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center mt-2">{total} / 100 квадратов</p>
      </div>

      {/* Add square */}
      <div className="bg-white rounded-2xl shadow p-4 w-full max-w-xl flex flex-col gap-3">
        <div className="flex gap-2">
          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option>Егор</option>
            <option>Маша</option>
          </select>
          <input
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="Цвета (например: красный, белый, синий)"
            className="flex-1 border rounded px-2 py-1"
          />
        </div>
        <button
          onClick={addSquare}
          className="bg-emerald-500 text-white rounded-xl py-2 hover:bg-emerald-600"
        >
          Добавить квадрат
        </button>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-2">Егор</h2>
          <ul className="text-sm space-y-1">
            {egor.map((s, i) => (
              <li key={s.id}>
                #{i + 1}: {s.colors}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-2">Маша</h2>
          <ul className="text-sm space-y-1">
            {masha.map((s, i) => (
              <li key={s.id}>
                #{i + 1}: {s.colors}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
