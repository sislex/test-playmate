import React, { useEffect } from "react";

import { Dialog } from "@headlessui/react";


import { DialogCrossButton } from "components/DialogCrossButton";


interface WalletDialogContentProps {
  onClose: () => void;
}
export function WalletDialogContent({ onClose }: WalletDialogContentProps) {
  return (
    <>
      <Dialog.Title as='header' className='relative'>
        <h2 className='text-center text-2xl font-bold desk-dialog:mx-16'>
          Balance/Payment
        </h2>
        <DialogCrossButton onClick={onClose} />
      </Dialog.Title>

      <div className='mt-5 rounded-2.5xl border border-grey-high px-6 py-3 text-center text-lg desk-dialog:mx-32'>
        You owe a total of <span className='font-bold text-blue-high'>$85</span>
      </div>

      <footer className='mt-14 flex flex-wrap gap-x-7 gap-y-4 sm:justify-center'>
        <button
          onClick={onClose}
          className='flex-1 rounded-half bg-grey-high px-16 py-3 text-dim-white hover:bg-blue-high/10 sm:flex-initial'
        >
          Cancel
        </button>
        <button className='flex-1 rounded-half bg-blue-high px-16 py-3 text-dim-black hover:bg-blue-high/80 sm:flex-initial'>
          Pay All
        </button>
      </footer>
    </>
  );
}

