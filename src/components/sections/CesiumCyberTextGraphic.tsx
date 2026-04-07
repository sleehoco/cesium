const sourceRows = [
  'managed cybersecurity security assessments incident response microsoft 365 security endpoint hardening monitoring recovery',
  'small business cybersecurity services practical fixes fast support plain-english guidance columbia maryland',
  'protect email devices customer data identity backups tenants logs access review incident containment',
  'same-day help for urgent incidents no generic helpdesk no 200-page reports practical security work',
  'microsoft 365 hardening phishing protection conditional access baseline logging resilience recovery',
  'threat monitoring vulnerability assessment penetration testing remediation tabletop exercises business continuity',
  'secure tenants endpoints mailboxes backups policies firewalls responders analysts consultants operations',
  'risk reduction practical controls vendor review cloud posture training awareness response planning',
  'security support that is clear responsive and built for small teams who need real help',
  'managed cybersecurity services for local and nationwide teams identity endpoint email and cloud protection',
  'incident response hardening monitoring advisory assessment remediation baseline review secure configuration',
  'cesium cyber protects small businesses with practical security work clear communication and fast support',
];

const rowTransform = (index: number, dissolving: boolean, intensity = 1) => {
  if (!dissolving) {
    return 'translate(0 0) scale(1)';
  }

  const direction = index % 2 === 0 ? -1 : 1;
  const spreadX = (18 + (index % 4) * 7) * direction * intensity;
  const spreadY = (index - 10.5) * 2.2 * intensity;
  const scale = 1 - 0.045 * intensity;

  return `translate(${spreadX} ${spreadY}) scale(${scale})`;
};

interface CesiumCyberTextGraphicProps {
  fullscreen?: boolean;
  dissolving?: boolean;
}

const CesiumCyberTextGraphic = ({ fullscreen = false, dissolving = false }: CesiumCyberTextGraphicProps) => {
  const rows = Array.from({ length: 18 }, (_, index) => sourceRows[index % sourceRows.length]);

  return (
    <div
      className={
        fullscreen
          ? `fixed inset-0 z-[120] overflow-hidden bg-[#05080d] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${dissolving ? 'opacity-0 blur-md scale-[1.03]' : 'opacity-100 blur-0 scale-100'}`
          : 'relative overflow-hidden bg-[#05080d]'
      }
    >
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(122,216,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.09),transparent_30%)] transition-opacity duration-1000 ${dissolving ? 'opacity-0' : 'opacity-100'}`} />
      <div className={fullscreen ? 'relative flex min-h-screen items-center justify-center px-4 py-8' : 'relative px-4 py-4'}>
        <div className={`${fullscreen ? 'w-full max-w-7xl' : ''} transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${dissolving ? 'translate-y-8 scale-[1.015]' : 'translate-y-0 scale-100'}`}>
        <svg
          viewBox="0 0 760 420"
          className={fullscreen ? 'w-full h-auto max-h-[78vh]' : 'w-full h-auto'}
          role="img"
          aria-label="CesiumCyber logo emerging from a field of security text"
        >
          <defs>
            <clipPath id="cesium-logo-clip">
              <text
                x="26"
                y="170"
                fontFamily='"Space Grotesk", ui-sans-serif, sans-serif'
                fontWeight="700"
                fontSize="116"
                letterSpacing="-4"
              >
                CESIUM
              </text>
              <text
                x="26"
                y="292"
                fontFamily='"Space Grotesk", ui-sans-serif, sans-serif'
                fontWeight="700"
                fontSize="116"
                letterSpacing="-4"
              >
                CYBER
              </text>
            </clipPath>
          </defs>

          <rect
            x="20"
            y="74"
            width="720"
            height="228"
            rx="6"
            fill={dissolving ? 'rgba(5,8,13,0.28)' : 'rgba(5,8,13,0.62)'}
            stroke={dissolving ? 'rgba(212,175,55,0.06)' : 'rgba(212,175,55,0.22)'}
            strokeWidth="1.2"
            style={{
              transition: 'fill 700ms ease, stroke 700ms ease, opacity 700ms ease',
            }}
          />
          <rect
            x="44"
            y="114"
            width="672"
            height="144"
            rx="4"
            fill={dissolving ? 'rgba(2,4,8,0.1)' : 'rgba(2,4,8,0.28)'}
            style={{ transition: 'fill 700ms ease' }}
          />
          <line x1="34" y1="108" x2="726" y2="108" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="34" y1="272" x2="726" y2="272" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {rows.map((row, index) => (
            <text
              key={`bg-${index}`}
              x={12 + (index % 3) * 6}
              y={28 + index * 21}
              fill={dissolving ? 'rgba(218,226,242,0.03)' : 'rgba(218,226,242,0.065)'}
              fontFamily='"IBM Plex Mono", ui-monospace, monospace'
              fontSize="15.5"
              letterSpacing="0.7"
              transform={rowTransform(index, dissolving)}
              style={{
                transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), fill 700ms ease',
                transitionDelay: `${index * 24}ms`,
              }}
            >
              {row}
            </text>
          ))}

          <g clipPath="url(#cesium-logo-clip)">
            <rect x="0" y="0" width="760" height="420" fill="rgba(0,0,0,0.18)" />
            {rows.map((row, index) => (
              <text
                key={`logo-${index}`}
                x={10 + (index % 2) * 12}
                y={28 + index * 21}
                fill={
                  dissolving
                    ? index % 3 === 0
                      ? 'rgba(255,205,111,0.22)'
                      : index % 3 === 1
                        ? 'rgba(140,223,255,0.18)'
                        : 'rgba(214,223,255,0.16)'
                    : index % 3 === 0
                      ? 'rgba(255,205,111,0.92)'
                      : index % 3 === 1
                        ? 'rgba(140,223,255,0.9)'
                        : 'rgba(214,223,255,0.88)'
                }
                fontFamily='"IBM Plex Mono", ui-monospace, monospace'
                fontSize="16.5"
                letterSpacing="0.85"
                transform={rowTransform(index, dissolving, 1.35)}
                style={{
                  transition: 'transform 950ms cubic-bezier(0.22, 1, 0.36, 1), fill 760ms ease',
                  transitionDelay: `${index * 28}ms`,
                }}
              >
                {row}
              </text>
            ))}
          </g>

          <g aria-hidden="true">
            <text
              x="26"
              y="170"
              fontFamily='"Space Grotesk", ui-sans-serif, sans-serif'
              fontWeight="700"
              fontSize="116"
              letterSpacing="-4"
              fill="none"
              stroke={dissolving ? 'rgba(255,214,132,0.12)' : 'rgba(255,214,132,0.48)'}
              strokeWidth="2.2"
              paintOrder="stroke"
              style={{ transition: 'stroke 700ms ease' }}
            >
              CESIUM
            </text>
            <text
              x="26"
              y="292"
              fontFamily='"Space Grotesk", ui-sans-serif, sans-serif'
              fontWeight="700"
              fontSize="116"
              letterSpacing="-4"
              fill="none"
              stroke={dissolving ? 'rgba(140,223,255,0.1)' : 'rgba(140,223,255,0.42)'}
              strokeWidth="2.2"
              paintOrder="stroke"
              style={{ transition: 'stroke 700ms ease' }}
            >
              CYBER
            </text>
          </g>
        </svg>
        </div>
      </div>
    </div>
  );
};

export default CesiumCyberTextGraphic;
