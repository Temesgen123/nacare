export default function NacareLogo({ size = 'default', showText = true }) {
  const sizes = {
    small: { width: 120, height: 40, iconSize: 32 },
    default: { width: 200, height: 60, iconSize: 48 },
    large: { width: 280, height: 80, iconSize: 64 },
  };

  const { width, height, iconSize } = sizes[size] || sizes.default;

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className="flex items-center gap-2"
    >
      {/* House + Stethoscope Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* House outline with rounded corners */}
        <path
          d="M32 8L10 26V54C10 56.2091 11.7909 58 14 58H50C52.2091 58 54 56.2091 54 54V26L32 8Z"
          stroke="url(#gradient1)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Stethoscope */}
        {/* Ear tips */}
        <circle cx="24" cy="30" r="3" fill="url(#gradient2)" />
        <circle cx="40" cy="30" r="3" fill="url(#gradient2)" />

        {/* Tubes */}
        <path
          d="M24 33C24 38 26 42 32 45C38 42 40 38 40 33"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Chest piece (diaphragm) */}
        <circle
          cx="32"
          cy="48"
          r="6"
          fill="url(#gradient2)"
          stroke="url(#gradient1)"
          strokeWidth="2"
        />
        <circle cx="32" cy="48" r="3" fill="white" opacity="0.3" />

        {/* Gradients */}
        <defs>
          <linearGradient
            id="gradient1"
            x1="10"
            y1="8"
            x2="54"
            y2="58"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#5b3da1" />
            <stop offset="100%" stopColor="#2d3561" />
          </linearGradient>
          <linearGradient
            id="gradient2"
            x1="20"
            y1="30"
            x2="44"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#5b3da1" />
            <stop offset="100%" stopColor="#4c2f87" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className="font-bold tracking-tight"
            style={{
              fontSize:
                size === 'small'
                  ? '1.25rem'
                  : size === 'large'
                    ? '2rem'
                    : '1.5rem',
              color: '#2d3561',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Nacare
          </span>
          <span
            className="font-semibold"
            style={{
              fontSize:
                size === 'small'
                  ? '0.75rem'
                  : size === 'large'
                    ? '1.125rem'
                    : '0.875rem',
              color: '#5b3da1',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Home Checkup
          </span>
          <span
            className="italic text-gray-500"
            style={{
              fontSize:
                size === 'small'
                  ? '0.625rem'
                  : size === 'large'
                    ? '0.875rem'
                    : '0.75rem',
              fontFamily: 'Georgia, serif',
            }}
          >
            Care Deliverd Home
          </span>
        </div>
      )}
    </div>
  );
}
