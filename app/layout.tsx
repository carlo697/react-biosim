import JotaiProvider from "@/components/providers/JotaiProvider";
import "@/styles/globals.scss";

export const metadata = {
  title: "Evolution Simulation",
  description:
    "Evolution simulation in the browser inspired by Biosim from David R. Miller",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <JotaiProvider>{children}</JotaiProvider>
      </body>
    </html>
  );
}
