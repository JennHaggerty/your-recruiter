export interface Note {
  content: string;
  _date: Date;
}
export default interface JobInterface extends Record<string, any> {
  _id: string;
  _userId?: string; //TODO make required when database updated
  role: string;
  company_name: string;
  posting_url: string;
  company_url?: string;
  location?: string;
  salary?: string;
  tools?: string;
  cover_letter_requirements?: string;
  stage?: string;
  notes?: Note[];
  followup_date?: string;
  cover_letter?: string;
  resume?: string;
  _markdown?: string;
  _date_modified?: Date;
  _date_added?: Date;
}
