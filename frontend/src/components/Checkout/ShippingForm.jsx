import React from 'react';
import './ShippingForm.css';

const ShippingForm = ({ onChange, values }) => {
  return (
    <div className="shipping-form-grid">
      <div className="grid-2">
        <div className="input-group">
          <label>Facility / Recipient First Name</label>
          <input
            type="text"
            name="firstName"
            value={values.firstName}
            onChange={onChange}
            placeholder="Dr. Sarah"
            required
          />
        </div>

        <div className="input-group">
          <label>Recipient Last Name</label>
          <input
            type="text"
            name="lastName"
            value={values.lastName}
            onChange={onChange}
            placeholder="Jenkins"
            required
          />
        </div>
      </div>

      <div className="input-group">
        <label>Clinical Facility / Street Address</label>
        <input
          type="text"
          name="address1"
          value={values.address1}
          onChange={onChange}
          placeholder="e.g. 500 Medical Center Blvd, Wing B"
          required
        />
      </div>

      <div className="input-group">
        <label>Suite / Lab Number (Optional)</label>
        <input
          type="text"
          name="address2"
          value={values.address2}
          onChange={onChange}
          placeholder="e.g. Suite 402, Cold Storage Depot"
        />
      </div>

      <div className="grid-3" style={{ gap: '12px' }}>
        <div className="input-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={values.city}
            onChange={onChange}
            placeholder="Boston"
            required
          />
        </div>

        <div className="input-group">
          <label>State / Province</label>
          <input
            type="text"
            name="state"
            value={values.state}
            onChange={onChange}
            placeholder="MA"
            required
          />
        </div>

        <div className="input-group">
          <label>Postal / ZIP Code</label>
          <input
            type="text"
            name="zipCode"
            value={values.zipCode}
            onChange={onChange}
            placeholder="02115"
            required
          />
        </div>
      </div>

      <div className="input-group">
        <label>Node Contact Phone</label>
        <input
          type="tel"
          name="phoneNumber"
          value={values.phoneNumber}
          onChange={onChange}
          placeholder="+1 (555) 019-2834"
        />
      </div>
    </div>
  );
};

export default ShippingForm;
