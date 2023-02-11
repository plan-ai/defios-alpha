export function RedCross(props: React.SVGAttributes<{}>) {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      {...props}
    >
      <path
        d="M1.46445 8.53542L8.53552 1.46436"
        stroke="#dc2626"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M1.46446 1.46458L8.53552 8.53564"
        stroke="#dc2626"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
