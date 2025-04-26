import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,CircularProgress,
  Box
} from "@mui/material";

const TextEditorModal = ({
  open,
  onClose,
  fileContent,
  onSave,
  handleDownload,
  handleDelete
}) => {
  const editorRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const [content, setContent] = useState(fileContent || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(fileContent); // update when fileContent changes
    setEditable(false); // reset to read-only
  }, [fileContent]);

  const handleSave = () => {
    if (editorRef.current) {
      setLoading(true)
      const newContent = editorRef.current.getContent();
      const plainText = newContent.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
      setEditable(false);
      onSave(plainText);
     
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editable ? "Edit File Content" : "File Preview Mode"}</DialogTitle>
      <DialogContent dividers>
  {content === null || content === undefined ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 400, // same height as the editor
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Editor
      key={editable ? 'editable' : 'readonly'}
      apiKey="vneq14eyldehixurim4a95y72b8331xu9amft9g4cvoy0s8u"
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={content}
      init={{
        height: 400,
        menubar: true,
        readonly: !editable,
        plugins: [
          'advlist autolink lists link image charmap preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table wordcount',
        ],
        toolbar: editable
          ? 'undo redo | formatselect | fontselect | fontsizeselect | ' +
            'bold italic underline | forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image | removeformat | help'
          : false,
        content_style: `
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 14px;
            line-height: 1.6;
          }
          p {
            margin-bottom: 1em;
          }
          ul, ol {
            padding-left: 20px;
          }
          .mce-content-body {
            user-select: none;
          }
        `,
        paste_as_text: true,
        setup: (editor) => {
          if (!editable) {
            editor.on('click', (e) => e.preventDefault());
            editor.on('keydown', (e) => e.preventDefault());
            editor.on('input', (e) => e.preventDefault());
          }
        },
      }}
      onEditorChange={(newContent) => setContent(newContent)}
    />
  )}
</DialogContent>

      <DialogActions>
        {!editable ? (
          <Button onClick={() => setEditable(true)}>Edit</Button>
        ) : (
          <Button onClick={handleSave}>Save</Button>
        )}
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownload}>Download</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TextEditorModal;
