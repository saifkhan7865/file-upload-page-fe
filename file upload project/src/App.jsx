import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = async (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const response = await fetch(
          `http://localhost:3000/s3-presigned-url?filename=${file.name}&mimetype=${file.type}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.url) {
          const result = await fetch(data.url, {
            method: "PUT",
            headers: {
              "Content-Type": encodeURI(file.type), // Important to set the correct MIME type
            },
            body: file,
          });

          if (result.status === 200) {
            setUploadStatus("Upload successful!");
          } else {
            setUploadStatus("Upload failed.");
          }
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadStatus("Error occured during upload.");
      }
    }
  };
  return (
    <>
      <input type="file" onChange={handleFileChange} />
      {file && <button onClick={handleUpload}>Upload File</button>}
      {uploadStatus && <p>{uploadStatus}</p>}
    </>
  );
}

export default App;
