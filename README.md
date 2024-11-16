# Wango

## Overview

The Wango Parking API allows users to manage their parking sessions, including starting and stopping parking, as well as retrieving session details. This API supports multiple cities and parking areas, providing pricing based on specified time frames.

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Jest (for testing)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/EllaMartirosyan/wango.git
   cd wango


## Database Choice:  
MongoDB is chosen for this project due to its flexibility with schema design, ease of scaling, and suitability for storing JSON-like documents. Since the application will likely require different parking pricing structures for various cities, MongoDB's document-based structure allows for easy modifications and additions to the parking area data without needing to alter a predefined schema.
