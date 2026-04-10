import { useState } from 'react';

const STYLE = `
  .sl-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    transition: all 0.3s ease;
    overflow: hidden;
    z-index: 5000;
    pointer-events: auto;
    cursor: pointer;
  }
  
  .sl-container:hover {
    height: 80px;
    padding-bottom: 24px;
  }

  .sl-btn-wrapper {
    width: 100%;
    max-width: 384px;
    position: absolute;
    bottom: -100%;
    padding: 0 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
  }

  .sl-container:hover .sl-btn-wrapper {
    bottom: 24px;
    opacity: 1;
  }

  .sl-btn {
    background-color: rgba(239, 68, 68, 0.9);
    width: 100%;
    max-width: 280px;
    color: white;
    padding: 12px 32px;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 14px;
    border: none;
    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: transform 0.2s, background-color 0.2s;
    cursor: pointer;
    backdrop-filter: blur(12px);
  }

  .sl-btn:hover {
    background-color: rgb(239, 68, 68);
    transform: translateY(-4px);
  }

  .sl-indicator {
    position: absolute;
    bottom: 0;
    width: 128px;
    height: 6px;
    background-color: rgba(255, 255, 255, 0.2);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    transition: opacity 0.3s ease;
  }

  .sl-container:hover .sl-indicator {
    opacity: 0;
  }

  .sl-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    pointer-events: auto;
    animation: slFadeIn 0.2s ease-out;
  }

  .sl-modal-card {
    background-color: rgba(30, 41, 59, 0.9);
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 16px;
    padding: 32px;
    max-width: 28rem;
    width: 100%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: slZoomIn 0.2s ease-out;
    box-sizing: border-box;
  }

  .sl-modal-icon-container {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }

  .sl-modal-icon-bg {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(239, 68, 68, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(239, 68, 68);
  }

  .sl-modal-title {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    color: white;
    margin-bottom: 8px;
    margin-top: 0;
  }

  .sl-modal-desc {
    color: #94a3b8;
    text-align: center;
    margin-bottom: 32px;
    font-size: 14px;
    line-height: 1.6;
  }

  .sl-modal-actions {
    display: flex;
    gap: 12px;
  }

  .sl-modal-btn-cancel {
    flex: 1;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.2);
    background: transparent;
    color: white;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.2s;
    cursor: pointer;
  }

  .sl-modal-btn-cancel:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .sl-modal-btn-danger {
    flex: 1;
    padding: 12px 16px;
    border-radius: 12px;
    border: none;
    background-color: rgb(239, 68, 68);
    color: white;
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.2);
    transition: background-color 0.2s;
    cursor: pointer;
  }

  .sl-modal-btn-danger:hover {
    background-color: rgb(248, 113, 113);
  }

  @keyframes slFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slZoomIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

type Props = {
  onLogout: () => void;
};

export default function SecureLogoutControl({ onLogout }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <style>{STYLE}</style>
      
      {/* Hidden Logout Slider */}
      <div className="sl-container">
        <div className="sl-btn-wrapper">
            <button onClick={() => setShowModal(true)} className="sl-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>SECURE DISCONNECT</span>
            </button>
        </div>
        <div className="sl-indicator" />
      </div>

      {/* Logout Confirmation Modal - with very high z-index to stay above the map */}
      {showModal && (
        <div className="sl-modal-overlay">
          <div className="sl-modal-card">
            <div className="sl-modal-icon-container">
              <div className="sl-modal-icon-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                  <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
              </div>
            </div>
            <h3 className="sl-modal-title">Confirm Disconnect</h3>
            <p className="sl-modal-desc">
              Are you sure you want to sever the connection? You will stop receiving live telemetry from the UAV.
            </p>
            <div className="sl-modal-actions">
              <button 
                onClick={() => setShowModal(false)}
                className="sl-modal-btn-cancel"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowModal(false);
                  onLogout();
                }}
                className="sl-modal-btn-danger"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
