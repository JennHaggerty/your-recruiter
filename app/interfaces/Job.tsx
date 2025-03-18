export interface Note {
  content: string;
  _date: Date;
}

export default interface Job extends Record<string, any> {
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
  automated_cover_letter?: string;
  _resume?: string;
  _markdown?: string;
  _date_modified?: Date;
  _date_added?: Date;
}
