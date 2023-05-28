import React from 'react';
// import React, { useState, useEffect } from 'react';
// import Input from '@/components/ui/forms/input';
// import Button from '@/components/ui/button/button';
// import { useAppDispatch, useAppSelector } from '@/store/store';
// import { setDistribution } from '@/store/creationSlice';
// import Image from 'next/image';

// interface DistributionModalProps {
//   editData: any;
//   setEditData: React.Dispatch<React.SetStateAction<any>>;
//   modalOpen: boolean;
//   setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const DistributionModal: React.FC<DistributionModalProps> = ({
//   editData,
//   setEditData,
//   modalOpen,
//   setModalOpen,
// }) => {
//   const dispatch = useAppDispatch();

//   const Contributors = useAppSelector(
//     (state) => state.creation.step3.distribution
//   );

//   const [newValue, setNewValue] = useState('');

//   const handleEditSumbit = () => {
//     if (newValue === '') return;
//     const data: any = {};
//     const oldVal = parseFloat(Contributors[editData.login]);
//     const newVal = parseFloat(newValue);

//     const percentageLeft = parseFloat('30');

//     const dataContributors = Object.keys(Contributors);

//     dataContributors.forEach((contri: any) => {
//       if (contri === editData.login) {
//         data[contri] = newVal + '%';
//       } else {
//         data[contri] =
//           parseFloat(Contributors[contri]) *
//           (1 - (newVal - oldVal) / (percentageLeft - oldVal));
//         data[contri] += '%';
//       }
//     });
//     dispatch(setDistribution(data));
//     setNewValue('');
//     setEditData(null);
//     setModalOpen(false);
//   };

//   return (
//     <div className="flex h-full w-full flex-col justify-between p-5 gap-3">
//       <div className="flex w-full items-center">
//         <div className="relative mr-5 h-12 w-12 rounded-full bg-black xl:h-14 xl:w-14 3xl:h-16 3xl:w-16">
//           <Image
//             src={editData.avatar_url || ''}
//             alt={editData.login || ''}
//             fill
//             className="rounded-full object-cover"
//           />
//         </div>
//         <div className="flex flex-col gap-2">
//           <div>{editData.login}</div>
//         </div>
//       </div>
//       <Input
//         type="number"
//         placeholder="split in %"
//         label="split in %"
//         value={newValue}
//         onChange={(e) => setNewValue(e.target.value)}
//       />
//       <Button onClick={handleEditSumbit} shape="rounded" color="info">
//         Save New Split
//       </Button>
//     </div>
//   );
// };

const DistributionModal = () => {
  return <div></div>;
};

export default DistributionModal;
