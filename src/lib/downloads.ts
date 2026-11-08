import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export type DownloadedBook = {
  key: string;
  title: string;
  author: string;
  coverUrl: string | null;
  localUri: string;
};

export async function getDownloads(): Promise<DownloadedBook[]> {
  const data = await AsyncStorage.getItem('@bookify_downloads');
  return data ? JSON.parse(data) : [];
}

export async function saveBookOffline(title: string, author: string, coverUrl: string | null, textUrl: string, key: string) {
  const fileUri = FileSystem.documentDirectory + `${key.replace(/\//g, '_')}.txt`;
  
  // Download the file
  const downloadRes = await FileSystem.downloadAsync(textUrl, fileUri);
  
  if (downloadRes.status !== 200) throw new Error('Download failed');

  const newBook: DownloadedBook = {
    key,
    title,
    author,
    coverUrl,
    localUri: downloadRes.uri
  };

  const existing = await getDownloads();
  // Don't duplicate
  if (!existing.find(b => b.key === key)) {
    await AsyncStorage.setItem('@bookify_downloads', JSON.stringify([newBook, ...existing]));
  }
  return newBook;
}

export async function removeDownload(key: string, localUri: string) {
  await FileSystem.deleteAsync(localUri, { idempotent: true });
  const existing = await getDownloads();
  const updated = existing.filter(b => b.key !== key);
  await AsyncStorage.setItem('@bookify_downloads', JSON.stringify(updated));
}
