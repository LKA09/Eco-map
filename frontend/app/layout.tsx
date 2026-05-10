import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECOMAP | 지역 환경 행동 플랫폼",
  description:
    "대전대신고등학교 옆 오량산의 숲길과 자원순환 거점을 시민 기록으로 연결하는 환경 웹사이트입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
