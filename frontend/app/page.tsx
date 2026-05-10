import Image from "next/image";

const impactStats = [
  { value: "12", label: "오량산 관찰 거점" },
  { value: "18.6t", label: "연간 탄소 저감 추정" },
  { value: "1,284", label: "시민 참여 기록" },
];

const programs = [
  {
    title: "오량산 생태 지도",
    eyebrow: "Map",
    description:
      "학교 옆 산길, 숲 가장자리, 재활용 거점을 한 화면에서 살피고 현장 상태를 기록합니다.",
  },
  {
    title: "제로웨이스트 루틴",
    eyebrow: "Action",
    description:
      "학교와 동네에서 바로 실천할 수 있는 분리배출, 다회용기, 수리 문화 과제를 운영합니다.",
  },
  {
    title: "기후 데이터 리포트",
    eyebrow: "Report",
    description:
      "관찰 기록을 월간 리포트로 정리해 개선이 필요한 공간과 활동 성과를 공유합니다.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ec] text-[#15231d]">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/20 bg-[#15231d]/75 backdrop-blur-md">
        <nav
          aria-label="주요 메뉴"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 text-white sm:px-8"
        >
          <a className="text-lg font-semibold tracking-[0.08em]" href="#">
            ECOMAP
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            <a className="transition hover:text-white" href="#mission">
              미션
            </a>
            <a className="transition hover:text-white" href="#program">
              프로그램
            </a>
            <a className="transition hover:text-white" href="#field">
              현장 지도
            </a>
            <a className="transition hover:text-white" href="#join">
              참여
            </a>
          </div>
          <a
            className="rounded-full bg-[#f2c14e] px-4 py-2 text-sm font-semibold text-[#15231d] shadow-sm transition hover:bg-[#ffd36b]"
            href="#join"
          >
            함께 시작
          </a>
        </nav>
      </header>

      <section className="relative min-h-[92svh] overflow-hidden">
        <Image
          src="/eco-hero.png"
          alt="오량산을 배경으로 학생들이 학교 주변 생태 지도를 확인하는 모습"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,31,24,0.86)_0%,rgba(15,31,24,0.68)_34%,rgba(15,31,24,0.16)_68%,rgba(15,31,24,0.04)_100%)]" />
        <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 lg:pb-20">
          <div className="max-w-2xl text-white">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#f2c14e]">
              Local climate action platform
            </p>
            <h1 className="text-5xl font-semibold leading-[1.03] sm:text-6xl lg:text-7xl">
              ECOMAP
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/86 sm:text-xl">
              대전대신고등학교 옆 오량산의 숲길과 생활권 자원순환 거점을
              기록해 더 나은 환경 행동을 만드는 웹사이트입니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#f2c14e] px-6 text-sm font-bold text-[#15231d] transition hover:bg-[#ffd36b]"
                href="#field"
              >
                거점 살펴보기
              </a>
              <a
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/45 px-6 text-sm font-bold text-white transition hover:bg-white/12"
                href="#program"
              >
                활동 보기
              </a>
            </div>
          </div>
          <div className="mt-14 grid max-w-3xl grid-cols-3 gap-3">
            {impactStats.map((stat) => (
              <div
                className="border-l border-white/28 py-2 pl-4 text-white"
                key={stat.label}
              >
                <p className="text-2xl font-semibold sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-white/70 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="mission"
        className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-28"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#3b7d57]">
            Mission
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            오량산을 멀리 있는 배경이 아니라 매일 지나가는 환경 현장으로
            보여줍니다.
          </h2>
        </div>
        <div className="grid gap-5 text-base leading-8 text-[#3b463f] sm:grid-cols-2">
          <p>
            ECOMAP은 오량산 주변 관찰, 실천 과제, 데이터 리포트를 연결합니다.
            학생과 시민이 올린 기록은 활동 제안과 개선 요청의 근거가 되고,
            학교와 동아리는 지속 가능한 프로젝트를 꾸준히 운영할 수 있습니다.
          </p>
          <p>
            웹사이트의 기준은 명확합니다. 보기 좋은 캠페인에서 끝나지 않고,
            어디를 살피고 무엇을 바꿀지 바로 결정할 수 있는 환경 정보를
            제공합니다.
          </p>
        </div>
      </section>

      <section id="program" className="bg-[#e7efe4] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#3b7d57]">
                Program
              </p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                기록이 활동으로 이어지는 구조
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#4d5a52]">
              개별 캠페인을 나열하지 않고, 관찰부터 실천과 리포트까지 같은
              흐름에서 운영합니다.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {programs.map((program) => (
              <article
                className="rounded-lg border border-[#c8d7c2] bg-[#fbfaf5] p-6 shadow-sm"
                key={program.title}
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c47d2f]">
                  {program.eyebrow}
                </p>
                <h3 className="mt-5 text-2xl font-semibold">
                  {program.title}
                </h3>
                <p className="mt-4 leading-7 text-[#506158]">
                  {program.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="field"
        className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-28"
      >
        <div className="overflow-hidden rounded-lg border border-[#d8d0bf] bg-[#fffdf6] shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-[#d8d0bf] px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3b7d57]">
                Live map
              </p>
              <h3 className="mt-1 text-lg font-semibold">
                오량산 · 대전대신고 주변
              </h3>
            </div>
            <a
              className="shrink-0 rounded-full bg-[#15231d] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2f4639]"
              href="https://www.openstreetmap.org/?mlat=36.31068372534&mlon=127.37972555946#map=16/36.31068372534/127.37972555946"
              target="_blank"
              rel="noreferrer"
            >
              크게 보기
            </a>
          </div>
          <iframe
            title="오량산과 대전대신고등학교 주변 실제 지도"
            className="h-[460px] w-full border-0"
            src="https://www.openstreetmap.org/export/embed.html?bbox=127.3717%2C36.3050%2C127.3880%2C36.3165&layer=mapnik&marker=36.31068372534%2C127.37972555946"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#3b7d57]">
            Field map
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            실제 지도 위에서 오량산 주변 환경 거점을 확인합니다.
          </h2>
          <p className="mt-6 text-base leading-8 text-[#4d5a52]">
            대전대신고등학교 주소 좌표를 기준으로 지도를 띄웠습니다. 운영 시 이
            지도 위에 숲길 입구, 분리배출함, 생태 관찰 지점 같은 환경 거점을
            마커로 추가하면 됩니다.
          </p>
          <dl className="mt-8 grid gap-3 text-sm text-[#3f4e45] sm:grid-cols-2">
            <div className="rounded-lg border border-[#d8d0bf] bg-[#fffdf6] p-4">
              <dt className="font-bold text-[#15231d]">중심 좌표</dt>
              <dd className="mt-1">36.3106837, 127.3797256</dd>
            </div>
            <div className="rounded-lg border border-[#d8d0bf] bg-[#fffdf6] p-4">
              <dt className="font-bold text-[#15231d]">기준 위치</dt>
              <dd className="mt-1">대전 서구 오량1길 98</dd>
            </div>
          </dl>
          <a
            className="mt-8 inline-flex h-12 w-fit items-center justify-center rounded-full bg-[#15231d] px-6 text-sm font-bold text-white transition hover:bg-[#2f4639]"
            href="#join"
          >
            기록 제안하기
          </a>
        </div>
      </section>

      <section id="join" className="bg-[#15231d] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f2c14e]">
              Join
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              관찰할 장소와 함께할 팀을 알려주세요.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">
              동아리, 학교, 주민 모임 단위로 참여할 수 있습니다. 하천 조사,
              쓰레기 배출 개선, 생물 다양성 기록처럼 지역에 맞는 주제로
              시작합니다.
            </p>
          </div>
          <div className="rounded-lg border border-white/14 bg-white/8 p-6">
            <dl className="space-y-5">
              <div>
                <dt className="text-sm font-semibold text-[#f2c14e]">
                  운영 문의
                </dt>
                <dd className="mt-1 text-lg font-semibold">
                  contact@ecomap.kr
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-[#f2c14e]">
                  활동 지역
                </dt>
                <dd className="mt-1 text-lg font-semibold">
                  대전대신고 주변, 오량산 숲길, 생활권 자원순환 거점
                </dd>
              </div>
            </dl>
            <a
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-[#15231d] transition hover:bg-[#f5e8bf]"
              href="mailto:contact@ecomap.kr?subject=ECOMAP%20%EC%B0%B8%EC%97%AC%20%EB%AC%B8%EC%9D%98"
            >
              이메일로 참여 문의
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
