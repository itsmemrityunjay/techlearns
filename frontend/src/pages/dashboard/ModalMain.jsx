// src/components/ModalMain.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Delete, Block, Close } from '@mui/icons-material';

const ModalMain = ({ 
  onClose, 
  item, 
  handleDeleteUser, 
  handleBlockUser, 
  handleDeleteCourse 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {item?.type === 'user' ? 'User Actions' : 'Course Actions'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Close />
          </button>
        </div>

        <div className="space-y-4">
          {item?.type === 'user' ? (
            <>
              <button
                onClick={() => {
                  handleBlockUser(item.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
              >
                <span className="flex items-center space-x-2 text-yellow-700">
                  <Block />
                  <span>Block User</span>
                </span>
                <span className="text-sm text-yellow-600">Temporarily restrict access</span>
              </button>

              <button
                onClick={() => {
                  handleDeleteUser(item.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
              >
                <span className="flex items-center space-x-2 text-red-700">
                  <Delete />
                  <span>Delete User</span>
                </span>
                <span className="text-sm text-red-600">Permanently remove user</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                handleDeleteCourse(item.id);
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            >
              <span className="flex items-center space-x-2 text-red-700">
                <Delete />
                <span>Delete Course</span>
              </span>
              <span className="text-sm text-red-600">Permanently remove course</span>
            </button>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalMain;