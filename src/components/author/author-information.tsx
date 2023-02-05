import cn from 'classnames';
import Button from '@/components/ui/button';
import AnchorLink from '@/components/ui/links/anchor-link';
import { InfoIcon } from '@/components/icons/info-icon';

interface AuthorInformationProps {
  data: any;
  className?: string;
}
export default function AuthorInformation({
  className = 'md:hidden',
  data,
}: AuthorInformationProps) {
  return (
    <div className={`${className}`}>
      {/* Bio */}
      <div className="border-y border-dashed border-gray-700 py-5 xl:py-6">
        <div className="mb-2 text-sm font-medium uppercase tracking-wider text-white">
          Bio
        </div>
        <div className="text-sm leading-6 tracking-tighter text-gray-400">
          {data?.bio}
        </div>
      </div>

      {/* Social */}
      <div className="border-y border-dashed border-gray-700 py-5 xl:py-6">
        <div className="mb-2 text-sm font-medium uppercase tracking-wider text-white">
          Social
        </div>
        {data?.socials?.map((social: any) => (
          <AnchorLink
            href={social?.link}
            className="mb-2 flex items-center gap-x-2 text-sm tracking-tight text-gray-400 transition last:mb-0 hover:text-white hover:underline"
            key={`social-key-${social?.id}`}
          >
            {social?.icon}
            {social?.title}
          </AnchorLink>
        ))}
      </div>

      {/* Links */}
      <div
        className={cn('border-y  border-dashed border-gray-700 py-5 xl:py-6')}
      >
        <div className="mb-2 text-sm font-medium uppercase tracking-wider text-white">
          Links
        </div>
        {data?.links?.map((item: any) => (
          <AnchorLink
            href={item?.link}
            className="mb-2 flex items-center text-sm tracking-tight text-gray-400 transition last:mb-0 hover:text-white hover:underline"
            key={`link-key-${item?.id}`}
          >
            {item?.link}
          </AnchorLink>
        ))}
      </div>

      {/* Join date */}
      <div className="border-y border-dashed border-gray-700 py-5 xl:py-6">
        <div className="text-sm font-medium uppercase tracking-wider text-white">
          Joined {data?.created_at}
        </div>
      </div>
      {/* Report button */}
      <Button
        color="gray"
        className="mt-5 h-8 bg-gray-600 font-normal text-gray-200 hover:text-white md:h-9 md:px-4 lg:mt-6"
      >
        <span className="flex items-center gap-2">
          <InfoIcon className="h-3 w-3" /> report
        </span>
      </Button>
    </div>
  );
}
