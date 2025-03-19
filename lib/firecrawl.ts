import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';
export const scrapeResponse = async (args: { url: string; apiKey: string }) => {
  const { url, apiKey } = args;
  const myApiKey = process.env.NEXT_PUBLIC_FIRECRAWL_KEY;
  if (!myApiKey && !apiKey) return;
  const theOneKey = myApiKey || apiKey;
  const app = new FirecrawlApp({ apiKey: theOneKey });
  const schema = z.object({
    posting_url: z.string(),
    role: z.string(),
    company_name: z.string(),
    company_url: z.string(),
    location: z.string(),
    remote: z.string(),
    salary: z.string(),
    tools: z.string(),
    cover_letter_requirements: z.string(),
    _markdown: z.string(),
  });
  try {
    const scrapeResult = await app.extract([url], {
      schema: schema,
      prompt:
        'Grab the markdown and url. What is the job role? Determine if the position is in office, remote, or hybrid. What is the pay? What are the tools? What does it say about a cover letter?s',
    });
    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`);
    }
    return scrapeResult.data;
  } catch (e) {
    console.log('Error crawling website, ', e);
  }
};
