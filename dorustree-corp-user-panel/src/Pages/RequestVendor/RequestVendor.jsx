import React, { useContext, useEffect, useState } from 'react';
import { getUser, requestVendor } from '../../Services/VendorService';
import { StoreContext } from '../../Context/StoreContext';
import {toast} from "react-toastify";

function RequestVendor() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Status_None'); // Default
  const { user } = useContext(StoreContext);

  // Fetch user status on component mount or when user changes
  useEffect(() => {
    if (!user?.token) return;

    const fetchUserStatus = async () => {
      try {
        const response = await getUser(user.token);
        // console.log('User status response:', response.data);

        if (response.data?.userStatusForVendor) {
          // console.log(response.data.userStatusForVendor)
          setStatus(response.data.userStatusForVendor); // Status_Pending, Status_Approved, etc.
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
        toast.error("Error fetching user Status");
      }
    };

    fetchUserStatus();
  }, [user]);

  // Handle request vendor button click
  const handleRequest = async () => {
    if (!acceptedTerms) {
      setMessage('You must accept the terms and conditions.');
      toast.warn("You must accept the terms and conditions");
      return;
    }

    try {
      const response = await requestVendor(user.token); // Backend returns object with message
      setMessage(response.message || 'Request submitted successfully');
      toast.success("Request sent....");
      setStatus('Status_Pending'); // Immediately update status
    } catch (error) {
      console.error(error);
      setMessage(error?.message || 'Something went wrong');
      toast.error("Error while sending request");
    }
  };

  // Decide button text and disabled state
  const getButtonProps = () => {
    switch (status) {
      case 'Status_None':
        return { text: 'Request Vendor', disabled: false };

      case 'Status_Pending':
        return { text: 'Request Pending', disabled: true };

      case 'Status_Approved':
        return { text: 'You are a Vendor', disabled: true };

      case 'Status_Rejected':
        return { text: 'Request Again', disabled: false };

      default:
        return { text: 'Request Vendor', disabled: false };
    }
  };

  const buttonProps = getButtonProps();

  // Status text color
  const getStatusColor = () => {
    switch (status) {
      case 'Status_Pending':
        return 'orange';
      case 'Status_Approved':
        return 'green';
      case 'Status_Rejected':
        return 'red';
      default:
        return 'black';
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        background: '#fafafa'
      }}
    >
      <h3>Request to Become a Vendor</h3>

      {/* Show current status */}
      {status !== 'Status_None' && (
        <p style={{ fontWeight: 'bold', color: getStatusColor() }}>
          Current Status: {status.replace('Status_', '')}
        </p>
      )}

      <div style={{ marginBottom: '15px', fontSize: '14px', color: '#555' }}>
        By requesting vendor status, you agree to the following terms:
        <ul>
          <li>You will follow our marketplace rules.</li>
          <li>You are responsible for your listed products.</li>
          <li>We may review and approve your request manually.</li>
        </ul>
      </div>

      {/* Show checkbox only if status allows new request */}
      {(status === 'Status_None' || status === 'Status_Rejected') && (
        <label style={{ display: 'block', marginBottom: '15px' }}>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
          />{' '}
          I accept the terms and conditions
        </label>
      )}

      <button
        onClick={handleRequest}
        disabled={buttonProps.disabled}
        style={{
          padding: '10px 20px',
          cursor: buttonProps.disabled ? 'not-allowed' : 'pointer',
          background: buttonProps.disabled ? '#ccc' : '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '6px'
        }}
      >
        {buttonProps.text}
      </button>

      {message && (
        <p style={{ marginTop: '15px', color: status === 'Status_Rejected' ? 'red' : 'green' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default RequestVendor;
