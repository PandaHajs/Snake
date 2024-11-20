import type { Metadata } from "next";
import "./globals.scss";
import "@/app/ui/styles/variables.scss";
import Footer from "@/app/ui/footer";
import { lato } from "./lib/fonts";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
	title: "Snake | Skowronski",
	description: "A simple snake game",
	authors: [
		{
			name: "Kacper Skowronski",
			url: "https://www.linkedin.com/in/kacper-skowro%C5%84ski-854424230/",
		},
	],
	keywords: [
		"Kacper Skowroński",
		"Skowrońskigq",
		"Skowroński",
		"Kacper",
		"Skowronski",
		"Kacper Skowronski",
		"Skowronskiga",
		"Snake",
		"Snake game",
		"game",
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={lato.className}>
				{children}
				<Footer />
			</body>
			<Analytics />
		</html>
	);
}
