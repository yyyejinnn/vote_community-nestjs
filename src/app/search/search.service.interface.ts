export interface SearchServiceInterface {
  searchByTag(tagName: string);
  sortVotes(sorting: string, order: 'asc' | 'desc');
}
