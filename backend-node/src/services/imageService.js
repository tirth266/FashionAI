import path from 'path';

export const getImageUrl = (req, filename) => {
  if (!filename) return null;
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${filename}`;
};

export const deleteImage = async (filename) => {
    // Logic to delete from disk if needed
};
