export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  poster_path: string;
}

export interface TmdbPaginatedResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}
