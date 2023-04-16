'use strict';
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

function getFieldJson(personalInfo, fieldName, callback) {
  console.log(personalInfo, fieldName)
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
});

chrome.webRequest.onCompleted.addListener(
  (details) => {
    chrome.tabs.executeScript(details.tabId, {
      file: 'contentScript.js',
      frameId: details.frameId,
      runAt: 'document_idle',
    });
  },
  {
    urls: ['<all_urls>'],
    types: ['sub_frame'],
  }
);