
import {
  API
} from "../constants"

import {
  Utils
} from "../utils"

import {
  API
} from "../constants"

import {
  Utils
} from "../utils"

export class KnowledgeManagementClient {

  // Returns a URL from the API that allows one file upload to S3 with that exact filename
  async getUploadURL(fileName: string, fileType : string): Promise<string> {    
    if (!fileType) {
      alert('Must have valid file type!');
      return;
    }

    try {
      const auth = await Utils.authenticate();
      const response = await fetch(API + '/signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : auth
        },
        body: JSON.stringify({ fileName, fileType })
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const data = await response.json();
      return data.signedUrl;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Returns a list of documents in the S3 bucket (hard-coded on the backend)
  async getDocuments(continuationToken?: string, pageIndex?: number) {
    const auth = await Utils.authenticate();
    const response = await fetch(API + '/s3-bucket-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : auth
      },
      body: JSON.stringify({
        continuationToken: continuationToken,
        pageIndex: pageIndex,
      }),
    });

    const result = await response.json();
    return result;
  }

  // Deletes a given file on the S3 bucket (hardcoded on the backend!)
  async deleteFile(key : string) {
    const auth = await Utils.authenticate();
    await fetch(API + '/delete-s3-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : auth
      },
      body: JSON.stringify({
        KEY : key
      }),
    });
  }

  // Runs a sync job on Kendra (hardcoded datasource as well as index on the backend)
  async syncKendra() : Promise<string> {
    const auth = await Utils.authenticate();
    const response = await fetch(API + '/kendra-sync/sync-kendra', {headers: {
      'Content-Type': 'application/json',
      'Authorization' : auth
    }})
    return await response.json()
  }

  // Checks if Kendra is currently syncing (used to disable the sync button)
  async kendraIsSyncing() : Promise<string> {
    const auth = await Utils.authenticate();
    const response = await fetch(API + '/kendra-sync/still-syncing', {headers: {
      'Content-Type': 'application/json',
      'Authorization' : auth
    }})
    return await response.json()
  }
}
