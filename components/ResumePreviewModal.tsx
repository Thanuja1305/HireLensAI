import React from 'react';
import DocumentPreviewModal from './DocumentPreviewModal';

interface ResumePreviewModalProps {
    file: File;
    onClose: () => void;
}

const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({ file, onClose }) => {
    // This component can just be a wrapper around the more generic DocumentPreviewModal
    // if the functionality is identical.
    return <DocumentPreviewModal file={file} onClose={onClose} />;
};

export default ResumePreviewModal;
