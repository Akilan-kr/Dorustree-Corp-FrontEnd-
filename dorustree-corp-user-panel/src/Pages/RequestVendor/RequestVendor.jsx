import React, { useContext, useEffect, useState } from 'react';
import { getUser, requestVendor } from '../../Services/VendorService';
import { StoreContext } from '../../Context/StoreContext';

function RequestVendor() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Status_None'); // Default
  const { user } = useContext(StoreContext);

  // Fetch user status on component mount
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await getUser(user.token);
        if (response && response.userStatusForVendor) {
          setStatus(response.userStatusForVendor); // Status_Pending, Status_Approved, etc.
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };

    fetchUserStatus();
  }, [user.token]);

  const handleRequest = async () => {
    if (!acceptedTerms) {
      setMessage('You must accept the terms and conditions.');
      return;
    }

    try {
      const response = await requestVendor(user.token); // response is an object
      // Extract the message from the object
      setMessage(response.message || 'Request submitted'); 
      setStatus('Status_Pending'); // Update status
    } catch (error) {
      console.error(error);
      setMessage(error?.message || 'Something went wrong');
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
        return { text: 'Request Rejected', disabled: true };
      default:
        return { text: 'Request Vendor', disabled: false };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Request to Become a Vendor</h3>

      {/* Show status immediately */}
      {status !== 'Status_None' && (
        <p style={{ color: 'blue', fontWeight: 'bold' }}>
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

      {/* Show checkbox only if status is NONE */}
      {status === 'Status_None' && (
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
        style={{ padding: '10px 20px', cursor: buttonProps.disabled ? 'not-allowed' : 'pointer' }}
      >
        {buttonProps.text}
      </button>

      {message && <p style={{ marginTop: '15px', color: 'green' }}>{message}</p>}
    </div>
  );
}

export default RequestVendor;
