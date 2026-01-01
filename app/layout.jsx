export const metadata = {
  title: "Плед из бабушкиных квадратов",
  description: "Прогресс вязания пледа из бабушкиных квадратов",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
