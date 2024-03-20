interface NewSeries {
    status: boolean;
    data: NewSeriesData;
    msg?: string;
    err?: string;
  }
  
  interface NewSeriesData {
    title: string;
    id: string;
    description: string;
    image: string;
    banner: string;
    rate: string;
    quality: string;
    type: string;
  }
  
  interface AllSeries {
    status: boolean;
    data: AllSeriesData[];
    msg?: string;
    err?: string;
  }
  
  interface AllSeriesData {
    name: string;
    id: string;
    image: string;
    date: string;
    rate: string;
    quality: string;
    category: string[];
    type: string;
    eCount: string;
  }
  
  interface Series {
    status: boolean;
    detail: SeriesData;
    episodes: Eps[];
    actors: Actor[];
    seasons?: Season[];
    msg?: string;
    err?: string;
  }

  export interface Seriestype {
    status?: boolean;
    detail: SeriesData;
    episodes: Eps[];
    actors: any[]; // You can replace 'any' with a specific type if needed for actors
    seasons?: Season[] | null;
    msg?: string;
    err?: string;
  }
  
  interface SeriesData {
    name: string;
    description: string;
    image: string;
    banner: string;
    session?: string;
    rate: string;
    quality: string;
    language: string;
    translate: string;
    year: string;
    country: string;
    category: string[];
  }
  
  interface Eps {
    id: num;
    name: string;
    cont: number;
    image: string;
    duration: string;
    downloads: Downloads[];

  }
  
  interface Season {
    id: string;
    name?: string;
    session?: string;
  }
  
  interface Actor {
    id: number;
    name: string;
    image: string;
  }
  
 

interface NewMovie {
  status: boolean;
  data: NewMovieData;
  msg?: string | null;
  err?: string | null;
}

interface NewMovieData {
  title: string;
  id: string;
  description: string;
  image: string;
  banner: string;
  rate: string;
  quality: string;
  type: string;
}

interface AllMovie {
  status: boolean;
  data: AllMovieData[];
  msg?: string | null;
  err?: string | null;
}

interface AllMovieData {
  name: string;
  id: string;
  image: string;
  date: string;
  rate: string;
  quality: string;
  category: string[];
  type: string; // Assuming type is a string in this case
}

interface MovieType {
  status: boolean;
  info: Info;
  actors: Actor[];
  downloads: Downloads[];
}

interface Actor {
  id: number;
  name: string;
  image: string;
}

interface Downloads {
  name: string;
  size: string;
  quality: string;
  id: number;
 
}

interface Info {
  title: string;
  image: string;
  description: string;
  rating: string;
  language: string;
  translate: string;
  quality: string;
  country: string;
  year: string;
  duration: string;
  category: string[];
  trailer: string;
}

interface EpisodeData {
  name: string;
  episode: string;
  image: string;
  duration: number;
}


interface EpisodeResponse {
  status: boolean;
  info: EpisodeData;
  downloads: Downloads[];
  msg?: string;
  err?: string;
}

class Episode {
  status: boolean;
  info: EpisodeData;
  downloads: Downloads[];
  msg?: string;
  err?: string;


}



  export {
    NewSeries,
    NewSeriesData,
    AllSeries,
    AllSeriesData,
    Series,
    SeriesData,
    Eps,
    Season,
    Actor,
    NewMovie,
    NewMovieData,
    AllMovie,
    AllMovieData,
    MovieType,
    Actor,
    Downloads,
    Info,
    EpisodeData,
    EpisodeResponse,
    Episode,
    SeriesData
  };