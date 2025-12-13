'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Modal, ModalBody, ModalFooter } from '@/components/common';
import { toast } from '@/components/common/Toast';
import { useModalStore } from '@/store';
import { Check } from 'lucide-react';
import { mockLipanaSTKPush } from '@/utils/helpers';
import { subscriptionTiers } from '@/utils/mockData';

export const SubscriptionPlans: React.FC = () => {
  const { openModal, closeModal, isOpen } = useModalStore();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    openModal('subscription-payment');
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await mockLipanaSTKPush(phoneNumber, selectedPlan.price);
      if (result.success) {
        toast.success('STK Push sent! Check your phone to complete payment');
        closeModal('subscription-payment');
        setPhoneNumber('');
        openModal('stk-confirmation');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {subscriptionTiers.map((plan) => (
          <Card key={plan.id} className="relative">
            {plan.id === 'premium' && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                Popular
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                KES {plan.price}
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <Check size={20} className="text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              fullWidth
              variant={plan.id === 'premium' ? 'primary' : 'secondary'}
              onClick={() => handleSelectPlan(plan)}
            >
              Subscribe Now
            </Button>
          </Card>
        ))}
      </div>

      {/* Payment Modal */}
      <Modal id="subscription-payment" title="Complete Payment" size="md">
        <ModalBody>
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 font-medium mb-1">Selected Plan:</p>
              <p className="text-xl font-bold text-blue-600">{selectedPlan?.name}</p>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-1">Amount:</p>
              <p className="text-2xl font-bold text-gray-900">KES {selectedPlan?.price}</p>
            </div>
            <Input
              label="Safaricom Phone Number"
              type="tel"
              placeholder="254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              helperText="Enter your M-Pesa phone number"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => closeModal('subscription-payment')}>
            Cancel
          </Button>
          <Button onClick={handlePayment} isLoading={isProcessing}>
            Pay with M-Pesa
          </Button>
        </ModalFooter>
      </Modal>

      {/* STK Confirmation Modal */}
      <Modal id="stk-confirmation" title="Payment Request Sent" size="md">
        <ModalBody>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">STK Push Sent!</h3>
            <p className="text-gray-600">
              Check your phone for the M-Pesa payment prompt and enter your PIN to complete the transaction.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button fullWidth onClick={() => closeModal('stk-confirmation')}>
            Done
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
