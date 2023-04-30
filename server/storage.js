const { google } = require("googleapis");
const { auth } = require("google-auth-library");

// Load the credentials from the JSON key file
const keyFile = "./service-account-key";

// Define the scopes for the Google Cloud Storage API
const scopes = ["https://www.googleapis.com/auth/devstorage.read_write"];

// Export a function that creates an authenticated client for the Google Cloud Storage API
module.exports = async function createStorageClient() {
  // Create an OAuth2 client with the credentials from the JSON key file
  const client = await auth.fromJSON(require(keyFile));

  // Add the scopes for the Google Cloud Storage API
  client.scopes = scopes;

  // Create a Google Cloud Storage API client with the authenticated client
  const storage = google.storage({
    version: "v1",
    auth: client,
  });

  return storage;
};
