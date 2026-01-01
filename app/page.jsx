"use client";

import { useEffect, useState } from "react";

export default function GrannySquaresApp() {
  const [egor, setEgor] = useState([]);
  const [masha, setMasha] = useState([]);
  const [colors, setColors] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [author, setAuthor] = useState("Егор");
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // === ЗАГРУЗКА ИЗ localStorage ===
  useEffect(() => {
    const saved = localStorage.getItem("granny-squares");
    if (saved) {
      const data = JSON.parse(saved);
      setEgor(data.egor || []);
      setMasha(data.masha || []);
    }
  }, []);

  // === СОХРАНЕНИЕ В localStorage ===
  useEffect(() => {
    localStorage.setItem(
      "granny-squares",
      JSON.stringify({ egor, masha })
    );
  }, [egor, masha]);

  // === ПРОГРЕСС ===
  const total = egor.length + masha.length;
  const progress = Math.min((total / 100) * 100, 100);

  // === АНИМАЦИЯ ПРОГРЕССА ===
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 50);
    return () => clearTimeout(timeout);
  }, [progress]);

  // === ЗАГРУЗКА ФОТО ===
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  // === КАТЕГОРИЯ ===
  const getCategory = (colors) => {
    const count = colors.split(",").map(c => c.trim()).filter(Boolean).length;
    if (count === 1) return "однотонный";
    if (count === 2) return "двухцветный";
    return "многоцветный";
  };

  // === ДОБАВИТЬ КВАДРАТ ===
  const addSquare = () => {
    if (!colors.trim()) return;

    const square = {
      id: Date.now(),
      colors,
      comment,
      photo,
      createdAt: new Date().toISOString(),
      category: getCategory(colors)
    };

    if (author === "Егор") {
      setEgor([...egor, square]);
    } else {
      setMasha([...masha, square]);
    }

    setColors("");
    setComment("");
    setPhoto(null);
  };

  // === УДАЛИТЬ КВАДРАТ ===
  const deleteSquare = (id, who) => {
    if (who === "Егор") {
      setEgor(egor.filter((s) => s.id !== id));
    } else {
      setMasha(masha.filter((s) => s.id !== id));
    }
  };

  // === СТАТИСТИКА ===
  const stats = {
    egor: egor.length,
    masha: masha.length,
    leader:
      egor.length > masha.length
        ? "Егор"
        : egor.length < masha.length
        ? "Маша"
        : "Ничья"
  };

  // === ЦВЕТ ПРОГРЕССА ===
  const getProgressColor = () => {
    if (progress < 33) return "bg-red-500";
    if (progress < 66) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">
        Наш плед из бабушкиных квадратов
      </h1>

      {/* Progress bar */}
      <div className="w-full max-w-xl">
        <div className="h-6 bg-neutral-300 rounded-full overflow-hidden">
          <div
            className={`h-6 transition-all duration-700 ease-out ${getProgressColor()}`}
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
        <p className="text-center mt-2">{total} / 100 квадратов</p>
      </div>

      {/* Stats */}
      <div className="bg-white shadow rounded-xl p-4 w-full max-w-xl text-center">
        <p>Егор: {stats.egor}</p>
        <p>Маша: {stats.masha}</p>
        <p className="font-semibold mt-2">Лидер: {stats.leader}</p>
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

        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий"
          className="border rounded px-2 py-1"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="border rounded px-2 py-1"
        />

        {photo && (
          <img
            src={photo}
            alt="preview"
            className="w-24 h-24 object-cover rounded mx-auto"
          />
        )}

        <button
          onClick={addSquare}
          className="bg-emerald-500 text-white rounded-xl py-2 hover:bg-emerald-600"
        >
          Добавить квадрат
        </button>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
        {/* ЕГОР */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-2">Егор</h2>
          <ul className="text-sm space-y-3">
            {egor.map((s, i) => (
              <li key={s.id} className="flex gap-3 items-center">
                {s.photo && (
                  <img
                    src={s.photo}
                    alt="square"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p>#{i + 1}: {s.colors}</p>
                  <p className="text-xs text-neutral-500">{s.category}</p>
                  <p className="text-xs">{s.comment}</p>
                  <p className="text-xs text-neutral-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteSquare(s.id, "Егор")}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* МАША */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-2">Маша</h2>
          <ul className="text-sm space-y-3">
            {masha.map((s, i) => (
              <li key={s.id} className="flex gap-3 items-center">
                {s.photo && (
                  <img
                    src={s.photo}
                    alt="square"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p>#{i + 1}: {s.colors}</p>
                  <p className="text-xs text-neutral-500">{s.category}</p>
                  <p className="text-xs">{s.comment}</p>
                  <p className="text-xs text-neutral-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteSquare(s.id, "Маша")}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
