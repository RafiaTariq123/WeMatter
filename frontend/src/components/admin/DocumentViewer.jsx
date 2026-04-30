import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Grid,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as FileIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

const DocumentViewer = ({ open, onClose, psychologist }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const getDocumentIcon = (url) => {
    if (url.includes('.pdf')) {
      return <PdfIcon sx={{ fontSize: 40, color: '#f44336' }} />;
    } else if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <ImageIcon sx={{ fontSize: 40, color: '#4caf50' }} />;
    } else {
      return <FileIcon sx={{ fontSize: 40, color: '#2196f3' }} />;
    }
  };

  const getDocumentName = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'Document';
  };

  const handleViewDocument = (url) => {
    window.open(url, '_blank');
  };

  const handleDownloadDocument = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = getDocumentName(url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAllDocuments = (psychologist) => {
    const documents = [];
    
    // Add documents from the documents array if it exists
    if (psychologist?.documents && psychologist.documents.length > 0) {
      psychologist.documents.forEach((doc, index) => {
        documents.push({
          ...doc,
          source: 'array'
        });
      });
    }
    
    // Add individual document fields if they exist
    if (psychologist?.cnic_url) {
      documents.push({
        type: 'CNIC',
        url: psychologist.cnic_url,
        uploadDate: psychologist.createdAt || new Date(),
        source: 'cnic_url'
      });
    }
    
    if (psychologist?.certification_url) {
      documents.push({
        type: 'Certification/Degree',
        url: psychologist.certification_url,
        uploadDate: psychologist.createdAt || new Date(),
        source: 'certification_url'
      });
    }
    
    return documents;
  };

  const documents = getAllDocuments(psychologist);

  const getPsychologistName = (psychologist) => {
    if (psychologist?.name) return psychologist.name;
    if (psychologist?.firstName && psychologist?.lastName) {
      return `${psychologist.firstName} ${psychologist.lastName}`;
    }
    return 'Psychologist';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Documents - {getPsychologistName(psychologist)}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Verification Status:{' '}
            <Chip
              label={psychologist?.verificationStatus || 'pending'}
              color={
                psychologist?.verificationStatus === 'approved' ? 'success' :
                psychologist?.verificationStatus === 'rejected' ? 'error' : 'warning'
              }
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
          
          {psychologist?.adminRemarks && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Admin Remarks: {psychologist.adminRemarks}
            </Typography>
          )}
        </Box>

        {documents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Avatar sx={{ bgcolor: '#f5f5f5', mx: 'auto', mb: 2 }}>
              <FileIcon sx={{ fontSize: 40, color: '#999' }} />
            </Avatar>
            <Typography variant="body1" color="text.secondary">
              No documents uploaded
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {documents.map((doc, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    {getDocumentIcon(doc.url)}
                    <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                      {doc.type || 'Document'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      Uploaded: {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDocument(doc.url)}
                        sx={{ color: '#1976d2' }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadDocument(doc.url)}
                        sx={{ color: '#4caf50' }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentViewer;
