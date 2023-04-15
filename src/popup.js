'use strict';

import * as pdfjsLib from 'pdfjs-dist/webpack';

// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://mozilla.github.io/pdf.js/build/pdf.worker.js`;

// async function readPDFText(path) {
//   const pdf = await pdfjsLib.getDocument(path).promise;
//   let text = '';

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();
//     const pageText = content.items.map(item => item.str).join(' ');
//     text += pageText + '\n';
//   }

//   return text;
// }

// function readPDFText(path) {
//   let pdf;
//   let text = '';

//   pdfjsLib.getDocument(path).promise.then((doc) => {
//     pdf = doc;
//     return pdf.getPage(1);
//   }).then((page) => {
//     return page.getTextContent();
//   }).then((content) => {
//     text = content.items.map(item => item.str).join(' ');
//   }).catch(error => {
//     console.error(error);
//   });

//   while (!pdf || pdf.numPages === undefined) {
//     // block until the pdf object is fully initialized
//   }

//   for (let i = 1; i <= pdf.numPages; i++) {
//     pdf.getPage(i).then((page) => {
//       return page.getTextContent();
//     }).then((content) => {
//       text += content.items.map(item => item.str).join(' ') + '\n';
//     }).catch(error => {
//       console.error(error);
//     });
//     while (pdf.numPages < i) {
//       // block until the page is fully loaded
//     }
//   }

//   return text;
// }

document.getElementById("fillFormButton").addEventListener("click", () => {
  // Send a message to the content script to trigger the fillForm function
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "fillForm" });
  });

  // Close the popup after clicking the button
  window.close();
});

const fileInput = document.getElementById('file-input');
const readButton = document.getElementById('read-button');
const outputDiv = document.getElementById('output');

fileInput.addEventListener('change', function() {
  const selectedFile = fileInput.files[0];
  if (selectedFile && selectedFile.type === 'application/pdf') {
    readButton.disabled = false;
  } else {
    readButton.disabled = true;
  }
});

readButton.addEventListener('click', function() {
  const selectedFile = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const typedArray = new Uint8Array(this.result);
    pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
      let textContent = '';
      pdf.getPage(1).then(function(page) {
        page.getTextContent().then(function(content) {
          content.items.forEach(function(item) {
            textContent += item.str + ' ';
          });
          outputDiv.textContent = textContent;
        });
      });
    });
  };

  reader.readAsArrayBuffer(selectedFile);
});
