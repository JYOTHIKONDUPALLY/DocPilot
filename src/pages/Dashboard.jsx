import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { DriveService } from "../services/DriveService";
import Welcome from "../components/WelcomeCard";
import { Typography, Box,CircularProgress } from "@mui/material";
import FileCard from "../components/FileCard";
import TextEditorModal from "../components/TextEditor";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [endIndex, setEndIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const accessToken = JSON.parse(localStorage.getItem("user"))?.token?.access_token;
  const user = JSON.parse(localStorage.getItem("user"))?.profile?.given_name;
  const image = JSON.parse(localStorage.getItem("user"))?.profile?.picture;
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    setContent(null);
    setSelectedFile(null);
    setFileContent("");
  };

  const handleSearch = async (query) => {
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
    const FilteredData = await DriveService.listFiles(accessToken,query);
    setContent({ files: FilteredData.files });
  };

  useEffect(() => {
    fetchFiles(accessToken);
  }, []);
  
  const fetchFiles = async (accessToken, folderId = null) => {
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
    try {
      setIsLoading(true);
        const result = await DriveService.listFiles(accessToken);
        const documents = result.files.filter(
          (file) =>
            file.mimeType === "application/vnd.google-apps.document"
        );
        setContent({files: documents });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // the content extracted is in text format change it to html for display
  function convertGoogleDocToHtml(docData) {
    const html = [];

    docData.body.content.forEach((block) => {
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

    return html.join("");
  }

  const handleFileSelect = async (file) => {
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
    try {
      setIsLoading(true);
      setSelectedFile(file);
      if (file.mimeType === "application/vnd.google-apps.document") {
        const docContent = await DriveService.getGoogleDocContent(
          accessToken,
          file.id
        );
        let endIndex = 0;
        docContent.body.content.forEach((element) => {
          if (element.endIndex && element.endIndex > endIndex) {
            endIndex = element.endIndex;
          }
        });
        setEndIndex(endIndex);
        const htmlContent = convertGoogleDocToHtml(docContent);
        setFileContent(htmlContent);
      }
      setModalOpen(true);
      // setEditMode(false);
    } catch (error) {
      console.error("Error handling file click:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSaveClick = async (content) => {
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
    if (!selectedFile) return;
    try {
      // For Google Docs
      if (selectedFile.mimeType === "application/vnd.google-apps.document") {
        console.log("endIndex", endIndex);
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

        try {
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
          console.log("res", res.data);
        } catch (e) {
          console.log("Error clearing document (may be empty already):", e);
        }

        // Then update with new content
        await DriveService.updateGoogleDocContent(
          accessToken,
          selectedFile.id,
          content
        );
      }
    } catch (error) {
      console.error("Error saving file:", error);
    } finally {
      setModalOpen(false);
    }
  };

  const handleDownloadClick = async () => {
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
    if (!selectedFile) return;

    try {
      setIsLoading(true);

      // For Google Docs, export it
      if (selectedFile.mimeType === "application/vnd.google-apps.document") {
        const blob = await DriveService.exportGoogleDoc(
          accessToken,
          selectedFile.id
        );

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedFile.name}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      // For other files, download directly
      else {
        const blob = await DriveService.downloadFile(
          accessToken,
          selectedFile.id
        );

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = selectedFile.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if(!accessToken) {
      alert("please login to get access !");
      navigate("/");
      localStorage.removeItem("user");
      return
    }
    if (!selectedFile) return;

    if (
      !window.confirm(`Are you sure you want to delete "${selectedFile.name}"?`)
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await DriveService.deleteFile(accessToken, selectedFile.id);

      // Reset selection
      setSelectedFile(null);
      setFileContent("");
      setModalOpen(false);
      fetchFiles(accessToken);
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position:"relative"
      }}
    >
      <Header
        user={user}
        image={image}
        handleSearch={handleSearch}
        handleLogout={handleLogout}
      />
      <Box>
{isLoading ? <Box
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
        </Box>: <Box sx={{ marginTop: "2rem"}}>
        <Welcome />
      {content && (
        <div>
          {content?.files.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
                padding: "0 2rem",
                marginTop: "2rem",
              }}
            >
              {content.files.map((file, index) => (
                <div key={index} onClick={() => handleFileSelect(file)}>
                  <FileCard file={file} />
                </div>
              ))}
            </div>
          ) : (
            <p>No Files Found</p>
          )}
        </div>
      )}
      </Box>}
      </Box>
      
      <TextEditorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fileContent={fileContent}
        onSave={handleSaveClick}
        handleDownload={handleDownloadClick}
        handleDelete={handleDeleteClick}
      />
      <Footer />
    </Box>
  );
};

export default Dashboard;
