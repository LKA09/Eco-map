export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ec] text-[#15231d] pt-16">
      {/* 히어로 */}
      <section className="bg-[#15231d] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f2c14e]">
            Local climate action platform
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            오량산 생태 지도
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            대전대신고등학교 옆 오량산의 숲길과 생활권 자원순환 거점을
            기록해 더 나은 환경 행동을 만드는 플랫폼입니다.
          </p>
        </div>
      </section>

      {/* 지도 */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="overflow-hidden rounded-xl border border-[#d8d0bf] bg-[#fffdf6] shadow-md">
          <div className="flex items-center justify-between gap-4 border-b border-[#d8d0bf] px-6 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3b7d57]">
                Live map
              </p>
              <h2 className="mt-1 text-lg font-semibold">
                오량산 · 대전대신고 주변
              </h2>
            </div>
            <a
              href="https://www.openstreetmap.org/?mlat=36.31068372534&mlon=127.37972555946#map=16/36.31068372534/127.37972555946"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full bg-[#15231d] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2f4639]"
            >
              크게 보기
            </a>
          </div>
          <iframe
            title="오량산과 대전대신고등학교 주변 실제 지도"
            className="h-[60vh] min-h-[400px] w-full border-0"
            src="https://www.openstreetmap.org/export/embed.html?bbox=127.3717%2C36.3050%2C127.3880%2C36.3165&layer=mapnik&marker=36.31068372534%2C127.37972555946"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* 지도 정보 */}
        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#d8d0bf] bg-[#fffdf6] p-4">
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-[#3b7d57]">
              중심 좌표
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#15231d]">
              36.3106837, 127.3797256
            </dd>
          </div>
          <div className="rounded-lg border border-[#d8d0bf] bg-[#fffdf6] p-4">
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-[#3b7d57]">
              기준 위치
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#15231d]">
              대전 서구 오량1길 98
            </dd>
          </div>
          <div className="rounded-lg border border-[#d8d0bf] bg-[#fffdf6] p-4">
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-[#3b7d57]">
              관찰 거점
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#15231d]">
              12개 지점 운영 중
            </dd>
          </div>
        </dl>
      </section>

      {/* 통계 */}
      <section className="bg-[#e7efe4] px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 text-center">
          {[
            { value: "12", label: "오량산 관찰 거점" },
            { value: "18.6t", label: "연간 탄소 저감 추정" },
            { value: "1,284", label: "시민 참여 기록" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-semibold text-[#15231d] sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[#4d5a52]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
