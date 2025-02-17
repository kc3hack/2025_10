'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  isOnlyOK?: boolean;
  yesCallback?: () => void;
  noCallback?: () => void;
  yesText?: string;
  noText?: string;
}

const Dialog = ({
  isOpen,
  title,
  description,
  isOnlyOK,
  yesCallback,
  noCallback,
  yesText,
  noText,
}: DialogProps) => {
  const [open, setOpen] = useState(isOpen);

  // isOpenの変更を検知
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const clickYes = () => {
    yesCallback?.();
    setOpen(false);
  };

  const clickNo = () => {
    noCallback?.();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-center text-black'>{title}</AlertDialogTitle>
          <AlertDialogDescription className='text-center text-black'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='mx-auto'>
          {isOnlyOK ? (
            <AlertDialogAction onClick={clickYes}>{yesText}</AlertDialogAction>
          ) : (
            <>
              <AlertDialogCancel onClick={clickNo}>{noText}</AlertDialogCancel>
              <AlertDialogAction
                className='bg-orange-400 hover:bg-orange-200 text-black'
                onClick={clickYes}
              >
                {yesText}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Dialog;
