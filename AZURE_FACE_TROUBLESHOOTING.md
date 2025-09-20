# Azure Face API Troubleshooting Guide

## 🚨 Current Issue: "Invalid request has been sent"

The error you're seeing indicates that the Azure Face API is rejecting the request. Here are the most common causes and solutions:

## 🔍 Debugging Steps

### 1. Check Azure Face API Configuration

Verify your backend environment variables:

```env
AZURE_FACE_ENDPOINT=https://your-region.cognitiveservices.azure.com/
AZURE_FACE_KEY=your-azure-face-api-key
```

**Common issues:**

- Missing or incorrect endpoint URL
- Invalid or expired API key
- Wrong region in endpoint URL

### 2. Image Requirements Check

Azure Face API has strict requirements:

**Supported formats:** JPEG, PNG, GIF, BMP
**Size limits:**

- Minimum: 36x36 pixels
- Maximum: 6MB
- Recommended: 200x200 to 6000x6000 pixels

**Quality requirements:**

- Clear, well-lit face
- Face should be 10% of image area minimum
- No extreme angles or occlusions

### 3. URL Accessibility

The most common cause is that Azure can't access the Cloudinary URL. Check:

1. **URL is publicly accessible** - Test the Cloudinary URL in a browser
2. **No authentication required** - Cloudinary URL should be public
3. **HTTPS protocol** - Azure requires HTTPS URLs
4. **No redirects** - URL should return image directly

### 4. Backend Debugging

Add these logs to your backend Azure Face Service:

```javascript
// In your AzureFaceService.detectFacesFromUrl method
console.log("Azure Face API Request:", {
  url: imageUrl,
  endpoint: this.endpoint,
  hasApiKey: !!this.apiKey,
});

// Test URL accessibility
try {
  const response = await fetch(imageUrl, { method: "HEAD" });
  console.log("URL accessibility check:", {
    status: response.status,
    contentType: response.headers.get("content-type"),
    contentLength: response.headers.get("content-length"),
  });
} catch (error) {
  console.error("URL not accessible:", error);
}
```

## 🛠️ Quick Fixes to Try

### Fix 1: Test with a Simple Image URL

Try enrolling with a publicly accessible test image:

```javascript
// Use this URL for testing: https://via.placeholder.com/400x400/000000/FFFFFF?text=Face
```

### Fix 2: Check Cloudinary URL Format

Ensure your Cloudinary URLs are in the correct format:

```
✅ Good: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.jpg
❌ Bad: https://cloudinary.com/your-cloud/image/upload/sample.jpg (missing version)
```

### Fix 3: Verify Azure Face API Key

Test your Azure Face API key directly:

```bash
curl -H "Ocp-Apim-Subscription-Key: YOUR_KEY" \
     "https://your-region.cognitiveservices.azure.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender"
```

### Fix 4: Check Image Content

The image might not contain a detectable face. Try:

- A clear, front-facing photo
- Good lighting
- Single person in the image
- Face takes up 10-50% of the image

## 🔧 Backend Code Fixes

### Option 1: Add URL Validation

```javascript
// In your AzureFaceService
async detectFacesFromUrl(imageUrl) {
  // Validate URL format
  if (!imageUrl.startsWith('https://')) {
    throw new Error('Image URL must use HTTPS');
  }

  // Test URL accessibility
  try {
    const headResponse = await fetch(imageUrl, { method: 'HEAD' });
    if (!headResponse.ok) {
      throw new Error(`Image URL not accessible: ${headResponse.status}`);
    }

    const contentType = headResponse.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error('URL does not point to an image');
    }
  } catch (error) {
    throw new Error(`Image URL validation failed: ${error.message}`);
  }

  // Continue with Azure Face API call...
}
```

### Option 2: Add Retry Logic

```javascript
async detectFacesFromUrl(imageUrl, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await this.makeAzureRequest(imageUrl);
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1} failed, trying again...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

## 🧪 Testing Steps

1. **Test with a known good image:**

   - Use a publicly accessible test image
   - Try: `https://via.placeholder.com/400x400/000000/FFFFFF?text=Face`

2. **Check browser console:**

   - Look for the new debug logs I added
   - Check network tab for failed requests

3. **Test Azure API directly:**

   - Use Postman or curl to test your Azure endpoint
   - Verify API key and endpoint are correct

4. **Check Cloudinary settings:**
   - Ensure images are publicly accessible
   - Check if there are any access restrictions

## 📞 Next Steps

1. **Check the browser console** for the new debug logs
2. **Verify your Azure Face API configuration** on the backend
3. **Test with a simple, publicly accessible image**
4. **Check if the Cloudinary URL is accessible** from external services

The enhanced error handling I added will provide more specific error messages to help identify the exact issue. Try enrolling your face again and check the browser console for detailed logs.

## 🆘 If Still Not Working

If the issue persists, please share:

1. The exact error message from the browser console
2. Your Azure Face API endpoint and key format (without the actual key)
3. A sample Cloudinary URL that's being used
4. The backend logs from the Azure Face Service

This will help identify the specific cause of the "Invalid request" error.


