import Avatar from '@/components/ui/avatar';
import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';

export default function Followers({ ...props }) {
  const { data } = useModal();

  return (
    <div
      className="relative z-50 mx-auto h-[600px] w-[540px] max-w-full rounded-lg bg-light-dark px-6 py-6"
      {...props}
    >
      {data && (
        <h3 className="mb-5 text-left text-lg font-medium">
          {data?.title} ({data?.count})
        </h3>
      )}
      <Scrollbar style={{ height: 'calc(100% - 60px)' }}>
        <div className="pr-2">
          {data?.users.map((user: any, index: number) => (
            <div
              className="flex items-center border-b border-dashed border-gray-700 py-4 text-center"
              key={user.name + index}
            >
              <Avatar
                className="!h-12 !w-12"
                image={user?.thumbnail}
                alt="Author"
              />
              <h2 className="text-md ml-4 tracking-tighter text-white">
                {user?.name}
              </h2>
              <Button
                color="white"
                className="ml-auto bg-light-dark shadow-card md:h-10 md:px-5 xl:h-12 xl:px-7"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Scrollbar>
    </div>
  );
}
