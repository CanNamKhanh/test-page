"use client";

export const ActionBtn = ({
  onClick,
  label,
  count,
  children,
}: {
  onClick?: () => void;
  label: string;
  count: number | string;
  children: React.ReactNode;
}) => (
  <div
    className="flex flex-col items-center text-[#d1c2c2] font-medium gap-0.5"
    aria-label={label}
  >
    <button
      onClick={onClick}
      className="w-10 h-10 sm:w-11 sm:h-11 md:w-13 md:h-13 flex justify-center items-center rounded-full bg-[#1F1F1F] hover:bg-[#141414] active:scale-90 transition-all"
    >
      {children}
    </button>
    <span className="text-xs sm:text-sm">{count}</span>
  </div>
);
