// 階段を一歩ずつ登る人物と「step by step」の文字。トップのキャッチコピーの上に置き、サイトの合言葉を絵で見せる。
export function StepByStep() {
  return (
    <div className="kobo-home__signature" aria-label="step by step、一歩ずつ">
      <span className="kobo-home__signatureLabel" lang="en">step by step</span>
      <svg className="kobo-home__staircase" viewBox="0 0 180 112" fill="none" aria-hidden focusable="false">
        <path d="M8 103H37V84H69V65H101V46H133V27H172V108H8Z" fill="var(--background)" />
        <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 103L37 102V84L69 83V65L101 64V46L133 45V27L172 26" />
          <path d="M13 108H169" strokeWidth="1.2" opacity=".22" />
          <g>
            <path d="M102 11Q103 5 110 6Q118 6 117 14Q116 21 109 21Q102 20 102 13Z" fill="#fff" />
            <path d="M102 11Q105 4 111 6Q117 6 117 12L110 9L103 13" fill="currentColor" strokeWidth="1.4" />
            <path d="M108 23L102 29L98 39L108 44L113 33L108 23Z" fill="#fff" />
            <path d="M107 27L116 30L124 24M102 29L93 28L87 34" />
            <path d="M100 40L91 49L93 62L101 63M105 42L115 35L123 43L130 44" />
            <path d="M114 14H117" strokeWidth="1.3" />
          </g>
          <path d="M146 12L150 8M157 17L163 16" strokeWidth="1.5" opacity=".6" />
        </g>
      </svg>
    </div>
  );
}
