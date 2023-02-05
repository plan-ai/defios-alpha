import Avatar from '@/components/ui/avatar';
import { StaticImageData } from 'next/image';

type AuthorCardProps = {
  image: StaticImageData;
  name?: string;
  role?: string;
};

export default function AuthorCard({ image, name, role }: AuthorCardProps) {
  return (
    <div
      className={`flex items-center rounded-lg  ${
        name
          ? 'p-5  bg-light-dark'
          : 'ml-3 justify-center p-5 mr-3 bg-none'
      }`}
    >
      <Avatar
        image={image}
        alt={name ? name : ''}
        className="border-gray-400"
      />
      <div className="pl-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-white">
          {name}
        </h3>
        <span className="mt-1 block text-xs text-gray-400">
          {role}
        </span>
      </div>
    </div>
  );
}
