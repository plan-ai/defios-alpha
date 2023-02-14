import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button/button';

interface DistributionModalProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  editData: string;
  setEditData: React.Dispatch<React.SetStateAction<string>>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DistributionModal: React.FC<DistributionModalProps> = ({
  data,
  setData,
  editData,
  setEditData,
  modalOpen,
  setModalOpen,
}) => {
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [split, setSplit] = useState(0);
  useEffect(() => {
    if (modalOpen) {
      const dataToEdit = data.filter((item: any) => {
        return item.username === editData;
      });
      setUsername(dataToEdit[0].username);
      setAddress(dataToEdit[0].address);
      setSplit(dataToEdit[0].split);
    }
  }, [editData, data, modalOpen]);

  const handleSubmit = () => {
    const newData = data.map((item: any) => {
      if (item.username === username) {
        item.split = split;
        return item;
      } else {
        return item;
      }
    });
    setUsername('');
    setAddress('');
    setSplit(0);
    setEditData('');
    setModalOpen(false);
    setData(newData);
  };

  return (
    <div className="flex h-full w-full flex-col justify-between p-5">
      <div className="flex w-full items-center">
        <div className="mr-5 h-16 w-16 rounded-full bg-black"></div>
        <div className="flex flex-col gap-2">
          <div>{username}</div>
          <div>{address}</div>
        </div>
      </div>
      <Input
        type="number"
        placeholder="split in %"
        label="split in %"
        value={split}
        onChange={(e) => setSplit(parseInt(e.target.value))}
      />
      <Button onClick={handleSubmit} shape="rounded" color="info">
        Save New Split
      </Button>
    </div>
  );
};

export default DistributionModal;
