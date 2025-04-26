# DriveDoc - Google Drive Document Manager

A modern web application for browsing, editing, and managing your Google Drive documents

## Features

- **Google Drive Integration**: Browse, search, and manage your Google Drive documents
- **Document Editing**: View and edit Google Docs directly within the application
- **File Operations**: Download, delete, and create files
- **Folder Upload**: Upload entire folders maintaining their structure
- **Search Functionality**: Easily find documents across your Drive
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend Framework**: React 19
- **UI Components**: Material UI v7
- **Authentication**: Google OAuth (@react-oauth/google)
- **Text Editor**: TinyMCE (@tinymce/tinymce-react)
- **API Communication**: Axios
- **Routing**: React Router v6

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/drivedoc.git
cd drivedoc
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

4. Start the development server:
```bash
npm start
```

## Google API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Drive API
4. Configure the OAuth consent screen
5. Create OAuth 2.0 credentials
6. Add authorized JavaScript origins and redirect URIs

## Usage

1. Log in with your Google account
2. Browse your Google Drive documents
3. Click on a document to open it in the editor
4. Use the search bar to find specific files
5. Create new documents or upload folders as needed

## Deployment

This app can be deployed to any static hosting service:

```bash
npm run build
```

Then deploy the contents of the `build` directory to your hosting service of choice (Vercel, Netlify, GitHub Pages, etc.).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Drive API
- Material UI team
- TinyMCE for the rich text editor
