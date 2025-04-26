import DescriptionIcon from '@mui/icons-material/Description';
import GridOnIcon from '@mui/icons-material/GridOn';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export const getFileTypeInfo = (mimeType) => {
  switch (mimeType) {
    case 'application/vnd.google-apps.document':
      return { type: 'Google Doc', color: '#4285F4', icon: <DescriptionIcon fontSize="large" /> };
    case 'application/vnd.google-apps.spreadsheet':
      return { type: 'Google Sheet', color: '#34A853', icon: <GridOnIcon fontSize="large" /> };
    case 'application/vnd.google-apps.presentation':
      return { type: 'Google Slides', color: '#FBBC05', icon: <SlideshowIcon fontSize="large" /> };
    default:
      return { type: 'File', color: '#9E9E9E', icon: <InsertDriveFileIcon fontSize="large" /> };
  }
};


