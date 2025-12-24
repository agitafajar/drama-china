export interface Drama {
  bookId: string;
  bookName: string;
  coverWap?: string;
  cover?: string;
  chapterCount: number;
  introduction: string;
  tags?: string[];
  rankVo?: {
    rankType: number;
    hotCode: string;
    sort: number;
  };
}

export interface DramaDetail extends Drama {
  // Add specific fields if any, otherwise it extends Drama
}

export interface Episode {
  chapterId: string;
  chapterIndex: number;
  isCharge: number;
  chapterName: string;
  cdnList: CdnInfo[];
}

export interface CdnInfo {
  cdnDomain: string;
  isDefault: number;
  videoPathList: VideoPath[];
}

export interface VideoPath {
  quality: number;
  videoPath: string;
}
