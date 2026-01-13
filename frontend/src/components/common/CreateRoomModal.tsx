import React, { useState, useEffect } from 'react';
import './CreateRoomModal.css';
import { RoomType, SUPPORTED_LANGUAGES } from '../../types';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (data: { 
    title: string; 
    type: RoomType; 
    isPrivate: boolean; 
    language?: string 
  }) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreateRoom 
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES[0].code);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedType(null);
      setTitle('');
      setIsPrivate(false);
      setLanguage(SUPPORTED_LANGUAGES[0].code);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTypeSelect = (type: RoomType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedType(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedType) return;

    onCreateRoom({
      title: title.trim(),
      type: selectedType,
      isPrivate,
      language: selectedType === 'TRANSLATION' ? language : undefined
    });
    
    onClose();
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container">
        {step === 2 && (
          <button className="back-btn" onClick={handleBack} aria-label="Go back">
            ←
          </button>
        )}

        <div className="modal-header">
          <h2 className="modal-title">
            {step === 1 ? 'Create Room' : 'Room Details'}
          </h2>
          <p className="modal-subtitle">
            {step === 1 
              ? 'Choose your experience' 
              : `Setup your ${selectedType === 'KARAOKE' ? 'Karaoke' : 'Translation'} session`
            }
          </p>
        </div>

        {step === 1 ? (
          <div className="type-selection">
            <div 
              className={`type-card ${selectedType === 'KARAOKE' ? 'selected' : ''}`}
              onClick={() => handleTypeSelect('KARAOKE')}
            >
              <div className="type-icon">🎤</div>
              <div className="type-name">Karaoke Room</div>
              <div className="type-desc">
                Sing together with synchronized video playback for up to 8 people.
              </div>
            </div>

            <div 
              className={`type-card ${selectedType === 'TRANSLATION' ? 'selected' : ''}`}
              onClick={() => handleTypeSelect('TRANSLATION')}
            >
              <div className="type-icon">🌐</div>
              <div className="type-name">Translation Room</div>
              <div className="type-desc">
                Real-time chat translation breaking language barriers seamlessly.
              </div>
            </div>
          </div>
        ) : (
          <form className="room-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Room Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            {selectedType === 'TRANSLATION' && (
              <div className="form-group">
                <label className="form-label">Primary Language</label>
                <select 
                  className="form-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="toggle-group">
              <div className="toggle-label-group">
                <label className="form-label">Private Room</label>
                <span className="toggle-desc">Only people with the link can join</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={!title.trim()}
              >
                Create Room
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateRoomModal;
