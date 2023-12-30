// .env file
VITE_APPWRITE_URL="https://cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID="658652e0631b9db465f1"
VITE_APPWRITE_DATABASE_ID="65865563cb728ff06586"
VITE_APPWRITE_POST_COLLECTION_ID="6586558af3613bdfde2c"
VITE_APPWRITE_USER_COLLECTION_ID="6587d9c0ac2856a15e2d"
VITE_APPWRITE_BUCKET_ID="6586565ded5b3856bebb"

// Q.jsx
import React, { useEffect, useState } from 'react';
import { Client } from 'appwrite';

const Q = () => {
  const [realtimeData, setRealtimeData] = useState(null);

  useEffect(() => {
    const client = new Client()
      .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
      .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

    client.setEndpointRealtime(import.meta.env.VITE_APPWRITE_URL.replace('https://', 'wss://') + '/realtime');

    const documentId = 'your-document-id';
    const collectionId = import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID; // Replace with the correct collection ID

    const unsubscribe = client.subscribe(`databases.default.collections.${collectionId}.documents.${documentId}`, (response) => {
      setRealtimeData(response.payload);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdate = async () => {
    try {
      const documentId = 'your-document-id';
      const collectionId = import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID; // Replace with the correct collection ID

      const updatedData = {
        key: 'new-value',
      };

      await client.database.updateDocument(collectionId, documentId, updatedData);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <div>
      <h1>Realtime Example</h1>
      {realtimeData && (
        <div>
          <h2>Real-time Data:</h2>
          <pre>{JSON.stringify(realtimeData, null, 2)}</pre>
        </div>
      )}

      <button onClick={handleUpdate}>Update Document</button>
    </div>
  );
};

export default Q;
