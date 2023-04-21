import Image from 'next/image';
type AuthorCardProps = {
  image: string;
  name?: string;
  role?: string;
};

export default function AuthorCard({ image, name, role }: AuthorCardProps) {
  return (
    <div
      className={`flex items-center rounded-xl  ${
        name
          ? 'bg-light-dark  px-3 py-4'
          : 'ml-3 mr-3 justify-center bg-none p-3 py-4'
      }`}
    >
      <Image
        src={image}
        alt={name || ''}
        className="rounded-full border-2 border-gray-400"
        width={56}
        height={56}
      />
      <div className="pl-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-white">
          {name}
        </h3>
        <span className="mt-1 block text-xs text-gray-400">{role}</span>
      </div>
    </div>
  );
}
