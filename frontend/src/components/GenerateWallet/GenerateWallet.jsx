import React, { useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey,
  faShieldHalved,
  faCopy,
  faCheck,
  faEye,
  faEyeSlash,
  faExclamationTriangle,
  faRotateRight,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import './GenerateWallet.css';

const GenerateWallet = () => {
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleGenerateWallet = async () => {
    setLoading(true);
    setAddress('');
    setPrivateKey('');
    setMnemonic('');
    setShowPrivateKey(false);

    try {
      // Generate cryptographic keypair locally on device
      const wallet = ethers.Wallet.createRandom();
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      if (wallet.mnemonic) {
        setMnemonic(wallet.mnemonic.phrase);
      }
      toast.success('Local cryptographic node keypair generated!');
    } catch (err) {
      console.error('Error generating node keypair:', err);
      toast.error('Failed to initialize local key entropy.');
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopiedAddr(true);
    toast.info('Public Address copied to clipboard!');
    setTimeout(() => setCopiedAddr(false), 1800);
  };

  const copyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey);
    setCopiedKey(true);
    toast.warning('Private Key copied. Store safely offline!');
    setTimeout(() => setCopiedKey(false), 1800);
  };

  return (
    <div className="generate-wallet-page container animate-fade-in">
      <div className="wallet-vault-card card">
        {/* Header */}
        <div className="vault-header">
          <div className="vault-icon-circle">
            <FontAwesomeIcon icon={faKey} />
          </div>
          <div>
            <span className="section-eyebrow">Local Cryptographic Entropy</span>
            <h1 className="vault-title">Node Keypair Generator</h1>
            <p className="vault-desc">
              Generate a client-side ECDSA private/public keypair to sign pharmaceutical batch releases and station custody handovers.
            </p>
          </div>
        </div>

        {/* Security Warning Callout */}
        <div className="vault-warning-callout">
          <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
          <div className="warning-content">
            <strong>Client-Side Generation Warning</strong>
            <p>
              Private keys are synthesized entirely within your browser's local sandbox memory. Antigravity/PharmaSupply does not store or log your key. If lost, ledger access cannot be recovered.
            </p>
          </div>
        </div>

        {/* Trigger Button */}
        <button
          onClick={handleGenerateWallet}
          disabled={loading}
          className="btn btn-primary btn-lg vault-generate-btn"
        >
          <FontAwesomeIcon icon={loading ? faRotateRight : faLock} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Deriving Cryptographic Entropy...' : 'Generate New Node Keypair'}</span>
        </button>

        {/* Generated Keys Display Area */}
        {address && privateKey && (
          <div className="vault-keys-display animate-scale-in">
            <h3 className="keys-section-title">
              <FontAwesomeIcon icon={faShieldHalved} className="text-emerald" />
              Generated Node Credentials
            </h3>

            {/* Public Address */}
            <div className="key-field-box">
              <div className="key-field-header">
                <span className="key-label">Public Ethereum Station Address (Safe to Share)</span>
                <button onClick={copyAddress} className="btn btn-outline btn-xs copy-key-btn">
                  <FontAwesomeIcon icon={copiedAddr ? faCheck : faCopy} />
                  <span>{copiedAddr ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="key-value-panel mono-text">
                {address}
              </div>
            </div>

            {/* Private Key */}
            <div className="key-field-box">
              <div className="key-field-header">
                <span className="key-label text-rose font-bold">Station Private Key (DO NOT DISCLOSE)</span>
                <div className="private-key-actions">
                  <button 
                    onClick={() => setShowPrivateKey(!showPrivateKey)} 
                    className="btn btn-outline btn-xs"
                    title={showPrivateKey ? 'Mask key' : 'Reveal key'}
                  >
                    <FontAwesomeIcon icon={showPrivateKey ? faEyeSlash : faEye} />
                    <span>{showPrivateKey ? 'Hide' : 'Reveal'}</span>
                  </button>
                  <button onClick={copyPrivateKey} className="btn btn-outline btn-xs copy-key-btn">
                    <FontAwesomeIcon icon={copiedKey ? faCheck : faCopy} />
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>
              </div>
              <div className={`key-value-panel mono-text ${showPrivateKey ? 'key-revealed' : 'key-masked'}`}>
                {showPrivateKey ? privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </div>
            </div>

            {/* Mnemonic Seed Phrase */}
            {mnemonic && (
              <div className="key-field-box">
                <div className="key-field-header">
                  <span className="key-label">12-Word Recovery Mnemonic Seed</span>
                </div>
                <div className="mnemonic-words-grid">
                  {mnemonic.split(' ').map((word, idx) => (
                    <div key={idx} className="mnemonic-chip">
                      <span className="mnemonic-num">{idx + 1}.</span>
                      <span className="mnemonic-word">{word}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateWallet;
