export interface Show {
  id: string;
  title: string;
  host: string;
  thumbnail: string;
  description: string;
}

export interface Clip {
  id: string;
  title: string;
  showId: string;
  showTitle: string;
  host: string;
  thumbnail: string;
  mediaUrl: string;
  mediaType: "audio" | "video";
  duration: number; // seconds
  claim: string;
  quote: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  shows: Show[];
  clips: Clip[];
}
