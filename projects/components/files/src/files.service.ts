import { Injectable } from '@angular/core';
import {Filesystem, Directory, WriteFileResult, ReadFileResult, Encoding}  from '@capacitor/filesystem';

export const image_folder = 'images';

@Injectable()
export class FilesService {

  folders = [image_folder];
  appRootUri: string;

  constructor() {
    Filesystem.getUri({ path: '', directory: Directory.Data }).then(result => {
      this.appRootUri = `${result.uri.substring(0, result.uri.lastIndexOf('/'))}`;
      this.folders.forEach(folder => this.createFolder(`files/${folder}`));
    }).catch(err => console.error(err));
   }

  public getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.') + 1);
  }

  public getFile(fileUri: string, encoding = Encoding.UTF8): Promise<ReadFileResult> {
    return Filesystem.readFile({
      path: fileUri, encoding
    })
  }

  /**
   *
   * @param data a dataUri, octet-stream, preferably base64
   * @param filename 
   * @return
   */
  public async moveToDirectory(directory: string, filename: string, data: string): Promise<WriteFileResult> {
    const dirPath = this.createFolder(directory);
    return Filesystem.writeFile({
      path: dirPath + filename,
      data
    });
  }
  
  public createFolder(directory: string): string {
    const dirPath = `${this.appRootUri}/${directory}/`;
    try {
      Filesystem.mkdir({ path: dirPath });
    } catch (error) {
      if (error['message'] === 'Directory exists') {
        console.log('Skipping directory creation');
      } else {
        throw error;
      }
    }
    return dirPath;
  }

  public async saveToImageAppStorage(data: string, filename: string): Promise<WriteFileResult> {
    return Filesystem.writeFile({
      data,
      path: `${image_folder}/${filename}`,
      directory: Directory.Data
    })
  }
  public async saveToDeviceStorage(data: string, filename: string): Promise<WriteFileResult> {
    return Filesystem.writeFile({
      data,
      path: filename,
      directory: Directory.Documents
    })
  }

  public deleteFile(fileUri: string): Promise<void> {
    return Filesystem.deleteFile({
      path: fileUri
    })
  }
  /**
   * 
   * @param file zip file
   * @return 
   */
  /*async getFilesInZip(file: Uint8Array | ArrayBuffer | Blob , filter?: (relativePath: string, file: JSZip.JSZipObject) => boolean): Promise<JSZip.JSZipObject[]> {
    const files = await this._zip.loadAsync(file);
    filter = filter || (() => true);
    return Promise.all(files.filter(filter));
  }*/
}
