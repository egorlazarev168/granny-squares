"use client";

import { useEffect, useState } from "react";

export default function GrannySquaresApp() {
  const [egor, setEgor] = useState([]);
  const [masha, setMasha] = useState([]);
  const [colors, setColors] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [createdAt, setCreatedAt] = useState(""); // ← новое состояние
  const [author, setAuthor] = useState("Егор");
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("all");

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
  const progressValue = Math.min(total, 100);

  // === АНИМАЦИЯ ПРОГРЕССА ===
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progressValue);
    }, 50);
    return () => clearTimeout(timeout);
  }, [progressValue]);

  // === ЦВЕТ ШКАЛЫ ===
  const getProgressColor = () => {
    if (animatedProgress < 33) return "bg-red-500";
    if (animatedProgress < 66) return "bg-yellow-400";
    return "bg-green-500";
  };

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
    const count = colors
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean).length;

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
      createdAt: createdAt
        ? new Date(createdAt).toISOString() // ← выбранная дата
        : new Date().toISOString(),         // ← текущая дата
      category: getCategory(colors),
    };

    if (author === "Егор") {
      setEgor((prev) => [...prev, square]);
    } else {
      setMasha((prev) => [...prev, square]);
    }

    setColors("");
    setComment("");
    setPhoto(null);
    setCreatedAt(""); // ← сбрасываем дату
  };

  // === УДАЛИТЬ КВАДРАТ ===
  const deleteSquare = (id, who) => {
    if (who === "Егор") {
      setEgor((prev) => prev.filter((s) => s.id !== id));
    } else {
      setMasha((prev) => prev.filter((s) => s.id !== id));
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
        : "Ничья",
  };

  // === ФИЛЬТРАЦИЯ ===
  const filterByCategory = (list) => {
    if (categoryFilter === "all") return list;
    return list.filter((s) => s.category === categoryFilter);
  };

  const filteredEgor = filterByCategory(egor);
  const filteredMasha = filterByCategory(masha);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">
        Наш плед из бабушкиных квадратов
      </h1>

      {/* === ШКАЛА ПРОГРЕССА === */}
      <div className="w-full max-w-xl">
        <div className="relative h-10 bg-neutral-300 rounded-xl overflow-hidden shadow-inner">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-700 ease-out ${getProgressColor()}`}
            style={{ width: `${animatedProgress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-semibold text-neutral-800">
            {total} / 100
          </div>
        </div>
      </div>

      {/* === СТАТИСТИКА === */}
      <div className="bg-white shadow rounded-xl p-4 w-full max-w-xl text-center space-y-1">
        <p>Егор: {stats.egor}</p>
        <p>Маша: {stats.masha}</p>
        <p className="font-semibold mt-1">Лидер: {stats.leader}</p>
      </div>

      {/* === ФИЛЬТРЫ === */}
      <div className="bg-white shadow rounded-xl p-4 w-full max-w-xl flex flex-col gap-3">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm text-neutral-600">Тип квадрата:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">Все</option>
            <option value="однотонный">Однотонные</option>
            <option value="двухцветный">Двухцветные</option>
            <option value="многоцветный">Многоцветные</option>
          </select>
        </div>
      </div>

      {/* === ДОБАВИТЬ КВАДРАТ === */}
      <div className="bg-white rounded-2xl shadow p-4 w-full max-w-xl flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option>Егор</option>
            <option>Маша</option>
          </select>

          <input
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="Цвета (например: красный, белый, синий)"
            className="flex-1 min-w-[180px] border rounded px-3 py-1"
          />
        </div>

        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий"
          className="border rounded px-3 py-1"
        />

        {/* === ВЫБОР ДАТЫ === */}
        <input
          type="date"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          className="border rounded px-3 py-1"
        />

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="border rounded px-3 py-1"
          />
          {photo && (
            <img
              src={photo}
              alt="preview"
              className="w-20 h-20 object-cover rounded"
            />
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={addSquare}
            className="bg-emerald-500 text-white rounded-xl px-4 py-2 hover:bg-emerald-600"
          >
            Добавить квадрат
          </button>
        </div>
      </div>

      {/* === СПИСКИ === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
        {/* ЕГОР */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-3">Егор</h2>
          <ul className="text-sm space-y-4">
            {filteredEgor.map((s, i) => (
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
                  {s.comment && <p className="text-xs mt-1">{s.comment}</p>}
                  <p className="text-xs text-neutral-400 mt-1">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteSquare(s.id, "Егор")}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* МАША */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold mb-3">Маша</h2>
          <ul className="text-sm space-y-4">
            {filteredMasha.map((s, i) => (
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
                  {s.comment && <p className="text-xs mt-1">{s.comment}</p>}
                  <p className="text-xs text-neutral-400 mt-1">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteSquare(s.id, "Маша")}
                  className="text-red-500 hover:text-red-700 ml-2"
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
