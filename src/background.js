'use strict';
// import { pdfjs } from 'react-pdf';
// import { Document, Page } from 'react-pdf';
// import { pdfjsLib } from 'pdfjs-dist';
const pdfjsLib = require('pdfjs-dist');

pdfjsLib.GlobalWorkerOptions.workerSrc = "../../build/webpack/pdf.worker.bundle.js";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ifwvltxywtyffvxvvxjl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmd3ZsdHh5d3R5ZmZ2eHZ2eGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAwNDA1OTUsImV4cCI6MTk5NTYxNjU5NX0.SCNw9sfPpdCDzsPrN77LeXUkmX-CruNL-ccjyuII6bU";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// function checkAuth() {
//   const user = supabase.auth.user();
//   if (user) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function login(e, p, callback) {
//   console.log(e, p);
//   supabase.auth.signIn({
//     email: e,
//     password: p,
//   }).then(({ data, error }) => {
//     if (error) {
//       console.log(error);
//       callback({ error });
//     } else {
//       console.log(data);
//       callback({ data });
//     }
//   });
// }

async function readPDFText(path, callback) {
  // path is a local file path, not a URL
  const data = await fetch(path).then(res => res.arrayBuffer());

  const pdf = await pdfjsLib.getDocument({data: data}).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    text += pageText + '\n';
  }
  console.log(text);
  callback({ text });
}

// function readPDFText(path, callback) {
//   console.log("reading pdf text");
//   let pdf;
//   let text = '';

//   pdfjs.getDocument(path).promise.then((doc) => {
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

//   callback({ text });
// }


function getFieldJson(personalInfo, fieldName, callback) {
  // console.log("received request")
  fetch("https://ifwvltxywtyffvxvvxjl.functions.supabase.co/get-field-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ personalInfo, fieldName }),
    })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      callback({ data });
    })
    .catch((error) => {
      console.error("Error fetching GPT response:", error);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getGpt3Answer") {
    getGpt3Answer(request.prompt, sendResponse);
    return true; // Required for async response
  }
  if (request.action === "getFieldJson") {
    getFieldJson(request.personalInfo, request.fieldName, sendResponse);
    return true; // Required for async response
  }
  if (request.action === "loginUser") {
    login(request.e, request.p, sendResponse);
    return true; // Required for async response
  }
  if (request.action === "readPDFText") {
    readPDFText(request.path, sendResponse);
    return true; // Required for async response
  }
});