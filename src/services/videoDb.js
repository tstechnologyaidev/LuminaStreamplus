import { newToLuminaStreamPlus } from './customLibrary';

/**
 * Mock Database for Full Movie Video Links
 * (Now largely handled within customLibrary.js for New to LuminaStream+)
 */
export const localVideoDb = {
  // Mapping our movie IDs to video files
  "603692": "/videos/Top_Gun_Maverick.mp4",
  "24428": "/videos/The_Avengers.mp4",
  "99861": "/videos/Avengers_Age_Of_Ultron.mkv",
};

/**
 * Simulates fetching a video URL from your backend database
 * @param {string|number} movieId - The TMDB ID or Custom Original ID
 * @returns {Promise<string|null>} - The URL to the full movie file, or null if not found
 */
export const getFullMovieUrl = async (movieId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 1. Check if it's a Lumina Original
  const original = newToLuminaStreamPlus.find(m => m.id.toString() === movieId.toString());
  if (original && original.video_url) {
    return original.video_url;
  }

  // 2. Check if it's mapped in our local db
  if (localVideoDb[movieId.toString()]) {
    return localVideoDb[movieId.toString()];
  }
  
  return null;
};
