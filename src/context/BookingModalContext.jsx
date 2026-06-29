'use client';
import React, { createContext, useContext, useState } from 'react';
import BookingModal from '../components/BookingModal';

const BookingModalContext = createContext();

export const useBookingModal = () => useContext(BookingModalContext);

export const BookingModalProvider = ({ children }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  return (
    <BookingModalContext.Provider value={{ isBookingModalOpen, openBookingModal, closeBookingModal }}>
      {children}
      <BookingModal isOpen={isBookingModalOpen} onClose={closeBookingModal} />
    </BookingModalContext.Provider>
  );
};
