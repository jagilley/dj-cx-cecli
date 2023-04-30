/***popup.js:**
```javascript
document.getElementById("fillResume").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(tabs[0].id, { file: "contentScript.js" });
  });
});
```

**contentScript.js:**
```javascript*/
function fillResumeInput(inputElement, resumeData) {
  const dataTransfer = new DataTransfer();
  const resumeFile = new File([resumeData], "resume.pdf", { type: "application/pdf" });

  dataTransfer.items.add(resumeFile);
  inputElement.files = dataTransfer.files;
}

const resumeDataURL = "https://example.com/your-resume.pdf"; // Replace with your resume URL
const resumeInputSelector = 'input[type="file"]'; // Adjust the selector as needed

fetch(resumeDataURL)
  .then((response) => response.blob())
  .then((resumeData) => {
    const inputElements = document.querySelectorAll(resumeInputSelector);
    inputElements.forEach((inputElement) => fillResumeInput(inputElement, resumeData));
  })
  .catch((error) => console.error("Error fetching resume:", error));
