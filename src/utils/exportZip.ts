import JSZip from 'jszip';
import { ANDROID_FILES } from '../data/androidFilesData';

export async function downloadAndroidProjectZip(): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder('SyntecxHubNotes') || zip;

  // Add all files into the zip structure
  ANDROID_FILES.forEach(file => {
    // strip the 'android/' prefix if present
    const relativePath = file.path.replace(/^android\//, '');
    root.file(relativePath, file.content);
  });

  // Generate binary zip
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SyntecxHubNotes_AndroidStudio.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
