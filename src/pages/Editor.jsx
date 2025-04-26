import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DriveService } from "../services/DriveService";
import TextEditorModal from "../components/TextEditor";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import FileCard from "../components/FileCard";

const Editor = () => {
  const accessToken = JSON.parse(localStorage.getItem("user"))?.token?.access_token;
  const user = JSON.parse(localStorage.getItem("user"))?.profile?.given_name;
  const image = JSON.parse(localStorage.getItem("user"))?.profile?.picture;
  const navigate = useNavigate();
  const [modalOpen, setIsModalOpen] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [creatingType, setCreatingType] = useState("");
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [currentFileList, setCurrentFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Open name dialog
  const handleOpenCreateDialog = (type) => {
    setCreatingType(type); 
    setNewItemName("");
    setNameDialogOpen(true);
  };


  const handleFileClick = async(file)=>{
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
    setIsLoading(true);
    setSelectedFile(file);
    if(selectedFile.mimeType === "application/vnd.google-apps.document") {
      const docContent = await DriveService.getGoogleDocContent(accessToken, selectedFile.id);
      const html=[]
      docContent.body.content.forEach((block) => {
        if (block.paragraph && block.paragraph.elements) {
          const line = block.paragraph.elements
            .map((el) => {
              if (el.textRun && el.textRun.content) {
                const text = el.textRun.content.replace(/\n$/, ""); // remove trailing \n
                // Handle bold or italic styles if needed
                if (el.textRun.textStyle?.bold) {
                  return `<strong>${text}</strong>`;
                }
                if (el.textRun.textStyle?.italic) {
                  return `<em>${text}</em>`;
                }
                return text;
              }
              return "";
            })
            .join("");
          if (line.trim()) {
            html.push(`<p>${line}</p>`);
          }
        }
      });
  
      setFileContent(html.join(""));
    }
    setIsLoading(false);
    setIsModalOpen(true);
  }
  // Create file or folder
  const handleCreateConfirmed = async () => {
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
    if (!newItemName.trim()) return;
    setIsLoading(true);
    if (creatingType === "file") {
      const newFile = await DriveService.createGoogleDoc(accessToken, newItemName);
      setCurrentFileList((prevList) => [...prevList, newFile]);
      setSelectedFile(newFile);
      setFileContent("");
      setIsLoading(false);
      setIsModalOpen(true);
    }
    setNameDialogOpen(false);
  };

  // Upload folder
  const handleUploadFolder = async (event) => {
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
    const folderFiles = event.target.files;
    if (!folderFiles.length) {
      alert("The selected Foldder has no files.");
    };

    for (let file of folderFiles) {
      setIsLoading(true);
      const fileData = await DriveService.uploadFile(accessToken, file, null);
      setCurrentFileList((prevList) => [...prevList, fileData]);
    }
    setIsLoading(false);
    alert("Folder uploaded successfully");
  };

  // Save file from modal
  const handleEditorSave = async (content) => {
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
    setIsLoading(true);
    if (selectedFile) {
      if(selectedFile.mimeType === "application/vnd.google-apps.document") {
        const docContent = await DriveService.getGoogleDocContent(accessToken, selectedFile.id);
        let endIndex = 0;
        docContent.body.content.forEach((element) => {
          if (element.endIndex && element.endIndex > endIndex) {
            endIndex = element.endIndex;
          }
        });
        if(endIndex >2){
          const clearRequests = [
            {
              deleteContentRange: {
                range: {
                  startIndex: 1,
                  endIndex: endIndex - 1,
                },
              },
            },
          ];
          
          const res = await axios.post(
            `https://docs.googleapis.com/v1/documents/${selectedFile.id}:batchUpdate`,
            { requests: clearRequests },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
       
      }
     const response=await DriveService.updateGoogleDocContent(
               accessToken,
               selectedFile.id,
               content
             );
     if(response.status===200){
      alert("File saved successfully");
     }
    }
    setIsLoading(false);
    setIsModalOpen(false);
  };

  const handleSearch = async (query) => {
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
      const FilteredData = await DriveService.listFiles(accessToken,query);
      setCurrentFileList({ files: FilteredData.files });
    };

    const handleLogout = () => {
      localStorage.removeItem("user");
      setSelectedFile(null);
      setFileContent("");
    };

  return (
    <Box>
        <Header
        user={user}
        image={image}
        handleSearch={handleSearch}
        handleLogout={handleLogout}
      />
      <Box sx={{ display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      position:"relative"}}>
    <Box sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "20px", mt: 1, mb: 1 , }}>
    <Button variant="contained" onClick={() => handleOpenCreateDialog("file")}>
      Create File
    </Button>
  </Box>
    
    <Box sx={{ mt: 1, mb: 1 }}>
      {isLoading ?<Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)', // Optional overlay
                  zIndex: 9999,
                }}
              >
                <CircularProgress />
              </Box>:
      <Box
        sx={{
          border: "2px dashed #aaa",
          padding: "20px", // Fixed the typo here
          textAlign: "center",
          borderRadius: 12,
          cursor: "pointer", // Fixed typo from "caursor"
          backgroundColor: "#f9f9f9",
          transition: "background 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
          maxWidth: "80%",
          maxHeight: 400,
          minHeight: 200,
          margin: "0 auto",
        }}
      >
        <input
          type="file"
          webkitdirectory="true"
          directory=""
          multiple
          hidden
          id="folderUpload"
          onChange={handleUploadFolder}
        />
        <label
          htmlFor="folderUpload"
          style={{ cursor: "pointer", display: "block" }}
        >
          <CloudUploadIcon style={{ fontSize: 60, color: "#888" }} />
          <Typography variant="h6">
            Drag a folder here or click to upload
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Uploads entire folders into your Drive
          </Typography>
        </label>
      </Box>
}
    </Box>
    
    {currentFileList && currentFileList.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
              padding: "0 2rem",
              marginTop: "2rem",
            }}
          >
            {currentFileList.map((file, index) => (
              <div key={index} onClick={() => handleFileClick(file)}>
                <FileCard file={file} />
              </div>
            ))}
          </div>
    ):(<p>No files Created</p>)}
    
    {/* Text Editor Modal */}
    <TextEditorModal
      open={modalOpen}
      onClose={() => setIsModalOpen(false)}
      fileContent={fileContent}
      onSave={handleEditorSave}
      handleDownload={() => {}}
      handleDelete={() => {}}
    />
    
    {/* Name Input Dialog */}
    <Dialog open={nameDialogOpen} onClose={() => setNameDialogOpen(false)}>
      <DialogTitle>
        {creatingType === "file" ? "Create New File" : "Create New Folder"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={creatingType === "file" ? "File Name" : "Folder Name"}
          type="text"
          fullWidth
          variant="standard"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setNameDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleCreateConfirmed}>Create</Button>
      </DialogActions>
    </Dialog>
   
    <Footer />
    </Box>
  </Box>
  );
};

export default Editor;
