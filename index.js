const axios = require('axios');
const now = require('performance-now'); // For measuring time

// Function to track redirects
async function trackRedirects(url) {
  const startTime = now(); // Start measuring time
  let redirectCount = 0;
  let currentUrl = url;
  let statusCode = 0;

  try {
    // Keep following redirects
    while (true) {
      const response = await axios.get(currentUrl, { 
        maxRedirects: 0, // Prevent axios from automatically following redirects
        validateStatus: () => true, // Don't throw on non-2xx responses
      });
      statusCode = response.status;
      
      // If it's a redirect, follow it
      if (statusCode >= 300 && statusCode < 400 && response.headers.location) {
        redirectCount++;
        currentUrl = response.headers.location; // Follow the redirect URL
      } else {
        break; // No more redirects, exit the loop
      }
    }

    const endTime = now(); // End measuring time
    const totalTime = (endTime - startTime) / 1000; // Calculate total time in seconds

    console.log(`Redirect Count: ${redirectCount}`);
    console.log(`Final URL: ${currentUrl}`);
    console.log(`Final Status Code: ${statusCode}`);
    console.log(`Total Time: ${totalTime.toFixed(3)}s`); // Print the redirect time in seconds

  } catch (error) {
    console.error('Error tracking redirects:', error.message);
  }
}

// Expose the function to be used as part of the npm package
module.exports = { trackRedirects };
