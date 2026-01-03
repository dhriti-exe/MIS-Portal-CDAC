import React from 'react';
import { Application } from '../../api/center';

interface ApplicationDetailModalProps {
  application: Application | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({ application, open, onClose, onApprove, onReject }) => {
  if (!open || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-bold mb-4">Application Details</h2>
        <div className="mb-4">
          <div><strong>Name:</strong> {application.applicant_name}</div>
          <div><strong>Email:</strong> {application.applicant_email}</div>
          <div><strong>Session:</strong> {application.session_name}</div>
          <div><strong>Status:</strong> {application.application_status}</div>
          <div><strong>Payment:</strong> {application.payment_status}</div>
          <div><strong>Certificate:</strong> {application.certificate_status}</div>
        </div>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={() => onApprove(application.application_id)}>Approve</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={() => onReject(application.application_id)}>Reject</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
