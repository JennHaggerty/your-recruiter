export interface User {
  _id: string;
  email: string;
  password: string;
  _date_added: Date;
  name?: string;
  resume?: string;
  openai_key?: string;
  firecrawl_key?: string;
}
