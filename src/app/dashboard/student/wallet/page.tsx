'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts';
import { Card, Input, Button, Modal, ModalBody, ModalFooter } from '@/components/common';
import { toast } from '@/components/common/Toast';
import { useModalStore } from '@/store';
import { formatCurrency } from '@/utils/helpers';
import { mockLipanaSTKPush } from '@/utils/helpers';
import { mockStudents } from '@/utils/mockData';
import { DollarSign, Plus } from 'lucide-react';

export default function WalletPage() {
  const student = mockStudents[0];
  const { openModal, closeModal } = useModalStore();
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = async () => {
    if (!amount || Number(amount) < 10) {
      toast.error('Minimum amount is KES 10');
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await mockLipanaSTKPush(phoneNumber, Number(amount));
      if (result.success) {
        toast.success('STK Push sent! Check your phone');
        closeModal('wallet-topup');
        setAmount('');
        setPhoneNumber('');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-2">Manage your account balance and transactions</p>
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-100">Available Balance</p>
              <p className="text-5xl font-bold mt-2">{formatCurrency(student.wallet)}</p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <DollarSign size={40} />
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => openModal('wallet-topup')}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Top Up Wallet
          </Button>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Top Up</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[500, 1000, 2000, 5000].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setAmount(amt.toString());
                  openModal('wallet-topup');
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center shadow-sm bg-white"
              >
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(amt)}</p>
                <p className="text-xs text-gray-500 mt-1">Tap to top up</p>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Modal id="wallet-topup" title="Top Up Wallet" size="md">
        <ModalBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Amount (KES)"
              type="number"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              helperText="Minimum amount: KES 10"
            />
            <Input
              label="M-Pesa Phone Number"
              type="tel"
              placeholder="254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              helperText="Enter your Safaricom number"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => closeModal('wallet-topup')}>
            Cancel
          </Button>
          <Button onClick={handleTopUp} isLoading={isProcessing}>
            Pay with M-Pesa
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
}
