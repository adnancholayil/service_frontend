'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import { LogOut } from 'lucide-react';

import { closeLogoutModal } from '../../store/slices/appSlice';
import { logout } from '../../store/slices/authSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function LogoutConfirmModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const client = useApolloClient();
  const { logoutModalOpen } = useSelector((state) => state.app);
  const [isLoading, setIsLoading] = useState(false);

  if (!logoutModalOpen) return null;

  const handleClose = () => {
    dispatch(closeLogoutModal());
  };

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      dispatch(logout());
      await client.clearStore();
      
      // Clear any cookies or local storage if needed
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  return (
    <Modal
      isOpen={logoutModalOpen}
      onClose={handleClose}
      title="Confirm Logout"
      size="sm"
    >
      <div className="space-y-6 text-center pt-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
          <LogOut className="h-8 w-8 text-red-600" />
        </div>
        
        <h3 className="text-lg font-bold text-slate-900">
          Ready to leave?
        </h3>
        
        <p className="text-sm text-slate-500">
          Are you sure you want to log out of your account? You will need to sign in again to access your dashboard.
        </p>

        <div className="flex flex-col gap-3 mt-8">
          <Button 
            onClick={handleConfirmLogout} 
            isLoading={isLoading} 
            className="w-full justify-center bg-red-600 hover:bg-red-700 text-white"
          >
            Yes, log out
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isLoading}
            className="w-full justify-center"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
