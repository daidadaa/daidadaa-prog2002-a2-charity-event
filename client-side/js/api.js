// Thin wrapper around fetch so every page handles API errors the same way.
const api = {
  async get(path) {
    const response = await fetch(path);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong. Please try again.');
    }
    return data;
  }
};
