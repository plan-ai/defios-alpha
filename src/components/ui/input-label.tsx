interface InputLabelProps {
  title: string;
  subTitle?: string;
  important?: boolean;
}

function InputLabel({ title, subTitle, important }: InputLabelProps) {
  return (
    <div className="relative mb-3">
      <span className="block text-sm font-medium uppercase tracking-wider text-white">
        {title}
        {important && <sup className="ml-1.5 text-red-500">*</sup>}
      </span>
      {subTitle && (
        <span className="mt-1 block text-xs tracking-tighter text-gray-400 sm:text-sm">
          {subTitle}
        </span>
      )}
    </div>
  );
}

export default InputLabel;
